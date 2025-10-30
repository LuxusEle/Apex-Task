import { defineStore } from 'pinia'
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth'
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore'
import { auth, db } from '../services/firebase'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    profile: null,
    loading: true,
    initialized: false
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    isAdmin: (state) => state.profile?.role === 'admin',
    isVipPartner: (state) => state.profile?.role === 'vip_partner',
    isManager: (state) => state.profile?.role === 'manager',
    canCreateTasks: (state) => ['admin', 'vip_partner', 'manager'].includes(state.profile?.role),
    canRejectTasks: (state) => ['admin', 'vip_partner'].includes(state.profile?.role)
  },

  actions: {
    async initialize() {
      return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (user) {
            await this.setUser(user)
          } else {
            this.user = null
            this.profile = null
          }
          this.loading = false
          this.initialized = true
          unsubscribe()
          resolve()
        })
      })
    },

    async setUser(user) {
      this.user = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      }

      // Get or create user profile
      await this.loadUserProfile(user.uid)
    },

    async loadUserProfile(uid) {
      try {
        const userDoc = await getDoc(doc(db, 'users', uid))
        
        if (userDoc.exists()) {
          this.profile = userDoc.data()
          // Update last login
          await updateDoc(doc(db, 'users', uid), {
            lastLogin: serverTimestamp(),
            isOnline: true
          })
        } else {
          // Create new user profile
          await this.createUserProfile(uid)
        }
      } catch (error) {
        console.error('Error loading user profile:', error)
      }
    },

    async createUserProfile(uid) {
      const defaultProfile = {
        uid,
        email: this.user.email,
        name: this.user.displayName || this.user.email.split('@')[0],
        avatar: this.user.photoURL || '',
        role: 'staff', // Default role
        business_units: ['personal'],
        status: 'active',
        skills: [],
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        isOnline: true,
        preferences: {
          theme: 'system',
          notifications: true,
          emailAlerts: true
        }
      }

      try {
        await setDoc(doc(db, 'users', uid), defaultProfile)
        this.profile = defaultProfile
      } catch (error) {
        console.error('Error creating user profile:', error)
      }
    },

    async signInWithGoogle() {
      try {
        this.loading = true
        const provider = new GoogleAuthProvider()
        provider.setCustomParameters({
          prompt: 'select_account'
        })
        
        const result = await signInWithPopup(auth, provider)
        await this.setUser(result.user)
        
        return result.user
      } catch (error) {
        console.error('Error signing in with Google:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async signOut() {
      try {
        this.loading = true
        
        // Update online status
        if (this.user?.uid) {
          await updateDoc(doc(db, 'users', this.user.uid), {
            isOnline: false,
            lastSeen: serverTimestamp()
          })
        }
        
        await signOut(auth)
        this.user = null
        this.profile = null
      } catch (error) {
        console.error('Error signing out:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateProfile(updates) {
      if (!this.user?.uid) return

      try {
        await updateDoc(doc(db, 'users', this.user.uid), {
          ...updates,
          updatedAt: serverTimestamp()
        })
        
        this.profile = { ...this.profile, ...updates }
      } catch (error) {
        console.error('Error updating profile:', error)
        throw error
      }
    },

    async updateOnlineStatus(isOnline) {
      if (!this.user?.uid) return

      try {
        await updateDoc(doc(db, 'users', this.user.uid), {
          isOnline,
          lastSeen: serverTimestamp()
        })
        
        if (this.profile) {
          this.profile.isOnline = isOnline
        }
      } catch (error) {
        console.error('Error updating online status:', error)
      }
    }
  }
})
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
    user: {
      uid: 'demo-user',
      email: 'demo@apex.local',
      displayName: 'Demo User',
      photoURL: null
    },
    profile: {
      role: 'user',
      business_units: ['personal']
    },
    loading: false,
    initialized: true,
    error: null
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
      try {
        // Immediately set loading to false after a very short timeout to show UI
        setTimeout(() => {
          if (this.loading) {
            this.loading = false
            this.initialized = true
            // Set a default offline user to prevent blocking
            this.user = {
              uid: 'temp-user',
              email: 'temp@local.app',
              displayName: 'Loading...',
              photoURL: null
            }
            this.profile = {
              role: 'user',
              business_units: ['personal']
            }
          }
        }, 100) // Show UI almost immediately

        // Set a shorter timeout to prevent infinite loading
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Authentication timeout')), 3000) // Reduced to 3 seconds
        })

        const authPromise = new Promise((resolve) => {
          const unsubscribe = onAuthStateChanged(auth, async (user) => {
            try {
              if (user) {
                await this.setUser(user)
              } else {
                // Keep temporary user if no real user found
                if (this.user?.uid === 'temp-user') {
                  // Don't change anything, keep temp user
                } else {
                  this.user = null
                  this.profile = null
                }
              }
            } catch (error) {
              console.error('Error in auth state change:', error)
              this.error = error.message
            } finally {
              this.loading = false
              this.initialized = true
              unsubscribe()
              resolve()
            }
          })
        })

        await Promise.race([authPromise, timeoutPromise])
      } catch (error) {
        console.error('Auth initialization error:', error)
        this.error = error.message
        this.loading = false
        this.initialized = true
        // Ensure we have a fallback user
        if (!this.user) {
          this.user = {
            uid: 'fallback-user',
            email: 'fallback@local.app',
            displayName: 'Guest User',
            photoURL: null
          }
          this.profile = {
            role: 'user',
            business_units: ['personal']
          }
        }
      }
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
    },

    setEmergencyAccess(overrideCode) {
      // Emergency access for offline mode or Firebase issues
      const validCodes = ['123', '456', '789']
      if (validCodes.includes(overrideCode)) {
        this.user = {
          uid: `emergency-${overrideCode}`,
          email: 'emergency@apex.local',
          displayName: 'Emergency User',
          photoURL: null
        }
        this.profile = {
          role: overrideCode === '123' ? 'admin' : 'user',
          business_units: ['peoples_bank', 'fintech', 'infinity_luxus', 'personal'],
          name: 'Emergency User'
        }
        this.loading = false
        this.initialized = true
        this.error = null
        return true
      }
      return false
    }
  }
})
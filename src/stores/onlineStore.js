import { defineStore } from 'pinia'
import { 
  doc, 
  updateDoc, 
  onSnapshot, 
  collection, 
  query, 
  where,
  addDoc,
  serverTimestamp,
  getDocs,
  getDoc
} from 'firebase/firestore'
import { httpsCallable } from 'firebase/functions'
import { db, functions } from '../services/firebase'

export const useOnlineStore = defineStore('online', {
  state: () => ({
    onlineUsers: new Map(),
    alertAttempts: new Map(),
    maxAlertAttempts: 50,
    userStatuses: new Map(),
    lastSeen: new Map()
  }),

  getters: {
    isUserOnline: (state) => (userId) => {
      return state.onlineUsers.get(userId) || false
    },

    getAlertCount: (state) => (userId) => {
      return state.alertAttempts.get(userId) || 0
    },

    getUserStatus: (state) => (userId) => {
      return state.userStatuses.get(userId) || 'offline'
    },

    getLastSeen: (state) => (userId) => {
      return state.lastSeen.get(userId)
    }
  },

  actions: {
    async setUserOnline(userId) {
      try {
        await updateDoc(doc(db, 'users', userId), {
          lastSeen: serverTimestamp(),
          isOnline: true
        })
        
        this.onlineUsers.set(userId, true)
        this.userStatuses.set(userId, 'online')
      } catch (error) {
        console.error('Error setting user online:', error)
      }
    },

    async setUserOffline(userId) {
      try {
        await updateDoc(doc(db, 'users', userId), {
          lastSeen: serverTimestamp(),
          isOnline: false
        })
        
        this.onlineUsers.set(userId, false)
        this.userStatuses.set(userId, 'offline')
      } catch (error) {
        console.error('Error setting user offline:', error)
      }
    },

    initializeOnlineTracking() {
      // Listen to online status changes
      const usersQuery = query(collection(db, 'users'))
      
      return onSnapshot(usersQuery, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'modified') {
            const userData = change.doc.data()
            const userId = change.doc.id
            
            this.onlineUsers.set(userId, userData.isOnline || false)
            this.userStatuses.set(userId, userData.isOnline ? 'online' : 'offline')
            
            if (userData.lastSeen) {
              this.lastSeen.set(userId, userData.lastSeen.toDate())
            }
          }
        })
      })
    },

    async alertOfflineUser(userId, taskId) {
      const currentAttempts = this.alertAttempts.get(userId) || 0
      
      if (currentAttempts >= this.maxAlertAttempts) {
        // Alert admin about persistent offline user
        await this.alertAdminAboutOfflineUser(userId, taskId, currentAttempts)
        return false
      }

      // Increment alert attempts
      this.alertAttempts.set(userId, currentAttempts + 1)

      try {
        // Send push notification
        await this.sendPushNotification(userId, {
          title: 'Urgent: New Task Assignment',
          body: 'You have been assigned a new task. Please log in to view details.',
          data: { taskId, type: 'task_assignment' }
        })

        // Send email notification
        await this.sendEmailAlert(userId, taskId)

        // Log alert attempt
        await addDoc(collection(db, 'alert_logs'), {
          userId,
          taskId,
          attemptNumber: currentAttempts + 1,
          type: 'offline_user_alert',
          timestamp: serverTimestamp()
        })

        return true
      } catch (error) {
        console.error('Error alerting offline user:', error)
        return false
      }
    },

    async alertAdminAboutOfflineUser(userId, taskId, attempts) {
      try {
        // Get user details
        const userDoc = await getDoc(doc(db, 'users', userId))
        const userName = userDoc.data()?.name || 'Unknown User'

        await addDoc(collection(db, 'admin_alerts'), {
          type: 'persistent_offline_user',
          title: `User Alert Limit Reached`,
          message: `User ${userName} (${userId}) has been alerted ${attempts} times for task ${taskId} but remains offline. Please intervene.`,
          priority: 'high',
          data: {
            userId,
            userName,
            taskId,
            totalAttempts: attempts
          },
          timestamp: serverTimestamp(),
          resolved: false
        })

        console.log(`Admin alerted about persistent offline user: ${userName}`)
      } catch (error) {
        console.error('Error alerting admin about offline user:', error)
      }
    },

    async sendPushNotification(userId, notification) {
      try {
        const userDoc = await getDoc(doc(db, 'users', userId))
        const fcmToken = userDoc.data()?.fcmToken

        if (fcmToken) {
          const sendNotification = httpsCallable(functions, 'sendPushNotification')
          await sendNotification({
            token: fcmToken,
            notification
          })
        }
      } catch (error) {
        console.error('Failed to send push notification:', error)
      }
    },

    async sendEmailAlert(userId, taskId) {
      try {
        const sendEmail = httpsCallable(functions, 'sendEmailAlert')
        await sendEmail({
          userId,
          taskId,
          type: 'task_assignment'
        })
      } catch (error) {
        console.error('Failed to send email alert:', error)
      }
    },

    async getOnlineUsersCount() {
      try {
        const q = query(
          collection(db, 'users'),
          where('isOnline', '==', true)
        )
        const snapshot = await getDocs(q)
        return snapshot.size
      } catch (error) {
        console.error('Error getting online users count:', error)
        return 0
      }
    },

    async getOfflineUsers() {
      try {
        const q = query(
          collection(db, 'users'),
          where('isOnline', '==', false),
          where('status', '==', 'active')
        )
        const snapshot = await getDocs(q)
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
      } catch (error) {
        console.error('Error getting offline users:', error)
        return []
      }
    },

    resetAlertAttempts(userId) {
      this.alertAttempts.delete(userId)
    },

    getUserActivityStatus(userId) {
      const isOnline = this.isUserOnline(userId)
      const lastSeen = this.getLastSeen(userId)
      
      if (isOnline) {
        return { status: 'online', text: 'Online now' }
      }
      
      if (!lastSeen) {
        return { status: 'unknown', text: 'Never seen' }
      }
      
      const now = new Date()
      const diffMinutes = Math.floor((now - lastSeen) / (1000 * 60))
      
      if (diffMinutes < 5) {
        return { status: 'recent', text: 'Just now' }
      } else if (diffMinutes < 60) {
        return { status: 'recent', text: `${diffMinutes}m ago` }
      } else if (diffMinutes < 1440) { // 24 hours
        const hours = Math.floor(diffMinutes / 60)
        return { status: 'away', text: `${hours}h ago` }
      } else {
        const days = Math.floor(diffMinutes / 1440)
        return { status: 'offline', text: `${days}d ago` }
      }
    },

    // Batch update online status for multiple users
    async batchUpdateOnlineStatus(userUpdates) {
      const batch = writeBatch(db)
      
      userUpdates.forEach(({ userId, isOnline }) => {
        const userRef = doc(db, 'users', userId)
        batch.update(userRef, {
          isOnline,
          lastSeen: serverTimestamp()
        })
        
        this.onlineUsers.set(userId, isOnline)
        this.userStatuses.set(userId, isOnline ? 'online' : 'offline')
      })
      
      try {
        await batch.commit()
      } catch (error) {
        console.error('Error batch updating online status:', error)
      }
    }
  }
})
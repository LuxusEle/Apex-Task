import { defineStore } from 'pinia'
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  doc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  getDocs,
  getDoc
} from 'firebase/firestore'
import { db } from '../services/firebase'
import { useAuthStore } from './authStore'

export const useTaskStore = defineStore('task', {
  state: () => ({
    tasks: [],
    myTasks: [],
    assignedTasks: [],
    loading: false,
    error: null,
    filters: {
      status: 'all',
      priority: 'all',
      business_unit: 'all',
      assigned_to: 'all'
    },
    unsubscribers: []
  }),

  getters: {
    filteredTasks: (state) => {
      let filtered = state.tasks

      if (state.filters.status !== 'all') {
        filtered = filtered.filter(task => task.status === state.filters.status)
      }

      if (state.filters.priority !== 'all') {
        filtered = filtered.filter(task => task.priority === state.filters.priority)
      }

      if (state.filters.business_unit !== 'all') {
        filtered = filtered.filter(task => task.business_unit === state.filters.business_unit)
      }

      if (state.filters.assigned_to !== 'all') {
        filtered = filtered.filter(task => task.assigned_to === state.filters.assigned_to)
      }

      return filtered
    },

    tasksByStatus: (state) => {
      return state.tasks.reduce((acc, task) => {
        acc[task.status] = (acc[task.status] || 0) + 1
        return acc
      }, {})
    },

    tasksByPriority: (state) => {
      return state.tasks.reduce((acc, task) => {
        acc[task.priority] = (acc[task.priority] || 0) + 1
        return acc
      }, {})
    },

    overdueTasks: (state) => {
      const now = new Date()
      return state.tasks.filter(task => 
        task.due_date && 
        new Date(task.due_date) < now && 
        !['completed', 'cancelled'].includes(task.status)
      )
    }
  },

  actions: {
    async createTask(taskData) {
      this.loading = true
      this.error = null

      try {
        const authStore = useAuthStore()
        
        const task = {
          ...taskData,
          created_by: authStore.user.uid,
          created_at: serverTimestamp(),
          status: 'draft',
          priority_score: this.calculatePriorityScore(taskData),
          estimated_completion: this.estimateCompletion(taskData)
        }

        const docRef = await addDoc(collection(db, 'tasks'), task)
        
        return { id: docRef.id, ...task }
      } catch (error) {
        this.error = error.message
        console.error('Error creating task:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateTask(taskId, updates) {
      try {
        await updateDoc(doc(db, 'tasks', taskId), {
          ...updates,
          updated_at: serverTimestamp()
        })
      } catch (error) {
        this.error = error.message
        console.error('Error updating task:', error)
        throw error
      }
    },

    async deleteTask(taskId) {
      try {
        await deleteDoc(doc(db, 'tasks', taskId))
      } catch (error) {
        this.error = error.message
        console.error('Error deleting task:', error)
        throw error
      }
    },

    async assignTask(taskId, assigneeId, reason = '') {
      const authStore = useAuthStore()

      try {
        await updateDoc(doc(db, 'tasks', taskId), {
          assigned_to: assigneeId,
          assigned_by: authStore.user.uid,
          assigned_at: serverTimestamp(),
          assignment_reason: reason,
          status: 'assigned'
        })

        // Send notification to assignee
        await this.sendTaskNotification(assigneeId, taskId, 'assigned')
      } catch (error) {
        this.error = error.message
        console.error('Error assigning task:', error)
        throw error
      }
    },

    async acceptTask(taskId) {
      const authStore = useAuthStore()

      try {
        await updateDoc(doc(db, 'tasks', taskId), {
          status: 'in_progress',
          accepted_at: serverTimestamp(),
          accepted_by: authStore.user.uid
        })
      } catch (error) {
        this.error = error.message
        console.error('Error accepting task:', error)
        throw error
      }
    },

    async rejectTask(taskId, reason = '') {
      const authStore = useAuthStore()

      try {
        // Create rejection record for AI validation
        const rejectionData = {
          taskId,
          rejectedBy: authStore.user.uid,
          userRole: authStore.profile.role,
          reason,
          timestamp: serverTimestamp(),
          status: 'pending_validation'
        }

        await addDoc(collection(db, 'task_rejections'), rejectionData)
      } catch (error) {
        this.error = error.message
        console.error('Error rejecting task:', error)
        throw error
      }
    },

    async completeTask(taskId, completionData = {}) {
      const authStore = useAuthStore()

      try {
        await updateDoc(doc(db, 'tasks', taskId), {
          status: 'completed',
          completed_at: serverTimestamp(),
          completed_by: authStore.user.uid,
          ...completionData
        })
      } catch (error) {
        this.error = error.message
        console.error('Error completing task:', error)
        throw error
      }
    },

    async requestTaskChange(taskId, reason, suggestedAssignee = null) {
      const authStore = useAuthStore()

      try {
        const changeRequest = {
          task_id: taskId,
          requested_by: authStore.user.uid,
          reason,
          suggested_assignee: suggestedAssignee,
          requested_at: serverTimestamp(),
          status: 'pending'
        }

        await addDoc(collection(db, 'task_change_requests'), changeRequest)
      } catch (error) {
        this.error = error.message
        console.error('Error requesting task change:', error)
        throw error
      }
    },

    async loadTasks(filters = {}) {
      this.loading = true
      this.error = null

      try {
        let q = query(collection(db, 'tasks'), orderBy('created_at', 'desc'))

        // Apply filters
        if (filters.business_unit) {
          q = query(q, where('business_unit', '==', filters.business_unit))
        }
        
        if (filters.assigned_to) {
          q = query(q, where('assigned_to', '==', filters.assigned_to))
        }

        const unsubscribe = onSnapshot(q, (snapshot) => {
          this.tasks = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            // Convert Firestore timestamps to JavaScript dates
            created_at: doc.data().created_at?.toDate(),
            updated_at: doc.data().updated_at?.toDate(),
            due_date: doc.data().due_date ? new Date(doc.data().due_date) : null
          }))
          this.loading = false
        })

        this.unsubscribers.push(unsubscribe)
      } catch (error) {
        this.error = error.message
        console.error('Error loading tasks:', error)
        this.loading = false
      }
    },

    async loadMyTasks() {
      const authStore = useAuthStore()
      if (!authStore.user) return

      try {
        const q = query(
          collection(db, 'tasks'),
          where('assigned_to', '==', authStore.user.uid),
          orderBy('created_at', 'desc')
        )

        const unsubscribe = onSnapshot(q, (snapshot) => {
          this.myTasks = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            created_at: doc.data().created_at?.toDate(),
            updated_at: doc.data().updated_at?.toDate(),
            due_date: doc.data().due_date ? new Date(doc.data().due_date) : null
          }))
        })

        this.unsubscribers.push(unsubscribe)
      } catch (error) {
        this.error = error.message
        console.error('Error loading my tasks:', error)
      }
    },

    async sendTaskNotification(userId, taskId, type) {
      try {
        const notification = {
          userId,
          taskId,
          type,
          timestamp: serverTimestamp(),
          read: false
        }

        await addDoc(collection(db, 'notifications'), notification)
      } catch (error) {
        console.error('Error sending notification:', error)
      }
    },

    async getAvailableUsers(businessUnit) {
      try {
        let q = query(
          collection(db, 'users'),
          where('status', '==', 'active')
        )

        if (businessUnit && businessUnit !== 'all') {
          q = query(q, where('business_units', 'array-contains', businessUnit))
        }

        const snapshot = await getDocs(q)
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
      } catch (error) {
        console.error('Error getting available users:', error)
        return []
      }
    },

    async getTeamMetrics() {
      try {
        const usersSnapshot = await getDocs(collection(db, 'users'))
        const tasksSnapshot = await getDocs(collection(db, 'tasks'))
        
        const totalUsers = usersSnapshot.size
        const totalTasks = tasksSnapshot.size
        const completedTasks = tasksSnapshot.docs.filter(
          doc => doc.data().status === 'completed'
        ).length

        return {
          totalUsers,
          totalTasks,
          completedTasks,
          avgCompletionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
        }
      } catch (error) {
        console.error('Error getting team metrics:', error)
        return {
          totalUsers: 0,
          totalTasks: 0,
          completedTasks: 0,
          avgCompletionRate: 0
        }
      }
    },

    calculatePriorityScore(task) {
      let score = 0

      // Business impact
      const businessWeights = {
        peoples_bank: 40,
        fintech: 35,
        infinity_luxus: 25,
        cabinetrix: 20,
        personal: 15
      }

      score += businessWeights[task.business_unit] || 10

      // Urgency
      const urgencyWeights = {
        critical: 50,
        high: 35,
        medium: 20,
        low: 10
      }

      score += urgencyWeights[task.priority] || 10

      // Deadline proximity
      if (task.due_date) {
        const daysUntilDue = Math.ceil(
          (new Date(task.due_date) - new Date()) / (1000 * 60 * 60 * 24)
        )
        if (daysUntilDue <= 1) score += 30
        else if (daysUntilDue <= 3) score += 20
        else if (daysUntilDue <= 7) score += 10
      }

      return Math.min(score, 100)
    },

    estimateCompletion(task) {
      const baseHours = {
        simple: 2,
        medium: 8,
        complex: 24,
        project: 80
      }

      return baseHours[task.complexity] || 8
    },

    setFilters(newFilters) {
      this.filters = { ...this.filters, ...newFilters }
    },

    clearError() {
      this.error = null
    },

    cleanup() {
      // Unsubscribe from all listeners
      this.unsubscribers.forEach(unsubscribe => unsubscribe())
      this.unsubscribers = []
    }
  }
})
<template>
  <div class="notification-container">
    <!-- Toast Notifications -->
    <transition-group
      name="notification"
      tag="div"
      class="fixed top-4 right-4 z-50 space-y-2"
    >
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="[
          'notification-toast',
          `notification-${notification.type}`
        ]"
      >
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <!-- Success Icon -->
            <svg v-if="notification.type === 'success'" class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <!-- Error Icon -->
            <svg v-else-if="notification.type === 'error'" class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
            <!-- Warning Icon -->
            <svg v-else-if="notification.type === 'warning'" class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
            <!-- Info Icon -->
            <svg v-else class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          
          <div class="ml-3 flex-1">
            <p v-if="notification.title" class="text-sm font-medium">{{ notification.title }}</p>
            <p class="text-sm" :class="notification.title ? 'text-gray-500 dark:text-gray-400' : ''">{{ notification.message }}</p>
          </div>
          
          <div class="ml-4 flex-shrink-0 flex">
            <button
              @click="dismissNotification(notification.id)"
              class="inline-flex text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Progress bar for auto-dismiss -->
        <div v-if="notification.autoDismiss" class="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
          <div 
            class="bg-current h-1 rounded-full transition-all duration-100 ease-linear"
            :style="{ width: `${notification.progress}%` }"
          ></div>
        </div>
      </div>
    </transition-group>

    <!-- System Status Notifications -->
    <div v-if="systemNotifications.length > 0" class="fixed bottom-4 left-4 z-50">
      <div
        v-for="notification in systemNotifications"
        :key="notification.id"
        class="mb-2 p-4 bg-blue-600 text-white rounded-lg shadow-lg max-w-sm"
      >
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg v-if="notification.type === 'online'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"></path>
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium">{{ notification.title }}</p>
            <p class="text-sm opacity-90">{{ notification.message }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Task Assignment Notifications -->
    <div v-if="taskNotifications.length > 0" class="fixed top-1/2 right-4 transform -translate-y-1/2 z-50">
      <div
        v-for="notification in taskNotifications"
        :key="notification.id"
        class="mb-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl max-w-sm"
      >
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
              <svg class="w-4 h-4 text-primary-600 dark:text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
          </div>
          <div class="ml-3 flex-1">
            <p class="text-sm font-medium text-gray-900 dark:text-white">{{ notification.title }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">{{ notification.message }}</p>
            <div class="mt-3 flex space-x-3">
              <button
                @click="handleTaskAction(notification, 'accept')"
                class="text-xs bg-primary-600 text-white px-3 py-1 rounded hover:bg-primary-700 transition-colors"
              >
                Accept
              </button>
              <button
                @click="handleTaskAction(notification, 'view')"
                class="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                View Details
              </button>
              <button
                @click="dismissTaskNotification(notification.id)"
                class="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const notifications = reactive([])
const systemNotifications = reactive([])
const taskNotifications = reactive([])

let notificationId = 1

// Main notification methods
const showNotification = (type, message, title = null, options = {}) => {
  const notification = {
    id: notificationId++,
    type,
    title,
    message,
    autoDismiss: options.autoDismiss !== false,
    duration: options.duration || 5000,
    progress: 100,
    ...options
  }

  notifications.push(notification)

  if (notification.autoDismiss) {
    startAutoDismiss(notification)
  }

  return notification.id
}

const startAutoDismiss = (notification) => {
  const interval = 50 // Update every 50ms
  const step = (interval / notification.duration) * 100

  const timer = setInterval(() => {
    notification.progress -= step
    if (notification.progress <= 0) {
      clearInterval(timer)
      dismissNotification(notification.id)
    }
  }, interval)
}

const dismissNotification = (id) => {
  const index = notifications.findIndex(n => n.id === id)
  if (index > -1) {
    notifications.splice(index, 1)
  }
}

const showSystemNotification = (type, title, message) => {
  const notification = {
    id: notificationId++,
    type,
    title,
    message
  }

  systemNotifications.push(notification)

  // Auto dismiss system notifications after 3 seconds
  setTimeout(() => {
    const index = systemNotifications.findIndex(n => n.id === notification.id)
    if (index > -1) {
      systemNotifications.splice(index, 1)
    }
  }, 3000)
}

const showTaskNotification = (taskData) => {
  const notification = {
    id: notificationId++,
    title: 'New Task Assigned',
    message: `You have been assigned: "${taskData.title}"`,
    taskId: taskData.id,
    priority: taskData.priority
  }

  taskNotifications.push(notification)
}

const handleTaskAction = (notification, action) => {
  if (action === 'accept') {
    // Accept the task
    console.log('Accepting task:', notification.taskId)
    showNotification('success', 'Task accepted successfully')
  } else if (action === 'view') {
    // Navigate to task details
    router.push(`/tasks/${notification.taskId}`)
  }
  
  dismissTaskNotification(notification.id)
}

const dismissTaskNotification = (id) => {
  const index = taskNotifications.findIndex(n => n.id === id)
  if (index > -1) {
    taskNotifications.splice(index, 1)
  }
}

// Global notification service
const notificationService = {
  success: (message, title, options) => showNotification('success', message, title, options),
  error: (message, title, options) => showNotification('error', message, title, options),
  warning: (message, title, options) => showNotification('warning', message, title, options),
  info: (message, title, options) => showNotification('info', message, title, options),
  system: showSystemNotification,
  task: showTaskNotification,
  dismiss: dismissNotification
}

// WebSocket connection status simulation
const simulateConnectionStatus = () => {
  let isOnline = true
  
  setInterval(() => {
    if (Math.random() < 0.1) { // 10% chance every 30 seconds
      if (isOnline) {
        isOnline = false
        showSystemNotification('offline', 'Connection Lost', 'Reconnecting...')
        
        // Simulate reconnection after 2-5 seconds
        setTimeout(() => {
          isOnline = true
          showSystemNotification('online', 'Connected', 'Back online')
        }, Math.random() * 3000 + 2000)
      }
    }
  }, 30000)
}

// Browser notification permission
const requestNotificationPermission = async () => {
  if ('Notification' in window && Notification.permission === 'default') {
    await Notification.requestPermission()
  }
}

// Send browser notification
const sendBrowserNotification = (title, message, options = {}) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    const notification = new Notification(title, {
      body: message,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      ...options
    })

    notification.onclick = () => {
      window.focus()
      notification.close()
    }

    // Auto close after 5 seconds
    setTimeout(() => notification.close(), 5000)
  }
}

// Global access
if (typeof window !== 'undefined') {
  window.$notify = notificationService
}

// Provide to composition API
const provide = (key, value) => {
  // This would be used with Vue's provide/inject in a real app
  window[key] = value
}

provide('$notify', notificationService)

onMounted(() => {
  requestNotificationPermission()
  simulateConnectionStatus()
  
  // Demo notifications (remove in production)
  setTimeout(() => {
    showNotification('info', 'Welcome to Apex Task Manager!', 'Getting Started')
  }, 1000)
})

// Cleanup
onBeforeUnmount(() => {
  notifications.length = 0
  systemNotifications.length = 0
  taskNotifications.length = 0
})

// Expose methods for external use
defineExpose({
  showNotification,
  showSystemNotification,
  showTaskNotification,
  dismissNotification,
  sendBrowserNotification
})
</script>

<style scoped>
.notification-toast {
  @apply max-w-sm w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden;
}

.notification-success {
  @apply border-l-4 border-green-400;
}

.notification-error {
  @apply border-l-4 border-red-400;
}

.notification-warning {
  @apply border-l-4 border-yellow-400;
}

.notification-info {
  @apply border-l-4 border-blue-400;
}

.notification-toast {
  padding: 1rem;
}

/* Transition animations */
.notification-enter-active {
  transition: all 0.3s ease-out;
}

.notification-leave-active {
  transition: all 0.3s ease-in;
}

.notification-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.notification-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.notification-move {
  transition: transform 0.3s ease;
}
</style>
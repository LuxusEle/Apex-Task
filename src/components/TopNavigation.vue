<template>
  <header class="top-navigation">
    <div class="flex items-center justify-between h-16 px-6">
      <!-- Mobile menu button -->
      <button
        @click="$emit('toggle-sidebar')"
        class="lg:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>

      <!-- Search Bar -->
      <div class="flex-1 max-w-lg mx-4">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <input
            v-model="searchQuery"
            @keyup.enter="performSearch"
            @input="onSearchInput"
            type="text"
            placeholder="Search tasks, people, or content..."
            class="input-field pl-10 py-2"
          />
          <!-- Search Results Dropdown -->
          <div v-if="showSearchResults && searchResults.length > 0" class="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
            <div class="max-h-96 overflow-y-auto">
              <div v-for="result in searchResults" :key="result.id" @click="selectSearchResult(result)" class="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <svg v-if="result.type === 'task'" class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                    <svg v-else-if="result.type === 'person'" class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                  <div class="ml-3 flex-1">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">{{ result.title }}</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ result.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right side actions -->
      <div class="flex items-center space-x-4">
        <!-- AI Assistant Toggle -->
        <button
          @click="toggleAIAssistant"
          class="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
          title="AI Assistant"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
          </svg>
          <span v-if="hasAINotification" class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
        </button>

        <!-- Notifications -->
        <div class="relative">
          <button
            @click="toggleNotifications"
            class="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
            title="Notifications"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5-5V9a7 7 0 10-14 0v3l-5 5h5m14 0v1a3 3 0 01-3 3H9a3 3 0 01-3-3v-1m14 0H3"></path>
            </svg>
            <span v-if="unreadNotifications > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {{ unreadNotifications > 9 ? '9+' : unreadNotifications }}
            </span>
          </button>

          <!-- Notifications Dropdown -->
          <div v-if="showNotifications" class="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
            <div class="p-4 border-b border-gray-200 dark:border-gray-700">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">Notifications</h3>
                <button v-if="unreadNotifications > 0" @click="markAllAsRead" class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-200">
                  Mark all read
                </button>
              </div>
            </div>
            <div class="max-h-96 overflow-y-auto">
              <div v-if="notifications.length === 0" class="p-4 text-center text-gray-500 dark:text-gray-400">
                No notifications
              </div>
              <div v-else>
                <div v-for="notification in notifications" :key="notification.id" @click="handleNotificationClick(notification)" class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                  <div class="flex items-start">
                    <div class="flex-shrink-0">
                      <div :class="['w-2 h-2 rounded-full mt-2', notification.read ? 'bg-gray-300' : 'bg-blue-500']"></div>
                    </div>
                    <div class="ml-3 flex-1">
                      <p class="text-sm font-medium text-gray-900 dark:text-white">{{ notification.title }}</p>
                      <p class="text-sm text-gray-500 dark:text-gray-400">{{ notification.message }}</p>
                      <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">{{ formatNotificationTime(notification.timestamp) }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="relative">
          <button
            @click="toggleQuickActions"
            class="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Quick Actions"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
          </button>

          <!-- Quick Actions Dropdown -->
          <div v-if="showQuickActions" class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
            <div class="py-1">
              <router-link v-if="authStore.canCreateTasks" to="/create-task" @click="showQuickActions = false" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                Create Task
              </router-link>
              <button @click="exportData" class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                Export Data
              </button>
              <button @click="openKeyboardShortcuts" class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                Keyboard Shortcuts
              </button>
            </div>
          </div>
        </div>

        <!-- Theme Toggle -->
        <button
          @click="toggleTheme"
          class="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="Toggle Theme"
        >
          <svg v-if="isDark" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
          </svg>
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
          </svg>
        </button>

        <!-- User Menu -->
        <div class="relative">
          <button
            @click="toggleUserMenu"
            class="flex items-center p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <img
              :src="authStore.user?.photoURL || defaultAvatar"
              :alt="authStore.user?.displayName"
              class="w-8 h-8 rounded-full"
            />
          </button>

          <!-- User Menu Dropdown -->
          <div v-if="showUserMenu" class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
            <div class="py-1">
              <div class="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ authStore.user?.displayName }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ authStore.user?.email }}</p>
              </div>
              <router-link to="/profile" @click="showUserMenu = false" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                Profile
              </router-link>
              <router-link to="/settings" @click="showUserMenu = false" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                Settings
              </router-link>
              <button @click="signOut" class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

defineEmits(['toggle-sidebar'])

const router = useRouter()
const authStore = useAuthStore()

const searchQuery = ref('')
const showSearchResults = ref(false)
const showNotifications = ref(false)
const showQuickActions = ref(false)
const showUserMenu = ref(false)
const isDark = ref(false)
const hasAINotification = ref(true)
const unreadNotifications = ref(3)

const searchResults = ref([])
const notifications = ref([
  {
    id: 1,
    title: 'New task assigned',
    message: 'You have been assigned to "Update financial reports"',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    read: false,
    type: 'task'
  },
  {
    id: 2,
    title: 'Task completed',
    message: 'Sarah completed "Review Q3 analytics"',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: false,
    type: 'completion'
  },
  {
    id: 3,
    title: 'Due date reminder',
    message: 'Task "Prepare presentation" is due tomorrow',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
    read: true,
    type: 'reminder'
  }
])

const defaultAvatar = computed(() => {
  const name = authStore.user?.displayName || 'User'
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&size=32`
})

const onSearchInput = async () => {
  if (searchQuery.value.length > 2) {
    // Simulate search results
    searchResults.value = [
      {
        id: 1,
        type: 'task',
        title: 'Update financial reports',
        description: 'PeoplesBank - High priority'
      },
      {
        id: 2,
        type: 'person',
        title: 'John Doe',
        description: 'CEO - Available for consultation'
      }
    ]
    showSearchResults.value = true
  } else {
    showSearchResults.value = false
  }
}

const performSearch = () => {
  if (searchQuery.value.trim()) {
    router.push(`/tasks?search=${encodeURIComponent(searchQuery.value)}`)
    showSearchResults.value = false
  }
}

const selectSearchResult = (result) => {
  if (result.type === 'task') {
    router.push(`/tasks/${result.id}`)
  } else if (result.type === 'person') {
    router.push(`/team/${result.id}`)
  }
  showSearchResults.value = false
  searchQuery.value = ''
}

const toggleAIAssistant = () => {
  // Toggle AI assistant chat
  hasAINotification.value = false
  // Emit event to parent to show AI chat
  console.log('Toggle AI assistant')
}

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
  showQuickActions.value = false
  showUserMenu.value = false
}

const toggleQuickActions = () => {
  showQuickActions.value = !showQuickActions.value
  showNotifications.value = false
  showUserMenu.value = false
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
  showNotifications.value = false
  showQuickActions.value = false
}

const markAllAsRead = () => {
  notifications.value.forEach(n => n.read = true)
  unreadNotifications.value = 0
}

const handleNotificationClick = (notification) => {
  notification.read = true
  unreadNotifications.value = Math.max(0, unreadNotifications.value - 1)
  
  // Navigate based on notification type
  if (notification.type === 'task') {
    router.push('/my-tasks')
  }
  showNotifications.value = false
}

const formatNotificationTime = (timestamp) => {
  const now = new Date()
  const diff = now - timestamp

  if (diff < 1000 * 60) return 'Just now'
  if (diff < 1000 * 60 * 60) return `${Math.floor(diff / (1000 * 60))}m ago`
  if (diff < 1000 * 60 * 60 * 24) return `${Math.floor(diff / (1000 * 60 * 60))}h ago`
  return timestamp.toLocaleDateString()
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

const exportData = () => {
  console.log('Export data')
  showQuickActions.value = false
}

const openKeyboardShortcuts = () => {
  console.log('Open keyboard shortcuts')
  showQuickActions.value = false
}

const signOut = async () => {
  try {
    await authStore.signOut()
    router.push('/login')
  } catch (error) {
    console.error('Error signing out:', error)
  }
  showUserMenu.value = false
}

const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    showSearchResults.value = false
    showNotifications.value = false
    showQuickActions.value = false
    showUserMenu.value = false
  }
}

onMounted(() => {
  // Load theme preference
  const savedTheme = localStorage.getItem('theme')
  isDark.value = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)
  document.documentElement.classList.toggle('dark', isDark.value)

  // Add click outside listener
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
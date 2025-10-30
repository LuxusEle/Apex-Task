<template>
  <div id="app" :class="{ 'dark': isDark }" class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <!-- Error Screen -->
    <div v-if="authStore.error && !authStore.initialized" class="fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center z-50">
      <div class="text-center max-w-md p-6">
        <div class="w-16 h-16 mx-auto mb-4 text-red-500">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Connection Error</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-4">{{ authStore.error }}</p>
        <button @click="retryConnection" class="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors">
          Retry Connection
        </button>
        <button @click="continueOffline" class="ml-2 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors">
          Continue Offline
        </button>
      </div>
    </div>

    <!-- Loading Screen -->
    <div v-else-if="authStore.loading && !fastLoadComplete" class="fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center z-50">
      <div class="text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-4 mx-auto"></div>
        <p class="text-gray-600 dark:text-gray-300 text-sm">Loading...</p>
      </div>
    </div>

    <!-- Authentication Required -->
    <div v-else-if="!authStore.isAuthenticated" class="min-h-screen flex items-center justify-center bg-gradient-primary">
      <LoginScreen />
    </div>

    <!-- Main Application -->
    <div v-else class="flex h-screen">
      <!-- Sidebar -->
      <aside :class="[
        'bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300',
        sidebarCollapsed ? 'w-16' : 'w-64'
      ]">
        <Sidebar :collapsed="sidebarCollapsed" @toggle="toggleSidebar" />
      </aside>

      <!-- Main Content Area -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Top Navigation -->
        <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <TopNavigation />
        </header>

        <!-- Page Content -->
        <main class="flex-1 overflow-auto p-6">
          <router-view />
        </main>
      </div>

      <!-- AI Assistant Chat (Floating) -->
      <Teleport to="body">
        <div v-if="showAIChat" class="fixed bottom-4 right-4 w-80 h-96 z-40">
          <AIAssistantChat @close="showAIChat = false" />
        </div>
      </Teleport>

      <!-- AI Assistant Toggle Button -->
      <button 
        @click="showAIChat = !showAIChat"
        class="fixed bottom-4 right-4 bg-gradient-primary text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-30"
        :class="{ 'mr-84': showAIChat }"
      >
        <SparklesIcon class="w-6 h-6" />
      </button>
    </div>

    <!-- Global Notifications -->
    <NotificationContainer />

    <!-- Mobile Menu Overlay -->
    <div 
      v-if="showMobileMenu" 
      @click="showMobileMenu = false"
      class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
    >
      <div class="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800">
        <Sidebar :collapsed="false" @toggle="showMobileMenu = false" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from './stores/authStore'
import { useOnlineStore } from './stores/onlineStore'

// Components (lazy loaded to improve performance)
import LoginScreen from './views/LoginScreen.vue'
import Sidebar from './components/Sidebar.vue'
import TopNavigation from './components/TopNavigation.vue'
import AIAssistantChat from './components/AIAssistantChat.vue'
import NotificationContainer from './components/NotificationContainer.vue'

// Stores
const authStore = useAuthStore()
const onlineStore = useOnlineStore()

// Reactive state
const sidebarCollapsed = ref(false)
const showAIChat = ref(false)
const showMobileMenu = ref(false)
const isDark = ref(false)
const fastLoadComplete = ref(false)

// Computed
const isMobile = computed(() => window.innerWidth < 1024)

// Methods
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

const retryConnection = async () => {
  authStore.error = null
  authStore.loading = true
  authStore.initialized = false
  try {
    await authStore.initialize()
  } catch (error) {
    console.error('Retry failed:', error)
  }
}

const continueOffline = () => {
  authStore.error = null
  authStore.loading = false
  authStore.initialized = true
  // Set user to a guest state for offline mode
  authStore.user = {
    uid: 'offline-user',
    email: 'offline@local.app',
    displayName: 'Offline User',
    photoURL: null
  }
  authStore.profile = {
    role: 'user',
    business_units: ['personal']
  }
}

const initializeTheme = () => {
  const savedTheme = localStorage.getItem('theme')
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  
  if (savedTheme === 'dark' || (!savedTheme && systemDark)) {
    isDark.value = true
    document.documentElement.classList.add('dark')
  } else {
    isDark.value = false
    document.documentElement.classList.remove('dark')
  }
}

const handleResize = () => {
  if (window.innerWidth < 1024) {
    sidebarCollapsed.value = true
  } else {
    sidebarCollapsed.value = false
  }
}

const handleOnlineStatus = () => {
  if (authStore.isAuthenticated) {
    if (navigator.onLine) {
      onlineStore.setUserOnline(authStore.user.uid)
    } else {
      onlineStore.setUserOffline(authStore.user.uid)
    }
  }
}

// Lifecycle
onMounted(async () => {
  // Show app immediately after 200ms regardless of auth status
  setTimeout(() => {
    fastLoadComplete.value = true
  }, 200)
  
  // Initialize theme immediately (non-blocking)
  initializeTheme()
  
  // Add immediate responsive check (non-blocking)
  handleResize()
  
  // Add event listeners immediately
  window.addEventListener('resize', handleResize)
  window.addEventListener('online', handleOnlineStatus)
  window.addEventListener('offline', handleOnlineStatus)
  
  // Initialize authentication asynchronously without blocking UI
  setTimeout(async () => {
    try {
      await authStore.initialize()
    } catch (error) {
      console.error('Failed to initialize auth:', error)
      // Auto-continue offline after a shorter timeout
      setTimeout(() => {
        if (authStore.loading && !authStore.initialized) {
          continueOffline()
        }
      }, 5000) // Reduced to 5 seconds
    }
    
    // Initialize online tracking if authenticated (non-blocking)
    if (authStore.isAuthenticated) {
      try {
        await onlineStore.initializeOnlineTracking()
        onlineStore.setUserOnline(authStore.user.uid)
      } catch (error) {
        console.warn('Online tracking failed:', error)
      }
    }
  }, 0) // Run immediately but asynchronously
})

onUnmounted(() => {
  // Cleanup
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('online', handleOnlineStatus)
  window.removeEventListener('offline', handleOnlineStatus)
  
  // Set user offline when leaving
  if (authStore.isAuthenticated) {
    onlineStore.setUserOffline(authStore.user.uid)
  }
})
</script>

<style scoped>
#app {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

.gradient-primary {
  background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
}

@media (max-width: 1023px) {
  .mr-84 {
    margin-right: 21rem;
  }
}
</style>
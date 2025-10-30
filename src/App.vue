<template>
  <div id="app" :class="{ 'dark': isDark }" class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <!-- Loading Screen -->
    <div v-if="authStore.loading" class="fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center z-50">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
        <p class="text-gray-600 dark:text-gray-300">Loading Apex Task Manager...</p>
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
import { SparklesIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from './stores/authStore'
import { useOnlineStore } from './stores/onlineStore'

// Components
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

// Computed
const isMobile = computed(() => window.innerWidth < 1024)

// Methods
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
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
  // Initialize theme
  initializeTheme()
  
  // Initialize authentication
  await authStore.initialize()
  
  // Initialize online tracking if authenticated
  if (authStore.isAuthenticated) {
    onlineStore.initializeOnlineTracking()
    onlineStore.setUserOnline(authStore.user.uid)
  }
  
  // Event listeners
  window.addEventListener('resize', handleResize)
  window.addEventListener('online', handleOnlineStatus)
  window.addEventListener('offline', handleOnlineStatus)
  
  // Initial responsive check
  handleResize()
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
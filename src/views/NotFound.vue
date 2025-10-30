<template>
  <div class="not-found">
    <div class="min-h-screen flex items-center justify-center">
      <div class="max-w-md w-full text-center">
        <!-- 404 Illustration -->
        <div class="mb-8">
          <svg class="mx-auto h-48 w-48 text-gray-400 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-3-4.5v.01M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"></path>
          </svg>
        </div>

        <!-- Error Message -->
        <div class="mb-8">
          <h1 class="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
          <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Page Not Found</h2>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <!-- Suggested Actions -->
        <div class="space-y-4">
          <div class="grid grid-cols-1 gap-3">
            <router-link 
              to="/dashboard" 
              class="btn-primary w-full"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              Back to Dashboard
            </router-link>
            
            <button 
              @click="goBack" 
              class="btn-secondary w-full"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Go Back
            </button>
          </div>

          <!-- Quick Links -->
          <div class="mt-8">
            <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-4">Quick Links</h3>
            <div class="grid grid-cols-2 gap-3">
              <router-link 
                to="/tasks" 
                class="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-200 text-sm transition-colors"
              >
                All Tasks
              </router-link>
              <router-link 
                to="/my-tasks" 
                class="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-200 text-sm transition-colors"
              >
                My Tasks
              </router-link>
              <router-link 
                to="/create-task" 
                class="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-200 text-sm transition-colors"
              >
                Create Task
              </router-link>
              <router-link 
                to="/analytics" 
                class="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-200 text-sm transition-colors"
              >
                Analytics
              </router-link>
            </div>
          </div>

          <!-- Search -->
          <div class="mt-8">
            <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-4">Search</h3>
            <div class="relative">
              <input
                v-model="searchQuery"
                @keyup.enter="performSearch"
                type="text"
                placeholder="Search for tasks, people, or content..."
                class="input-field pl-10"
              />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
          </div>

          <!-- Help Contact -->
          <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Still can't find what you're looking for?
            </p>
            <button 
              @click="contactSupport" 
              class="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-200 text-sm font-medium transition-colors"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')

const goBack = () => {
  // Check if there's history to go back to
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/dashboard')
  }
}

const performSearch = () => {
  if (searchQuery.value.trim()) {
    // In a real app, this would perform a search and redirect to results
    console.log('Searching for:', searchQuery.value)
    // For now, we'll redirect to tasks with a search parameter
    router.push(`/tasks?search=${encodeURIComponent(searchQuery.value)}`)
  }
}

const contactSupport = () => {
  // In a real app, this would open a support chat or contact form
  alert('Support contact would be opened here')
}
</script>
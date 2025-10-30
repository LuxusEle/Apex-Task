<template>
  <div class="sidebar">
    <!-- Logo -->
    <div class="p-6 border-b border-gray-200 dark:border-gray-700">
      <router-link to="/dashboard" class="flex items-center">
        <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mr-3">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
        </div>
        <span class="text-xl font-bold text-gray-900 dark:text-white">Apex</span>
      </router-link>
    </div>

    <!-- Navigation -->
    <nav class="mt-6 px-3">
      <div class="space-y-1">
        <!-- Dashboard -->
        <router-link
          to="/dashboard"
          v-slot="{ isActive }"
          class="navigation-item"
          :class="{ 'navigation-item-active': isActive }"
        >
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
          </svg>
          Dashboard
        </router-link>

        <!-- Tasks Section -->
        <div class="pt-4">
          <p class="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Tasks
          </p>
          <div class="mt-2 space-y-1">
            <router-link
              to="/tasks"
              v-slot="{ isActive }"
              class="navigation-item"
              :class="{ 'navigation-item-active': isActive }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
              All Tasks
              <span v-if="taskCounts.total > 0" class="ml-auto bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full text-xs">
                {{ taskCounts.total }}
              </span>
            </router-link>

            <router-link
              to="/my-tasks"
              v-slot="{ isActive }"
              class="navigation-item"
              :class="{ 'navigation-item-active': isActive }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              My Tasks
              <span v-if="taskCounts.myTasks > 0" class="ml-auto bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 px-2 py-0.5 rounded-full text-xs">
                {{ taskCounts.myTasks }}
              </span>
            </router-link>

            <router-link
              to="/create-task"
              v-slot="{ isActive }"
              class="navigation-item"
              :class="{ 'navigation-item-active': isActive }"
              v-if="authStore.canCreateTasks"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Create Task
            </router-link>
          </div>
        </div>

        <!-- Business Units -->
        <div class="pt-4">
          <p class="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Business Units
          </p>
          <div class="mt-2 space-y-1">
            <button
              v-for="unit in businessUnits"
              :key="unit.id"
              @click="filterByBusinessUnit(unit.id)"
              class="navigation-item w-full text-left"
              :class="{ 'navigation-item-active': selectedBusinessUnit === unit.id }"
            >
              <div :class="['w-3 h-3 rounded-full mr-3', unit.color]"></div>
              {{ unit.name }}
              <span v-if="unit.taskCount > 0" class="ml-auto bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full text-xs">
                {{ unit.taskCount }}
              </span>
            </button>
          </div>
        </div>

        <!-- Analytics & Reports -->
        <div class="pt-4">
          <p class="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Analytics
          </p>
          <div class="mt-2 space-y-1">
            <router-link
              to="/analytics"
              v-slot="{ isActive }"
              class="navigation-item"
              :class="{ 'navigation-item-active': isActive }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              Analytics
            </router-link>
          </div>
        </div>

        <!-- Team Management -->
        <div class="pt-4" v-if="authStore.canManageTeam">
          <p class="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Management
          </p>
          <div class="mt-2 space-y-1">
            <router-link
              to="/team"
              v-slot="{ isActive }"
              class="navigation-item"
              :class="{ 'navigation-item-active': isActive }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              Team
              <span v-if="teamCount > 0" class="ml-auto bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full text-xs">
                {{ teamCount }}
              </span>
            </router-link>
          </div>
        </div>

        <!-- Settings -->
        <div class="pt-4">
          <p class="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Account
          </p>
          <div class="mt-2 space-y-1">
            <router-link
              to="/profile"
              v-slot="{ isActive }"
              class="navigation-item"
              :class="{ 'navigation-item-active': isActive }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              Profile
            </router-link>

            <router-link
              to="/settings"
              v-slot="{ isActive }"
              class="navigation-item"
              :class="{ 'navigation-item-active': isActive }"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              Settings
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- User Info & Sign Out -->
    <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
      <div class="flex items-center">
        <img
          :src="authStore.user?.photoURL || defaultAvatar"
          :alt="authStore.user?.displayName"
          class="w-8 h-8 rounded-full"
        />
        <div class="ml-3 flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
            {{ authStore.user?.displayName || 'User' }}
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
            {{ authStore.user?.email }}
          </p>
        </div>
        <button
          @click="signOut"
          class="ml-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          title="Sign Out"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { useTaskStore } from '../stores/taskStore'

const router = useRouter()
const authStore = useAuthStore()
const taskStore = useTaskStore()

const selectedBusinessUnit = ref(null)
const teamCount = ref(12)

const businessUnits = ref([
  { id: 'peoples_bank', name: 'PeoplesBank', color: 'bg-blue-500', taskCount: 25 },
  { id: 'fintech', name: 'Fintech', color: 'bg-green-500', taskCount: 18 },
  { id: 'infinity_luxus', name: 'Cabinet Business', color: 'bg-purple-500', taskCount: 22 },
  { id: 'personal', name: 'Personal', color: 'bg-orange-500', taskCount: 8 }
])

const taskCounts = computed(() => {
  return {
    total: taskStore.tasks.length,
    myTasks: taskStore.tasks.filter(task => 
      task.assigned_to === authStore.user?.uid
    ).length
  }
})

const defaultAvatar = computed(() => {
  const name = authStore.user?.displayName || 'User'
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&size=32`
})

const filterByBusinessUnit = (unitId) => {
  selectedBusinessUnit.value = selectedBusinessUnit.value === unitId ? null : unitId
  // Apply filter to tasks
  router.push({
    path: '/tasks',
    query: selectedBusinessUnit.value ? { business_unit: selectedBusinessUnit.value } : {}
  })
}

const signOut = async () => {
  try {
    await authStore.signOut()
    router.push('/login')
  } catch (error) {
    console.error('Error signing out:', error)
  }
}

onMounted(() => {
  // Load initial data
  taskStore.loadTasks()
})
</script>
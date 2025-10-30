<template>
  <div class="dashboard">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      <p class="text-gray-600 dark:text-gray-300">Welcome back! Here's your task overview.</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="card">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
            <CheckCircleIcon class="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div class="ml-4">
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Tasks</h3>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.totalTasks }}</p>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-100 dark:bg-green-900">
            <ClockIcon class="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div class="ml-4">
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">In Progress</h3>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.inProgress }}</p>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
            <ExclamationTriangleIcon class="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div class="ml-4">
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Overdue</h3>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.overdue }}</p>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
            <SparklesIcon class="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div class="ml-4">
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">AI Score</h3>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.aiScore }}%</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Tasks -->
    <div class="card">
      <div class="card-header">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Recent Tasks</h2>
        <router-link to="/tasks" class="btn-primary">View All</router-link>
      </div>
      
      <div class="space-y-4">
        <div v-if="recentTasks.length === 0" class="text-center py-8">
          <p class="text-gray-500 dark:text-gray-400">No tasks yet. Create your first task!</p>
          <router-link to="/create-task" class="btn-primary mt-4">Create Task</router-link>
        </div>
        
        <div v-for="task in recentTasks" :key="task.id" class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium text-gray-900 dark:text-white">{{ task.title }}</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ task.business_unit }}</p>
            </div>
            <div class="flex items-center space-x-2">
              <span :class="['badge', `badge-${task.priority}`]">{{ task.priority }}</span>
              <span :class="['badge', getStatusClass(task.status)]">{{ task.status }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { 
  CheckCircleIcon, 
  ClockIcon, 
  ExclamationTriangleIcon, 
  SparklesIcon 
} from '@heroicons/vue/24/outline'
import { useTaskStore } from '../stores/taskStore'
import { useAuthStore } from '../stores/authStore'

const taskStore = useTaskStore()
const authStore = useAuthStore()

const recentTasks = ref([])

const stats = computed(() => {
  const tasks = taskStore.tasks
  return {
    totalTasks: tasks.length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    overdue: taskStore.overdueTasks.length,
    aiScore: 85 // Placeholder AI efficiency score
  }
})

const getStatusClass = (status) => {
  const classes = {
    'assigned': 'badge-primary',
    'in_progress': 'badge-warning',
    'completed': 'badge-success',
    'rejected': 'badge-danger'
  }
  return classes[status] || 'badge-primary'
}

onMounted(async () => {
  await taskStore.loadTasks()
  recentTasks.value = taskStore.tasks.slice(0, 5)
})
</script>
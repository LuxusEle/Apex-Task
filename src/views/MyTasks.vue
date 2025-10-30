<template>
  <div class="my-tasks">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">My Tasks</h1>
      <p class="text-gray-600 dark:text-gray-300">Tasks assigned to you across all business units.</p>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="card">
        <div class="flex items-center">
          <div class="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <svg class="w-6 h-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tasks</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ userTaskStats.total }}</p>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center">
          <div class="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
            <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ userTaskStats.in_progress }}</p>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center">
          <div class="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
            <svg class="w-6 h-6 text-red-600 dark:text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Overdue</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ userTaskStats.overdue }}</p>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center">
          <div class="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
            <svg class="w-6 h-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ userTaskStats.completed }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="card mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <select v-model="filters.status" class="input-field">
          <option value="all">All Status</option>
          <option value="assigned">Assigned</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        
        <select v-model="filters.priority" class="input-field">
          <option value="all">All Priority</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        
        <select v-model="filters.business_unit" class="input-field">
          <option value="all">All Business Units</option>
          <option value="peoples_bank">PeoplesBank</option>
          <option value="fintech">Fintech</option>
          <option value="infinity_luxus">Cabinet Business</option>
          <option value="personal">Personal</option>
        </select>
      </div>
    </div>

    <!-- My Tasks List -->
    <div class="space-y-4">
      <div v-if="loading" class="text-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p class="text-gray-500 dark:text-gray-400 mt-4">Loading your tasks...</p>
      </div>
      
      <div v-else-if="myTasks.length === 0" class="text-center py-8">
        <p class="text-gray-500 dark:text-gray-400">No tasks assigned to you yet.</p>
      </div>
      
      <div v-else>
        <div v-for="task in myTasks" :key="task.id" class="card hover:shadow-lg transition-shadow">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-2 mb-2">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ task.title }}</h3>
                <span :class="['priority-dot', `priority-${task.priority}`]"></span>
                <span v-if="isOverdue(task)" class="badge badge-danger text-xs">Overdue</span>
              </div>
              
              <p class="text-gray-600 dark:text-gray-300 mb-3">{{ task.description }}</p>
              
              <div class="flex items-center space-x-4 text-sm">
                <span class="text-gray-500 dark:text-gray-400">
                  <strong>Business:</strong> {{ formatBusinessUnit(task.business_unit) }}
                </span>
                <span class="text-gray-500 dark:text-gray-400">
                  <strong>Assigned:</strong> {{ formatDate(task.assigned_at) }}
                </span>
                <span v-if="task.due_date" class="text-gray-500 dark:text-gray-400">
                  <strong>Due:</strong> {{ formatDate(task.due_date) }}
                </span>
              </div>
            </div>
            
            <div class="flex flex-col items-end space-y-2 ml-4">
              <span :class="['badge', getStatusClass(task.status)]">{{ task.status }}</span>
              <span :class="['badge', `badge-${task.priority}`]">{{ task.priority }}</span>
              
              <div class="flex space-x-2">
                <button @click="updateTaskStatus(task, 'in_progress')" 
                        v-if="task.status === 'assigned'" 
                        class="btn-primary text-xs">Start</button>
                <button @click="updateTaskStatus(task, 'completed')" 
                        v-if="task.status === 'in_progress'" 
                        class="btn-success text-xs">Complete</button>
                <button @click="viewTask(task)" class="btn-secondary text-xs">View</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useTaskStore } from '../stores/taskStore'
import { useAuthStore } from '../stores/authStore'

const taskStore = useTaskStore()
const authStore = useAuthStore()

const loading = ref(true)
const filters = ref({
  status: 'all',
  priority: 'all',
  business_unit: 'all'
})

const myTasks = computed(() => {
  let tasks = taskStore.tasks.filter(task => 
    task.assigned_to === authStore.user?.uid
  )
  
  // Apply filters
  if (filters.value.status !== 'all') {
    tasks = tasks.filter(task => task.status === filters.value.status)
  }
  if (filters.value.priority !== 'all') {
    tasks = tasks.filter(task => task.priority === filters.value.priority)
  }
  if (filters.value.business_unit !== 'all') {
    tasks = tasks.filter(task => task.business_unit === filters.value.business_unit)
  }
  
  return tasks.sort((a, b) => {
    // Sort by priority first, then by due date
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    }
    if (a.due_date && b.due_date) {
      return new Date(a.due_date) - new Date(b.due_date)
    }
    return 0
  })
})

const userTaskStats = computed(() => {
  const userTasks = taskStore.tasks.filter(task => 
    task.assigned_to === authStore.user?.uid
  )
  
  return {
    total: userTasks.length,
    in_progress: userTasks.filter(t => t.status === 'in_progress').length,
    completed: userTasks.filter(t => t.status === 'completed').length,
    overdue: userTasks.filter(t => isOverdue(t)).length
  }
})

const isOverdue = (task) => {
  if (!task.due_date || task.status === 'completed') return false
  return new Date(task.due_date) < new Date()
}

const formatBusinessUnit = (unit) => {
  const units = {
    peoples_bank: 'PeoplesBank',
    fintech: 'Fintech',
    infinity_luxus: 'Cabinet Business',
    personal: 'Personal'
  }
  return units[unit] || unit
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString()
}

const getStatusClass = (status) => {
  const classes = {
    'assigned': 'badge-primary',
    'in_progress': 'badge-warning',
    'completed': 'badge-success',
    'rejected': 'badge-danger'
  }
  return classes[status] || 'badge-primary'
}

const updateTaskStatus = async (task, newStatus) => {
  try {
    await taskStore.updateTask(task.id, { 
      status: newStatus,
      updated_at: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error updating task status:', error)
  }
}

const viewTask = (task) => {
  // Navigate to task detail view
  console.log('Viewing task:', task.id)
}

onMounted(async () => {
  await taskStore.loadTasks()
  loading.value = false
})
</script>
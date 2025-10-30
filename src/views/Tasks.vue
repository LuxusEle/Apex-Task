<template>
  <div class="tasks">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">All Tasks</h1>
      <p class="text-gray-600 dark:text-gray-300">Manage and monitor all tasks across your organization.</p>
    </div>

    <!-- Filters -->
    <div class="card mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <select v-model="filters.status" class="input-field">
          <option value="all">All Status</option>
          <option value="assigned">Assigned</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="rejected">Rejected</option>
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
        
        <button @click="clearFilters" class="btn-secondary">Clear Filters</button>
      </div>
    </div>

    <!-- Tasks List -->
    <div class="space-y-4">
      <div v-if="loading" class="text-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p class="text-gray-500 dark:text-gray-400 mt-4">Loading tasks...</p>
      </div>
      
      <div v-else-if="filteredTasks.length === 0" class="text-center py-8">
        <p class="text-gray-500 dark:text-gray-400">No tasks found.</p>
        <router-link to="/create-task" class="btn-primary mt-4">Create First Task</router-link>
      </div>
      
      <div v-else>
        <div v-for="task in filteredTasks" :key="task.id" class="card hover:shadow-lg transition-shadow">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-2 mb-2">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ task.title }}</h3>
                <span :class="['priority-dot', `priority-${task.priority}`]"></span>
              </div>
              
              <p class="text-gray-600 dark:text-gray-300 mb-3">{{ task.description }}</p>
              
              <div class="flex items-center space-x-4 text-sm">
                <span class="text-gray-500 dark:text-gray-400">
                  <strong>Business:</strong> {{ formatBusinessUnit(task.business_unit) }}
                </span>
                <span class="text-gray-500 dark:text-gray-400">
                  <strong>Created:</strong> {{ formatDate(task.created_at) }}
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
                <button @click="viewTask(task)" class="btn-secondary text-xs">View</button>
                <button v-if="canEdit(task)" @click="editTask(task)" class="btn-primary text-xs">Edit</button>
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

const filteredTasks = computed(() => {
  return taskStore.filteredTasks
})

const canEdit = (task) => {
  return authStore.canCreateTasks || task.created_by === authStore.user?.uid
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

const clearFilters = () => {
  filters.value = {
    status: 'all',
    priority: 'all',
    business_unit: 'all'
  }
}

const viewTask = (task) => {
  // Navigate to task detail view
  console.log('Viewing task:', task.id)
}

const editTask = (task) => {
  // Navigate to task edit view
  console.log('Editing task:', task.id)
}

// Watch filters and update store
watch(filters, (newFilters) => {
  taskStore.setFilters(newFilters)
}, { deep: true })

onMounted(async () => {
  await taskStore.loadTasks()
  loading.value = false
})
</script>
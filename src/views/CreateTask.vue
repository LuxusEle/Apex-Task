<template>
  <div class="create-task">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Create New Task</h1>
      <p class="text-gray-600 dark:text-gray-300">Create and assign tasks with AI assistance.</p>
    </div>

    <div class="max-w-4xl mx-auto">
      <form @submit.prevent="createTask" class="space-y-6">
        <!-- Basic Information -->
        <div class="card">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Task Information</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Task Title *
              </label>
              <input
                v-model="taskForm.title"
                type="text"
                required
                class="input-field"
                placeholder="Enter task title"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Business Unit *
              </label>
              <select v-model="taskForm.business_unit" required class="input-field">
                <option value="">Select Business Unit</option>
                <option value="peoples_bank">PeoplesBank</option>
                <option value="fintech">Fintech</option>
                <option value="infinity_luxus">Cabinet Business</option>
                <option value="personal">Personal</option>
              </select>
            </div>
          </div>

          <div class="mt-6">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              v-model="taskForm.description"
              required
              rows="4"
              class="input-field"
              placeholder="Describe the task in detail"
            ></textarea>
          </div>
        </div>

        <!-- Priority and Assignment -->
        <div class="card">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Priority & Assignment</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priority *
              </label>
              <select v-model="taskForm.priority" required class="input-field">
                <option value="">Select Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Assign To
              </label>
              <select v-model="taskForm.assigned_to" class="input-field">
                <option value="">Unassigned</option>
                <option v-for="user in availableUsers" :key="user.id" :value="user.id">
                  {{ user.name }} ({{ user.role }})
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Due Date
              </label>
              <input
                v-model="taskForm.due_date"
                type="datetime-local"
                class="input-field"
              />
            </div>
          </div>
        </div>

        <!-- AI Enhancement -->
        <div class="card">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">AI Enhancement</h3>
          
          <div class="space-y-4">
            <div class="flex items-center space-x-3">
              <input
                v-model="aiOptions.enhance_description"
                type="checkbox"
                id="enhance-description"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label for="enhance-description" class="text-sm text-gray-700 dark:text-gray-300">
                Use AI to enhance task description
              </label>
            </div>

            <div class="flex items-center space-x-3">
              <input
                v-model="aiOptions.suggest_assignment"
                type="checkbox"
                id="suggest-assignment"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label for="suggest-assignment" class="text-sm text-gray-700 dark:text-gray-300">
                Get AI suggestion for task assignment
              </label>
            </div>

            <div class="flex items-center space-x-3">
              <input
                v-model="aiOptions.estimate_time"
                type="checkbox"
                id="estimate-time"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label for="estimate-time" class="text-sm text-gray-700 dark:text-gray-300">
                Generate time estimate for completion
              </label>
            </div>

            <button
              type="button"
              @click="getAIEnhancement"
              :disabled="isProcessingAI"
              class="btn-secondary"
            >
              <span v-if="isProcessingAI" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing with AI...
              </span>
              <span v-else>Enhance with AI</span>
            </button>
          </div>

          <!-- AI Suggestions Display -->
          <div v-if="aiSuggestions" class="mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
            <h4 class="font-medium text-blue-900 dark:text-blue-100 mb-2">AI Suggestions:</h4>
            <div class="space-y-2 text-sm text-blue-800 dark:text-blue-200">
              <div v-if="aiSuggestions.enhanced_description">
                <strong>Enhanced Description:</strong> {{ aiSuggestions.enhanced_description }}
              </div>
              <div v-if="aiSuggestions.suggested_assignee">
                <strong>Suggested Assignee:</strong> {{ aiSuggestions.suggested_assignee }}
              </div>
              <div v-if="aiSuggestions.time_estimate">
                <strong>Time Estimate:</strong> {{ aiSuggestions.time_estimate }}
              </div>
            </div>
            <button
              type="button"
              @click="applySuggestions"
              class="btn-primary mt-3 text-xs"
            >
              Apply Suggestions
            </button>
          </div>
        </div>

        <!-- Additional Options -->
        <div class="card">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Additional Options</h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags (comma-separated)
              </label>
              <input
                v-model="taskForm.tags"
                type="text"
                class="input-field"
                placeholder="project, urgent, review"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Estimated Hours
              </label>
              <input
                v-model.number="taskForm.estimated_hours"
                type="number"
                min="0"
                step="0.5"
                class="input-field"
                placeholder="0"
              />
            </div>

            <div class="flex items-center space-x-3">
              <input
                v-model="taskForm.requires_approval"
                type="checkbox"
                id="requires-approval"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label for="requires-approval" class="text-sm text-gray-700 dark:text-gray-300">
                Requires approval before completion
              </label>
            </div>
          </div>
        </div>

        <!-- Submit Buttons -->
        <div class="flex justify-end space-x-4">
          <button
            type="button"
            @click="$router.push('/tasks')"
            class="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="btn-primary"
          >
            <span v-if="isSubmitting">Creating Task...</span>
            <span v-else>Create Task</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTaskStore } from '../stores/taskStore'
import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const taskStore = useTaskStore()
const authStore = useAuthStore()

const isSubmitting = ref(false)
const isProcessingAI = ref(false)
const availableUsers = ref([])
const aiSuggestions = ref(null)

const taskForm = reactive({
  title: '',
  description: '',
  business_unit: '',
  priority: '',
  assigned_to: '',
  due_date: '',
  tags: '',
  estimated_hours: 0,
  requires_approval: false
})

const aiOptions = reactive({
  enhance_description: false,
  suggest_assignment: false,
  estimate_time: false
})

const getAIEnhancement = async () => {
  if (!taskForm.title || !taskForm.description) {
    alert('Please fill in title and description first')
    return
  }

  isProcessingAI.value = true
  try {
    const suggestions = await taskStore.getAITaskSuggestions({
      title: taskForm.title,
      description: taskForm.description,
      business_unit: taskForm.business_unit,
      options: aiOptions
    })
    aiSuggestions.value = suggestions
  } catch (error) {
    console.error('Error getting AI suggestions:', error)
    alert('Failed to get AI suggestions. Please try again.')
  } finally {
    isProcessingAI.value = false
  }
}

const applySuggestions = () => {
  if (aiSuggestions.value.enhanced_description) {
    taskForm.description = aiSuggestions.value.enhanced_description
  }
  if (aiSuggestions.value.suggested_assignee) {
    // Find user by name or email
    const user = availableUsers.value.find(u => 
      u.name.includes(aiSuggestions.value.suggested_assignee) ||
      u.email.includes(aiSuggestions.value.suggested_assignee)
    )
    if (user) {
      taskForm.assigned_to = user.id
    }
  }
  if (aiSuggestions.value.time_estimate) {
    // Extract hours from time estimate
    const hours = parseFloat(aiSuggestions.value.time_estimate.match(/\d+\.?\d*/)?.[0] || 0)
    if (hours > 0) {
      taskForm.estimated_hours = hours
    }
  }
}

const createTask = async () => {
  isSubmitting.value = true
  try {
    const taskData = {
      ...taskForm,
      tags: taskForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      created_by: authStore.user.uid,
      created_at: new Date().toISOString(),
      status: taskForm.assigned_to ? 'assigned' : 'unassigned'
    }

    await taskStore.createTask(taskData)
    router.push('/tasks')
  } catch (error) {
    console.error('Error creating task:', error)
    alert('Failed to create task. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}

const loadAvailableUsers = async () => {
  try {
    // In a real app, you'd load users from a users collection
    // For now, we'll use a mock list
    availableUsers.value = [
      { id: 'user1', name: 'John Doe', email: 'john@example.com', role: 'Manager' },
      { id: 'user2', name: 'Jane Smith', email: 'jane@example.com', role: 'Developer' },
      { id: 'user3', name: 'Mike Johnson', email: 'mike@example.com', role: 'Analyst' }
    ]
  } catch (error) {
    console.error('Error loading users:', error)
  }
}

onMounted(() => {
  loadAvailableUsers()
})
</script>
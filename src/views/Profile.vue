<template>
  <div class="profile">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
      <p class="text-gray-600 dark:text-gray-300">Manage your personal information and preferences.</p>
    </div>

    <div class="max-w-4xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Profile Picture and Basic Info -->
        <div class="lg:col-span-1">
          <div class="card">
            <div class="text-center">
              <div class="relative inline-block">
                <img
                  :src="profile.avatar || defaultAvatar"
                  :alt="profile.name"
                  class="w-32 h-32 rounded-full mx-auto"
                />
                <button
                  @click="uploadAvatar"
                  class="absolute bottom-0 right-0 bg-primary-600 text-white rounded-full p-2 hover:bg-primary-700 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </button>
              </div>
              
              <h3 class="mt-4 text-xl font-semibold text-gray-900 dark:text-white">{{ profile.name }}</h3>
              <p class="text-gray-600 dark:text-gray-300">{{ profile.email }}</p>
              <span :class="['inline-flex px-3 py-1 text-sm font-semibold rounded-full mt-2', getRoleClass(profile.role)]">
                {{ profile.role }}
              </span>
            </div>

            <div class="mt-6 space-y-4">
              <div class="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2m-6 0V7"></path>
                </svg>
                {{ profile.department || 'No department set' }}
              </div>
              
              <div class="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
                {{ formatDate(profile.lastActive) }}
              </div>
              
              <div class="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                {{ profile.timezone || 'UTC' }}
              </div>
            </div>
          </div>

          <!-- Quick Stats -->
          <div class="card mt-6">
            <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Stats</h4>
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600 dark:text-gray-300">Tasks Completed</span>
                <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ stats.completedTasks }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600 dark:text-gray-300">Active Tasks</span>
                <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ stats.activeTasks }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600 dark:text-gray-300">Success Rate</span>
                <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ stats.successRate }}%</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600 dark:text-gray-300">Team Rank</span>
                <span class="text-sm font-semibold text-gray-900 dark:text-white">#{{ stats.teamRank }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Profile Form -->
        <div class="lg:col-span-2">
          <form @submit.prevent="saveProfile" class="space-y-6">
            <!-- Personal Information -->
            <div class="card">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    v-model="profile.name"
                    type="text"
                    required
                    class="input-field"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    v-model="profile.email"
                    type="email"
                    required
                    disabled
                    class="input-field bg-gray-50 dark:bg-gray-800"
                  />
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Email cannot be changed. Contact support if needed.
                  </p>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Job Title
                  </label>
                  <input
                    v-model="profile.jobTitle"
                    type="text"
                    class="input-field"
                    placeholder="Your job title"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Department
                  </label>
                  <input
                    v-model="profile.department"
                    type="text"
                    class="input-field"
                    placeholder="Your department"
                  />
                </div>
              </div>

              <div class="mt-6">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bio
                </label>
                <textarea
                  v-model="profile.bio"
                  rows="3"
                  class="input-field"
                  placeholder="Tell us about yourself..."
                ></textarea>
              </div>
            </div>

            <!-- Contact Information -->
            <div class="card">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    v-model="profile.phone"
                    type="tel"
                    class="input-field"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location
                  </label>
                  <input
                    v-model="profile.location"
                    type="text"
                    class="input-field"
                    placeholder="City, Country"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Time Zone
                  </label>
                  <select v-model="profile.timezone" class="input-field">
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                    <option value="Pacific/Auckland">New Zealand Time</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Preferred Language
                  </label>
                  <select v-model="profile.language" class="input-field">
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Business Units -->
            <div class="card">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Business Unit Access</h3>
              
              <div class="space-y-3">
                <div v-for="unit in businessUnits" :key="unit.value" class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div class="flex items-center">
                    <input
                      v-model="profile.businessUnits"
                      type="checkbox"
                      :value="unit.value"
                      :disabled="!canModifyBusinessUnits"
                      class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <div class="ml-3">
                      <p class="text-sm font-medium text-gray-900 dark:text-white">{{ unit.label }}</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">{{ unit.description }}</p>
                    </div>
                  </div>
                  <span v-if="profile.businessUnits.includes(unit.value)" class="text-xs text-green-600 dark:text-green-400 font-medium">
                    Active
                  </span>
                </div>
              </div>
              
              <p v-if="!canModifyBusinessUnits" class="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Contact your administrator to modify business unit access.
              </p>
            </div>

            <!-- Working Hours -->
            <div class="card">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Working Hours</h3>
              
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Enable working hours</span>
                  <input
                    v-model="profile.workingHoursEnabled"
                    type="checkbox"
                    class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </div>
                
                <div v-if="profile.workingHoursEnabled" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Start Time
                    </label>
                    <input
                      v-model="profile.workingHours.start"
                      type="time"
                      class="input-field"
                    />
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      End Time
                    </label>
                    <input
                      v-model="profile.workingHours.end"
                      type="time"
                      class="input-field"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Submit Button -->
            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="isSaving"
                class="btn-primary"
              >
                <span v-if="isSaving">Saving...</span>
                <span v-else>Save Profile</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/authStore'

const authStore = useAuthStore()
const isSaving = ref(false)

const businessUnits = [
  { 
    value: 'peoples_bank', 
    label: 'PeoplesBank', 
    description: 'Banking and financial services' 
  },
  { 
    value: 'fintech', 
    label: 'Fintech', 
    description: 'Financial technology solutions' 
  },
  { 
    value: 'infinity_luxus', 
    label: 'Cabinet Business', 
    description: 'Luxury cabinet manufacturing' 
  },
  { 
    value: 'personal', 
    label: 'Personal', 
    description: 'Personal tasks and projects' 
  }
]

const profile = reactive({
  name: 'John Doe',
  email: 'john@apex.com',
  role: 'owner',
  jobTitle: 'Chief Executive Officer',
  department: 'Executive',
  bio: 'Entrepreneur managing multiple business ventures with a focus on innovation and growth.',
  phone: '+64 21 123 4567',
  location: 'Auckland, New Zealand',
  timezone: 'Pacific/Auckland',
  language: 'en',
  avatar: null,
  businessUnits: ['peoples_bank', 'fintech', 'infinity_luxus', 'personal'],
  workingHoursEnabled: true,
  workingHours: {
    start: '09:00',
    end: '17:00'
  },
  lastActive: new Date().toISOString()
})

const stats = reactive({
  completedTasks: 156,
  activeTasks: 12,
  successRate: 94,
  teamRank: 1
})

const defaultAvatar = computed(() => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=6366f1&color=fff&size=128`
})

const canModifyBusinessUnits = computed(() => {
  return authStore.isOwner || authStore.isAdmin
})

const getRoleClass = (role) => {
  const classes = {
    owner: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    admin: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    manager: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    user: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  }
  return classes[role] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
}

const formatDate = (date) => {
  const now = new Date()
  const target = new Date(date)
  const diff = now - target

  if (diff < 1000 * 60) return 'Just now'
  if (diff < 1000 * 60 * 60) return `${Math.floor(diff / (1000 * 60))}m ago`
  if (diff < 1000 * 60 * 60 * 24) return `${Math.floor(diff / (1000 * 60 * 60))}h ago`
  return target.toLocaleDateString()
}

const uploadAvatar = () => {
  // In a real app, this would open a file picker and upload the image
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = (event) => {
    const file = event.target.files[0]
    if (file) {
      // Preview the image
      const reader = new FileReader()
      reader.onload = (e) => {
        profile.avatar = e.target.result
      }
      reader.readAsDataURL(file)
    }
  }
  input.click()
}

const saveProfile = async () => {
  isSaving.value = true
  try {
    // In a real app, this would save the profile to the backend
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('Profile saved:', profile)
    alert('Profile updated successfully!')
  } catch (error) {
    console.error('Error saving profile:', error)
    alert('Failed to save profile')
  } finally {
    isSaving.value = false
  }
}

const loadProfile = async () => {
  try {
    // In a real app, this would load the profile from the backend
    // For now, we'll use the current user from auth store if available
    if (authStore.user) {
      profile.name = authStore.user.displayName || profile.name
      profile.email = authStore.user.email || profile.email
      profile.avatar = authStore.user.photoURL || profile.avatar
    }
  } catch (error) {
    console.error('Error loading profile:', error)
  }
}

onMounted(() => {
  loadProfile()
})
</script>
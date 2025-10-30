<template>
  <div class="settings">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
      <p class="text-gray-600 dark:text-gray-300">Manage your application preferences and configurations.</p>
    </div>

    <!-- Settings Navigation -->
    <div class="mb-6">
      <nav class="flex space-x-8" aria-label="Tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm',
            activeTab === tab.id
              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
          ]"
        >
          {{ tab.name }}
        </button>
      </nav>
    </div>

    <!-- General Settings -->
    <div v-show="activeTab === 'general'" class="space-y-6">
      <div class="card">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">General Preferences</h3>
        
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Application Name
            </label>
            <input
              v-model="settings.general.appName"
              type="text"
              class="input-field"
              placeholder="Apex Task Manager"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Default Business Unit
            </label>
            <select v-model="settings.general.defaultBusinessUnit" class="input-field">
              <option value="">Select Default</option>
              <option value="peoples_bank">PeoplesBank</option>
              <option value="fintech">Fintech</option>
              <option value="infinity_luxus">Cabinet Business</option>
              <option value="personal">Personal</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Time Zone
            </label>
            <select v-model="settings.general.timezone" class="input-field">
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
              Date Format
            </label>
            <select v-model="settings.general.dateFormat" class="input-field">
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Notifications Settings -->
    <div v-show="activeTab === 'notifications'" class="space-y-6">
      <div class="card">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notification Preferences</h3>
        
        <div class="space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-sm font-medium text-gray-900 dark:text-white">Email Notifications</h4>
              <p class="text-sm text-gray-500 dark:text-gray-400">Receive notifications via email</p>
            </div>
            <input
              v-model="settings.notifications.emailEnabled"
              type="checkbox"
              class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
          </div>

          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-sm font-medium text-gray-900 dark:text-white">Browser Notifications</h4>
              <p class="text-sm text-gray-500 dark:text-gray-400">Show desktop notifications</p>
            </div>
            <input
              v-model="settings.notifications.browserEnabled"
              type="checkbox"
              class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
          </div>

          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-sm font-medium text-gray-900 dark:text-white">Task Assignments</h4>
              <p class="text-sm text-gray-500 dark:text-gray-400">Notify when tasks are assigned to you</p>
            </div>
            <input
              v-model="settings.notifications.taskAssignments"
              type="checkbox"
              class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
          </div>

          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-sm font-medium text-gray-900 dark:text-white">Due Date Reminders</h4>
              <p class="text-sm text-gray-500 dark:text-gray-400">Remind me before tasks are due</p>
            </div>
            <input
              v-model="settings.notifications.dueDateReminders"
              type="checkbox"
              class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
          </div>

          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-sm font-medium text-gray-900 dark:text-white">Team Updates</h4>
              <p class="text-sm text-gray-500 dark:text-gray-400">Notify about team activity and updates</p>
            </div>
            <input
              v-model="settings.notifications.teamUpdates"
              type="checkbox"
              class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- AI Settings -->
    <div v-show="activeTab === 'ai'" class="space-y-6">
      <div class="card">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">AI Assistant Settings</h3>
        
        <div class="space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-sm font-medium text-gray-900 dark:text-white">AI Suggestions</h4>
              <p class="text-sm text-gray-500 dark:text-gray-400">Enable AI-powered task suggestions</p>
            </div>
            <input
              v-model="settings.ai.suggestionsEnabled"
              type="checkbox"
              class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
          </div>

          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-sm font-medium text-gray-900 dark:text-white">Auto-Assignment</h4>
              <p class="text-sm text-gray-500 dark:text-gray-400">Let AI suggest task assignments</p>
            </div>
            <input
              v-model="settings.ai.autoAssignmentEnabled"
              type="checkbox"
              class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
          </div>

          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-sm font-medium text-gray-900 dark:text-white">Description Enhancement</h4>
              <p class="text-sm text-gray-500 dark:text-gray-400">Improve task descriptions with AI</p>
            </div>
            <input
              v-model="settings.ai.descriptionEnhancement"
              type="checkbox"
              class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              AI Model Preference
            </label>
            <select v-model="settings.ai.modelPreference" class="input-field">
              <option value="balanced">Balanced (Default)</option>
              <option value="speed">Speed Optimized</option>
              <option value="accuracy">Accuracy Optimized</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Security Settings -->
    <div v-show="activeTab === 'security'" class="space-y-6">
      <div class="card">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Security & Privacy</h3>
        
        <div class="space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-sm font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h4>
              <p class="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security</p>
            </div>
            <button
              @click="toggle2FA"
              :class="[
                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                settings.security.twoFactorEnabled ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
              ]"
            >
              <span
                :class="[
                  'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                  settings.security.twoFactorEnabled ? 'translate-x-5' : 'translate-x-0'
                ]"
              />
            </button>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-sm font-medium text-gray-900 dark:text-white">Session Timeout</h4>
              <p class="text-sm text-gray-500 dark:text-gray-400">Automatically log out after inactivity</p>
            </div>
            <select v-model="settings.security.sessionTimeout" class="input-field w-auto">
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
              <option value="480">8 hours</option>
              <option value="0">Never</option>
            </select>
          </div>

          <div>
            <button @click="changePassword" class="btn-secondary">
              Change Password
            </button>
          </div>

          <div>
            <button @click="downloadData" class="btn-secondary">
              Download My Data
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Advanced Settings -->
    <div v-show="activeTab === 'advanced'" class="space-y-6">
      <div class="card">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Advanced Settings</h3>
        
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Override Codes (comma-separated)
            </label>
            <input
              v-model="settings.advanced.overrideCodes"
              type="text"
              class="input-field"
              placeholder="123, 456, 789"
            />
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Special access codes for emergency overrides
            </p>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-sm font-medium text-gray-900 dark:text-white">Debug Mode</h4>
              <p class="text-sm text-gray-500 dark:text-gray-400">Enable detailed logging (development only)</p>
            </div>
            <input
              v-model="settings.advanced.debugMode"
              type="checkbox"
              class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
          </div>

          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-sm font-medium text-gray-900 dark:text-white">Analytics</h4>
              <p class="text-sm text-gray-500 dark:text-gray-400">Share usage data to improve the app</p>
            </div>
            <input
              v-model="settings.advanced.analyticsEnabled"
              type="checkbox"
              class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
          </div>

          <div>
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">Data Export</h4>
            <div class="space-y-2">
              <button @click="exportTasks" class="btn-secondary mr-2">
                Export Tasks
              </button>
              <button @click="exportAnalytics" class="btn-secondary">
                Export Analytics
              </button>
            </div>
          </div>

          <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h4 class="text-sm font-medium text-red-600 dark:text-red-400 mb-2">Danger Zone</h4>
            <button @click="resetSettings" class="btn-danger mr-2">
              Reset All Settings
            </button>
            <button @click="deleteAccount" class="btn-danger">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Save Button -->
    <div class="flex justify-end pt-6">
      <button @click="saveSettings" :disabled="isSaving" class="btn-primary">
        <span v-if="isSaving">Saving...</span>
        <span v-else>Save Settings</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

const activeTab = ref('general')
const isSaving = ref(false)

const tabs = [
  { id: 'general', name: 'General' },
  { id: 'notifications', name: 'Notifications' },
  { id: 'ai', name: 'AI Assistant' },
  { id: 'security', name: 'Security' },
  { id: 'advanced', name: 'Advanced' }
]

const settings = reactive({
  general: {
    appName: 'Apex Task Manager',
    defaultBusinessUnit: 'personal',
    timezone: 'Pacific/Auckland',
    dateFormat: 'DD/MM/YYYY'
  },
  notifications: {
    emailEnabled: true,
    browserEnabled: true,
    taskAssignments: true,
    dueDateReminders: true,
    teamUpdates: false
  },
  ai: {
    suggestionsEnabled: true,
    autoAssignmentEnabled: false,
    descriptionEnhancement: true,
    modelPreference: 'balanced'
  },
  security: {
    twoFactorEnabled: false,
    sessionTimeout: 60
  },
  advanced: {
    overrideCodes: '123, 456, 789',
    debugMode: false,
    analyticsEnabled: true
  }
})

const toggle2FA = () => {
  if (!settings.security.twoFactorEnabled) {
    // In a real app, this would trigger 2FA setup process
    alert('2FA setup would be initiated here')
  } else {
    // Confirm disable 2FA
    if (confirm('Are you sure you want to disable two-factor authentication?')) {
      settings.security.twoFactorEnabled = false
    }
  }
}

const changePassword = () => {
  // In a real app, this would open a password change modal or redirect
  alert('Password change modal would open here')
}

const downloadData = () => {
  // In a real app, this would generate and download user data
  alert('Data download would be initiated here')
}

const exportTasks = () => {
  // In a real app, this would export tasks to CSV/JSON
  alert('Tasks export would be initiated here')
}

const exportAnalytics = () => {
  // In a real app, this would export analytics data
  alert('Analytics export would be initiated here')
}

const resetSettings = () => {
  if (confirm('Are you sure you want to reset all settings to defaults? This cannot be undone.')) {
    // Reset to default values
    Object.assign(settings.general, {
      appName: 'Apex Task Manager',
      defaultBusinessUnit: '',
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY'
    })
    Object.assign(settings.notifications, {
      emailEnabled: true,
      browserEnabled: false,
      taskAssignments: true,
      dueDateReminders: true,
      teamUpdates: false
    })
    Object.assign(settings.ai, {
      suggestionsEnabled: true,
      autoAssignmentEnabled: false,
      descriptionEnhancement: true,
      modelPreference: 'balanced'
    })
    Object.assign(settings.security, {
      twoFactorEnabled: false,
      sessionTimeout: 60
    })
    Object.assign(settings.advanced, {
      overrideCodes: '123, 456, 789',
      debugMode: false,
      analyticsEnabled: true
    })
    alert('Settings have been reset to defaults')
  }
}

const deleteAccount = () => {
  const confirmation = prompt('Type "DELETE" to confirm account deletion:')
  if (confirmation === 'DELETE') {
    alert('Account deletion would be processed here')
  }
}

const saveSettings = async () => {
  isSaving.value = true
  try {
    // In a real app, this would save settings to the backend
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('Settings saved:', settings)
    alert('Settings saved successfully!')
  } catch (error) {
    console.error('Error saving settings:', error)
    alert('Failed to save settings')
  } finally {
    isSaving.value = false
  }
}

const loadSettings = async () => {
  try {
    // In a real app, this would load settings from the backend
    console.log('Settings loaded')
  } catch (error) {
    console.error('Error loading settings:', error)
  }
}

onMounted(() => {
  loadSettings()
})
</script>
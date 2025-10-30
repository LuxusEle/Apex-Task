<template>
  <div class="team">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Team Management</h1>
      <p class="text-gray-600 dark:text-gray-300">Manage team members, roles, and permissions.</p>
    </div>

    <!-- Team Overview -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="card">
        <div class="flex items-center">
          <div class="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <svg class="w-6 h-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Members</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ teamStats.totalMembers }}</p>
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
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Active Members</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ teamStats.activeMembers }}</p>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center">
          <div class="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <svg class="w-6 h-6 text-purple-600 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Active Tasks</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ teamStats.activeTasks }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="card mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search team members..."
          class="input-field"
        />
        
        <select v-model="selectedRole" class="input-field">
          <option value="all">All Roles</option>
          <option value="owner">Owner</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="user">User</option>
        </select>
        
        <select v-model="selectedBusinessUnit" class="input-field">
          <option value="all">All Business Units</option>
          <option value="peoples_bank">PeoplesBank</option>
          <option value="fintech">Fintech</option>
          <option value="infinity_luxus">Cabinet Business</option>
          <option value="personal">Personal</option>
        </select>
        
        <button @click="inviteTeamMember" class="btn-primary">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Invite Member
        </button>
      </div>
    </div>

    <!-- Team Members List -->
    <div class="card">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Team Members</h3>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Member
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Role
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Business Units
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Active Tasks
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Last Active
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="member in filteredMembers" :key="member.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <img class="h-10 w-10 rounded-full" :src="member.avatar" :alt="member.name" />
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">{{ member.name }}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-300">{{ member.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="['inline-flex px-2 py-1 text-xs font-semibold rounded-full', getRoleClass(member.role)]">
                  {{ member.role }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                <div class="flex flex-wrap gap-1">
                  <span v-for="unit in member.businessUnits" :key="unit" class="inline-flex px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded">
                    {{ formatBusinessUnit(unit) }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ member.activeTasks }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {{ formatDate(member.lastActive) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div :class="['w-2 h-2 rounded-full mr-2', member.isOnline ? 'bg-green-500' : 'bg-gray-400']"></div>
                  <span class="text-sm text-gray-900 dark:text-white">
                    {{ member.isOnline ? 'Online' : 'Offline' }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <button @click="editMember(member)" class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300">
                    Edit
                  </button>
                  <button @click="viewTasks(member)" class="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300">
                    Tasks
                  </button>
                  <button v-if="canRemoveMember(member)" @click="removeMember(member)" class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300">
                    Remove
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Invite Modal -->
    <div v-if="showInviteModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Invite Team Member</h3>
          
          <form @submit.prevent="sendInvite" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
              <input
                v-model="inviteForm.email"
                type="email"
                required
                class="input-field"
                placeholder="user@example.com"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Role</label>
              <select v-model="inviteForm.role" required class="input-field">
                <option value="">Select Role</option>
                <option value="user">User</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Business Units</label>
              <div class="space-y-2">
                <label v-for="unit in businessUnits" :key="unit.value" class="flex items-center">
                  <input
                    v-model="inviteForm.businessUnits"
                    type="checkbox"
                    :value="unit.value"
                    class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ unit.label }}</span>
                </label>
              </div>
            </div>
            
            <div class="flex justify-end space-x-3 pt-4">
              <button type="button" @click="showInviteModal = false" class="btn-secondary">
                Cancel
              </button>
              <button type="submit" class="btn-primary">
                Send Invite
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useAuthStore } from '../stores/authStore'

const authStore = useAuthStore()

const searchQuery = ref('')
const selectedRole = ref('all')
const selectedBusinessUnit = ref('all')
const showInviteModal = ref(false)

const teamStats = ref({
  totalMembers: 12,
  activeMembers: 9,
  activeTasks: 47
})

const businessUnits = ref([
  { value: 'peoples_bank', label: 'PeoplesBank' },
  { value: 'fintech', label: 'Fintech' },
  { value: 'infinity_luxus', label: 'Cabinet Business' },
  { value: 'personal', label: 'Personal' }
])

const inviteForm = reactive({
  email: '',
  role: '',
  businessUnits: []
})

// Mock team members data
const teamMembers = ref([
  {
    id: '1',
    name: 'John Doe',
    email: 'john@apex.com',
    role: 'owner',
    businessUnits: ['peoples_bank', 'fintech'],
    activeTasks: 8,
    lastActive: new Date().toISOString(),
    isOnline: true,
    avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=6366f1&color=fff'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@apex.com',
    role: 'admin',
    businessUnits: ['peoples_bank'],
    activeTasks: 12,
    lastActive: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    isOnline: true,
    avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=10b981&color=fff'
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@apex.com',
    role: 'manager',
    businessUnits: ['fintech', 'infinity_luxus'],
    activeTasks: 6,
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    isOnline: false,
    avatar: 'https://ui-avatars.com/api/?name=Mike+Johnson&background=f59e0b&color=fff'
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah@apex.com',
    role: 'user',
    businessUnits: ['personal'],
    activeTasks: 4,
    lastActive: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    isOnline: true,
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Wilson&background=ef4444&color=fff'
  }
])

const filteredMembers = computed(() => {
  let filtered = teamMembers.value

  if (searchQuery.value) {
    filtered = filtered.filter(member =>
      member.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (selectedRole.value !== 'all') {
    filtered = filtered.filter(member => member.role === selectedRole.value)
  }

  if (selectedBusinessUnit.value !== 'all') {
    filtered = filtered.filter(member =>
      member.businessUnits.includes(selectedBusinessUnit.value)
    )
  }

  return filtered
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

const formatBusinessUnit = (unit) => {
  const units = {
    peoples_bank: 'PeoplesBank',
    fintech: 'Fintech',
    infinity_luxus: 'Cabinet',
    personal: 'Personal'
  }
  return units[unit] || unit
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

const canRemoveMember = (member) => {
  return authStore.isOwner && member.role !== 'owner'
}

const inviteTeamMember = () => {
  showInviteModal.value = true
}

const sendInvite = async () => {
  try {
    console.log('Sending invite:', inviteForm)
    // In a real app, this would send an email invitation
    showInviteModal.value = false
    
    // Reset form
    Object.assign(inviteForm, {
      email: '',
      role: '',
      businessUnits: []
    })
    
    alert('Invitation sent successfully!')
  } catch (error) {
    console.error('Error sending invite:', error)
    alert('Failed to send invitation')
  }
}

const editMember = (member) => {
  console.log('Editing member:', member.id)
  // Navigate to member edit page or open edit modal
}

const viewTasks = (member) => {
  console.log('Viewing tasks for:', member.id)
  // Navigate to tasks filtered by this member
}

const removeMember = async (member) => {
  if (confirm(`Are you sure you want to remove ${member.name} from the team?`)) {
    try {
      console.log('Removing member:', member.id)
      // In a real app, this would remove the member from the team
      const index = teamMembers.value.findIndex(m => m.id === member.id)
      if (index > -1) {
        teamMembers.value.splice(index, 1)
      }
    } catch (error) {
      console.error('Error removing member:', error)
      alert('Failed to remove team member')
    }
  }
}

onMounted(() => {
  // Load team members data
  console.log('Team management loaded')
})
</script>
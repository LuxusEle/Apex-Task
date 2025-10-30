<template>
  <div class="analytics">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
      <p class="text-gray-600 dark:text-gray-300">Business intelligence and task performance insights.</p>
    </div>

    <!-- Time Period Selector -->
    <div class="card mb-6">
      <div class="flex flex-wrap items-center gap-4">
        <select v-model="selectedPeriod" class="input-field w-auto">
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="365">Last year</option>
        </select>
        
        <select v-model="selectedBusinessUnit" class="input-field w-auto">
          <option value="all">All Business Units</option>
          <option value="peoples_bank">PeoplesBank</option>
          <option value="fintech">Fintech</option>
          <option value="infinity_luxus">Cabinet Business</option>
          <option value="personal">Personal</option>
        </select>

        <button @click="refreshData" class="btn-primary">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          Refresh
        </button>
      </div>
    </div>

    <!-- Key Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="card">
        <div class="flex items-center">
          <div class="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <svg class="w-6 h-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tasks</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ analytics.totalTasks }}</p>
            <p class="text-xs text-green-600 dark:text-green-400">+{{ analytics.tasksGrowth }}% from last period</p>
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
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Completion Rate</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ analytics.completionRate }}%</p>
            <p class="text-xs text-green-600 dark:text-green-400">+{{ analytics.completionGrowth }}% efficiency</p>
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
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Completion Time</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ analytics.avgCompletionTime }}h</p>
            <p class="text-xs text-red-600 dark:text-red-400">{{ analytics.timeChange }}% vs target</p>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center">
          <div class="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <svg class="w-6 h-6 text-purple-600 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Active Team Members</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ analytics.activeMembers }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ analytics.utilizationRate }}% utilization</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Task Status Distribution -->
      <div class="card">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Task Status Distribution</h3>
        <div class="space-y-3">
          <div v-for="status in statusDistribution" :key="status.name" class="flex items-center justify-between">
            <div class="flex items-center">
              <div :class="['w-3 h-3 rounded-full mr-3', status.color]"></div>
              <span class="text-sm text-gray-600 dark:text-gray-300">{{ status.name }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ status.count }}</span>
              <div class="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div :class="['h-2 rounded-full', status.color]" :style="{ width: `${status.percentage}%` }"></div>
              </div>
              <span class="text-xs text-gray-500 dark:text-gray-400 w-8">{{ status.percentage }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Priority Distribution -->
      <div class="card">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Priority Distribution</h3>
        <div class="space-y-3">
          <div v-for="priority in priorityDistribution" :key="priority.name" class="flex items-center justify-between">
            <div class="flex items-center">
              <div :class="['w-3 h-3 rounded-full mr-3', priority.color]"></div>
              <span class="text-sm text-gray-600 dark:text-gray-300">{{ priority.name }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ priority.count }}</span>
              <div class="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div :class="['h-2 rounded-full', priority.color]" :style="{ width: `${priority.percentage}%` }"></div>
              </div>
              <span class="text-xs text-gray-500 dark:text-gray-400 w-8">{{ priority.percentage }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Business Unit Performance -->
    <div class="card mb-8">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Business Unit Performance</h3>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Business Unit
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Total Tasks
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Completed
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Completion Rate
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Avg. Time
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="unit in businessUnitStats" :key="unit.name">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {{ unit.name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {{ unit.totalTasks }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {{ unit.completed }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                    <div class="bg-green-500 h-2 rounded-full" :style="{ width: `${unit.completionRate}%` }"></div>
                  </div>
                  <span class="text-sm text-gray-900 dark:text-white">{{ unit.completionRate }}%</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {{ unit.avgTime }}h
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- AI Insights -->
    <div class="card">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">AI Insights</h3>
      <div class="space-y-4">
        <div v-for="insight in aiInsights" :key="insight.id" class="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <svg class="w-5 h-5 text-blue-600 dark:text-blue-300 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-3">
              <h4 class="text-sm font-medium text-blue-900 dark:text-blue-100">{{ insight.title }}</h4>
              <p class="text-sm text-blue-800 dark:text-blue-200 mt-1">{{ insight.description }}</p>
              <div class="mt-2">
                <span :class="['inline-flex px-2 py-1 text-xs font-semibold rounded-full', insight.severity === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : insight.severity === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200']">
                  {{ insight.severity }} priority
                </span>
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

const taskStore = useTaskStore()

const selectedPeriod = ref('30')
const selectedBusinessUnit = ref('all')
const loading = ref(true)

// Mock analytics data - in real app, this would come from the task store
const analytics = ref({
  totalTasks: 156,
  tasksGrowth: 12,
  completionRate: 78,
  completionGrowth: 5,
  avgCompletionTime: 24,
  timeChange: -8,
  activeMembers: 12,
  utilizationRate: 85
})

const statusDistribution = ref([
  { name: 'Completed', count: 45, percentage: 45, color: 'bg-green-500' },
  { name: 'In Progress', count: 25, percentage: 25, color: 'bg-yellow-500' },
  { name: 'Assigned', count: 20, percentage: 20, color: 'bg-blue-500' },
  { name: 'Unassigned', count: 10, percentage: 10, color: 'bg-gray-500' }
])

const priorityDistribution = ref([
  { name: 'High', count: 30, percentage: 30, color: 'bg-red-500' },
  { name: 'Medium', count: 40, percentage: 40, color: 'bg-yellow-500' },
  { name: 'Low', count: 25, percentage: 25, color: 'bg-green-500' },
  { name: 'Critical', count: 5, percentage: 5, color: 'bg-purple-500' }
])

const businessUnitStats = ref([
  {
    name: 'PeoplesBank',
    totalTasks: 45,
    completed: 35,
    completionRate: 78,
    avgTime: 18
  },
  {
    name: 'Fintech',
    totalTasks: 38,
    completed: 30,
    completionRate: 79,
    avgTime: 22
  },
  {
    name: 'Cabinet Business',
    totalTasks: 42,
    completed: 32,
    completionRate: 76,
    avgTime: 28
  },
  {
    name: 'Personal',
    totalTasks: 31,
    completed: 25,
    completionRate: 81,
    avgTime: 16
  }
])

const aiInsights = ref([
  {
    id: 1,
    title: 'Task Bottleneck Detected',
    description: 'Cabinet Business unit shows 15% slower completion times. Consider redistributing high-priority tasks or providing additional resources.',
    severity: 'medium'
  },
  {
    id: 2,
    title: 'Productivity Trend',
    description: 'Personal tasks are being completed 12% faster than average. The streamlined workflow could be applied to other units.',
    severity: 'low'
  },
  {
    id: 3,
    title: 'Critical Task Alert',
    description: '3 critical priority tasks in PeoplesBank unit are approaching their deadlines. Immediate attention recommended.',
    severity: 'high'
  }
])

const refreshData = async () => {
  loading.value = true
  try {
    // In a real app, this would fetch fresh analytics data
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('Analytics data refreshed')
  } catch (error) {
    console.error('Error refreshing analytics:', error)
  } finally {
    loading.value = false
  }
}

// Watch for filter changes
watch([selectedPeriod, selectedBusinessUnit], () => {
  refreshData()
})

onMounted(() => {
  refreshData()
})
</script>
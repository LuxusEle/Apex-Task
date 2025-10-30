<template>
  <div class="ai-assistant-chat">
    <!-- Chat Toggle Button (when closed) -->
    <button
      v-if="!isOpen"
      @click="toggleChat"
      class="fixed bottom-6 right-6 w-14 h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 flex items-center justify-center"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
      </svg>
      <span v-if="hasUnreadMessages" class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
        <span class="text-xs text-white">{{ unreadCount > 9 ? '9+' : unreadCount }}</span>
      </span>
    </button>

    <!-- Chat Panel -->
    <div
      v-if="isOpen"
      class="fixed bottom-6 right-6 w-96 h-[600px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xl z-50 flex flex-col"
    >
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center mr-3">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">AI Assistant</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              <span :class="['inline-block w-2 h-2 rounded-full mr-1', isOnline ? 'bg-green-500' : 'bg-gray-400']"></span>
              {{ isOnline ? 'Online' : 'Offline' }}
            </p>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <button
            @click="clearChat"
            class="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            title="Clear Chat"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </button>
          <button
            @click="toggleChat"
            class="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            title="Close Chat"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Chat Messages -->
      <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-4">
        <div v-if="messages.length === 0" class="text-center text-gray-500 dark:text-gray-400 py-8">
          <svg class="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
          </svg>
          <p class="text-sm">Hi! I'm your AI assistant. How can I help you with your tasks today?</p>
        </div>
        
        <div v-for="message in messages" :key="message.id" class="flex" :class="message.isUser ? 'justify-end' : 'justify-start'">
          <div :class="['max-w-xs lg:max-w-md px-4 py-2 rounded-lg', message.isUser ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white']">
            <p class="text-sm">{{ message.text }}</p>
            <p class="text-xs mt-1 opacity-70">{{ formatTime(message.timestamp) }}</p>
          </div>
        </div>
        
        <!-- Typing indicator -->
        <div v-if="isTyping" class="flex justify-start">
          <div class="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
            <div class="flex space-x-1">
              <div class="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
              <div class="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
              <div class="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div v-if="showQuickActions" class="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
        <div class="flex flex-wrap gap-2">
          <button
            v-for="action in quickActions"
            :key="action.id"
            @click="sendQuickAction(action)"
            class="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            {{ action.text }}
          </button>
        </div>
      </div>

      <!-- Input -->
      <div class="p-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex space-x-2">
          <input
            v-model="newMessage"
            @keyup.enter="sendMessage"
            type="text"
            placeholder="Ask me anything about your tasks..."
            class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white text-sm"
            :disabled="!isOnline || isSending"
          />
          <button
            @click="sendMessage"
            :disabled="!newMessage.trim() || !isOnline || isSending"
            class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg v-if="!isSending" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
            </svg>
            <div v-else class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick, onMounted, watch } from 'vue'

const isOpen = ref(false)
const isOnline = ref(true)
const isTyping = ref(false)
const isSending = ref(false)
const newMessage = ref('')
const messagesContainer = ref(null)
const hasUnreadMessages = ref(false)
const unreadCount = ref(0)
const showQuickActions = ref(true)

const messages = reactive([])

const quickActions = [
  { id: 1, text: 'Show my tasks', action: 'show_my_tasks' },
  { id: 2, text: 'Create new task', action: 'create_task' },
  { id: 3, text: 'Task analytics', action: 'show_analytics' },
  { id: 4, text: 'Team status', action: 'team_status' },
  { id: 5, text: 'Help', action: 'help' }
]

const toggleChat = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    hasUnreadMessages.value = false
    unreadCount.value = 0
  }
}

const sendMessage = async () => {
  if (!newMessage.value.trim() || isSending.value) return

  const userMessage = {
    id: Date.now(),
    text: newMessage.value,
    isUser: true,
    timestamp: new Date()
  }

  messages.push(userMessage)
  const messageText = newMessage.value
  newMessage.value = ''

  await nextTick()
  scrollToBottom()

  // Simulate AI response
  isSending.value = true
  isTyping.value = true

  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const aiResponse = await generateAIResponse(messageText)
    
    isTyping.value = false
    
    const aiMessage = {
      id: Date.now() + 1,
      text: aiResponse,
      isUser: false,
      timestamp: new Date()
    }

    messages.push(aiMessage)
    
    await nextTick()
    scrollToBottom()

    // If chat is closed, show notification
    if (!isOpen.value) {
      hasUnreadMessages.value = true
      unreadCount.value++
    }
  } catch (error) {
    isTyping.value = false
    const errorMessage = {
      id: Date.now() + 1,
      text: 'Sorry, I encountered an error. Please try again.',
      isUser: false,
      timestamp: new Date()
    }
    messages.push(errorMessage)
  } finally {
    isSending.value = false
  }
}

const sendQuickAction = async (action) => {
  const actionMessages = {
    show_my_tasks: 'Show me my current tasks',
    create_task: 'Help me create a new task',
    show_analytics: 'Show me task analytics',
    team_status: 'What is my team status?',
    help: 'How can you help me?'
  }

  newMessage.value = actionMessages[action.action] || action.text
  await sendMessage()
}

const generateAIResponse = async (userMessage) => {
  const message = userMessage.toLowerCase()
  
  // Simple AI response simulation
  if (message.includes('task') && message.includes('create')) {
    return "I can help you create a new task! What would you like the task to be about? Please provide a title and description, and I'll help you set it up with the right priority and assignment."
  }
  
  if (message.includes('my tasks') || message.includes('show me')) {
    return "You currently have 12 active tasks. 3 are high priority and due this week. Would you like me to show you the most urgent ones or filter by a specific business unit?"
  }
  
  if (message.includes('analytics') || message.includes('report')) {
    return "Your task completion rate this month is 94%, which is excellent! You've completed 45 tasks across all business units. PeoplesBank tasks are taking an average of 2.3 days to complete. Would you like more detailed analytics?"
  }
  
  if (message.includes('team') || message.includes('status')) {
    return "Your team has 12 active members with 89% utilization rate. There are currently 47 open tasks across all business units. 3 team members need task assignments. Would you like me to suggest optimal task distribution?"
  }
  
  if (message.includes('help') || message.includes('what can')) {
    return "I can help you with:\n• Creating and managing tasks\n• Task analytics and insights\n• Team coordination\n• Business unit performance\n• Deadline tracking\n• Task optimization suggestions\n\nWhat would you like assistance with?"
  }
  
  if (message.includes('deadline') || message.includes('due')) {
    return "You have 3 tasks due this week: 'Financial Report Review' (due tomorrow), 'Q4 Planning' (due Friday), and 'Client Presentation' (due Sunday). Would you like me to prioritize these or set reminders?"
  }
  
  if (message.includes('priority') || message.includes('urgent')) {
    return "Based on your current workload and deadlines, I recommend prioritizing the PeoplesBank financial report first, followed by the fintech client presentation. The cabinet business inventory can be scheduled for next week. Shall I update these priorities?"
  }
  
  // Default response
  return "I understand you're asking about: '" + userMessage + "'. I'm here to help you manage your tasks more effectively. Could you be more specific about what you'd like assistance with?"
}

const clearChat = () => {
  if (confirm('Are you sure you want to clear the chat history?')) {
    messages.length = 0
  }
}

const formatTime = (timestamp) => {
  return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// Watch for new messages and scroll to bottom
watch(messages, () => {
  nextTick(() => {
    scrollToBottom()
  })
}, { deep: true })

onMounted(() => {
  // Simulate connection status
  setInterval(() => {
    // Simulate occasional connectivity issues
    if (Math.random() < 0.05) {
      isOnline.value = false
      setTimeout(() => {
        isOnline.value = true
      }, 2000)
    }
  }, 30000)
})
</script>
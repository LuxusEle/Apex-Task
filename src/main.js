import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './assets/style.css'

// Test Gemini connection on startup
import { testGeminiConnection } from './services/gemini'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Global error handler
app.config.errorHandler = (err, vm, info) => {
  console.error('Global error:', err, info)
  // You can add error reporting service here
}

// Test AI connection
testGeminiConnection().then(success => {
  if (success) {
    console.log('🤖 AI services ready')
  } else {
    console.warn('⚠️ AI services unavailable - some features may be limited')
  }
})

app.mount('#app')
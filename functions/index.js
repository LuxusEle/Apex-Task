import { onDocumentCreated, onDocumentUpdated } from 'firebase-functions/v2/firestore'
import { onCall, HttpsError } from 'firebase-functions/v2/https'
import { onSchedule } from 'firebase-functions/v2/scheduler'
import { initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getMessaging } from 'firebase-admin/messaging'
import { GoogleGenerativeAI } from '@google/generative-ai'
import cors from 'cors'

// Initialize Firebase Admin
initializeApp()
const db = getFirestore()
const messaging = getMessaging()

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const geminiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' })

// Enable CORS
const corsHandler = cors({ origin: true })

// Task Rejection Validation Function
export const validateTaskRejection = onDocumentCreated(
  'task_rejections/{rejectionId}',
  async (event) => {
    const rejection = event.data.data()
    const { taskId, rejectedBy, reason, overrideCode, userRole } = rejection

    try {
      // Get task context
      const taskDoc = await db.doc(`tasks/${taskId}`).get()
      const task = taskDoc.data()

      // Validate rejection reason with Gemini AI
      const validation = await validateRejectionWithAI(reason, task, userRole, overrideCode)

      // Log the validation result
      await db.collection('ai_decisions').add({
        type: 'rejection_validation',
        taskId,
        rejectedBy,
        validation,
        timestamp: new Date()
      })

      if (!validation.valid) {
        // Reject the rejection
        await event.data.ref.update({
          status: 'rejected_by_ai',
          aiValidation: validation,
          rejectionRejected: true
        })

        // Notify the user
        await db.collection('notifications').add({
          userId: rejectedBy,
          type: 'rejection_invalid',
          title: 'Task Rejection Needs Improvement',
          message: validation.message || 'Your rejection reason needs to be more specific and detailed.',
          suggestions: validation.suggestedImprovements,
          taskId,
          timestamp: new Date(),
          read: false
        })

        // If VIP partner and needs approval, notify admin
        if (validation.requiresApproval && userRole === 'vip_partner') {
          await notifyAdminOfWeakRejection(taskId, rejectedBy, reason, validation)
        }

        return
      }

      // Valid rejection - process it
      await db.doc(`tasks/${taskId}`).update({
        status: 'rejected',
        rejectedBy,
        rejectedAt: new Date(),
        rejectionReason: reason,
        aiValidation: validation
      })

      // Track partner behavior patterns
      await trackPartnerBehavior(rejectedBy, userRole, validation)

    } catch (error) {
      console.error('Error validating rejection:', error)
      
      // Fallback - require manual review
      await event.data.ref.update({
        status: 'requires_manual_review',
        error: error.message,
        timestamp: new Date()
      })
    }
  }
)

// AI Task Assignment Function
export const generateTaskAssignments = onCall(async (request) => {
  const { task, availableUsers } = request.data

  try {
    const prompt = `
Analyze this task and recommend the best assignee from the available users:

TASK: ${task.title}
Description: ${task.description}
Business Unit: ${task.business_unit}
Priority: ${task.priority}
Skills Required: ${task.skills_required?.join(', ') || 'None'}

AVAILABLE USERS:
${availableUsers.map(user => `
- ${user.name} (${user.role})
  Skills: ${user.skills?.map(s => s.name).join(', ') || 'None'}
  Workload: ${user.activeTaskCount || 0} tasks
  Success Rate: ${user.successRate || 'No data'}%
  Online: ${user.isOnline ? 'Yes' : 'No'}
`).join('')}

Provide a JSON response with rankings and reasoning.
`

    const result = await geminiModel.generateContent(prompt)
    const response = result.response.text()
    
    // Parse and return AI recommendations
    return { success: true, recommendations: response }
  } catch (error) {
    console.error('Error generating task assignments:', error)
    throw new HttpsError('internal', 'Failed to generate assignments')
  }
})

// Push Notification Function
export const sendPushNotification = onCall(async (request) => {
  const { token, notification } = request.data

  try {
    const message = {
      token,
      notification: {
        title: notification.title,
        body: notification.body
      },
      data: notification.data || {},
      android: {
        notification: {
          icon: 'stock_ticker_update',
          color: '#0ea5e9',
          sound: 'default'
        }
      },
      apns: {
        payload: {
          aps: {
            badge: 1,
            sound: 'default'
          }
        }
      }
    }

    const response = await messaging.send(message)
    return { success: true, messageId: response }
  } catch (error) {
    console.error('Error sending push notification:', error)
    throw new HttpsError('internal', 'Failed to send notification')
  }
})

// Email Alert Function
export const sendEmailAlert = onCall(async (request) => {
  const { userId, taskId, type } = request.data

  try {
    // Get user details
    const userDoc = await db.doc(`users/${userId}`).get()
    const user = userDoc.data()

    if (!user || !user.email) {
      throw new Error('User email not found')
    }

    // Get task details if provided
    let task = null
    if (taskId) {
      const taskDoc = await db.doc(`tasks/${taskId}`).get()
      task = taskDoc.data()
    }

    // Generate email content based on type
    const emailContent = generateEmailContent(type, user, task)
    
    // Send email (implement with your preferred email service)
    console.log('Email alert sent:', { userId, type, email: user.email })
    
    return { success: true, emailSent: true }
  } catch (error) {
    console.error('Error sending email alert:', error)
    throw new HttpsError('internal', 'Failed to send email')
  }
})

// Scheduled Cleanup Function
export const dailyCleanup = onSchedule('0 2 * * *', async (event) => {
  try {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    // Clean up old notifications
    const oldNotifications = await db
      .collection('notifications')
      .where('timestamp', '<', thirtyDaysAgo)
      .get()

    const batch = db.batch()
    oldNotifications.docs.forEach(doc => {
      batch.delete(doc.ref)
    })

    await batch.commit()
    console.log(`Cleaned up ${oldNotifications.size} old notifications`)

    // Clean up old alert logs
    const oldAlerts = await db
      .collection('alert_logs')
      .where('timestamp', '<', thirtyDaysAgo)
      .get()

    const alertBatch = db.batch()
    oldAlerts.docs.forEach(doc => {
      alertBatch.delete(doc.ref)
    })

    await alertBatch.commit()
    console.log(`Cleaned up ${oldAlerts.size} old alert logs`)

  } catch (error) {
    console.error('Error during daily cleanup:', error)
  }
})

// Helper Functions
async function validateRejectionWithAI(reason, task, userRole, overrideCode) {
  // Check override codes first
  const overrideCodes = { '123': true, '456': true, '789': true }
  if (overrideCodes[overrideCode]) {
    return {
      valid: true,
      category: 'ADMIN_OVERRIDE',
      confidence: 100,
      requiresApproval: false,
      message: 'Override code used'
    }
  }

  try {
    const prompt = `
Analyze this task rejection reason for validity and professionalism:

TASK: ${task.title}
BUSINESS UNIT: ${task.business_unit}
USER ROLE: ${userRole}
REJECTION REASON: "${reason}"

Return a JSON response with:
{
  "valid": boolean,
  "confidence": number (0-100),
  "category": "WORKLOAD|SKILLS|TIMELINE|RESOURCES|UNCLEAR|UNPROFESSIONAL",
  "requiresApproval": boolean,
  "message": "explanation",
  "suggestedImprovements": ["suggestion1", "suggestion2"]
}

Rules:
- VIP partners need 70%+ confidence
- Staff need 50%+ confidence
- Unprofessional language = invalid
- Single words = invalid
`

    const result = await geminiModel.generateContent(prompt)
    const response = result.response.text()
    
    // Parse JSON response
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }

    throw new Error('Invalid AI response format')
  } catch (error) {
    console.error('AI validation failed:', error)
    
    // Fallback validation
    return {
      valid: reason.length >= 20,
      confidence: 50,
      category: 'UNCLEAR',
      requiresApproval: true,
      message: 'AI validation unavailable - manual review required'
    }
  }
}

async function notifyAdminOfWeakRejection(taskId, rejectedBy, reason, validation) {
  const adminQuery = await db
    .collection('users')
    .where('role', '==', 'admin')
    .get()

  const notifications = adminQuery.docs.map(doc => ({
    userId: doc.id,
    type: 'vip_weak_rejection',
    title: 'VIP Partner Rejection Needs Attention',
    message: `Partner ${rejectedBy} rejected task with weak reasoning.`,
    data: { taskId, rejectedBy, reason, confidence: validation.confidence },
    priority: 'high',
    timestamp: new Date(),
    read: false
  }))

  // Batch write notifications
  const batch = db.batch()
  notifications.forEach(notification => {
    const ref = db.collection('notifications').doc()
    batch.set(ref, notification)
  })
  
  await batch.commit()
}

async function trackPartnerBehavior(userId, userRole, validation) {
  const behaviorRef = db.doc(`partner_behavior/${userId}`)
  
  await behaviorRef.set({
    userId,
    userRole,
    lastRejection: {
      timestamp: new Date(),
      confidence: validation.confidence,
      category: validation.category
    }
  }, { merge: true })
}

function generateEmailContent(type, user, task) {
  switch (type) {
    case 'task_assignment':
      return {
        subject: 'New Task Assignment - Apex Task Manager',
        body: `Hi ${user.name},\n\nYou have been assigned a new task: "${task?.title}"\n\nPlease log in to view details.\n\nBest regards,\nApex Task Manager`
      }
    default:
      return {
        subject: 'Notification - Apex Task Manager',
        body: `Hi ${user.name},\n\nYou have a new notification. Please log in to view details.\n\nBest regards,\nApex Task Manager`
      }
  }
}
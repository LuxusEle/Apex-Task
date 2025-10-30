import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getStorage, connectStorageEmulator } from 'firebase/storage'
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions'
import { getMessaging, getToken } from 'firebase/messaging'

const firebaseConfig = {
  apiKey: "AIzaSyDfdafXnvowDJdQcHgIKY6k1LrDORLp3WY",
  authDomain: "studio-1417219424-43dad.firebaseapp.com",
  projectId: "studio-1417219424-43dad",
  storageBucket: "studio-1417219424-43dad.firebasestorage.app",
  messagingSenderId: "316844638927",
  appId: "1:316844638927:web:3c87dded33f8196d7d2dba"
};

let app, db, auth, storage, functions

try {
  app = initializeApp(firebaseConfig);
  
  // Initialize only essential services initially
  auth = getAuth(app)
  
  // Set aggressive timeout for auth operations
  if (auth.settings) {
    auth.settings.timeout = 3000 // 3 seconds max
  }
  
  // Initialize other services lazily
  setTimeout(() => {
    try {
      db = getFirestore(app)
      storage = getStorage(app)
      functions = getFunctions(app)
    } catch (error) {
      console.warn('Non-critical Firebase services failed:', error)
    }
  }, 0)
  
  console.log('✅ Firebase auth initialized')
} catch (error) {
  console.error('❌ Firebase initialization failed:', error)
  // Create mock services for offline mode
  auth = {
    currentUser: null,
    onAuthStateChanged: (callback) => {
      callback(null)
      return () => {}
    }
  }
}

export { db, auth, storage, functions }
let messaging = null
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  try {
    messaging = getMessaging(app)
  } catch (error) {
    console.warn('Firebase messaging not available:', error)
  }
}
export { messaging }

// Development emulators (only in development)
if (import.meta.env.DEV && import.meta.env.VITE_USE_EMULATORS === 'true') {
  try {
    connectFirestoreEmulator(db, 'localhost', 8080)
    connectAuthEmulator(auth, 'http://localhost:9099')
    connectStorageEmulator(storage, 'localhost', 9199)
    connectFunctionsEmulator(functions, 'localhost', 5001)
    console.log('🔧 Firebase emulators connected')
  } catch (error) {
    console.warn('Firebase emulators connection failed:', error)
  }
}

// Initialize push notifications
export const initializePushNotifications = async () => {
  if (!messaging) {
    console.warn('Messaging not available')
    return null
  }

  try {
    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
    })
    console.log('FCM Token:', token)
    return token
  } catch (error) {
    console.error('Failed to get FCM token:', error)
    return null
  }
}

export default app
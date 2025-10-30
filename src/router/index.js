import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

// Lazy load components for better performance
const Dashboard = () => import('../views/Dashboard.vue')
const Tasks = () => import('../views/Tasks.vue')
const MyTasks = () => import('../views/MyTasks.vue')
const CreateTask = () => import('../views/CreateTask.vue')
const Analytics = () => import('../views/Analytics.vue')
const Team = () => import('../views/Team.vue')
const Settings = () => import('../views/Settings.vue')
const Profile = () => import('../views/Profile.vue')

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true, title: 'Dashboard' }
  },
  {
    path: '/tasks',
    name: 'Tasks',
    component: Tasks,
    meta: { requiresAuth: true, title: 'All Tasks' }
  },
  {
    path: '/my-tasks',
    name: 'MyTasks',
    component: MyTasks,
    meta: { requiresAuth: true, title: 'My Tasks' }
  },
  {
    path: '/create-task',
    name: 'CreateTask',
    component: CreateTask,
    meta: { 
      requiresAuth: true, 
      title: 'Create Task',
      requiresPermission: 'CREATE_TASK'
    }
  },
  {
    path: '/analytics',
    name: 'Analytics',
    component: Analytics,
    meta: { 
      requiresAuth: true, 
      title: 'Analytics',
      requiresRole: ['admin', 'vip_partner', 'manager']
    }
  },
  {
    path: '/team',
    name: 'Team',
    component: Team,
    meta: { 
      requiresAuth: true, 
      title: 'Team Management',
      requiresRole: ['admin', 'vip_partner', 'manager']
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    meta: { requiresAuth: true, title: 'Settings' }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true, title: 'Profile' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
    meta: { title: 'Page Not Found' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Wait for auth initialization
  if (!authStore.initialized) {
    await authStore.initialize()
  }
  
  // Set page title
  document.title = to.meta.title ? `${to.meta.title} - Apex Task Manager` : 'Apex Task Manager'
  
  // Check authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/')
    return
  }
  
  // Check role-based access
  if (to.meta.requiresRole && authStore.profile) {
    const userRole = authStore.profile.role
    const requiredRoles = Array.isArray(to.meta.requiresRole) ? to.meta.requiresRole : [to.meta.requiresRole]
    
    if (!requiredRoles.includes(userRole)) {
      // Redirect to dashboard with error message
      next({ name: 'Dashboard', query: { error: 'insufficient_permissions' } })
      return
    }
  }
  
  // Check specific permissions
  if (to.meta.requiresPermission && authStore.profile) {
    const permission = to.meta.requiresPermission
    const userRole = authStore.profile.role
    
    // Define permission mappings
    const permissions = {
      CREATE_TASK: ['admin', 'vip_partner', 'manager'],
      ASSIGN_TASK: ['admin', 'vip_partner'],
      VIEW_ALL_TASKS: ['admin'],
      MANAGE_TEAM: ['admin', 'vip_partner', 'manager']
    }
    
    if (permissions[permission] && !permissions[permission].includes(userRole)) {
      next({ name: 'Dashboard', query: { error: 'insufficient_permissions' } })
      return
    }
  }
  
  next()
})

export default router
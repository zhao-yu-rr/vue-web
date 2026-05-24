import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/dashboard/DashboardView.vue'),
    meta: { layout: 'default' },
  },
  {
    path: '/system',
    name: 'system',
    component: () => import('@/views/system/SystemManageView.vue'),
    meta: { layout: 'default', permission: 'SYSTEM' },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { layout: 'auth' },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/auth/RegisterView.vue'),
    meta: { layout: 'auth' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// ==================== 全局路由守卫 ====================

// 无需认证即可访问的路由（白名单）
const publicRoutes = ['/login', '/register']

router.beforeEach(async (to, from, next) => {
  // 公开路由直接放行
  if (publicRoutes.includes(to.path)) {
    return next()
  }

  // 动态导入 auth store（避免循环依赖）
  const { useAuthStore } = await import('@/stores/auth')
  const authStore = useAuthStore()

  // 无 token 直接跳转登录
  if (!authStore.token) {
    return next('/login')
  }

  // 每次访问受保护页面都请求 /info 接口验证 token 有效性
  try {
    await authStore.fetchUserInfo()
  } catch {
    // 获取失败（token 过期等），清除状态并跳转登录
    authStore.logout()
    return next('/login')
  }

  // 权限校验：路由定义了 meta.permission 时，检查用户是否拥有该权限
  const requiredPermission = to.meta?.permission
  if (requiredPermission && !authStore.hasPermission(requiredPermission)) {
    // 无权限，跳转首页（若首页也无权限则跳转登录）
    return next('/')
  }

  next()
})

export default router

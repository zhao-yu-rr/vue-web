import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { login as loginApi, register as registerApi, getUserInfo, logout as logoutApi } from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  // ========== 状态 ==========
  const token = ref(localStorage.getItem('token') || '')
  const user = ref(null)
  const isUserLoaded = ref(false)

  // ========== 计算属性 ==========
  const isLoggedIn = computed(() => !!token.value)
  const username = computed(() => user?.value?.user?.username || '')
  const nickname = computed(() => user?.value?.user?.nickname || '')

  /**
   * 当前用户拥有的权限编码列表
   * 兼容后端返回字符串数组或对象数组（含 permissionCode 字段）两种格式
   */
  const permissions = computed(() => {
    const raw = user.value?.permissions
    if (!Array.isArray(raw)) return []
    return raw.map((p) => (typeof p === 'string' ? p : p.permissionCode)).filter(Boolean)
  })

  // ========== 方法 ==========

  /**
   * 用户登录
   * @param {Object} params - { username, password }
   */
  async function login(params) {
    const res = await loginApi(params)
    console.log(res)
    if (res.data && res.data.token) {
      token.value = res.data.token
      localStorage.setItem('token', res.data.token)
    }
    return res
  }

  /**
   * 用户注册
   * @param {Object} params - { username, password, nickname, email, phone }
   */
  async function register(params) {
    const res = await registerApi(params)
    return res
  }

  /**
   * 判断当前用户是否拥有指定权限
   * @param {string} code - 权限编码
   * @returns {boolean}
   */
  function hasPermission(code) {
    return permissions.value.includes(code)
  }

  /**
   * 登出
   * 调用后端退出接口后清除本地状态
   */
  async function logout() {
    try {
      await logoutApi()
    } catch {
      // 即使接口失败也清除本地状态，保证前端能正常退出
    }
    token.value = ''
    user.value = null
    isUserLoaded.value = false
    localStorage.removeItem('token')
  }

  /**
   * 获取当前用户信息
   */
  async function fetchUserInfo() {
    const res = await getUserInfo()
    if (res.data) {
      user.value = res.data
    }
    return res
  }

  return { token, user, isLoggedIn, username, nickname, permissions, hasPermission, login, register, logout, fetchUserInfo }
})

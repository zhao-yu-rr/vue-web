import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { login as loginApi, register as registerApi, getUserInfo } from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  // ========== 状态 ==========
  const token = ref(localStorage.getItem('token') || '')
  const user = ref(null)
  const isUserLoaded = ref(false)

  // ========== 计算属性 ==========
  const isLoggedIn = computed(() => !!token.value)
  const username = computed(() => user.value?.username || '')
  const nickname = computed(() => user.value?.nickname || '')

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
   * 登出
   */
  function logout() {
    token.value = ''
    user.value = null
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

  return { token, user, isLoggedIn, username, nickname, login, register, logout, fetchUserInfo }
})

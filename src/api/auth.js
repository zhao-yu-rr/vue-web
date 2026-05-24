/**
 * 认证相关 API 接口
 *
 * 使用方式：
 *   import { login, register, getUserInfo } from '@/api/auth'
 */

import { get, post } from '@/utils/request'

/**
 * 用户注册
 * @param {Object} params - 注册参数
 * @param {string} params.username - 用户名
 * @param {string} params.password - 密码
 * @param {string} params.nickname - 昵称
 * @param {string} params.email - 邮箱
 * @param {string} params.phone - 手机号
 * @returns {Promise}
 */
export function register(params) {
  return post('/auth/register', params)
}

/**
 * 用户登录
 * @param {Object} params - 登录参数
 * @param {string} params.username - 用户名
 * @param {string} params.password - 密码
 * @returns {Promise}
 */
export function login(params) {
  return post('/auth/login', params)
 }

/**
 * 获取当前用户信息
 * @returns {Promise}
 */
export function getUserInfo() {
  return get('/auth/info')
}

/**
 * 用户退出登录
 * @returns {Promise}
 */
export function logout() {
  return post('/auth/logout')
}

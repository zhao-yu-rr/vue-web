/**
 * 用户管理相关 API 接口
 *
 * 使用方式：
 *   import { listUsers, getUserDetail, createUser, updateUser, deleteUser } from '@/api/user'
 */

import { get, post, put, del } from '@/utils/request'

/**
 * 分页查询用户列表
 * @param {Object} [params={}] - 查询参数
 * @param {number} [params.pageNum=1] - 页码
 * @param {number} [params.pageSize=10] - 每页条数
 * @param {string} [params.username] - 用户名（模糊搜索）
 * @param {string} [params.nickname] - 昵称（模糊搜索）
 * @param {number} [params.status] - 用户状态：0-禁用 1-启用
 * @returns {Promise}
 */
export function listUsers(params = {}) {
  return get('/user/list', params)
}

/**
 * 获取用户详情
 * @param {number} id - 用户ID
 * @returns {Promise}
 */
export function getUserDetail(id) {
  return get(`/user/${id}`)
}

/**
 * 创建用户
 * @param {Object} data - 创建参数
 * @param {string} data.username - 用户名（必填，3-20位，字母/数字/下划线）
 * @param {string} data.password - 密码（必填，6-20位）
 * @param {string} [data.nickname] - 昵称
 * @param {string} [data.email] - 邮箱
 * @param {string} [data.phone] - 手机号
 * @param {number[]} [data.roleIds] - 角色ID列表
 * @returns {Promise}
 */
export function createUser(data) {
  return post('/user', data)
}

/**
 * 更新用户信息
 * @param {number} id - 用户ID
 * @param {Object} data - 更新参数
 * @param {string} [data.nickname] - 昵称
 * @param {string} [data.email] - 邮箱
 * @param {string} [data.phone] - 手机号
 * @param {string} [data.avatar] - 头像
 * @param {number} [data.status] - 用户状态：0-禁用 1-启用
 * @returns {Promise}
 */
export function updateUser(id, data) {
  return put(`/user/${id}`, data)
}

/**
 * 删除用户
 * @param {number} id - 用户ID
 * @returns {Promise}
 */
export function deleteUser(id) {
  return del(`/user/${id}`)
}

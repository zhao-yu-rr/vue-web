/**
 * 角色管理相关 API 接口
 *
 * 使用方式：
 *   import { createRole, updateRole, deleteRole, listRoles, assignRoles } from '@/api/role'
 */

import { get, post, put, del } from '@/utils/request'

/**
 * 创建角色
 * @param {Object} data - 创建参数
 * @param {string} data.roleCode - 角色编码（必填，2-30位，大写字母开头，只能包含大写字母/数字/下划线）
 * @param {string} data.roleName - 角色名称（必填，2-30位）
 * @param {string} [data.description] - 角色描述
 * @returns {Promise}
 */
export function createRole(data) {
  return post('/role', data)
}

/**
 * 更新角色
 * @param {number} id - 角色ID
 * @param {Object} data - 更新参数
 * @param {string} data.roleName - 角色名称（必填，2-30位）
 * @param {string} [data.description] - 角色描述
 * @param {number} [data.status] - 角色状态
 * @returns {Promise}
 */
export function updateRole(id, data) {
  return put(`/role/${id}`, data)
}

/**
 * 删除角色
 * @param {number} id - 角色ID
 * @returns {Promise}
 */
export function deleteRole(id) {
  return del(`/role/${id}`)
}

/**
 * 获取角色详情
 * @param {number} id - 角色ID
 * @returns {Promise}
 */
export function getRoleDetail(id) {
  return get(`/role/${id}`)
}

/**
 * 获取角色列表
 * @returns {Promise}
 */
export function listRoles() {
  return get('/role/list')
}

/**
 * 给用户分配角色
 * @param {Object} data - 分配参数
 * @param {number} data.userId - 用户ID（必填）
 * @param {number[]} data.roleIds - 角色ID列表（必填）
 * @returns {Promise}
 */
export function assignRoles(data) {
  return post('/role/assign', data)
}

/**
 * 移除用户角色
 * @param {Object} data - 移除参数
 * @param {number} data.userId - 用户ID（必填）
 * @param {number[]} data.roleIds - 角色ID列表（必填）
 * @returns {Promise}
 */
export function removeRoles(data) {
  return del('/role/assign', data)
}

/**
 * 获取用户的角色列表
 * @param {number} userId - 用户ID
 * @returns {Promise}
 */
export function getUserRoles(userId) {
  return get(`/role/user/${userId}`)
}

/**
 * 获取角色的权限列表
 * @param {number} roleId - 角色ID
 * @returns {Promise}
 */
export function getRolePermissions(roleId) {
  return get(`/role/${roleId}/permissions`)
}

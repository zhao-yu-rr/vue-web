/**
 * 权限管理相关 API 接口
 *
 * 使用方式：
 *   import { createPermission, listPermissions, getPermissionTree, assignPermissions } from '@/api/permission'
 */

import { get, post, put, del } from '@/utils/request'

/**
 * 创建权限
 * @param {Object} data - 创建参数
 * @param {string} data.permissionCode - 权限编码（必填，2-50位，大写字母开头，只能包含大写字母/数字/下划线）
 * @param {string} data.permissionName - 权限名称（必填，2-50位）
 * @param {string} data.permissionType - 权限类型（必填，MENU | BUTTON | API）
 * @param {number} [data.parentId] - 父权限ID
 * @param {number} [data.sortOrder] - 排序号
 * @param {string} [data.path] - 前端路由路径
 * @param {string} [data.icon] - 图标
 * @param {string} [data.description] - 权限描述
 * @returns {Promise}
 */
export function createPermission(data) {
  return post('/permission', data)
}

/**
 * 更新权限
 * @param {number} id - 权限ID
 * @param {Object} data - 更新参数
 * @param {string} data.permissionName - 权限名称（必填，2-50位）
 * @param {number} [data.parentId] - 父权限ID
 * @param {number} [data.sortOrder] - 排序号
 * @param {string} [data.path] - 前端路由路径
 * @param {string} [data.icon] - 图标
 * @param {string} [data.description] - 权限描述
 * @param {number} [data.status] - 权限状态
 * @returns {Promise}
 */
export function updatePermission(id, data) {
  return put(`/permission/${id}`, data)
}

/**
 * 删除权限
 * @param {number} id - 权限ID
 * @returns {Promise}
 */
export function deletePermission(id) {
  return del(`/permission/${id}`)
}

/**
 * 获取权限详情
 * @param {number} id - 权限ID
 * @returns {Promise}
 */
export function getPermissionDetail(id) {
  return get(`/permission/${id}`)
}

/**
 * 获取权限列表
 * @returns {Promise}
 */
export function listPermissions() {
  return get('/permission/list')
}

/**
 * 获取权限树
 * @returns {Promise}
 */
export function getPermissionTree() {
  return get('/permission/tree')
}

/**
 * 给角色分配权限
 * @param {Object} data - 分配参数
 * @param {number} data.roleId - 角色ID（必填）
 * @param {number[]} data.permissionIds - 权限ID列表（必填）
 * @returns {Promise}
 */
export function assignPermissions(data) {
  return post('/permission/assign', data)
}

/**
 * 移除角色权限
 * @param {Object} data - 移除参数
 * @param {number} data.roleId - 角色ID（必填）
 * @returns {Promise}
 */
export function removePermissions(data) {
  return del('/permission/assign', data)
}

/**
 * 获取角色的权限列表
 * @param {number} roleId - 角色ID
 * @returns {Promise}
 */
export function getRolePermissions(roleId) {
  return get(`/permission/role/${roleId}`)
}

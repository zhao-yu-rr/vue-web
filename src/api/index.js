/**
 * API 接口统一导出
 *
 * 使用方式：
 *   import { login, register, getUserInfo } from '@/api'
 *   import { listUsers, createUser, updateUser, deleteUser } from '@/api'
 *   import { listRoles, createRole, assignRoles } from '@/api'
 *   import { listPermissions, getPermissionTree, assignPermissions } from '@/api'
 *   import { uploadFile, downloadFile, listFiles, deleteFile } from '@/api'
 */

// 认证模块
export { login, register, getUserInfo } from './auth'

// 用户管理
export {
  listUsers,
  getUserDetail,
  createUser,
  updateUser,
  deleteUser,
} from './user'

// 角色管理
export {
  createRole,
  updateRole,
  deleteRole,
  getRoleDetail,
  listRoles,
  assignRoles,
  removeRoles,
  getUserRoles,
  getRolePermissions,
} from './role'

// 权限管理
export {
  createPermission,
  updatePermission,
  deletePermission,
  getPermissionDetail,
  listPermissions,
  getPermissionTree,
  assignPermissions,
  removePermissions,
} from './permission'

// 文件管理
export { uploadFile, downloadFile, listFiles, deleteFile } from './file'

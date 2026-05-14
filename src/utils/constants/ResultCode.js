/**
 * 统一响应状态码
 *
 * 使用方式：
 *   import { ResultCode } from '@/utils'
 *   if (res.code === ResultCode.SUCCESS) { ... }
 *   if (res.code === ResultCode.TOKEN_EXPIRED) { ... }
 *
 *   或者获取消息文案：
 *   const msg = ResultCodeMessage[ResultCode.SUCCESS]  // '操作成功'
 */

// ========== 通用 ==========
export const SUCCESS = 200
export const FAIL = 500

// ========== 客户端错误 4xx ==========
export const BAD_REQUEST = 400
export const UNAUTHORIZED = 401
export const FORBIDDEN = 403
export const NOT_FOUND = 404
export const METHOD_NOT_ALLOWED = 405

// ========== 用户错误 1xxx ==========
export const USER_ALREADY_EXISTS = 1001
export const USER_NOT_FOUND = 1002
export const PASSWORD_ERROR = 1003
export const USER_DISABLED = 1004
export const TOKEN_INVALID = 1005
export const TOKEN_EXPIRED = 1006
export const TOKEN_KICKED = 1007

// ========== 角色错误 2xxx ==========
export const ROLE_ALREADY_EXISTS = 2001
export const ROLE_NOT_FOUND = 2002
export const ROLE_IN_USE = 2003

// ========== 权限错误 3xxx ==========
export const PERMISSION_ALREADY_EXISTS = 3001
export const PERMISSION_NOT_FOUND = 3002
export const PERMISSION_IN_USE = 3003

// ========== 文件错误 4xxx ==========
export const FILE_UPLOAD_FAILED = 4001
export const FILE_NOT_FOUND = 4002
export const FILE_DOWNLOAD_FAILED = 4003
export const FILE_DELETE_FAILED = 4004
export const FILE_SIZE_EXCEEDED = 4005
export const FILE_TYPE_NOT_SUPPORTED = 4006

// ========== 统一导出（作为命名空间对象） ==========
export const ResultCode = {
  // 通用
  SUCCESS,
  FAIL,

  // 客户端错误 4xx
  BAD_REQUEST,
  UNAUTHORIZED,
  FORBIDDEN,
  NOT_FOUND,
  METHOD_NOT_ALLOWED,

  // 用户错误 1xxx
  USER_ALREADY_EXISTS,
  USER_NOT_FOUND,
  PASSWORD_ERROR,
  USER_DISABLED,
  TOKEN_INVALID,
  TOKEN_EXPIRED,
  TOKEN_KICKED,

  // 角色错误 2xxx
  ROLE_ALREADY_EXISTS,
  ROLE_NOT_FOUND,
  ROLE_IN_USE,

  // 权限错误 3xxx
  PERMISSION_ALREADY_EXISTS,
  PERMISSION_NOT_FOUND,
  PERMISSION_IN_USE,

  // 文件错误 4xxx
  FILE_UPLOAD_FAILED,
  FILE_NOT_FOUND,
  FILE_DOWNLOAD_FAILED,
  FILE_DELETE_FAILED,
  FILE_SIZE_EXCEEDED,
  FILE_TYPE_NOT_SUPPORTED,
}

// ========== 状态码 → 消息文案映射 ==========
export const ResultCodeMessage = {
  [SUCCESS]: '操作成功',
  [FAIL]: '操作失败',

  [BAD_REQUEST]: '请求参数错误',
  [UNAUTHORIZED]: '未登录或Token已过期',
  [FORBIDDEN]: '没有相关权限',
  [NOT_FOUND]: '请求资源不存在',
  [METHOD_NOT_ALLOWED]: '请求方法不允许',

  [USER_ALREADY_EXISTS]: '用户名已存在',
  [USER_NOT_FOUND]: '用户不存在',
  [PASSWORD_ERROR]: '密码错误',
  [USER_DISABLED]: '用户已被禁用',
  [TOKEN_INVALID]: 'Token无效',
  [TOKEN_EXPIRED]: 'Token已过期',
  [TOKEN_KICKED]: '账号已在其他设备登录，请重新登录',

  [ROLE_ALREADY_EXISTS]: '角色编码已存在',
  [ROLE_NOT_FOUND]: '角色不存在',
  [ROLE_IN_USE]: '角色正在使用中，无法删除',

  [PERMISSION_ALREADY_EXISTS]: '权限编码已存在',
  [PERMISSION_NOT_FOUND]: '权限不存在',
  [PERMISSION_IN_USE]: '权限正在使用中，无法删除',

  [FILE_UPLOAD_FAILED]: '文件上传失败',
  [FILE_NOT_FOUND]: '文件不存在',
  [FILE_DOWNLOAD_FAILED]: '文件下载失败',
  [FILE_DELETE_FAILED]: '文件删除失败',
  [FILE_SIZE_EXCEEDED]: '文件大小超出限制',
  [FILE_TYPE_NOT_SUPPORTED]: '不支持的文件类型',
}

/**
 * 根据状态码获取对应的消息文案
 * @param {number} code - 状态码
 * @returns {string} 消息文案，未找到时返回 '未知错误'
 */
export function getMessage(code) {
  return ResultCodeMessage[code] || '未知错误'
}

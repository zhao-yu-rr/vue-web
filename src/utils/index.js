/**
 * utils 工具函数统一导出
 *
 * 使用方式：
 *   import { formatDate, get, post } from '@/utils'
 */

// 时间格式化
export { formatDate, timeAgo, getDate, isValidDate } from './format'

// HTTP 请求
export { get, post, put, patch, del, upload } from './request'
export { default as request } from './request'

// 响应状态码
export { ResultCode, ResultCodeMessage, getMessage } from './constants/ResultCode'

/**
 * Axios 请求封装
 *
 * 功能：
 * - 统一请求/响应拦截
 * - 自动携带 Token
 * - 统一错误处理
 * - 请求取消支持
 * - 支持 GET / POST / PUT / PATCH / DELETE 快捷方法
 */

import axios from 'axios'
import {ResultCode, getMessage, BAD_REQUEST, FORBIDDEN} from './constants/ResultCode'
import router from '@/router'

// 创建 axios 实例
const service = axios.create({
  // 从环境变量读取 baseURL
  baseURL: import.meta.env.VITE_API_BASE_URL,
  // 请求超时时间
  timeout: 15000,
  // 跨域请求时携带 cookie
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ==================== 请求拦截器 ====================
service.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取 token（可根据项目实际情况调整获取方式）
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // 开发环境下打印请求信息
    if (import.meta.env.VITE_DEBUG === 'true') {
      console.log(`[Request] ${config.method?.toUpperCase()} ${config.url}`, config.data || config.params)
    }

    return config
  },
  (error) => {
    console.error('[Request Error]', error)
    return Promise.reject(error)
  },
)

// ==================== 响应拦截器 ====================
service.interceptors.response.use(
  (response) => {
    const res = response.data

    // 开发环境下打印响应信息
    if (import.meta.env.VITE_DEBUG === 'true') {
      console.log(`[Response] ${response.config.url}`, res)
    }

    // 根据后端约定的返回结构判断（以下为常见结构示例，可按实际接口调整）
    // 示例：{ code: 200, data: {...}, message: 'success' }
    if (res.code === undefined) {
      // 未使用标准结构，直接返回 data
      return res
    }

    if (res.code !== ResultCode.SUCCESS && res.code !== 0) {
      // 业务错误处理
      handleBusinessError(res)
      return Promise.reject(new Error(`${res.message || getMessage(res.code)}: 错误代码:${res.traceId}`))
    }

    return res
  },
  (error) => {
    // HTTP 错误处理
    handleHttpError(error)
    return Promise.reject(error)
  },
)

// ==================== 错误处理 ====================

/**
 * 处理业务错误码
 * @param {number} code - 业务错误码
 * @param {string} message - 错误消息
 */
function handleBusinessError({code, message, traceId}) {
  const msg = message || getMessage(code)

  switch (code) {
    case ResultCode.UNAUTHORIZED:
    case ResultCode.TOKEN_INVALID:
    case ResultCode.TOKEN_EXPIRED:
    case ResultCode.TOKEN_KICKED:
      // Token 过期或无效，清除登录状态，跳转登录页
      localStorage.removeItem('token')
      console.warn(`[Auth] ${msg}: ${traceId}`)
      router.push('/login')
      break
    default:
      console.warn(`[Business Error] ${code}: ${message}: ${traceId}`)
  }
}

/**
 * 处理 HTTP 错误
 * @param {Object} error - axios 错误对象
 */
function handleHttpError(error) {
  if (error.response) {
    const { status } = error.response
    switch (status) {
      case ResultCode.BAD_REQUEST:
        console.error(`[HTTP ${status}] ${getMessage(status)}`)
        break
      case ResultCode.UNAUTHORIZED:
        localStorage.removeItem('token')
        console.error(`[HTTP ${status}] ${getMessage(status)}`)
        break
      case ResultCode.FORBIDDEN:
        console.error(`[HTTP ${status}] ${getMessage(status)}`)
        break
      case ResultCode.NOT_FOUND:
        console.error(`[HTTP ${status}] ${getMessage(status)}`)
        break
      case ResultCode.FAIL:
        console.error(`[HTTP ${status}] ${getMessage(status)}`)
        break
      default:
        console.error(`[HTTP ${status}] ${getMessage(status) || '请求异常'}`)
    }
  } else if (error.code === 'ECONNABORTED') {
    console.error('[Timeout] 请求超时，请稍后重试')
  } else {
    console.error('[Network] 网络异常，请检查网络连接')
  }
}

// ==================== 便捷请求方法 ====================

/**
 * GET 请求
 * @param {string} url - 请求地址
 * @param {Object} [params={}] - 查询参数
 * @param {Object} [config={}] - 额外 axios 配置
 * @returns {Promise}
 */
export function get(url, params = {}, config = {}) {
  return service.get(url, { params, ...config })
}

/**
 * POST 请求
 * @param {string} url - 请求地址
 * @param {Object} [data={}] - 请求体数据
 * @param {Object} [config={}] - 额外 axios 配置
 * @returns {Promise}
 */
export function post(url, data = {}, config = {}) {
  return service.post(url, data, config)
}

/**
 * PUT 请求
 * @param {string} url - 请求地址
 * @param {Object} [data={}] - 请求体数据
 * @param {Object} [config={}] - 额外 axios 配置
 * @returns {Promise}
 */
export function put(url, data = {}, config = {}) {
  return service.put(url, data, config)
}

/**
 * PATCH 请求
 * @param {string} url - 请求地址
 * @param {Object} [data={}] - 请求体数据
 * @param {Object} [config={}] - 额外 axios 配置
 * @returns {Promise}
 */
export function patch(url, data = {}, config = {}) {
  return service.patch(url, data, config)
}

/**
 * DELETE 请求
 * @param {string} url - 请求地址
 * @param {Object} [params={}] - 查询参数
 * @param {Object} [config={}] - 额外 axios 配置
 * @returns {Promise}
 */
export function del(url, params = {}, config = {}) {
  return service.delete(url, { params, ...config })
}

/**
 * 上传文件
 * @param {string} url - 上传地址
 * @param {FormData} formData - 文件表单数据
 * @param {Function} [onProgress] - 上传进度回调 (percent: number) => void
 * @param {Object} [config={}] - 额外 axios 配置
 * @returns {Promise}
 */
export function upload(url, formData, onProgress, config = {}) {
  return service.post(url, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100)
        onProgress(percent)
      }
    },
    ...config,
  })
}

// 导出 axios 实例（供特殊场景直接使用）
export default service

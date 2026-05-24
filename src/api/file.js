/**
 * 文件管理相关 API 接口
 *
 * 使用方式：
 *   import { uploadFile, downloadFile, listFiles, deleteFile } from '@/api/file'
 */

import { get, del, upload } from '@/utils/request'

/**
 * 上传文件
 * @param {FormData} formData - 文件表单数据（字段名：file）
 * @param {Function} [onProgress] - 上传进度回调 (percent: number) => void
 * @returns {Promise}
 */
export function uploadFile(formData, onProgress) {
  return upload('/file/upload', formData, onProgress)
}

/**
 * 下载文件
 * @param {number} id - 文件ID
 * @returns {Promise}
 */
export function downloadFile(id) {
  return get(`/file/download/${id}`, {}, { responseType: 'blob' })
}

/**
 * 获取文件列表
 * @returns {Promise}
 */
export function listFiles() {
  return get('/file/list')
}

/**
 * 删除文件
 * @param {number} id - 文件ID
 * @returns {Promise}
 */
export function deleteFile(id) {
  return del(`/file/${id}`)
}

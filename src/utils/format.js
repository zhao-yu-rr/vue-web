/**
 * 日期时间格式化工具函数
 */

/**
 * 日期格式化
 * @param {Date|string|number} date - 日期对象、时间戳或日期字符串
 * @param {string} [fmt='yyyy-MM-dd HH:mm:ss'] - 格式模板
 *   支持占位符：yyyy(年) MM(月) dd(日) HH(时) mm(分) ss(秒) SSS(毫秒)
 *   预定义格式：'date'(yyyy-MM-dd) 'datetime'(yyyy-MM-dd HH:mm:ss) 'time'(HH:mm:ss)
 * @returns {string} 格式化后的日期字符串
 */
export function formatDate(date, fmt = 'yyyy-MM-dd HH:mm:ss') {
  if (!date) return ''

  const d = new Date(date)
  if (isNaN(d.getTime())) return ''

  // 预定义格式映射
  const presetMap = {
    date: 'yyyy-MM-dd',
    datetime: 'yyyy-MM-dd HH:mm:ss',
    time: 'HH:mm:ss',
  }
  fmt = presetMap[fmt] || fmt

  const o = {
    'M+': d.getMonth() + 1, // 月份
    'd+': d.getDate(), // 日
    'H+': d.getHours(), // 小时
    'm+': d.getMinutes(), // 分
    's+': d.getSeconds(), // 秒
    'S+': d.getMilliseconds(), // 毫秒（仅保留前三位）
  }

  // 年份处理
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, String(d.getFullYear()).slice(4 - RegExp.$1.length))
  }

  // 其他字段处理
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      const val = o[k]
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? String(val) : String(val).padStart(2, '0'),
      )
    }
  }

  return fmt
}

/**
 * 相对时间描述（如"刚刚""3分钟前""2小时前"等）
 * @param {Date|string|number} date - 目标时间
 * @param {Date|string|number} [now=new Date()] - 当前参考时间
 * @returns {string} 相对时间描述
 */
export function timeAgo(date, now = new Date()) {
  const target = new Date(date)
  const current = new Date(now)
  if (isNaN(target.getTime())) return ''

  const diff = current.getTime() - target.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(months / 12)

  if (seconds < 0) return '刚刚'
  if (seconds < 60) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 30) return `${days}天前`
  if (months < 12) return `${months}个月前`
  return `${years}年前`
}

/**
 * 获取当前日期（可指定偏移量）
 * @param {number} [offset=0] - 偏移天数（正数为将来，负数为过去）
 * @param {string} [fmt='date'] - 返回格式
 * @returns {string} 格式化后的日期字符串
 */
export function getDate(offset = 0, fmt = 'date') {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  return formatDate(d, fmt)
}

/**
 * 判断是否为有效日期
 * @param {*} val - 待校验的值
 * @returns {boolean}
 */
export function isValidDate(val) {
  if (val instanceof Date) return !isNaN(val.getTime())
  if (typeof val === 'string' || typeof val === 'number') {
    return !isNaN(new Date(val).getTime())
  }
  return false
}

/**
 * utils/index.js — 纯函数工具集合
 * 所有通用工具函数放在这里，与业务逻辑无关。
 * 零依赖（不 import 任何项目模块）。
 */

let _idCounter = 0

/** 生成唯一消息 ID */
export function genId() {
  return `msg_${Date.now()}_${++_idCounter}`
}

/** 格式化时间戳为可读时间 */
export function formatTime(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  const now = new Date()
  const isToday = d.toDateString() === now.toDateString()
  if (isToday) {
    return d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }
  return d.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }) +
    ' ' + d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}

/** 截取文本前 N 个字符作为摘要 */
export function truncate(text, max = 30) {
  if (!text) return null
  if (text.length <= max) return text
  return text.slice(0, max) + '...'
}

/** 判断两条消息是否为同一天的 */
export function isSameDay(ts1, ts2) {
  if (!ts1 || !ts2) return false
  const d1 = new Date(ts1)
  const d2 = new Date(ts2)
  return d1.toDateString() === d2.toDateString()
}

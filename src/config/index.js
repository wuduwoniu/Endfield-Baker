/**
 * config/index.js — 集中配置
 * 所有 API 地址、模型名称、请求参数、UI 文本集中在此。
 * 其他任何文件禁止硬编码这些值。
 */

// ============================
// API 配置
// ============================
export const API = {
  BASE_URL: '/api/deepseek',
  CHAT_ENDPOINT: '/chat/completions',
  get CHAT_URL() { return this.BASE_URL + this.CHAT_ENDPOINT; },
}

// ============================
// 模型配置
// ============================
export const MODELS = {
  fast: { id: 'deepseek-chat', label: 'Fast', icon: '⚡' },
  expert: { id: 'deepseek-reasoner', label: 'Expert', icon: '✦' },
  vision: { id: 'deepseek-chat', label: 'Vision', icon: '📷' },
}

export const MODE_LIST = Object.entries(MODELS).map(([key, val]) => ({ key, ...val }))

// ============================
// 请求参数
// ============================
export const REQUEST = {
  temperature: 0.7,
  max_tokens: null, // null 表示使用模型默认值
  stream: true,
}

// ============================
// UI 文本
// ============================
export const UI_TEXT = {
  BRAND_NAME: 'DeepSeek',
  PLACEHOLDER: '输入消息...',
  SEND: '发送',
  STOP: '停止',
  NEW_CHAT: '＋ 新对话',
  HISTORY_TITLE: '历史对话',
  HISTORY_EMPTY: '暂无对话历史',
  WELCOME_TITLE: '有什么可以帮你的？',
  WELCOME_SUBTITLE: '选择下方模式开始对话，或直接输入问题',
  AI_NAME: 'DeepSeek',
  THINKING_LABEL: '深度思考过程',
  THINKING_PLACEHOLDER: '思考中...',
  SIDEBAR_OPEN_LABEL: '打开侧边栏',
  THEME_LIGHT_LABEL: '切换到浅色模式',
  THEME_DARK_LABEL: '切换到深色模式',
  EMPTY_REPLY: '（空回复）',
  ERROR_SEND: '发送失败，请重试',
}

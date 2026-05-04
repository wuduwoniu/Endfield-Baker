# DeepSeek Chat 仿制项目 — 设计文档

> 创建日期: 2026-05-04
> 状态: 已批准

## 概述

仿制 chat.deepseek.com 的 UI 布局，构建一个功能完整的 AI 聊天 Web 应用。第一期实现核心聊天功能 + 模式切换 + 历史记录侧边栏 + 深度思考链 + 深色模式。

## 架构规范

本项目采用严格四层架构，**禁止跨层污染**：

```
UI (components/hooks) → store → api → config
                         store → utils
                         api   → config
```

- **config/** — 零依赖。所有 API 地址、模型名称、请求参数、UI 文本集中管理
- **api/** — 只依赖 config。封装所有 DeepSeek API 通信，UI 层不直接写 fetch
- **store/** — 依赖 api + utils。统一管理对话列表、消息历史、加载状态
- **utils/** — 零依赖。纯函数工具集合，与业务逻辑无关
- **components/** — 只依赖 store（通过 Zustand selector）和 hooks，不直接 import api/config/utils

详见项目根目录 `CLAUDE.md`。

## 技术栈

| 类别 | 选择 |
|------|------|
| 框架 | React 19 + Vite 6 |
| 样式 | Tailwind CSS 3 (class-based dark mode) |
| 状态管理 | Zustand |
| Markdown | react-markdown + rehype-highlight + remark-gfm |
| API 格式 | DeepSeek 原生 API (OpenAI 兼容) |
| 流式传输 | Fetch + ReadableStream (SSE) |
| 构建工具 | Vite (含 proxy 解决跨域) |

## 项目结构

```
deepseek-clone/
├── public/
├── src/
│   ├── config/
│   │   └── index.js           # 集中配置（API、模型、UI文本）
│   ├── api/
│   │   └── index.js           # API 通信层（只依赖 config）
│   ├── store/
│   │   └── chatStore.js       # Zustand 状态管理（依赖 api + utils）
│   ├── utils/
│   │   └── index.js           # 纯函数工具（零依赖）
│   ├── components/
│   │   ├── Header/
│   │   │   ├── Header.jsx
│   │   │   ├── Logo.jsx
│   │   │   ├── ModeSelector.jsx
│   │   │   └── ThemeToggle.jsx
│   │   ├── Sidebar/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── NewChatButton.jsx
│   │   │   └── HistoryList.jsx
│   │   ├── Chat/
│   │   │   ├── ChatArea.jsx
│   │   │   ├── WelcomeScreen.jsx
│   │   │   ├── MessageList.jsx
│   │   │   ├── MessageBubble.jsx
│   │   │   └── MarkdownContent.jsx
│   │   ├── Input/
│   │   │   └── ChatInput.jsx
│   │   └── DeepThink/
│   │       └── DeepThinkBlock.jsx
│   ├── hooks/
│   │   ├── useChat.js
│   │   ├── useStream.js
│   │   └── useTheme.js
│   ├── styles/
│   │   └── index.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

## 组件树

```
App
├── ThemeProvider
├── Header
│   ├── Logo
│   ├── ModeSelector (Fast | Expert | Vision)
│   └── ThemeToggle (☀️/🌙)
├── Sidebar (滑动抽屉式)
│   ├── NewChatButton
│   └── HistoryList
│       └── HistoryItem[]
├── ChatArea (flex-grow, overflow-y-auto)
│   ├── WelcomeScreen (空状态)
│   └── MessageList
│       └── MessageBubble[]
│           ├── DeepThinkBlock (可折叠思考链)
│           └── MarkdownContent
└── InputArea (底部固定)
    └── ChatInput (textarea + send button)
```

## 核心组件设计

### Header 导航栏
- 高度 60px, flex 布局, border-bottom
- 左侧: 汉堡菜单按钮 (展开侧边栏)
- 中间: DeepSeek Logo
- 右侧: ModeSelector (pill/tab 式) + ThemeToggle
- 模式 Tab 状态: 已选(品牌色高亮) / 未选 / hover

### Sidebar 侧边栏
- 滑动抽屉式: `position: fixed; z-index: 1002`
- 背景遮罩: `z-index: 1001; background: rgba(0,0,0,0.4)`
- 宽度: 自适应 (PC ~280px, 移动端 100vw)
- 动画: CSS transition (transform + max-width)
- 底部渐变遮罩 (提示可滚动)
- 状态: 收起 / 展开 / 空(无历史) / 加载中

### MessageBubble 消息气泡
- 用户消息: 右对齐, 品牌色背景 (浅色: #4f6bff, 深色: #3b5bff)
- AI 消息: 左对齐, 浅灰背景 (浅色: #f0f1f3, 深色: #2a2a4a)
- 圆角: 16px (用户: 16 16 4 16, AI: 16 16 16 4)
- 最大宽度: 80%
- 状态: 流式输出中(光标动画) / 完成 / 错误 / 停止

### DeepThinkBlock 思考链
- 折叠面板: 可点击展开/收起
- 默认折叠, 思考中显示动画
- 内容: 纯文本推理过程
- 状态: 折叠(默认) / 展开 / 思考中(脉冲动画)

### ChatInput 输入框
- 多行 textarea, Shift+Enter 换行, Enter 发送
- 圆角 10px, 边框 1px solid
- 左侧可选: 文件上传图标
- 右侧: 发送按钮 (disable 当空或发送中)
- 状态: 空(placeholder) / 输入中 / 发送中(disabled)

## 数据流

### Zustand Store (chatStore)
```
{
  messages: [{ id, role, content, thinking, timestamp }],
  currentMode: 'fast' | 'expert' | 'vision',
  isStreaming: boolean,
  error: string | null,
  sidebarOpen: boolean,
  // actions
  sendMessage: (text) => void,
  stopStream: () => void,
  clearMessages: () => void,
  setMode: (mode) => void,
  toggleSidebar: () => void
}
```

### API 调用流程
1. 用户发送消息 → `chatStore.sendMessage(text)`
2. 添加用户消息到 messages → 清空输入框
3. 创建空的 AI 消息占位 → 调用 `api/deepseek.js`
4. `fetch POST /api/deepseek/chat/completions` (stream: true)
5. 通过 ReadableStream 逐 chunk 解析 SSE 响应
6. 每收到一个 chunk → 更新 messages 中的 AI 消息内容
7. 流结束 → 标记完成
8. 出错 → 标记 error 状态
9. 用户点击停止 → AbortController.abort()

### API 请求格式
```json
POST /api/deepseek/chat/completions
{
  "model": "deepseek-chat",
  "messages": [{ "role": "user", "content": "..." }],
  "stream": true,
  "temperature": 0.7
}
```

不同模式对应不同 model:
- Fast → `deepseek-chat`
- Expert → `deepseek-reasoner`
- Vision → `deepseek-chat` (含图片输入)

### Vite 代理配置
```js
proxy: {
  '/api/deepseek': {
    target: 'https://api.deepseek.com',
    changeOrigin: true,
    rewrite: path => path.replace('/api/deepseek', '')
  }
}
```

## 样式系统

### 设计 Token (Tailwind 扩展)
```js
colors: {
  brand:   { 50, 500(主色#4f6bff), 900 },
  bg:      { base, layer1, layer2 },
  label:   { primary, secondary, tertiary },
  border:  { l1, l2 },
  bubble:  { user-bg, user-text, ai-bg, ai-text }
}
borderRadius: {
  bubble: '16px', input: '10px', modal: '24px', capsule: '9999px'
}
```

### 深色模式
- 策略: Tailwind `dark:` class 策略 (手动切换)
- 用户点击 ThemeToggle → 切换 `<html>` 的 dark class
- ThemeProvider 读取/持久化 localStorage preference
- CSS 变量在 `:root` 和 `.dark` 中分别定义

## 不包含 (第一期范围外)

- 文件上传
- 复制/反馈/重新生成消息操作按钮
- 右侧模型参数工具栏
- 联网搜索
- 历史记录持久化 (IndexedDB)
- 认证/登录

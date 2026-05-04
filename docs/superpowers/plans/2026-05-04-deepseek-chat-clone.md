# DeepSeek Chat Clone Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a functional DeepSeek Chat UI clone with React + Vite + Tailwind CSS, supporting streaming chat, mode switching, sidebar history, and dark mode.

**Architecture:** Strict four-layer architecture enforced by CLAUDE.md:

```
UI (components/hooks) → store → api → config
                         store → utils
                         api   → config
```

- **config/** — 零依赖，所有 API 地址、模型名、请求参数、UI 文本集中管理
- **api/** — 只依赖 config，封装所有 fetch/SSE 通信
- **store/** — 依赖 api + utils，统一管理状态，UI 只读不写
- **utils/** — 零依赖，纯函数工具集

DeepSeek API 通过 Vite proxy 转发。SSE streaming 通过 ReadableStream 解析。主题通过 CSS 自定义属性 + `class="dark"` 控制。

**Tech Stack:** React 19, Vite 6, Tailwind CSS 3, Zustand 5, react-markdown, rehype-highlight, Vitest + @testing-library/react

---

### Task 1: Scaffold Project

**Files:**
- Create: `deepseek-clone/package.json`
- Create: `deepseek-clone/vite.config.js`
- Create: `deepseek-clone/index.html`
- Create: `deepseek-clone/src/main.jsx`
- Create: `deepseek-clone/src/App.jsx`

- [ ] **Step 1: Initialize the project**

```bash
cd ~/Desktop/deepseek-clone
npm create vite@latest . -- --template react 2>&1
```

- [ ] **Step 2: Install dependencies**

```bash
npm install zustand react-markdown rehype-highlight remark-gfm
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

- [ ] **Step 3: Configure Tailwind**

Write `deepseek-clone/tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: { 50: '#eef2ff', 500: '#4f6bff', 900: '#1e2a6a' },
        bg: { base: '#ffffff', layer1: '#f8f9fa', layer2: '#f0f1f3' },
        label: { primary: '#1a1a2e', secondary: '#666680', tertiary: '#999999' },
        border: { l1: '#e5e7eb', l2: '#d1d5db' },
        bubble: { 'user-bg': '#4f6bff', 'user-text': '#ffffff', 'ai-bg': '#f0f1f3', 'ai-text': '#1a1a2e' },
      },
      borderRadius: { bubble: '16px', input: '10px', modal: '24px', capsule: '9999px' },
    },
  },
  plugins: [],
}
```

Write `deepseek-clone/postcss.config.js`:

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 4: Write the Vite config with proxy**

Write `deepseek-clone/vite.config.js`:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/deepseek': {
        target: 'https://api.deepseek.com',
        changeOrigin: true,
        rewrite: path => path.replace('/api/deepseek', ''),
      },
    },
  },
})
```

- [ ] **Step 5: Write entry files**

Write `deepseek-clone/index.html`:

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>DeepSeek Chat</title>
    <link rel="icon" href="https://cdn.deepseek.com/chat/favicon.svg" type="image/svg+xml" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

Write `deepseek-clone/src/main.jsx`:

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

Write `deepseek-clone/src/App.jsx` (placeholder):

```jsx
export default function App() {
  return (
    <div className="h-screen flex flex-col bg-bg-base">
      <h1 className="p-4 text-label-primary">DeepSeek Chat</h1>
    </div>
  )
}
```

Create the styles directory and base CSS:

```bash
mkdir -p src/styles
```

Write `deepseek-clone/src/styles/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg-base: #ffffff;
  --bg-layer-1: #f8f9fa;
  --bg-layer-2: #f0f1f3;
  --label-primary: #1a1a2e;
  --label-secondary: #666680;
  --label-tertiary: #999999;
  --border-color: #e5e7eb;
  --bubble-user-bg: #4f6bff;
  --bubble-user-text: #ffffff;
  --bubble-ai-bg: #f0f1f3;
  --bubble-ai-text: #1a1a2e;
  --brand-primary: #4f6bff;
}

.dark {
  --bg-base: #1a1a2e;
  --bg-layer-1: #222240;
  --bg-layer-2: #2a2a4a;
  --label-primary: #eeeef8;
  --label-secondary: #9999b3;
  --label-tertiary: #666680;
  --border-color: #2e2e4a;
  --bubble-user-bg: #3b5bff;
  --bubble-user-text: #ffffff;
  --bubble-ai-bg: #2a2a4a;
  --bubble-ai-text: #eeeef8;
  --brand-primary: #4f6bff;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: var(--bg-base);
  color: var(--label-primary);
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: var(--label-tertiary);
  border-radius: 3px;
}
```

- [ ] **Step 6: Set up Vitest**

Write `deepseek-clone/vitest.config.js`:

```js
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test-setup.js',
  },
})
```

Write `deepseek-clone/src/test-setup.js`:

```js
import '@testing-library/jest-dom'
```

Add test script to `deepseek-clone/package.json` (in the `scripts` section):

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 7: Verify it builds**

```bash
cd ~/Desktop/deepseek-clone && npm run build
Expected: Build succeeds, outputs to dist/
```

- [ ] **Step 8: Commit**

```bash
cd ~/Desktop/deepseek-clone
git add -A && git commit -m "chore: scaffold project with Vite + React + Tailwind"
```

> **✅ Task 1 already completed.** Architecture config (`src/config/index.js`, `src/utils/index.js`, `CLAUDE.md`) created separately.

---

### Task 2: Theme System (useTheme hook + ThemeToggle)

**Files:**
- Create: `deepseek-clone/src/hooks/useTheme.js`
- Create: `deepseek-clone/src/components/Header/ThemeToggle.jsx`
- Modify: `deepseek-clone/src/App.jsx`

- [ ] **Step 1: Write the useTheme hook**

Write `deepseek-clone/src/hooks/useTheme.js`:

```js
import { useState, useEffect, useCallback } from 'react'

export function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme')
      if (saved) return saved === 'dark'
    }
    return false
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [isDark])

  const toggle = useCallback(() => setIsDark(prev => !prev), [])

  return { isDark, toggle }
}
```

- [ ] **Step 2: Write the ThemeToggle component**

Write `deepseek-clone/src/components/Header/ThemeToggle.jsx`:

```jsx
export default function ThemeToggle({ isDark, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="p-2 rounded-lg hover:bg-bg-layer2 transition-colors text-label-secondary hover:text-label-primary"
      aria-label={isDark ? '切换到浅色模式' : '切换到深色模式'}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  )
}
```

- [ ] **Step 3: Write ThemeToggle test**

Write `deepseek-clone/src/components/Header/ThemeToggle.test.jsx`:

```jsx
import { render, screen, fireEvent } from '@testing-library/react'
import ThemeToggle from './ThemeToggle'

describe('ThemeToggle', () => {
  it('renders sun icon when dark mode', () => {
    render(<ThemeToggle isDark={true} onToggle={() => {}} />)
    expect(screen.getByRole('button')).toHaveTextContent('☀️')
  })

  it('renders moon icon when light mode', () => {
    render(<ThemeToggle isDark={false} onToggle={() => {}} />)
    expect(screen.getByRole('button')).toHaveTextContent('🌙')
  })

  it('calls onToggle when clicked', () => {
    const onToggle = vi.fn()
    render(<ThemeToggle isDark={false} onToggle={onToggle} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onToggle).toHaveBeenCalledOnce()
  })
})
```

Run:

```bash
cd ~/Desktop/deepseek-clone && npx vitest run --reporter=verbose
Expected: Tests pass
```

- [ ] **Step 4: Commit**

```bash
git add src/hooks/useTheme.js src/components/Header/ThemeToggle.jsx src/components/Header/ThemeToggle.test.jsx
git commit -m "feat: add theme system with useTheme hook and ThemeToggle"
```

---

### Task 3: Zustand Chat Store (含 API 编排)

> **架构规则：** Store 是 API 调用的唯一入口。UI 组件只调用 `sendMessage()` / `stopStream()`，绝不直接 import api。
> Store 内部调用 `api/index.js` 的 `sendChatMessage()` / `parseSSEStream()` 完成流式通信。

**Files:**
- Create: `deepseek-clone/src/store/chatStore.js`
- Create: `deepseek-clone/src/store/chatStore.test.js`

- [ ] **Step 1: Write the chat store tests**

Write `deepseek-clone/src/store/chatStore.test.js`:

```js
import { describe, it, expect, beforeEach } from 'vitest'
import { useChatStore } from './chatStore'

describe('chatStore', () => {
  beforeEach(() => {
    useChatStore.setState({
      messages: [],
      currentMode: 'fast',
      isStreaming: false,
      error: null,
      sidebarOpen: false,
    })
  })

  it('starts with empty state', () => {
    const state = useChatStore.getState()
    expect(state.messages).toEqual([])
    expect(state.currentMode).toBe('fast')
    expect(state.isStreaming).toBe(false)
    expect(state.error).toBeNull()
    expect(state.sidebarOpen).toBe(false)
  })

  it('setMode changes current mode', () => {
    useChatStore.getState().setMode('expert')
    expect(useChatStore.getState().currentMode).toBe('expert')
  })

  it('toggleSidebar flips sidebar state', () => {
    useChatStore.getState().toggleSidebar()
    expect(useChatStore.getState().sidebarOpen).toBe(true)
    useChatStore.getState().toggleSidebar()
    expect(useChatStore.getState().sidebarOpen).toBe(false)
  })

  it('clearMessages empties messages array', () => {
    useChatStore.setState({ messages: [{ id: '1', role: 'user', content: 'hi' }] })
    useChatStore.getState().clearMessages()
    expect(useChatStore.getState().messages).toEqual([])
  })

  it('sendMessage adds user message and creates AI placeholder', async () => {
    const { sendMessage } = useChatStore.getState()
    // sendMessage is async but the message addition is synchronous before fetch
    sendMessage('Hello')
    const messages = useChatStore.getState().messages
    expect(messages).toHaveLength(2)
    expect(messages[0].role).toBe('user')
    expect(messages[0].content).toBe('Hello')
    expect(messages[1].role).toBe('assistant')
    expect(messages[1].content).toBe('')
    expect(messages[1].id).toBeDefined()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd ~/Desktop/deepseek-clone && npx vitest run --reporter=verbose
Expected: Test fails — "chatStore" module not found
```

- [ ] **Step 3: Write the chat store**

Write `deepseek-clone/src/store/chatStore.js`:

```js
import { create } from 'zustand'
import { genId } from '../utils'
import { sendChatMessage, parseSSEStream } from '../api'

let messageId = 0
const genMsgId = () => `msg_${Date.now()}_${++messageId}`

export const useChatStore = create((set, get) => ({
  messages: [],
  currentMode: 'fast',
  isStreaming: false,
  error: null,
  sidebarOpen: false,
  abortController: null,

  setMode: (mode) => set({ currentMode: mode }),

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  closeSidebar: () => set({ sidebarOpen: false }),

  clearMessages: () => set({ messages: [], error: null }),

  /** 发送消息 → 内部调用 api 完成流式通信 */
  sendMessage: async (text) => {
    const userMsg = { id: genMsgId(), role: 'user', content: text, timestamp: Date.now() }
    const assistantMsg = { id: genMsgId(), role: 'assistant', content: '', timestamp: Date.now() }

    set((state) => ({
      messages: [...state.messages, userMsg, assistantMsg],
      isStreaming: true,
      error: null,
    }))

    const controller = new AbortController()
    set({ abortController: controller })

    try {
      const { currentMode } = get()
      const apiMessages = get().messages.map(({ role, content }) => ({ role, content }))

      const body = await sendChatMessage(apiMessages, { mode: currentMode, signal: controller.signal })
      const generator = parseSSEStream(body)

      for await (const chunk of generator) {
        get().appendChunk(assistantMsg.id, chunk)
      }

      get().finishStream(assistantMsg.id)
    } catch (err) {
      if (err.name === 'AbortError') {
        get().stopStream()
      } else {
        set({ isStreaming: false, error: err.message })
      }
    }
  },

  stopStream: () => {
    const { abortController } = get()
    abortController?.abort()
    set({ isStreaming: false, abortController: null })
  },

  appendChunk: (assistantId, chunk) => {
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === assistantId ? { ...m, content: m.content + chunk } : m
      ),
    }))
  },

  finishStream: (assistantId) => {
    set((state) => ({
      isStreaming: false,
      abortController: null,
      messages: state.messages.map((m) =>
        m.id === assistantId ? { ...m, content: m.content || '(empty)' } : m
      ),
    }))
  },
}))
```

- [ ] **Step 4: Verify tests pass**

```bash
cd ~/Desktop/deepseek-clone && npx vitest run --reporter=verbose
Expected: All tests pass
```

- [ ] **Step 5: Commit**

```bash
git add src/store/chatStore.js src/store/chatStore.test.js
git commit -m "feat: add Zustand chat store with message state management"
```

---

### Task 4: DeepSeek API Client

> **架构规则：** API 层只依赖 `config/index.js`。不引用 store、不引用组件。
> UI 组件和其他模块禁止直接调用此模块 — 通过 store 间接使用。

**Files:**
- Create: `deepseek-clone/src/api/index.js`
- Create: `deepseek-clone/src/api/index.test.js`

- [ ] **Step 1: Write the API test**

Write `deepseek-clone/src/api/index.test.js`:

```js
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { buildChatBody, parseSSEStream } from './index'

describe('buildChatBody', () => {
  it('includes messages, stream, and temperature', () => {
    const body = buildChatBody([{ role: 'user', content: 'hi' }], { stream: true })
    expect(body.messages).toHaveLength(1)
    expect(body.stream).toBe(true)
    expect(body.temperature).toBeGreaterThanOrEqual(0)
  })
})

describe('parseSSEStream', () => {
  it('parses SSE chunks and yields content delta', async () => {
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode('data: {"choices":[{"delta":{"content":"Hello"}}]}\n\n'))
        controller.enqueue(encoder.encode('data: {"choices":[{"delta":{"content":" World"}}]}\n\n'))
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      },
    })

    const chunks = []
    for await (const chunk of parseSSEStream(stream)) {
      chunks.push(chunk)
    }
    expect(chunks).toEqual(['Hello', ' World'])
  })

  it('handles empty delta gracefully', async () => {
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode('data: {"choices":[{"delta":{}}]}\n\n'))
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      },
    })

    const chunks = []
    for await (const chunk of parseSSEStream(stream)) {
      chunks.push(chunk)
    }
    expect(chunks).toEqual([])
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd ~/Desktop/deepseek-clone && npx vitest run --reporter=verbose
Expected: Tests fail — module not found
```

- [ ] **Step 3: Write the API client**

Write `deepseek-clone/src/api/index.js`:

```js
import { API, MODELS, REQUEST, getAuthHeader } from '../config'

export function buildChatBody(messages, { mode = 'fast', stream = true } = {}) {
  return {
    model: MODELS[mode]?.id || MODELS.fast.id,
    messages: messages.map(({ role, content }) => ({ role, content })),
    stream,
    temperature: REQUEST.temperature,
    ...(REQUEST.max_tokens ? { max_tokens: REQUEST.max_tokens } : {}),
  }
}

export async function* parseSSEStream(body) {
  const reader = body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue
        const payload = line.slice(6)
        if (payload === '[DONE]') return
        try {
          const parsed = JSON.parse(payload)
          const delta = parsed.choices?.[0]?.delta?.content
          if (delta) yield delta
        } catch { /* skip malformed chunks */ }
      }
    }
  } finally {
    reader.releaseLock()
  }
}

export async function sendChatMessage(messages, { mode = 'fast', signal } = {}) {
  const response = await fetch(API.CHAT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(buildChatBody(messages, { mode })),
    signal,
  })

  if (!response.ok) {
    const errText = await response.text().catch(() => 'Unknown error')
    throw new Error(`API ${response.status}: ${errText}`)
  }

  return response.body
}
```

- [ ] **Step 4: Verify tests pass**

```bash
cd ~/Desktop/deepseek-clone && npx vitest run --reporter=verbose
Expected: All tests pass
```

- [ ] **Step 5: Commit**

```bash
git add src/api/
git commit -m "feat: add DeepSeek API client with SSE streaming"
```

---

### Task 5: Header Component

**Files:**
- Create: `deepseek-clone/src/components/Header/Logo.jsx`
- Create: `deepseek-clone/src/components/Header/ModeSelector.jsx`
- Create: `deepseek-clone/src/components/Header/Header.jsx`

- [ ] **Step 1: Write Logo component**

Write `deepseek-clone/src/components/Header/Logo.jsx`:

```jsx
export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L2 7v10l10 5 10-5V7l-10-5z" fill="url(#logo-grad)" />
        <defs>
          <linearGradient id="logo-grad" x1="2" y1="7" x2="22" y2="17">
            <stop stopColor="#4f6bff" />
            <stop offset="1" stopColor="#6c5ce7" />
          </linearGradient>
        </defs>
      </svg>
      <span className="text-lg font-semibold text-label-primary">DeepSeek</span>
    </div>
  )
}
```

- [ ] **Step 2: Write ModeSelector component**

Write `deepseek-clone/src/components/Header/ModeSelector.jsx`:

```jsx
const MODES = [
  { key: 'fast', label: 'Fast', icon: '⚡' },
  { key: 'expert', label: 'Expert', icon: '✦' },
  { key: 'vision', label: 'Vision', icon: '📷' },
]

export default function ModeSelector({ currentMode, onSelect }) {
  return (
    <div className="flex items-center gap-1 bg-bg-layer2 rounded-capsule p-0.5">
      {MODES.map(({ key, label, icon }) => (
        <button
          key={key}
          onClick={() => onSelect(key)}
          className={`
            flex items-center gap-1 px-3 py-1.5 text-sm rounded-capsule transition-all
            ${currentMode === key
              ? 'bg-white dark:bg-gray-700 text-brand-500 font-medium shadow-sm'
              : 'text-label-secondary hover:text-label-primary'
            }
          `}
        >
          <span>{icon}</span>
          <span>{label}</span>
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 3: Write Header component**

Write `deepseek-clone/src/components/Header/Header.jsx`:

```jsx
import { useChatStore } from '../../store/chatStore'
import Logo from './Logo'
import ModeSelector from './ModeSelector'
import ThemeToggle from './ThemeToggle'
import { useTheme } from '../../hooks/useTheme'

export default function Header() {
  const { currentMode, setMode, toggleSidebar } = useChatStore()
  const { isDark, toggle: toggleTheme } = useTheme()

  return (
    <header className="flex items-center justify-between h-[60px] px-5 border-b border-border-l1 bg-bg-base shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="text-xl text-label-secondary hover:text-label-primary transition-colors"
          aria-label="打开侧边栏"
        >
          ☰
        </button>
        <Logo />
      </div>

      <ModeSelector currentMode={currentMode} onSelect={setMode} />

      <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
    </header>
  )
}
```

- [ ] **Step 4: Write Header test**

Write `deepseek-clone/src/components/Header/Header.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react'
import Header from './Header'

vi.mock('../../store/chatStore', () => ({
  useChatStore: vi.fn(() => ({
    currentMode: 'fast',
    setMode: vi.fn(),
    toggleSidebar: vi.fn(),
  })),
}))

vi.mock('../../hooks/useTheme', () => ({
  useTheme: vi.fn(() => ({ isDark: false, toggle: vi.fn() })),
}))

describe('Header', () => {
  it('renders logo and mode selector', () => {
    render(<Header />)
    expect(screen.getByText('DeepSeek')).toBeInTheDocument()
    expect(screen.getByText('Fast')).toBeInTheDocument()
    expect(screen.getByText('Expert')).toBeInTheDocument()
    expect(screen.getByText('Vision')).toBeInTheDocument()
  })
})
```

```bash
cd ~/Desktop/deepseek-clone && npx vitest run --reporter=verbose
Expected: Tests pass
```

- [ ] **Step 5: Commit**

```bash
git add src/components/Header/
git commit -m "feat: add Header with Logo, ModeSelector, and ThemeToggle"
```

---

### Task 6: Sidebar Component

**Files:**
- Create: `deepseek-clone/src/components/Sidebar/NewChatButton.jsx`
- Create: `deepseek-clone/src/components/Sidebar/HistoryList.jsx`
- Create: `deepseek-clone/src/components/Sidebar/Sidebar.jsx`

- [ ] **Step 1: Write NewChatButton**

Write `deepseek-clone/src/components/Sidebar/NewChatButton.jsx`:

```jsx
import { useChatStore } from '../../store/chatStore'

export default function NewChatButton() {
  const clearMessages = useChatStore((s) => s.clearMessages)

  return (
    <button
      onClick={clearMessages}
      className="w-full py-2 px-3 border border-dashed border-border-l2 rounded-lg text-sm text-label-secondary hover:text-label-primary hover:border-label-secondary transition-colors"
    >
      ＋ 新对话
    </button>
  )
}
```

- [ ] **Step 2: Write HistoryList**

Write `deepseek-clone/src/components/Sidebar/HistoryList.jsx`:

```jsx
import { useChatStore } from '../../store/chatStore'

export default function HistoryList() {
  const messages = useChatStore((s) => s.messages)

  // derive conversation title from first user message
  const title = messages.find((m) => m.role === 'user')?.content?.slice(0, 30) || null

  if (!messages.length) {
    return (
      <div className="text-sm text-label-tertiary text-center py-8">
        暂无对话历史
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-border-l1 text-sm text-label-primary truncate">
        {title}{title && (messages.find(m => m.role === 'user')?.content?.length > 30 ? '...' : '')}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Write Sidebar**

Write `deepseek-clone/src/components/Sidebar/Sidebar.jsx`:

```jsx
import { useChatStore } from '../../store/chatStore'
import NewChatButton from './NewChatButton'
import HistoryList from './HistoryList'

export default function Sidebar() {
  const { sidebarOpen, closeSidebar } = useChatStore()

  return (
    <>
      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-[1001] bg-black/40 transition-opacity"
          onClick={closeSidebar}
        />
      )}

      {/* Drawer */}
      <aside
        className={`
          fixed top-0 left-0 bottom-0 z-[1002] w-[280px] max-w-[85vw]
          bg-bg-layer1 border-r border-border-l1
          flex flex-col gap-3 p-4
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-label-primary">历史对话</h2>
          <button
            onClick={closeSidebar}
            className="text-label-tertiary hover:text-label-primary text-lg"
          >
            ✕
          </button>
        </div>

        <NewChatButton />

        <div className="flex-1 overflow-y-auto">
          <HistoryList />
        </div>

        {/* Bottom gradient fade */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-bg-layer1 to-transparent" />
      </aside>
    </>
  )
}
```

- [ ] **Step 4: Write Sidebar test**

Write `deepseek-clone/src/components/Sidebar/Sidebar.test.jsx`:

```jsx
import { render, screen, fireEvent } from '@testing-library/react'
import Sidebar from './Sidebar'

const mockClose = vi.fn()

vi.mock('../../store/chatStore', () => ({
  useChatStore: vi.fn((selector) => {
    const state = {
      sidebarOpen: true,
      closeSidebar: mockClose,
      clearMessages: vi.fn(),
      messages: [],
    }
    return selector ? selector(state) : state
  }),
}))

describe('Sidebar', () => {
  it('renders when open', () => {
    render(<Sidebar />)
    expect(screen.getByText('历史对话')).toBeInTheDocument()
    expect(screen.getByText('＋ 新对话')).toBeInTheDocument()
  })

  it('shows empty state when no messages', () => {
    render(<Sidebar />)
    expect(screen.getByText('暂无对话历史')).toBeInTheDocument()
  })

  it('closes when overlay clicked', () => {
    render(<Sidebar />)
    const overlay = screen.getByRole('presentation')
    fireEvent.click(overlay)
    expect(mockClose).toHaveBeenCalled()
  })
})
```

```bash
cd ~/Desktop/deepseek-clone && npx vitest run --reporter=verbose
Expected: Tests pass
```

- [ ] **Step 5: Commit**

```bash
git add src/components/Sidebar/
git commit -m "feat: add Sidebar with drawer, overlay, and history list"
```

---

### Task 7: ChatArea & WelcomeScreen

**Files:**
- Create: `deepseek-clone/src/components/Chat/WelcomeScreen.jsx`
- Create: `deepseek-clone/src/components/Chat/ChatArea.jsx`

- [ ] **Step 1: Write WelcomeScreen**

Write `deepseek-clone/src/components/Chat/WelcomeScreen.jsx`:

```jsx
export default function WelcomeScreen() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 px-4">
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
          <path d="M12 2L2 7v10l10 5 10-5V7l-10-5z" />
        </svg>
      </div>
      <h1 className="text-2xl font-semibold text-label-primary">有什么可以帮你的？</h1>
      <p className="text-sm text-label-secondary">选择下方模式开始对话，或直接输入问题</p>
    </div>
  )
}
```

- [ ] **Step 2: Write ChatArea**

Write `deepseek-clone/src/components/Chat/ChatArea.jsx`:

```jsx
import { useChatStore } from '../../store/chatStore'
import WelcomeScreen from './WelcomeScreen'
import MessageList from './MessageList'

export default function ChatArea() {
  const messages = useChatStore((s) => s.messages)

  if (messages.length === 0) {
    return <WelcomeScreen />
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <MessageList messages={messages} />
    </div>
  )
}
```

- [ ] **Step 3: Write ChatArea test**

Write `deepseek-clone/src/components/Chat/ChatArea.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react'
import ChatArea from './ChatArea'

vi.mock('../../store/chatStore', () => ({
  useChatStore: vi.fn((selector) => {
    const state = { messages: [] }
    return selector ? selector(state) : state
  }),
}))

describe('ChatArea', () => {
  it('shows welcome screen when no messages', () => {
    render(<ChatArea />)
    expect(screen.getByText('有什么可以帮你的？')).toBeInTheDocument()
  })
})
```

```bash
cd ~/Desktop/deepseek-clone && npx vitest run --reporter=verbose
Expected: Tests pass
```

- [ ] **Step 4: Commit**

```bash
git add src/components/Chat/ChatArea.jsx src/components/Chat/WelcomeScreen.jsx src/components/Chat/ChatArea.test.jsx
git commit -m "feat: add ChatArea and WelcomeScreen"
```

---

### Task 8: MessageList & MessageBubble

**Files:**
- Create: `deepseek-clone/src/components/Chat/MarkdownContent.jsx`
- Create: `deepseek-clone/src/components/Chat/MessageBubble.jsx`
- Create: `deepseek-clone/src/components/Chat/MessageList.jsx`

- [ ] **Step 1: Write MarkdownContent**

Write `deepseek-clone/src/components/Chat/MarkdownContent.jsx`:

```jsx
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'

// import a highlight.js theme for code blocks
import 'highlight.js/styles/github.css'

export default function MarkdownContent({ content }) {
  return (
    <div className="prose prose-sm max-w-none dark:prose-invert">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
```

- [ ] **Step 2: (跳过 — DeepThinkBlock 已移除)**

- [ ] **Step 3: Write MessageBubble**

Write `deepseek-clone/src/components/Chat/MessageBubble.jsx`:

```jsx
import MarkdownContent from './MarkdownContent'

export default function MessageBubble({ message, isStreaming }) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[80%] ${isUser ? '' : 'w-full'}`}>
        {!isUser && (
          <div className="text-sm font-medium text-label-secondary mb-1 px-1">
            DeepSeek
          </div>
        )}

        <div
          className={`
            px-4 py-3
            ${isUser
              ? 'bg-bubble-user-bg text-bubble-user-text rounded-[16px_16px_4px_16px]'
              : 'bg-bubble-ai-bg text-bubble-ai-text rounded-[16px_16px_16px_4px]'
            }
          `}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
          ) : (
            <>
              <MarkdownContent content={message.content} />
              {isStreaming && !message.content && (
                <span className="inline-block w-2 h-4 bg-label-secondary animate-pulse rounded-sm" />
              )}
              {isStreaming && message.content && (
                <span className="inline-block w-1 h-4 bg-brand-500 ml-0.5 animate-pulse rounded-sm" />
              )}
            </>
          )}
        </div>

        {message.error && (
          <p className="text-red-500 text-xs mt-1 px-1">发送失败，请重试</p>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Write MessageList**

Write `deepseek-clone/src/components/Chat/MessageList.jsx`:

```jsx
import { useEffect, useRef } from 'react'
import { useChatStore } from '../../store/chatStore'
import MessageBubble from './MessageBubble'

export default function MessageList({ messages }) {
  const isStreaming = useChatStore((s) => s.isStreaming)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4">
      <div className="max-w-[768px] mx-auto">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isStreaming={isStreaming && msg === messages[messages.length - 1] && msg.role === 'assistant'}
          />
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Write tests**

Write `deepseek-clone/src/components/Chat/MessageBubble.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react'
import MessageBubble from './MessageBubble'

describe('MessageBubble', () => {
  it('renders user message with right alignment', () => {
    const msg = { id: '1', role: 'user', content: 'Hello' }
    const { container } = render(<MessageBubble message={msg} isStreaming={false} />)
    expect(container.firstChild).toHaveClass('justify-end')
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('renders assistant message with left alignment', () => {
    const msg = { id: '2', role: 'assistant', content: 'Hi there' }
    const { container } = render(<MessageBubble message={msg} isStreaming={false} />)
    expect(container.firstChild).toHaveClass('justify-start')
    expect(screen.getByText('DeepSeek')).toBeInTheDocument()
  })
})
```

```bash
cd ~/Desktop/deepseek-clone && npx vitest run --reporter=verbose
Expected: Tests pass
```

- [ ] **Step 6: Commit**

```bash
git add src/components/Chat/MessageBubble.jsx src/components/Chat/MessageList.jsx src/components/Chat/MarkdownContent.jsx src/components/Chat/MessageBubble.test.jsx
git commit -m "feat: add MessageList, MessageBubble, MarkdownContent"
```

---

### Task 9: ChatInput

> **架构规则：** UI 组件不直接 import api。只调用 `useChatStore` 的 `sendMessage()` / `stopStream()`。
> Store 内部完成所有 API 通信和状态更新。

**Files:**
- Create: `deepseek-clone/src/components/Input/ChatInput.jsx`
- Create: `deepseek-clone/src/components/Input/ChatInput.test.jsx`

- [ ] **Step 1: Write ChatInput**

Write `deepseek-clone/src/components/Input/ChatInput.jsx`:

```jsx
import { useState, useRef, useCallback } from 'react'
import { useChatStore } from '../../store/chatStore'
import { UI_TEXT } from '../../config'

export default function ChatInput() {
  const [text, setText] = useState('')
  const isStreaming = useChatStore((s) => s.isStreaming)
  const sendMessage = useChatStore((s) => s.sendMessage)
  const stopStream = useChatStore((s) => s.stopStream)

  const handleSend = useCallback(() => {
    const trimmed = text.trim()
    if (!trimmed || isStreaming) return
    setText('')
    sendMessage(trimmed)
  }, [text, isStreaming, sendMessage])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInput = (e) => {
    setText(e.target.value)
    const el = e.target
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 200) + 'px'
  }

  return (
    <div className="border-t border-border-l1 bg-bg-base px-4 py-3">
      <div className="max-w-[768px] mx-auto">
        <div className="flex items-end gap-2 border border-border-l1 rounded-input bg-bg-base px-3 py-2 focus-within:border-brand-500 transition-colors shadow-sm">
          <textarea
            value={text}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={UI_TEXT.PLACEHOLDER}
            rows={1}
            disabled={isStreaming}
            className="flex-1 resize-none outline-none text-sm text-label-primary placeholder-label-tertiary bg-transparent max-h-[200px] leading-relaxed"
          />

          {isStreaming ? (
            <button
              onClick={stopStream}
              className="shrink-0 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-colors"
            >
              {UI_TEXT.STOP}
            </button>
          ) : (
            <button
              onClick={handleSend}
              disabled={!text.trim()}
              className="shrink-0 px-3 py-1.5 bg-brand-500 hover:bg-brand-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors"
            >
              {UI_TEXT.SEND}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Write ChatInput test**

Write `deepseek-clone/src/components/Input/ChatInput.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react'
import ChatInput from './ChatInput'

vi.mock('../../store/chatStore', () => ({
  useChatStore: vi.fn((selector) => {
    const state = {
      isStreaming: false,
      sendMessage: vi.fn(),
      stopStream: vi.fn(),
    }
    return selector ? selector(state) : state
  }),
}))

describe('ChatInput', () => {
  it('renders textarea and send button', () => {
    render(<ChatInput />)
    expect(screen.getByPlaceholderText('输入消息...')).toBeInTheDocument()
    expect(screen.getByText('发送')).toBeInTheDocument()
  })

  it('send button is disabled when input is empty', () => {
    render(<ChatInput />)
    expect(screen.getByText('发送')).toBeDisabled()
  })
})
```

```bash
cd ~/Desktop/deepseek-clone && npx vitest run --reporter=verbose
Expected: Tests pass
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Input/
git commit -m "feat: add ChatInput with send/stop and auto-resize"
```

---

### Task 10: Wire App Shell

**Files:**
- Modify: `deepseek-clone/src/App.jsx`
- Create: `deepseek-clone/src/App.test.jsx`

- [ ] **Step 1: Write App shell**

Write `deepseek-clone/src/App.jsx`:

```jsx
import { useChatStore } from './store/chatStore'
import Header from './components/Header/Header'
import Sidebar from './components/Sidebar/Sidebar'
import ChatArea from './components/Chat/ChatArea'
import ChatInput from './components/Input/ChatInput'

export default function App() {
  return (
    <div className="h-screen flex flex-col bg-bg-base">
      <Header />
      <Sidebar />
      <ChatArea />
      <ChatInput />
    </div>
  )
}
```

- [ ] **Step 2: Write App test**

Write `deepseek-clone/src/App.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react'
import App from './App'

vi.mock('./store/chatStore', () => ({
  useChatStore: vi.fn((selector) => {
    const state = { messages: [], isStreaming: false }
    return selector ? selector(state) : state
  }),
}))

describe('App', () => {
  it('renders main layout with header and welcome', () => {
    render(<App />)
    expect(screen.getByText('DeepSeek')).toBeInTheDocument()
    expect(screen.getByText('有什么可以帮你的？')).toBeInTheDocument()
  })
})
```

```bash
cd ~/Desktop/deepseek-clone && npx vitest run --reporter=verbose
Expected: All tests pass
```

- [ ] **Step 3: Final build check**

```bash
cd ~/Desktop/deepseek-clone && npm run build
Expected: Build succeeds
```

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx src/App.test.jsx
git commit -m "feat: wire up App shell with all components"
```

---

### Task 11: Integrate Streaming Chat Flow

**Files:**
- Modify: `deepseek-clone/src/components/Input/ChatInput.jsx` (add mode support to API call)
- No new files — this task wires the existing API client into the full send flow

This task is already embedded in Task 9's ChatInput implementation (the `handleSend` function calls `sendChatMessage` and `parseSSEStream`). Confirm the full loop works end-to-end:

- [ ] **Step 1: Create .env file for local dev**

```bash
echo "VITE_DEEPSEEK_API_KEY=your-api-key-here" > .env
```

- [ ] **Step 2: Verify dev server starts**

```bash
cd ~/Desktop/deepseek-clone && npm run dev
Expected: Dev server starts on localhost:5173 (or similar)
```

- [ ] **Step 3: Commit**

```bash
git add .env.example
git commit -m "chore: add .env.example for API key configuration"
```

---

## Spec Coverage Check

| Spec Requirement | Task |
|-----------------|------|
| Vite + React + Tailwind scaffold | Task 1 |
| CSS variables for light/dark theme | Task 1 (index.css) |
| Tailwind config with design tokens | Task 1 (tailwind.config.js) |
| Zustand chat store | Task 3 |
| DeepSeek API client with SSE | Task 4 |
| Header with Logo | Task 5 |
| ModeSelector (Fast/Expert/Vision) | Task 5 |
| ThemeToggle + useTheme hook | Task 2 |
| Sidebar drawer with overlay | Task 6 |
| WelcomeScreen (empty state) | Task 7 |
| MessageList + MessageBubble | Task 8 |
| MarkdownContent (react-markdown) | Task 8 |
| DeepThinkBlock (collapsible thinking) | ❌ 已移除 |
| ChatInput with send/stop | Task 9 |
| Streaming full loop integration | Task 11 |
| All components wired in App | Task 10 |

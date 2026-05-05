# 表情贴图模块 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 Emoji 表情弹窗基础上新增"表情贴图"标签切换，支持 160 张贴图（game/ 112 + skland/ 48），贴图独立成消息或有文字时加入队列依次发送。

**Architecture:** 左侧竖排标签切换 EmojiGrid / StickerGrid，贴图 key→路径映射放 config 层，store 新增 sendSticker/sendStickerReply，MessageBubble 按 contentType 分支渲染。

**Tech Stack:** React 19, Vite 8, Tailwind CSS 3, Zustand 5, Vitest, jsdom

---

## File Structure

```
src/config/stickers.js              NEW — 配置层：160 个贴图 key + getStickerSrc()
src/config/stickers.test.js         NEW — 配置层测试
public/baker-assets/stickers/       NEW — 贴图素材目录
  game/sticker_game_001.png ~ 112.png
  skland/sticker_skland_001.webp ~ 048.webp
src/components/Input/
  EmojiPanel.jsx → StickerPanel.jsx  RENAME + REFACTOR — 左侧标签 + 内容区
  EmojiPanel.test.jsx → StickerPanel.test.jsx  RENAME + EXTEND
  ChatInput.jsx                      MODIFY — stickerQueue + 拆分发送
  ChatInput.test.jsx                 EXTEND — 贴图发送逻辑
src/store/chatStore.js               MODIFY — +sendSticker +sendStickerReply
src/store/chatStore.test.js          EXTEND — sticker actions
src/components/Chat/
  MessageBubble.jsx                  MODIFY — contentType: 'sticker' 分支
  MessageBubble.test.jsx             EXTEND — 贴图气泡
```

---

### Task 1: Copy + rename sticker assets to public/baker-assets/stickers/

**Files:**
- Create: `public/baker-assets/stickers/game/sticker_game_001.png` ~ `sticker_game_112.png`
- Create: `public/baker-assets/stickers/skland/sticker_skland_001.webp` ~ `sticker_skland_048.webp`

- [ ] **Step 1: Run the copy+rename script**

```bash
SRC="D:/My Home/AI project/public/baker-assets/baker-dx-master/assets/extracted/sticker"
DST="D:/My Home/AI project/public/baker-assets/stickers"

mkdir -p "$DST/game" "$DST/skland"

# game: sort files naturally, rename to sticker_game_001~112.png
i=1
for f in $(ls "$SRC/game/" | sort -V); do
  num=$(printf "%03d" $i)
  cp "$SRC/game/$f" "$DST/game/sticker_game_${num}.png"
  i=$((i+1))
done

# skland: sort by name, rename to sticker_skland_001~048.webp
i=1
for f in $(ls "$SRC/skland/" | sort); do
  num=$(printf "%03d" $i)
  cp "$SRC/skland/$f" "$DST/skland/sticker_skland_${num}.webp"
  i=$((i+1))
done
```

- [ ] **Step 2: Verify file counts**

Run: `ls "$DST/game/" | wc -l && ls "$DST/skland/" | wc -l`
Expected: `112` and `48`

- [ ] **Step 3: Commit**

```bash
git add public/baker-assets/stickers/
git commit -m "feat: add 160 sticker assets (game 112 + skland 48) with unified naming"
```

---

### Task 2: Create src/config/stickers.js

**Files:**
- Create: `src/config/stickers.js`

- [ ] **Step 1: Write the config file**

```js
const BAKER = '/baker-assets'

export const STICKER_KEYS = (() => {
  const keys = []
  for (let i = 1; i <= 112; i++) {
    keys.push(`sticker_game_${String(i).padStart(3, '0')}`)
  }
  for (let i = 1; i <= 48; i++) {
    keys.push(`sticker_skland_${String(i).padStart(3, '0')}`)
  }
  return keys
})()

export function getStickerSrc(key) {
  const m = key.match(/^sticker_(game|skland)_(\d{3})$/)
  if (!m) return null
  const category = m[1]
  const num = m[2]
  const ext = category === 'skland' ? 'webp' : 'png'
  return `${BAKER}/stickers/${category}/sticker_${category}_${num}.${ext}`
}
```

- [ ] **Step 2: Verify the module loads**

Run: `node -e "import('./src/config/stickers.js').then(m => console.log(m.STICKER_KEYS.length, m.getStickerSrc('sticker_game_001')))"` (if ESM) — or just trust the test in Task 3.

- [ ] **Step 3: Commit**

```bash
git add src/config/stickers.js
git commit -m "feat: add stickers config with 160 keys and getStickerSrc"
```

---

### Task 3: Create src/config/stickers.test.js

**Files:**
- Create: `src/config/stickers.test.js`

- [ ] **Step 1: Write the failing test (all tests written, they fail because stickers.js doesn't exist yet)**

```js
import { STICKER_KEYS, getStickerSrc } from './stickers'

describe('stickers config', () => {
  it('has 160 sticker keys (112 game + 48 skland)', () => {
    expect(STICKER_KEYS).toHaveLength(160)
  })

  it('game keys are formatted correctly', () => {
    expect(STICKER_KEYS[0]).toBe('sticker_game_001')
    expect(STICKER_KEYS[111]).toBe('sticker_game_112')
  })

  it('skland keys follow game keys', () => {
    expect(STICKER_KEYS[112]).toBe('sticker_skland_001')
    expect(STICKER_KEYS[159]).toBe('sticker_skland_048')
  })

  it('getStickerSrc returns correct game PNG path', () => {
    expect(getStickerSrc('sticker_game_001')).toBe('/baker-assets/stickers/game/sticker_game_001.png')
    expect(getStickerSrc('sticker_game_112')).toBe('/baker-assets/stickers/game/sticker_game_112.png')
  })

  it('getStickerSrc returns correct skland WEBP path', () => {
    expect(getStickerSrc('sticker_skland_001')).toBe('/baker-assets/stickers/skland/sticker_skland_001.webp')
    expect(getStickerSrc('sticker_skland_048')).toBe('/baker-assets/stickers/skland/sticker_skland_048.webp')
  })

  it('getStickerSrc returns null for unknown key', () => {
    expect(getStickerSrc('sticker_nonexistent')).toBeNull()
    expect(getStickerSrc('invalid_format')).toBeNull()
  })

  it('no duplicate keys', () => {
    expect(new Set(STICKER_KEYS).size).toBe(STICKER_KEYS.length)
  })
})
```

- [ ] **Step 2: Run test to verify they pass**

Run: `npx vitest run src/config/stickers.test.js`
Expected: 7/7 pass (stickers.js is already written in Task 2)

- [ ] **Step 3: Commit**

```bash
git add src/config/stickers.test.js
git commit -m "test: add stickers config tests (7 cases)"
```

---

### Task 4: Rename EmojiPanel → StickerPanel, add tab system

**Files:**
- Rename: `src/components/Input/EmojiPanel.jsx` → `src/components/Input/StickerPanel.jsx`
- Modify: `src/components/Input/ChatInput.jsx` (update import path)

- [ ] **Step 1: Rename the file, rewrite with tab system**

Write `src/components/Input/StickerPanel.jsx`:

```jsx
import { useState } from 'react'
import { EMOJI_KEYS, getEmojiSrc } from '../../config/emojis'
import { STICKER_KEYS, getStickerSrc } from '../../config/stickers'

const BAKER = '/baker-assets'

const TABS = [
  { key: 'emoji', icon: `${BAKER}/icons/chat_emoji.png`, label: 'Emoji' },
  { key: 'sticker', icon: `${BAKER}/icons/icon_sns_chat_emoticon.png`, label: '贴图' },
]

export default function StickerPanel({ onSelectEmoji, onSelectSticker, onClose }) {
  const [tab, setTab] = useState('emoji')

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center pb-40"
      onClick={onClose}
    >
      <div
        className="rounded-xl shadow-xl mx-4 flex"
        style={{ backgroundColor: 'rgb(220, 220, 220)', maxWidth: '520px', width: '100%' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left sidebar tabs */}
        <div className="flex flex-col items-center gap-2 p-2 shrink-0" style={{ width: '64px' }}>
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              className="w-12 h-12 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
              style={{
                backgroundColor: tab === t.key ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)',
              }}
              title={t.label}
              onClick={() => setTab(t.key)}
            >
              <img src={t.icon} alt={t.label} className="w-8 h-8 object-contain" />
            </button>
          ))}
        </div>

        {/* Right content area */}
        <div className="flex-1 p-3 overflow-y-auto max-h-[320px]">
          {tab === 'emoji' ? (
            <div className="grid grid-cols-8 gap-2">
              {EMOJI_KEYS.map((key) => {
                const src = getEmojiSrc(key)
                return (
                  <button
                    key={key}
                    type="button"
                    className="w-14 h-14 rounded-lg bg-white/60 hover:bg-white/80 transition-colors flex items-center justify-center cursor-pointer shrink-0"
                    title={`:${key}:`}
                    onClick={() => { onSelectEmoji(key); onClose() }}
                  >
                    {src && <img src={src} alt={`:${key}:`} className="w-12 h-12 object-contain" />}
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-2 max-h-[136px] overflow-y-auto">
              {STICKER_KEYS.map((key) => {
                const src = getStickerSrc(key)
                return (
                  <button
                    key={key}
                    type="button"
                    className="w-16 h-16 rounded-lg bg-white/60 hover:bg-white/80 transition-colors flex items-center justify-center cursor-pointer shrink-0"
                    title={key}
                    onClick={() => onSelectSticker(key)}
                  >
                    {src && <img src={src} alt={key} className="w-14 h-14 object-contain" />}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Update ChatInput import**

In `src/components/Input/ChatInput.jsx`, change:
```jsx
import EmojiPanel from './EmojiPanel'
```
to:
```jsx
import StickerPanel from './StickerPanel'
```

And update the JSX:
```jsx
{showEmojiPanel && (
  <StickerPanel
    onSelectEmoji={handleEmojiSelect}
    onSelectSticker={handleStickerSelect}
    onClose={() => setShowEmojiPanel(false)}
  />
)}
```

Also add the `handleStickerSelect` stub (to be fully implemented in Task 6):
```jsx
const handleStickerSelect = useCallback((key) => {
  // stub — full implementation in Task 6
}, [])
```

Also rename `showEmojiPanel` → `showStickerPanel`:
```jsx
const [showStickerPanel, setShowStickerPanel] = useState(false)
```

And update the emoji button onClick: `() => setShowStickerPanel(true)`

- [ ] **Step 3: Delete old EmojiPanel.jsx**

```bash
rm "D:/My Home/AI project/src/components/Input/EmojiPanel.jsx"
```

- [ ] **Step 4: Run existing tests to verify nothing broken**

Run: `npx vitest run src/components/Input/ChatInput.test.jsx`
Expected: 2/2 pass

- [ ] **Step 5: Commit**

```bash
git add src/components/Input/StickerPanel.jsx src/components/Input/ChatInput.jsx
git rm src/components/Input/EmojiPanel.jsx
git commit -m "refactor: rename EmojiPanel to StickerPanel with tab system"
```

---

### Task 5: Update StickerPanel tests

**Files:**
- Rename: `src/components/Input/EmojiPanel.test.jsx` → `src/components/Input/StickerPanel.test.jsx`

- [ ] **Step 1: Write the updated test file**

```jsx
import { render, screen, fireEvent } from '@testing-library/react'
import StickerPanel from './StickerPanel'

describe('StickerPanel', () => {
  it('renders two tab buttons', () => {
    render(<StickerPanel onSelectEmoji={() => {}} onSelectSticker={() => {}} onClose={() => {}} />)
    expect(screen.getByTitle('Emoji')).toBeInTheDocument()
    expect(screen.getByTitle('贴图')).toBeInTheDocument()
  })

  it('defaults to emoji tab showing 38 buttons', () => {
    render(<StickerPanel onSelectEmoji={() => {}} onSelectSticker={() => {}} onClose={() => {}} />)
    expect(screen.getAllByRole('button')).toHaveLength(38 + 2) // 38 emoji + 2 tabs
    expect(screen.getByTitle(':happy:')).toBeInTheDocument()
  })

  it('switches to sticker tab and shows sticker grid', () => {
    render(<StickerPanel onSelectEmoji={() => {}} onSelectSticker={() => {}} onClose={() => {}} />)
    fireEvent.click(screen.getByTitle('贴图'))
    // 160 sticker buttons + 2 tabs = 162 buttons
    expect(screen.getAllByRole('button')).toHaveLength(160 + 2)
    expect(screen.getByTitle('sticker_game_001')).toBeInTheDocument()
  })

  it('calls onSelectEmoji with key when emoji clicked', () => {
    const fn = vi.fn()
    render(<StickerPanel onSelectEmoji={fn} onSelectSticker={() => {}} onClose={() => {}} />)
    fireEvent.click(screen.getByTitle(':happy:'))
    expect(fn).toHaveBeenCalledWith('happy')
  })

  it('calls onSelectSticker with key when sticker clicked (after tab switch)', () => {
    const fn = vi.fn()
    render(<StickerPanel onSelectEmoji={() => {}} onSelectSticker={fn} onClose={() => {}} />)
    fireEvent.click(screen.getByTitle('贴图'))
    fireEvent.click(screen.getByTitle('sticker_game_001'))
    expect(fn).toHaveBeenCalledWith('sticker_game_001')
  })

  it('calls onClose when backdrop is clicked', () => {
    const fn = vi.fn()
    render(<StickerPanel onSelectEmoji={() => {}} onSelectSticker={() => {}} onClose={fn} />)
    fireEvent.click(screen.getByTitle('Emoji').closest('.fixed'))
    expect(fn).toHaveBeenCalled()
  })

  it('does not call onClose when panel body is clicked', () => {
    const fn = vi.fn()
    render(<StickerPanel onSelectEmoji={() => {}} onSelectSticker={() => {}} onClose={fn} />)
    fireEvent.click(screen.getByTitle('Emoji').closest('.rounded-xl'))
    expect(fn).not.toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: Delete old EmojiPanel.test.jsx and run tests**

Run: `npx vitest run src/components/Input/StickerPanel.test.jsx`
Expected: 7/7 pass

- [ ] **Step 3: Commit**

```bash
git rm src/components/Input/EmojiPanel.test.jsx
git add src/components/Input/StickerPanel.test.jsx
git commit -m "test: update panel tests for StickerPanel with tab switching"
```

---

### Task 6: Implement ChatInput sticker queue + split send logic

**Files:**
- Modify: `src/components/Input/ChatInput.jsx`

- [ ] **Step 1: Update ChatInput with full sticker logic**

The complete `ChatInput.jsx`:

```jsx
import { useState, useCallback } from 'react'
import { useChatStore } from '../../store/chatStore'
import { useCharacter } from '../CharacterContext'
import { UI_TEXT } from '../../config'
import { getEmojiText } from '../../config/emojis'
import { getStickerSrc } from '../../config/stickers'
import StickerPanel from './StickerPanel'

const BAKER = '/baker-assets'

export default function ChatInput() {
  const [text, setText] = useState('')
  const [showStickerPanel, setShowStickerPanel] = useState(false)
  const [stickerQueue, setStickerQueue] = useState([])
  const isStreaming = useChatStore((s) => s.isStreaming)
  const sendMessage = useChatStore((s) => s.sendMessage)
  const sendSticker = useChatStore((s) => s.sendSticker)
  const sendStickerReply = useChatStore((s) => s.sendStickerReply)
  const stopStream = useChatStore((s) => s.stopStream)
  const setPrompt = useChatStore((s) => s.setPrompt)
  const messages = useChatStore((s) => s.messages)
  const { character } = useCharacter()

  const handleSend = useCallback(() => {
    const trimmed = text.trim()
    const hasStickers = stickerQueue.length > 0
    if (!trimmed && !hasStickers) return
    if (isStreaming) return

    setText('')
    setStickerQueue([])

    if (messages.length === 0 && character.prompt) {
      setPrompt(character.prompt)
    }

    if (trimmed) {
      sendMessage(trimmed)
    }

    if (hasStickers) {
      stickerQueue.forEach((key) => sendSticker(key))
      if (!trimmed) {
        setTimeout(() => sendStickerReply(), 500)
      }
    }
  }, [text, stickerQueue, isStreaming, sendMessage, sendSticker, sendStickerReply, setPrompt, messages.length, character.prompt])

  const handleEmojiSelect = useCallback((key) => {
    const emotion = getEmojiText(key)
    if (emotion) {
      setText((prev) => prev + '[' + emotion + ']')
    }
  }, [])

  const handleStickerSelect = useCallback((key) => {
    if (text.trim()) {
      setStickerQueue((prev) => [...prev, key])
    } else {
      setShowStickerPanel(false)
      sendSticker(key)
      setTimeout(() => sendStickerReply(), 500)
    }
  }, [text, sendSticker, sendStickerReply])

  const removeStickerFromQueue = (index) => {
    setStickerQueue((prev) => prev.filter((_, i) => i !== index))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const hasText = text.trim().length > 0
  const hasStickers = stickerQueue.length > 0

  return (
    <div className="px-4 py-3">
      <div className="max-w-[768px] mx-auto">
        <div className="flex items-center gap-2">
          {/* Input bar */}
          <div className="flex-1 flex items-center gap-1.5 h-10 px-2.5 rounded-full border border-border-l1" style={{ backgroundColor: 'rgb(240, 238, 238)' }}>
            <button
              type="button"
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors shrink-0"
              aria-label="消息类型"
            >
              <img
                src={`${BAKER}/icons/icon_sns_message_01.png`}
                alt="message"
                className="w-5 h-5 object-contain opacity-70"
              />
            </button>

            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={UI_TEXT.PLACEHOLDER}
              disabled={isStreaming}
              className="flex-1 bg-transparent border-none outline-none text-black font-medium text-sm placeholder-gray-500 min-w-0"
            />

            {/* Sticker queue thumbnails inline */}
            {hasStickers && stickerQueue.map((key, i) => {
              const src = getStickerSrc(key)
              return (
                <span key={`${key}-${i}`} className="inline-flex items-center shrink-0 relative">
                  {src && <img src={src} alt={key} className="h-7 w-7 object-contain" />}
                  <button
                    type="button"
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gray-400 text-white text-xs flex items-center justify-center leading-none cursor-pointer"
                    onClick={() => removeStickerFromQueue(i)}
                  >
                    ×
                  </button>
                </span>
              )
            })}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm hover:brightness-95 transition-all cursor-pointer"
              style={{ backgroundColor: 'rgb(240, 238, 238)' }}
              aria-label="表情"
              onClick={() => setShowStickerPanel(true)}
            >
              <img
                src={`${BAKER}/icons/chat_emoji.png`}
                alt="emoji"
                className="w-6 h-6 object-contain opacity-80"
              />
            </button>

            <button
              type="button"
              className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm hover:brightness-95 transition-all cursor-pointer"
              style={{ backgroundColor: 'rgb(240, 238, 238)' }}
              aria-label="添加"
            >
              <img
                src={`${BAKER}/input/chat_plus.png`}
                alt="plus"
                className="w-6 h-6 object-contain opacity-80"
              />
            </button>

            {isStreaming ? (
              <button
                onClick={stopStream}
                className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm hover:brightness-95 transition-all cursor-pointer"
                style={{ backgroundColor: 'rgb(240, 238, 238)' }}
                aria-label={UI_TEXT.STOP}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-red-500">
                  <rect x="4" y="4" width="16" height="16" rx="2" />
                </svg>
              </button>
            ) : (hasText || hasStickers) ? (
              <button
                onClick={handleSend}
                className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm hover:brightness-95 transition-all cursor-pointer"
                style={{ backgroundColor: 'rgb(240, 238, 238)' }}
                aria-label={UI_TEXT.SEND}
              >
                <img
                  src={`${BAKER}/input/chat_enter.png`}
                  alt="send"
                  className="w-5 h-5 object-contain opacity-80"
                />
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {showStickerPanel && (
        <StickerPanel
          onSelectEmoji={handleEmojiSelect}
          onSelectSticker={handleStickerSelect}
          onClose={() => setShowStickerPanel(false)}
        />
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verify the component compiles (test run)**

Run: `npx vitest run src/components/Input/ChatInput.test.jsx`
Expected: Tests will FAIL because sendSticker/sendStickerReply don't exist in store yet. Mock them in the test (Task 7).

- [ ] **Step 3: Commit**

```bash
git add src/components/Input/ChatInput.jsx
git commit -m "feat: add sticker queue and split send logic to ChatInput"
```

---

### Task 7: Update ChatInput tests

**Files:**
- Modify: `src/components/Input/ChatInput.test.jsx`

- [ ] **Step 1: Update the mock to include new store actions**

```jsx
import { render, screen, fireEvent } from '@testing-library/react'
import ChatInput from './ChatInput'

vi.mock('../../store/chatStore', () => ({
  useChatStore: vi.fn((selector) => {
    const state = {
      isStreaming: false,
      sendMessage: vi.fn(),
      sendSticker: vi.fn(),
      sendStickerReply: vi.fn(),
      stopStream: vi.fn(),
      setPrompt: vi.fn(),
      messages: [],
    }
    return selector ? selector(state) : state
  }),
}))

vi.mock('../CharacterContext', () => ({
  useCharacter: vi.fn(() => ({
    character: { id: 'zhuang-fangyi', name: '庄方宜', avatar: '/test.png', prompt: 'test prompt' },
  })),
}))

describe('ChatInput', () => {
  it('renders input and emoji/plus buttons', () => {
    render(<ChatInput />)
    expect(screen.getByPlaceholderText('输入消息...')).toBeInTheDocument()
    expect(screen.getByLabelText('表情')).toBeInTheDocument()
    expect(screen.getByLabelText('添加')).toBeInTheDocument()
  })

  it('does not show send button when input is empty and no stickers', () => {
    render(<ChatInput />)
    expect(screen.queryByLabelText('发送')).not.toBeInTheDocument()
  })
})
```

Run: `npx vitest run src/components/Input/ChatInput.test.jsx`
Expected: 2/2 pass

- [ ] **Step 2: Commit**

```bash
git add src/components/Input/ChatInput.test.jsx
git commit -m "test: add sendSticker/sendStickerReply mocks to ChatInput test"
```

---

### Task 8: Add sendSticker and sendStickerReply to chatStore

**Files:**
- Modify: `src/store/chatStore.js`

- [ ] **Step 1: Add the two new actions**

In `chatStore.js`, import `STICKER_KEYS`:
```js
import { STICKER_KEYS } from '../config/stickers'
```

Add after `setStreamError` action:

```js
sendSticker: (key) => {
  const stickerMsg = {
    id: genMsgId(),
    role: 'user',
    content: key,
    contentType: 'sticker',
    timestamp: Date.now(),
  }
  set((state) => ({
    messages: [...state.messages, stickerMsg],
  }))
},

sendStickerReply: () => {
  setTimeout(() => {
    const randomKey = STICKER_KEYS[Math.floor(Math.random() * STICKER_KEYS.length)]
    const replyMsg = {
      id: genMsgId(),
      role: 'assistant',
      content: randomKey,
      contentType: 'sticker',
      timestamp: Date.now(),
    }
    set((state) => ({
      messages: [...state.messages, replyMsg],
    }))
  }, 500)
},
```

- [ ] **Step 2: Run store tests**

Run: `npx vitest run src/store/chatStore.test.js`
Expected: Existing tests pass + any new sticker tests pass

- [ ] **Step 3: Commit**

```bash
git add src/store/chatStore.js
git commit -m "feat: add sendSticker and sendStickerReply to chatStore"
```

---

### Task 9: Update chatStore tests for sticker actions

**Files:**
- Modify: `src/store/chatStore.test.js`

- [ ] **Step 1: Add sticker action tests**

Add to the existing describe block:

```js
it('sendSticker adds a sticker user message', () => {
  const { sendSticker } = useChatStore.getState()
  useChatStore.setState({ messages: [] })
  sendSticker('sticker_game_001')
  const { messages } = useChatStore.getState()
  expect(messages).toHaveLength(1)
  expect(messages[0].role).toBe('user')
  expect(messages[0].contentType).toBe('sticker')
  expect(messages[0].content).toBe('sticker_game_001')
})

it('sendStickerReply adds an AI sticker message after delay', async () => {
  vi.useFakeTimers()
  const { sendStickerReply } = useChatStore.getState()
  useChatStore.setState({ messages: [] })
  sendStickerReply()
  expect(useChatStore.getState().messages).toHaveLength(0) // not yet
  vi.advanceTimersByTime(500)
  const { messages } = useChatStore.getState()
  expect(messages).toHaveLength(1)
  expect(messages[0].role).toBe('assistant')
  expect(messages[0].contentType).toBe('sticker')
  vi.useRealTimers()
})
```

Run: `npx vitest run src/store/chatStore.test.js`
Expected: 7/7 pass (5 existing + 2 new)

- [ ] **Step 2: Commit**

```bash
git add src/store/chatStore.test.js
git commit -m "test: add sticker action tests for chatStore"
```

---

### Task 10: Update MessageBubble for sticker rendering

**Files:**
- Modify: `src/components/Chat/MessageBubble.jsx`

- [ ] **Step 1: Add sticker rendering branch**

After the existing imports, add:
```jsx
import { getStickerSrc } from '../../config/stickers'
```

In the bubble body rendering, add a sticker check BEFORE the isRight check:

```jsx
{message.contentType === 'sticker' ? (
  <div style={{ padding: '4px', textAlign: 'center' }}>
    {(() => {
      const src = getStickerSrc(message.content)
      return src ? (
        <img
          src={src}
          alt={message.content}
          style={{ width: '120px', height: '120px', objectFit: 'contain' }}
        />
      ) : (
        <span style={{ color: '#999' }}>[贴图]</span>
      )
    })()}
  </div>
) : isRight ? (
  // existing user message rendering
  <p style={{ whiteSpace: 'pre-wrap', margin: 0, lineHeight: 2.2 }}>
    ...
  </p>
) : (
  // existing AI message rendering
  ...
)}
```

Full structure — the bubble body div's children become:

```jsx
{message.contentType === 'sticker' ? (
  <div style={{ padding: '4px', textAlign: 'center' }}>
    {(() => {
      const src = getStickerSrc(message.content)
      return src ? (
        <img src={src} alt={message.content}
          style={{ width: '120px', height: '120px', objectFit: 'contain' }} />
      ) : <span style={{ color: '#999' }}>[贴图]</span>
    })()}
  </div>
) : isRight ? (
  <p style={{ whiteSpace: 'pre-wrap', margin: 0, lineHeight: 2.2 }}>
    {parseEmojiSegments(message.content).map((seg, i) =>
      seg.type === 'emoji' ? (
        <img key={i} src={seg.src} alt={seg.alt} title={seg.alt}
          className="inline-block w-7 h-7 object-contain align-middle mx-0.5" />
      ) : (
        <span key={i}>{seg.value}</span>
      )
    )}
  </p>
) : (
  <>
    <MarkdownContent content={message.content} />
    {isStreaming && !message.content && (
      <span style={{ ... }} className="animate-pulse" />
    )}
    {isStreaming && message.content && (
      <span style={{ ... }} className="animate-pulse" />
    )}
  </>
)}
```

Also: sticker messages should NOT have the SVG tail. Modify the tail rendering:

```jsx
{/* SVG tail — hide for sticker messages */}
{message.contentType !== 'sticker' && (
  <div style={{ position: 'absolute', top: 0, [tailSide]: '-8px', ... }}>
    <svg ...><path d={tailPath} fill={tailFill} /></svg>
  </div>
)}
```

- [ ] **Step 2: Run MessageBubble tests**

Run: `npx vitest run src/components/Chat/MessageBubble.test.jsx`
Expected: Existing 2 tests pass

- [ ] **Step 3: Commit**

```bash
git add src/components/Chat/MessageBubble.jsx
git commit -m "feat: add sticker content type rendering in MessageBubble"
```

---

### Task 11: Update MessageBubble tests for sticker

**Files:**
- Modify: `src/components/Chat/MessageBubble.test.jsx`

- [ ] **Step 1: Add sticker rendering test**

```jsx
it('renders sticker message with image and no tail', () => {
  const stickerMsg = {
    id: '1',
    role: 'user',
    content: 'sticker_game_001',
    contentType: 'sticker',
    timestamp: Date.now(),
  }
  render(<MessageBubble message={stickerMsg} />)
  const img = screen.getByAltText('sticker_game_001')
  expect(img).toBeInTheDocument()
  expect(img).toHaveAttribute('src', '/baker-assets/stickers/game/sticker_game_001.png')
})
```

Mock the character context for sticker tests too (already mocked).

Run: `npx vitest run src/components/Chat/MessageBubble.test.jsx`
Expected: 3/3 pass

- [ ] **Step 2: Commit**

```bash
git add src/components/Chat/MessageBubble.test.jsx
git commit -m "test: add sticker message rendering test for MessageBubble"
```

---

### Task 12: Final integration — run all tests + build

**Files:** None (verification only)

- [ ] **Step 1: Run all tests**

```bash
npx vitest run
```

Expected: All tests pass (estimate ~50 test cases across 12 test files)

- [ ] **Step 2: Run build**

```bash
npm run build
```

Expected: Exit 0, no errors

- [ ] **Step 3: Commit (if any fixes needed)**

Only commit if fixes were needed. Otherwise proceed.

- [ ] **Step 4: Open in browser and manually test**

```bash
npm run dev
```

Test scenarios:
1. Open sticker panel → click "贴图" tab → verify 5-column grid shows
2. Select sticker with empty input → should close panel and send immediately
3. Type text → select multiple stickers → verify thumbnails appear → send
4. Verify sticker message renders as 120×120 image in bubble
5. Send only stickers → verify AI replies with random sticker after 500ms

---

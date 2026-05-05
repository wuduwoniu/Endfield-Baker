import { create } from 'zustand'
import { MODELS } from '../config'
import { STICKER_KEYS } from '../config/stickers'
import { sendChatMessage, parseSSEStream } from '../api'

let messageId = 0
const genMsgId = () => `msg_${Date.now()}_${++messageId}`

export const useChatStore = create((set, get) => ({
  messages: [],
  currentMode: 'fast',
  isStreaming: false,
  error: null,
  abortController: null,
  currentPrompt: null,

  setMode: (mode) => {
    if (MODELS[mode]) set({ currentMode: mode })
  },

  setPrompt: (prompt) => set({ currentPrompt: prompt }),

  clearMessages: () => set({ messages: [], error: null }),

  /** Sends message via API with SSE streaming */
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
      const { currentMode, currentPrompt } = get()
      const historyMessages = get().messages
        .filter((m) => m.content && m.contentType !== 'sticker') // skip placeholder + stickers
        .map(({ role, content }) => ({ role, content }))
      if (currentPrompt) {
        historyMessages.unshift({ role: 'system', content: currentPrompt })
      }

      const stream = await sendChatMessage(historyMessages, { mode: currentMode, signal: controller.signal })
      const generator = parseSSEStream(stream)

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
      messages: state.messages.map((m) =>
        m.id === assistantId ? { ...m, content: m.content || '(empty)' } : m
      ),
    }))
  },

  stopStream: () => {
    const { abortController } = get()
    if (abortController) {
      abortController.abort()
    }
    set({ isStreaming: false, abortController: null })
  },

  setStreamError: (errorMsg) => {
    set({ isStreaming: false, error: errorMsg })
  },

  /** Add a user text message without triggering AI */
  addUserText: (text) => {
    const userMsg = { id: genMsgId(), role: 'user', content: text, timestamp: Date.now() }
    set((state) => ({
      messages: [...state.messages, userMsg],
    }))
    return userMsg.id
  },

  /** Trigger AI reply based on current messages */
  triggerAiReply: async () => {
    const assistantMsg = { id: genMsgId(), role: 'assistant', content: '', timestamp: Date.now() }

    set((state) => ({
      messages: [...state.messages, assistantMsg],
      isStreaming: true,
      error: null,
    }))

    const controller = new AbortController()
    set({ abortController: controller })

    try {
      const { currentMode, currentPrompt } = get()
      const historyMessages = get().messages
        .filter((m) => m.content && m.contentType !== 'sticker')
        .map(({ role, content }) => ({ role, content }))
      if (currentPrompt) {
        historyMessages.unshift({ role: 'system', content: currentPrompt })
      }

      const stream = await sendChatMessage(historyMessages, { mode: currentMode, signal: controller.signal })
      const generator = parseSSEStream(stream)

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
}))

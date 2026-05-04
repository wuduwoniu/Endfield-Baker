import { create } from 'zustand'
import { MODELS } from '../config'
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

  setMode: (mode) => {
    if (MODELS[mode]) set({ currentMode: mode })
  },

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  closeSidebar: () => set({ sidebarOpen: false }),

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
      const { currentMode } = get()
      const apiMessages = get().messages.map(({ role, content }) => ({ role, content }))

      const stream = await sendChatMessage(apiMessages, { mode: currentMode, signal: controller.signal })
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
}))

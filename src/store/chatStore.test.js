import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useChatStore } from './chatStore'

vi.mock('../api', () => ({
  sendChatMessage: vi.fn(),
  parseSSEStream: vi.fn(),
}))

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

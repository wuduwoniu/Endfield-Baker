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
      currentPrompt: null,
    })
  })

  it('starts with empty state', () => {
    const state = useChatStore.getState()
    expect(state.messages).toEqual([])
    expect(state.currentMode).toBe('fast')
    expect(state.isStreaming).toBe(false)
    expect(state.error).toBeNull()
    expect(state.currentPrompt).toBeNull()
  })

  it('setMode changes current mode', () => {
    useChatStore.getState().setMode('expert')
    expect(useChatStore.getState().currentMode).toBe('expert')
  })

  it('setPrompt stores character prompt', () => {
    useChatStore.getState().setPrompt('test prompt')
    expect(useChatStore.getState().currentPrompt).toBe('test prompt')
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

  it('addUserText adds a user text message without triggering AI', () => {
    const { addUserText } = useChatStore.getState()
    useChatStore.setState({ messages: [] })
    addUserText('Hello')
    const { messages, isStreaming } = useChatStore.getState()
    expect(messages).toHaveLength(1)
    expect(messages[0].role).toBe('user')
    expect(messages[0].content).toBe('Hello')
    expect(isStreaming).toBe(false)
  })

  it('triggerAiReply creates assistant placeholder and starts streaming', () => {
    const { triggerAiReply } = useChatStore.getState()
    useChatStore.setState({ messages: [{ id: '1', role: 'user', content: 'Hi', timestamp: 1 }] })
    triggerAiReply()
    const { messages, isStreaming } = useChatStore.getState()
    expect(messages).toHaveLength(2)
    expect(messages[1].role).toBe('assistant')
    expect(messages[1].content).toBe('')
    expect(isStreaming).toBe(true)
  })

  it('sendStickerReply adds an AI sticker message after delay', async () => {
    vi.useFakeTimers()
    const { sendStickerReply } = useChatStore.getState()
    useChatStore.setState({ messages: [] })
    sendStickerReply()
    expect(useChatStore.getState().messages).toHaveLength(0)
    vi.advanceTimersByTime(500)
    const { messages } = useChatStore.getState()
    expect(messages).toHaveLength(1)
    expect(messages[0].role).toBe('assistant')
    expect(messages[0].contentType).toBe('sticker')
    vi.useRealTimers()
  })
})

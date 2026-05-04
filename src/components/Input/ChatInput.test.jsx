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

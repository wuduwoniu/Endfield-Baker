import { render, screen } from '@testing-library/react'
import ChatInput from './ChatInput'

vi.mock('../../store/chatStore', () => ({
  useChatStore: vi.fn((selector) => {
    const state = {
      isStreaming: false,
      sendMessage: vi.fn(),
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

  it('does not show send button when input is empty', () => {
    render(<ChatInput />)
    expect(screen.queryByLabelText('发送')).not.toBeInTheDocument()
  })
})

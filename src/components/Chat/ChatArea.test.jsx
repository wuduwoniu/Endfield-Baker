import { render, screen } from '@testing-library/react'
import { useChatStore } from '../../store/chatStore'
import ChatArea from './ChatArea'

vi.mock('../../store/chatStore', () => ({
  useChatStore: vi.fn((selector) => {
    const state = { messages: [], isStreaming: false }
    return selector ? selector(state) : state
  }),
}))

vi.mock('../CharacterContext', () => ({
  useCharacter: vi.fn(() => ({
    character: { id: 'zhuang-fangyi', name: '庄方宜', avatar: '/test.png', role: '罗德岛干员' },
    characterId: 'zhuang-fangyi',
    selectCharacter: vi.fn(),
  })),
}))

describe('ChatArea', () => {
  beforeEach(() => {
    Element.prototype.scrollIntoView = vi.fn()
  })

  it('shows empty state and input when no messages', () => {
    render(<ChatArea />)
    expect(screen.getByText('请选择一个会话')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('输入消息...')).toBeInTheDocument()
    expect(screen.getByText('庄方宜')).toBeInTheDocument()
  })

  it('shows messages when present', () => {
    vi.mocked(useChatStore).mockImplementation((sel) => {
      const state = { messages: [{ id: '1', role: 'user', content: 'Hello' }], isStreaming: false }
      return sel ? sel(state) : state
    })
    render(<ChatArea />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})

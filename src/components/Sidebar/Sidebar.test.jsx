import { render, screen } from '@testing-library/react'
import Sidebar from './Sidebar'

vi.mock('../../store/chatStore', () => ({
  useChatStore: vi.fn((selector) => {
    const state = { messages: [], clearMessages: vi.fn(), setPrompt: vi.fn() }
    return selector ? selector(state) : state
  }),
}))

vi.mock('../CharacterContext', () => ({
  useCharacter: vi.fn(() => ({
    character: { id: 'zhuang-fangyi', name: '庄方宜', avatar: '/test.png', role: '罗德岛干员', description: 'test' },
    characterId: 'zhuang-fangyi',
    selectCharacter: vi.fn(),
  })),
}))

describe('Sidebar', () => {
  it('renders contact list with characters', () => {
    render(<Sidebar />)
    expect(screen.getByText('最近联系人')).toBeInTheDocument()
    expect(screen.getByText('添加新会话')).toBeInTheDocument()
    expect(screen.getByText('庄方宜')).toBeInTheDocument()
  })
})

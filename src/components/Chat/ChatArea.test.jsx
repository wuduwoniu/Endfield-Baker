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

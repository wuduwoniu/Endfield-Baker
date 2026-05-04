import { render, screen } from '@testing-library/react'
import App from './App'

vi.mock('./store/chatStore', () => ({
  useChatStore: vi.fn((selector) => {
    const state = { messages: [], isStreaming: false }
    return selector ? selector(state) : state
  }),
}))

describe('App', () => {
  it('renders main layout with header and welcome', () => {
    render(<App />)
    expect(screen.getByText('DeepSeek')).toBeInTheDocument()
    expect(screen.getByText('有什么可以帮你的？')).toBeInTheDocument()
  })
})

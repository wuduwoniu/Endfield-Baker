import { render, screen } from '@testing-library/react'
import App from './App'

vi.mock('./store/chatStore', () => ({
  useChatStore: vi.fn((selector) => {
    const state = { messages: [], isStreaming: false }
    return selector ? selector(state) : state
  }),
}))

vi.mock('./hooks/useTheme', () => ({
  useTheme: vi.fn(() => ({ isDark: false, toggle: vi.fn() })),
}))

describe('App', () => {
  it('renders main layout with header and input', () => {
    render(<App />)
    expect(screen.getByText(/BAKER/)).toBeInTheDocument()
    expect(screen.getByPlaceholderText('输入消息...')).toBeInTheDocument()
  })
})

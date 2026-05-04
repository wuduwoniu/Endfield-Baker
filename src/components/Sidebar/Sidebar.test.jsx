import { render, screen, fireEvent } from '@testing-library/react'
import Sidebar from './Sidebar'

const mockClose = vi.fn()

vi.mock('../../store/chatStore', () => ({
  useChatStore: vi.fn((selector) => {
    const state = {
      sidebarOpen: true,
      closeSidebar: mockClose,
      clearMessages: vi.fn(),
      messages: [],
    }
    return selector ? selector(state) : state
  }),
}))

describe('Sidebar', () => {
  it('renders when open', () => {
    render(<Sidebar />)
    expect(screen.getByText('历史对话')).toBeInTheDocument()
    expect(screen.getByText('＋ 新对话')).toBeInTheDocument()
  })

  it('shows empty state when no messages', () => {
    render(<Sidebar />)
    expect(screen.getByText('暂无对话历史')).toBeInTheDocument()
  })

  it('closes when overlay clicked', () => {
    render(<Sidebar />)
    const overlay = screen.getByRole('presentation')
    fireEvent.click(overlay)
    expect(mockClose).toHaveBeenCalled()
  })
})

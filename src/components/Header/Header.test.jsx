import { render, screen } from '@testing-library/react'
import Header from './Header'

vi.mock('../../store/chatStore', () => ({
  useChatStore: vi.fn(() => ({
    currentMode: 'fast',
    setMode: vi.fn(),
    toggleSidebar: vi.fn(),
  })),
}))

vi.mock('../../hooks/useTheme', () => ({
  useTheme: vi.fn(() => ({ isDark: false, toggle: vi.fn() })),
}))

describe('Header', () => {
  it('renders logo and mode selector', () => {
    render(<Header />)
    expect(screen.getByText('DeepSeek')).toBeInTheDocument()
    expect(screen.getByText('Fast')).toBeInTheDocument()
    expect(screen.getByText('Expert')).toBeInTheDocument()
    expect(screen.getByText('Vision')).toBeInTheDocument()
  })
})

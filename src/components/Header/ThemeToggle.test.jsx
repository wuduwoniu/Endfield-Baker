import { render, screen, fireEvent } from '@testing-library/react'
import ThemeToggle from './ThemeToggle'

describe('ThemeToggle', () => {
  it('renders sun icon when dark mode', () => {
    render(<ThemeToggle isDark={true} onToggle={() => {}} />)
    expect(screen.getByRole('button')).toHaveTextContent('☀️')
  })

  it('renders moon icon when light mode', () => {
    render(<ThemeToggle isDark={false} onToggle={() => {}} />)
    expect(screen.getByRole('button')).toHaveTextContent('🌙')
  })

  it('calls onToggle when clicked', () => {
    const onToggle = vi.fn()
    render(<ThemeToggle isDark={false} onToggle={onToggle} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onToggle).toHaveBeenCalledOnce()
  })
})

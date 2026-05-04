import { render, screen } from '@testing-library/react'
import Header from './Header'

describe('Header', () => {
  it('renders BAKER path', () => {
    render(<Header />)
    expect(screen.getByText(/BAKER/)).toBeInTheDocument()
    expect(screen.getByText(/会话消息/)).toBeInTheDocument()
  })

  it('renders player info', () => {
    render(<Header />)
    expect(screen.getByText('终端管理员')).toBeInTheDocument()
  })
})

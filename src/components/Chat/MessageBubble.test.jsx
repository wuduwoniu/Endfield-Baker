import { render, screen } from '@testing-library/react'
import MessageBubble from './MessageBubble'

describe('MessageBubble', () => {
  it('renders user message with right alignment', () => {
    const msg = { id: '1', role: 'user', content: 'Hello' }
    const { container } = render(<MessageBubble message={msg} isStreaming={false} />)
    expect(container.firstChild).toHaveClass('justify-end')
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('renders assistant message with left alignment', () => {
    const msg = { id: '2', role: 'assistant', content: 'Hi there' }
    const { container } = render(<MessageBubble message={msg} isStreaming={false} />)
    expect(container.firstChild).toHaveClass('justify-start')
    expect(screen.getByText('DeepSeek')).toBeInTheDocument()
  })
})

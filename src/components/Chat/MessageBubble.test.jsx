import { render, screen } from '@testing-library/react'
import MessageBubble from './MessageBubble'

vi.mock('../CharacterContext', () => ({
  useCharacter: vi.fn(() => ({
    character: { id: 'zhuang-fangyi', name: '庄方宜', avatar: '/test.png', role: '罗德岛干员', description: 'test' },
  })),
}))

describe('MessageBubble', () => {
  it('renders user message with white background', () => {
    const msg = { id: '1', role: 'user', content: 'Hello' }
    const { container } = render(<MessageBubble message={msg} isStreaming={false} />)
    // Root uses flex-column with alignItems: flex-end for user
    const root = container.firstChild
    expect(root.style.alignItems).toBe('flex-end')
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('renders assistant message', () => {
    const msg = { id: '2', role: 'assistant', content: 'Hi there' }
    render(<MessageBubble message={msg} isStreaming={false} />)
    expect(screen.getByText('Hi there')).toBeInTheDocument()
    expect(screen.getByAltText('庄方宜')).toBeInTheDocument()
  })

  it('renders sticker message with image and no tail', () => {
    const stickerMsg = {
      id: '1',
      role: 'user',
      content: 'sticker_game_001',
      contentType: 'sticker',
      timestamp: Date.now(),
    }
    render(<MessageBubble message={stickerMsg} />)
    const img = screen.getByAltText('sticker_game_001')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', '/baker-assets/stickers/game/sticker_game_001.png')
  })
})

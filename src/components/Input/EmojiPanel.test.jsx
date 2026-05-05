import { render, screen, fireEvent } from '@testing-library/react'
import EmojiPanel from './EmojiPanel'

describe('EmojiPanel', () => {
  it('renders all 38 emoji buttons', () => {
    render(<EmojiPanel onSelect={() => {}} onClose={() => {}} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(38)
  })

  it('renders emoji images with correct src', () => {
    render(<EmojiPanel onSelect={() => {}} onClose={() => {}} />)
    const img = screen.getByAltText(':happy:')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', '/baker-assets/emojis/sns_emoji_001.png')
  })

  it('calls onSelect with key and onClose when emoji clicked', () => {
    const onSelect = vi.fn()
    const onClose = vi.fn()
    render(<EmojiPanel onSelect={onSelect} onClose={onClose} />)
    fireEvent.click(screen.getByTitle(':happy:'))
    expect(onSelect).toHaveBeenCalledWith('happy')
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when backdrop is clicked', () => {
    const onClose = vi.fn()
    render(<EmojiPanel onSelect={() => {}} onClose={onClose} />)
    // backdrop is the fixed overlay, the panel is its first child
    const backdrop = screen.getByTitle(':happy:').closest('.fixed')
    fireEvent.click(backdrop)
    expect(onClose).toHaveBeenCalled()
  })

  it('does not call onClose when panel body is clicked', () => {
    const onClose = vi.fn()
    render(<EmojiPanel onSelect={() => {}} onClose={onClose} />)
    // clicking the panel itself (with stopPropagation) should not trigger onClose
    const panelBody = screen.getByTitle(':happy:').closest('.rounded-xl')
    fireEvent.click(panelBody)
    expect(onClose).not.toHaveBeenCalled()
  })
})

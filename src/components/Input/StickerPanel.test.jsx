import { render, screen, fireEvent } from '@testing-library/react'
import StickerPanel from './StickerPanel'

describe('StickerPanel', () => {
  it('renders two tab buttons', () => {
    render(<StickerPanel onSelectEmoji={() => {}} onSelectSticker={() => {}} onClose={() => {}} />)
    expect(screen.getByTitle('Emoji')).toBeInTheDocument()
    expect(screen.getByTitle('贴图')).toBeInTheDocument()
  })

  it('defaults to emoji tab showing 38 buttons', () => {
    render(<StickerPanel onSelectEmoji={() => {}} onSelectSticker={() => {}} onClose={() => {}} />)
    expect(screen.getAllByRole('button')).toHaveLength(38 + 2)
    expect(screen.getByTitle(':happy:')).toBeInTheDocument()
  })

  it('switches to sticker tab and shows sticker grid', () => {
    render(<StickerPanel onSelectEmoji={() => {}} onSelectSticker={() => {}} onClose={() => {}} />)
    fireEvent.click(screen.getByTitle('贴图'))
    expect(screen.getAllByRole('button')).toHaveLength(168 + 2)
    expect(screen.getByTitle('sticker_game_001')).toBeInTheDocument()
  })

  it('calls onSelectEmoji with key when emoji clicked', () => {
    const fn = vi.fn()
    render(<StickerPanel onSelectEmoji={fn} onSelectSticker={() => {}} onClose={() => {}} />)
    fireEvent.click(screen.getByTitle(':happy:'))
    expect(fn).toHaveBeenCalledWith('happy')
  })

  it('calls onSelectSticker with key when sticker clicked (after tab switch)', () => {
    const fn = vi.fn()
    render(<StickerPanel onSelectEmoji={() => {}} onSelectSticker={fn} onClose={() => {}} />)
    fireEvent.click(screen.getByTitle('贴图'))
    fireEvent.click(screen.getByTitle('sticker_game_001'))
    expect(fn).toHaveBeenCalledWith('sticker_game_001')
  })

  it('calls onClose when backdrop is clicked', () => {
    const fn = vi.fn()
    render(<StickerPanel onSelectEmoji={() => {}} onSelectSticker={() => {}} onClose={fn} />)
    fireEvent.click(screen.getByTitle('Emoji').closest('.fixed'))
    expect(fn).toHaveBeenCalled()
  })

  it('does not call onClose when panel body is clicked', () => {
    const fn = vi.fn()
    render(<StickerPanel onSelectEmoji={() => {}} onSelectSticker={() => {}} onClose={fn} />)
    fireEvent.click(screen.getByTitle('Emoji').closest('.rounded-xl'))
    expect(fn).not.toHaveBeenCalled()
  })
})

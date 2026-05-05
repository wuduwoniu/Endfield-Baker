import { STICKER_KEYS, getStickerSrc } from './stickers'

describe('stickers config', () => {
  it('has 168 sticker keys (120 game + 48 skland)', () => {
    expect(STICKER_KEYS).toHaveLength(168)
  })

  it('game keys are formatted correctly', () => {
    expect(STICKER_KEYS[0]).toBe('sticker_game_001')
    expect(STICKER_KEYS[119]).toBe('sticker_game_120')
  })

  it('skland keys follow game keys', () => {
    expect(STICKER_KEYS[120]).toBe('sticker_skland_001')
    expect(STICKER_KEYS[167]).toBe('sticker_skland_048')
  })

  it('getStickerSrc returns correct game PNG path', () => {
    expect(getStickerSrc('sticker_game_001')).toBe('/baker-assets/stickers/game/sticker_game_001.png')
    expect(getStickerSrc('sticker_game_120')).toBe('/baker-assets/stickers/game/sticker_game_120.png')
  })

  it('getStickerSrc returns correct skland WEBP path', () => {
    expect(getStickerSrc('sticker_skland_001')).toBe('/baker-assets/stickers/skland/sticker_skland_001.webp')
    expect(getStickerSrc('sticker_skland_048')).toBe('/baker-assets/stickers/skland/sticker_skland_048.webp')
  })

  it('getStickerSrc returns null for unknown key', () => {
    expect(getStickerSrc('sticker_nonexistent')).toBeNull()
    expect(getStickerSrc('invalid_format')).toBeNull()
  })

  it('no duplicate keys', () => {
    expect(new Set(STICKER_KEYS).size).toBe(STICKER_KEYS.length)
  })
})

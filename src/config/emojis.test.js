import { EMOJI_KEYS, getEmojiSrc, getEmojiText, parseEmojiSegments } from './emojis'

describe('emoji config', () => {
  it('has 38 emoji keys', () => {
    expect(EMOJI_KEYS).toHaveLength(38)
  })

  it('returns correct src for first key', () => {
    expect(getEmojiSrc('happy')).toBe('/baker-assets/emojis/sns_emoji_001.png')
  })

  it('returns correct src for last key', () => {
    expect(getEmojiSrc('thinking')).toBe('/baker-assets/emojis/sns_emoji_038.png')
  })

  it('returns correct src for middle key', () => {
    expect(getEmojiSrc('cry')).toBe('/baker-assets/emojis/sns_emoji_008.png')
  })

  it('returns null for unknown key', () => {
    expect(getEmojiSrc('nonexistent')).toBeNull()
  })

  it('all keys resolve to a valid src', () => {
    for (const key of EMOJI_KEYS) {
      const src = getEmojiSrc(key)
      expect(src).toBeTruthy()
      expect(src).toMatch(/\/baker-assets\/emojis\/sns_emoji_\d{3}\.png$/)
    }
  })

  it('no duplicate keys', () => {
    expect(new Set(EMOJI_KEYS).size).toBe(EMOJI_KEYS.length)
  })

  it('getEmojiText returns Chinese emotion for known key', () => {
    expect(getEmojiText('happy')).toBe('开心')
    expect(getEmojiText('sad')).toBe('难过')
    expect(getEmojiText('angry')).toBe('愤怒')
    expect(getEmojiText('love')).toBe('爱心')
    expect(getEmojiText('thinking')).toBe('思考')
  })

  it('getEmojiText returns null for unknown key', () => {
    expect(getEmojiText('nonexistent')).toBeNull()
  })

  it('all keys have a non-empty emotion text', () => {
    for (const key of EMOJI_KEYS) {
      const text = getEmojiText(key)
      expect(text).toBeTruthy()
      expect(typeof text).toBe('string')
    }
  })

  it('parseEmojiSegments returns text-only for plain string', () => {
    const segments = parseEmojiSegments('hello world')
    expect(segments).toEqual([{ type: 'text', value: 'hello world' }])
  })

  it('parseEmojiSegments parses single emoji marker', () => {
    const segments = parseEmojiSegments('[开心]')
    expect(segments).toHaveLength(1)
    expect(segments[0].type).toBe('emoji')
    expect(segments[0].key).toBe('happy')
    expect(segments[0].src).toBe('/baker-assets/emojis/sns_emoji_001.png')
  })

  it('parseEmojiSegments parses mixed text and emojis', () => {
    const segments = parseEmojiSegments('你好[开心]世界[难过]！')
    expect(segments).toHaveLength(5)
    expect(segments[0]).toEqual({ type: 'text', value: '你好' })
    expect(segments[1].type).toBe('emoji')
    expect(segments[1].key).toBe('happy')
    expect(segments[2]).toEqual({ type: 'text', value: '世界' })
    expect(segments[3].type).toBe('emoji')
    expect(segments[3].key).toBe('sad')
    expect(segments[4]).toEqual({ type: 'text', value: '！' })
  })

  it('parseEmojiSegments returns empty array for empty string', () => {
    expect(parseEmojiSegments('')).toEqual([])
  })

  it('parseEmojiSegments does not match unknown brackets', () => {
    const segments = parseEmojiSegments('[未知]')
    expect(segments).toEqual([{ type: 'text', value: '[未知]' }])
  })
})

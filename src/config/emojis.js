const BAKER = '/baker-assets'

export const EMOJI_KEYS = [
  'happy', 'stars', 'surprising', 'smile', 'thumb', 'sad', 'laugh', 'cry',
  'meh', 'sweat', 'cool', 'grin', 'confused', 'pensive', 'pray', 'ok',
  'tongue', 'love', 'blush', 'lol', 'heart', 'sparkle', 'sweat_smile',
  'grinning', 'plus_one', 'skeptical', 'hundred', 'dead', 'angry', 'annoyed',
  'dizzy', 'shocked', 'worried', 'sleep', 'suspicious', 'mute', 'fist_bump',
  'thinking',
]

export const EMOJI_TEXT = {
  happy: '开心',
  stars: '星星眼',
  surprising: '惊讶',
  smile: '微笑',
  thumb: '点赞',
  sad: '难过',
  laugh: '大笑',
  cry: '哭泣',
  meh: '无语',
  sweat: '流汗',
  cool: '酷',
  grin: '咧嘴笑',
  confused: '困惑',
  pensive: '沉思',
  pray: '祈祷',
  ok: 'OK',
  tongue: '吐舌头',
  love: '爱心',
  blush: '害羞',
  lol: '笑喷',
  heart: '比心',
  sparkle: '闪光',
  sweat_smile: '尴尬笑',
  grinning: '开心笑',
  plus_one: '+1',
  skeptical: '怀疑',
  hundred: '满分',
  dead: '躺倒',
  angry: '愤怒',
  annoyed: '恼怒',
  dizzy: '晕眩',
  shocked: '震惊',
  worried: '担心',
  sleep: '睡觉',
  suspicious: '可疑',
  mute: '静音',
  fist_bump: '碰拳',
  thinking: '思考',
}

export function getEmojiSrc(key) {
  const idx = EMOJI_KEYS.indexOf(key)
  if (idx < 0) return null
  const num = String(idx + 1).padStart(3, '0')
  return `${BAKER}/emojis/sns_emoji_${num}.png`
}

export function getEmojiText(key) {
  return EMOJI_TEXT[key] || null
}

const TEXT_TO_KEY = Object.fromEntries(
  Object.entries(EMOJI_TEXT).map(([k, v]) => [v, k])
)

const EMOJI_REGEX = new RegExp(
  `\\[(${Object.values(EMOJI_TEXT).map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\]`,
  'g'
)

export function parseEmojiSegments(text) {
  const segments = []
  let last = 0
  let m
  while ((m = EMOJI_REGEX.exec(text)) !== null) {
    if (m.index > last) segments.push({ type: 'text', value: text.slice(last, m.index) })
    const key = TEXT_TO_KEY[m[1]]
    if (key) segments.push({ type: 'emoji', key, src: getEmojiSrc(key), alt: m[0] })
    last = EMOJI_REGEX.lastIndex
  }
  if (last < text.length) segments.push({ type: 'text', value: text.slice(last) })
  return segments
}

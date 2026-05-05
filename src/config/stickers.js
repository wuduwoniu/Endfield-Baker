const BAKER = '/baker-assets'

export const STICKER_KEYS = (() => {
  const keys = []
  for (let i = 1; i <= 120; i++) {
    keys.push(`sticker_game_${String(i).padStart(3, '0')}`)
  }
  for (let i = 1; i <= 48; i++) {
    keys.push(`sticker_skland_${String(i).padStart(3, '0')}`)
  }
  return keys
})()

export function getStickerSrc(key) {
  const m = key.match(/^sticker_(game|skland)_(\d{3})$/)
  if (!m) return null
  const category = m[1]
  const num = m[2]
  const ext = category === 'skland' ? 'webp' : 'png'
  return `${BAKER}/stickers/${category}/sticker_${category}_${num}.${ext}`
}

import { useState } from 'react'
import { EMOJI_KEYS, getEmojiSrc } from '../../config/emojis'
import { STICKER_KEYS, getStickerSrc } from '../../config/stickers'

const BAKER = '/baker-assets'

const TABS = [
  { key: 'emoji', icon: `${BAKER}/icons/chat_emoji.png`, label: 'Emoji' },
  { key: 'sticker', icon: `${BAKER}/stickers/game/sticker_game_001.png`, label: '贴图' },
]

export default function StickerPanel({ onSelectEmoji, onSelectSticker, onClose }) {
  const [tab, setTab] = useState('emoji')

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center pb-40"
      onClick={onClose}
    >
      <div
        className="rounded-xl shadow-xl mx-4 flex"
        style={{ backgroundColor: 'rgb(220, 220, 220)', maxWidth: '560px', width: '100%' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left sidebar tabs */}
        <div className="flex flex-col items-center gap-2 p-2 shrink-0" style={{ width: '64px' }}>
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              className="w-12 h-12 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
              style={{
                backgroundColor: tab === t.key ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)',
              }}
              title={t.label}
              onClick={() => setTab(t.key)}
            >
              <img src={t.icon} alt={t.label} className="w-8 h-8 object-contain" />
            </button>
          ))}
        </div>

        {/* Right content area */}
        <div className="flex-1 p-3 overflow-y-auto max-h-[320px]">
          {tab === 'emoji' ? (
            <div className="grid grid-cols-8 gap-2 max-h-[136px] overflow-y-auto">
              {EMOJI_KEYS.map((key) => {
                const src = getEmojiSrc(key)
                return (
                  <button
                    key={key}
                    type="button"
                    tabIndex={-1}
                    className="w-14 h-14 rounded-lg bg-white/60 hover:bg-white/80 transition-colors flex items-center justify-center cursor-pointer shrink-0"
                    title={`:${key}:`}
                    onClick={() => { onSelectEmoji(key); onClose() }}
                  >
                    {src && <img src={src} alt={`:${key}:`} className="w-12 h-12 object-contain" />}
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-2 max-h-[136px] overflow-y-auto">
              {STICKER_KEYS.map((key) => {
                const src = getStickerSrc(key)
                return (
                  <button
                    key={key}
                    type="button"
                    tabIndex={-1}
                    className="w-16 h-16 rounded-lg bg-white/60 hover:bg-white/80 transition-colors flex items-center justify-center cursor-pointer shrink-0"
                    title={key}
                    onClick={() => onSelectSticker(key)}
                  >
                    {src && <img src={src} alt={key} className="w-14 h-14 object-contain" />}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

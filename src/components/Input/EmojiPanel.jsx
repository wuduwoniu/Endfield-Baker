import { EMOJI_KEYS, getEmojiSrc } from '../../config/emojis'

export default function EmojiPanel({ onSelect, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center pb-40"
      onClick={onClose}
    >
      <div
        className="rounded-xl shadow-xl p-3 mx-4"
        style={{ backgroundColor: 'rgb(220, 220, 220)', maxWidth: '460px', width: '100%' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid grid-cols-8 gap-2 max-h-[136px] overflow-y-auto">
          {EMOJI_KEYS.map((key) => {
            const src = getEmojiSrc(key)
            return (
              <button
                key={key}
                type="button"
                className="w-14 h-14 rounded-lg bg-white/60 hover:bg-white/80 transition-colors flex items-center justify-center cursor-pointer shrink-0"
                title={`:${key}:`}
                onClick={() => {
                  onSelect(key)
                  onClose()
                }}
              >
                {src && (
                  <img
                    src={src}
                    alt={`:${key}:`}
                    className="w-12 h-12 object-contain"
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

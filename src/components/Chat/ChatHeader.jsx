import { useState } from 'react'
import { useCharacter } from '../CharacterContext'

const BAKER = '/baker-assets'

export default function ChatHeader() {
  const { character } = useCharacter()
  const [useAlt, setUseAlt] = useState(true)

  const left = useAlt ? `${BAKER}/header/chat_head_left_2.png` : `${BAKER}/header/chat_head_left.png`
  const mid = useAlt ? `${BAKER}/header/chat_head_mid_2.png` : `${BAKER}/header/chat_head_mid.png`
  const right = useAlt ? `${BAKER}/header/chat_head_right_2.png` : `${BAKER}/header/chat_head_right.png`

  return (
    <div className="h-14 flex items-stretch shrink-0 mb-1 relative">
      {/* Chat head decoration: left image + mid div with bg-image + right image */}
      <img
        src={left}
        alt=""
        className="h-full w-auto object-cover select-none pointer-events-none"
      />
      <div
        className="flex-1 h-full"
        style={{ backgroundImage: `url(${mid})`, backgroundSize: '100% 100%' }}
      />
      <img
        src={right}
        alt=""
        className="h-full w-auto object-cover select-none pointer-events-none"
      />

      {/* Character name overlay */}
      <div className="absolute inset-0 flex items-center justify-between px-6">
        <div className="flex items-center gap-2 ml-2">
          <span className="text-white font-bold text-lg">{character.name}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Settings button — cycle chat head style */}
          <button
            onClick={() => setUseAlt(!useAlt)}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-[rgb(68,67,67)] cursor-pointer hover:opacity-80 transition-opacity"
            aria-label="切换装饰风格"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-white">
              <circle cx="5" cy="12" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="19" cy="12" r="2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

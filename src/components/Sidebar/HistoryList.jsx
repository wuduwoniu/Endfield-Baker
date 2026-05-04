import { CHARACTERS } from '../characters'
import { useCharacter } from '../CharacterContext'
import { useChatStore } from '../../store/chatStore'

const BAKER = '/baker-assets'

function ContactItem({ char, isSelected, onSelect }) {
  const messages = useChatStore((s) => s.messages)
  const lastMsg = messages.length > 0 ? messages[messages.length - 1] : null
  const preview = lastMsg?.content?.slice(0, 20) || char.description

  const baseCls = 'w-full h-[88px] relative rounded-xl flex items-center p-3 cursor-pointer transition-all group overflow-hidden shrink-0'
  const activeCls = isSelected
    ? 'border-[3px] border-white/60 z-10'
    : 'border border-transparent hover:bg-white/5 opacity-80 hover:opacity-100'

  return (
    <button
      onClick={() => onSelect(char.id)}
      className={`${baseCls} ${activeCls}`}
      style={{ backgroundColor: 'rgb(53, 53, 53)' }}
    >
      <div className="relative w-[60px] h-[60px] shrink-0 mr-3">
        <div className="w-full h-full rounded-lg overflow-hidden border border-gray-500/50 bg-gray-700 flex items-center justify-center">
          <img
            src={char.avatar}
            alt={char.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="flex flex-col justify-center flex-1 min-w-0 h-full py-1">
        <div className="flex items-center">
          <span className="text-white text-lg font-bold truncate tracking-wide">
            {char.name}
          </span>
        </div>
      </div>
    </button>
  )
}

export default function HistoryList() {
  const { characterId, selectCharacter } = useCharacter()
  const clearMessages = useChatStore((s) => s.clearMessages)
  const setPrompt = useChatStore((s) => s.setPrompt)

  const handleSelect = (id) => {
    selectCharacter(id)
    const target = CHARACTERS.find((c) => c.id === id)
    setPrompt(target?.prompt || null)
    clearMessages()
  }

  return (
    <div className="flex flex-col gap-0.5">
      {/* Friend list section header */}
      <div className="flex items-center gap-2 px-4 py-1.5">
        <div className="relative">
          <img
            src={`${BAKER}/icons/sns_icon_friend_shadow.png`}
            alt=""
            className="absolute inset-0 w-4 h-4 object-contain opacity-30"
          />
          <img
            src={`${BAKER}/icons/sns_icon_friend.png`}
            alt=""
            className="relative w-4 h-4 object-contain opacity-60"
          />
        </div>
        <span className="text-[11px] font-medium text-label-tertiary uppercase tracking-wider">最近联系人</span>
      </div>

      {CHARACTERS.map((char) => (
        <ContactItem
          key={char.id}
          char={char}
          isSelected={characterId === char.id}
          onSelect={handleSelect}
        />
      ))}
    </div>
  )
}

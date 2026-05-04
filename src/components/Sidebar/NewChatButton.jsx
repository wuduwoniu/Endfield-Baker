import { useChatStore } from '../../store/chatStore'

const BAKER = '/baker-assets'

export default function NewChatButton() {
  const clearMessages = useChatStore((s) => s.clearMessages)

  const handleClick = () => {
    clearMessages()
  }

  return (
    <button
      onClick={handleClick}
      className="w-full h-10 px-4 rounded-full flex items-center justify-between cursor-pointer hover:brightness-95 transition-all shadow-lg"
      style={{ backgroundColor: 'rgb(238, 236, 236)' }}
    >
      <span className="font-bold text-sm" style={{ color: 'rgb(68, 68, 68)' }}>
        添加新会话
      </span>
      <img src={`${BAKER}/ui/list_new_session.png`} alt="" className="w-5 h-5 object-contain" />
    </button>
  )
}

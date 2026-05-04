import { useChatStore } from '../../store/chatStore'
import { useCharacter } from '../CharacterContext'
import ChatHeader from './ChatHeader'
import MessageList from './MessageList'
import ChatInput from '../Input/ChatInput'

export default function ChatArea() {
  const messages = useChatStore((s) => s.messages)
  const { character } = useCharacter()

  return (
    <div className="flex-1 flex flex-col relative min-h-0">
      <ChatHeader />

      {/* Chat body with border and decorations */}
      <div className="flex-1 flex flex-col relative bg-transparent rounded-b-xl min-h-0">
        {/* Full border: left, right, bottom */}
        <div className="absolute inset-0 rounded-b-xl border-l-[1.5px] border-r-[1.5px] border-b-[1.5px] border-[rgb(202,201,201)] pointer-events-none z-20" />

        {/* Top decor: left long line */}
        <div className="absolute top-0 left-0 right-[264px] h-[1.5px] bg-[rgb(202,201,201)] z-30 pointer-events-none" />
        {/* Top decor: right short line */}
        <div className="absolute top-0 right-0 w-8 h-[1.5px] bg-[rgb(202,201,201)] z-30 pointer-events-none" />
        {/* Top decor: notch SVG */}
        <div className="absolute top-0 right-8 w-[232px] h-[10px] z-30 pointer-events-none">
          <svg width="100%" height="100%" viewBox="0 0 232 10" preserveAspectRatio="none">
            <path d="M0,0 L16,6 L216,6 L232,0" fill="none" stroke="rgb(202, 201, 201)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
        {/* Colored decorative bars */}
        <div className="absolute top-[0px] right-[44px] flex gap-2 h-[2px] z-30 pointer-events-none">
          <div className="w-16 h-[2px] shadow-[0_0_8px_rgb(226,2,226)]" style={{ backgroundColor: 'rgb(226,2,226)', clipPath: 'polygon(0 0, 100% 0, 100% 100%, 8px 100%)' }} />
          <div className="w-16 h-[2px] shadow-[0_0_8px_rgb(243,241,0)]" style={{ backgroundColor: 'rgb(243,241,0)' }} />
          <div className="w-16 h-[2px] shadow-[0_0_8px_rgb(1,241,241)]" style={{ backgroundColor: 'rgb(1,241,241)', clipPath: 'polygon(0 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }} />
        </div>

        {/* Message list */}
        {messages.length > 0 ? (
          <div id="chat-scroll-container" className="flex-1 overflow-y-auto p-6 mr-3 relative z-10" style={{ overflowX: 'hidden' }}>
            <MessageList messages={messages} />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-label-tertiary relative z-10">
            请选择一个会话
          </div>
        )}

        {/* Divider line above input */}
        <div className="h-[2px] mx-3 mt-0 mb-1.5 bg-[rgb(71,71,71)] z-10" />

        {/* Input container */}
        <div className="mx-[1.5px] mb-[1.5px] rounded-b-[10px] flex flex-col z-10" style={{ backgroundColor: 'rgb(50, 50, 50)' }}>
          <div className="p-4">
            <ChatInput />
          </div>
        </div>
      </div>
    </div>
  )
}

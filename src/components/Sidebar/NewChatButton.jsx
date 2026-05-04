import { useChatStore } from '../../store/chatStore'

export default function NewChatButton() {
  const clearMessages = useChatStore((s) => s.clearMessages)

  return (
    <button
      onClick={clearMessages}
      className="w-full py-2 px-3 border border-dashed border-border-l2 rounded-lg text-sm text-label-secondary hover:text-label-primary hover:border-label-secondary transition-colors"
    >
      ＋ 新对话
    </button>
  )
}

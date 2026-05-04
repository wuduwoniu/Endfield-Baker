import { useChatStore } from '../../store/chatStore'

export default function HistoryList() {
  const messages = useChatStore((s) => s.messages)

  // derive conversation title from first user message
  const firstUserMsg = messages.find((m) => m.role === 'user')
  const title = firstUserMsg?.content?.slice(0, 30) || null
  const isTruncated = firstUserMsg?.content?.length > 30

  if (!messages.length) {
    return (
      <div className="text-sm text-label-tertiary text-center py-8">
        暂无对话历史
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-border-l1 text-sm text-label-primary truncate">
        {title}{isTruncated ? '...' : ''}
      </div>
    </div>
  )
}

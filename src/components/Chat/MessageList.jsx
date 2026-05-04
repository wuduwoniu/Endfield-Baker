import { useEffect, useRef } from 'react'
import { useChatStore } from '../../store/chatStore'
import MessageBubble from './MessageBubble'

export default function MessageList({ messages }) {
  const isStreaming = useChatStore((s) => s.isStreaming)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="max-w-[768px] mx-auto w-full flex flex-col gap-1">
      {messages.map((msg) => (
        <MessageBubble
          key={msg.id}
          message={msg}
          isStreaming={isStreaming && msg === messages[messages.length - 1] && msg.role === 'assistant'}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  )
}

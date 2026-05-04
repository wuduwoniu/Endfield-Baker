import MarkdownContent from './MarkdownContent'

export default function MessageBubble({ message, isStreaming }) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[80%] ${isUser ? '' : 'w-full'}`}>
        {!isUser && (
          <div className="text-sm font-medium text-label-secondary mb-1 px-1">
            DeepSeek
          </div>
        )}

        <div
          className={`
            px-4 py-3
            ${isUser
              ? 'bg-bubble-user-bg text-bubble-user-text rounded-[16px_16px_4px_16px]'
              : 'bg-bubble-ai-bg text-bubble-ai-text rounded-[16px_16px_16px_4px]'
            }
          `}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
          ) : (
            <>
              <MarkdownContent content={message.content} />
              {isStreaming && !message.content && (
                <span className="inline-block w-2 h-4 bg-label-secondary animate-pulse rounded-sm" />
              )}
              {isStreaming && message.content && (
                <span className="inline-block w-1 h-4 bg-brand-500 ml-0.5 animate-pulse rounded-sm" />
              )}
            </>
          )}
        </div>

        {message.error && (
          <p className="text-red-500 text-xs mt-1 px-1">发送失败，请重试</p>
        )}
      </div>
    </div>
  )
}

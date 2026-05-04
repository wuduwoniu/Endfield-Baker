import { useState, useCallback } from 'react'
import { useChatStore } from '../../store/chatStore'
import { UI_TEXT } from '../../config'

export default function ChatInput() {
  const [text, setText] = useState('')
  const isStreaming = useChatStore((s) => s.isStreaming)
  const sendMessage = useChatStore((s) => s.sendMessage)
  const stopStream = useChatStore((s) => s.stopStream)

  const handleSend = useCallback(() => {
    const trimmed = text.trim()
    if (!trimmed || isStreaming) return
    setText('')
    sendMessage(trimmed)
  }, [text, isStreaming, sendMessage])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInput = (e) => {
    setText(e.target.value)
    const el = e.target
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 200) + 'px'
  }

  return (
    <div className="border-t border-border-l1 bg-bg-base px-4 py-3">
      <div className="max-w-[768px] mx-auto">
        <div className="flex items-end gap-2 border border-border-l1 rounded-input bg-bg-base px-3 py-2 focus-within:border-brand-500 transition-colors shadow-sm">
          <textarea
            value={text}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={UI_TEXT.PLACEHOLDER}
            rows={1}
            disabled={isStreaming}
            className="flex-1 resize-none outline-none text-sm text-label-primary placeholder-label-tertiary bg-transparent max-h-[200px] leading-relaxed"
          />

          {isStreaming ? (
            <button
              onClick={stopStream}
              className="shrink-0 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-colors"
            >
              {UI_TEXT.STOP}
            </button>
          ) : (
            <button
              onClick={handleSend}
              disabled={!text.trim()}
              className="shrink-0 px-3 py-1.5 bg-brand-500 hover:bg-brand-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors"
            >
              {UI_TEXT.SEND}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

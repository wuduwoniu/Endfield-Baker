import { useState, useCallback } from 'react'
import { useChatStore } from '../../store/chatStore'
import { useCharacter } from '../CharacterContext'
import { UI_TEXT } from '../../config'

const BAKER = '/baker-assets'

export default function ChatInput() {
  const [text, setText] = useState('')
  const isStreaming = useChatStore((s) => s.isStreaming)
  const sendMessage = useChatStore((s) => s.sendMessage)
  const stopStream = useChatStore((s) => s.stopStream)
  const setPrompt = useChatStore((s) => s.setPrompt)
  const messages = useChatStore((s) => s.messages)
  const { character } = useCharacter()

  const handleSend = useCallback(() => {
    const trimmed = text.trim()
    if (!trimmed || isStreaming) return
    setText('')
    if (messages.length === 0 && character.prompt) {
      setPrompt(character.prompt)
    }
    sendMessage(trimmed)
  }, [text, isStreaming, sendMessage, setPrompt, messages.length, character.prompt])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const hasText = text.trim().length > 0

  return (
    <div className="px-4 py-3">
      <div className="max-w-[768px] mx-auto">
        <div className="flex items-center gap-1.5 h-10 px-2.5 rounded-full border border-border-l1" style={{ backgroundColor: 'rgb(240, 238, 238)' }}>
          {/* Left: message/document icons */}
          <button
            type="button"
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors shrink-0"
            aria-label="消息类型"
          >
            <img
              src={`${BAKER}/icons/icon_sns_message_01.png`}
              alt="message"
              className="w-5 h-5 object-contain opacity-70"
            />
          </button>

          {/* Text input */}
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={UI_TEXT.PLACEHOLDER}
            disabled={isStreaming}
            className="flex-1 bg-transparent border-none outline-none text-black font-medium text-sm placeholder-gray-500 min-w-0"
          />

          {/* Right: emoticon + plus + send/stop */}
          <div className="flex items-center gap-0.5 shrink-0">
            {/* Emoticon button */}
            <button
              type="button"
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors"
              aria-label="表情"
            >
              <img
                src={`${BAKER}/icons/chat_emoji.png`}
                alt="emoji"
                className="w-5 h-5 object-contain opacity-70"
              />
            </button>

            {/* Plus button */}
            <button
              type="button"
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors"
              aria-label="添加"
            >
              <img
                src={`${BAKER}/input/chat_plus.png`}
                alt="plus"
                className="w-5 h-5 object-contain opacity-70"
              />
            </button>

            {/* Send / Stop */}
            {isStreaming ? (
              <button
                onClick={stopStream}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-red-500/80 hover:bg-red-500 text-white transition-colors"
                aria-label={UI_TEXT.STOP}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="4" y="4" width="16" height="16" rx="2" />
                </svg>
              </button>
            ) : hasText ? (
              <button
                onClick={handleSend}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-brand-500 hover:bg-brand-600 transition-colors"
                aria-label={UI_TEXT.SEND}
              >
                <img
                  src={`${BAKER}/input/chat_enter.png`}
                  alt="send"
                  className="w-4 h-4 object-contain"
                />
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

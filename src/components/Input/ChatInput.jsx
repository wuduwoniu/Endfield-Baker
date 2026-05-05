import { useState, useCallback } from 'react'
import { useChatStore } from '../../store/chatStore'
import { useCharacter } from '../CharacterContext'
import { UI_TEXT } from '../../config'
import { getEmojiText } from '../../config/emojis'
import StickerPanel from './StickerPanel'

const BAKER = '/baker-assets'

export default function ChatInput() {
  const [text, setText] = useState('')
  const [showStickerPanel, setShowStickerPanel] = useState(false)
  const [stickerQueue, setStickerQueue] = useState([])
  const isStreaming = useChatStore((s) => s.isStreaming)
  const sendMessage = useChatStore((s) => s.sendMessage)
  const addUserText = useChatStore((s) => s.addUserText)
  const triggerAiReply = useChatStore((s) => s.triggerAiReply)
  const sendSticker = useChatStore((s) => s.sendSticker)
  const sendStickerReply = useChatStore((s) => s.sendStickerReply)
  const stopStream = useChatStore((s) => s.stopStream)
  const setPrompt = useChatStore((s) => s.setPrompt)
  const messages = useChatStore((s) => s.messages)
  const { character } = useCharacter()

  const handleSend = useCallback(() => {
    const trimmed = text.trim()
    const hasStickers = stickerQueue.length > 0
    if (!trimmed && !hasStickers) return
    if (isStreaming) return

    setText('')
    const stickers = [...stickerQueue]
    setStickerQueue([])

    if (messages.length === 0 && character.prompt) {
      setPrompt(character.prompt)
    }

    if (trimmed && hasStickers) {
      // Text + stickers: add text first, then stickers, THEN trigger AI reply
      addUserText(trimmed)
      stickers.forEach((key) => sendSticker(key))
      triggerAiReply()
    } else if (trimmed) {
      sendMessage(trimmed)
    } else if (hasStickers) {
      stickers.forEach((key) => sendSticker(key))
      setTimeout(() => sendStickerReply(), 500)
    }
  }, [text, stickerQueue, isStreaming, sendMessage, addUserText, triggerAiReply, sendSticker, sendStickerReply, setPrompt, messages.length, character.prompt])

  const handleEmojiSelect = useCallback((key) => {
    const emotion = getEmojiText(key)
    if (emotion) {
      setText((prev) => prev + '[' + emotion + ']')
    }
  }, [])

  const handleStickerSelect = useCallback((key) => {
    if (text.trim()) {
      setStickerQueue((prev) => [...prev, key])
    } else {
      sendSticker(key)
      setTimeout(() => sendStickerReply(), 500)
    }
  }, [text, sendSticker, sendStickerReply])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (showStickerPanel) setShowStickerPanel(false)
      handleSend()
    }
  }

  const hasText = text.trim().length > 0
  const hasStickers = stickerQueue.length > 0

  return (
    <div className="px-4 py-3">
      <div className="max-w-[768px] mx-auto">
        <div className="flex items-center gap-2">
          {/* Input bar */}
          <div className="flex-1 flex items-center gap-1.5 h-10 px-2.5 rounded-full border border-border-l1" style={{ backgroundColor: 'rgb(240, 238, 238)' }}>
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

            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={UI_TEXT.PLACEHOLDER}
              disabled={isStreaming}
              className="flex-1 bg-transparent border-none outline-none text-black font-medium text-sm placeholder-gray-500 min-w-0"
            />

          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm hover:brightness-95 transition-all cursor-pointer"
              style={{ backgroundColor: 'rgb(240, 238, 238)' }}
              aria-label="表情"
              onClick={() => setShowStickerPanel(true)}
            >
              <img
                src={`${BAKER}/icons/chat_emoji.png`}
                alt="emoji"
                className="w-6 h-6 object-contain opacity-80"
              />
            </button>

            <button
              type="button"
              className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm hover:brightness-95 transition-all cursor-pointer"
              style={{ backgroundColor: 'rgb(240, 238, 238)' }}
              aria-label="添加"
            >
              <img
                src={`${BAKER}/input/chat_plus.png`}
                alt="plus"
                className="w-6 h-6 object-contain opacity-80"
              />
            </button>

            {isStreaming ? (
              <button
                onClick={stopStream}
                className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm hover:brightness-95 transition-all cursor-pointer"
                style={{ backgroundColor: 'rgb(240, 238, 238)' }}
                aria-label={UI_TEXT.STOP}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-red-500">
                  <rect x="4" y="4" width="16" height="16" rx="2" />
                </svg>
              </button>
            ) : (hasText || hasStickers) ? (
              <button
                onClick={handleSend}
                className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm hover:brightness-95 transition-all cursor-pointer"
                style={{ backgroundColor: 'rgb(240, 238, 238)' }}
                aria-label={UI_TEXT.SEND}
              >
                <img
                  src={`${BAKER}/input/chat_enter.png`}
                  alt="send"
                  className="w-5 h-5 object-contain opacity-80"
                />
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {showStickerPanel && (
        <StickerPanel
          onSelectEmoji={handleEmojiSelect}
          onSelectSticker={handleStickerSelect}
          onClose={() => setShowStickerPanel(false)}
        />
      )}
    </div>
  )
}

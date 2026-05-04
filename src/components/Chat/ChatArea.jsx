import { useChatStore } from '../../store/chatStore'
import WelcomeScreen from './WelcomeScreen'
import MessageList from './MessageList'

export default function ChatArea() {
  const messages = useChatStore((s) => s.messages)

  if (messages.length === 0) {
    return <WelcomeScreen />
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <MessageList messages={messages} />
    </div>
  )
}

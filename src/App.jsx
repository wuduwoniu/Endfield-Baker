import Header from './components/Header/Header'
import Sidebar from './components/Sidebar/Sidebar'
import ChatArea from './components/Chat/ChatArea'
import ChatInput from './components/Input/ChatInput'

export default function App() {
  return (
    <div className="h-screen flex flex-col bg-bg-base">
      <Header />
      <Sidebar />
      <ChatArea />
      <ChatInput />
    </div>
  )
}

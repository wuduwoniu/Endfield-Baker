import { CharacterProvider } from './components/CharacterContext'
import Header from './components/Header/Header'
import Sidebar from './components/Sidebar/Sidebar'
import ChatArea from './components/Chat/ChatArea'

export default function App() {
  return (
    <CharacterProvider>
      <div className="h-screen flex flex-col bg-[#0a0b10]">
        <Header />
        <div className="flex-1 flex overflow-hidden p-8 gap-8 min-h-0">
          <Sidebar />
          <ChatArea />
        </div>
      </div>
    </CharacterProvider>
  )
}

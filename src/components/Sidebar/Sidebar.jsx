import NewChatButton from './NewChatButton'
import HistoryList from './HistoryList'

const BAKER = '/baker-assets'

export default function Sidebar() {
  return (
    <aside className="w-80 h-full flex flex-col min-h-0 bg-transparent relative shrink-0">
      {/* HUD background texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]">
        <img
          src={`${BAKER}/backgrounds/deco_sns_hudentry_bg.png`}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      {/* Contact list — px-4 gives room for contact item borders */}
      <div className="flex-1 overflow-y-auto space-y-3 px-4 pb-20 relative">
        <HistoryList />
      </div>

      {/* Bottom add button */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0a0b10] to-transparent">
        <NewChatButton />
      </div>
    </aside>
  )
}

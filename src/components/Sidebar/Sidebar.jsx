import { useChatStore } from '../../store/chatStore'
import NewChatButton from './NewChatButton'
import HistoryList from './HistoryList'

export default function Sidebar() {
  const { sidebarOpen, closeSidebar } = useChatStore()

  return (
    <>
      {/* Overlay */}
      {sidebarOpen && (
        <div
          role="presentation"
          className="fixed inset-0 z-[1001] bg-black/40 transition-opacity"
          onClick={closeSidebar}
        />
      )}

      {/* Drawer */}
      <aside
        className={`
          fixed top-0 left-0 bottom-0 z-[1002] w-[280px] max-w-[85vw]
          bg-bg-layer1 border-r border-border-l1
          flex flex-col gap-3 p-4
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-label-primary">历史对话</h2>
          <button
            onClick={closeSidebar}
            className="text-label-tertiary hover:text-label-primary text-lg"
          >
            ✕
          </button>
        </div>

        <NewChatButton />

        <div className="flex-1 overflow-y-auto">
          <HistoryList />
        </div>

        {/* Bottom gradient fade */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-bg-layer1 to-transparent" />
      </aside>
    </>
  )
}

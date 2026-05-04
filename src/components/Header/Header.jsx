const BAKER = '/baker-assets'

export default function Header() {
  return (
    <header className="h-[64px] flex items-center px-8 justify-between shrink-0">
      {/* Left: path */}
      <div className="flex items-center gap-4">
        <span className="text-white text-base font-bold select-none">
          <span className="text-gray-400">//</span>BAKER<span className="text-gray-400">/</span>会话消息
        </span>
      </div>

      {/* Right: player info */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors">
          <span className="text-label-secondary text-sm">终端管理员</span>
          <div className="w-8 h-8 rounded bg-bg-layer2 overflow-hidden border border-border-l1">
            <img
              src={`${BAKER}/avatars/endministrator.png`}
              alt="终端管理员"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  )
}

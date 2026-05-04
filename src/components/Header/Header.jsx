import { useChatStore } from '../../store/chatStore'
import Logo from './Logo'
import ModeSelector from './ModeSelector'
import ThemeToggle from './ThemeToggle'
import { useTheme } from '../../hooks/useTheme'

export default function Header() {
  const { currentMode, setMode, toggleSidebar } = useChatStore()
  const { isDark, toggle: toggleTheme } = useTheme()

  return (
    <header className="flex items-center justify-between h-[60px] px-5 border-b border-border-l1 bg-bg-base shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="text-xl text-label-secondary hover:text-label-primary transition-colors"
          aria-label="\u6253\u5F00\u4FA7\u8FB9\u680F"
        >
          {'\u2630'}
        </button>
        <Logo />
      </div>

      <ModeSelector currentMode={currentMode} onSelect={setMode} />

      <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
    </header>
  )
}

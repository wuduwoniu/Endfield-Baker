import { UI_TEXT } from '../../config'

export default function ThemeToggle({ isDark, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="p-2 rounded-lg hover:bg-bg-layer2 transition-colors text-label-secondary hover:text-label-primary"
      aria-label={isDark ? UI_TEXT.THEME_LIGHT_LABEL : UI_TEXT.THEME_DARK_LABEL}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  )
}

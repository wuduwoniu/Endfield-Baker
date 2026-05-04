const MODES = [
  { key: 'fast', label: 'Fast', icon: '\u26A1' },
  { key: 'expert', label: 'Expert', icon: '\u2726' },
  { key: 'vision', label: 'Vision', icon: '\uD83D\uDCF7' },
]

export default function ModeSelector({ currentMode, onSelect }) {
  return (
    <div className="flex items-center gap-1 bg-bg-layer2 rounded-capsule p-0.5">
      {MODES.map(({ key, label, icon }) => (
        <button
          key={key}
          onClick={() => onSelect(key)}
          className={`
            flex items-center gap-1 px-3 py-1.5 text-sm rounded-capsule transition-all
            ${currentMode === key
              ? 'bg-white dark:bg-gray-700 text-brand-500 font-medium shadow-sm'
              : 'text-label-secondary hover:text-label-primary'
            }
          `}
        >
          <span>{icon}</span>
          <span>{label}</span>
        </button>
      ))}
    </div>
  )
}

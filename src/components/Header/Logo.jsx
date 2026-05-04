export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L2 7v10l10 5 10-5V7l-10-5z" fill="url(#logo-grad)" />
        <defs>
          <linearGradient id="logo-grad" x1="2" y1="7" x2="22" y2="17">
            <stop stopColor="#4f6bff" />
            <stop offset="1" stopColor="#6c5ce7" />
          </linearGradient>
        </defs>
      </svg>
      <span className="text-lg font-semibold text-label-primary">DeepSeek</span>
    </div>
  )
}

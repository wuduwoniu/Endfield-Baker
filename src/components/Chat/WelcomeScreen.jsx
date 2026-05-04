export default function WelcomeScreen() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 px-4">
      <img src="/logo.png" alt="logo" className="w-16 h-16 rounded-full object-cover" />
      <h1 className="text-2xl font-semibold text-label-primary">有什么可以帮你的？</h1>
      <p className="text-sm text-label-secondary">选择下方模式开始对话，或直接输入问题</p>
    </div>
  )
}

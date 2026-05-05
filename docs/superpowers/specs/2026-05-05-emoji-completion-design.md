# 表情发送模块 — 设计文档

## 目标
在 ChatInput 右侧表情按钮点击后弹出表情网格面板，点击表情发送，对标 Baker `sticker_menu` 的网格弹出模式。

## 架构（遵守四层结构）

```
src/config/emojis.js         配置层 — 38个emoji key + 图片路径 + 中文情绪映射 + 文本解析
src/components/Input/
  EmojiPanel.jsx             UI层 — 固定底部弹出的表情网格（纯展示 + 回调）
  ChatInput.jsx              修改 — 表情按钮点击弹出面板 + 插入情绪文本
src/components/Chat/
  MessageBubble.jsx          修改 — 消息中的[情绪]渲染为表情图片
```

**数据流：**
```
用户点击表情按钮 → EmojiPanel 弹出（底部居中，输入栏上方）
  → 用户点击某个表情 → 输入框插入 "[开心]" → 面板关闭
  → 用户点击发送 → AI 收到 "[开心]"（理解情绪含义）
  → 消息气泡中 "[开心]" 自动渲染为表情图片（用户看到图像）
```

## 配置：`src/config/emojis.js`

```js
// 38 个表情 key（与 Baker emojis.rs EMOJI_KEYS 一致）
export const EMOJI_KEYS = [...]

// key → 中文情绪映射（发给 AI 理解）
export const EMOJI_TEXT = {
  happy: '开心', sad: '难过', angry: '愤怒', love: '爱心', ...
}

// key → 图片路径
export function getEmojiSrc(key)

// key → 中文情绪
export function getEmojiText(key)

// 文本解析：将 "你好[开心]世界" 拆分为 [{text}, {emoji}, {text}]
// 供 MessageBubble 渲染时把 [情绪] 替换为表情图片
export function parseEmojiSegments(text)
```

## UI：`EmojiPanel.jsx`

- 纯展示组件，props: `{ onSelect, onClose }`
- 固定底部弹出，输入栏正上方居中

```
遮罩: fixed inset-0 z-50 flex items-end justify-center pb-40
面板: rounded-xl shadow-xl p-3 mx-4
背景: rgb(220, 220, 220)
最大宽度: 460px
网格: grid grid-cols-8 gap-2
可见行数: 2行 (max-h-[136px] overflow-y-auto)
单元格: w-14 h-14 rounded-lg bg-white/60 hover:bg-white/80
表情图: w-12 h-12 object-contain
点击行为: onSelect(key) + onClose()
点击遮罩: onClose()
```

## 修改：`ChatInput.jsx`

- 表情按钮在输入框外面右侧（和加号、发送同一行）
- 三个按钮统一 `w-10 h-10`、`rgb(240, 238, 238)` 背景

```
布局: [ 输入框: 消息图标 + 文本输入 ] [表情] [加号] [发送]

表情按钮 onClick → setShowEmojiPanel(true)
EmojiPanel onSelect → setText(prev => prev + '[' + getEmojiText(key) + ']')
EmojiPanel onClose → setShowEmojiPanel(false)
```

已移除的内容：
- `detectCompletion()` / `applyCompletion()` 文本补全逻辑
- `completion` / `activeIndex` 状态
- 表情键盘导航（ArrowUp/Down/Enter/Tab/Escape）

## 修改：`MessageBubble.jsx`

用户消息气泡中，`[情绪]` 文本被解析并渲染为内联表情图片：

```jsx
{parseEmojiSegments(message.content).map(seg =>
  seg.type === 'emoji'
    ? <img src={seg.src} className="inline-block w-7 h-7 align-middle mx-0.5" />
    : <span>{seg.value}</span>
)}
```

AI 消息不受影响，继续使用 MarkdownContent 渲染。

## 素材

- 38 个 emoji PNG：`public/baker-assets/emojis/sns_emoji_001.png` ~ `038.png`
- 表情按钮图标：`public/baker-assets/icons/chat_emoji.png`
- 加号按钮图标：`public/baker-assets/input/chat_plus.png`
- 发送按钮图标：`public/baker-assets/input/chat_enter.png`

## 测试

`emojis.test.js`（15个测试）:
- EMOJI_KEYS 长度/去重
- getEmojiSrc 首/尾/中/未知 key
- getEmojiText 已知/未知 key，全部非空
- parseEmojiSegments 纯文本/单表情/混合/空串/未知括号

`EmojiPanel.test.jsx`（5个测试）:
- 渲染 38 个按钮
- 图片 src 正确
- 点击触发 onSelect + onClose
- 遮罩点击触发 onClose
- 面板本体点击不触发 onClose

## 不做

- 不实现 `:keyword` 文本补全（用户明确要求表情网格弹窗）
- 不新建 store 状态（showEmojiPanel 为 ChatInput 本地 state）

# 表情贴图模块 — 设计文档

## 目标
在现有 Emoji 表情弹窗基础上，新增"表情贴图"切换标签，支持在 Emoji 和贴图之间切换。贴图资源来自 Baker-DX 的 game/ 和 skland/ 目录，共约 168 张。

## 贴图素材搬迁与命名规范

### 源位置
```
public/baker-assets/baker-dx-master/assets/extracted/sticker/
├── game/       120 张 PNG  (sns_sticker.png, sns_sticker2~4.png, sns_sticker_001~116.png)
└── skland/     48 张 WEBP (哈希命名，无规律)
```

### 目标位置
```
public/baker-assets/stickers/
├── game/       统一命名 sticker_game_001.png ~ sticker_game_120.png
└── skland/     统一命名 sticker_skland_001.webp ~ sticker_skland_048.webp
```

### 命名规则
- game 目录：按数字排序后重命名为 `sticker_game_XXX.png`
- skland 目录：按文件名排序后重命名为 `sticker_skland_XXX.webp`
- 配置文件 `src/config/stickers.js` 维护 key → 文件名映射，未来改名只需改配置

## 架构（遵守四层结构）

```
src/config/stickers.js             配置层 — 贴图 key 列表 + key → 路径映射
src/config/emojis.js               配置层 — 不变
src/components/Input/
  StickerPanel.jsx                 改名重构（原 EmojiPanel）— 左侧标签 + 右侧内容区
    ├── EmojiGrid                  现有 emoji 8列网格（行为不变）
    └── StickerGrid                新增贴图 5列网格，2行可见，滚动
  ChatInput.jsx                    修改 — 贴图队列 + 拆分发送逻辑
src/components/Chat/
  MessageBubble.jsx                修改 — 新增 contentType: 'sticker' 渲染分支
```

**数据流：**
```
用户输入文字 → 打开 StickerPanel → 切换"贴图"标签
  → 点击贴图
    → 输入框无文字：面板关闭 → store.sendSticker(key) → AI回复随机贴图
    → 输入框有文字：贴图加入队列 → 输入框显示缩略图队列 → 用户点发送
      → store.sendMessage(text) → 逐张 store.sendSticker(key)
```

## 组件设计

### StickerPanel（原 EmojiPanel 改名 + 重构）

**Props**: `{ onSelectEmoji, onSelectSticker, onClose }`

**布局**：
```
固定底部弹出（pb-40），遮罩可点击关闭
┌────────────────────────────────────────┐
│ ┌──────┬─────────────────────────────┐ │
│ │ [😊] │  Emoji: 8列网格              │ │
│ │      │  或                          │ │
│ │ [📷] │  Sticker: 5列网格             │ │
│ │      │  (max-h-[136px] overflow-y-auto) │
│ └──────┴─────────────────────────────┘ │
└────────────────────────────────────────┘
 左侧标签(64px)  右侧内容区(flex-1)
   灰色背景 rgb(220,220,220)
```

- 左侧竖排两个图标按钮：Emoji（chat_emoji.png），贴图（选用现有素材图标）
- 选中标签高亮，另一个灰显
- Emoji 标签 → EmojiGrid（现有 8 列，行为不变）
- 贴图标签 → StickerGrid（5 列网格，白色圆角方格，和 emoji 格样式一致）
- 贴图函数回调 `onSelectSticker(key)`，Emoji 回调 `onSelectEmoji(key)`

### ChatInput 修改

**新增状态**：
```
stickerQueue: string[] — 贴图 key 队列（输入框有文字时使用）
```

**现有状态保持不变**：
```
text, showStickerPanel (原 showEmojiPanel)
```

**发送逻辑**：
```
handleSend():
  if stickerQueue 非空 && text 非空:
    sendMessage(text)
    stickerQueue.forEach(key => sendSticker(key))
    stickerQueue 清空
    text 清空
  else if text 非空:
    sendMessage(text)  // 现有逻辑
  else if stickerQueue 非空:
    stickerQueue.forEach(key => sendSticker(key))  // 无文字直接发送（通常就1张）
    stickerQueue 清空

handleSelectSticker(key):
  if text.trim() 为空:
    onCloseStickerPanel()
    sendSticker(key)  // 无文字：直接发送
  else:
    setStickerQueue(prev => [...prev, key])  // 有文字：加入队列
```

**输入框缩略图**：
- 有贴图队列时，在输入框内文字后面显示缩略图列表
- 缩略图高度与文字行高一致（~28px），inline 排列
- 每张缩略图可点击 × 删除

### MessageBubble 修改

**Props**: 不变
**新增逻辑**：检测 `message.contentType === 'sticker'`

**贴图气泡**：
- 保留用户消息气泡背景 + 头像框
- 内容区渲染贴图大图（240×240）
- content 为贴图 key，通过 getStickerSrc 获取路径
- 无 SVG 尾巴（贴图不需要）

## 配置：`src/config/stickers.js`

```js
const BAKER = '/baker-assets'

// 168 个贴图 key（game/ 120 + skland/ 48）
export const STICKER_KEYS = [
  'sticker_game_001', 'sticker_game_002', ... // game/ 120张
  'sticker_skland_001', 'sticker_skland_002', ... // skland/ 48张
]

// key → 路径
export function getStickerSrc(key) {
  const parts = key.split('_')  // sticker_game_001 → game, 001
  const category = parts[1]     // game or skland
  const num = parts[2]
  const ext = category === 'skland' ? 'webp' : 'png'
  return `${BAKER}/stickers/${category}/sticker_${category}_${num}.${ext}`
}
```

## 测试

`stickers.test.js`:
- STICKER_KEYS 长度 168
- getStickerSrc 解析正确（game PNG / skland WEBP）
- 未知 key 返回 null
- 无重复 key

`StickerPanel.test.jsx`（原 EmojiPanel.test.jsx 改名扩展）:
- 左侧两个标签按钮渲染
- 默认选中 Emoji 标签
- 切换标签显示对应网格
- Emoji 选择回调（onSelectEmoji）
- 贴图选择回调（onSelectSticker）
- 遮罩关闭（onClose）

`ChatInput.test.jsx`（扩展）:
- 有文字 + 点贴图 → 加入队列，不发送
- 无文字 + 点贴图 → 直接发送
- 有文字 + 队列 + 发送 → 先文字后贴图依次发
- 缩略图 × 按钮可删除

`MessageBubble.test.jsx`（扩展）:
- contentType: 'sticker' 渲染贴图图片
- 贴图无 SVG 尾巴

## 边界情况

| 情况 | 处理 |
|------|------|
| 输入框空 + 点贴图 | 面板关闭，sendSticker 直接发出 |
| 输入框有文字 + 点贴图 | 加入 stickerQueue，不关闭面板 |
| 输入框有文字 + N张贴图 + 发送 | 先 sendMessage(文字) → 逐张 sendSticker |
| 只有贴图队列无文字 + 发送 | 逐张 sendSticker |
| 删除文字后只剩贴图队列 | 保留队列，发送时只发贴图 |
| 删除所有贴图队列 | 回到纯文字状态 |
| 贴图弹窗中关闭 | stickerQueue 保留（已选的不丢） |

## 不做

- 不实现贴图上传（Baker 的 on_add_sticker）
- 不实现贴图发送给对方（Baker 的 on_send_sticker_other）
- 贴图暂不转 AI 情绪文本（未来扩展）
- 不改变 Emoji → [情绪] → AI 理解的现有流程
- 纯贴图消息 → AI 随机回复一张贴图（已实现）
- 纯贴图消息（无文字）→ AI 随机回复一张贴图（从 STICKER_KEYS 中随机选取）
- 有文字伴随的贴图 → 文字走正常 AI 流式回复，贴图不触发额外 AI 行为

## Store 新增

`chatStore.js` 新增 actions：

```
sendSticker(key): 创建一条 contentType: 'sticker' 的用户消息，写入 messages
  → 消息结构: { id, role: 'user', content: key, contentType: 'sticker', timestamp }

sendStickerReply(): 从 STICKER_KEYS 随机选一张，创建 AI 贴图回复
  → 消息结构: { id, role: 'assistant', content: key, contentType: 'sticker', timestamp }
  → 延迟 500ms 后写入（模拟回复间隔）
  → 用于纯贴图消息（无文字）时 AI 回应
```

**发送逻辑（ChatInput handleSend 最终版）**：

```
if stickerQueue 非空 && text 非空:
  sendMessage(text)                        // 文字走正常 AI 流式
  stickerQueue.forEach(key => sendSticker(key))
else if text 非空:
  sendMessage(text)                        // 纯文字，现有逻辑
else if stickerQueue 非空:
  stickerQueue.forEach(key => sendSticker(key))
  setTimeout(() => sendStickerReply(), 500) // AI 随机贴图回复
```

# 庄方宜模拟器 - 项目说明书

## 项目概述
基于 React + Vite 的 AI 聊天网页，使用 Baker-DX 暗色工业风格 UI，模拟《明日方舟：终末地》多角色对话。支持庄方宜、佩丽卡、陈千语三个角色，每个角色有独立人设提示词，通过 DeepSeek API system message 注入。

## 线上地址
https://deepseek-chat-clone.vercel.app

## 技术栈
- **框架：** React 19 + Vite 8
- **样式：** Tailwind CSS 3（Baker 暗色主题背景 `#0a0b10`）
- **状态管理：** Zustand 5
- **Markdown：** react-markdown + rehype-highlight + remark-gfm
- **API：** DeepSeek API（OpenAI 兼容格式），SSE 流式传输
- **测试：** Vitest + @testing-library/react + jsdom
- **部署：** Vercel（Serverless Function 代理 API）

## 四层架构（严禁跨层污染）

```
src/
├── config/         配置层 — 零依赖
│   └── index.js    API地址、模型名、请求参数、UI文本
├── api/            通信层 — 只依赖 config
│   └── index.js    封装 fetch、SSE 解析，UI不直接调
├── store/          状态层 — 依赖 api + utils
│   └── chatStore.js  Zustand：消息列表、流式状态、系统提示词注入
├── utils/          工具层 — 零依赖
│   └── index.js    纯函数：genId、formatTime、truncate
├── components/     UI层 — 只通过 store selector 获取数据
│   ├── CharacterContext.jsx  React Context：多角色选择状态
│   ├── characters.js         角色定义：头像、名称、人设提示词
│   ├── Header/     导航栏（透明背景）：路径指示器 + 玩家头像
│   ├── Sidebar/    左侧常驻侧边栏（w-80, 320px）：HUD背景 + 联系人列表 + 添加新会话
│   ├── Chat/       聊天区（右侧3/4）：Baker装饰头部 + 消息气泡 + 装饰边框
│   └── Input/      输入区：浅色胶囊输入框 + 表情/加号/发送按钮
└── hooks/
    └── useTheme.js  深色模式切换 + localStorage持久化
```

**依赖方向（单行道）：**
```
components/hooks  →  store  →  api  →  config
                    store  →  utils
                    api    →  config
```

**禁止事项：** 组件内不可直接 import api、config 或 utils；不可直接写 fetch。

## 完整文件树

```
/
├── api/deepseek.js          Vercel Serverless Function（API代理，注入Key）
├── vercel.json              Vercel 路由重写配置
├── vite.config.js           Vite + proxy（dev模式用loadEnv注入Key）
├── tailwind.config.js       Tailwind 自定义token（Baker暗色主题色板）
├── vitest.config.js         测试配置
├── index.html               入口HTML
├── package.json             依赖
├── .env                     API Key（本地开发，已加入.gitignore）
├── LAYOUT_SPEC.md           UI排版规格文档（Baker源码对照）
├── CLAUDE.md                本文件
├── public/
│   └── baker-assets/        Baker-DX 素材（按用途分目录）
│       ├── avatars/         zhuangfy.png, pelica.png, chen.png, endministrator.png
│       ├── backgrounds/     HUD背景、聊天纹理、按钮阴影
│       ├── decorations/     推文装饰条（5个）
│       ├── header/          chat_head_left/mid/right（set1 + set2）
│       ├── icons/           好友图标、消息图标、表情图标
│       ├── input/           chat_enter.png, chat_plus.png
│       ├── masks/           头像遮罩、头部遮罩
│       └── ui/              avatarframe.png, list_new_session.png
└── src/
    ├── config/index.js      集中配置（API地址、模型名、UI文本）
    ├── api/index.js         通信层（buildChatBody, sendChatMessage, parseSSEStream）
    ├── store/chatStore.js   Zustand store（状态 + actions）
    ├── utils/index.js       工具函数
    ├── hooks/useTheme.js    主题Hook
    ├── styles/index.css     Tailwind指令 + CSS变量 + 滚动条样式
    ├── components/
    │   ├── CharacterContext.jsx  多角色Context Provider
    │   ├── characters.js         角色定义（庄方宜/佩丽卡/陈千语）
    │   ├── Header/
    │   │   └── Header.jsx        透明背景：//BAKER/会话消息 + 终端管理员头像
    │   ├── Sidebar/
    │   │   ├── Sidebar.jsx       左1/4常驻：HUD纹理背景 + 联系人列表 + 渐变底部
    │   │   ├── HistoryList.jsx   联系人列表（88px高、选中白边框、好友图标标题）
    │   │   └── NewChatButton.jsx 浅灰圆角按钮"添加新会话" + list_new_session图标
    │   ├── Chat/
    │   │   ├── ChatArea.jsx      右侧聊天区：ChatHeader + 装饰边框 + 消息列表 + 输入区
    │   │   ├── ChatHeader.jsx    Baker聊天头（Alt版默认，mid用CSS background-image拉伸）
    │   │   ├── MessageList.jsx   消息列表 + 自动滚动
    │   │   ├── MessageBubble.jsx 气泡（用户白色网格纹理 + AI深灰，SVG尾巴，FramedAvatar头像框）
    │   │   └── MarkdownContent.jsx react-markdown渲染
    │   └── Input/
    │       └── ChatInput.jsx     浅色输入条（rgb(240,238,238)）+ 消息/表情/加号/发送图标
    ├── App.jsx                   主布局：Header + Sidebar(左1/4) + ChatArea(右3/4)
    └── main.jsx                  入口

tests/ 内联在组件旁（9个文件，22个用例，全部通过）
```

## 素材清单

基础路径：`/baker-assets/`

| 组件 | 使用的素材 |
|------|-----------|
| **Sidebar** | `backgrounds/deco_sns_hudentry_bg.png`, `icons/sns_icon_friend.png` + `_shadow.png`, `ui/list_new_session.png` |
| **Header** | `avatars/endministrator.png` |
| **ChatHeader** | `header/chat_head_left_2.png`, `header/chat_head_mid_2.png`, `header/chat_head_right_2.png`（Alt版默认） |
| **MessageBubble** | `ui/avatarframe.png`, `avatars/endministrator.png` + 角色头像 |
| **ChatInput** | `icons/icon_sns_message_01.png`, `icons/chat_emoji.png`, `input/chat_plus.png`, `input/chat_enter.png` |
| **角色头像** | `avatars/zhuangfy.png`, `avatars/pelica.png`, `avatars/chen.png` |

详细排版规格见 `LAYOUT_SPEC.md`。

## 数据流（发送一条消息）

```
用户输入文字 → ChatInput.handleSend()
  → 首次消息时 store.setPrompt(character.prompt)           # 注入角色人设
  → store.sendMessage(text)
    → 构建 historyMessages = messages.filter(m => m.content)  # 跳过空的assistant占位
    → 如果有 currentPrompt，unshift system message
    → api.sendChatMessage(historyMessages)
      → fetch /api/deepseek/chat/completions               # 无 Authorization header
        → 【本地】Vite proxy (loadEnv) 注入 Key
        → 【线上】Vercel api/deepseek.js 注入 Key
        → DeepSeek API
    → parseSSEStream(response.body)                        # 逐 chunk 解析 SSE
    → store.appendChunk() → finishStream()
```

## 多角色系统

```js
// src/components/characters.js
CHARACTERS = [
  { id: 'zhuang-fangyi', name: '庄方宜', avatar: '/baker-assets/avatars/zhuangfy.png', role: '罗德岛干员' },
  { id: 'perlica', name: '佩丽卡', avatar: '/baker-assets/avatars/pelica.png', role: '罗德岛干员' },
  { id: 'chen', name: '陈千语', avatar: '/baker-assets/avatars/chen.png', role: '龙门近卫局督察' },
]

// src/components/CharacterContext.jsx — React Context
// 提供: { characterId, character, selectCharacter }
```

角色切换流程：点击侧边栏联系人 → `selectCharacter(id)` → `setPrompt(target.prompt)` + `clearMessages()`

## 安全架构

- **API Key 不进入前端 bundle：** 前端请求无 Authorization header
- **本地开发：** Vite proxy 用 `loadEnv()` 从 `.env` 读取 Key，在 proxyReq 事件中注入
- **生产环境：** `api/deepseek.js` Serverless Function 从 `process.env.VITE_DEEPSEEK_API_KEY` 读取 Key
- **环境变量：** 本地 `.env`（已 .gitignore）；Vercel Dashboard → Settings → Environment Variables
- **验证方式：** `grep -r "sk-" src/ api/` 确认零结果

## 关键状态（Zustand Store）

```js
{
  messages: [{ id, role, content, timestamp }],  // 消息列表
  currentMode: 'fast',                            // 模型模式
  currentPrompt: string | null,                   // 当前角色人设提示词
  isStreaming: boolean,                           // 流式传输中
  error: string | null,                           // 错误信息
  abortController: AbortController | null,        // 停止流式
  // Actions:
  sendMessage(text),    // 发送消息（含 system message 注入 + 空占位过滤）
  setPrompt(prompt),    // 设置角色人设
  setMode(mode),        // 切换模型
  clearMessages(),      // 清空消息
  stopStream(),         // 中止流式
  appendChunk(id, c),   // 追加流式chunk
  finishStream(id),     // 结束流式
}
```

## 部署运维

- **平台：** Vercel（wuduwonius-projects / deepseek-chat-clone）
- **仓库：** https://github.com/wuduwoniu/Zhuang-Fangyi
- **环境变量：** `VITE_DEEPSEEK_API_KEY` → https://vercel.com/wuduwonius-projects/deepseek-chat-clone/settings/environment-variables
- **更新方式：** `git push origin main` → Vercel 自动部署

## 核心规则（AI 必须遵守）

1. 修改代码前先确认改动范围，只改该改的文件
2. 禁止修改项目架构和四层结构
3. 所有 API Key 相关操作必须确认安全性
4. 修改后自动运行 `npm run build` 验证，但不要提交
5. 遇到错误先分析原因，不要盲目修改
6. 组件数据获取规范

6.1 运行时状态（必须走 store）
组件只能通过 store selector 获取运行时状态和数据，包括但不限于：
  - 消息列表、流式状态、错误信息
  - 当前角色、模型模式
  - 任何会随时间变化的状态
→ 禁止组件直接 import api/ 进行网络请求
→ 禁止组件直接调用 utils/ 中的函数（如 genId、formatTime 等工具函数应通过 store 暴露，或由 store 内部调用）

6.2 静态常量（允许直接 import config）
组件可以直接 import config 中的纯静态常量，包括但不限于：
  - UI 文本常量（如 UI_TEXT）
  - 枚举映射表（如 EMOJI_KEYS）
  - 纯函数映射（如 getEmojiSrc、getEmojiText 等，前提是不涉及网络/I/O/状态读写）
→ 判断标准：该 import 是否涉及网络请求、文件系统、或运行时可变状态
  - 否 → 允许
  - 是 → 禁止，必须走 store

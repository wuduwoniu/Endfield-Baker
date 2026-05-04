# 庄方宜模拟器 - 项目说明书

## 项目概述
一个基于 React + Vite 的 AI 聊天网页，使用 Baker-DX 暗色工业风格 UI，模拟《明日方舟：终末地》多角色对话。支持庄方宜、佩丽卡、陈晖洁三个角色，每个角色有独立的人设提示词，通过 DeepSeek API 的 system message 注入。

## 线上地址
https://deepseek-chat-clone.vercel.app

## 技术栈
- **框架：** React 19 + Vite 8
- **样式：** Tailwind CSS 3（class 策略深色模式，Baker 暗色主题 `#0f1116`）
- **状态管理：** Zustand 5
- **Markdown：** react-markdown + rehype-highlight + remark-gfm
- **API：** DeepSeek 原生 API（OpenAI 兼容格式），SSE 流式传输
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
│   └── chatStore.js  Zustand：消息列表、流式状态、模式切换、系统提示词注入
├── utils/          工具层 — 零依赖
│   └── index.js    纯函数：genId、formatTime、truncate
├── components/     UI层 — 只依赖 store（selector）和 hooks
│   ├── CharacterContext.jsx  React Context：多角色选择状态
│   ├── characters.js         角色定义：头像、名称、人设提示词
│   ├── Header/     导航栏：路径指示器 + 玩家头像 + 教程入口 + 模式下拉菜单
│   ├── Sidebar/    抽屉式侧边栏：Baker HUD背景 + 好友列表 + 角色切换
│   ├── Chat/       聊天区：Baker工业装饰头部 + 欢迎页/消息列表 + 气泡纹理
│   └── Input/      输入区：暗色胶囊输入框 + 消息图标 + 表情/发送按钮
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
├── vercel.json              Vercel 路由配置
├── vite.config.js           Vite + proxy（dev模式注入Key）
├── tailwind.config.js       Tailwind 自定义token（Baker暗色主题色板）
├── vitest.config.js         测试配置
├── index.html               入口HTML
├── package.json             依赖（React 19, Zustand 5, Tailwind 3, Vite 8, Vitest 4）
├── .env                     API Key（本地开发，已加入.gitignore）
├── .env.example             Key配置示例
├── CLAUDE.md                本文件
├── public/
│   ├── baker-assets/        Baker-DX 原始素材（550+ PNG文件，详见下方Baker素材清单）
│   │   └── baker-dx-master/
│   │       ├── assets/      主素材（avatar, images, extracted/）
│   │       ├── icons/       应用图标
│   │       └── tutorial/    教程引导图
│   └── favicon.svg
├── docs/superpowers/
│   ├── specs/               设计文档
│   └── plans/               实施计划
└── src/
    ├── config/index.js      集中配置
    ├── api/index.js         通信层
    ├── store/chatStore.js   状态管理（含 setPrompt / currentPrompt）
    ├── utils/index.js       工具函数
    ├── hooks/useTheme.js    主题Hook
    ├── styles/index.css     Tailwind指令 + CSS变量（Baker暗色） + 滚动条样式
    ├── components/
    │   ├── CharacterContext.jsx  多角色Context Provider
    │   ├── characters.js         角色定义（3个角色：庄方宜/佩丽卡/陈）
    │   ├── Header/
    │   │   ├── Header.jsx        路径指示器(//BAKER/会话消息) + 玩家头像 + 教程链接 + 更多菜单
    │   │   ├── ModeSelector.jsx  Fast/Expert/Vision 三个pill按钮
    │   │   └── ThemeToggle.jsx   深色模式切换
    │   ├── Sidebar/
    │   │   ├── Sidebar.jsx       滑动抽屉 + 遮罩层 + HUD背景纹理
    │   │   ├── NewChatButton.jsx 渐变蓝"新对话"按钮 + 按钮阴影
    │   │   └── HistoryList.jsx   角色联系人列表（金属质感头像边框 + 好友图标）
    │   ├── Chat/
    │   │   ├── ChatArea.jsx      空状态→WelcomeScreen / 有消息→MessageList
    │   │   ├── ChatHeader.jsx    Baker工业装饰头部（双套装饰 + 几何元素 + 等级图标）
    │   │   ├── WelcomeScreen.jsx 欢迎页（Baker背景纹理 + 头像框 + 工业装饰）
    │   │   ├── MessageList.jsx   消息列表 + 自动滚动 + 可见滚动条
    │   │   ├── MessageBubble.jsx 气泡（Baker纹理背景 + 用户右侧endministrator头像）
    │   │   └── MarkdownContent.jsx react-markdown渲染
    │   └── Input/
    │       └── ChatInput.jsx     暗色胶囊输入框 + 消息图标 + 表情/加号/发送按钮
    ├── App.jsx                   主壳：Header + Sidebar + ChatArea
    └── main.jsx                  入口

tests/ 内联在组件旁（共9个测试文件，22个测试用例，全部通过）
```

## Baker-DX 素材清单

素材根路径：`public/baker-assets/baker-dx-master/`

### 已使用的素材（按组件）

| 组件 | 使用的素材 |
|------|-----------|
| **Sidebar** | `sns_icon_chat.png` + `_shadow.png`, `sns_icon_friend.png` + `_shadow.png`, `deco_sns_hudentry_bg.png`, `list_new_session.png`, `sns_btnbg_shadownew.png` |
| **Header** | `endministrator.png` (玩家头像), `sns_icon_chat.png`, `icon_sns_chat_task_01.png` |
| **ChatHeader** | `chat_head_left/mid/right.png` (set1), `chat_head_left_2/mid_2/right_2.png` (set2), `bg_snscharentry_head.png` + `_Line.png`, `mask_snscharentry_head.png`, `icon_sns_chat_grade.png`, `deco_sns_tweet_decorate_01/02.png` |
| **MessageBubble** | `endministrator.png`, `bg_snscontenttextorpic_chat.png` + `_03.png` |
| **WelcomeScreen** | `deco_sns_chat_bg.png`, `avatarframe.png`, `icon_round_char_square_mask.png`, `deco_sns_tweet_decorate_10/20/30/40.png`, `bg_sns_tweet_decorate_line.png` |
| **ChatInput** | `icon_sns_message_01.png`, `icon_sns_chat_emoticon.png`, `chat_plus.png`, `chat_enter.png` |
| **角色头像** | `icon_round_chr_0030_zhuangfy.png`, `icon_round_chr_0004_pelica.png`, `icon_round_chr_0005_chen.png` |

### Baker素材目录结构

```
baker-dx-master/
├── assets/
│   ├── avatar/endministrator.png    # 终端管理员（玩家）头像
│   ├── images/                      # 主UI图片（chat_head系列、按钮图标、avatarframe）
│   └── extracted/
│       ├── avatar/operator/          # 30个干员圆形头像 + NPC头像
│       ├── bg/                       # 背景图（气泡纹理7个、阴影、HUD背景、聊天背景）
│       ├── decorate/                 # 装饰元素（bg_sns_tweet_decorate 38个 + deco_sns_tweet_decorate 51个）
│       ├── icon/                     # UI图标（聊天12个、任务5个、消息2个、等级、加载等）
│       ├── mask/                     # 遮罩（头像圆形/方形、推文装饰、箭头、头部）
│       ├── emoji/                    # 表情（sns_emoji 38个 + sns_emoiji 36个）
│       ├── sticker/                  # 贴纸（game贴纸100+ + skland贴纸48个webp）
│       └── others/                   # 其他（表情切换、蓝图分享等）
├── icons/                            # 应用图标
└── tutorial/                         # 教程引导图（5张）
```

## 数据流（发送一条消息）

```
用户输入文字 → ChatInput.handleSend()
  → 首次消息时 store.setPrompt(character.prompt)  # 注入角色人设
  → store.sendMessage(text)
    → 构建 apiMessages = [...messages]
    → apiMessages.unshift({ role: 'system', content: currentPrompt })  # system message注入
    → api.sendChatMessage(apiMessages)
      → fetch /api/deepseek/chat/completions
        → 【开发环境】Vite proxy 注入 Key
        → 【生产环境】Vercel Function 读取 env 注入 Key
        → DeepSeek API
    → parseSSEStream(response.body)  # 逐chunk解析SSE
    → store.appendChunk()           # 逐字更新 messages
    → store.finishStream()          # 标记完成
```

## 多角色系统

```js
// src/components/characters.js — 角色定义
CHARACTERS = [
  { id: 'zhuang-fangyi', name: '庄方宜', avatar: 'icon_round_chr_0030_zhuangfy.png', prompt: '...' },
  { id: 'perlica', name: '佩丽卡', avatar: 'icon_round_chr_0004_pelica.png', prompt: '...' },
  { id: 'chen', name: '陈晖洁', avatar: 'icon_round_chr_0005_chen.png', prompt: '...' },
]

// src/components/CharacterContext.jsx — React Context
// 提供: { characterId, character, selectCharacter }
// App.jsx 包裹在 <CharacterProvider> 中
```

角色切换流程：点击侧边栏联系人 → `selectCharacter(id)` → 更新头像/名称 → `setPrompt(target.prompt)` + `clearMessages()` + `closeSidebar()`

## 安全架构

- **API Key 不进入前端代码：** `getAuthHeader()` 已移除，浏览器请求无 Authorization header
- **开发环境：** Vite proxy 在 `proxyReq` 回调中注入 Key（服务端行为）
- **生产环境：** Vercel Serverless Function 从环境变量读取 Key，转发请求
- **环境变量位置：** 本地 `.env`（已 .gitignore）+ Vercel Dashboard
- **验证方式：** `grep` 构建产物确认无 Key 字符串

## 关键状态（Zustand Store）

```js
{
  messages: [{ id, role, content, timestamp }],  // 消息列表
  currentMode: 'fast' | 'expert' | 'vision',     // 当前模式
  currentPrompt: string | null,                   // 当前角色人设提示词
  isStreaming: boolean,                           // 是否流式传输中
  error: string | null,                           // 错误信息
  sidebarOpen: boolean,                           // 侧边栏开关
  abortController: AbortController | null,        // 用于停止流式
  // Actions:
  sendMessage(text),    // 发送消息（含system message注入）
  setPrompt(prompt),    // 设置角色人设
  setMode(mode),        // 切换模式
  toggleSidebar(),      // 切换侧边栏
  closeSidebar(),       // 关闭侧边栏
  clearMessages(),      // 清空消息
  stopStream(),         // 停止流式
}
```

## 当前状态与待办

### 已完成
- ✅ 完整聊天 UI（Header、Sidebar、ChatArea、ChatInput）
- ✅ Baker-DX 暗色工业风格全套 UI（5个区域全部使用原始素材重写）
- ✅ 多角色支持（庄方宜/佩丽卡/陈）+ 独立人设提示词
- ✅ System message 注入机制（store 层自动注入）
- ✅ 流式 SSE 通信 + 停止功能
- ✅ 深色模式切换
- ✅ 三个模式切换（Fast/Expert/Vision）
- ✅ Markdown 渲染（代码高亮、GFM）
- ✅ Vercel 部署 + Serverless Function 代理
- ✅ GitHub 仓库关联 + 自动部署
- ✅ 22 个测试用例全部通过
- ✅ 滚动条全局暗色样式（Webkit + Firefox）
- ✅ 20+ Baker原始素材已集成使用

### 待完成
- ⬜ 表情面板（73个 Baker emoji 素材可集成）
- ⬜ 贴纸面板（100+个 game sticker + 48个 skland sticker webp）
- ⬜ 教程引导页（5张 tutorial 图片）
- ⬜ 图片发送支持（Baker 有大量 sns_image 素材）
- ⬜ 更多 NPC 角色接入（26个 NPC 头像已就绪）

## 部署运维

- **平台：** Vercel（wuduwoniu 账号 / wuduwonius-projects team）
- **仓库：** https://github.com/wuduwoniu/Zhuang-Fangyi
- **环境变量：** `VITE_DEEPSEEK_API_KEY` 在 Vercel Dashboard 设置
- **更新方式：** `git push origin main` → GitHub → Vercel 自动部署
- **手动部署：** `npx vercel deploy --prod --scope wuduwonius-projects --token <token>`

## 核心规则（AI 必须遵守）

1. 修改代码前先确认改动范围，只改该改的文件
2. 禁止修改项目架构和四层结构
3. 所有 API Key 相关操作必须确认安全性
4. 修改后自动运行 `npm run build` 验证，但不要提交
5. 遇到错误先分析原因，不要盲目修改
6. 组件只通过 store selector 获取数据，绝不直接 import api/config/utils

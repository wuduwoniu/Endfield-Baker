# 庄方宜模拟器 — 排版与贴图参考文档

> 基于 Baker-DX 源码 (`baker-dx-master/src/components/baker/`) 验证

---

## 整体布局

| 区域 | 规格 | 来源 |
|------|------|------|
| 页面背景 | `bg-[#0a0b10]` | `layout.rs` background_style DotDark |
| Header高度 | `h-[64px]` (h-16) | `layout.rs:899` |
| Header背景 | 透明（无bg） | `layout.rs:899` |
| 主内容区padding | `p-8 gap-8` | `layout.rs:942` |
| Sidebar宽度 | `w-80` (320px) | `sidebar.rs:18` |
| Sidebar背景 | `bg-transparent` | `sidebar.rs:18` |

---

## Header

| 元素 | 规格 | 来源 |
|------|------|------|
| 路径文字 | `text-white text-base font-bold` / `//BAKER/会话消息` | `layout.rs:901-906` |
| 斜杠颜色 | `text-gray-400` | 视觉匹配 |
| 玩家名称 | `text-gray-300 text-sm` | `layout.rs:925` |
| 玩家头像 | `w-8 h-8 rounded bg-gray-600 border border-gray-500` | `layout.rs:926-937` |
| 无教程链接 | 条件渲染 `if !hide_tutorial` | `layout.rs:908-918` |
| 无暗色模式按钮 | — | 用户要求 |

---

## Sidebar

### 联系人列表

| 元素 | 规格 | 来源 |
|------|------|------|
| 列表容器 | `flex-1 overflow-y-auto space-y-3 px-4 pb-20` | `sidebar.rs:21` |
| 标题 "最近联系人" | `icon_sns_friend.png` + `sns_icon_friend_shadow.png` | 原设计 |
| 每个联系人高度 | `h-[88px]` | `sidebar.rs:84` |
| 联系人圆角 | `rounded-xl` | `sidebar.rs:84` |
| 联系人背景 | `rgb(53, 53, 53)` | `sidebar.rs:96` |
| 选中边框 | `border-[3px] border-white/60 z-10` | `sidebar.rs:88` |
| 未选中边框 | `border border-transparent opacity-80 hover:opacity-100` | `sidebar.rs:90` |
| 头像尺寸 | `w-[60px] h-[60px]` | `sidebar.rs:103` |
| 头像容器 | `rounded-lg overflow-hidden border border-gray-500/50 bg-gray-700` | `sidebar.rs:105-106` |
| 名字字号 | `text-white text-lg font-bold truncate tracking-wide` | `sidebar.rs:125` |

### 添加新会话按钮

| 元素 | 规格 | 来源 |
|------|------|------|
| 容器位置 | `absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t` | `sidebar.rs:42` |
| 按钮形状 | `w-full h-10 px-4 rounded-full` | `sidebar.rs:44` |
| 按钮背景 | `rgb(238, 236, 236)` | `sidebar.rs:45` |
| 按钮文字 | `font-bold text-sm` + `rgb(68, 68, 68)` | `sidebar.rs:48-49` |
| 按钮图标 | `list_new_session.png` (无invert) | `sidebar.rs:52-53` |
| 文字内容 | "添加新会话" | `sidebar.rs:50` |

---

## ChatArea — 聊天头 (`ChatHeader`)

### 贴图 (Alt 版为默认)

| 模式 | left | mid | right |
|------|------|-----|-------|
| Default | `chat_head_left.png` | `chat_head_mid.png` (1x134) | `chat_head_right.png` |
| **Alt (默认)** | `chat_head_left_2.png` | `chat_head_mid_2.png` (1x136) | `chat_head_right_2.png` |

### 布局

| 元素 | 规格 | 来源 |
|------|------|------|
| 整体高度 | `h-14` (56px) | `chat_area.rs:533` |
| 底部间距 | `mb-1` | `chat_area.rs:533` |
| left/right图 | `h-full w-auto object-cover select-none pointer-events-none` | `chat_area.rs:540-543` |
| mid图 | **CSS background-image**: `background-size: 100% 100%` (不能用 `<img>`) | `chat_area.rs:544-547` |
| 名字叠加 | `absolute inset-0 flex items-center px-6` | `chat_area.rs:555` |
| 名字样式 | `text-white font-bold text-lg ml-2` | `chat_area.rs:556-558` |
| 菜单按钮 | `w-8 h-8 rounded-full` + 三个白点 `rgb(255,253,253)` | `chat_area.rs:561-583` |
| 菜单背景 | `bg-[#2b2b2b] border border-gray-600 rounded` | `chat_area.rs:586` |

### ⚠️ 关键规则
- **只能同时显示一套** (Default 或 Alt)，不能两套叠加
- **mid 是 1px 宽的拉伸条**，必须用 `background-image` + `background-size: 100% 100%`，不能用 `<img>` 标签
- ChatHead 位置从 sidebar 右边界开始 (即距离左边 1/4 处)

---

## ChatArea — 聊天体边框与装饰

### 边框框体

| 元素 | 规格 | 来源 |
|------|------|------|
| 容器 | `flex-1 flex flex-col relative bg-transparent rounded-b-xl min-h-0` | `chat_area.rs:673` |
| 三边主边框 | `absolute inset-0 rounded-b-xl border-l-[1.5px] border-r-[1.5px] border-b-[1.5px] border-[rgb(202,201,201)] pointer-events-none z-20` | `chat_area.rs:676-678` |
| 顶部左长线 | `absolute top-0 left-0 right-[264px] h-[1.5px] bg-[rgb(202,201,201)] z-30` | `chat_area.rs:681` |
| 顶部右短线 | `absolute top-0 right-0 w-8 h-[1.5px] bg-[rgb(202,201,201)] z-30` | `chat_area.rs:683` |
| SVG缺口 | `right-8 w-[232px] h-[10px]` + 斜角path | `chat_area.rs:685-698` |
| 粉色条 | `w-16 h-[2px] bg-[rgb(226,2,226)] shadow-[0_0_8px_rgb(226,2,226)]` clip梯形 | `chat_area.rs:702-706` |
| 黄色条 | `w-16 h-[2px] bg-[rgb(243,241,0)] shadow-[0_0_8px_rgb(243,241,0)]` | `chat_area.rs:707-710` |
| 青色条 | `w-16 h-[2px] bg-[rgb(1,241,241)] shadow-[0_0_8px_rgb(1,241,241)]` clip梯形 | `chat_area.rs:711-714` |

### 消息列表

| 元素 | 规格 | 来源 |
|------|------|------|
| 滚动容器 | `flex-1 overflow-y-auto p-6 mr-3` + `overflow-x: hidden` | `chat_area.rs:718-720` |
| 空状态 | `flex-1 flex items-center justify-center text-gray-500` + "请选择一个会话" | `layout.rs:1013-1014` |

---

## MessageBubble — 聊天气泡

### 外层结构

| 层级 | 样式 | 来源 |
|------|------|------|
| Root | `flex flex-col gap-0 w-full max-w-full` + `align-items: flex-end`(用户)/`flex-start`(AI) | `chat_area.rs:1035-1036` |
| Row | `relative w-full min-w-0 flex` + `justify-content: flex-end`(用户)/`flex-start`(AI) | `chat_area.rs:1051-1053` |

### 头像框 (`FramedAvatar`)

| 元素 | 规格 | 来源 |
|------|------|------|
| 外框容器 | `98px × 98px` absolute定位 | `chat_area.rs:1197-1198` |
| 外框贴图 | `avatarframe.png` `opacity: 0.9` `translateY(-3px)` | `chat_area.rs:1199-1203` |
| 头像本身 | `56px × 56px` `rounded-full` `bg-gray-600 border border-white/75` | `chat_area.rs:1205-1207` |
| 用户(right)位置 | `right: -21px; top: -21px` | `chat_area.rs:1008` |
| AI(left)位置 | `left: -21px; top: -21px` | `chat_area.rs:1010` |
| MESSAGE_AVATAR_FRAME_OFFSET | `21px` = (98-56)/2 | `chat_area.rs:24` |

### 气泡本体

| 属性 | 用户消息 | AI消息 | 来源 |
|------|---------|--------|------|
| 背景色 | `rgb(243, 242, 242)` | `rgb(69, 69, 69)` | `chat_area.rs:943-945` |
| 文字色 | `text-black` | `text-white` | `chat_area.rs:943-945` |
| 网格纹理 | **有**: 4x4px grid `rgb(239,237,237)` | **无**: `background-image: none` | `chat_area.rs:948-963` |
| 圆角(用户) | `rounded-2xl rounded-tr-none` = `16px 0 16px 16px` | — | `chat_area.rs:978-979` |
| 圆角(AI) | — | `rounded-2xl rounded-tl-none` = `0 16px 16px 16px` | `chat_area.rs:980-981` |
| 内边距 | `px-3 py-2` (12px 8px) | 同 | `chat_area.rs:970` |
| 阴影 | `shadow-sm` | 同 | `chat_area.rs:970` |
| 气泡间距 | `margin-right: 76px` | `margin-left: 76px` | `chat_area.rs:1018-1020` |
| wrapper top margin | `mt-1` (4px) | 同 | `chat_area.rs:1064` |

### SVG尾巴

| 属性 | 用户 | AI | 来源 |
|------|------|-----|------|
| 位置 | `absolute top-0 -right-[8px]` | `absolute top-0 -left-[8px]` | `chat_area.rs:1085/1072` |
| 尺寸 | `w-[9px] h-[20px]` | 同 | `chat_area.rs:1085/1072` |
| path填充 | `fill: "rgb(243,242,242)"` | `fill: "rgb(69,69,69)"` | `chat_area.rs:1093/1079` |
| 形状 | `M0,0 L9,0 Q0,0 0,20 Z` (右尖) | `M9,0 L0,0 Q9,0 9,20 Z` (左尖) | `chat_area.rs:1093/1079` |
| ⚠️ 结构 | **兄弟节点**（与气泡body同级在bubble-wrap内） | 同 | `chat_area.rs:1070-1097` |

### 头像显示规则

| 条件 | 显示头像? | 来源 |
|------|----------|------|
| 连续同发送者 | 否 | `chat_area.rs:397-401` |
| 不同发送者 | 是 | 同上 |
| `mt-4` (有头像) | 是 | `chat_area.rs:403` |
| `mt-1` (无头像) | 是 | `chat_area.rs:403` |

---

## InputBar — 输入区

### 外层容器

| 元素 | 规格 | 来源 |
|------|------|------|
| 容器背景 | `rgb(50, 50, 50)` | `chat_area.rs:794` |
| 容器圆角 | `rounded-b-[10px]` | `chat_area.rs:793` |
| 容器边距 | `mx-[1.5px] mb-[1.5px]` (在边框内侧) | `chat_area.rs:793` |
| 顶部隔线 | `h-[2px] mx-3 mt-0 mb-1.5 bg-[rgb(71,71,71)]` | `chat_area.rs:791` |

### 输入条 (`InputBar`)

| 元素 | 规格 | 来源 |
|------|------|------|
| 整体高度 | `h-12` (48px) | `input_bar.rs:177` |
| 输入框背景 | `rgb(240, 238, 238)` | `input_bar.rs:333` |
| 输入框形状 | `rounded-full` (pill) | `input_bar.rs:332` |
| 输入文字 | `bg-transparent border-none outline-none text-black font-medium placeholder-gray-500` | `input_bar.rs:383` |
| placeholder | "发消息" | `input_bar.rs:384` |
| 发送图标 | `chat_enter.png` (无invert) | `input_bar.rs:445` |
| 表情图标 | `chat_emoji.png` (无invert, opacity-80, 在圆形容器中) | `input_bar.rs:466` |
| 加号图标 | `chat_plus.png` (无invert, opacity-80, 在圆形容器中) | `input_bar.rs:486` |
| 圆形容器背景 | `rgb(240, 238, 238)` | `input_bar.rs:456/473` |
| 圆形容器尺寸 | `w-10 h-10 rounded-full` | `input_bar.rs:455/472` |

---

## 角色信息

| ID | 名称 | 贴图 | role |
|----|------|------|------|
| `zhuang-fangyi` | 庄方宜 | `zhuangfy.png` | 罗德岛干员 |
| `perlica` | 佩丽卡 | `pelica.png` | 罗德岛干员 |
| `chen` | 陈千语 | `chen.png` | 龙门近卫局督察 |

---

## 关键颜色对照

| 用途 | 色值 | CSS变量/来源 |
|------|------|-------------|
| 主背景 | `#0a0b10` | `app container` |
| 面板背景 | `#0f1116` | `--bg-base` |
| 输入区容器 | `rgb(50, 50, 50)` | `chat_area.rs:794` |
| 输入条 | `rgb(240, 238, 238)` | `input_bar.rs:333` |
| 联系人背景 | `rgb(53, 53, 53)` | `sidebar.rs:96` |
| 新对话按钮 | `rgb(238, 236, 236)` | `sidebar.rs:45` |
| 用户气泡 | `rgb(243, 242, 242)` | `chat_area.rs:943` |
| AI气泡 | `rgb(69, 69, 69)` | `chat_area.rs:945` |
| 边框描边 | `rgb(202, 201, 201)` | `chat_area.rs:678` |
| 菜单弹窗 | `#2b2b2b` | `chat_area.rs:586` |

---

## 贴图资源目录

```
public/baker-assets/
├── avatars/        # 头像 (endministrator, zhuangfy, pelica, chen)
├── backgrounds/    # 背景纹理 (bg_snscontenttextorpic_chat_*, deco_sns_hudentry_bg, sns_btnbg_shadownew)
├── decorations/    # 装饰
├── header/         # 聊天头 (chat_head_left/mid/right, _2 variants)
├── icons/          # 图标 (chat_emoji, chat_enter, chat_plus, sns_icon_friend, icon_sns_message_01)
├── input/          # 输入相关 (chat_plus, chat_enter)
├── masks/          # 遮罩
└── ui/             # UI通用 (avatarframe, list_new_session)
```

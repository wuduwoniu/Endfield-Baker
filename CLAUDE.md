# 庄方宜模拟器 - 项目说明书

## 项目概述
这是一个基于 React + Vite 的AI聊天网页，用于模拟《明日方舟：终末地》角色"庄方宜"的对话。

## 线上地址
https://deepseek-chat-clone.vercel.app

## 技术架构（严格遵守四层结构）
src/
├── config/         # 配置层：API地址、模型名、角色人设
├── api/            # 通信层：封装DeepSeek API调用
├── store/          # 状态层：Zustand管理聊天记录
├── utils/          # 工具层：纯函数
├── components/     # UI层：只通过store获取数据，绝不直接调api
└── hooks/          # 自定义Hook

## 关键文件位置
- 角色人设：src/config/index.js → ZHUANG_FANGYI_PROMPT
- API密钥：仅存在于Vercel环境变量，前端代码无任何Key痕迹
- 聊天状态：src/store/chatStore.js

## 部署方式
- 平台：Vercel (与GitHub仓库关联)
- 环境变量：VITE_DEEPSEEK_API_KEY 在 Vercel 后台设置
- 日常更新：git push → Vercel 自动部署

## 我的核心规则（AI必须遵守）
1. 修改代码前先确认改动范围，只改该改的文件
2. 禁止修改项目架构和四层结构
3. 所有API Key相关操作必须确认安全性
4. 修改后自动运行 npm run build 验证，但不要提交
5. 遇到错误先分析原因，不要盲目修改

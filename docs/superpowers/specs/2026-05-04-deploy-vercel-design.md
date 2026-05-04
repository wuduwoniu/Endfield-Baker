# DeepSeek Chat Clone — Vercel 部署方案

> 创建日期: 2026-05-04
> 状态: 已批准

## 概述

将 DeepSeek Chat Clone 部署到公网，通过 Vercel Serverless Function 代理 API 请求，避免 API Key 暴露在前端代码中。

## 安全需求

当前项目的 API Key 通过 `import.meta.env.VITE_DEEPSEEK_API_KEY` 读取，构建后会被打包进前端 JS。任何人都能从浏览器 DevTools 中看到 Key。部署前必须解决此问题。

## 架构

```
Browser ──→ /api/deepseek/* ──→ Vercel Serverless Function ──→ api.deepseek.com
               (Vite/React)        (api/deepseek.js)             (DeepSeek API)
                                   - 读取环境变量 VITE_DEEPSEEK_API_KEY
                                   - 注入 Authorization header
                                   - 转发请求/响应
```

### 数据流

1. 前端发送 `POST /api/deepseek/chat/completions`（不带 Authorization header）
2. Vercel 路由 `vercel.json` 将请求指向 `api/deepseek.js`
3. Serverless Function 从环境变量读取 API Key，添加 `Authorization: Bearer <key>`
4. 转发请求到 `https://api.deepseek.com/chat/completions`
5. 流式响应逐块返回给前端

### 本地开发

Vite 开发服务器通过 `vite.config.js` 中的 proxy 配置实现相同效果。本地 Key 从 `.env` 文件读取。

## 改动清单

### 新建文件

- `api/deepseek.js` — Vercel Serverless Function，代理 DeepSeek API 请求
- `vercel.json` — Vercel 路由配置

### 修改文件

- `src/config/index.js` — 移除 `getAuthHeader()`
- `src/api/index.js` — 去掉 Authorization header 相关代码
- `package.json` — 添加 `devDependencies: { vercel }`

### 无需改动

- `.gitignore` — 已有 `.env` 规则
- 前端组件层 — 完全不涉及

## 环境变量

| 变量 | 位置 | 说明 |
|------|------|------|
| `VITE_DEEPSEEK_API_KEY` | Vercel Dashboard → Environment Variables | 生产环境 Key |
| `VITE_DEEPSEEK_API_KEY` | `.env` 文件 | 本地开发 Key |

## 部署流程

1. 完成代码改动并提交
2. 本地运行 `npx vercel` 登录并关联项目
3. 在 Vercel Dashboard 中添加 `VITE_DEEPSEEK_API_KEY` 环境变量
4. 运行 `npx vercel --prod` 部署到生产
5. 验证公网地址可正常聊天

## 后续更新

本地修改后：
```bash
git push
```
如果关联了 GitHub，Vercel 自动重新部署。或手动运行 `npx vercel --prod`。

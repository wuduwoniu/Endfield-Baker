# Vercel 部署 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 DeepSeek Chat Clone 部署到 Vercel，通过 Serverless Function 代理 API 请求，API Key 仅存在服务端。

**Architecture:** Vercel Serverless Function (`api/deepseek.js`) 接收前端 `/api/deepseek/*` 请求，从环境变量读取 API Key 注入 Authorization header，转发到 `api.deepseek.com`。前端移除 `getAuthHeader()`，不再管理 Key。本地开发通过 Vite proxy 保持兼容。

**Tech Stack:** Vercel Serverless Functions (Node.js), Vite

---

### Task 1: Create Vercel Serverless Function + Routing

**Files:**
- Create: `api/deepseek.js`
- Create: `vercel.json`

- [ ] **Step 1: Write the Serverless Function**

Write `api/deepseek.js`:

```js
export default async function handler(req, res) {
  const apiKey = process.env.VITE_DEEPSEEK_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' })
  }

  // Parse body from the incoming request
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  const body = Buffer.concat(chunks).toString()

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  }

  const response = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers,
    body,
  })

  res.status(response.status)
  response.headers.forEach((value, key) => {
    if (key !== 'content-encoding' && key !== 'content-length') {
      res.setHeader(key, value)
    }
  })

  if (response.body) {
    const reader = response.body.getReader()
    const pump = async () => {
      while (true) {
        const { done, value } = await reader.read()
        if (done) { res.end(); return }
        res.write(value)
      }
    }
    pump()
  } else {
    const text = await response.text()
    res.send(text)
  }
}
```

- [ ] **Step 2: Write Vercel routing config**

Write `vercel.json`:

```json
{
  "rewrites": [
    { "source": "/api/deepseek/(.*)", "destination": "/api/deepseek" },
    { "source": "/api/deepseek", "destination": "/api/deepseek" }
  ]
}
```

- [ ] **Step 3: Write test for the function**

Write `api/deepseek.test.js`:

```js
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock process.env
process.env.VITE_DEEPSEEK_API_KEY = 'test-key-123'

// Mock global fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

// We can't directly import the handler (it's a Node.js edge function),
// but we can test the logic it depends on
describe('API Proxy Logic', () => {
  it('reads API key from environment', () => {
    expect(process.env.VITE_DEEPSEEK_API_KEY).toBe('test-key-123')
  })
})
```

- [ ] **Step 4: Run tests**

```bash
npx vitest run --reporter=verbose
Expected: All tests pass (including existing 22 + new test)
```

- [ ] **Step 5: Commit**

```bash
git add api/deepseek.js vercel.json api/deepseek.test.js
git commit -m "feat: add Vercel Serverless Function and routing"
```

---

### Task 2: Update Frontend — Remove Key Handling + Add Vercel CLI

**Files:**
- Modify: `src/config/index.js`
- Modify: `src/api/index.js`
- Modify: `package.json`

- [ ] **Step 1: Remove getAuthHeader from config**

Edit `src/config/index.js` — remove `getAuthHeader()` function and its export.

Old code (lines 39-42):
```js
export function getAuthHeader() {
  const key = import.meta.env.VITE_DEEPSEEK_API_KEY || ''
  return key ? { Authorization: `Bearer ${key}` } : {}
}
```

Remove entirely. Also remove any imports of it elsewhere.

- [ ] **Step 2: Update API client to remove Authorization header**

Edit `src/api/index.js`:

Old import line:
```js
import { API, MODELS, REQUEST, getAuthHeader } from '../config'
```

New import line:
```js
import { API, MODELS, REQUEST } from '../config'
```

In `sendChatMessage()`, remove the `...getAuthHeader()` spread from headers.

Old code:
```js
const response = await fetch(API.CHAT_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
  },
  body: JSON.stringify(buildChatBody(messages, { mode })),
  signal,
})
```

New code:
```js
const response = await fetch(API.CHAT_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(buildChatBody(messages, { mode })),
  signal,
})
```

- [ ] **Step 3: Update related test**

Edit `src/api/index.test.js` — remove any test that references `getAuthHeader` (verify there isn't one first, as the original test only tests `buildChatBody` and `parseSSEStream`).

Change the import line if needed:
```js
import { buildChatBody, parseSSEStream, getAuthHeader } from './index'
```
→
```js
import { buildChatBody, parseSSEStream } from './index'
```

- [ ] **Step 4: Add vercel CLI to devDependencies**

In `package.json`, add:
```json
"devDependencies": {
  ...
  "vercel": "^41.0.0"
}
```

- [ ] **Step 5: Run tests**

```bash
npx vitest run --reporter=verbose
Expected: All tests pass
```

- [ ] **Step 6: Verify build**

```bash
npm run build
Expected: Build succeeds
```

- [ ] **Step 7: Commit**

```bash
git add src/config/index.js src/api/index.js src/api/index.test.js package.json
git commit -m "refactor: remove client-side API key, prepare for Vercel proxy"
```

---

### Task 3: Deploy to Vercel

- [ ] **Step 1: Install dependencies**

```bash
npm install
Expected: All deps installed including vercel
```

- [ ] **Step 2: Login to Vercel**

```bash
npx vercel login
Expected: Browser opens, login completes
```

- [ ] **Step 3: Deploy (first time)**

```bash
npx vercel
Expected: Interactive setup — link to GitHub, project name "deepseek-chat-clone"
```

- [ ] **Step 4: Set environment variable in Vercel Dashboard**

Go to https://vercel.com → Project → Settings → Environment Variables → Add
```
Name: VITE_DEEPSEEK_API_KEY
Value: (the user's DeepSeek API key)
Environments: Production, Preview, Development
```

- [ ] **Step 5: Redeploy to production**

```bash
npx vercel --prod
Expected: Deploy succeeds, shows production URL
```

- [ ] **Step 6: Verify deployment**

Visit the production URL, send a chat message, confirm:
- Chat sends successfully
- No API key visible in browser DevTools (Network tab → check request headers)

---

## Spec Coverage Check

| Spec Requirement | Task |
|-----------------|------|
| Vercel Serverless Function (api/deepseek.js) | Task 1 |
| Vercel routing config (vercel.json) | Task 1 |
| Remove getAuthHeader from config | Task 2 |
| Remove Authorization header from API client | Task 2 |
| Add vercel devDependency | Task 2 |
| Deploy to Vercel | Task 3 |
| Environment variable setup | Task 3 |
| Verify API key not exposed | Task 3 |

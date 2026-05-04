import { API, MODELS, REQUEST } from '../config'

export function buildChatBody(messages, { mode = 'fast', stream = true } = {}) {
  return {
    model: MODELS[mode]?.id || MODELS.fast.id,
    messages: messages.map(({ role, content }) => ({ role, content })),
    stream,
    temperature: REQUEST.temperature,
    ...(REQUEST.max_tokens ? { max_tokens: REQUEST.max_tokens } : {}),
  }
}

export async function* parseSSEStream(body) {
  const reader = body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue
        const payload = line.slice(6)
        if (payload === '[DONE]') return
        try {
          const parsed = JSON.parse(payload)
          const delta = parsed.choices?.[0]?.delta?.content
          if (delta) yield delta
        } catch { /* skip */ }
      }
    }
  } finally {
    reader.releaseLock()
  }
}

export async function sendChatMessage(messages, { mode = 'fast', signal } = {}) {
  const response = await fetch(API.CHAT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(buildChatBody(messages, { mode })),
    signal,
  })
  if (!response.ok) {
    const errText = await response.text().catch(() => 'Unknown error')
    throw new Error(`API ${response.status}: ${errText}`)
  }
  return response.body
}

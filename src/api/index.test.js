import { describe, it, expect } from 'vitest'
import { buildChatBody, parseSSEStream } from './index'

describe('buildChatBody', () => {
  it('includes messages, stream, and temperature', () => {
    const body = buildChatBody([{ role: 'user', content: 'hi' }], { stream: true })
    expect(body.messages).toHaveLength(1)
    expect(body.stream).toBe(true)
    expect(body.temperature).toBeGreaterThanOrEqual(0)
  })

  it('defaults to fast mode model', () => {
    const body = buildChatBody([{ role: 'user', content: 'hi' }])
    expect(body.model).toBe('deepseek-chat')
  })
})

describe('parseSSEStream', () => {
  it('parses SSE chunks and yields content delta', async () => {
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode('data: {"choices":[{"delta":{"content":"Hello"}}]}\n\n'))
        controller.enqueue(encoder.encode('data: {"choices":[{"delta":{"content":" World"}}]}\n\n'))
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      },
    })

    const chunks = []
    for await (const chunk of parseSSEStream(stream)) {
      chunks.push(chunk)
    }
    expect(chunks).toEqual(['Hello', ' World'])
  })

  it('handles empty delta gracefully', async () => {
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode('data: {"choices":[{"delta":{}}]}\n\n'))
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      },
    })

    const chunks = []
    for await (const chunk of parseSSEStream(stream)) {
      chunks.push(chunk)
    }
    expect(chunks).toEqual([])
  })
})

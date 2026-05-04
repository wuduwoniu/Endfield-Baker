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

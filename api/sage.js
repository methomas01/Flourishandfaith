// api/sage.js
// Vercel serverless function — secure proxy for Anthropic Claude API
// Keeps the API key on the server; the browser never sees it.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'AI service is not configured on this server.' })
  }

  const { messages, system } = req.body || {}
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Invalid request: messages array is required.' })
  }

  try {
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 600,
        system: system || '',
        messages,
      }),
    })

    if (!upstream.ok) {
      const text = await upstream.text()
      console.error('[sage proxy] Anthropic error:', upstream.status, text)
      return res.status(upstream.status).json({ error: 'AI service returned an error.' })
    }

    const data = await upstream.json()
    return res.status(200).json(data)
  } catch (err) {
    console.error('[sage proxy] Fetch failed:', err)
    return res.status(500).json({ error: 'Failed to reach AI service.' })
  }
}

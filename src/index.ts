import { Hono } from 'hono'

type Bindings = {
  KV: KVNamespace
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/', (c) => {
  const html = `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kobako - Hello World</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex items-center justify-center">
    <div class="text-center p-8 max-w-md mx-auto">
        <div class="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
            <h1 class="text-4xl font-bold text-gray-800 mb-4">Hello World</h1>
            <p class="text-lg text-gray-600 mt-2">Cloudflare Workers + Hono + KV</p>
        </div>
        <p class="text-sm text-gray-500 mt-4">Powered by 小林高校愛好会❤️</p>
    </div>
</body>
</html>
  `
  
  return c.html(html)
})

// KVの動作確認用エンドポイント（オプション）
app.get('/kv-test', async (c) => {
  try {
    await c.env.KV.put('test-key', 'Hello from KV!')
    const value = await c.env.KV.get('test-key')
    
    return c.json({
      message: 'KV connection test successful',
      stored_value: value,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return c.json({
      error: 'KV connection failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

export default app 
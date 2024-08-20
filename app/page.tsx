import { AppType } from '@/server'
import { hc } from 'hono/client'

export default async function Home() {
  // the url should be complete， not just the path, because this request is made from the server, node environment
  const port = process.env.PORT
  const hostname = process.env.HOST_NAME
  const client = hc<AppType>(`http://${hostname}:${port}`)

  const res = await client.api.hello.$get()
  const { message } = await res.json()

  if (!message) return <p>Loading...</p>

  return <p>{message}</p>
}

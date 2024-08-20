import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
import { Hono } from 'hono'
import { handle } from '@hono/node-server/vercel'
 
const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'
const hostname= dev ? 'localhost' : ''
const app = next({ dev, port, hostname })
const nextHandler = app.getRequestHandler()

export const hono = new Hono().basePath('/api')

const route = hono.get('/hello', (c) => c.json({ message: 'Hello from Hono!' }))

export type AppType = typeof route

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url!, true)
    const { pathname } = parsedUrl

    if (pathname?.startsWith('/api')) {
        return handle(hono)(req, res)
    } else {
        nextHandler(req, res, parsedUrl)
    }
  }).listen(port)
 
  console.log(
    `> Server listening at http://localhost:${port} as ${
      dev ? 'development' : process.env.NODE_ENV
    }`
  )
})

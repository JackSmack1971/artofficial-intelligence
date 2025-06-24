import express from 'express'

const app = express()
app.use(express.json())

app.get('/health', (_, res) => res.json({ status: 'ok' }))

export function startServer(port: number) {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`)
  })
}

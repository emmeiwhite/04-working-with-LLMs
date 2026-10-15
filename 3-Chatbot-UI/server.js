import express from 'express'
import cors from 'cors'
import { generate } from './chatbot.js'
const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Way and back again the agents tale by Rakesh Sir!')
})

app.post('/chat', async (req, res) => {
  const { message, sessionId } = req.body
  // todo: Validate above fields
  if (!message || !sessionId) {
    return res.status(400).json({
      message: 'message and sessionId are required'
    })
  }

  console.log('Message', message)
  // we need to make a call to our chatbot with the message as prompt

  const result = await generate(message, sessionId)

  res.json({
    message: result,
    sessionId
  })
})

app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on port ${port}`)
})

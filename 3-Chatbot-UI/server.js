import express from 'express'
import cors from 'cors'
import { generate } from './chatbot.js'
const app = express()
const port = 3000
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Way and back again the agents tale by Rakesh Sir!')
})

app.post('/chat', async (req, res) => {
  const { message } = req.body

  console.log('Message', message)
  // we need to make a call to our chatbot with the message as prompt

  const result = await generate(message)

  res.json({
    message: result
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

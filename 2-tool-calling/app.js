import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function main() {
  const chatCompletion = await getGroqChatCompletion()
  // Print the completion returned by the LLM.
  console.log(chatCompletion.choices[0]?.message?.content || '')
}

export async function getGroqChatCompletion() {
  return groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content:
          'You are Robort. Your task is to answer the questions asked. Make sure to keep the answers short and to the point.'
      },
      {
        role: 'user',
        content: 'When was iphone-16 launched?'
      }
    ],
    model: 'openai/gpt-oss-20b'
  })
}

main()

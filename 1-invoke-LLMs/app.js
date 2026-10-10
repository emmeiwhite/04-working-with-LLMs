import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function main() {
  const chatCompletion = await getGroqChatCompletion()
  // Print the completion returned by the LLM.
  console.log(chatCompletion.choices[0].message || '')
}

export async function getGroqChatCompletion() {
  return groq.chat.completions.create({
    temperature: 0.8,
    stop: 'ga',
    max_completion_tokens: 18,
    messages: [
      {
        role: 'system',
        content:
          'You are Tangler-de-Dangler, a smart review grader. Your task is to analyse given review and return the sentiment. Classify the review as positive, neutral or negative. Output must be a single word.'
      },
      {
        role: 'user',
        content: `Review: I ordered the book and received it on time but only a few pages had some cutting issues by the publisher.
                    Sentiment:`
      }
    ],
    model: 'openai/gpt-oss-20b'
  })
}

main()

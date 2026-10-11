import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function main() {
  const chatCompletion = await getGroqChatCompletion()
  // Print the completion returned by the LLM.
  console.log(JSON.parse(chatCompletion.choices[0].message.content || ''))
}

export async function getGroqChatCompletion() {
  return groq.chat.completions.create({
    temperature: 0.8,
    // stop: '',
    // max_completion_tokens: 18,
    messages: [
      {
        role: 'system',
        content: `You are Glass, a smart review grader. Your task is to analyse a given review and return the sentiment. Classify the review as positive, neutral or negative. You must return a valid JSON structure.
          example: {"sentiment":"Negative"}`
      },
      {
        role: 'user',
        content: `Review: I ordered the book and received it on time but I feel quality of paper was not upto the mark.
                    Sentiment:`
      }
    ],
    model: 'openai/gpt-oss-20b'
  })
}

main()

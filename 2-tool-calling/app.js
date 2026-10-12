import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

// 1. Add tool definition to the Groq Request

const tools = [
  {
    type: 'function',
    function: {
      name: 'websiteSearch',
      description: 'Search the web for current information and recent events.',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'The search query to look up on the web.'
          }
        },
        required: ['query']
      }
    }
  }
]

export async function main() {
  const chatCompletion = await getGroqChatCompletion()
  // Print the completion returned by the LLM.
  console.log(chatCompletion.choices[0]?.message || '')
}

export async function getGroqChatCompletion() {
  return groq.chat.completions.create({
    temperature: 0,
    messages: [
      {
        role: 'system',
        content: `You are a smart personal assistant who answers questions.

        You have access to the following tool:
        1. websiteSearch({query}: {query: string}) — Search the internet for the latest information and real-time data.

        Use websiteSearch when a question requires current information, recent events, or facts that may have changed.
        If the question can be answered reliably using your existing knowledge, you may answer directly.

        Keep answers short and to the point.`
      },
      {
        role: 'user',
        content: 'When was iphone-16 launched?'
      }
    ],
    model: 'openai/gpt-oss-20b',
    tools,
    tool_choice: 'auto'
  })
}

main()

// A tool call function
async function websiteSearch({ query }) {
  // Here we will do tavily api call

  return 'Iphone was launched on 20 September 2024'
}

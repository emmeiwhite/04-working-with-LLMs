import Groq from 'groq-sdk'
import { createInterface } from 'node:readline/promises'
import { stdin, stdout } from 'node:process'
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

// To install: npm i @tavily/core
import { tavily } from '@tavily/core'
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY })

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

const messages = [
  {
    role: 'system',
    content: `You are a smart personal assistant who answers questions.

        You have access to the following tool:
        1. websiteSearch({query}: {query: string}) — Search the internet for the latest information and real-time data.

        Use websiteSearch when a question requires current information, recent events, or facts that may have changed.
        If the question can be answered reliably using your existing knowledge, you may answer directly.

        Keep answers short and to the point.`
  }
]

export async function main() {
  const rl = createInterface({ input: stdin, output: stdout }) // means terminal

  while (true) {
    const question = await rl.question('You:')

    //bye
    if (question === 'bye') {
      break
    }

    messages.push({
      role: 'user',
      content: question
    })

    while (true) {
      const chatCompletion = await getGroqChatCompletion() // Making an LLM call after each loop

      messages.push(chatCompletion.choices[0].message)

      const toolCalls = chatCompletion.choices[0].message.tool_calls

      if (!toolCalls) {
        console.log('Assistant:', chatCompletion.choices[0].message.content)
        break
      }

      // toolCalls is an array as there can be multiple tools
      for (let tool of toolCalls) {
        const functionName = tool.function.name
        const functionArgs = tool.function.arguments

        if (functionName === 'websiteSearch') {
          const toolResult = await websiteSearch(JSON.parse(functionArgs))
          //   console.log('Tool Result', toolResult)

          // Adding the toolResult message in our main messages

          messages.push({
            tool_call_id: tool.id,
            role: 'tool',
            name: functionName,
            content: toolResult
          })
        }
      }
    }
  }

  rl.close()
}

export async function getGroqChatCompletion() {
  return groq.chat.completions.create({
    temperature: 0,
    messages,
    model: 'openai/gpt-oss-20b',
    tools,
    tool_choice: 'auto'
  })
}

main()

// A tool call function
async function websiteSearch({ query }) {
  // Here we will do tavily api call
  console.log('Calling web search ...')

  const response = await tvly.search(query)

  const finalResult = response.results.map(result => result.content).join('\n\n')

  return finalResult
}

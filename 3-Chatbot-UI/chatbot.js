import Groq from 'groq-sdk'
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

import NodeCache from 'node-cache'

// To install: npm i @tavily/core
import { tavily } from '@tavily/core'
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY })

const cache = new NodeCache({ stdTTL: 60 * 60 * 24 }) // 24 hours

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

// System prompt
const baseMessages = [
  {
    role: 'system',
    content: `You are a smart personal assistant who answers questions.

                You have access to this tool:
                1. websiteSearch({query}: {query: string}) — Searches the web for current information and recent events.

                Rules:
                - Use websiteSearch for current information, recent events, and facts that may have changed.
                - Answer general knowledge questions directly when you can do so reliably.
                - After receiving tool results, use them to formulate a clear, natural answer.
                - Never show raw tool calls, function arguments, or internal tool details to the user.
                - Keep answers short and to the point.

                Examples:

                Q: What is the capital of France?
                A: The capital of France is Paris.

                Q: Who is the current Prime Minister of India?
                A: Answer using reliable existing knowledge if sufficiently current; otherwise, use websiteSearch to verify.

                Q: What is the weather in Srinagar today?
                A: Use websiteSearch to find the latest weather information, then summarize the results naturally.

                Q: Tell me the latest AI news.
                A: Use websiteSearch to find recent AI news, then summarize the key developments.

                Q: What is 15 multiplied by 4?
                A: 15 multiplied by 4 is 60.

                Current date and time: ${new Date().toUTCString()}`
  }
]

export async function generate(question, sessionId) {
  const messages = cache.get(sessionId) ?? [...baseMessages]

  messages.push({
    role: 'user',
    content: question
  })

  // Retires: The retries happens only during tool-calling. So, here we can set the logic for this

  const MAX_TRIES = 2
  let count = 0
  while (true) {
    if (count >= MAX_TRIES) {
      return 'Could not process yout request, something went wrong'
    }

    count++

    const chatCompletion = await getGroqChatCompletion(messages) // Making an LLM call after each loop

    messages.push(chatCompletion.choices[0].message)

    const toolCalls = chatCompletion.choices[0].message.tool_calls

    // Here the tool call has stopped and we have received the output
    if (!toolCalls) {
      // here we can add all the messages available until now against the particular sessionId

      cache.set(sessionId, messages)

      return chatCompletion.choices[0].message.content
    }

    // toolCalls is an array as there can be multiple tools
    for (let tool of toolCalls) {
      const functionName = tool.function.name
      const functionArgs = tool.function.arguments

      if (functionName === 'websiteSearch') {
        // run the tool call function, which in turn uses Tavily search
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

export async function getGroqChatCompletion(messages) {
  return groq.chat.completions.create({
    temperature: 0,
    messages,
    model: 'openai/gpt-oss-20b',
    tools,
    tool_choice: 'auto'
  })
}

// A tool call function
async function websiteSearch({ query }) {
  // Here we will do tavily api call
  console.log('Calling web search ...')

  const response = await tvly.search(query)

  const finalResult = response.results.map(result => result.content).join('\n\n')

  return finalResult
}

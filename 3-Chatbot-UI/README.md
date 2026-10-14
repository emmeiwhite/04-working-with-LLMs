The LLM requests the tool call, but your JavaScript application executes the function and sends the result back to the LLM.

## 1. Tool-calling workflow

```
User asks a question
        ↓
LLM requests a tool call
        ↓
Your JavaScript executes the function
        ↓
Function calls Tavily API
        ↓
Tavily returns search results
        ↓
Your app sends results back to LLM
        ↓
LLM generates the final answer
```

## 2. Let's set up Tavily

Follow these steps in order.

1. Create a Tavily account

   Open Tavily and obtain your API key.

2. Install the Tavily JavaScript SDK

   In your `2-tool-calling` project folder, run:

   `bash     npm install @tavily/core     `

3. Add the API key to `.env`

   `env     TAVILY_API_KEY=your_tavily_api_key     `

   Keep your key secret.

4. Create a `websiteSearch` function

   This function will accept a search query, call Tavily, and return the search results.

5. Connect it to Groq tool calling

   The LLM will request `websiteSearch` when it needs current information. Your app executes the function and returns the results to the LLM.

Important: Tavily performs the search; Groq runs your LLM. They are separate services.

RUN SERVER WITH : node --env-file=.env server.js

Todos:

1. Get the message from the UI and call LLM with that message
2. Get the result and show it in the UI

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
    response_format: {
      type: 'json_object'
    },
    messages: [
      {
        role: 'system',
        content: `You are an interview grader assistant. Your task is to evaluate a candidate's answers to interview questions and generate an overall evaluation score:
        
            Output must follow this JSON Structure:
            {
                "confidence":number,
                "accuracy":number,
                "pass":boolean,
            }

            Evaluation instructions:
            1. Evaluate each answer independently against the question and correct JavaScript concepts.
            2. Assess accuracy based on technical correctness, not just whether the answer sounds convincing.
            3. After evaluating all answers, assign an overall accuracy score from 1-10.
            4. Assign a confidence score from 1-10 based on how confident you are in your evaluation.
            5. Set "pass" to true if the candidate demonstrates sufficient overall technical understanding; otherwise, set it to false.
            6. Consider all answers when determining the overall scores. Do not judge the candidate based on only one answer.


            Output Requirements:
            1. Include all three fields shown above.
            2. Use only the exact field names shown.
            3. Use the specified data types: number for confidence and accuracy, and a boolean for pass.
            4. Scores must be integers from 1 to 10.
            5. Return only a valid JSON object, with no additional fields.
                `
      },
      {
        role: 'user',
        content: `Q: What does === do in JavaScript?
                    A: It checks strict equality - the type and the value must match.

                    Q: How do you create a Promise that resolves after 1 second?
                    A: const promise = new Promise((resolve)=>setTimeout(resolve,1000)).

                    Q: What is hoisting?
                    A: The process of declaring all the variables and functions in the creation phase.

                    Q: Why use "let" instead of "var"?
                    A: 'let' is block scoped, whereas 'var' is function scoped. And in classical scripts, top-level var creates  a global-object property, while top-level  let does not. However in ES6 Modules, var does not add a property in the global object.
        
          `
      }
    ],
    model: 'openai/gpt-oss-20b'
  })
}

main()

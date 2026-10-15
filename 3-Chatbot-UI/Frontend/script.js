const messagesDOM = document.querySelector('.message')

const textareaDOM = document.querySelector('textarea')

const formDOM = document.querySelector('form')

// sessionId for in built Chatbot memory

const sessionId = Date.now().toString(36) + Math.random().toString(36).substring(0, 8)

// console.log('SessionId test: ', sessionId)

textareaDOM.addEventListener('keydown', event => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    formDOM.requestSubmit()
  }
})

// error state

formDOM.addEventListener('submit', async e => {
  e.preventDefault()

  const message = textareaDOM.value.trim()

  if (!message) return

  // Display the user's message
  appendMessage(message, 'user')

  textareaDOM.value = ''

  // loading state
  const loading = document.createElement('div')
  loading.className = 'py-3 animate-pulse text-green-800 font-bold'
  loading.textContent = 'Thinking ...'
  loading.setAttribute('role', 'status')
  loading.setAttribute('aria-live', 'polite')

  messagesDOM.append(loading)
  // Prevent duplicate submissions while waiting
  const submitButton = formDOM.querySelector('button')
  submitButton.disabled = true

  /** --- WE NEED TO MAKE REST API CALL TO THE BACKEND --- */

  try {
    const assistantMessage = await callServer(message)

    // Display the assistant's response
    loading.remove()
    appendMessage(assistantMessage, 'assistant')
  } catch (error) {
    appendMessage('Sorry, something went wrong. Please try again.', 'assistant')
  } finally {
    // Always clean up whether the request fails or succeeds
    loading.remove()
    submitButton.disabled = false
    textareaDOM.focus()
  }
})

// Create and append a message to the conversation
function appendMessage(text, role) {
  const wrapper = document.createElement('div')
  const bubble = document.createElement('div')

  if (role === 'user') {
    wrapper.className = 'flex justify-end'
    bubble.className = 'max-w-[85%] rounded-2xl bg-gray-200 px-4 py-3 sm:max-w-[75%]'

    // keep user message as plain text
    const paragraph = document.createElement('p')
    paragraph.textContent = text
    bubble.append(paragraph)
  } else {
    wrapper.className = 'flex items-start gap-3'
    bubble.className = 'min-w-0 flex-1 pt-1 leading-7'

    // Convert assistant Markdown to HTML, then sanitize it
    bubble.innerHTML = DOMPurify.sanitize(marked.parse(text))
  }

  wrapper.append(bubble)
  messagesDOM.append(wrapper)
}

async function callServer(inputText) {
  const response = await fetch('https://zero4-working-with-llms.onrender.com/chat', {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      message: inputText,
      sessionId
    })
  })

  if (!response.ok) {
    throw new Error('Error while generating the response')
  }

  const result = await response.json()

  return result.message
}

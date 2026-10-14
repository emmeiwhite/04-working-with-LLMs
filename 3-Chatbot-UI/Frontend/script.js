const messagesDOM = document.querySelector('.message')

const textareaDOM = document.querySelector('textarea')

const formDOM = document.querySelector('form')

textareaDOM.addEventListener('keydown', event => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    formDOM.requestSubmit()
  }
})

formDOM.addEventListener('submit', async e => {
  e.preventDefault()

  const message = textareaDOM.value.trim()

  if (!message) return

  // Display the user's message
  appendMessage(message, 'user')

  textareaDOM.value = ''

  /** --- WE NEED TO MAKE REST API CALL TO THE BACKEND --- */

  try {
    const assistantMessage = await callServer(message)

    // Display the assistant's response
    appendMessage(assistantMessage, 'assistant')
  } catch (error) {
    console.log(error)
  }
})

// Create and append a message to the conversation
function appendMessage(text, role) {
  const wrapper = document.createElement('div')
  const bubble = document.createElement('div')
  const paragraph = document.createElement('p')

  if (role === 'user') {
    wrapper.className = 'flex justify-end'
    bubble.className = 'max-w-[85%] rounded-2xl bg-gray-200 px-4 py-3 sm:max-w-[75%]'
  } else {
    wrapper.className = 'flex items-start gap-3'
    bubble.className = 'min-w-0 flex-1 pt-1 leading-7'
  }

  paragraph.textContent = text

  bubble.append(paragraph)
  wrapper.append(bubble)
  messagesDOM.append(wrapper)
}

async function callServer(inputText) {
  const response = await fetch('http://localhost:3000/chat', {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      message: inputText
    })
  })

  if (!response.ok) {
    throw new Error('Error while generating the response')
  }

  const result = await response.json()

  return result.message
}

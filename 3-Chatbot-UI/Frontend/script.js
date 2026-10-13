console.log('Way and back again! An agents tale by Emmei White!')

const messagesDOM = document.querySelector('.message')

const textareaDOM = document.querySelector('textarea')

const formDOM = document.querySelector('form')

textareaDOM.addEventListener('keydown', event => {
  console.log('Key pressed:', event.key)

  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    formDOM.requestSubmit()
  }
})

formDOM.addEventListener('submit', e => {
  e.preventDefault()

  const message = textareaDOM.value.trim()

  if (!message) return
  // Message wrapper
  const wrapper = document.createElement('div')
  wrapper.className = 'flex justify-end'

  // Message bubble
  const bubble = document.createElement('div')
  bubble.className = 'max-w-[85%] rounded-2xl bg-gray-200 px-4 py-3 sm:max-w-[75%]'

  // Message text
  const paragraph = document.createElement('p')
  paragraph.textContent = message

  // Assemble the elements
  bubble.append(paragraph)
  wrapper.append(bubble)
  messagesDOM.append(wrapper)

  // Clear the textarea
  textareaDOM.value = ''
  // And then we'll have to perform the LLM API Call, Right?
})

export const botConfig = {
    GPT35: {
      id: 2,
      name: 'GPT3.5',
      apiEndpoint: 'https://api.openai-proxy.org/v1/chat/completions',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer your-openai-key'
      },
      formatRequest: (messages) => ({
        model: 'gpt-3.5-turbo',
        messages: messages
      })
    },
    GPT4: {
      id: 3,
      name: 'GPT4',
      apiEndpoint: 'https://api.openai-proxy.org/v1/chat/completions',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer your-openai-key'
      },
      formatRequest: (messages) => ({
        model: 'gpt-4',
        messages: messages
      })
    },
    
  }
  
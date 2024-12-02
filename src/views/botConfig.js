export const botConfig = {
    GPT35: {
      id: 2,
      name: 'GPT3.5',
      apiEndpoint: 'https://api.openai-proxy.org/v1/chat/completions',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sk-WToNIH9kKqUod68vVm7RtIM5c2Boiyi1FBS8gHDAVD7yi0Za'
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
        'Authorization': 'Bearer sk-WToNIH9kKqUod68vVm7RtIM5c2Boiyi1FBS8gHDAVD7yi0Za'
      },
      formatRequest: (messages) => ({
        model: 'gpt-4o',
        messages: messages
      })
    },
    
  }
  
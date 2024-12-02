export const botConfig = {
  // Official Bots
  GPT35: {
    id: 1,
    name: 'GPT3.5-turbo',
    type: 'text',
    official: true,
    apiEndpoint: 'https://api.openai-proxy.org/v1/chat/completions',
    model: 'gpt-3.5-turbo',
    description: 'General purpose chat model with broad knowledge',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer sk-WToNIH9kKqUod68vVm7RtIM5c2Boiyi1FBS8gHDAVD7yi0Za'
    },
    formatRequest: (messages) => ({
      model: 'gpt-3.5-turbo',
      messages: messages
    }),
    systemMessages: {
      singleTurn: "You are a helpful assistant. Provide direct and concise answers to questions.",
      multiTurn: "You are a helpful assistant. Maintain conversation context and provide relevant responses."
    }
  },
  GPT4: {
    id: 2,
    name: 'GPT4-turbo',
    type: 'text',
    official: true,
    apiEndpoint: 'https://api.openai-proxy.org/v1/chat/completions',
    model: 'gpt-4-turbo-preview',
    description: 'Most capable GPT-4 model for general tasks',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer sk-WToNIH9kKqUod68vVm7RtIM5c2Boiyi1FBS8gHDAVD7yi0Za'
    },
    formatRequest: (messages) => ({
      model: 'gpt-4-turbo-preview',
      messages: messages
    }),
    systemMessages: {
      singleTurn: "You are a helpful assistant. Provide direct and concise answers to questions.",
      multiTurn: "You are a helpful assistant. Maintain conversation context and provide relevant responses."
    }
  },
  GPT4_MINI: {
    id: 3,
    name: 'GPT4-mini',
    type: 'text',
    official: true,
    apiEndpoint: 'https://api.openai-proxy.org/v1/chat/completions',
    model: 'gpt-4',
    description: 'Smaller, faster version of GPT-4',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer sk-WToNIH9kKqUod68vVm7RtIM5c2Boiyi1FBS8gHDAVD7yi0Za'
    },
    formatRequest: (messages) => ({
      model: 'gpt-4',
      messages: messages
    }),
    systemMessages: {
      singleTurn: "You are a helpful assistant. Provide direct and concise answers to questions.",
      multiTurn: "You are a helpful assistant. Maintain conversation context and provide relevant responses."
    }
  },
  DALLE3: {
    id: 4,
    name: 'DALL-E 3',
    type: 'image',
    official: true,
    apiEndpoint: 'https://api.openai-proxy.org/v1/images/generations',
    description: 'Advanced image generation model',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer sk-WToNIH9kKqUod68vVm7RtIM5c2Boiyi1FBS8gHDAVD7yi0Za'
    },
    formatRequest: (prompt) => ({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024"
    }),
    handleResponse: (response) => response.data[0].url
  },
  TRANSLATOR: {
    id: 5,
    name: 'Translator',
    type: 'text',
    official: false,
    customizable: true,
    apiEndpoint: 'https://api.openai-proxy.org/v1/chat/completions',
    model: 'gpt-3.5-turbo',
    description: 'Specialized in language translation',
    systemPrompt: "You are a professional translator. Translate the input text while maintaining its original meaning and style.",
    formatRequest: (messages) => ({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: "You are a professional translator." },
        ...messages
      ]
    })
  },
  MATH_SOLVER: {
    id: 6,
    name: 'Math Solver',
    type: 'text',
    official: false,
    customizable: true,
    apiEndpoint: 'https://api.openai-proxy.org/v1/chat/completions',
    model: 'gpt-4',
    description: 'Specialized in solving mathematical problems',
    systemPrompt: "You are a mathematics expert. Solve problems step by step and explain your reasoning clearly.",
    formatRequest: (messages) => ({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: "You are a mathematics expert." },
        ...messages
      ]
    })
  }
}

// Function to create custom bot
export const createCustomBot = (config) => {
  return {
    id: Date.now(),
    type: 'text',
    official: false,
    customizable: true,
    apiEndpoint: 'https://api.openai-proxy.org/v1/chat/completions',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer sk-WToNIH9kKqUod68vVm7RtIM5c2Boiyi1FBS8gHDAVD7yi0Za'
    },
    ...config,
    formatRequest: (messages) => ({
      model: config.model || 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: config.systemPrompt },
        ...messages
      ]
    })
  }
}
  
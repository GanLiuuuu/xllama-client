export const botConfig = {
  // Official Bots
  GPT35: {
    id: 1,
    name: 'GPT3.5-turbo',
    type: 'text',
    official: true,
    apiEndpoint: 'https://api.openai-proxy.org/v1/chat/completions',
    //apiEndpoint: 'http://172.29.11.239:8000/v1/chat/completions',
    model: 'gpt-3.5-turbo',
    description: 'General purpose chat model with broad knowledge',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer sk-6Y7nQnrQPav7gv6h0Dhl6QLPdeTUvxjyDrrKhfYbb590sGl5'
    },
    formatRequest: (messages) => ({
      model: 'gpt-3.5-turbo',
      messages: messages,
      stream: true
    }),
    systemMessages: {
      singleTurn: "You are a helpful assistant. Provide direct and concise answers to questions.",
      multiTurn: "You are a helpful assistant. Maintain conversation context and provide relevant responses."
    },
    refinePromptMessage: [{
      role: "system",
      content: "You are a helpful assistant that improves user prompts. For each user prompt, suggest 2-3 refined versions that are more specific, clearer, and likely to get better responses. Keep refined prompts concise and focused."
    }]
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
      'Authorization': 'Bearer sk-6Y7nQnrQPav7gv6h0Dhl6QLPdeTUvxjyDrrKhfYbb590sGl5'
    },
    formatRequest: (messages) => ({
      model: 'gpt-4-turbo-preview',
      messages: messages,
      stream: true
    }),
    systemMessages: {
      singleTurn: "You are a helpful assistant. Provide direct and concise answers to questions.",
      multiTurn: "You are a helpful assistant. Maintain conversation context and provide relevant responses."
    },
    refinePromptMessage: [{
      role: "system",
      content: "You are a helpful assistant that improves user prompts. For each user prompt, suggest 2-3 refined versions that are more specific, clearer, and likely to get better responses. Keep refined prompts concise and focused."
    }]
  },
  GPT4_MINI: {
    id: 3,
    name: 'GPT4-mini',
    type: 'text',
    official: false,
    apiEndpoint: 'https://api.openai-proxy.org/v1/chat/completions',
    model: 'gpt-4',
    description: 'Smaller, faster version of GPT-4',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer sk-6Y7nQnrQPav7gv6h0Dhl6QLPdeTUvxjyDrrKhfYbb590sGl5'
    },
    formatRequest: (messages) => ({
      model: 'gpt-4',
      messages: messages
    }),
    systemMessages: {
      singleTurn: "You are a helpful assistant. Provide direct and concise answers to questions.",
      multiTurn: "You are a helpful assistant. Maintain conversation context and provide relevant responses."
    },
    refinePromptMessage: [{
      role: "system",
      content: "You are a helpful assistant that improves user prompts. For each user prompt, suggest 2-3 refined versions that are more specific, clearer, and likely to get better responses. Keep refined prompts concise and focused."
    }]
  },
  DALLE3: {
    id: 4,
    name: 'DALL-E 3',
    type: 'image',
    official: false,
    apiEndpoint: 'https://api.openai-proxy.org/v1/images/generations',
    model: 'dall-e-3',
    description: 'Advanced image generation model',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer sk-6Y7nQnrQPav7gv6h0Dhl6QLPdeTUvxjyDrrKhfYbb590sGl5'
    },
    formatRequest: (prompt) => ({
      model: "dall-e-3",
      prompt: typeof prompt === 'string' ? prompt : prompt[0].content,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      response_format: "url"
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
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer sk-6Y7nQnrQPav7gv6h0Dhl6QLPdeTUvxjyDrrKhfYbb590sGl5'
    },
    formatRequest: (messages) => ({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: "You are a professional translator." },
        ...messages
      ]
    }),
    refinePromptMessage: [{
      role: "system",
      content: "You are a helpful assistant that improves translation prompts. For each prompt, suggest 2-3 refined versions that are more precise about the translation requirements, including target language, tone, and context."
    }]
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
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer sk-6Y7nQnrQPav7gv6h0Dhl6QLPdeTUvxjyDrrKhfYbb590sGl5'
    },
    formatRequest: (messages) => ({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: "You are a mathematics expert." },
        ...messages
      ]
    }),
    refinePromptMessage: [{
      role: "system",
      content: "You are a helpful assistant that improves mathematical problem prompts. For each prompt, suggest 2-3 refined versions that are more precise about the mathematical concepts and desired solution approach."
    }]
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
  
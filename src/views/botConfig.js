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
      }),
      refinePromptMessage: [
        {
          role: "system",
          content: "You are a helpful assistant that improves user prompts. For each user prompt, suggest 2-3 refined versions that are more specific, clearer, and likely to get better responses. Keep refined prompts concise and focused."
        }
      ],
      systemMessages: {
        singleTurn: "You are a helpful assistant. Provide direct and concise answers to questions without maintaining context from previous interactions.",
        multiTurn: "You are a helpful assistant. Maintain conversation context and provide relevant responses based on the chat history. Feel free to reference previous messages when appropriate."
      }
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
      }),
      refinePromptMessage: [
        {
          role: "system",
          content: "You are a helpful assistant that improves user prompts. For each user prompt, suggest 2-3 refined versions that are more specific, clearer, and likely to get better responses. Keep refined prompts concise and focused."
        }
      ],
      systemMessages: {
        singleTurn: "You are a helpful assistant. Provide direct and concise answers to questions without maintaining context from previous interactions.",
        multiTurn: "You are a helpful assistant. Maintain conversation context and provide relevant responses based on the chat history. Feel free to reference previous messages when appropriate."
      }
    },
    
  }
  
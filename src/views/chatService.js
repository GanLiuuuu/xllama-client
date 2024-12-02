import { botConfig } from './botConfig.js';  
export class ChatService {
    constructor(botType) {
      this.config = botConfig[botType];
    }
    async sendMessage(messages) {
        try {
          const response = await fetch(this.config.apiEndpoint, {
            method: 'POST',
            headers: this.config.headers,
            body: JSON.stringify(this.config.formatRequest(messages))
          });
          const data = await response.json();
          return data.choices[0].message.content;
        } catch (error) {
          console.error(`Error in ${this.config.name} API call:`, error);
          throw error;
        }
      }
    async *streamMessage(messages, onProgress) {
      try {
        const systemMessage = messages[0]?.role === 'system' ? [] : [{
          role: 'system',
          content: messages.length > 1 
            ? 'You are a helpful assistant. Maintain conversation context and provide relevant responses based on the chat history.'
            : 'You are a helpful assistant. Provide direct answers to questions.'
        }]

        const fullMessages = [...systemMessage, ...messages]

        const response = await fetch(this.config.apiEndpoint, {
          method: 'POST',
          headers: {
            ...this.config.headers,
            'Accept': 'text/event-stream',
          },
          body: JSON.stringify({
            ...this.config.formatRequest(fullMessages),
            stream: true,
            temperature: messages.length > 1 ? 0.7 : 0.3
          })
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
  
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
  
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';
  
          for (const line of lines) {
            if (line.startsWith('data: ') && line !== 'data: [DONE]') {
              try {
                const json = JSON.parse(line.slice(6));
                let content = '';
                
                // Handle different bot response formats
                if (this.config.name === 'GPT35' || this.config.name === 'GPT4') {
                  content = json.choices[0]?.delta?.content || '';
                } else if (this.config.name === 'CLAUDE') {
                  content = json.completion || '';
                }
                if (content) {
                  yield content;
                  if (onProgress) onProgress(content);
                }
              } catch (e) {
                console.error('Error parsing SSE message:', e);
              }
            }
          }
        }
      } catch (error) {
        console.error(`Error in ${this.config.name} streaming API call:`, error);
        throw error;
      }
    }
    async refinePrompt(userPrompt) {
      try {
        const messages = [
          ...this.config.refinePromptMessage,
          {
            role: "user",
            content: `Original prompt: "${userPrompt}"\n\nPlease suggest 2-3 improved versions of this prompt. Format each suggestion on a new line starting with a dash (-).`
          }
        ];

        const response = await fetch(this.config.apiEndpoint, {
          method: 'POST',
          headers: this.config.headers,
          body: JSON.stringify({
            ...this.config.formatRequest(messages),
            temperature: 0.7,
            max_tokens: 150
          })
        });

        const data = await response.json();
        const refinedPrompts = data.choices[0].message.content
          .split('\n')
          .filter(line => line.trim().startsWith('-'))
          .map(line => line.substring(1).trim());

        return refinedPrompts;
      } catch (error) {
        console.error('Error refining prompt:', error);
        return [];
      }
    }
  }
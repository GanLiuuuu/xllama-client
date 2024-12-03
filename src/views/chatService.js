import { botConfig } from './botConfig.js';  
export class ChatService {
    constructor(botType) {
      this.config = botConfig[botType];
      if (!this.config) {
        throw new Error(`Bot type ${botType} not found in config`);
      }
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
        // Handle different bot types
        if (this.config.type === 'image') {
          const prompt = messages[messages.length - 1].content[0].text;
          const response = await this.handleImageGeneration(prompt);
          yield response;
          if (onProgress) onProgress(response);
          return;
        }

        const systemMessage = messages[0]?.role === 'system' ? [] : [{
          role: 'system',
          content: this.config.systemMessages?.[messages.length > 1 ? 'multiTurn' : 'singleTurn'] 
            || this.config.systemPrompt
            || "You are a helpful assistant."
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
                if (this.config.type === 'text') {
                  content = json.choices[0]?.delta?.content || '';
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
        console.error(`Error in ${this.config.name} API call:`, error);
        throw error;
      }
    }
    async refinePrompt(userPrompt) {
      try {
        // 检查是否存在 refinePromptMessage
        if (!this.config.refinePromptMessage || !Array.isArray(this.config.refinePromptMessage)) {
          console.warn(`No refinePromptMessage configured for ${this.config.name}`);
          return [];
        }

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

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

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
    // New method for handling image generation
    async handleImageGeneration(prompt) {
      try {
        const response = await fetch(this.config.apiEndpoint, {
          method: 'POST',
          headers: this.config.headers,
          body: JSON.stringify(this.config.formatRequest(prompt))
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const imageUrl = this.config.handleResponse(data);
        return imageUrl.startsWith('@') ? imageUrl.substring(1) : imageUrl;
      } catch (error) {
        console.error('Error generating image:', error);
        throw error;
      }
    }
  }
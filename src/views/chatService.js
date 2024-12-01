import { botConfig } from './botConfig.js';  // 确保路径正确
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
  
    
  }
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
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        return this.parseResponse(data);
      } catch (error) {
        console.error(`Error in ${this.config.name} API call:`, error);
        throw error;
      }
    }
  
    parseResponse(data) {
      switch(this.config.name) {
        case 'Claude':
          return data.content[0].text;
        case 'GPT3.5':
        case 'GPT4':
          return data.choices[0].message.content;
        case 'Gemini':
          return data.candidates[0].content.parts[0].text;
        default:
          throw new Error('Unknown bot type');
      }
    }
  }
  
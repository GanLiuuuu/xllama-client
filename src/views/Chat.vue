<template>
  <div class="chat-area">
    <div style="overflow: auto;height: 550px;" v-html="content"></div>
    <div class="bg-gray-50 sm:rounded-lg" style="text-align: left;">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-base font-semibold text-gray-900">Multiple Query Formats?</h3>
        <div class="mt-2 max-w-xl text-sm text-gray-500">
          <p>You can ask questions via text, images, files, and voice inputs.</p>
        </div>
        <div class="mt-5">
          <input type="file" @change="handleFileUpload" style="display: none" ref="fileInput" />
          <button @click="triggerFileInput" type="button" class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">Upload photo</button>
        </div>
      </div>
    </div>
    <div class="mt-5 sm:flex sm:items-center">
      <input type="text" @keyup.enter="sendMsg" v-model="text" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6" placeholder="Message XLlama" />
      <button @click="sendMsg" class="mt-3 inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:ml-3 sm:mt-0 sm:w-auto">Send</button>
    </div>
  </div>
</template>

<script>
import { OpenAI } from "openai";
export default {
  data() {
    return {
      suggestions: [
        "Give me ideas",
        "Tell me a fun fact",
        "Overcome procrastination",
        "Help me study"
      ],
      content: '',
      text: "",
      websocket: null,
      uploadedImageUrl: "", // 用来存储图片URL
      openai: new OpenAI({
        apiKey: "your-api-key", 
        basePath: "https://api.openai-proxy.org/v1",
        dangerouslyAllowBrowser: true,
      }),
    };
  },
  mounted() {
    if ('WebSocket' in window) {
      this.websocket = new WebSocket(`ws://localhost:8081/chat`);
      this.initWebSocket();
    } else {
      alert('当前浏览器 Not support websocket');
    }
  },
  beforeDestroy() {
    this.onbeforeunload();
  },
  methods: {
    initWebSocket() {
      this.websocket.onerror = this.setErrorMessage;
      this.websocket.onopen = this.setOnopenMessage;
      this.websocket.onmessage = this.setOnmessageMessage;
      this.websocket.onclose = this.setOncloseMessage;

      window.onbeforeunload = this.onbeforeunload;
    },
    async sendMsg() {
      this.uploadedImageUrl = 'https://s2.loli.net/2024/11/24/Qp8Uw4vsnP7aB3q.jpg';
    if (!this.text && !this.uploadedImageUrl) {
      return;
    }

    let promptContent = '';
    let imageContent = null;

    if (this.text) {
      promptContent = this.text;
    }

    if (this.uploadedImageUrl) {
      alert('ur photo is uploaded');
      imageContent = {
        "type": "image_url",
        "image_url": {
          "url": this.uploadedImageUrl
        }
      };
    }

    const messageContent = imageContent ? [
      imageContent, 
      { "type": "text", "text": promptContent }
    ] : [{ "type": "text", "text": promptContent }];
    const messages_test= [
        {
          role: 'user', // 角色
          content: [ // 数组
            {
              type: 'text',
              'text': '请描述以下图片的内容'
            },
            {
              type: 'image_url',
              "image_url": {
                "url": 'https://s2.loli.net/2024/11/24/Qp8Uw4vsnP7aB3q.jpg'
              }
            }
          ]
        }
      ];
    // Send to WebSocket
    this.createContent('human', null, messageContent);
    this.websocket.send(JSON.stringify({
      text: promptContent,
      imageUrl: this.uploadedImageUrl
    }));

    // Send to OpenAI API
    try {
      console.error(messages_test);
      const response = await fetch('https://api.openai-proxy.org/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer sk-WToNIH9kKqUod68vVm7RtIM5c2Boiyi1FBS8gHDAVD7yi0Za',
        },
        body: JSON.stringify({
          model: "gpt-4o", // or "gpt-4" if needed
          messages: messages_test
        })
      });
      console.error(response)
      const data = await response.json();
      const botReply = data.choices[0].message.content.trim();
      this.createContent('gpt', null, botReply);
    } catch (error) {
      console.error("Error with OpenAI API:", error);
      this.createContent('gpt', null, "Sorry, I couldn't process that request.");
    }

    // Reset input fields
    this.text = "";
    this.uploadedImageUrl = "";
  },
    async sendTextMessage() {
      if (!this.text) {
        return;
      }
      this.createContent(null, 'human', this.text);
      this.websocket.send(this.text);
      try {
        const response = await fetch('https://api.openai-proxy.org/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer your-api-key',
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              { role: "system", content: "You are a helpful assistant." },
              { role: "user", content: this.text }
            ]
          })
        });
        const data = await response.json();
        const botReply = data.choices[0].message.content.trim();
        this.createContent('gpt', null, botReply);
      } catch (error) {
        console.error("Error with OpenAI API:", error);
        this.createContent('gpt', null, "Sorry, I couldn't process that request.");
      }
      this.text = "";
    },
    async handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
      const formData = new FormData();
      formData.append('smfile', file);

      try {
        const response = await fetch('apis/api/v2/upload', {
          method: 'POST',
          headers: {
            Authorization: 'xUYYZYpzzZFXNRoCiuy1OGjc7nGlgaIL',
          },
          body: formData
        });
        const data = await response.json();
        if (data.code === 'success') {
          this.uploadedImageUrl = data.data.url; 
          console.log("Image uploaded to SMMS. URL: ", this.uploadedImageUrl);
        } else {
          console.error("Error uploading image: ", data.message);
        }
      } catch (error) {
        console.error("Error with image upload: ", error);
      }
    },
    triggerFileInput() {
      this.$refs.fileInput.click(); 
    },
    createContent(bot, user, text) {
      let html = "";
      if (user) {
        html = `
          <div class="chat-row" style="display: flex; align-items: center; padding: 5px 0">
            <div class="chat-message" style="flex: 1; text-align: right; padding-right: 10px;">
              <div class="tip left" style="background-color: #f0f0f0; padding: 10px; border-radius: 8px; display: inline-block; max-width: 70%;">
                ${text}
              </div>
            </div>
            <div class="chat-avatar" style="width: 40px; height: 40px;">
              <img src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">
            </div>
          </div>`;
      } else if (bot) {
        html = `
          <div class="chat-row" style="display: flex; align-items: center; padding: 5px 0">
            <div class="chat-avatar" style="width: 40px; height: 40px;">
              <img src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">
            </div>
            <div class="chat-message" style="flex: 1; text-align: left; padding-left: 10px;">
              <div class="tip right" style="background-color: #e0f7fa; padding: 10px; border-radius: 8px; display: inline-block; max-width: 70%;">
                ${text}
              </div>
            </div>
          </div>`;
      }
      this.content += html;
    }
  }
};
</script>

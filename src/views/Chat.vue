<template>
    <div class="chat-area">
      <div style="overflow: auto;height: 700px;" v-html="content"></div>
      <div class="mt-5 sm:flex sm:items-center">
        <input type="text" @keyup.enter="sendMsg" v-model="text"  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6" placeholder="Message XLlama" />
        <button @click="sendTextMessage" class="mt-3 inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:ml-3 sm:mt-0 sm:w-auto">Send</button>
      </div>
    </div>
  </template>
  
  <script>
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
      };
    },
    mounted() {
      // WebSocket
      if ('WebSocket' in window) {
        this.websocket = new WebSocket(`ws://localhost:8081/chat`)
        this.initWebSocket()
      } else {
        alert('当前浏览器 Not support websocket')
      }
    },
    beforeDestroy () {
      this.onbeforeunload()
    },
    methods: {
      initWebSocket () {
        // 连接错误
        this.websocket.onerror = this.setErrorMessage

        // 连接成功
        this.websocket.onopen = this.setOnopenMessage

        // 收到消息的回调
        this.websocket.onmessage = this.setOnmessageMessage

        // 连接关闭的回调
        this.websocket.onclose = this.setOncloseMessage

        // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
        window.onbeforeunload = this.onbeforeunload
        
        this.websocket.onmessage = (event) => {
          const serverMessage = event.data; // 获取消息内容
          console.log('info: ' + serverMessage);
          this.createContent('gpt',null,serverMessage);//把bot回复的内容显示在网页上
        };
      },
      sendTextMessage(){
        if(!this.text){
          return;
        }
        this.createContent(null,'human',this.text);
        this.websocket.send(this.text)
        
        const apiUrl = "https://gateway.ai.cloudflare.com/v1/a8de3330640fc629a2b07ba814e8ccad/keronelau/openai/chat/completions"; // 替换为你的 GPT 接口地址
  const requestBody = {
    message: this.text,
    model: "gpt-3.5-turbo" // 替换为实际使用的模型
  };

  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "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" // 替换为你的 API Key
    },
    body: JSON.stringify(requestBody)
  })
    .then(response => response.json())
    .then(data => {
      const gptResponse = data.reply || "抱歉，我无法处理您的请求。"; // 确保返回内容存在
      // 显示 GPT 的回复
      this.createContent('gpt', null, gptResponse);
    })
    .catch(error => {
      console.error("Error calling GPT API:", error);
      // 显示错误信息
      this.createContent('gpt', null, "抱歉，请求失败，请稍后再试。");
    });
    this.text = "";
      },

      setErrorMessage () {
        console.log('WebSocket连接发生错误   状态码：' + this.websocket.readyState)
      },
      setOnopenMessage () {
        this.websocket.send('hello')
        console.log('WebSocket连接成功    状态码：' + this.websocket.readyState)
      },
      setOnmessageMessage (event) {
        // 根据服务器推送的消息做自己的业务处理
        console.log('服务端返回：' + event.data)
      },
      setOncloseMessage () {
        console.log('WebSocket连接关闭    状态码：' + this.websocket.readyState)
      },
      onbeforeunload () {
        this.closeWebSocket()
      },
      closeWebSocket () {
        this.websocket.close()
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
  
  <style scoped>
  .chat-area {
    padding: 40px;
    text-align: center;
  }
  
  .suggestions {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 20px;
  }
  
  .suggestion {
    background-color: #e0e0e0;
    padding: 20px;
    border-radius: 10px;
    cursor: pointer;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s;
  }
  
  .suggestion:hover {
    background-color: grey;
  }
  
  .chat-input-container {
    margin-top: 50px;
    width: 1000px;
  }
  
  .chat-input {
    width: 80%;
    padding: 10px;
    border-radius: 20px;
    border: 1px solid #ccc;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    outline: none;
    transition: border-color 0.3s;
  }
  
  .chat-input:focus {
    border-color: #64748b;
  }
  
  .send-button {
    margin-left: 10px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: none;
    background-color: #4ade80;
    color: white;
    font-size: 18px;
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s;
  }
  
  .send-button:hover {
    background-color: #22c55e;
  }
  </style>
  
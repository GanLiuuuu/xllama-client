<template>
    <div class="chat-area">
      <div style="overflow: auto;height: 500px;" v-html="content"></div>
      <div class="chat-input-container">
        <input 
          type="text" 
          class="chat-input" 
          placeholder="Message XLlama" 
          v-model="text" 
          @keyup.enter="sendMsg"
        />
        <button class="send-button" @click="">➤</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        userName: 'a',
        suggestions: [
          "Give me ideas",
          "Tell me a fun fact",
          "Overcome procrastination",
          "Help me study"
        ],
        content: '',
        text: "",
        websocket: null,
        self: "user_one",
        other: "user_two"
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
        };
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
  
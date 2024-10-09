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
        <button class="send-button" @click="sendMsg()">➤</button>
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
        self: "user_one",
        other: "user_two"
      };
    },
    mounted() {
      this.webSocketInit();
    },
    methods: {
      webSocketInit() {
        if (!window.WebSocket) {
          alert('WebSocket is not supported by your browser');
          return;
        }
        this.websocket = new WebSocket(`ws://127.0.0.1:3000/chat`);
        
        this.websocket.onopen = () => {
          this.linkSuccess(this.self, this.self, "链接成功");
        };
        
        this.websocket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          this.createContent("b", null, data.message);
        };
  
        this.websocket.onerror = () => {
          alert("WebSocket连接发生错误");
        };
        
        this.websocket.onclose = () => {
          alert("WebSocket连接关闭");
        };
  
        window.onbeforeunload = () => {
          this.websocket.close();
        };
      },
      sendMsg() {
        if (!this.text) {
          this.$message({ type: 'warning', message: "请输入内容" });
          return;
        }
        console.error('sus')
        this.createContent(null, "a", this.text);
        const msg = {
          from: this.self,
          to: this.other,
          createTime: new Date(),
          message: this.text
        };
        
        this.websocket.addEventListener('open', function () {
            this.websocket.send(JSON.stringify(msg))
        });
        this.text = ""; // 清空输入框
      },
      linkSuccess(from, to, msg) {
        

        const successMsg = {
          from: from,
          to: to,
          createTime: new Date(),
          message: msg
        };
        this.websocket.send(JSON.stringify(successMsg));
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
  
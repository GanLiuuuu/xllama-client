<template>
	<div class="chat-area">
	  
	  <div style="overflow: auto;height: 500px; " v-html="content">
	  </div>
	  <div class="chat-input-container">
		<input type="text" class="chat-input" placeholder="Message XLlama" v-model="text"/>
		<button class="send-button" @click="send">➤</button>
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
        text: ""

	  };
	},
    methods: {
        send(){
            if (!this.text) {
                this.$message({type: 'warning', message: "请输入内容"})
            } else {
                
                // 组装待发送的消息 json
                // {"from": "zhang", "to": "admin", "text": "聊天文本"}
                // let message = {from: "a", to: "b", text: this.text}
                //socket.send(JSON.stringify(message));  // 将组装好的json发送给服务端，由服务端进行转发
                // 构建消息内容，本人消息
                this.createContent(null, "a", this.text)
                this.text = '';
                
            }

        },
        createContent(bot, user, text) { //text should be json type
            let html
            console.log('h')
            // 当前用户消息
            if (user) { 
            html = "<div class=\"chat-row\" style=\"display: flex; align-items: center; padding: 5px 0\">\n" +
                "  <div class=\"chat-message\" style=\"flex: 1; text-align: right; padding-right: 10px;\">\n" +
                "    <div class=\"tip left\" style=\"background-color: #f0f0f0; padding: 10px; border-radius: 8px; display: inline-block; max-width: 70%;\">" + text + "</div>\n" +
                "  </div>\n" +
                "  <div class=\"chat-avatar\" style=\"width: 40px; height: 40px;\">\n" +
                "    <img src=\"https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png\" style=\"width: 100%; height: 100%; border-radius: 50%; object-fit: cover;\">\n" +
                "  </div>\n" +
                "</div>";
        } else if (bot) {   
            html = "<div class=\"chat-row\" style=\"display: flex; align-items: center; padding: 5px 0\">\n" +
                "  <div class=\"chat-avatar\" style=\"width: 40px; height: 40px;\">\n" +
                "    <img src=\"https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png\" style=\"width: 100%; height: 100%; border-radius: 50%; object-fit: cover;\">\n" +
                "  </div>\n" +
                "  <div class=\"chat-message\" style=\"flex: 1; text-align: left; padding-left: 10px;\">\n" +
                "    <div class=\"tip right\" style=\"background-color: #e0f7fa; padding: 10px; border-radius: 8px; display: inline-block; max-width: 70%;\">" + text + "</div>\n" +
                "  </div>\n" +
                "</div>";
        }
            console.log(html)
            this.content += html;
        },
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
	background-color:#e0e0e0 ;
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
     margin-top: 50px; /* 固定在页面底部 */
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
  
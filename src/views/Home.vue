<template>
	<div class="chat-area">
	  <h2>X-Llama</h2>
	  <p>How can I help you today?</p>
	  <div class="suggestions">
		<div class="suggestion" v-for="suggestion in suggestions" :key="suggestion">
		  {{ suggestion }}
		</div>
	  </div>
	  <div class="chat-input-container">
		<input type="text" class="chat-input" placeholder="Message XLlama" />
		<button class="send-button">➤</button>
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
		]
	  };
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
	margin-top: 30px;
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
  
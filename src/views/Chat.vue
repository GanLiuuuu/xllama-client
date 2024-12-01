<template>
  <div class="chat-area" style="padding: 40px">
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
        
        <Listbox as="div" v-model="selected">
          <ListboxLabel class="block text-sm/6 font-medium text-gray-900">Assigned to</ListboxLabel>
          <div class="relative mt-2">
            <ListboxButton class="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm/6">
              <span class="block truncate">{{ selected.name }}</span>
              <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon class="size-5 text-gray-400" aria-hidden="true" />
              </span>
            </ListboxButton>

            <transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
              <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                <ListboxOption as="template" v-for="person in people" :key="person.id" :value="person" v-slot="{ active, selected }">
                  <li :class="[active ? 'bg-indigo-600 text-white' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-3 pr-9']">
                    <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">{{ person.name }}</span>

                    <span v-if="selected" :class="[active ? 'text-white' : 'text-indigo-600', 'absolute inset-y-0 right-0 flex items-center pr-4']">
                      <CheckIcon class="size-5" aria-hidden="true" />
                    </span>
                  </li>
                </ListboxOption>
              </ListboxOptions>
            </transition>
          </div>
        </Listbox>
      </div>
    </div>
    <div class="mt-5 sm:flex sm:items-center">
      <input type="text" @keyup.enter="sendMsg" v-model="text" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6" placeholder="Message XLlama" />
      <button @click="sendMsg" class="mt-3 inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:ml-3 sm:mt-0 sm:w-auto">Send</button>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { Listbox, ListboxButton, ListboxLabel, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'

const people = [
  { id: 2, name: 'GPT35' },
  { id: 3, name: 'GPT4' },
  
]

const selected = ref(people[1])
</script>

<script>
import { Listbox, ListboxButton, ListboxLabel, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { OpenAI } from "openai";
import { ref } from 'vue'

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
    formatMessages(text, imageUrl) {
      let content = [];
      
      if (text) {
        content.push({
          type: 'text',
          text: text
        });
      }

      if (imageUrl) {
        content.push({
          type: 'image_url',
          image_url: {
            url: imageUrl
          }
        });
      }

      return [{
        role: 'user',
        content: content
      }];
    },
    async sendMsg() {
    if ((!this.text && !this.uploadedImageUrl) || !this.text) {
      return;
    }
    const messages = this.formatMessages(this.text, this.uploadedImageUrl);


    
    this.createContent(null, 'human', this.text);
    this.websocket.send(JSON.stringify({
      messages: messages
    }));

    try {
      const response = await fetch('https://api.openai-proxy.org/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer sk-WToNIH9kKqUod68vVm7RtIM5c2Boiyi1FBS8gHDAVD7yi0Za',
        },
        body: JSON.stringify({
          model: "gpt-4o", // or "gpt-4" if needed
          messages: messages
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

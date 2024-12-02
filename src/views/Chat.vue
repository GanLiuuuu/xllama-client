<template>

  <div class="chat-area" style="padding: 40px">
    <div class="flex justify-end mb-4">
      <button 
        @click="clearChatHistory" 
        class="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
      >
        Clear Chat History
      </button>
    </div>
    <div style="overflow: auto; height: 550px;" ref="chatContainer">
      <div v-for="message in messageHistory" :key="message.id" class="chat-row" :style="getRowStyle()">
        <template v-if="message.type === 'human'">
          <div class="chat-message" style="flex: 1; text-align: right; padding-right: 10px;">
            <div class="tip left" style="background-color: #f0f0f0; padding: 10px; border-radius: 8px; display: inline-block; max-width: 70%;">
              {{ message.content }}
            </div>
          </div>
          <div class="chat-avatar" style="width: 40px; height: 40px;">
            <img src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">
          </div>
        </template>
        
        <!-- Bot message -->
        <template v-if="message.type === 'bot'">
          <div class="chat-avatar" style="width: 40px; height: 40px;">
            <img src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">
          </div>
          <div class="chat-message" style="flex: 1; text-align: left; padding-left: 10px;">
            <div class="tip right" style="background-color: #e0f7fa; padding: 10px; border-radius: 8px; display: inline-block; max-width: 70%;">
              {{ message.content }}
              <span v-if="message.isStreaming" class="typing-indicator" style="display: inline-block; margin-left: 4px;">▊</span>
            </div>
          </div>
        </template>
      </div>
    </div>

    <div class="bg-gray-50 sm:rounded-lg" style="text-align: left;">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-base font-semibold text-gray-900">Multiple Query Formats?</h3>
        <div class="mt-2 max-w-xl text-sm text-gray-500">
          <p>You can ask questions via text, images, files, and voice inputs.</p>
        </div>
        <div class="mt-5">
          <input type="file" @change="handleFileUpload" style="display: none" ref="fileInput" />
          <button @click="triggerFileInput" type="button" class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
            Upload photo
          </button>
        </div>
        
        <Listbox as="div" v-model="selected">
          <ListboxLabel class="block text-sm/6 font-medium text-gray-900">Model</ListboxLabel>
          <div class="relative mt-2">
            <ListboxButton class="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm/6">
              <span class="block truncate">{{ selected.name }}</span>
              <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon class="size-5 text-gray-400" aria-hidden="true" />
              </span>
            </ListboxButton>

            <transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
              <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                <ListboxOption as="template" v-for="model in models" :key="model.id" :value="model" v-slot="{ active, selected }">
                  <li :class="[active ? 'bg-indigo-600 text-white' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-3 pr-9']">
                    <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">{{ model.name }}</span>
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

    <div class="mt-5">
      <div class="mb-4">
        <PromptSuggestions 
          v-if="getLastBotMessage"
          :lastBotMessage="getLastBotMessage"
          @suggestionClick="handleSuggestionClick"
        />
      </div>
      
      <div class="mb-4">
        <PromptRefinement
          :refinedPrompts="refinedPrompts"
          @select-prompt="handleRefinedPrompt"
        />
      </div>

      <!-- 输入框和发送按钮 -->
      <div class="flex items-center gap-3">
        <input 
          type="text" 
          @keyup.enter="sendMsg" 
          v-model="text" 
          class="flex-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6" 
          placeholder="Message Assistant" 
        />
        <button 
          @click="sendMsg" 
          class="inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Send
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// TODO: 利用路由器对于每一个界面刷新历史纪录
import { ref, onMounted, onBeforeUnmount, nextTick, computed, watch } from 'vue'
import { Listbox, ListboxButton, ListboxLabel, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'
import { ChatService } from './chatService.js'
import PromptSuggestions from '../components/PromptSuggestions.vue'
import { useStore } from 'vuex'
import axios from "axios";
import PromptRefinement from '../components/PromptRefinement.vue'

// Model options
const models = [
  { id: 0, name: 'GPT35' },
  { id: 1, name: 'GPT4' },
]
const selected = ref(models[1])

const text = ref('')
const uploadedImageUrl = ref('')
const messageHistory = ref([])
const chatContainer = ref(null)
const fileInput = ref(null)
const sessionId = ref(null)
const currentUserId = ref(null)

// 添加 store
const store = useStore()

// 获取用户ID的函数
const getCurrentUserId = async () => {
  try {
    const userEmail = store.state.user.email
    const response = await axios.get('/user/getUserId', {
      params: { email: userEmail }
    })
    
    if (!response.data.userId) {
      throw new Error('No userId in response')
    }
    
    return response.data.userId
  } catch (error) {
    console.error('Error getting user ID:', error.response?.data || error.message)
    return null
  }
}
onMounted(async () => {
  currentUserId.value = await getCurrentUserId()
})
// 监听 currentSessionId 的变化
watch(
  () => store.state.currentSessionId,
  async (newSessionId) => {
    if (newSessionId) {
      try {
        // 直接从后端获取聊天记录
        const response = await axios.get(`/api/chat/session/${newSessionId}/history`)
        console.error(response.data)
        if (response.data) {
          // 修改映射逻辑，为每条消息创建一对人类和机器人的消息
          const messages = []
          response.data.forEach(interaction => {
            // 添加用户消息
            messages.push({
              id: `${interaction.interaction_id}-human`,
              type: 'human',
              content: interaction.interaction_req,
              isStreaming: false
            })
            // 添加机器人回复
            messages.push({
              id: `${interaction.interaction_id}-bot`,
              type: 'bot',
              content: interaction.interaction_res,
              isStreaming: false
            })
          })
          messageHistory.value = messages
          await scrollToBottom()
        }
      } catch (error) {
        console.error('Error loading chat history:', error)
        messageHistory.value = []
      }
    } else {
      // 清空聊天记录
      messageHistory.value = []
    }
  },
  { immediate: true }
)

const scrollToBottom = async () => {
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}
// Add to your script setup section
const getLastBotMessage = computed(() => {
  const botMessages = messageHistory.value.filter(m => m.type === 'bot')
  return botMessages.length > 0 ? botMessages[botMessages.length - 1].content : ''
})

const handleSuggestionClick = (suggestion) => {
  text.value = suggestion
  // Optionally, you can auto-send the suggestion:
  // sendMsg()
}
const formatMessages = (text, imageUrl) => {
  let content = []
  
  if (text) {
    content.push({
      type: 'text',
      text: text
    })
  }

  if (imageUrl) {
    content.push({
      type: 'image_url',
      image_url: {
        url: imageUrl
      }
    })
  }

  return [{
    role: 'user',
    content: content
  }]
}
// Add clearChatHistory function
const clearChatHistory = async () => {
  if (!store.state.currentSessionId) return;
  
  try {
    // Call backend API to delete chat history
    await axios.delete(`/api/chat/${store.state.currentSessionId}/history`)
    
    // Clear local message history
    messageHistory.value = []
    
  } catch (error) {
    console.error('Error clearing chat history:', error.response?.data || error.message)
  }
}
// Add new message to history
const addMessage = (type, content, isStreaming = false) => {
  messageHistory.value.push({
    id: Date.now(),
    type,
    content,
    isStreaming
  })
  scrollToBottom()
}

const updateLastBotMessage = (content, isStreaming) => {
  const lastBotMessage = messageHistory.value
    .filter(m => m.type === 'bot')
    .pop()
  
  if (lastBotMessage) {
    lastBotMessage.content = content
    lastBotMessage.isStreaming = isStreaming
  }
  scrollToBottom()
}

// Send message
const sendMsg = async () => {
  if (!text.value && !uploadedImageUrl.value || !text.value || !store.state.currentSessionId) {
    return
  }

  const userMessage = text.value
  addMessage('human', userMessage)
  addMessage('bot', '', true)
  
  let currentContent = ''
  
  try {
    const chatService = new ChatService(selected.value.name)
    const messages = formatMessages(text.value, uploadedImageUrl.value)
    
    for await (const chunk of chatService.streamMessage(messages, (content) => {
      currentContent += content
      updateLastBotMessage(currentContent, true)
    })) {
      continue;
    }
    
    await saveChatInteraction({
      request: userMessage,
      response: currentContent
    })
    
    updateLastBotMessage(currentContent, false)
  } catch (error) {
    console.error('Error with streaming API:', error)
    updateLastBotMessage('Sorry, I couldn\'t process that request.', false)
  }

  text.value = ''
  uploadedImageUrl.value = ''
}

// File upload handling
const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  const formData = new FormData()
  formData.append('smfile', file)

  try {
    const response = await fetch('apis/api/v2/upload', {
      method: 'POST',
      headers: {
        Authorization: 'xUYYZYpzzZFXNRoCiuy1OGjc7nGlgaIL',
      },
      body: formData
    })
    
    const data = await response.json()
    if (data.code === 'success') {
      uploadedImageUrl.value = data.data.url
      console.log('Image uploaded to SMMS. URL: ', uploadedImageUrl.value)
    } else {
      console.error('Error uploading image: ', data.message)
    }
  } catch (error) {
    console.error('Error with image upload: ', error)
  }
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const getRowStyle = () => {
  return {
    display: 'flex',
    alignItems: 'center',
    padding: '5px 0'
  }
}

const saveChatInteraction = async (interaction) => {
  try {
    await axios.post('/api/chat/interaction', {
      sessionId: store.state.currentSessionId,
      userId: currentUserId.value,
      botId: selected.value.id,
      interactionReq: interaction.request,
      interactionRes: interaction.response
    })
  } catch (error) {
    console.error('Error saving chat interaction:', error.response?.data || error.message)
  }
}

const refinedPrompts = ref([])
const isRefining = ref(false)

// Add debounce utility
const debounce = (fn, delay) => {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

// Add method to get refined prompts
const getRefinedPrompts = debounce(async (input) => {
  if (!input || input.length < 10 || isRefining.value) return
  
  isRefining.value = true
  try {
    const chatService = new ChatService(selected.value.name)
    const prompts = await chatService.refinePrompt(input)
    refinedPrompts.value = prompts
    console.error(prompts)
  } catch (error) {
    console.error('Error getting refined prompts:', error)
  } finally {
    isRefining.value = false
  }
}, 1000) // 1 second delay

// Add watcher for text input
watch(text, (newValue) => {
  if (newValue) {
    getRefinedPrompts(newValue)
  } else {
    refinedPrompts.value = []
  }
})

const handleRefinedPrompt = (refinedPrompt) => {
  text.value = refinedPrompt
  refinedPrompts.value = []
}
</script>
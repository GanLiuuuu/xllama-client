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
              <template v-if="selected.type === 'image'">
                <img :src="message.content" alt="Generated image" style="max-width: 100%; border-radius: 4px;">
              </template>
              <template v-else>
                {{ message.content }}
              </template>
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
              <div class="flex items-center">
                <span class="block truncate">{{ getDisplayName(selected.name) }}</span>
                <span class="ml-2 inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                  {{ selected.type }}
                </span>
              </div>
              <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon class="size-5 text-gray-400" aria-hidden="true" />
              </span>
            </ListboxButton>

            <transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
              <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                <!-- Official Models -->
                <div class="px-3 py-2 text-xs font-semibold text-gray-500">Official Models</div>
                <ListboxOption 
                  v-for="model in models.filter(m => !m.custom)" 
                  :key="model.id" 
                  :value="model" 
                  v-slot="{ active, selected }"
                >
                  <li :class="[active ? 'bg-indigo-600 text-white' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-3 pr-9']">
                    <div class="flex items-center">
                      <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">
                        {{ getDisplayName(model.name) }}
                      </span>
                      <span class="ml-2 inline-flex items-center rounded-md" :class="[active ? 'bg-indigo-300' : 'bg-gray-50', 'px-2 py-1 text-xs font-medium ring-1 ring-inset']" :style="{ color: active ? 'white' : 'gray', borderColor: active ? 'white' : 'gray' }">
                        {{ model.type }}
                      </span>
                    </div>
                    <span v-if="selected" :class="[active ? 'text-white' : 'text-indigo-600', 'absolute inset-y-0 right-0 flex items-center pr-4']">
                      <CheckIcon class="size-5" aria-hidden="true" />
                    </span>
                  </li>
                </ListboxOption>

                <!-- Custom Models -->
                <div class="mt-2 px-3 py-2 text-xs font-semibold text-gray-500">Custom Models</div>
                <ListboxOption 
                  v-for="model in models.filter(m => m.custom)" 
                  :key="model.id" 
                  :value="model" 
                  v-slot="{ active, selected }"
                >
                  <li :class="[active ? 'bg-indigo-600 text-white' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-3 pr-9']">
                    <div class="flex items-center">
                      <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">
                        {{ getDisplayName(model.name) }}
                      </span>
                      <span class="ml-2 inline-flex items-center rounded-md" :class="[active ? 'bg-indigo-300' : 'bg-gray-50', 'px-2 py-1 text-xs font-medium ring-1 ring-inset']" :style="{ color: active ? 'white' : 'gray', borderColor: active ? 'white' : 'gray' }">
                        {{ model.type }}
                      </span>
                    </div>
                    <span v-if="selected" :class="[active ? 'text-white' : 'text-indigo-600', 'absolute inset-y-0 right-0 flex items-center pr-4']">
                      <CheckIcon class="size-5" aria-hidden="true" />
                    </span>
                  </li>
                </ListboxOption>
              </ListboxOptions>
            </transition>
          </div>
          <p class="mt-2 text-sm text-gray-500">{{ selected.description }}</p>
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

    <div class="mt-4">
      <div class="flex items-center">
        <button 
          @click="toggleChatMode" 
          class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
          :class="[isMultiTurn ? 'bg-indigo-600' : 'bg-gray-200']"
        >
          <span 
            class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
            :class="[isMultiTurn ? 'translate-x-5' : 'translate-x-0']"
          />
        </button>
        <span class="ml-3 text-sm font-medium text-gray-900">
          {{ isMultiTurn ? 'Multi-turn Chat' : 'Single-turn QA' }}
        </span>
      </div>
      <p class="mt-1 text-sm text-gray-500">
        {{ isMultiTurn ? 'Bot will remember conversation context' : 'Each question is independent' }}
      </p>
    </div>

    <div class="mt-4 bg-gray-50 sm:rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold text-gray-900">Model Settings</h3>
          <button 
            @click="isSettingsOpen = !isSettingsOpen"
            class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            {{ isSettingsOpen ? 'Hide Settings' : 'Show Settings' }}
          </button>
        </div>
        
        <div v-if="isSettingsOpen" class="mt-4 space-y-4">
          <!-- Temperature Slider -->
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Temperature: {{ modelSettings.temperature }}
            </label>
            <input 
              type="range" 
              v-model="modelSettings.temperature" 
              min="0" 
              max="2" 
              step="0.1"
              class="w-full mt-1"
            >
            <p class="mt-1 text-sm text-gray-500">
              Controls randomness: 0 is focused, 2 is more creative
            </p>
          </div>

          <!-- Max Tokens Input -->
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Max Tokens
            </label>
            <input 
              type="number" 
              v-model="modelSettings.maxTokens" 
              min="1" 
              max="4000"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
            <p class="mt-1 text-sm text-gray-500">
              Maximum length of the response
            </p>
          </div>

          <!-- System Message Input -->
          <div>
            <label class="block text-sm font-medium text-gray-700">
              System Message
            </label>
            <textarea 
              v-model="modelSettings.systemMessage" 
              rows="3"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            ></textarea>
            <p class="mt-1 text-sm text-gray-500">
              Define the AI's behavior and role
            </p>
          </div>

          <!-- Finetune Settings -->
          <div class="border-t pt-4 mt-4">
            <h4 class="text-sm font-medium text-gray-900 mb-4">Model Fine-tuning</h4>
            
            <!-- Dataset Selection -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700">
                Dataset
              </label>
              <select 
                v-model="finetuneSettings.selectedDataset"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Select a dataset</option>
                <option v-for="dataset in datasets" :key="dataset.id" :value="dataset.id">
                  {{ dataset.name }}
                </option>
              </select>
            </div>

            <!-- Base Model Selection -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700">
                Base Model
              </label>
              <select 
                v-model="finetuneSettings.selectedBaseModel"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Select a base model</option>
                <option v-for="model in baseModels" :key="model.id" :value="model.id">
                  {{ model.name }}
                </option>
              </select>
            </div>

            <!-- Finetune Button -->
            <div class="flex justify-end">
              <button 
                @click="startFinetune"
                :disabled="!canStartFinetune"
                class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Start Fine-tuning
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
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
  // Official Models
  { 
    id: 1, 
    name: 'GPT35',
    description: 'General purpose chat model with broad knowledge',
    type: 'text'
  },
  { 
    id: 2, 
    name: 'GPT4',
    description: 'Most capable GPT-4 model for general tasks',
    type: 'text'
  },
  { 
    id: 3, 
    name: 'GPT4_MINI',
    description: 'Smaller, faster version of GPT-4',
    type: 'text'
  },
  { 
    id: 4, 
    name: 'DALLE3',
    description: 'Advanced image generation model',
    type: 'image'
  },
  // Custom Models
  { 
    id: 5, 
    name: 'TRANSLATOR',
    description: 'Specialized in language translation',
    type: 'text',
    custom: true
  },
  { 
    id: 6, 
    name: 'MATH_SOLVER',
    description: 'Specialized in solving mathematical problems',
    type: 'text',
    custom: true
  },
  { 
    id: 7, 
    name: 'testBOT',
    description: 'Specialized in bots',
    type: 'text',
    custom: true
  }
]
const selected = ref(models[0])

const text = ref('')
const uploadedImageUrl = ref('')
const messageHistory = ref([])
const chatContainer = ref(null)
const fileInput = ref(null)
const sessionId = ref(null)
const currentUserId = ref(null)

const store = useStore()

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
          // 修改映射逻辑，每条消息创建一对人类和机器人的消息
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
      // 清空天记录
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
  
}
const formatMessages = (text, imageUrl) => {
  let messages = []
  
  // If multi-turn mode is enabled, include chat history
  if (isMultiTurn.value) {
    const contextMessages = messageHistory.value.slice(-8).map(msg => {
      // 如果消息内容是数组（包含图片），保持原样
      if (Array.isArray(msg.content)) {
        return {
          role: msg.type === 'human' ? 'user' : 'assistant',
          content: msg.content
        }
      }
      return {
        role: msg.type === 'human' ? 'user' : 'assistant',
        content: msg.content
      }
    })
    messages.push(...contextMessages)
  }
  
  // Add current message
  if (text) {
    if (imageUrl) {
      messages.push({
        role: 'user',
        content: [
          {
            type: 'text',
            text: text
          },
          {
            type: 'image_url',
            image_url: {
              url: imageUrl,  // 现在这里直接是base64数据
              detail: 'auto'
            }
          }
        ]
      })
    } else {
      messages.push({
        role: 'user',
        content: text
      })
    }
  }

  console.log('Formatted messages:', JSON.stringify(messages, null, 2))
  return messages
}
const clearChatHistory = async () => {
  if (!store.state.currentSessionId) return;
  
  try {
    await axios.delete(`/api/chat/${store.state.currentSessionId}/history`)
    
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

// 添加 WebSocket 相关的代码
const socket = ref(null)

// 修改 sendMsg 方法
const sendMsg = async () => {
  if (!text.value || !store.state.currentSessionId) {
    return
  }

  const userMessage = text.value
  addMessage('human', userMessage)
  addMessage('bot', '', true)
  
  let currentContent = ''
  
  try {
    // 当 id > 6 时使用 WebSocket
    if (selected.value.id > 6) {
      // 创建新的 WebSocket 连接
      socket.value = new WebSocket('ws://localhost:8000/ws')
      
      // 等待连接建立
      await new Promise((resolve, reject) => {
        socket.value.onopen = () => {
          console.log('WebSocket connected')
          resolve()
        }
        socket.value.onerror = (error) => {
          console.error('WebSocket connection error:', error)
          reject(error)
        }
      })

      // 等待接收响应
      const response = await new Promise((resolve, reject) => {
        socket.value.onmessage = (event) => {
          const response = JSON.parse(event.data)
          resolve(response)
        }
        socket.value.onerror = (error) => {
          reject(error)
        }
      })

      // 发送消息
      const msgObj = {
        content: text.value,
        
      }
      socket.value.send(JSON.stringify(msgObj))

      // 处理响应
      updateLastBotMessage(response.content, false)

      // 关闭连接
      socket.value.close()
      socket.value = null

    } else {
      // 使用原来的方法
      const chatService = new ChatService(selected.value.name)
      chatService.setSettings({
        temperature: modelSettings.value.temperature,
        maxTokens: modelSettings.value.maxTokens,
        systemMessage: modelSettings.value.systemMessage
      })
      
      // 根据模型类型处理消息
      if (selected.value.type === 'image') {
        const imageUrl = await chatService.handleImageGeneration(text.value);
        currentContent = imageUrl;
        updateLastBotMessage(currentContent, false);
      } else {
        const messages = formatMessages(text.value, uploadedImageUrl.value)
        for await (const chunk of chatService.streamMessage(messages, (content) => {
          currentContent += content
          updateLastBotMessage(currentContent, true)
        })) {
          continue;
        }
      }

      await saveChatInteraction({
        request: userMessage,
        response: currentContent
      })
      updateLastBotMessage(currentContent, false)
    }
  } catch (error) {
    console.error('Error with API:', error)
    updateLastBotMessage('Sorry, I couldn\'t process that request.', false)
    // 确保在发生错误时也关闭 WebSocket
    if (socket.value) {
      socket.value.close()
      socket.value = null
    }
  }

  text.value = ''
  uploadedImageUrl.value = ''
}

// File upload handling
const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  try {
    // 读取文件为base64
    const base64Data = await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
    
    uploadedImageUrl.value = base64Data
    console.log('Image converted to base64 successfully')
    
    // 可选：添加提示信息
    text.value = text.value || 'What is in this image?'
  } catch (error) {
    console.error('Error processing image:', error)
    alert('Failed to process image. Please try again.')
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
    const response = await axios.post('/api/chat/interaction', {
      sessionId: store.state.currentSessionId,
      userId: currentUserId.value,
      botId: selected.value.id,
      interactionReq: interaction.request,
      interactionRes: interaction.response
    })
    
    // 更新 store 中的 tokens（假设响应中包含了更新后的 tokens）
    if (response.data.remainingTokens) {
      store.commit('updateUserTokens', response.data.remainingTokens)
    }
  } catch (error) {
    if (error.response?.status === 402) {  // Payment Required
      alert('Insufficient tokens. Please recharge.')
    } else {
      console.error('Error saving chat interaction:', error.response?.data || error.message)
      alert('Failed to save chat interaction. Please try again.')
    }
    throw error  // 重新抛出错误，让调用者知道保存失败
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

const isMultiTurn = ref(true)
const toggleChatMode = () => {
  isMultiTurn.value = !isMultiTurn.value
}

const getDisplayName = (modelName) => {
  const nameMap = {
    'GPT35': 'GPT3.5-turbo',
    'GPT4': 'GPT4-turbo',
    'GPT4_MINI': 'GPT4-mini',
    'DALLE3': 'DALL-E 3',
    'TRANSLATOR': 'Translator',
    'MATH_SOLVER': 'Math Solver'
  }
  return nameMap[modelName] || modelName
}

const isSettingsOpen = ref(false)
const modelSettings = ref({
  temperature: 0.7,
  maxTokens: 2000,
  systemMessage: "You are a helpful assistant."
})

// 监听模型变化，更新系统消息
watch(selected, (newModel) => {
  if (newModel.systemPrompt) {
    modelSettings.value.systemMessage = newModel.systemPrompt
  }
})

// 数据集选项
const datasets = ref([
  { id: 'dataset1', name: 'Customer Service Dataset' },
  { id: 'dataset2', name: 'Technical Documentation Dataset' },
  { id: 'dataset3', name: 'Medical Conversation Dataset' },
  { id: 'dataset4', name: 'Legal Document Dataset' }
])

// 基础模型选项
const baseModels = ref([
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
  { id: 'gpt-4', name: 'GPT-4' },
  { id: 'davinci', name: 'Davinci' },
  { id: 'curie', name: 'Curie' }
])

// 微调设置
const finetuneSettings = ref({
  selectedDataset: '',
  selectedBaseModel: ''
})

// 检查是否可以开始微调
const canStartFinetune = computed(() => {
  return finetuneSettings.value.selectedDataset && 
         finetuneSettings.value.selectedBaseModel
})

// 开始微调的方法
const startFinetune = async () => {
  if (!canStartFinetune.value) return

  try {
    console.log('Starting fine-tuning with settings:', {
      dataset: finetuneSettings.value.selectedDataset,
      baseModel: finetuneSettings.value.selectedBaseModel
    })
    
    // TODO: 实现实际的微调逻辑
    // 可以在这里添加与后端的通信代码
    
    // 示例：
    // const response = await axios.post('/api/finetune', {
    //   datasetId: finetuneSettings.value.selectedDataset,
    //   baseModelId: finetuneSettings.value.selectedBaseModel
    // })
    
    // 成功提示
    alert('Fine-tuning started successfully!')
  } catch (error) {
    console.error('Error starting fine-tuning:', error)
    alert('Failed to start fine-tuning. Please try again.')
  }
}

// 可选：监听设置变化
watch(finetuneSettings, (newSettings) => {
  console.log('Fine-tune settings changed:', newSettings)
}, { deep: true })
</script>
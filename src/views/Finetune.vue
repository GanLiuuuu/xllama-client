<template>
  <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img 
        style="cursor: pointer;" 
        @click="goToMainPage" 
        class="mx-auto h-10 w-auto" 
        src="/src/assets/image.png" 
        alt="XLLAMA" 
      />
      <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
        Fine-tune Your Model
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-lg">
      <form class="space-y-6" @submit.prevent="handleSubmit">
        <!-- Dataset Selection -->
        <div>
          <label for="dataset" class="block text-sm/6 font-bold text-white">Dataset</label>
          <div class="mt-2">
            <select
              id="dataset"
              v-model="finetuneSettings.selectedDataset"
              required
              class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm/6"
            >
              <option value="">Select a dataset</option>
              <option v-for="dataset in datasets" :key="dataset.id" :value="dataset.id">
                {{ dataset.name }}
              </option>
            </select>
          </div>
          <p class="mt-2 text-sm text-gray-400">Choose the dataset for fine-tuning your model</p>
        </div>

        <!-- Base Model Selection -->
        <div>
          <label for="baseModel" class="block text-sm/6 font-bold text-white">Base Model</label>
          <div class="mt-2">
            <select
              id="baseModel"
              v-model="finetuneSettings.selectedBaseModel"
              required
              class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm/6"
            >
              <option value="">Select a base model</option>
              <option v-for="model in baseModels" :key="model.id" :value="model.id">
                {{ model.name }}
              </option>
            </select>
          </div>
          <p class="mt-2 text-sm text-gray-400">Select the base model to fine-tune</p>
        </div>

        <!-- Submit Button -->
        <div>
          <button
            type="submit"
            :disabled="isSubmitting"
            :class="{
              'flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2': true,
              'bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600': !isSubmitting,
              'bg-gray-400 cursor-not-allowed': isSubmitting
            }"
          >
            <span v-if="isSubmitting" class="absolute ml-40 w-5 h-5 border-4 border-t-transparent border-blue-600 rounded-full animate-spin"></span>
            {{ isSubmitting ? 'Processing...' : 'Start Fine-tuning' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import Swal from 'sweetalert2'

const router = useRouter()
const store = useStore()

// 数据集选项
const datasets = [
  { id: 'english_quotes', name: 'English Quotes Dataset' },
  { id: 'meme_typer', name: 'Meme Typer Dataset' }
]

// 基础模型选项
const baseModels = [
  { id: 'gemma-2-2b', name: 'Gemma 2' },
  { id: 'llama-3-2-1B', name: 'Llama 3.2' }
]

const finetuneSettings = ref({
  selectedDataset: '',
  selectedBaseModel: ''
})

const isSubmitting = ref(false)
const socket = ref(null)

const goToMainPage = () => {
  router.push('/Home')
}

const handleSubmit = async () => {
  if (isSubmitting.value) return
  
  isSubmitting.value = true
  
  try {
    // 创建WebSocket连接
    
    socket.value = new WebSocket('ws://localhost:8080')
    
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

    // 发送微调请求
    const msgObj = {
      type: "finetune",
      value: {
        id: "Finetuned", //TODO
        base: finetuneSettings.value.selectedBaseModel,
        dataset: finetuneSettings.value.selectedDataset,
        steps: 2, //TODO
      }
    }
    
    socket.value.send(JSON.stringify(msgObj))
    
    // 等待接收响应
    const response = await new Promise((resolve, reject) => {
      socket.value.onmessage = (event) => {
        const data = JSON.parse(event.data)
        resolve(data)
      }
      socket.value.onerror = (error) => {
        reject(error)
      }
    })
    
    // 存储lora路径到vuex
    // store.commit('setLora', response.value.lora) // no need
    // all info will be processed by llm server
    
    // 显示成功消息
    await Swal.fire({
      title: 'Success!',
      text: 'Model fine-tuning completed successfully!',
      icon: 'success',
      confirmButtonText: 'OK'
    })
    
    // 返回主页
    router.push('/')
    
  } catch (error) {
    console.error('Fine-tuning error:', error)
    Swal.fire({
      title: 'Error',
      text: 'Failed to fine-tune the model. Please try again.',
      icon: 'error',
      confirmButtonText: 'OK'
    })
  } finally {
    if (socket.value) {
      socket.value.close()
      socket.value = null
    }
    isSubmitting.value = false
  }
}
</script>

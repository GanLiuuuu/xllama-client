<template>
    <header>
      <!-- Conditional Rendering for Users -->
      <div class="mt-4">
        <ul class="space-y-2">
          <li v-for="bot in bots" :key="bot.username" class="text-gray-900" @click="openModal(bot)">
            <div class=" block px-4 bg-indigo-200 py-2 text-sm hover:bg-indigo-100 rounded-md">
              <img class="size-8 rounded-full bg-gray-800" :src="bot.avatarUrl" alt="机器人头像" />
              <p><strong>{{ bot.name }}</strong></p>
              <p><strong>Version:</strong> {{ bot.version }}</p>
              <p><strong>Price:</strong> {{ bot.price }}</p>
              <p><strong>Description:</strong> {{ bot.description }}</p>
              <p><strong>Highlight:</strong> {{ bot.highlight }}</p>
            </div>
          </li>
        </ul>
        <TransitionRoot as="template" :show="isShowBotModal">
          <Dialog class="relative z-18" @close="closePage">
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
              <div class="fixed inset-0 hidden bg-gray-500/75 transition-opacity md:block" />
            </TransitionChild>

            <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
              <div class="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
                <!-- This element is to trick the browser into centering the modal contents. -->
                <span class="hidden md:inline-block md:h-screen md:align-middle" aria-hidden="true">&#8203;</span>
                <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 md:translate-y-0 md:scale-95" enter-to="opacity-100 translate-y-0 md:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 md:scale-100" leave-to="opacity-0 translate-y-4 md:translate-y-0 md:scale-95">
                  <DialogPanel class="flex w-full transform text-left text-base transition md:my-8 md:max-w-2xl md:px-4 lg:max-w-2xl">
                    <bot-check_admin :bot-id="showBot.id" @close="isBotCheckVisible = false" />
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </Dialog>
        </TransitionRoot>
      </div>

    </header>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios'
  import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
  import BotCheck_admin from '../components/BotCheck_admin.vue';

  onMounted(async () => {
    // 在组件挂载时执行的逻辑
    try {
      const response = await axios.get('/bots/showall');
      temp_bots.value = response.data.filter(bot => bot.state === 'Offline'); // 过滤出 state 为 Offline 的 bot
      bots.value = temp_bots.value;
      console.log(temp_bots.value);
    } catch (error) {
      console.error('Error fetching bots:', error);
      //bots.value = [];
    }
  });

  const users = ref([]);
  const bots = ref([]);
  const temp_bots = ref([]);
  const showBot = ref(null); // 显示信息的bot
  const isShowBotModal = ref(false); // 显示bot信息的模态框
  const isBotCheckVisible = ref(true); // 控制显示的状态


  const openModal = (bot) => {
  showBot.value = bot
  isShowBotModal.value = true
  }
  function closePage(){
    isShowBotModal.value = false
    console.log(6666)
    searchBots()
    console.log(7777)
  }


  async function searchBots() {
    try {
      const response = await axios.get('/bots/showall');
      temp_bots.value = response.data.filter(bot => bot.state === 'Offline'); // 过滤出 state 为 Offline 的 bot
      bots.value = temp_bots.value;
      console.log(temp_bots.value);
    } catch (error) {
      console.error('Error fetching bots:', error);
      //bots.value = [];
    }
  }
    
  users.value = [];
  temp_bots.value =[]
  </script>


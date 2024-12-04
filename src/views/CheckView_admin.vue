<template>
    <header>
      <!-- Conditional Rendering for Users -->
      <div class="mt-6">
        <ul class="divide-y divide-indigo-800">
          <li v-for="bot in bots" :key="bot.username" class="bg-indigo-900 text-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 py-4 cursor-pointer" @click="openModal(bot)">
            <div class="flex items-center px-6 py-4 hover:bg-indigo-800 rounded-lg transition-all duration-300" style="gap: 1.5rem;">
              <!-- 机器人头像 -->
              <img class="w-14 h-14 rounded-full bg-gray-700 border-4 border-indigo-400 shadow-sm hover:scale-105 transition-transform duration-300" :src="bot.avatarUrl" alt="机器人头像" style="max-width: 56px; max-height: 56px; object-fit: cover;"/>
              <!-- 机器人信息 -->
              <div class="text-sm leading-tight space-y-2">
                <!-- 机器人名称 -->
                <p class="font-bold text-xl text-white flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.75L14.25 9 9.75 14.25"/>
                  </svg>
                  &nbsp;{{ bot.name }}
                </p>
                <!-- 机器人版本 -->
                <div class="flex items-center text-indigo-300">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
                  </svg>
                  &nbsp;<strong>Version：</strong> {{ bot.version }}
                </div>
                <!-- 机器人价格 -->
                <div class="flex items-center text-indigo-300">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-4.418 0-8 3.582-8 8h16c0-4.418-3.582-8-8-8zM6 6h12v1H6z"/>
                  </svg>
                  &nbsp;<strong>Price：</strong> {{ bot.price }}
                </div>
                <!-- 机器人描述 -->
                <p class="text-gray-400 text-sm border-t border-indigo-800 pt-2 flex items-center hover:text-gray-200 transition-colors duration-200" :title="bot.description">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 7h16M4 12h16M4 17h16"/>
                  </svg>
                  &nbsp;<strong>Description：</strong>{{ bot.description }}
                </p>
                <!-- 机器人亮点 -->
                <p class="text-gray-400 text-sm border-t border-indigo-800 pt-2 flex items-center hover:text-gray-200 transition-colors duration-200" :title="bot.highlight">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 6v-6m0-6H6m6 0h6"/>
                  </svg>
                  &nbsp;<strong>Highlight：</strong>{{ bot.highlight }}
                </p>
              </div>
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


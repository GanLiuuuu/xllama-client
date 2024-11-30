<template>
    <header>
      <div>
        <label for="search" class="block text-sm/6 font-medium text-gray-900">Quick search</label>
        <div class="relative mt-2 flex items-center">
          <input v-model="searchQuery" type="text" name="search" id="search" @keyup.enter="search" class="block w-full rounded-md border-0 py-1.5 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6" />
          <button @click="search" class="mt-3 inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:ml-3 sm:mt-0 sm:w-auto">Search</button>
        </div>
      </div>
  
      <!-- Secondary navigation -->
      <nav class="flex overflow-x-auto border-b border-white/10 py-4">
        <ul role="list" class="flex min-w-full flex-none gap-x-6 px-4 text-sm/6 font-semibold text-gray-400 sm:px-6 lg:px-8">
          <li v-for="item in secondary" :key="item.name">
            <a @click="select(item)" :href="item.href" :class="item.current ? 'text-indigo-400' : ''">{{ item.name }}</a>
          </li>
        </ul>
      </nav>
                
      <!-- Conditional Rendering for Users -->
      <div v-if="currentN === 'User'" class="mt-4">
        <ul class="space-y-2">
          <li v-for="user in users" :key="user.email" class="text-gray-900">
            <router-link 
              :to="`/user/${encodeURIComponent(user.email)}`" 
              class="block px-4 bg-indigo-200 py-2 text-sm hover:bg-indigo-100 rounded-md"
            >
              <div>
                <img class="size-8 rounded-full bg-gray-800" :src="user.avatarUrl" alt="用户头像" />
                <p><strong>{{ user.username }}</strong></p>
                <p>Email: {{ user.email }}</p>
                <p>{{ user.bio }}</p>
              </div>
            </router-link>
          </li>
        </ul>
      </div>

      <!-- Conditional Rendering for Bots -->
      <div v-if="currentN === 'Bot'" class="mt-4">
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
          <Dialog class="relative z-10" @close="isShowBotModal = false">
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
              <div class="fixed inset-0 hidden bg-gray-500/75 transition-opacity md:block" />
            </TransitionChild>

            <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
              <div class="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
                <!-- This element is to trick the browser into centering the modal contents. -->
                <span class="hidden md:inline-block md:h-screen md:align-middle" aria-hidden="true">&#8203;</span>
                <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 md:translate-y-0 md:scale-95" enter-to="opacity-100 translate-y-0 md:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 md:scale-100" leave-to="opacity-0 translate-y-4 md:translate-y-0 md:scale-95">
                  <DialogPanel class="flex w-full transform text-left text-base transition md:my-8 md:max-w-2xl md:px-4 lg:max-w-2xl">
                    <button type="button" class="absolute right-4 top-4 text-gray-400 hover:text-gray-500 sm:right-6 sm:top-8 md:right-6 md:top-6 lg:right-8 lg:top-8 focus:outline-none" @click="isShowBotModal = false">
                      <XMarkIcon class="size-6" aria-hidden="true" />
                    </button>
                    <BotDetail :botId = "showBot.id"/>
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
  import { ref } from 'vue'
  import axios from 'axios'
  import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
  import { XMarkIcon } from '@heroicons/vue/20/solid'
  import BotDetail from '../components/BotDetail.vue';
  import Fuse from 'fuse.js';

  const options = {
    keys: ['name', 'description', 'highlight'],  // 配置需要匹配的字段
    threshold: 0.5,  // 设置模糊匹配的敏感
  };

  const fuse = ref(null);
  const searchResults = ref([]);

  const users = ref([]);
  const bots = ref([]);
  const temp_bots = ref([]);
  const showBot = ref(null); // 显示信息的bot
  const isShowBotModal = ref(false); // 显示bot信息的模态框
  
  const currentN = ref('User');
  const secondary = [
    { name: 'User', href: '#', current: true },
    { name: 'Bot', href: '#', current: false }
  ]
  
  const searchQuery = ref(''); 

  const openModal = (bot) => {
  showBot.value = bot
  isShowBotModal.value = true
  }

  function select(item) {
    secondary.forEach(item1 => {
      item1.current = false;
    });
    currentN.value = item.name; 
    item.current = true;
    search();
  }
  
  function search() {
    if(currentN.value === 'User')
      searchUsers();
    else
      searchBots();
  }

  async function searchUsers() {
    try {
      const response = await axios.get('/user/searchUsers', {
        params: { username: searchQuery.value.trim() }
      });
      users.value = response.data; 
    } catch (error) {
      console.error('Error fetching users:', error);
      // users.value = [];
    }
  }

  async function searchBots() {
    try {
      const response = await axios.get('/bots/showall');
      temp_bots.value = response.data;
    } catch (error) {
      console.error('Error fetching bots:', error);
      //bots.value = [];
    }
    if(searchQuery.value.trim() === '') {
      bots.value = temp_bots.value;
      return;
    }
    fuse.value = new Fuse(temp_bots.value, options);
    bots.value = fuse.value.search(searchQuery.value.trim()).map(result => result.item);
    // console.log(bots.value);
    // console.log(searchQuery.value.trim());
    // fuse.value = new Fuse(temp_bots.value, options);
    // bots.value = fuse.value.search(searchQuery.value.trim()).map(result => result.item);
    // console.log(bots.value);
  }
    
  users.value = [
    { username: 'Username1', email: "user1@example.com", avatarUrl: "http://localhost:8081/avatars/user1.jpg", bio: "Hello!" },
    { username: 'Username2', email: "user2@example.com", avatarUrl: "http://localhost:8081/avatars/user2.jpg", bio: "Nice to meet you" },
  ];
  
  temp_bots.value =[
    {
      id: 1,
      name: 'Xbot_007',
      version: '1.0',
      views: '123',
      createdAt: '2022-12-13',
      price: '2,000.00',
      state: 'Online',
      description: 'This is a chatbot that can help you with your daily tasks.',
      highlight: 'It is very easy to use and can be customized to suit your needs; it is also very affordable; it is very reliable and can be used for a long time.',
    },
    {
      id: 2,
      name: 'Chat_GPT4',
      version: '1.0',
      views: '456',
      createdAt: '2023-01-22',
      price: '14,000.00', 
      state: 'Offline',
      description: 'This is a bot that can help you deal with complex problems.',
      highlight: 'It is very powerful and can be used for a long time; it is also very reliable and can be used for a long time.',
    },
    {
      id: 3,
      name: 'Llama',
      version: '1.0',
      views: '789',
      createdAt:'2023-01-23',
      price: '7,600.00', 
      state: 'Online',
      description: 'This is a bot help you with many calculations.',
      highlight: 'It can help calculate many things; it is very reliable and can be used for a long time.',
    },
  ]
  </script>
  
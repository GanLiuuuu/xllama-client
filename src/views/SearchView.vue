<template>
    <header>
      <div>
        <label for="search" class="block text-sm/6 font-medium text-gray-900">Quick search</label>
        <div class="relative mt-2 flex items-center">
          <input v-model="searchQuery" type="text" name="search" id="search" class="block w-full rounded-md border-0 py-1.5 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6" />
          <button @click="searchUsers" class="mt-3 inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:ml-3 sm:mt-0 sm:w-auto">Search</button>
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
                <img class="size-8 rounded-full bg-gray-800" :src="user.avatar_url" alt="用户头像" />
                <p><strong>{{ user.username }}</strong></p>
                <p>Email: {{ user.email }}</p>
                <p>{{ user.bio }}</p>
              </div>
            </router-link>
          </li>
        </ul>
      </div>
    </header>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import axios from 'axios'
  
  const currentN = ref('User');
  const secondary = [
    { name: 'User', href: '#', current: true },
    { name: 'Bot', href: '#', current: false }
  ]
  
  const searchQuery = ref(''); 
  
  function select(item) {
    secondary.forEach(item1 => {
      item1.current = false;
    });
    currentN.value = item.name; 
    item.current = true;
  }
  
  async function searchUsers() {
    if (!searchQuery.value.trim()) {
      console.error("Search query cannot be empty");
      return;
    }
  
    try {
      const response = await axios.get('/user/searchUsers', {
        params: { username: searchQuery.value.trim() }
      });
      users.value = response.data; 
    } catch (error) {
      console.error('Error fetching users:', error);
      users.value = [];
    }
  }
  
  const users = ref([]);
  
  users.value = [
    { username: 'Username1', email: "user1@example.com", avatar_url: "http://localhost:8081/avatars/user1.jpg", bio: "Hello!" },
    { username: 'Username2', email: "user2@example.com", avatar_url: "http://localhost:8081/avatars/user2.jpg", bio: "Nice to meet you" },
  ];
  </script>
  
<template>
    <div class="user-home">
      <h1 class="text-xl font-semibold text-gray-900">Welcome to {{ email }}'s Home</h1>
      <div v-if="user" class="mt-4">
        <img :src="user.avatar_url" alt="User Avatar" class="w-24 h-24 rounded-full shadow-md" />
        <h2 class="text-lg font-bold mt-2">{{ user.username }}</h2>
        <p>Email: {{ user.email }}</p>
        <p>{{ user.bio }}</p>
      </div>
      <p v-else>Loading user data...</p>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  const props = defineProps({
    email: String, // 从动态路由中接收邮箱
  });
  
  const user = ref(null); // 存储用户数据
  
  // 获取用户信息
  async function fetchUser() {
    try {
      const response = await axios.get(`/user/details`, { params: { email: props.email } });
      user.value = response.data;
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  }
  
  onMounted(() => {
    alert(`Email received: ${props.email}`); // Alert 显示邮箱
    fetchUser();
  });
  </script>
  
  <style scoped>
  .user-home {
    padding: 20px;
  }
  </style>
  
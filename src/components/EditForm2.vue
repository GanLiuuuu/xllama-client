<template>
    <div v-if="user" class="space-y-12">
      <div class="border-b border-white/10 pb-12">
        <!-- profile -->
        <h2 class="text-base/7 font-semibold text-white">Profile</h2>
        <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <!-- Username Display -->
          <div class="sm:col-span-4">
            <label class="block text-sm/6 font-medium text-white">Username</label>
            <div class="mt-2">
              <div class="flex h-12 items-center rounded-md bg-white/5 ring-1 ring-inset ring-white/10 px-3 sm:text-sm/6">
                <span class="text-gray-500 select-none">workcation.com/</span>
                <span class="ml-1 text-white truncate">{{ user.username }}</span>
              </div>
            </div>
          </div>

          <!-- About Display -->
          <div class="col-span-full">
            <label class="block text-sm/6 font-medium text-white">About</label>
            <div class="mt-2">
              <div class="flex h-20 w-full rounded-md border-0 bg-white/5 py-2 px-3 text-white shadow-sm ring-1 ring-inset ring-white/10 sm:text-sm/6">
                {{ user.about }}
              </div>
            </div>
          </div>

          <!-- Photo Display -->
          <div class="col-span-full">
            <label class="block text-sm/6 font-medium text-white">Photo</label>
            <div class="mt-2 flex items-center gap-x-3">
              <img class="size-10 rounded-full bg-gray-800" :src="user.avatarUrl" alt="用户头像" />
            </div>
          </div>

          <!-- Cover Photo Display -->
          <div class="col-span-full">
            <label class="block text-sm/6 font-medium text-white">Cover photo</label>
            <div class="mt-2 flex justify-center rounded-lg border border-dashed border-white/25 px-6 py-10">
              <div class="text-center">
                <div class="mb-4">
                  <img :src="user.coverPhoto" alt="Cover photo preview" class="preview-image" />
                </div>
              </div>
            </div>
          </div>

          <!-- First Name Display -->
          <div class="sm:col-span-3">
            <label class="block text-sm/6 font-medium text-white">First name</label>
            <div class="mt-2">
              <div class="h-12 flex items-center rounded-md bg-white/5 px-3 text-white shadow-sm ring-1 ring-inset ring-white/10 sm:text-sm/6">
                {{ user.firstname }}
              </div>
            </div>
          </div>

          <!-- Last Name Display -->
          <div class="sm:col-span-3">
            <label class="block text-sm/6 font-medium text-white">Last name</label>
            <div class="mt-2">
              <div class="h-12 flex items-center rounded-md bg-white/5 px-3 text-white shadow-sm ring-1 ring-inset ring-white/10 sm:text-sm/6">
                {{ user.lastname }}
              </div>
            </div>
          </div>

          <!-- Email Display -->
          <div class="sm:col-span-4">
            <label class="block text-sm/6 font-medium text-white">Email address</label>
            <div class="mt-2">
              <div class="h-12 flex items-center rounded-md bg-white/5 px-3 text-white shadow-sm ring-1 ring-inset ring-white/10 sm:text-sm/6">
                {{ user.email }}
              </div>
            </div>
          </div>

          <!-- Country Display -->
          <div class="sm:col-span-3">
            <label class="block text-sm/6 font-medium text-white">Country</label>
            <div class="mt-2">
              <div class="h-12 flex items-center rounded-md bg-white/5 px-3 text-white shadow-sm ring-1 ring-inset ring-white/10 sm:text-sm/6">
                {{ user.country }}
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>


</template>

<script setup>
import {onMounted, reactive, ref} from 'vue';
import { PhotoIcon, UserCircleIcon } from '@heroicons/vue/24/solid'
import axios from "axios";
const user = ref(null); // 存储用户数据
const props = defineProps({
  email: String, // 从父组件或动态路由中接收邮箱
});

async function fetchUser() {
  try {
    const response = await axios.get(`/user/details`, { params: { email: props.email } });
    console.log("Fetched user data:", response.data); // 调试信息
    user.value = response.data; // 更新用户数据
  } catch (error) {
    console.error('Failed to fetch user data:', error);
  }
}

const EditInfo = reactive({
  username: '',
  about: '',
  firstName: '',
  lastName: '',
  emailAddress: '',
  country: '',
  coverPhoto: null, // 存储上传的文件
  coverPhotoPreview: null, // 存储图片预览的 URL
  photo: null,
  photoPreview: null,
});
onMounted(() => {
  if (props.email) {
    console.log(`Fetching data for email: ${props.email}`); // 调试信息
    fetchUser();
  } else {
    console.error('Email prop is missing.');
  }
});
</script>

<script>
export default {
  // computed: {
  //   user() {
  //     return this.$store.state.user;
  //   }
  // },
}
</script>


<style scoped>
.preview-image {
  width: 400px;
  height: 150px;
  border-radius: 10px;
  object-fit: cover;
  display: block;
  margin: 0 auto;
}
</style>
<template>
    <div class="space-y-12">
      <div class="border-b border-white/10 pb-12">
        <!-- profile -->
        <h2 class="text-base/7 font-semibold text-white">Profile</h2>

        <!-- Username input -->
        <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div class="sm:col-span-4">
            <label for="username" class="block text-sm/6 font-medium text-white">Username</label>
              <div class="flex items-center justify-center h-screen bg-gray-900">
                <label class="w-full max-w-md px-4 py-2 text-gray-400 bg-gray-800 rounded-lg border border-gray-700 text-sm tracking-wide">
                  {{ user.username }}
                </label>
              </div>
          </div>

          <!-- About input -->
          <div class="col-span-full">
            <label for="about" class="block text-sm/6 font-medium text-white">About</label>
            <div class="flex items-center justify-center h-screen bg-gray-900">
              <label class="w-full max-w-md px-4 py-2 text-gray-400 bg-gray-800 rounded-lg border border-gray-700 text-sm tracking-wide">
                {{ user.about }}
              </label>
            </div>
            <p class="mt-3 text-sm/6 text-gray-400">Write a few sentences about yourself.</p>
          </div>

          <!-- Photo input -->
          <div class="col-span-full">
            <label for="photo" class="block text-sm/6 font-medium text-white">Photo</label>
            <div class="mt-2 flex items-center gap-x-3">
              <img v-if="EditInfo.photoPreview === null" class="size-10 rounded-full bg-gray-800" :src=user.avatarUrl alt="用户头像" />
              <img v-if="EditInfo.photoPreview !== null" class="size-10 rounded-full bg-gray-800" :src=EditInfo.photoPreview alt="用户头像" />
            </div>
          </div>

          <!-- Cover photo input -->
          <div class="col-span-full">
            <label for="cover-photo" class="block text-sm/6 font-medium text-white">Cover photo</label>
            <div class="mt-2 flex justify-center rounded-lg border border-dashed border-white/25 px-6 py-10">


              <div class="text-center">
                <!-- 图片预览 -->
                <div v-if="user.coverPhoto" class="mb-4">
                  <img
                      :src="user.coverPhoto"
                      alt="Cover photo preview"
                      class="preview-image"
                  />
                </div>
                <PhotoIcon v-if="!user.coverPhoto" class="mx-auto size-12 text-gray-500" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Personal Information -->
      <div class="border-b border-white/10 pb-12">
        <h2 class="text-base/7 font-semibold text-white">Personal Information</h2>
        <p class="mt-1 text-sm/6 text-gray-400">Use a permanent address where you can receive mail.</p>

        <!-- First name input -->
        <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div class="sm:col-span-3">
            <label for="first-name" class="block text-sm/6 font-medium text-white">First name</label>
            <div class="flex items-center justify-center h-screen bg-gray-900">
              <label class="w-full max-w-md px-4 py-2 text-gray-400 bg-gray-800 rounded-lg border border-gray-700 text-sm tracking-wide">
                {{ user.firstname }}
              </label>
            </div>
          </div>

          <!-- Last name input -->
          <div class="sm:col-span-3">
            <label for="last-name" class="block text-sm/6 font-medium text-white">Last name</label>
            <div class="flex items-center justify-center h-screen bg-gray-900">
              <label class="w-full max-w-md px-4 py-2 text-gray-400 bg-gray-800 rounded-lg border border-gray-700 text-sm tracking-wide">
                {{ user.lastname }}
              </label>
            </div>
          </div>

          <!-- Email address input -->
          <div class="sm:col-span-4">
            <label for="email" class="block text-sm/6 font-medium text-white">Email address</label>
            <div class="flex items-center justify-center h-screen bg-gray-900">
              <label class="w-full max-w-md px-4 py-2 text-gray-400 bg-gray-800 rounded-lg border border-gray-700 text-sm tracking-wide">
                {{ user.email }}
              </label>
            </div>
          </div>

          <!-- Country input -->
          <div class="sm:col-span-3">
            <label for="country" class="block text-sm/6 font-medium text-white">Country</label>
            <div class="flex items-center justify-center h-screen bg-gray-900">
              <label class="w-full max-w-md px-4 py-2 text-gray-400 bg-gray-800 rounded-lg border border-gray-700 text-sm tracking-wide">
                {{ user.country }}
              </label>
            </div>

          </div>
        </div>
      </div>
    </div>


</template>

<script setup>
import { useStore } from 'vuex';
import {reactive, ref} from 'vue';
import { PhotoIcon, UserCircleIcon } from '@heroicons/vue/24/solid'
import axios from "axios";

const store = useStore();

const EditInfo = reactive({
  username: '',
  about: '',
  firstName: '',
  lastName: '',
  emailAddress: '',
  country: store.state.user.country,
  coverPhoto: null, // 存储上传的文件
  coverPhotoPreview: null, // 存储图片预览的 URL
  photo: null,
  photoPreview: null,
});


</script>

<script>
export default {
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
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
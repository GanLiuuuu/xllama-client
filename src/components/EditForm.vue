<template>
  <form>
    <div class="space-y-12">
      <div class="border-b border-white/10 pb-12">
        <!-- profile -->
        <h2 class="text-base/7 font-semibold text-white">Profile</h2>
        <p class="mt-1 text-sm/6 text-gray-400">This information will be displayed publicly so be careful what you share.</p>

        <!-- Username input -->
        <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div class="sm:col-span-4">
            <label for="username" class="block text-sm/6 font-medium text-white">Username</label>
            <div class="mt-2">
              <div class="flex rounded-md bg-white/5 ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500">
                <span class="flex select-none items-center pl-3 text-gray-500 sm:text-sm">workcation.com/</span>
                <input type="text" name="username" id="username" autocomplete="username" class="flex-1 border-0 bg-transparent py-1.5 pl-1 text-white focus:ring-0 sm:text-sm/6" v-model="EditInfo.username" :placeholder="user.username"/>
              </div>
            </div>
          </div>

          <!-- About input -->
          <div class="col-span-full">
            <label for="about" class="block text-sm/6 font-medium text-white">About</label>
            <div class="mt-2">
              <textarea id="about" name="about" rows="3"  v-model="EditInfo.about" :placeholder="user.about" class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm/6" />
            </div>
            <p class="mt-3 text-sm/6 text-gray-400">Write a few sentences about yourself.</p>
          </div>

          <!-- Photo input -->
          <div class="col-span-full">
            <label for="photo" class="block text-sm/6 font-medium text-white">Photo</label>
            <div class="mt-2 flex items-center gap-x-3">
              <img v-if="EditInfo.photoPreview === null" class="size-10 rounded-full bg-gray-800" :src=user.avatarUrl alt="用户头像" />
              <img v-if="EditInfo.photoPreview !== null" class="size-10 rounded-full bg-gray-800" :src=EditInfo.photoPreview alt="用户头像" />
              <button type="button" @click="triggerFileUpload" class="rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-white/20">Change</button>

              <input type="file" id="file-upload_photo"
                     class="hidden"
                     @change="handlePhotoUpload"
                     ref="fileInput"
              />

            </div>
          </div>

          <!-- Cover photo input -->
          <div class="col-span-full">
            <label for="cover-photo" class="block text-sm/6 font-medium text-white">Cover photo</label>
            <div class="mt-2 flex justify-center rounded-lg border border-dashed border-white/25 px-6 py-10">


              <div class="text-center">
                <!-- 图片预览 -->
                <div v-if="!EditInfo.coverPhotoPreview" class="mb-4">
                  <img
                      :src="user.coverPhoto"
                      alt="Cover photo preview"
                      class="preview-image"
                  />
                </div>

                <div v-if="EditInfo.coverPhotoPreview" class="mb-4">
                  <img
                      :src="EditInfo.coverPhotoPreview"
                      alt="Cover photo preview"
                      class="preview-image"
                  />
                </div>

                <PhotoIcon v-if="!EditInfo.coverPhotoPreview && !user.coverPhoto" class="mx-auto size-12 text-gray-500" aria-hidden="true" />
                <div class="mt-4 flex text-sm/6 text-gray-400">
                  <label for="file-upload" class="relative cursor-pointer rounded-md bg-gray-900 font-semibold text-white focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 hover:text-indigo-500">
                    <span>Upload a file</span>
                    <input id="file-upload" name="file-upload" type="file" @change="handleCoverPhotoUpload" class="sr-only" />
                  </label>
                  <p class="pl-1">or drag and drop</p>
                </div>
                <p class="text-xs/5 text-gray-400">PNG, JPG, GIF up to 10MB</p>
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
            <div class="mt-2">
              <input type="text" name="first-name" id="first-name" :placeholder="user.firstname" autocomplete="given-name" v-model="EditInfo.firstName" class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm/6" />
            </div>
          </div>

          <!-- Last name input -->
          <div class="sm:col-span-3">
            <label for="last-name" class="block text-sm/6 font-medium text-white">Last name</label>
            <div class="mt-2">
              <input type="text" name="last-name" id="last-name" :placeholder="user.lastname" autocomplete="family-name" v-model="EditInfo.lastName" class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm/6" />
            </div>
          </div>

          <!-- Email address input -->
          <div class="sm:col-span-4">
            <label for="email" class="block text-sm/6 font-medium text-white">Email address</label>
            <div class="mt-2">
              <input id="email" name="email" type="email" :placeholder="user.email" autocomplete="email" v-model="EditInfo.emailAddress" class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm/6" />
            </div>
          </div>

          <!-- Country input -->
          <div class="sm:col-span-3">
            <label for="country" class="block text-sm/6 font-medium text-white">Country</label>
            <div class="mt-2">
              <select id="country" name="country" autocomplete="country-name" v-model="EditInfo.country" class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm/6 [&_*]:text-black">
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="Mexico">Mexico</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Commands -->
    <div class="mt-6 flex items-center justify-end gap-x-6">
      <button type="button" @click="resetForm" class="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Cancel</button>
      <button type="submit" @click.prevent="saveForm" class="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Save</button>
    </div>


  </form>
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

function handleCoverPhotoUpload(event) {
  const file = event.target.files[0];
  if (!file) {
    alert('No file selected.');
    return;
  }
  if (!['image/png', 'image/jpeg', 'image/gif'].includes(file.type)) {
    alert('Only PNG, JPG, or GIF files are allowed.');
    return;
  }
  if (file.size > 10 * 1024 * 1024) {
    alert('File size exceeds the 10MB limit.');
    return;
  }

  EditInfo.coverPhoto = file;
  // 创建图片预览
  const reader = new FileReader();
  reader.onload = (e) => {
    EditInfo.coverPhotoPreview = e.target.result; // 预览 URL
  };
  reader.readAsDataURL(file);
}
function resetForm() {
  EditInfo.username = '';
  EditInfo.about = '';
  EditInfo.firstName = '';
  EditInfo.lastName = '';
  EditInfo.emailAddress = '';
  EditInfo.country = store.state.user.country;
  EditInfo.coverPhoto = null;
  EditInfo.coverPhotoPreview = null;
  EditInfo.photo = null;
  EditInfo.photoPreview = null;
}

async function saveForm() {
  try {
    const email = store.state.user.email; // 从 Vuex 获取 email
    const formData = new FormData();
    formData.append('email', email)
    if (EditInfo.username !== ''){
      formData.append('username', EditInfo.username);
    }
    if (EditInfo.about !== ''){
      formData.append('about', EditInfo.about);
    }
    if (EditInfo.emailAddress !== ''){
      formData.append('emailAddress', EditInfo.emailAddress);
    }
    if (EditInfo.firstName !== ''){
      formData.append('firstName', EditInfo.firstName);
    }
    if (EditInfo.lastName !== ''){
      formData.append('lastName', EditInfo.lastName);
    }
    if (EditInfo.emailAddress !== ''){
      formData.append('country', EditInfo.country);
    }
    if (EditInfo.coverPhoto) {
      formData.append('coverPhoto', EditInfo.coverPhoto); // 上传文件
    }
    if (EditInfo.photo) {
      formData.append('photo', EditInfo.photo); // 上传文件
    }
    if (EditInfo.country) {
      formData.append('country', EditInfo.country);
    }

    // 使用 Axios 发送 POST 请求
    const response = await axios.post('user/setInfo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Save successful:', response.data);
    alert('Save successful!');
  } catch (error) {
    console.error('Save failed:', error);
    alert('Save failed. Please try again.');
  } finally {
    window.location.reload();
  }
}

const fileInput = ref(null);
function triggerFileUpload() {
  fileInput.value.click(); // 触发文件选择器
}
function handlePhotoUpload(event) {
  const file = event.target.files[0];

  if (!file) {
    alert('No file selected.');
    return;
  }
  if (!['image/png', 'image/jpeg', 'image/gif'].includes(file.type)) {
    alert('Only PNG, JPG, or GIF files are allowed.');
    return;
  }
  if (file.size > 10 * 1024 * 1024) {
    alert('File size exceeds the 10MB limit.');
    return;
  }

  // 存储文件到 EditInfo
  EditInfo.photo = file;

  // 创建图片预览 URL
  const reader = new FileReader();
  reader.onload = (e) => {
    EditInfo.photoPreview = e.target.result; // 更新预览 URL
  };
  reader.readAsDataURL(file);
}

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
  width: 400px; /* 设置预览宽度 */
  height: 150px; /* 设置预览高度 */
  border-radius: 10px; /* 圆角 */
  object-fit: cover; /* 确保图片裁剪填充 */
  display: block;
  margin: 0 auto; /* 居中对齐 */
}
</style>
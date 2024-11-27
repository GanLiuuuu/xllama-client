<template>
  <div class="bg-transparent" style="padding: 40px;">
    <ul role="list" class="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8">
      <li v-for="bot in bots" :key="bot.id" class="overflow-hidden rounded-xl border border-gray-200 bg-black">
        <div class="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
          <div class="text-sm/6 font-medium text-gray-900">{{ bot.name }}</div>
          <Menu as="div" class="relative ml-auto">
            <MenuButton class="-m-2.5 block p-2.5 text-gray-400 hover:text-gray-500">
              <span class="sr-only">Open options</span>
              <EllipsisHorizontalIcon class="size-5" aria-hidden="true" />
            </MenuButton>
            <transition enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95">
              <MenuItems
                class="absolute right-0 z-10 mt-0.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                <MenuItem v-slot="{ active }">
                <a :href="`/detail/${bot.name}?id=${bot.id}`"
                  :class="[active ? 'bg-gray-50 outline-none' : '', 'block px-3 py-1 text-sm/6 text-gray-900']">View<span
                    class="sr-only">, {{ bot.name }}</span></a>
                </MenuItem>
              </MenuItems>
            </transition>
          </Menu>
        </div>
        <dl class="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm/6">
          <div class="flex justify-between gap-x-4 py-3">
            <dt class="text-gray-500">version</dt>
            <dd class="text-white">
              <div :version="bot.version">{{ bot.version }}</div>
            </dd>
          </div>
          <div class="flex justify-between gap-x-4 py-3">
            <dt class="text-gray-500">Last Update</dt>
            <dd class="text-white">
              {{getFormattedDate(bot.createdAt)}}
            </dd>
          </div>
          <div class="flex justify-between gap-x-4 py-3">
            <dt class="text-gray-500">views</dt>
            <dd class="text-white">
              <div :version="bot.version">{{ bot.views }}</div>
            </dd>
          </div>
          <div class="flex justify-between gap-x-4 py-3">
            <dt class="text-gray-500">Amount</dt>
            <dd class="flex items-start gap-x-2">
              <div class="font-medium text-white">{{ bot.price }} tokens/question</div>
              <div :class="[statuses[bot.state], 'rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset']">{{
                bot.state }}</div>
            </dd>
          </div>
        </dl>
      </li>
    </ul>
  </div>

</template>

<script setup>
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { EllipsisHorizontalIcon } from '@heroicons/vue/20/solid'
import { ref, onMounted } from 'vue';
import axios from 'axios'
import dayjs from 'dayjs';

const isLoading = ref(true); // 加载状态
const errorMessage = ref(null); // 错误消息

const bots = ref([
  {
    id: 1,
    name: 'Xbot_007',
    version: '1.0',
    views: '123',
    createdAt: '2022-12-13',
    price: '2,000.00',
    state: 'Online',
  },
  {
    id: 2,
    name: 'Chat_GPT4',
    version: '1.0',
    views: '456',
    createdAt: '2023-01-22',
    price: '14,000.00', 
    state: 'Offline',
  },
  {
    id: 3,
    name: 'Llama',
    version: '1.0',
    views: '789',
    createdAt:'2023-01-23',
    price: '7,600.00', 
    state: 'Online',
  },
  {
    id: 5,
    name: 'Llama',
    version: '1.0',
    views: '789',
    createdAt:'2023-01-23',
    price: '7,600.00', 
    state: 'Online',
  },
  {
    id: 6,
    name: 'Llama',
    version: '1.0',
    views: '789',
    createdAt:'2023-01-23',
    price: '7,600.00', 
    state: 'Online',
  },
  {
    id: 7,
    name: 'Llama',
    version: '1.0',
    views: '789',
    createdAt:'2023-01-23',
    price: '7,600.00', 
    state: 'Online',
  },
  {
    id: 8,
    name: 'Llama',
    version: '1.0',
    views: '789',
    createdAt:'2023-01-23',
    price: '7,600.00', 
    state: 'Online',
  },
  {
    id: 9,
    name: 'Llama',
    version: '1.0',
    views: '789',
    createdAt:'2023-01-23',
    price: '7,600.00', 
    state: 'Online',
  },
  {
    id: 10,
    name: 'Llama',
    version: '1.0',
    views: '789',
    createdAt:'2023-01-23',
    price: '7,600.00', 
    state: 'Online',
  },
  {
    id: 11,
    name: 'Llama',
    version: '1.0',
    views: '789',
    createdAt:'2023-01-23',
    price: '7,600.00', 
    state: 'Online',
  },
  {
    id: 12,
    name: 'Llama',
    version: '1.0',
    views: '789',
    createdAt:'2023-01-23',
    price: '7,600.00', 
    state: 'Online',
  },
  {
    id: 13,
    name: 'Llama',
    version: '1.0',
    views: '789',
    createdAt:'2023-01-23',
    price: '7,600.00', 
    state: 'Online',
  },
])

const statuses = {
  Online: 'text-green-700 bg-green-300 ring-green-600/20',
  Offline: 'text-gray-600 bg-gray-50 ring-gray-500/10',
  error: 'text-red-700 bg-red-50 ring-red-600/10',
}

function getFormattedDate(date, format = "MMMM D, YYYY") {
  return date ? dayjs(date).format(format) : null;
}


async function fetchBots(){
  try{
    const response = await axios.get('/bots/showall');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch bot lists');
  }
}

onMounted(async () => {
  try {
    bots.value = await fetchBots();
    console.log(bots.value[0].id);
    console.log(bots.value[0].name);
    console.log(bots.value[0].version);
    console.log(bots.value[0].views);
    console.log(bots.value[0].createdAt);
    console.log(bots.value[0].price);
    console.log(bots.value[0].state);
    
    return ;
  } catch (error) {
    errorMessage.value = error.message; // 捕获错误
  } finally {
    isLoading.value = false; // 完成加载
  }
})  

</script>
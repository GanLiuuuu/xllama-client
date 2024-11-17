<template>
  <div>
    <div class="hidden xl:fixed xl:inset-y-0 xl:z-50 xl:flex xl:w-72 xl:flex-col">
      <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-black/10 px-6 ring-1 ring-white/5">
        <div class="flex h-16 shrink-0 items-center">
          <img class="h-8 w-auto" src="../assets/image.png" alt="Your Company" />
        </div>
        <nav class="flex flex-1 flex-col">
          <ul role="list" class="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" class="-mx-2 space-y-1">
                <li v-for="item in navigation" :key="item.name">
                  <a @click="selectNavItem(item)" :class="[item.current ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white', 'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold']">
                    <component :is="item.icon" class="size-6 shrink-0" aria-hidden="true" />
                    {{ item.name }}
                  </a>
                </li>
              </ul>
            </li>
            <li>
              <div class="text-xs/6 font-semibold text-gray-400">Your conversations</div>
              <ul role="list" class="-mx-2 mt-2 space-y-1">
                <li v-for="conversation in conversations" :key="conversation.name">
                  <a @click="selectNavItem(conversation)" :href="conversation.href" :class="[conversation.current ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white', 'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold']">
                    <span class="truncate">{{ conversation.name }}</span>
                  </a>
                </li>
              </ul>
            </li>
            <li class="-mx-6 mt-auto">
              <a href="#" class="flex items-center gap-x-4 px-6 py-3 text-sm/6 font-semibold text-white hover:bg-gray-800">
                <img class="size-8 rounded-full bg-gray-800" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                <span class="sr-only">Your profile</span>
                <span aria-hidden="true">Tom Cook</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <div class="xl:pl-72">
        <main class="lg:pr-px">
          <div v-if="currentNavItem == 'Deployments' ">
          <!-- Deployments -->
          <header class="flex items-center justify-between border-b border-white/5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
            <h1 class="text-base/7 font-semibold text-white">Deployments</h1>
              <Menu as="div" class="relative">
              <MenuButton class="flex items-center gap-x-1 text-sm/6 font-medium text-white">
                Upload
                <PlusIcon class="size-5 text-gray-500" aria-hidden="true" />
              </MenuButton>
              
            </Menu>
          </header>
          <ul role="list" class="divide-y divide-white/5">
            <li v-for="deployment in deployments" :key="deployment.id" class="relative flex items-center space-x-4 px-4 py-4 sm:px-6 lg:px-8">
              <div class="min-w-0 flex-auto">
                <div class="flex items-center gap-x-3">
                  <div :class="[statuses[deployment.status], 'flex-none rounded-full p-1']">
                    <div class="size-2 rounded-full bg-current" />
                  </div>
                  <h2 class="min-w-0 text-sm/6 font-semibold text-white">
                    <a :href="deployment.href" class="flex gap-x-2">
                      
                      <span class="whitespace-nowrap">{{ deployment.projectName }}</span>
                      <span class="absolute inset-0" />
                    </a>
                  </h2>
                </div>
                <div class="mt-3 flex items-center gap-x-2.5 text-xs/5 text-gray-400">
                  <p class="truncate">{{ deployment.description }}</p>
                  <svg viewBox="0 0 2 2" class="size-0.5 flex-none fill-gray-300">
                    <circle cx="1" cy="1" r="1" />
                  </svg>
                  <p class="whitespace-nowrap">{{ deployment.statusText }}</p>
                </div>
              </div>
              <div :class="[environments[deployment.environment], 'flex-none rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset']">{{ deployment.environment }}</div>
              <ChevronRightIcon class="size-5 flex-none text-gray-400" aria-hidden="true" />
            </li>
          </ul>
          </div>

          <!--Home Page-->
          <div v-if="currentNavItem == 'Home' ">
            <header>
              <!-- Secondary navigation -->
              <nav class="flex overflow-x-auto border-b border-white/10 py-4">
                <ul role="list" class="flex min-w-full flex-none gap-x-6 px-4 text-sm/6 font-semibold text-gray-400 sm:px-6 lg:px-8">
                  <li v-for="item in secondaryNavigation" :key="item.name">
                    <a :href="item.href" :class="item.current ? 'text-indigo-400' : ''">{{ item.name }}</a>
                  </li>
                </ul>
              </nav>

              <!-- Heading -->
              <div class="flex flex-col items-start justify-between gap-x-8 gap-y-4 bg-gray-700/10 px-4 py-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
                <div>
                  <div class="flex items-center gap-x-3">
                    <h1 class="flex gap-x-3 text-base/7">
                      <span class="font-semibold text-white">SUSTech</span>
                      <span class="text-gray-600">/</span>
                      <span class="font-semibold text-white">name</span>
                    </h1>
                  </div>
                  <p class="mt-2 text-xs/6 text-gray-400">This is a self Intro.</p>
                </div>
                <div class="order-first flex-none rounded-full bg-indigo-400/10 px-2 py-1 text-xs font-medium text-indigo-400 ring-1 ring-inset ring-indigo-400/30 sm:order-none">Student</div>
              </div>

              <!-- Stats -->
              <div class="grid grid-cols-1 bg-gray-700/10 sm:grid-cols-2 lg:grid-cols-4">
                <div v-for="(stat, statIdx) in stats" :key="stat.name" :class="[statIdx % 2 === 1 ? 'sm:border-l' : statIdx === 2 ? 'lg:border-l' : '', 'border-t border-white/5 px-4 py-6 sm:px-6 lg:px-8']">
                  <p class="text-sm/6 font-medium text-gray-400">{{ stat.name }}</p>
                  <p class="mt-2 flex items-baseline gap-x-2">
                    <span class="text-4xl font-semibold tracking-tight text-white">{{ stat.value }}</span>
                    <span v-if="stat.unit" class="text-sm text-gray-400">{{ stat.unit }}</span>
                  </p>
                </div>
              </div>
            </header>
          </div>


          <div v-if="currentNavItem == 'Discover' ">
          
          </div>
        </main>
  

      </div>
  </div>
</template>


<script setup>
import { ref } from 'vue'
import {
  FolderIcon,
  HomeIcon,
  ServerIcon,
  SignalIcon,
} from '@heroicons/vue/24/outline'

const navigation = ref([
  { name: 'Home', href: '#', icon: HomeIcon, current: false },
  { name: 'Deployments', href: '#', icon: ServerIcon, current: true },
  { name: 'Discover', href: '#', icon: SignalIcon, current: false }
]);

const conversations = [
  { id: 1, name: 'Planetaria', href: '#', current: false },
  { id: 2, name: 'Protocol', href: '#', current: false },
  { id: 3, name: 'Tailwind Labs', href: '#', current: false },
]

const currentNavItem = ref('Deployments'); // 默认选中的导航项

function selectNavItem(item) {
  currentNavItem.value = item.name; // 更新当前选中的导航项
  item.current = true;
  navigation.value.forEach(item1 => {
    if(item1!==item){
      item1.current = false;
    }
     // 更新每个导航项的 current 状态
  });
  conversations.forEach(item1 => {
    if(item1!==item){
      item1.current = false;
    }  });
  
}
const statuses = {
    offline: 'text-gray-500 bg-gray-100/10',
    online: 'text-green-400 bg-green-400/10',
    error: 'text-rose-400 bg-rose-400/10',
  }
  const environments = {
    Preview: 'text-gray-400 bg-gray-400/10 ring-gray-400/20',
    Launch: 'text-indigo-400 bg-indigo-400/10 ring-indigo-400/30',
  }
  const deployments = [
    {
      id: 1,
      href: '#',
      projectName: 'XBot_11',
      status: 'online',
      statusText: 'Initiated 1m 30s ago',
      description: 'test case file',
      environment: 'Launch',
    },
    {
      id: 2,
      href: '#',
      projectName: 'untitledBot',
      status: 'offline',
      statusText: 'Initiated 1m 32s ago',
      description: 'test case file',
      environment: 'Preview',
    },
    {
      id: 2,
      href: '#',
      projectName: 'XBot_007',
      status: 'error',
      statusText: 'Initiated 30m 32s ago',
      description: 'test case file',
      environment: 'Preview',
    },
    // More deployments...
  ]
  const stats = [
  { name: 'Number of deploys', value: '405' },
  { name: 'Average deploy time', value: '3.65', unit: 'mins' },
  { name: 'Number of servers', value: '3' },
  { name: 'Success rate', value: '98.5%' },
]
const secondaryNavigation = [
  { name: 'Overview', href: '#', current: true },
  { name: 'Activity', href: '#', current: false },
  { name: 'Settings', href: '#', current: false },
  { name: 'Collaborators', href: '#', current: false },
  { name: 'Notifications', href: '#', current: false },
]
</script>


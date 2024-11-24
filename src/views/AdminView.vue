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
                    <a @click="selectNavItem(item)"
                       :class="[
                         item.current ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                         'group flex gap-x-3 rounded-md p-2 text-sm font-semibold'
                       ]">
                      <component :is="item.icon" class="size-6 shrink-0" aria-hidden="true" />
                      {{ item.name }}
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>
  
      <div class="xl:pl-72">
        <main class="lg:pr-px">
          <div>
            <Search />
          </div>
        </main>
      </div>
    </div>
  </template>
<script setup>
import { ref } from 'vue'
import Search from './SearchView.vue'
import { MagnifyingGlassCircleIcon } from '@heroicons/vue/24/outline'

const navigation = ref([
  { name: 'Search', href: '#', icon: MagnifyingGlassCircleIcon, current: true },
])

const currentNavItem = ref('Search')

function selectNavItem(item) {
  currentNavItem.value = item.name
  item.current = true
  navigation.value.forEach(item1 => {
    if (item1 !== item) {
      item1.current = false
    }
  })
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

const stats = [
  { name: 'Points', value: ref(() => this.$store.state.user.points) },
  { name: 'Tokens', value: '0', unit: 'tokens' },
  { name: 'Number of bots', value: '0' },
  { name: 'Success rate', value: '98.5%' },
]
</script>
  
<template>
    <header>
        <div>
            <label for="search" class="block text-sm/6 font-medium text-gray-900">Quick search</label>
            <div class="relative mt-2 flex items-center">
            <input type="text" name="search" id="search" class="block w-full rounded-md border-0 py-1.5 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6" />
            <button @click="" class="mt-3 inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:ml-3 sm:mt-0 sm:w-auto">Search</button>
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
              
     </header>
</template>

<script setup>
import { ref } from 'vue'

const currentN = ref('User');
const secondary = [
  { name: 'User', href: '#', current: true },
  { name: 'Bot', href: '#', current: false }
]
function select(item) {
    secondary.forEach(item1 =>{
        item1.current = false
    })
    currentN.value = item.name; 
  item.current = true;
  secondary.forEach(item1 => {
    if(item1!==item){
      item1.current = false;
    }
  });

}
</script>
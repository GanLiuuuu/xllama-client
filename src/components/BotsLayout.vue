<template>
    <div class="bg-black" style="padding: 40px;">
        <ul role="list" class="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8">
      <li v-for="client in clients" :key="client.id" class="overflow-hidden rounded-xl border border-gray-200">
        <div class="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
          <div class="text-sm/6 font-medium text-gray-900">{{ client.name }}</div>
          <Menu as="div" class="relative ml-auto">
            <MenuButton class="-m-2.5 block p-2.5 text-gray-400 hover:text-gray-500">
              <span class="sr-only">Open options</span>
              <EllipsisHorizontalIcon class="size-5" aria-hidden="true" />
            </MenuButton>
            <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
              <MenuItems class="absolute right-0 z-10 mt-0.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                <MenuItem v-slot="{ active }">
                  <a href="/detail" :class="[active ? 'bg-gray-50 outline-none' : '', 'block px-3 py-1 text-sm/6 text-gray-900']"
                    >View<span class="sr-only">, {{ client.name }}</span></a
                  >
                </MenuItem>
              </MenuItems>
            </transition>
          </Menu>
        </div>
        <dl class="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm/6">
          <div class="flex justify-between gap-x-4 py-3">
            <dt class="text-gray-500">Last Update</dt>
            <dd class="text-white">
              <time :datetime="client.last.dateTime">{{ client.last.date }}</time>
            </dd>
          </div>
          <div class="flex justify-between gap-x-4 py-3">
            <dt class="text-gray-500">Amount</dt>
            <dd class="flex items-start gap-x-2">
              <div class="font-medium text-white">{{ client.last.amount }}</div>
              <div :class="[statuses[client.last.status], 'rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset']">{{ client.last.status }}</div>
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
  
  const statuses = {
    Paid: 'text-green-700 bg-green-50 ring-green-600/20',
    Withdraw: 'text-gray-600 bg-gray-50 ring-gray-500/10',
    NotYet: 'text-blue-700 bg-red-50 ring-blue-600/10',
  }
  const clients = [
    {
      id: 1,
      name: 'Xbot_007',
      imageUrl: 'https://tailwindui.starxg.com/plus/img/logos/48x48/tuple.svg',
      last: { date: 'December 13, 2022', dateTime: '2022-12-13', amount: '$2,000.00', status: 'NotYet' },
    },
    {
      id: 2,
      name: 'Chat GPT4',
      imageUrl: 'https://tailwindui.starxg.com/plus/img/logos/48x48/savvycal.svg',
      last: { date: 'January 22, 2023', dateTime: '2023-01-22', amount: '$14,000.00', status: 'Paid' },
    },
    {
      id: 3,
      name: 'Llama',
      imageUrl: 'https://tailwindui.starxg.com/plus/img/logos/48x48/reform.svg',
      last: { date: 'January 23, 2023', dateTime: '2023-01-23', amount: '$7,600.00', status: 'Paid' },
    },

  ]
  </script>
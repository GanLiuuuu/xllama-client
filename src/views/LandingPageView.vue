<template>
    <div class="bg-gray-900">
      <!-- Header -->
      <header class="absolute inset-x-0 top-0 z-50">
        <nav class="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div class="flex lg:flex-1" >

            <a href="#" style="padding-left: 10px">
              <img class="h-8 w-auto" src="../assets/image.png" alt="" />
              
            </a>
          </div>
          <div class="flex lg:hidden">
            <button type="button" class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700" @click="mobileMenuOpen = true">
              <span class="sr-only">Open main menu</span>
              <Bars3Icon class="size-6" aria-hidden="true" />
            </button>
          </div>
          <div class="hidden lg:flex lg:gap-x-12">
            <a v-for="item in navigation" :key="item.name" :href="item.href" class="text-sm/6 font-semibold text-white">{{ item.name }}</a>
          </div>
          <div class="hidden lg:flex lg:flex-1 lg:justify-end">
            <a href="#" class="text-sm/6 font-semibold text-white">Log in <span aria-hidden="true">&rarr;</span></a>
          </div>
        </nav>
        <Dialog class="lg:hidden" @close="mobileMenuOpen = false" :open="mobileMenuOpen">
          <div class="fixed inset-0 z-50" />
          <DialogPanel class="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div class="flex items-center justify-between">
              <a href="#" class="-m-1.5 p-1.5">
                <span class="sr-only">Your Company</span>
                <img class="h-8 w-auto" src="https://tailwindui.starxg.com/plus/img/logos/mark.svg?color=indigo&shade=600" alt="" />
              </a>
              <button type="button" class="-m-2.5 rounded-md p-2.5 text-gray-700" @click="mobileMenuOpen = false">
                <span class="sr-only">Close menu</span>
                <XMarkIcon class="size-6" aria-hidden="true" />
              </button>
            </div>
            <div class="mt-6 flow-root">
              <div class="-my-6 divide-y divide-gray-500/10">
                <div class="space-y-2 py-6">
                  <a v-for="item in navigation" :key="item.name" :href="item.href" class="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:bg-gray-50">{{ item.name }}</a>
                </div>
                <div class="py-6">
                  <a href="#" class="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-white hover:bg-gray-50">Log in</a>
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </header>
  
      <main class="isolate">
        <!-- Hero section -->
        <div id = "product" class="relative pt-14">
          <div class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
            <div class="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" />
          </div>
          <div class="py-24 sm:py-32 lg:pb-40">
            <div class="mx-auto max-w-7xl px-6 lg:px-8">
              <div class="mx-auto max-w-2xl text-center">
                <h1 class="text-balance text-5xl font-semibold tracking-tight text-white sm:text-7xl">Discover and Deploy LLM-Powered AI Bots</h1>
                <p class="mt-8 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">Browse a marketplace of AI bots built with powerful language models. Upload your own creations, purchase bots from other users, and seamlessly deploy them to meet your needs—whether for business, research, or personal projects.</p>
                <div class="mt-10 flex items-center justify-center gap-x-6">
                  <a href="#" class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Get started</a>
                  <a href="#" class="text-sm/6 font-semibold text-white">Learn more <span aria-hidden="true">→</span></a>
                </div>
              </div>
              <div class="mt-16 flow-root sm:mt-24">
                <div class="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                  <img src="src/assets/front_back_end.png" alt="App screenshot" width="2432" height="1442" class="rounded-md shadow-2xl ring-1 ring-gray-900/10" />
                </div>
              </div>
            </div>
          </div>
          <div class="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
            <div class="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" />
          </div>
        </div>
  

  
        <!-- Feature section -->
        <div id="feature" class="mx-auto mt-32 max-w-7xl px-6 sm:mt-56 lg:px-8">
          <div class="mx-auto max-w-2xl lg:text-center">
            <h2 class="text-base/7 font-semibold text-indigo-600">Empower Your AI Projects</h2>
            <p class="mt-2 text-pretty text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-balance">Quickly upload, discover, and deploy AI bots</p>
            <p class="mt-6 text-pretty text-lg/8 text-gray-600">Explore a growing marketplace of powerful LLM bots or upload your own for instant deployment. Whether you're building for business or research, we make it simple and efficient.</p>
            </div>
          <div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              <div v-for="feature in features" :key="feature.name" class="relative pl-16">
                <dt class="text-base/7 font-semibold text-white">
                  <div class="absolute left-0 top-0 flex size-10 items-center justify-center rounded-lg bg-indigo-600">
                    <component :is="feature.icon" class="size-6 text-white" aria-hidden="true" />
                  </div>
                  {{ feature.name }}
                </dt>
                <dd class="mt-2 text-base/7 text-gray-600">{{ feature.description }}</dd>
              </div>
            </dl>
          </div>
        </div>
  


  
        <!-- FAQs -->
        <div id ="faq" class="mx-auto max-w-2xl divide-y divide-gray-900/10 px-6 pb-8 sm:pb-24 sm:pt-12 lg:max-w-7xl lg:px-8 lg:pb-32">
          <h2 class="text-4xl font-semibold tracking-tight text-white sm:text-5xl">Frequently asked questions</h2>
          <dl class="mt-10 space-y-8 divide-y divide-gray-900/10">
            <div v-for="faq in faqs" :key="faq.id" class="pt-8 lg:grid lg:grid-cols-12 lg:gap-8">
              <dt class="text-base/7 font-semibold text-white lg:col-span-5">{{ faq.question }}</dt>
              <dd class="mt-4 lg:col-span-7 lg:mt-0">
                <p class="text-base/7 text-gray-600">{{ faq.answer }}</p>
              </dd>
            </div>
          </dl>
        </div>
  
        <!-- CTA section -->
        <div class="relative -z-10 mt-32 px-6 lg:px-8">
          <div class="absolute inset-x-0 top-1/2 -z-10 flex -translate-y-1/2 transform-gpu justify-center overflow-hidden blur-3xl sm:bottom-0 sm:right-[calc(50%-6rem)] sm:top-auto sm:translate-y-0 sm:transform-gpu sm:justify-end" aria-hidden="true">
            <div class="aspect-[1108/632] w-[69.25rem] flex-none bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-25" style="clip-path: polygon(73.6% 48.6%, 91.7% 88.5%, 100% 53.9%, 97.4% 18.1%, 92.5% 15.4%, 75.7% 36.3%, 55.3% 52.8%, 46.5% 50.9%, 45% 37.4%, 50.3% 13.1%, 21.3% 36.2%, 0.1% 0.1%, 5.4% 49.1%, 21.4% 36.4%, 58.9% 100%, 73.6% 48.6%)" />
          </div>
          <div class="mx-auto max-w-2xl text-center">
            <h2 class="text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">Supercharge your workflow with AI bots.</h2>
            <p class="mx-auto mt-6 max-w-xl text-pretty text-lg/8 text-gray-600">Whether you’re creating or deploying, our platform simplifies the process. Discover ready-to-use bots or upload your own for fast integration into your projects.</p>
            <div class="mt-10 flex items-center justify-center gap-x-6">
              <a href="#" class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Get started</a>
              <a href="#" class="text-sm/6 font-semibold text-white">Learn more <span aria-hidden="true">→</span></a>
            </div>
          </div>
          <div class="absolute left-1/2 right-0 top-full -z-10 hidden -translate-y-1/2 transform-gpu overflow-hidden blur-3xl sm:block" aria-hidden="true">
            <div class="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" />
          </div>
        </div>
      </main>
  
      <!-- Footer -->
      <footer id = "about" class="relative mx-auto mt-32 max-w-7xl px-6 lg:px-8">
        <div class="border-t border-gray-900/10 py-16 sm:py-24 lg:py-32">
          <div class="xl:grid xl:grid-cols-3 xl:gap-8">
            <img class="h-9" src="../assets/image.png" alt="Company name" />
            <div class="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
              <div class="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 class="text-sm/6 font-semibold text-white">Solutions</h3>
                  <ul role="list" class="mt-6 space-y-4">
                    <li v-for="item in footerNavigation.solutions" :key="item.name">
                      <a :href="item.href" class="text-sm/6 text-gray-600 hover:text-white">{{ item.name }}</a>
                    </li>
                  </ul>
                </div>
                <div class="mt-10 md:mt-0">
                  <h3 class="text-sm/6 font-semibold text-white">Support</h3>
                  <ul role="list" class="mt-6 space-y-4">
                    <li v-for="item in footerNavigation.support" :key="item.name">
                      <a :href="item.href" class="text-sm/6 text-gray-600 hover:text-white">{{ item.name }}</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="md:grid md:grid-cols-2 md:gap-8">
            
                <div class="mt-10 md:mt-0">
                  <h3 class="text-sm/6 font-semibold text-white">Legal</h3>
                  <ul role="list" class="mt-6 space-y-4">
                    <li v-for="item in footerNavigation.legal" :key="item.name">
                      <a :href="item.href" class="text-sm/6 text-gray-600 hover:text-white">{{ item.name }}</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { Dialog, DialogPanel } from '@headlessui/vue'
  import {
    ArrowPathIcon,
    Bars3Icon,
    ChatBubbleLeftEllipsisIcon,
    CloudArrowUpIcon,
    FingerPrintIcon,
    LockClosedIcon,
    MagnifyingGlassCircleIcon,
    XMarkIcon,
  } from '@heroicons/vue/24/outline'
  import { CheckIcon } from '@heroicons/vue/20/solid'
  
  const navigation = [
    { name: 'Product', href: '#product' },
    { name: 'Features', href: '#feature' },
    { name: 'FAQ', href: '#faq' },
    { name: 'About', href: '#about' },
  ]

const features = [
  {
    name: 'Multi-Model Integration',
    description:
      'Integrates multiple existing large language model interfaces like OpenAI, allowing users to choose different models based on their needs.',
    icon: CloudArrowUpIcon,
  },
  {
    name: 'Custom Bot Creation',
    description:
      'Allows users to create and customize their own AI bots, tailoring functionalities, behaviors, and tasks to meet specific requirements.',
    icon: CloudArrowUpIcon,
  },
  {
    name: 'Search Functionality',
    description:
      'Provides powerful search capabilities, enabling users to quickly find suitable AI bots, model interfaces, or related resources to improve efficiency.',
    icon: MagnifyingGlassCircleIcon,
  },
  {
    name: 'Ratings and Purchase Features',
    description:
      'Enables users to rate bots and help others make informed decisions. Also includes a purchase functionality for accessing different model services.',
    icon: ChatBubbleLeftEllipsisIcon,
  },
]


const faqs = [
  {
    id: 1,
    question: 'What models can I use on this platform?',
    answer:
      'Our platform integrates multiple large language models (LLMs) like OpenAI. You can choose from a variety of models based on your needs. Check the model catalog for details.',
  },
  {
    id: 2,
    question: 'How can I create my own custom AI bot?',
    answer:
      'You can easily create and customize your AI bot using our intuitive interface. Simply select the model, define your bot’s behavior, and deploy it.',
  },
  {
    id: 3,
    question: 'Is there a cost to use the platform?',
    answer:
      'Yes, some models and bot services require payment. You can view pricing details before making a purchase. We offer flexible subscription plans depending on your usage needs.',
  },
  {
    id: 4,
    question: 'Can I rate and review the bots?',
    answer:
      'Yes, users can rate and leave reviews for the bots they use, helping others make informed decisions. Your feedback is highly appreciated!',
  },
  {
    id: 5,
    question: 'How do I purchase additional services or models?',
    answer:
      'You can purchase additional model services directly through the platform. Simply select the model or service you wish to buy and follow the checkout process.',
  },

 
]

const footerNavigation = {
  solutions: [
    { name: 'Browse AI Bots', href: '#' },
    { name: 'Upload Your Bot', href: '#' },
    { name: 'API Documentation', href: '#' },
  ],
  support: [
    { name: 'Help Center', href: '#' },
    { name: 'Submit a Support Ticket', href: '#' },
    { name: 'Community Forum', href: '#' },
  ],
  legal: [
    { name: 'Terms of Service', href: '#' },
    { name: 'Privacy Policy', href: '#' },
    { name: 'Cookie Policy', href: '#' },
  ],
}

  
  const mobileMenuOpen = ref(false)
  </script>
<template>
  <div class="mt-4">
    <ul class="space-y-2">
      <li v-for="bot in showBots" :key="bot.username" class="text-gray-900" @click="openModal(bot)">
        <div class=" block px-4 bg-indigo-200 py-2 text-sm hover:bg-indigo-100 rounded-md">
          <img class="size-8 rounded-full bg-gray-800" :src="bot.avatarUrl" alt="机器人头像" />
          <p><strong class="text-2xl text-blue-500">{{ bot.name }}</strong></p>
          <p><strong>Version:</strong> {{ bot.version }}</p>
          <!-- <p><strong>Price:</strong> {{ bot.price }}</p>
          <p><strong>Description:</strong> {{ bot.description }}</p>
          <p><strong>Highlight:</strong> {{ bot.highlight }}</p> -->
          <p><strong>Views:</strong> {{ bot.views }}</p>
          <p><strong>Publish Date</strong> {{ getFormattedDate(bot.createdAt) }}</p>
          <p><strong>Rating</strong> {{ bot.rating }}</p>
        </div>
      </li>
    </ul>
    <TransitionRoot as="template" :show="isShowBotModal">
      <Dialog class="relative z-10" @close="closeModal()">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 hidden bg-gray-500/75 transition-opacity md:block" />
        </TransitionChild>
        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div class="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
            <!-- This element is to trick the browser into centering the modal contents. -->
            <span class="hidden md:inline-block md:h-screen md:align-middle" aria-hidden="true">&#8203;</span>
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 md:translate-y-0 md:scale-95" enter-to="opacity-100 translate-y-0 md:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 md:scale-100" leave-to="opacity-0 translate-y-4 md:translate-y-0 md:scale-95">
              <DialogPanel class="relative flex w-full transform text-left text-base transition md:my-8 md:max-w-2xl md:px-4 lg:max-w-2xl">
                <BotDetail :botId = "showBot.id"/>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import { ref, onMounted} from 'vue'
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import BotDetail from '../components/BotDetail.vue';
import axios from 'axios'
import dayjs from 'dayjs';
import { useStore } from 'vuex';

const store = useStore();

const props = defineProps({
  constraint:{
    type: String,
    required: true,
  }
});

const showBot = ref(null); // 显示信息的bot
const showBots = ref([]);
const allBots = ref([]);
const isShowBotModal = ref(false); // 显示bot信息的模态框

function getFormattedDate(date, format = "YYYY-MM-DD hh:mm:ss") {
  return date ? dayjs(date.slice(0,19)).format(format) : null;
}

async function ranking(){
  const errorMessage = ref(null);
  if(props.constraint === 'You may like'){
    try{
      const response = await axios.get('/bots/recommend', {
        params: { username: store.state.user.email }
      });
      showBots.value = response.data;
    } catch (error) {
      errorMessage.value = error.message; // 捕获错误
    }
    return;
  }
  try{
    if(props.constraint === 'Top-rated-within-a-month'){
      const response = await axios.get('/bots/showAllOnlineMonthly');
      allBots.value = response.data;
    }
    else{
      const response = await axios.get('/bots/showAllOnline');
      allBots.value = response.data;
    }
  } catch (error) {
    errorMessage.value = error.message; // 捕获错误
  }

  // 根据约束条件过滤机器人
  if(props.constraint === 'Latest') {
    showBots.value = allBots.value;
    showBots.value.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
  else if(props.constraint === 'Top-rated-within-a-month' || props.constraint === 'Top-rated-all-the-time'){
    showBots.value = allBots.value;
    showBots.value.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
  }
  else if(props.constraint === 'Most-visited'){
    showBots.value = allBots.value;
    showBots.value.sort((a, b) => parseInt(b.views) - parseInt(a.views));
  }
}

onMounted(async () => {
  ranking();
});

function openModal(bot) {
  showBot.value = bot;
  isShowBotModal.value = true;
}

function closeModal() {
  isShowBotModal.value = false;
  ranking();
}

</script>
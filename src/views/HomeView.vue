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
                    :class="[item.current ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white', 'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold']">
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
                  <a @click="selectNavItem(conversation)" :href="conversation.href"
                    :class="[conversation.current ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white', 'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold']">
                    <span class="truncate">{{ conversation.name }}</span>
                  </a>
                </li>
              </ul>
            </li>
            <li class="-mx-6 mt-auto">
              <a href="#" class="flex items-center gap-x-4 px-6 py-3 text-sm/6 font-semibold text-white hover:bg-gray-800">
                <img class="size-8 rounded-full bg-gray-800" :src="user.avatarUrl" alt="用户头像" />
                <span class="sr-only">Your profile</span>
                <span aria-hidden="true">{{ user.username }}</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <div class="xl:pl-72">
      <main class="lg:pr-px">
        <div v-if="currentNavItem == 'Deployments'">
          <!-- Deployments -->
          <header class="flex items-center justify-between border-b border-white/5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
            <h1 class="text-base/7 font-semibold text-white">Deployments</h1>
            <Menu as="div" class="relative">
              <MenuButton class="flex items-center gap-x-1 text-sm/6 font-medium text-white cursor-pointer"
                @click="navigateToUpload">
                Upload
                <PlusIcon class="size-5 text-gray-500" aria-hidden="true" />
              </MenuButton>

            </Menu>
          </header>
          <ul role="list" class="divide-y divide-white/5">
            <li v-for="bot in bots" :key="bot.id"
              class="relative flex items-center space-x-4 px-4 py-4 sm:px-6 lg:px-8">
              <div class="min-w-0 flex-auto">
                <div class="flex items-center gap-x-3">
                  <div :class="[statuses[bot.state], 'flex-none rounded-full p-1']">
                    <div class="size-2 rounded-full bg-current" />
                  </div>
                  <h2 class="min-w-0 text-sm/6 font-semibold text-white">
                    <div class="flex gap-x-2">
                      <span class="whitespace-nowrap">{{ bot.name }}</span>
                    </div>
                  </h2>
                </div>
                <div class="mt-3 flex items-center gap-x-2.5 text-xs/5 text-gray-400">
                  <p class="truncate">{{ bot.description }}</p>
                  <svg viewBox="0 0 2 2" class="size-0.5 flex-none fill-gray-300">
                    <circle cx="1" cy="1" r="1" />
                  </svg>
                  <p class="whitespace-nowrap">{{ bot.statusText }}</p>
                </div>
              </div>
              <div>
                <button @click="openEditingFAQ(bot)" class="mt-3 inline-flex w-full items-center justify-center rounded-3xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:ml-3 sm:mt-0 sm:w-auto">Add FAQ</button>
              </div>
              <div
                :class="[statuses_tags[bot.state], 'flex-none rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset']">
                {{ bot.state }}</div>
              <ChevronRightIcon class="size-5 flex-none text-gray-400" aria-hidden="true" />
            </li>
          </ul>
          <TransitionRoot as="template" :show="isEditingFAQ">
            <Dialog class="relative z-10" @close="isEditingFAQ = false">
              <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
                <div class="fixed inset-0 hidden bg-gray-500/75 transition-opacity md:block" />
              </TransitionChild>

              <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div class="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
                  <!-- This element is to trick the browser into centering the modal contents. -->
                  <span class="hidden md:inline-block md:h-screen md:align-middle" aria-hidden="true">&#8203;</span>
                  <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 md:translate-y-0 md:scale-95" enter-to="opacity-100 translate-y-0 md:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 md:scale-100" leave-to="opacity-0 translate-y-4 md:translate-y-0 md:scale-95">
                    <DialogPanel class="flex w-full transform text-left text-base transition md:my-8 md:max-w-2xl md:px-4 lg:max-w-2xl">
                      <AddBotFAQ :bot = "editBotFAQ" @FAQfinished="handleFAQfinished"/>
                    </DialogPanel>
                  </TransitionChild>
                </div>
              </div>
            </Dialog>
          </TransitionRoot>
        </div>

          <!--Home Page-->
          <div v-if="currentNavItem == 'Home' ">
            <header>
              <!-- Secondary navigation -->
              <nav class="flex overflow-x-auto border-b border-white/10 py-4">
                <ul role="list" class="flex min-w-full flex-none gap-x-6 px-4 text-sm/6 font-semibold text-gray-400 sm:px-6 lg:px-8">
                  <li v-for="item in secondaryNavigation" :key="item.name">
                    <a @click="selectSubNavItem(item)" :href="item.href" :class="item.current ? 'text-indigo-400' : ''">{{ item.name }}</a>
                  </li>
                </ul>
              </nav>




              <div v-if="currentSubNavItem == 'Overview' ">
                <!-- Heading -->
              <div class="flex flex-col items-start justify-between gap-x-8 gap-y-4 bg-gray-700/10 px-4 py-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
                <div>
                  <div class="flex items-center gap-x-3">
                    <h1 class="flex gap-x-3 text-base/7">
                      <span class="font-semibold text-white">SUSTech</span>
                      <span class="text-gray-600">|</span>
                      <span class="font-semibold text-white">{{ user.username }}</span>
                    </h1>
                  </div>
                  <p class="mt-2 text-xs/6 text-gray-400">A student from SUSTech, enrolled 2 years ago</p>
                </div>
                <div
                  class="order-first flex-none rounded-full bg-indigo-400/10 px-2 py-1 text-xs font-medium text-indigo-400 ring-1 ring-inset ring-indigo-400/30 sm:order-none">
                  Student</div>
              </div>

              <!-- Stats -->
              <div class="grid grid-cols-1 bg-gray-700/10 sm:grid-cols-2 lg:grid-cols-4">
                <div v-for="(stat, statIdx) in stats" :key="stat.name"
                  :class="[statIdx % 2 === 1 ? 'sm:border-l' : statIdx === 2 ? 'lg:border-l' : '', 'border-t border-white/5 px-4 py-6 sm:px-6 lg:px-8']">
                  <p class="text-sm/6 font-medium text-gray-400">{{ stat.name }}</p>
                  <p class="mt-2 flex items-baseline gap-x-2">
                    <span class="text-4xl font-semibold tracking-tight text-white">{{ stat.name === 'Points' ?
                      user.points : stat.name === 'Tokens' ? user.tokens : stat.name === "Number of bots" ?
                        Mybots.length :
                        stat.value }}</span>
                    <span v-if="stat.unit" class="text-sm text-gray-400">{{ stat.unit }}</span>
                  </p>
                </div>
              </div>



              </div>





              
            </header>

          <!--self intro-->
          <div v-if="currentSubNavItem == 'Overview'">
            <div
              class="flex flex-col items-start justify-between gap-x-8 gap-y-4 bg-gray-700/10 px-4 py-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
              <div class="rounded-lg bg-gray-800/50 p-4 w-full">

                <div class="flex items-center gap-x-3">
                  <h1 class="flex gap-x-3 text-base/7">
                    <span class="font-semibold text-white">Self introduction</span>
                    <span class="text-gray-600"></span>

                  </h1>
                </div>

                <div class="flex items-center gap-x-3">
                  <p class="flex gap-x-3 text-base/7">
                    <span class="font-text text-white">{{ user.about }}</span>
                    <span class="text-gray-600"></span>
                  </p>
                </div>

              </div>

              <br>
          </div>

            <div class="mt-6">
              <h2 class="text-lg font-semibold text-white">📢 Reviews</h2>
              <div v-if="reviews.length" class="mt-4 space-y-4 bg-gray-800 p-4 rounded-lg shadow-lg">
                <!-- 单条评论卡片 -->
                <div v-for="review in reviews" :key="review.reviewDate" class="review-card border-b border-gray-700 pb-4">
                  <!-- 评论者信息 -->
                  <div class="review-header flex items-center justify-between">
                    <p class="text-sm font-bold text-indigo-400">{{ review.reviewerName }}</p>
                    <p class="text-xs text-gray-500">{{review.reviewDate.slice(0,10)+" "+review.reviewDate.slice(11,19)}}</p>
                  </div>

                  <!-- 评论内容 -->
                  <p class="mt-2 text-gray-300">{{ review.reviewText }}</p>

                  <!-- 星星评分 -->
                  <div class="review-rating mt-2 flex items-center">
                    <span class="text-sm font-medium text-gray-400">Ratixng:</span>
                    <span class="rating-stars ml-2 text-yellow-400 text-lg">
                        <span v-for="n in review.rating" :key="n">🌟</span>
                      </span>
                  </div>
                </div>
              </div>
              <p v-else class="text-gray-500">No reviews available.</p>
            </div>


          </div>

          <!--setting-->
          <div v-if="currentSubNavItem == 'Settings'" style="padding: 40px">
            <EditForm />
          </div>
          <div v-if="currentSubNavItem == 'Usage stats'">
            <!--TODO: -->
          </div>
        </div>

          <div v-if="currentNavItem == 'Discover' ">
            <Discover/>
          </div>

          <div v-if="currentNavItem == 'Recommendation'">
            <nav class="flex overflow-x-auto border-b border-white/10 py-4">
              <ul role="list" class="flex min-w-full flex-none gap-x-6 px-4 text-sm/6 font-semibold text-gray-400 sm:px-6 lg:px-8 justify-center">
                <li v-for="item in secondaryNavigationRecommendation" :key="item.name">
                  <a @click="selectRecommendationSubNavItem(item)" :href="item.href"
                    :class="item.current ? 'text-indigo-400' : ''">{{ item.name }}</a>
                </li>
              </ul>
            </nav>
            <div v-if="currentRecommendationSubNavItem == 'Latest'">
              <RecommendBotList :constraint="currentRecommendationSubNavItem" />
            </div>
            <div v-if="currentRecommendationSubNavItem == 'Top-rated'">
              <RecommendBotList :constraint="currentRecommendationSubNavItem" />
            </div>
            <div v-if="currentRecommendationSubNavItem == 'Most-visited'">
              <RecommendBotList :constraint="currentRecommendationSubNavItem" />
            </div>
            <div v-if="currentRecommendationSubNavItem == 'You may like'">
              <RecommendBotList :constraint="currentRecommendationSubNavItem" />
            </div>
          </div>            
          
          <div v-if="currentNavItem == 'Search' ">
            <Search/>
          </div>
          <div v-if="currentNavItem == 'Chat'">
            <Chat/>
          </div>
      </main>




    </div>
  </div>
</template>


<script setup>
import dayjs from 'dayjs';
import Chat from './Chat.vue'
import Discover from './DiscoverView.vue'
import Recently from './RecentlyView.vue'
import EditForm from '../components/EditForm.vue';
import Search from './SearchView.vue'
import RecommendBotList from '../components/RecommendBotList.vue'
import AddBotFAQ from '../components/AddBotFAQ.vue';
import { ref } from 'vue'
import { onMounted } from 'vue';
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import {
  FolderIcon,
  HomeIcon,
  ServerIcon,
  SignalIcon,
  ClockIcon,
  HandThumbUpIcon
} from '@heroicons/vue/24/outline'
import axios from "axios";

const editBotFAQ = ref(null)
const isEditingFAQ = ref(false)

function getFormattedDate(date, format = "YYYY-MM-DD HH:mm:ss") {
  return date ? dayjs(date.slice(0, 19)).format(format) : null;
}

function handleFAQfinished() {
  console.log('FAQ finished')
  isEditingFAQ.value = false
}

const openEditingFAQ = (bot) => {
  editBotFAQ.value = bot
  isEditingFAQ.value = true
}

const navigation = ref([
  { name: 'Home', href: '#', icon: HomeIcon, current: true },
  { name: 'Deployments', href: '#', icon: ServerIcon, current: false },
  { name: 'Discover', href: '#', icon: SignalIcon, current: false },
  { name: 'Recommendation', href: '#', icon: HandThumbUpIcon, current: false },
  { name: 'Search', href: '#', icon: MagnifyingGlassCircleIcon, current: false},
]);

const conversations = [
  { id: 1, name: 'Chat', href: '#', current: false },
]

const currentNavItem = ref('Home');
const currentSubNavItem = ref('Overview');
const currentRecommendationSubNavItem = ref('Latest');

function selectNavItem(item) {
  currentNavItem.value = item.name;
  item.current = true;
  navigation.value.forEach(item1 => {
    if (item1 !== item) {
      item1.current = false;
    }
  });
  conversations.forEach(item1 => {
    if (item1 !== item) {
      item1.current = false;
    }
  });
}

function selectSubNavItem(item) {
  currentSubNavItem.value = item.name;
  item.current = true;
  secondaryNavigation.forEach(item1 => {
    if (item1 !== item) {
      item1.current = false;
    }
  });
}

function selectRecommendationSubNavItem(item) {
  currentRecommendationSubNavItem.value = item.name;
  item.current = true;
  secondaryNavigationRecommendation.forEach(item1 => {
    if (item1 !== item) {
      item1.current = false;
    }
  });
}

const statuses = {
  Offline: 'text-gray-500 bg-gray-100/10',
  Online: 'text-green-400 bg-green-400/10',
  Error: 'text-rose-400 bg-rose-400/10',
}

const statuses_tags = {
  Offline: 'text-gray-400 bg-gray-400/10 ring-gray-400/20',
  Online: 'text-green-400 bg-green-400/10 ring-green-400/30',
  Error: 'text-red-400 bg-red-400/10 ring-red-400/30',
}
const environments = {
  Preview: 'text-gray-400 bg-gray-400/10 ring-gray-400/20',
  Launch: 'text-indigo-400 bg-indigo-400/10 ring-indigo-400/30',
}
const bots = [
  {
    id: 1,
    name: 'XBot_11',
    state: 'Online',
    statusText: 'Initiated 1m 30s ago',
    description: 'test case file',
  },
  {
    id: 2,
    name: 'untitledBot',
    state: 'Offline',
    statusText: 'Initiated 1m 32s ago',
    description: 'test case file',
  },
  {
    id: 3,
    name: 'XBot_007',
    state: 'Error',
    statusText: 'Initiated 30m 32s ago',
    description: 'test case file',
  },
]
const stats = [
  { name: 'Points', value: ref((() => this.$store.state.user.points)) },
  { name: 'Tokens', value: '0', unit: 'tokens' },
  { name: 'Number of bots', value: '0' },
  { name: 'Success rate', value: '98.5%' },
]
const secondaryNavigation = [
  { name: 'Overview', href: '#', current: true },
  { name: 'Settings', href: '#', current: false },
  { name: 'Usage stats', href: '#', current: false }
]
const secondaryNavigationRecommendation = [
  { name: 'Latest', href: '#', current: true },
  { name: 'Top-rated', href: '#', current: false },
  { name: 'Most-visited', href: '#', current: false },
  { name: 'You may like', href: '#', current: false }
]



</script>

<script>

import { MagnifyingGlassCircleIcon } from '@heroicons/vue/20/solid';

export default {
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  data() {
    return {
      usageStats: [],
      Mybots: [], // 存储从后端获取的 bots 数据
      reviews: [],
      editForm: {
        username: '',
        bio: '',
        selectedFile: null,
      },
      showEditBioPopup: false,
      showRename: false,
      showEditAvatars: false,
      showRecharge: false,
      showConvert: false,
      rechargeAmount: '',
      convertPoints: '',
      selectedOption: 0,
      options: ['News', 'My custom bot', 'usage stats'],
    };
  },
  methods: {
    formatDate(isoDate) {
      if (!isoDate) return "No recent interactions";
      const date = new Date(isoDate);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份从0开始
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },

    handleFileChange(event) {
      this.editForm.selectedFile = event.target.files[0]; // 获取选择的文件
    },
    openEditBio() {
      this.editForm.bio = this.user.bio;
      this.showEditBioPopup = true;
    },
    confirmEditBio() {
      this.$store.dispatch('updateBio', this.editForm.bio).then(success => {
        if (success) {
          alert(`updateBio successfully!`);
        } else {
          alert("updateBio failed.");
        }
      }).catch(error => {
        console.log("An error occurred during updateBio:", error);
      });
      this.showEditBioPopup = false;
    },
    confirmRename() {
      this.$store.dispatch('rename', this.editForm.username).then(success => {
        if (success) {
          alert(`rename successfully!`);
        } else {
          alert("rename failed.");
        }
      }).catch(error => {
        console.log("An error occurred during rename:", error);
      });
      this.showRename = false;
    },
    uploadImage() {
      if (this.editForm.selectedFile !== null) {
        this.$store.dispatch('EditAvatars', this.editForm.selectedFile).then(success => {
          if (success) {
            alert(`EditAvatars successfully!`);
          } else {
            alert("EditAvatars failed.");
          }
        }).catch(error => {
          console.log("An error occurred during EditAvatars:", error);
        });
        this.showEditAvatars = false;
      } else {
        alert("please upload a picture");
      }

    },
    confirmRecharge() {
      if (this.rechargeAmount !== '') {
        this.$store.dispatch('recharge', this.rechargeAmount).then(success => {
          if (success) {
            alert(`Recharged successfully! Current points: ${this.user.points}`);
          } else {
            alert("Recharge failed.");
          }
        }).catch(error => {
          console.log("An error occurred during recharge:", error);
        });

        this.closePopup();
      } else {
        alert('Please enter points to recharge');
      }
    },
    closePopup() {
      this.showRecharge = false;
    },
    convertPointsToTokens() {
      if (this.convertPoints !== '') {
        const pointsToConvert = parseInt(this.convertPoints);
        if (pointsToConvert <= this.user.points) {

          this.$store.dispatch('redeem', pointsToConvert).then(success => {
            if (success) {
              alert(`redeem successfully! Current points: ${this.user.points}`);
            } else {
              alert("redeem failed.");
            }
          }).catch(error => {
            console.log("An error occurred during recharge:", error);
          });
          this.closeConvertPopup();

        } else {
          alert('Insufficient points');
        }
      } else {
        alert("Enter points to redeem");
      }
    },
    closeConvertPopup() {
      this.showConvert = false;
    },
    selectOption(index) {
      this.selectedOption = index;
    },
    navigateToUpload() {
      this.$router.push('/upload');
    },
  },
  mounted() {
    const isLoggedIn = this.$store.state.user.isLoggedIn;  // 从 Vuex 中获取 email
    if (!isLoggedIn) {
      this.$router.push('/login'); // 在页面加载时获取用户数据
    } else {
      const email = this.$store.state.user.email;  // 从 Vuex 中获取 email
      if (email) {
        this.$store.commit('updateEmail', email);
        this.$store.dispatch('fetchUserByEmail', email);  // 在页面加载时获取用户数据
      }

      // 评论
      axios
        .get(`/user/comments?email=${email}`)
        .then((response) => {
          this.reviews = response.data; // 将数据存储到 reviews
        })
        .catch((error) => {
          console.error("Failed to fetch user comments:", error);
        });

      // 机器人数量
      axios
        .get(`/user/bots?email=${email}`)
        .then((response) => {
          this.Mybots = response.data; // 获取 bots 数据
        })
        .catch((error) => {
          console.error("Failed to fetch bots:", error);
        });
      // 交互统计
      axios.post('/user/getUsageStats', new URLSearchParams({ email }))
        .then(response => {
          this.usageStats = response.data; // 将返回的数据存储到 usageStats
        })
        .catch(error => {
          console.error("Error fetching usage stats:", error);
        });
      // 获取用户创建的bots
      axios.get('/bots/userBots', {
        params: { id: this.$store.state.user.email },
      }).then(response => {
        this.bots = response.data;
      }).catch(error => {
        console.error("Failed to fetch user bots:", error);
      });
    }
  }
};
</script>

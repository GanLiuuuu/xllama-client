<template>
  <div v-if="user" class="user-home">
    <!--Home Page-->
    <router-link :to="`/home`">
      <button
          type="button"
          class="rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-white/20"
      >
        Back
      </button>
    </router-link>

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
            <div class="order-first flex-none rounded-full bg-indigo-400/10 px-2 py-1 text-xs font-medium text-indigo-400 ring-1 ring-inset ring-indigo-400/30 sm:order-none">Student</div>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-1 bg-gray-700/10 sm:grid-cols-2 lg:grid-cols-4">
            <div v-for="(stat, statIdx) in stats" :key="stat.name" :class="[statIdx % 2 === 1 ? 'sm:border-l' : statIdx === 2 ? 'lg:border-l' : '', 'border-t border-white/5 px-4 py-6 sm:px-6 lg:px-8']">
              <p class="text-sm/6 font-medium text-gray-400">{{ stat.name }}</p>
              <p class="mt-2 flex items-baseline gap-x-2">
                <span class="text-4xl font-semibold tracking-tight text-white">{{ stat.name === 'Points' ? user.points : stat.name==='Tokens'? user.tokens: stat.name ==="Number of bots"? Mybots.length : stat.value }}</span>
                <span v-if="stat.unit" class="text-sm text-gray-400">{{ stat.unit }}</span>
              </p>
            </div>
          </div>
        </div>

      </header>

      <!--self intro-->>
      <div v-if="currentSubNavItem == 'Overview' ">
        <div class="flex flex-col items-start justify-between gap-x-8 gap-y-4 bg-gray-700/10 px-4 py-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <div>
            <div class="flex items-center gap-x-3">
              <h1 class="flex gap-x-3 text-base/7">
                <span class="font-semibold text-white">📝 Self introduction</span>
                <span class="text-gray-600"></span>

              </h1>
            </div>
            <div class="flex items-center gap-x-3">
              <p class="flex gap-x-3 text-base/7">
                <span class="font-text text-white">{{ user.bio }}</span>
                <span class="text-gray-600"></span>

              </p>
            </div>
          </div>
        </div>

        <div class="mt-6">
          <h2 class="text-lg font-semibold text-white">📢 Reviews</h2>
          <div v-if="reviews.length" class="mt-4 space-y-4 bg-gray-800 p-4 rounded-lg shadow-lg">
            <!-- 单条评论卡片 -->
            <div v-for="review in reviews" :key="review.reviewDate" class="review-card border-b border-gray-700 pb-4">
              <!-- 评论者信息 -->
              <div class="review-header flex items-center justify-between">
                <p class="text-sm font-bold text-indigo-400">{{ review.reviewerName }}</p>
                <p class="text-xs text-gray-500">{{ formatDate(review.reviewDate) }}</p>
              </div>

              <!-- 评论内容 -->
              <p class="mt-2 text-gray-300">{{ review.reviewText }}</p>

              <!-- 星星评分 -->
              <div class="review-rating mt-2 flex items-center">
                <span class="text-sm font-medium text-gray-400">Rating:</span>
                <span class="rating-stars ml-2 text-yellow-400 text-lg">
                        <span v-for="n in review.rating" :key="n">🌟</span>
                      </span>
              </div>
            </div>
          </div>
          <p v-else class="text-gray-500">No reviews available.</p>
        </div>

      </div>
      <div v-if="currentSubNavItem == 'My Bots' ">
        <!--TODO: -->
      </div>

      <!--setting-->
      <div v-if="currentSubNavItem == 'Settings' " style="padding: 40px">
        <EditForm2/>
      </div>

    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, computed} from 'vue';
import EditForm2 from "../components/EditForm2.vue";

const user = ref(null); // 存储用户数据
const currentNavItem = ref('Home');
const currentSubNavItem = ref('Overview');

function selectSubNavItem(item) {
  currentSubNavItem.value = item.name;
  item.current = true;
  secondaryNavigation.forEach(item1 => {
    if(item1!==item){
      item1.current = false;
    }
  });
}


const stats = [
  { name: 'Points', value: ref((() => user.points))},
  { name: 'Tokens', value: '0', unit: 'tokens' },
  { name: 'Number of bots', value: '0' },
  { name: 'Success rate', value: '98.5%' },
]
const secondaryNavigation = [
  { name: 'Overview', href: '#', current: true },
  { name: 'My Bots', href: '#', current: false },
  { name: 'Settings', href: '#', current: false },
]

const props = defineProps({
  email: String, // 从父组件或动态路由中接收邮箱
});

// 获取用户信息
async function fetchUser() {
  try {
    const response = await axios.get(`/user/details`, { params: { email: props.email } });
    console.log("Fetched user data:", response.data); // 调试信息
    user.value = response.data; // 更新用户数据
  } catch (error) {
    console.error('Failed to fetch user data:', error);
  }
}

// 组件挂载时调用
onMounted(() => {
  if (props.email) {
    console.log(`Fetching data for email: ${props.email}`); // 调试信息
    fetchUser();
  } else {
    console.error('Email prop is missing.');
  }
});

</script>


<script>
import axios from "axios";

export default {
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  methods:{
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
  },
  data() {
    return {
      usageStats:[], //使用记录
      Mybots: [], // 存储从后端获取的 bots 数据
      reviews: [], //评论
    };
  },
  mounted () {
    const isLoggedIn = this.$store.state.user.isLoggedIn;  // 从 Vuex 中获取 email
    if (!isLoggedIn) {
      this.$router.push('/login'); // 在页面加载时获取用户数据
    }else {
      const email = this.$store.state.user.email;  // 从 Vuex 中获取 email
      if (email) {
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
    }
  }
};
</script>

<style scoped>
.user-home {
  padding: 20px;
}
</style>
  
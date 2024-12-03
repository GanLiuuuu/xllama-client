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
                <span class="text-4xl font-semibold tracking-tight text-white">{{ stat.name === 'Points' ? user.points : stat.name==='Tokens'? user.tokens: stat.name ==="Number of bots"? Mybots.length :stat.name ==="Comments"? reviews.length: stat.value }}</span>
                <span v-if="stat.unit" class="text-sm text-gray-400">{{ stat.unit }}</span>
              </p>
            </div>
          </div>
        </div>

      </header>

      <!--self intro-->>
      <div v-if="currentSubNavItem == 'Overview' ">
        <div class="flex flex-col items-start justify-between gap-x-8 gap-y-4 bg-gray-700/10 px-4 py-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <div class="rounded-lg bg-gray-1000/50 p-4 w-full">
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
        </div>

        <br>

        <!-- 按钮 -->
        <button
            class="rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-white/20"
            @click="openModal"
        >
          Write a comment
        </button>

        <!-- 弹窗 -->
        <div
            v-if="isModalOpen"
            class="fixed inset-0 bg-black/50 flex items-center justify-center"
        >
          <div class="bg-white rounded-lg shadow-lg w-96 p-6">
            <!-- 标题 -->
            <h2 class="text-lg font-semibold mb-4 text-gray-800">
              Write a comment
            </h2>

            <!-- 评论输入框 -->
            <textarea
                v-model="comment"
                class="w-full border border-gray-300 rounded-md p-2 text-gray-800 focus:outline-none focus:ring focus:ring-indigo-200 mb-4"
                placeholder="Enter your comment here"
                rows="4"
            ></textarea>

            <!-- 评分星星 -->
            <div class="flex justify-center items-center mb-4">
          <span
              v-for="star in 5"
              :key="star"
              @click="setRating(star)"
              :class="{
              'text-yellow-400': star <= rating,
              'text-gray-300': star > rating,
            }"
              class="cursor-pointer text-2xl"
          >
            ★
          </span>
            </div>

            <!-- 按钮 -->
            <div class="flex justify-between">
              <button
                  @click="submitComment"
                  class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
              >
                Submit
              </button>
              <button
                  @click="closeModal"
                  class="rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
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
                <p class="text-xs text-gray-500">{{ review.reviewDate.slice(0,10)+" "+review.reviewDate.slice(11,19) }}</p>
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
        <EditForm2 :email="email" />
      </div>

    </div>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import {ref, onMounted, computed} from 'vue';
import EditForm2 from "../components/EditForm2.vue";
import axios from "axios";
import router from "../router";

const isModalOpen = ref(false);
const comment = ref('');
const rating = ref(0);

const user = ref(null); // 存储用户数据
const currentNavItem = ref('Home');
const currentSubNavItem = ref('Overview');

const usageStats = ref([])
const Mybots = ref([])
const reviews = ref([])

const store = useStore();

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
  { name: 'Comments', value: '98.5%' },
]
const secondaryNavigation = [
  { name: 'Overview', href: '#', current: true },
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

  axios
      .get(`/user/comments?email=${props.email}`)
      .then((response) => {
        reviews.value = response.data;
      })
      .catch((error) => {
        console.error("Failed to fetch user comments:", error);
      });

  // 获取机器人数据
  axios
      .get(`/user/bots?email=${props.email}`)
      .then((response) => {
        Mybots.value = response.data;
      })
      .catch((error) => {
        console.error("Failed to fetch bots:", error);
      });

  // 获取交互统计数据
  // axios
  //     .post('/user/getUsageStats', new URLSearchParams({ props.email }))
  //     .then((response) => {
  //       usageStats.value = response.data;
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching usage stats:", error);
  //     });

});

// 打开模态框
const openModal = () => {
  isModalOpen.value = true;
};

// 关闭模态框
const closeModal = () => {
  isModalOpen.value = false;
  comment.value = '';
  rating.value = 0;
};

// 设置评分
const setRating = (star) => {
  rating.value = star;
};

// 提交评论
const submitComment = () => {
  if (!comment.value.trim()) {
    alert('Please enter a comment.');
    return;
  }
  if (rating.value === 0) {
    alert('Please select a rating.');
    return;
  }

  alert(`Comment: ${comment.value}, Rating: ${rating.value}`);

  // 示例：Axios 请求
  axios.post('user/writeComments', {
    comment: comment.value,
    rating: rating.value,
    email1: props.email,
    email2: store.state.user.email
  })
      .then(() =>{
        alert('Comment submitted successfully!')
        return axios.get(`/user/comments?email=${props.email}`);
      })
      .then((response) => {
        reviews.value = response.data;
      })
      .catch(() => alert('Failed to submit comment.'));

  closeModal();
};

</script>


<script>
export default {
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
};
</script>

<style scoped>
.user-home {
  padding: 20px;
}
</style>
  
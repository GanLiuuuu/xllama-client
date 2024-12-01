<template>
  <div class="bg-white rounded-xl">
    <div class="mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
      <!-- Product -->
      <div class="lg:grid lg:grid-cols-7 lg:grid-rows-1 lg:gap-x-8 lg:gap-y-10 xl:gap-x-16">
        <!-- Product image -->
        <!-- <div class="lg:col-span-4 lg:row-end-1">
          <img :src="product.imgSrc" alt="error"
            class="aspect-[4/3] w-full rounded-lg bg-gray-100 object-cover" />
        </div> -->

        <!-- Product details -->
        <div class="mt-14 max-w-2xl sm:mt-16 lg:col-span-5 lg:col-start-2 lg:row-span-2 lg:row-end-2 lg:mt-0 lg:max-w-none">
          <div class="flex flex-col-reverse">
            <div class="mt-4">
              <h1 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{{ product.name }}</h1>
              <p class="mt-2 text-sm text-gray-500">
                Version {{ product.version }} (Updated {{ getFormattedDate(product.createdAt) }})
              </p>
              <p class="mt-2 text-sm text-gray-500">
                <span class="font-bold text-gray-900">{{ product.views }}</span> views
              </p>
            </div>

            <div>
              <div class="flex items-center">
                <StarIcon v-for="rating in [0, 1, 2, 3, 4]" :key="rating"
                  :class="[average > rating ? 'text-yellow-400' : 'text-gray-300', 'size-5 shrink-0']"
                  aria-hidden="true" />
              </div>
            </div>
          </div>

          <p class="mt-6 text-sm text-gray-700">{{ product.description }}</p>

          <div class="border-gray-200 pt-10">
            <h3 class="text-lg font-bold text-gray-900">Highlights</h3>
            <div class="mt-4">
              <ul role="list" class="list-disc space-y-1 pl-5 text-sm/6 text-gray-500 marker:text-gray-300">
                <li v-for="highlight in product.highlight" :key="highlight" class="pl-2 text-black">{{ highlight }}</li>
              </ul>
            </div>
          </div>

          <div class="border-gray-200 pt-10">
            <h3 class="text-lg font-bold text-gray-900">Price</h3>
            <div class="mt-4">
              <ul role="list" class="list-disc space-y-1 pl-5 text-sm/6 text-gray-500 marker:text-gray-300">
                <li class="pl-2 text-black">{{ product.price }} token/question</li>
              </ul>
            </div>
          </div>

          <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
            <button type="button"
              class="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 col-span-2"
              >
              Add to My Bot List</button>
          </div>
        </div>

        <div class="mx-auto mt-16 w-full max-w-2xl lg:col-span-5 lg:col-start-2 lg:mt-0 lg:max-w-none">
          <TabGroup as="div">
            <div class="border-b border-gray-200">
              <TabList class="-mb-px flex space-x-8">
                <Tab as="template" v-slot="{ selected }">
                  <button
                    :class="[selected ? 'border-indigo-600 text-indigo-600 focus:outline-none' : 'border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-800 focus:outline-none', 'whitespace-nowrap border-b-2 py-6 text-sm font-medium focus:outline-none'] ">Customer
                    Reviews</button>
                </Tab>
                <Tab as="template" v-slot="{ selected }">
                  <button
                    :class="[selected ? 'border-indigo-600 text-indigo-600 focus:outline-none' : 'border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-800 focus:outline-none', 'whitespace-nowrap border-b-2 py-6 text-sm font-medium focus:outline-none']">FAQ</button>
                </Tab>
              </TabList>
            </div>
            <TabPanels as="template">
              <TabPanel class="-mb-10">
                <div class="flex items-start space-x-4 -mb-10">
                  <div class="shrink-0 flex-none py-10">
                    <img class="inline-block size-10 rounded-full" :src="user.avatarUrl" alt="" />
                  </div>
                  <div class="min-w-0 flex-1 pt-10">
                    <form action="#" class="relative">
                      <textarea rows="1" name="comment" id="comment" v-model="comment" @focus="handleFocus" @blur="handleBlur" class="rounded-lg block w-full resize-none bg-gray-100 px-3 py-1.5 text-sm/6 text-black placeholder:text-gray-400 border-none focus:bg-white" placeholder="Add your comment..." />
                    </form>
                  </div>
                </div>
                <div v-if = "isFocused" class="flex">
                  <p class="ml-14 text-sm text-gray-500">Rating:</p>
                  <div class="flex-1">
                    <div class="flex items-center ml-1">
                      <!-- 渲染星星 -->
                        <StarIcon
                        id = 'star'
                        v-for="(star, index) in [0, 1, 2, 3, 4]"
                        :key="index"
                        :class="[
                          (hoverRating >= index + 1 || rating >= index + 1) ? 'text-yellow-400' : 'text-gray-300',
                          'size-5 shrink-0 cursor-pointer','focus:outline-none'
                        ]"
                        aria-hidden="true"
                        @mouseover="hoverRating = index + 1"
                        @mouseleave="hoverRating = 0"
                        @click="rating = index + 1"
                      />
                    </div>
                  </div>
                  <button 
                    type = "submit"
                    :class="[rating === 0 ? 'ml-auto mt-4 -mb-4 rounded-md bg-gray-500 px-4 py-2 text-white text-sm font-medium' : 'ml-auto mt-4 -mb-4 rounded-md bg-indigo-600 px-4 py-2 text-white text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500']"
                    @click="postComment"
                    >
                    Post
                  </button>
                </div>


                <div v-for="(review, reviewIdx) in reviews" :key="review.id"
                  class="flex space-x-4 text-sm text-gray-500">
                  <div class="flex-none py-10">
                    <img :src="review.avatarUrl" alt="" class="size-10 rounded-full bg-gray-100" />
                  </div>
                  <div :class="[reviewIdx === 0 ? '' : 'border-t border-gray-200 w-full', 'py-10']">
                    <h3 class="font-medium text-gray-900">{{ review.user }}</h3>
                    <p>
                      {{ getFormattedDate(review.date) }}
                    </p>

                    <div class="mt-4 flex items-center">
                      <StarIcon v-for="rating in [0, 1, 2, 3, 4]" :key="rating"
                        :class="[review.rating > rating ? 'text-yellow-400' : 'text-gray-300', 'size-5 shrink-0']"
                        aria-hidden="true" />
                    </div>
                    <div class="mt-4 text-sm/6 text-gray-500" v-html="review.content" />
                  </div>
                </div>                
              </TabPanel>

              <TabPanel class="text-sm text-gray-500">
                <dl>
                  <template v-for="faq in faqs" :key="faq.question">
                    <dt class="mt-10 font-medium text-gray-900">{{ faq.question }}</dt>
                    <dd class="mt-2 text-sm/6 text-gray-500">
                      <p>{{ faq.answer }}</p>
                    </dd>
                  </template>
                </dl>
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { StarIcon } from '@heroicons/vue/20/solid'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/vue'
import { ref, onMounted } from 'vue';
import axios from 'axios';
import dayjs from 'dayjs';
const isFocused = ref(false);
const isLoading = ref(true);
const errorMessage = ref(null);
const average = ref(4); //初始average为0


function getFormattedDate(date, format = "MMMM D, YYYY") {
  return date ? dayjs(date).format(format) : null;
}

const product = ref({
  name: 'Application UI Icon Pack',
  version: '1.0',
  createdAt: '2024-05-06',
  price: '220',
  views: '1,200',
  description:
    'The Application UI Icon Pack comes with over 200 icons in 3 styles: outline, filled, and branded. This playful icon pack is tailored for complex application user interfaces with a friendly and legible look.',
  highlight: [
    '200+ SVG icons in 3 unique styles',
    'Compatible with Figma, Sketch, and Adobe XD',
    'Drawn on 24 x 24 pixel grid',
  ],
  imgSrc: 'https://tailwindui.starxg.com/plus/img/ecommerce-images/product-page-05-product-01.jpg',
}); //初始product为空

const reviews = ref([
    {
      id: 1,
      rating: 5,
      content: `
          <p>This icon pack is just what I need for my latest project. There's an icon for just about anything I could ever need. Love the playful look!</p>
        `,
      date: '2021-07-16',
      user: 'Emily Selman',
      avatarUrl:
        'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80',
    },
    {
      id: 2,
      rating: 5,
      content: `
          <p>Blown away by how polished this icon pack is. Everything looks so consistent and each SVG is optimized out of the box so I can use it directly with confidence. It would take me several hours to create a single icon this good, so it's a steal at this price.</p>
        `,
      date: '2021-07-12',
      user: 'Hector Gibbons',
      avatarUrl:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80',
    },
  ]
); //初始reviews为空

const faqs = ref([{
    question: 'What format are these icons?',
    answer:
      'The icons are in SVG (Scalable Vector Graphic) format. They can be imported into your design tool of choice and used directly in code.',
  },
  {
    question: 'Can I use the icons at different sizes?',
    answer:
      "Yes. The icons are drawn on a 24 x 24 pixel grid, but the icons can be scaled to different sizes as needed. We don't recommend going smaller than 20 x 20 or larger than 64 x 64 to retain legibility and visual balance.",
  }]
); //初始faq为空

const props = defineProps({
  botId:{
    type: Number,
    required: true,
  }
});

async function fetchBotDetail(id) {
  try {
    const response = await axios.get(`/bots/botInfo`, {
      params: { id }
    }
    ); // 发送 GET 请求
    response.data.highlight = response.data.highlight.split(';'); 
    return response.data; // 返回数据
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch bot details');
  }
}

async function fetchBotReviews(id) {
  try {
    const response = await axios.get(`/bots/botReviews`, {
      params: { id },
    }); // 请求 bot 的 reviews 信息
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch bot reviews');
  }
}

async function fetchAverageRating(id) {
  try {
    const response = await axios.get(`/bots/avg`, {
      params: { id },
    }); // 请求 bot 的 reviews 信息
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch bot average rating');
  }
}

async function fetchFAQs(id) {
  try {
    const response = await axios.get(`/bots/botFAQs`, {
      params: { id },
    }); // 请求 bot 的 reviews 信息
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch bot FAQs');
  }
}

onMounted(async () => {
  try{
    product.value = await fetchBotDetail(props.botId); // 加载数据
    if (!product.value) {
      throw new Error('Bot not found'); // 如果 id 无效，抛出错误
    }
    reviews.value = await fetchBotReviews(props.botId); // 加载 reviews 数据
    average.value = await fetchAverageRating(props.botId); // 加载 reviews 数据
    faqs.value = await fetchFAQs(props.botId); // 加载 reviews 数据
  } catch (error) {
    errorMessage.value = error.message; // 捕获错误
  } finally {
    isLoading.value = false; // 完成加载
  }
});


function handleFocus() {
  isFocused.value = true;
}

function handleBlur() {
  if (!comment.value) {
    isFocused.value = false; 
  }
}


</script>

<script>
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      comment: '',
      rating: 0
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  methods:{
    async postComment() {
      if (this.comment && this.rating) {
        try {
          const formData = new FormData();
          formData.append('user', this.user.email);
          formData.append('bot', this.props.botId);
          formData.append('rating', this.rating);
          formData.append('content', this.comment);

          await axios.post(`/bots/addReview`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }).then(() => {
            this.comment = '';
            this.rating = 0;
            this.isFocused = false;
            Swal.fire({
              title: 'Success!',
              html: `<p style="font-family: poppins;">Comment posted successfully!</p>`,
              icon: 'success',
              confirmButtonText: 'OK',
              allowOutsideClick: false,  
              allowEscapeKey: false
            });
          }).catch((error) => {
            console.log(error.response.data);
          });
          
          const newReviews = await axios.get(`/bots/botReviews`, {
            params: { id:this.props.botId },
          }); // 重加载 reviews 数据
          this.reviews = newReviews.data;
          const newAverage = await axios.get(`/bots/avg`, {
            params: { id:this.props.botId },
          }); // 重加载 average 数据
          this.average = newAverage.data; // 重加载 average 数据
        }
        catch (error) {
          Swal.fire({
            title: 'Oops!',
            html: `<p style="font-family: poppins;">Thers's some thing wrong!</p>`,
            icon: 'error',
            confirmButtonText: 'OK',
            allowOutsideClick: false,  
            allowEscapeKey: false
          });
          throw new Error(error.response?.data?.message || 'Failed to post comment');
        }
      }
      else {
        return;
      }
    }
  },
}
</script>
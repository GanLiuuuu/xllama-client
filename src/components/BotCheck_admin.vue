<template>
  <div class="bg-white rounded-xl w-full">
    <div class="mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
      <!-- Product -->
      <div class="lg:grid lg:grid-cols-7 lg:grid-rows-1 lg:gap-x-8 lg:gap-y-10 xl:gap-x-16">

        <!-- Product details -->
        <div class="mt-14 max-w-2xl sm:mt-16 lg:col-span-5 lg:col-start-2 lg:row-span-2 lg:row-end-2 lg:mt-0 lg:max-w-none">
          <div class="flex flex-col-reverse">
            <div class="mt-4">
              <h1 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{{ product.name }}</h1>
              <p class="mt-2 text-sm text-gray-500">
                Version {{ product.version }} (Updated {{ getFormattedDate(product.createdAt) }})
              </p>
            </div>

            <div>
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
            <h3 class="text-lg font-bold text-gray-900">Expected Price</h3>
            <div class="mt-4">
              <ul role="list" class="list-disc space-y-1 pl-5 text-sm/6 text-gray-500 marker:text-gray-300">
                <li class="pl-2 text-black">{{ product.price }} token/question</li>
              </ul>
            </div>
          </div>



          <div class="flex items-start space-x-4 -mb-10">
            <div class="shrink-0 flex-none py-10">
              <img class="inline-block size-10 rounded-full" :src="user.avatarUrl" alt="" />
            </div>
          </div>

          <div class="flex">
            <button type = "submit" :class="[rating === 0 ? 'ml-auto mt-4 -mb-4 rounded-md bg-gray-500 px-4 py-2 text-white text-sm font-medium' : 'ml-auto mt-4 -mb-4 rounded-md bg-indigo-600 px-4 py-2 text-white text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500']" @click="Fail">
              Fail The Audit
            </button>
          </div>
          <br>
          <div class="flex">
            <button type = "submit" :class="[rating === 0 ? 'ml-auto mt-4 -mb-4 rounded-md bg-gray-500 px-4 py-2 text-white text-sm font-medium' : 'ml-auto mt-4 -mb-4 rounded-md bg-indigo-600 px-4 py-2 text-white text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500']" @click="Pass">
              Pass The Audit
            </button>
          </div>

        </div>

        <div class="mx-auto mt-16 w-full max-w-2xl lg:col-span-5 lg:col-start-2 lg:mt-0 lg:max-w-none">
          <TabGroup as="div">
            <TabPanels as="template">
              <TabPanel class="-mb-10">

              </TabPanel>

              <TabPanel class="text-sm text-gray-500">
                <dl>
                  <template v-for="faq in faqs" :key="faq.question">
                    <dt class="mt-10 font-medium text-gray-900">{{ "Q : " + faq.question }}</dt>
                    <dd class="mt-2 text-sm/6 text-gray-500">
                      <p>{{ "A : " + faq.answer }}</p>
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
import { ref, onMounted, reactive } from 'vue';
import axios from 'axios';
import dayjs from 'dayjs';
import { useStore } from 'vuex';
const isFocused = ref(false);
const isLoading = ref(true);
const errorMessage = ref(null);
const average = ref(4); //初始average为0
const emit = defineEmits(['close']);

const store = useStore();
const user = reactive( {
  email : store.state.user.email,
  avatarUrl: store.state.user.avatarUrl
} );

function getFormattedDate(date, format = "MMMM D, YYYY") {
  return date ? dayjs(date.slice(0, 19)).format(format) : null;
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

const ifSubscribed = ref(false);

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

async function ifSubscribedBot(email, botId) {
  try {
    const response = await axios.get(`/bots/ifSubscribe`, {
      params: { email, botId },
    }); // 请求 bot 的 reviews 信息
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch subscribed info');
  }
}

onMounted(async () => {
  try{
    console.log(props.botId);
    product.value = await fetchBotDetail(props.botId); // 加载数据
    if (!product.value) {
      throw new Error('Bot not found'); // 如果 id 无效，抛出错误
    }
    reviews.value = await fetchBotReviews(props.botId); // 加载 reviews 数据
    average.value = await fetchAverageRating(props.botId); // 加载 reviews 数据
    faqs.value = await fetchFAQs(props.botId); // 加载 reviews 数据
    ifSubscribed.value = await ifSubscribedBot(user.email, props.botId); // 加载 subscribe 数据
  } catch (error) {
    errorMessage.value = error.message; // 捕获错误
  } finally {
    isLoading.value = false; // 完成加载
  }
});

</script>

<script>
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      price:null,
      changed:false
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },

  methods:{
    async Pass() {
        try {
          const formData = new FormData();
          formData.append('bot', this.props.botId);

          await axios.post(`admin/bot/passAudit`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }).then(() => {
            Swal.fire({
              title: 'Success!',
              html: `<p style="font-family: poppins;">Change Price successfully!</p>`,
              icon: 'success',
              confirmButtonText: 'OK',
              showCancelButton: true,
              allowOutsideClick: false,
              allowEscapeKey: false
            });
          }).catch((error) => {
            console.log(error.response.data);
          }).finally(() => {
            console.log("close")
            this.emit('close');
            this.product.price = this.price
            this.price = null
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

    },

    async Fail() {
      try {
        const formData = new FormData();
        formData.append('bot', this.props.botId);

        await axios.post(`admin/bot/failAudit`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(() => {
          Swal.fire({
            title: 'Success!',
            html: `<p style="font-family: poppins;">Change Price successfully!</p>`,
            icon: 'success',
            confirmButtonText: 'OK',
            showCancelButton: true,
            allowOutsideClick: false,
            allowEscapeKey: false
          });
        }).catch((error) => {
          console.log(error.response.data);
        }).finally(() => {
          console.log("close")
          this.emit('close');
          this.product.price = this.price
          this.price = null
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

  },
}
</script>
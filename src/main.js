import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from './axios'
import VueAxios from 'vue-axios'
import './assets/output.css'
import store from './store';

const app = createApp(App)
app.config.globalProperties.$axios = axios
createApp(App).use(router).use(store).use(VueAxios, axios).mount('#app')

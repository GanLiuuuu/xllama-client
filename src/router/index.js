import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../views/LandingPageView.vue'
import HomePage from '../views/HomeView.vue'
import Admin from '../views/AdminView.vue'
import UserDetail from '../views/UserDetail.vue'
import Finetune from '../views/Finetune.vue'
const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: '/',
			component: LandingPage
		},
		{
			path: '/chat',
			component: () => import('../views/Chat.vue')
		},

		{
			path: '/login',
			component: () => import('../views/LoginPageView.vue')
		},
		{
			path: '/register',
			component: () => import('../views/RegisterPageView.vue')
		},

		{
			path: '/home',
			component: HomePage
		},
		{
			path: '/discover',
			component: () => import('../views/DiscoverView.vue')
		},
		{
			path: '/detail',
			component: () => import('../views/BotDetailView.vue')
		},
		{
			path: '/user/:email',
			component: UserDetail,
			props: route => ({
			  email: decodeURIComponent(route.params.email), // 解码邮箱传入组件
			}),
		  },{
			path: '/upload',
			component: () => import('../views/UploadView.vue')
		},{
			path: '/admin',
			component: () => import('../views/AdminView.vue')
		},
		{
			path: '/finetune',
			name: 'Finetune',
			component: () => import('../views/Finetune.vue')
		},
	],
})

export default router
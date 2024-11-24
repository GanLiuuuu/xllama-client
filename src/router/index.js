import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../views/LandingPageView.vue'
import HomePage from '../views/HomeView.vue'
import Admin from '../views/AdminView.vue'
import UserDetail from '../views/UserDetail.vue'
const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: '/',
			component: HomePage
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
			path: '/user/:encodedEmail',
			name: 'user',
			component: UserDetail,
			props: (route) => ({ email: decodeURIComponent(route.params.encodedEmail) }), // 解码邮箱
		},
	],
})

export default router
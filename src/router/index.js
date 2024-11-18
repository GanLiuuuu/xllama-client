import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../views/LandingPageView.vue'
import HomePage from '../views/HomeView.vue'
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
		}
	],
})

export default router
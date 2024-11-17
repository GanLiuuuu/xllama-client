import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import LandingPage from '../views/LandingPageView.vue'
const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: '/',
			component: LandingPage
		},
		{
			path: '/market',
			component: () => import('../views/Market.vue')
		},
		{
			path: '/search',
			component: () => import('../views/Search.vue')
		},
		{
			path: '/settings',
			component: () => import('../views/Setting.vue')
		},
		{
			path: '/chat',
			component: () => import('../views/Chat.vue')
		},
		{
			path: '/profile',
			component: () => import('../views/Profile.vue')
		},
		{
			path: '/login',
			component: () => import('../views/LoginPageView.vue')
		},
		{
			path: '/register',
			component: () => import('../views/RegisterPageView.vue')
		}

	],
})

export default router
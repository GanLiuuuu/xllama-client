import { createRouter, createWebHistory } from 'vue-router'
import test from '../views/Home.vue'
import LandingPage from '../views/LandingPageView.vue'
import HomePage from '../views/HomeView.vue'
const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: '/',
			component: test
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
		},
		{
			path: '/UserProfile',
			component: () => import('../views/UserProfile.vue')
		}

	],
})

export default router
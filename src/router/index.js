import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: '/',
			component: Home
		},
		{
			path: '/market',
			component: () => import('../views/Market.vue')
		},
		{
			path: '/search',
			component: () => import('../views/Search.vue')
		},

	],
})

export default router
<template>
	<div id="app">
	  <router-view></router-view> <!-- 这里将显示当前路由对应的组件 -->
	</div>
  </template>
  
  <script>
  export default {
	data() {
	  return {
		// 判断用户是否登录
		isLoggedIn: !!localStorage.getItem('user'),
	  };
	},
	watch: {
	  $route(to, from) {
		this.isLoggedIn = !!localStorage.getItem('user');
	  },
	},
  };
  </script>
  
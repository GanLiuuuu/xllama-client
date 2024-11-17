<template>
	<div id="app">
	  <router-view></router-view> 
	</div>
  </template>
  
  <script>
  export default {
	data() {
	  return {
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
  
<template>
	<div class="market">
		<h1>Bot Market</h1>
		<div class="product-list">
			<div 
				class="product-item" 
				v-for="product in products" 
				:key="product.id" 
				@click="openProduct(product.id)"
			>
				<img :src="product.image" :alt="product.name" />
				<h2>{{ product.name }}</h2>
				<p>{{ product.price }}</p>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			products: [
				{ id: 1, name: 'Bot 1', price: '￥100', image: 'path/to/image1.jpg' },
				{ id: 2, name: 'Bot 2', price: '￥200', image: 'path/to/image2.jpg' },
				{ id: 3, name: 'Bot 3', price: '￥300', image: 'path/to/image3.jpg' },
				// 添加更多商品
			]
		};
	},
	methods: {
		openProduct(id) {
			this.$router.push({ name: 'ProductDetail', params: { id } });
		}
	}
};
</script>

<style scoped>
.market {
	padding: 20px;
}
.product-list {
	display: flex;
	flex-wrap: wrap;
}
.product-item {
	margin: 10px;
	cursor: pointer;
}
.product-item img {
	width: 150px;
	height: 150px;
}
</style>
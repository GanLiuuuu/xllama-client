<template>
    <div class="auth-container">
        <h1>{{ isLogin ? 'Login' : 'Register' }}</h1>
        <form @submit.prevent="handleSubmit">
            <div>
                <label for="email">Email:</label>
                <input type="email" v-model="email" required />
            </div>
            <div>
                <label for="password">Password:</label>
                <input type="password" v-model="password" required />
            </div>
            <button type="submit">{{ isLogin ? 'Login' : 'Register' }}</button>
            <p @click="toggleForm">{{ isLogin ? 'Need an account? Register' : 'Already have an account? Login' }}</p>
        </form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            isLogin: true,
            email: '',
            password: ''
        };
    },
    methods: {
        handleSubmit() {
            if (this.isLogin) {
                // todo:在这里处理login逻辑
                console.log('Logging in with:', this.email, this.password);
            } else {
                // todo:在这里处理register逻辑
                console.log('Registering with:', this.email, this.password);
            }
        },
        toggleForm() {
            this.isLogin = !this.isLogin;
        }
    }
};
</script>

<style scoped>
.auth-container {
    max-width: 400px;
    margin: auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
}
</style>

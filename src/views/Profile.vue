<template>
  <div class="auth-container">

    <h1>{{ isLogin ? 'Password Login' : 'Register' }}</h1>

    <form @submit.prevent="handleSubmit">
      <!-- Email Input Field -->
      <div class="input-group">
        <label for="email">Email</label>
        <input
            type="email"
            id="email"
            v-model="email"
            placeholder="Please enter email"
            required
        />
      </div>

      <!-- Password Input Field -->
      <div class="input-group">
        <label for="password">Password</label>
        <input
            type="password"
            id="password"
            v-model="password"
            placeholder="Please enter password"
            required
        />
      </div>

      <!-- Forget Password Link -->
      <div class="actions">
        <a href="#">Forget password?</a>
      </div>

      <!-- Login/Register Button Group -->
      <div class="button-group">
        <button type="submit" class="login-button">{{ isLogin ? 'Login' : 'Register' }}</button>
        <button type="button" class="toggle-button" @click="toggleForm">
          {{ isLogin ? 'Register' : 'Login' }}
        </button>
      </div>

      <!-- Agreement Text -->
      <p class="agreement">
        If you have not registered your mailbox, please register your account first.
        <br/>
        By logging in or completing a registration, you agree to the
        <a href="#">User Agreement</a> and <a href="#">Privacy Policy</a>.
      </p>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      isLogin: true,
      email: '',
      password: ''
    };
  },
  mounted() {
    const isLoggedIn = this.$store.state.user.isLoggedIn;  // 从 Vuex 中获取 email
    if (isLoggedIn) {
      this.$router.push('/UserProfile'); // 在页面加载时获取用户数据
    }
  },
  methods: {
    handleSubmit() {
      if (this.isLogin) {
        // Handle login logic here、、
        this.$store.dispatch('login', {
          email: this.email,
          password: this.password
        }).then(success => {
          if (success) {
            alert("Logged in successfully");
            this.$router.push('/UserProfile');  // 登录成功后跳转到个人主页
          } else {
            alert("Login failed. Please check your credentials.");
          }
        }).catch(error => {
          console.log("An error occurred during login:", error);
        });
      } else {
        // Handle register logic here
        axios.post('/user/add', {
          "username": "默认用户名",
          "email": this.email,
          "password": this.password
        }).then(response => {
          alert(response.data); // 注册成功，显示成功信息
        })
            .catch(error => {
              console.log(error)
            });
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
  max-width: 480px;
  margin: auto;
  padding: 30px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.auth-container h1 {
  font-size: 20px;
  color: #333;
  margin-bottom: 20px;
}

.input-group {
  margin-bottom: 20px;
  text-align: left;
}

.input-group label {
  display: block;
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.input-group input {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 4px;
  outline: none;
}

.actions {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.actions a {
  font-size: 12px;
  color: #0066cc;
  text-decoration: none;
}

.button-group {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 20px;
}

.login-button,
.toggle-button {
  width: 48%;
  padding: 10px;
  background-color: #22c55e;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

.login-button:hover,
.toggle-button:hover {
  background-color: #4ade80;
}

.agreement {
  font-size: 12px;
  color: #999;
  margin-top: 20px;
}

.agreement a {
  color: #0066cc;
  text-decoration: none;
}
</style>

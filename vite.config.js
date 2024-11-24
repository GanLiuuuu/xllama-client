import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/apis': { // 获取请求中带 /api 的请求
        target: 'https://smms.app',  // 后台服务器的源
        changeOrigin: true,   // 修改源
        rewrite: (path) => path.replace(/^\/apis/, "")   //  /api 替换为空字符串
      },
      '/chats': { // 获取请求中带 /api 的请求
        target: 'https://api.openai-proxy.org',  // 后台服务器的源
        changeOrigin: true,   // 修改源
        rewrite: (path) => path.replace(/^\/chats/, "")   //  /api 替换为空字符串
      },

    }
  }

})

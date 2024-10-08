<template>
  <div class="hello">
    {{ msg }}
    <div>
      <h1>用户列表</h1>
      <ul>
        <li v-for="user in users" :key="user.id">{{ user.username }} -- {{ user.password }}-- {{ user.bio }}</li>
      </ul>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
export default {
  data () {
    return {
      users: []
    }
  },
  mounted () {

    axios.get('/user/getAll')
        .then(response => {
          this.users = response.data
        })
        .catch(error => {
          console.log(error)
        })
  }
}
</script>
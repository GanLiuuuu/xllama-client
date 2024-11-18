<template>
  <div class="profile-page">
    <!-- 用户基本信息区域 -->
    <div class="profile-info-box">
      <div class="profile-info">
        <div class="avatar-section">
          <img class="avatar" :src="user.avatarUrl" alt="用户头像" />

          <div class="username-section">
            <h2>{{ user.username }}</h2>
          </div>
        </div>

        <div class="stats-section">
          <div class="stat-item">
            <p>{{ user.points }}</p>
            <span>Points</span>
          </div>
          <div class="stat-item">
            <p>{{ user.tokens }}</p>
            <span>Tokens</span>
          </div>
          <div class="stat-item">
            <p>{{ Mybots.length }}</p>
            <span>Bots</span>
          </div>
        </div>
        <button class="Avatars-btn" @click="showAvatarsPopup">Change Avatar</button>
        <button class="rename-btn" @click="showRenamePopup">Rename</button>
        <button class="recharge-btn" @click="showRechargePopup">Recharge points ¥</button>
        <button class="convert-btn" @click="showConvertPopup">Redeem Tokens</button>
      </div>
    </div>

    <hr class="custom-hr"/>

    <!-- 自我介绍编辑框 -->
    <div class="bio-section content-area">
      <h3>Self-introduction</h3>
      <button class="edit-btn" @click="openEditBio">Revise your introduction</button>
      <p>{{ user.bio }}</p>
    </div>

    <!-- 两个横向选项按钮 -->
    <div class="options-bar">
      <div v-for="(option, index) in options"
           :key="index"
           class="option"
           :class="{ active: selectedOption === index }"
           @click="selectOption(index)">
        {{ option }}
      </div>
    </div>

    <!-- 动态内容区域 -->
    <transition name="slide-fade">
      <div class="content-area">
        <div v-if="selectedOption === 0">

          <div v-for="(review, index) in reviews" :key="index" class="review-card">
            <div class="review-header">
              <h4>{{ review.reviewerName }}</h4>
              <span class="review-date">{{ new Date(review.reviewDate).toLocaleString() }}</span>
            </div>

            <p class="review-text">{{ review.reviewText }}</p>

            <div class="review-rating">
              Rating:
              <span class="rating-stars">
            <span v-for="n in review.rating" :key="n">⭐</span>
          </span>
            </div>
          </div>
        </div>

        <div v-if="selectedOption === 1" class="bot-container">
          <h3>My custom bots</h3>
          <div v-if="Mybots.length === 0" class="no-bots">
            <p>No bots created yet.</p>
          </div>
          <div class="bot-list">
            <div v-for="bot in Mybots" :key="bot.botName" class="bot-card">
              <!-- 圆形头像 -->
              <div class="bot-avatar">
                <img :src="bot.avatar || defaultAvatar" alt="Bot Avatar" />
              </div>
              <!-- bot 名称 -->
              <h4 class="bot-name">{{ bot.botName }}</h4>
              <!-- 描述 -->
              <p class="bot-description">{{ bot.botDescription }}</p>
              <!-- 操作按钮 -->
              <button class="action-button">Manage</button>
            </div>
          </div>
        </div>

        <div v-if="selectedOption === 2" class="usage-stats-container">
          <h3 class="section-title">Usage Stats</h3>

          <!-- 没有交互数据时的显示 -->
          <div v-if="usageStats.length === 0" class="no-stats">
            <p>No interaction data available.</p>
          </div>

          <!-- 有交互数据时 -->
          <div v-else class="stats-grid">
            <div v-for="stat in usageStats" :key="stat.bot_id" class="stat-card">
              <!-- Bot 名称 -->
              <div class="card-header">
                <h4 class="bot-name">{{ stat.bot_name }}</h4>
              </div>
              <!-- 交互次数 -->
              <div class="card-body">
                <p class="interaction-count">Interactions: <strong>{{ stat.interaction_count }}</strong></p>
              </div>
              <!-- 最后交互时间 -->
              <div class="card-footer">
                <p class="last-interaction">
                  <i class="icon-clock"></i> Last interaction:
                  <strong>{{ formatDate(stat.last_interaction) || "No recent interactions" }}</strong>
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </transition>

    <!-- 换头像 弹窗 -->
    <div v-if="showEditAvatars" class="popup-overlay">
      <div class="popup">
        <h2>Edit Avatars</h2>

        <input type="file" @change="handleFileChange" accept="image/*" />
        <div class="modal-footer">
          <button @click="showEditAvatars = false">Cancel</button>
          <button @click="uploadImage">OK</button>
        </div>
      </div>
    </div>

    <!-- 重命名 弹窗 -->
    <div v-if="showRename" class="popup-overlay">
      <div class="popup">
        <h2>Rename</h2>

        <textarea v-model="editForm.username"></textarea>
        <div class="modal-footer">
          <button @click="showRename = false">Cancel</button>
          <button @click="confirmRename">OK</button>
        </div>
      </div>
    </div>

    <!-- 充值弹窗 -->
    <div v-if="showRecharge" class="popup-overlay">
      <div class="popup">
        <h2>Recharge points</h2>
        <br>
        <input type="number" v-model="rechargeAmount" placeholder="Enter recharge points"/>
        <div class="modal-footer">
          <button @click="confirmRecharge">Confirm</button>
          <button class="cancel" @click="closePopup">Cancel</button>
        </div>
      </div>
    </div>

    <!-- 积分兑换 Tokens 弹窗 -->
    <div v-if="showConvert" class="popup-overlay">
      <div class="popup">
        <h2>Redeem Tokens</h2>
        <p>Current points: {{ user.points }} (1 point = 100 tokens)</p>
        <br>
        <input type="number" v-model="convertPoints" placeholder="Enter points to redeem" />
        <div class="modal-footer">
          <button @click="convertPointsToTokens">Redeem</button>
          <button class="cancel" @click="closeConvertPopup">Cancel</button>
        </div>
      </div>
    </div>


    <!-- 编辑自我介绍弹窗 -->
    <div v-if="showEditBioPopup" class="popup-overlay">
      <div class="popup">
        <h2>Edit Bio</h2>
        <textarea v-model="editForm.bio"></textarea>
        <div class="modal-footer">
          <button @click="showEditBioPopup = false">Cancel</button>
          <button @click="confirmEditBio">OK</button>
        </div>
      </div>
    </div>
  </div>

</template>


<script>
import axios from "axios";

export default {
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  data() {
    return {
      usageStats:[],
      Mybots: [], // 存储从后端获取的 bots 数据
      reviews: [],
      editForm: {
        username: '',
        bio: '',
        selectedFile: null,
      },
      showEditBioPopup: false,
      showRename: false,
      showEditAvatars: false,
      showRecharge: false,
      showConvert: false,
      rechargeAmount: '',
      convertPoints: '',
      selectedOption: 0,
      options: ['News', 'My custom bot','usage stats'],
    };
  },
  methods: {
    formatDate(isoDate) {
      if (!isoDate) return "No recent interactions";
      const date = new Date(isoDate);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份从0开始
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },

    handleFileChange(event) {
      this.editForm.selectedFile = event.target.files[0]; // 获取选择的文件
    },
    openEditBio() {
      this.editForm.bio = this.user.bio;
      this.showEditBioPopup = true;
    },
    confirmEditBio() {
      this.$store.dispatch('updateBio', this.editForm.bio).then(success => {
        if (success) {
          alert(`updateBio successfully!`);
        } else {
          alert("updateBio failed.");
        }
      }).catch(error => {
        console.log("An error occurred during updateBio:", error);
      });
      this.showEditBioPopup = false;
    },
    confirmRename() {
      this.$store.dispatch('rename', this.editForm.username).then(success => {
        if (success) {
          alert(`rename successfully!`);
        } else {
          alert("rename failed.");
        }
      }).catch(error => {
        console.log("An error occurred during rename:", error);
      });
      this.showRename = false;
    },
    uploadImage() {
      if (this.editForm.selectedFile !== null) {
        this.$store.dispatch('EditAvatars', this.editForm.selectedFile).then(success => {
          if (success) {
            alert(`EditAvatars successfully!`);
          } else {
            alert("EditAvatars failed.");
          }
        }).catch(error => {
          console.log("An error occurred during EditAvatars:", error);
        });
       this.showEditAvatars = false;
      }else {
        alert("please upload a picture");
      }

    },
    showAvatarsPopup(){
      this.showEditAvatars = true;
    },
    showRenamePopup() {
      this.showRename = true;
    },
    showRechargePopup() {
      this.showRecharge = true;
    },
    showConvertPopup() {
      this.showConvert = true;
    },
    confirmRecharge() {
      if (this.rechargeAmount !== '') {
        this.$store.dispatch('recharge', this.rechargeAmount).then(success => {
          if (success) {
            alert(`Recharged successfully! Current points: ${this.user.points}`);
          } else {
            alert("Recharge failed.");
          }
        }).catch(error => {
          console.log("An error occurred during recharge:", error);
        });

        this.closePopup();
      } else {
        alert('Please enter points to recharge');
      }
    },
    closePopup() {
      this.showRecharge = false;
    },
    convertPointsToTokens() {
      if (this.convertPoints !== '') {
        const pointsToConvert = parseInt(this.convertPoints);
        if (pointsToConvert <= this.user.points) {

          this.$store.dispatch('redeem', pointsToConvert).then(success => {
            if (success) {
              alert(`redeem successfully! Current points: ${this.user.points}`);
            } else {
              alert("redeem failed.");
            }
          }).catch(error => {
            console.log("An error occurred during recharge:", error);
          });
          this.closeConvertPopup();

        } else {
          alert('Insufficient points');
        }
      } else {
        alert("Enter points to redeem");
      }
    },
    closeConvertPopup() {
      this.showConvert = false;
    },
    selectOption(index) {
      this.selectedOption = index;
    },
  },
  mounted () {
    const isLoggedIn = this.$store.state.user.isLoggedIn;  // 从 Vuex 中获取 email
    if (!isLoggedIn) {
      this.$router.push('/login'); // 在页面加载时获取用户数据
    }else {
      const email = this.$store.state.user.email;  // 从 Vuex 中获取 email
      if (email) {
        this.$store.dispatch('fetchUserByEmail', email);  // 在页面加载时获取用户数据
      }

      // 评论
      axios
          .get(`/user/comments?email=${email}`)
          .then((response) => {
            this.reviews = response.data; // 将数据存储到 reviews
          })
          .catch((error) => {
            console.error("Failed to fetch user comments:", error);
          });

      // 机器人数量
      axios
          .get(`/user/bots?email=${email}`)
          .then((response) => {
            this.Mybots = response.data; // 获取 bots 数据
          })
          .catch((error) => {
            console.error("Failed to fetch bots:", error);
          });
      // 交互统计
      axios.post('/user/getUsageStats', new URLSearchParams({ email }))
          .then(response => {
            this.usageStats = response.data; // 将返回的数据存储到 usageStats
          })
          .catch(error => {
            console.error("Error fetching usage stats:", error);
          });
    }
  }
};
</script>



<style scoped>
/* 自我介绍编辑框样式，和展示区保持一致 */
.bio-section {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  min-height: 100px;
  margin-bottom: 20px;
}

.bio-section h3 {
  display: inline-block;
  margin-right: 10px;
}
/* 页面整体布局 */
.profile-page {
  min-width: 70%;
  width: 90%;
  margin: 0 auto;
  font-family: Arial, sans-serif;
}


/* 灰色大框 */
.profile-info-box {
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 10px;
  margin-top: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.profile-info {
  position: relative;
  display: flex;
  align-items: center;
}

.avatar-section {
  display: flex;
  align-items: center;
}


.username-section {
  flex-grow: 1;
}

.edit-btn {
  background-color: #1DC07F;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.recharge-btn{
  font-size: 15px;

  background-color: #1DC07F;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  position: absolute;
  bottom: 0;
  right: 20.5%;
  width: 15%;
  height: 30%;
}

.Avatars-btn{
  font-size: 13px;
  background-color: #1DC07F;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  position: absolute;
  bottom: 0;
  left: 20%;
  width: 10%;
  height: 20%;
}

.rename-btn{
  font-size: 13px;
  background-color: #1DC07F;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  position: absolute;
  bottom: 0;
  left: 12%;
  width: 7%;
  height: 20%;
}

.convert-btn{
  font-size: 15px;
  background-color: #1DC07F;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  position: absolute;
  bottom: 0;
  right: 4%;
  width: 15%;
  height: 30%;
}


.stats-section {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  width: 40%;
}

.stat-item {
  text-align: center;
}

.stat-item p {
  font-size: 20px;
  font-weight: bold;
}

/* 水平线 */
.custom-hr {
  border: 0;
  height: 2px;
  background-color: #ddd;
  margin: 20px 0;
}

/* 弹窗样式 */
/* 美化弹窗样式 */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 背景半透明 */
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup {
  background-color: white;
  padding: 30px; /* 增加内边距 */
  border-radius: 15px; /* 圆角 */
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2); /* 增加阴影 */
  text-align: center;
  width: 50%; /* 弹窗宽度 */
  height: 45%;
  max-width: 90%; /* 确保在小屏设备上不会太宽 */
}

.popup h2 {
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
}

.popup textarea {
  align-self: center;
  display: block;
  width: 100%;
  height: 60%;
  padding: 10px;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #ddd;
  margin:auto;

}

.popup input {
  align-self: center;
  display: block;
  width: 100%;
  height: 20%;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #ddd;
  margin: auto;

}

.popup button {
  background-color: #1DC07F;
  color: white;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 20px;
  margin-left: 20px;
  margin-top: 30px;
  transition: background-color 0.3s ease;
}

.popup button:hover {
  background-color: #35CE0F; /* 按钮 hover 颜色 */
}

.popup button.cancel {
  background-color: #ccc; /* 取消按钮颜色 */
}

.popup button.cancel:hover {
  background-color: #bbb; /* 取消按钮 hover 颜色 */
}


.popup input, .popup textarea {
  display: block;
  padding: 10px;
  width: 80%;
  border-radius: 5px;
  border: 1px solid #ccc;
}

/* 横向选项按钮 */
.options-bar {
  display: flex;
  justify-content: space-between;
  border-bottom: 2px solid #ddd;
  position: relative;
  margin-bottom: 20px;
}

.option {
  flex-grow: 1;
  flex-basis: 0; /* 基础宽度为0，完全依赖于 flex-grow */
  text-align: center; /* 居中对齐文本 */
  padding: 10px;
  cursor: pointer;
  font-weight: bold;
  color: #333;
  position: relative;
  transition: color 0.3s;
}

/* 当前选中项的样式 */
.option.active {
  color: #1DC07F;
}

.option:not(:last-child)::after {
  content: '';
  position: absolute;
  right: 0;
  top: 10px;
  bottom: 10px;
  width: 2px;
  background-color: #ddd;
}

.option.active::before {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 4px;
  background-color: #1DC07F;
  transition: left 0.3s, right 0.3s;
}

/* 动态内容显示区域 */
.content-area {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  min-height: 200px;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin-right: 20px;
}
.review-card {
  padding: 15px;
  margin: 15px 0;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 标题区域 */
.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  margin-bottom: 10px;
}

/* 评论者名称 */
.review-header h4 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

/* 评论日期 */
.review-date {
  font-size: 12px;
  color: #888;
}

/* 评论内容 */
.review-text {
  margin: 10px 0;
  font-size: 14px;
  color: #555;
}

/* 评分区域 */
.review-rating {
  font-size: 14px;
  color: #555;
}

/* 星级评分 */
.rating-stars {
  color: #f5a623; /* 星星的颜色 */
  margin-left: 5px;
}

.rating-stars span {
  font-size: 16px;
}

/* 主容器 */
.bot-container {
  padding: 20px;
  background-color: #f5f8fa;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin: 20px auto;
  max-width: 1200px;
}

/* 标题 */
h3 {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

/* 无数据提示 */
.no-bots p {
  color: #888;
  font-style: italic;
  font-size: 16px;
}

/* 卡片列表 */
.bot-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

/* 卡片设计 */
.bot-card {
  background-color: white;
  width: 250px;
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-align: center;
}

.bot-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.25);
}

/* 头像 */
.bot-avatar img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin-bottom: 15px;
  border: 4px solid #22c55e;
  transition: border-color 0.3s ease;
}

.bot-avatar img:hover {
  border-color: #16a34a;
}

/* bot 名称 */
.bot-name {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

/* bot 描述 */
.bot-description {
  font-size: 14px;
  color: #666;
  margin-bottom: 15px;
}

/* 按钮 */
.action-button {
  background-color: #22c55e;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.action-button:hover {
  background-color: #16a34a;
  transform: scale(1.05);
}

.usage-stats-container {
  padding: 30px;
  background-color: #f9f9f9;
  border-radius: 16px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  margin: 20px;
}

.section-title {
  font-size: 2rem;
  font-weight: bold;
  color: #2d3748;
  margin-bottom: 20px;
  text-align: center;
}

.no-stats {
  font-size: 1.2rem;
  color: #718096;
  text-align: center;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.stat-card {
  background: linear-gradient(145deg, #e6f7ff, #cceeff);
  border: 1px solid #b3e6ff;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-10px);
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.15);
}

.card-header {
  margin-bottom: 10px;
  text-align: center;
}

.bot-name {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1a202c;
  margin: 0;
}

.card-body {
  margin: 10px 0;
  text-align: center;
}

.interaction-count {
  font-size: 1.2rem;
  color: #4a5568;
}

.card-footer {
  font-size: 1rem;
  color: #718096;
  font-style: italic;
  text-align: center;
}

.icon-clock {
  margin-right: 6px;
  font-size: 1.1rem;
  vertical-align: middle;
  color: #2d3748;
}

</style>

import { createStore } from 'vuex';
import axios from "axios";

const store = createStore({
    state() {
        return {
            user: {
                isLoggedIn: false,
                email: '',
                username: '',
                bio: 'Welcome to my personal page！',
                avatarUrl: '',
                userType: '',
                points: 0,
                tokens: 0,
                bots: 2,
            }
        };
    },
    mutations: {
        updateAvatar(state, avatarUrl) {
            state.user.avatarUrl = avatarUrl + `?timestamp=${new Date().getTime()}`; // 时间戳
        },
        redeemUserPoints(state,points) {
            state.user.points = state.user.points - points;
            state.user.tokens += points * 100;
        },
        updateUserPoints(state,points) {
            state.user.points = state.user.points + points;
        },

        setUserEmail(state, email) {
            state.user.email = email;
            state.user.isLoggedIn = true;
        },
        setUserInfo(state, userInfo) {
            state.user = { ...state.user, ...userInfo };
        },
        updateBio(state, bio) {
            state.user.bio = bio;
        },
        updateName(state, username) {
            state.user.username = username;
        }
    },
    actions: {
        // 登录请求处理
        login({ commit }, { email, password }) {
            return axios.post('/user/login', { email, password })
                .then(response => {
                    if (response.data === "login successful") {
                        commit('setUserEmail', email);  // 更新 Vuex 中的 email
                        return true;  // 表示登录成功
                    } else {
                        return false;  // 表示登录失败
                    }
                })
                .catch(error => {
                    console.error("Login error:", error);
                    return false;  // 请求失败，返回 false
                });
        },

        fetchUserByEmail({ commit }, email) {
            return axios.post('/user/getInformation', { email })  // 使用 POST 请求
                .then(response => {
                    if (response.data) {
                        commit('setUserInfo', response.data);  // 更新 Vuex 中的 user 数据
                    } else {
                        console.error("User not found");
                    }
                })
                .catch(error => {
                    console.error("Error fetching user data:", error);
                });
        },

        recharge({commit}, points){
            const email = this.state.user.email; // 从 Vuex 的 state 中获取当前用户的 email
            return axios.post('/user/recharge', new URLSearchParams({
                email: email,
                points: points.toString()
            }))
                .then(response => {
                    if (response.data === "recharge successful") {
                        commit('updateUserPoints', points);  // 更新 Vuex 中的 points
                        return true;
                    } else {
                        return false;
                    }
                })
                .catch(error => {
                    console.error("Error processing recharge:", error);
                    return false;
                });
        },

        redeem({commit}, points){
            const email = this.state.user.email;
            return axios.post('/user/redeem', new URLSearchParams({
                email: email,
                points: points.toString()
            }))
                .then(response => {
                    if (response.data === "redeem successful") {
                        commit('redeemUserPoints', points);  // 更新 Vuex 中的 points
                        return true;
                    } else {
                        return false;
                    }
                })
                .catch(error => {
                    console.error("Error processing redeem:", error);
                    return false;
                });
        },

        updateBio({commit}, bios){
            const email = this.state.user.email;
            return axios.post('/user/updateBio', new URLSearchParams({
                email: email,
                bios: bios.toString()
            }))
                .then(response => {
                    if (response.data === "updateBio successful") {
                        commit('updateBio', bios);
                        return true;
                    } else {
                        return false;
                    }
                })
                .catch(error => {
                    console.error("Error processing updateBio:", error);
                    return false;
                });

        },
        rename ({commit}, username) {
            const email = this.state.user.email;
            return axios.post('/user/updateName', new URLSearchParams({
                email: email,
                username: username.toString()
            }))
                .then(response => {
                    if (response.data === "updateName successful") {
                        commit('updateName', username);
                        return true;
                    } else {
                        return false;
                    }
                })
                .catch(error => {
                    console.error("Error processing rename:", error);
                    return false;
                });
        },

        EditAvatars ({commit}, avatarFile) {
            const email = this.state.user.email;
            const formData = new FormData();
            formData.append('file', avatarFile);
            formData.append('email', email);
            return axios.post('/user/updateAvatar', formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            })
                .then(response => {
                    if (response.data && response.data.url) {
                        const avatarUrl = response.data.url;
                        commit('updateAvatar', avatarUrl); // 更新 Vuex 中的头像信息
                        return true;
                    } else {
                        console.error("Failed to update avatar:", response.data);
                        return false;
                    }
                })
                .catch(error => {
                    console.error("Error processing avatar update:", error);
                    return false;
                });
        }
    }
});

export default store;

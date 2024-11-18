import { createStore } from 'vuex';
import axios from "axios";
import createPersistedState from 'vuex-persistedstate';  // 导入插件

const store = createStore({
    state() {
        return {
            user: {
                isLoggedIn: false,
                email: '',
                username: '',
                bio: 'Welcome to my personal page',
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
        redeemUserPoints(state, points) {
            state.user.points = state.user.points - points;
            state.user.tokens += points * 100;
        },
        updateUserPoints(state, points) {
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
        login({ commit }, { email, password }) {
            return axios.post('/user/login', { email, password })
                .then(response => {
                    if (response.data === "login successful") {
                        commit('setUserEmail', email);
                        return true;
                    } else {
                        return false;
                    }
                })
                .catch(error => {
                    console.error("Login error:", error);
                    return false;
                });
        },

        fetchUserByEmail({ commit }, email) {
            return axios.post('/user/getInformation', { email })
                .then(response => {
                    if (response.data) {
                        commit('setUserInfo', response.data);
                    } else {
                        console.error("User not found");
                    }
                })
                .catch(error => {
                    console.error("Error fetching user data:", error);
                });
        },

        recharge({ commit }, points) {
            const email = this.state.user.email;
            return axios.post('/user/recharge', new URLSearchParams({
                email: email,
                points: points.toString()
            }))
                .then(response => {
                    if (response.data === "recharge successful") {
                        commit('updateUserPoints', points);
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

        redeem({ commit }, points) {
            const email = this.state.user.email;
            return axios.post('/user/redeem', new URLSearchParams({
                email: email,
                points: points.toString()
            }))
                .then(response => {
                    if (response.data === "redeem successful") {
                        commit('redeemUserPoints', points);
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

        updateBio({ commit }, bios) {
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

        rename({ commit }, username) {
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

        EditAvatars({ commit }, avatarFile) {
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
                        commit('updateAvatar', avatarUrl);
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
    },
    plugins: [
        createPersistedState({
            storage: window.localStorage,  // 使用 localStorage 来持久化数据
            paths: ['user'],  // 只持久化 user 相关的状态
        })
    ]
});

export default store;

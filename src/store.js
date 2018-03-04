import Vue from 'vue'
import Vuex from 'vuex'
import axios from './axios-auth'
import globalAxios from 'axios'
import router from './router'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    idToken: null,
    userID: null,
    user: null,
  },
  getters: {
    user (state) {
      return state.user;
    },
    isAuth (state) {
      return state.idToken !== null;
    }
  },
  mutations: {
    authUser (state, payload) {
      state.idToken = payload.token;
      state.userID = payload.userId;
    },
    storeUser (state, payload) {
      state.user = payload;
    },
    clearDataAuth(state) {
      state.idToken = null;
      state.userID = null;
    }
  },
  actions: {
    autoLogin({commit}) {
      const token = localStorage.getItem('token');
      if (!token) {
        return
      }
      const expirationDate = localStorage.getItem('expirationDate');
      const now = new Date();
      if (now >= expirationDate) {
        return
      }
      const userId = localStorage.getItem('userId');
      commit('authUser', {
        token: token,
        userId: userId,
      })
    },
    setLogoutTimer({commit}, payload) {
      setTimeout(() => {
        commit('clearDataAuth')
      }, payload * 1000)
    },
    signUp ({commit, dispatch}, payload) {
      axios.post('/signupNewUser?key=AIzaSyB8aZAaj0haAxjjw6ofdv-a_DGl5Qk98qY', {
        email: payload.email,
        password: payload.password,
        returnSecureToken: true
      })
        .then(response => {
          console.log(response);
          commit('authUser', {
            token: response.data.idToken,
            userId: response.data.localId,
          });
          const now = new Date();
          const expirationDate = new Date(now.getTime() + response.data.expiresIn * 1000);
          localStorage.setItem('token', response.data.idToken);
          localStorage.setItem('userId', response.data.localId);
          localStorage.setItem('expirationDate', expirationDate);
          dispatch('storeUser', payload);
          dispatch('setLogoutTimer', response.data.expiresIn)
        })
        .catch(error => {
          console.log(error);
        })
    },
    login ({commit, dispatch}, payload) {
      axios.post('/verifyPassword?key=AIzaSyB8aZAaj0haAxjjw6ofdv-a_DGl5Qk98qY', {
        email: payload.email,
        password: payload.password,
        returnSecureToken: true
      })
        .then(response => {
          console.log(response);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + response.data.expiresIn * 1000);
          localStorage.setItem('token', response.data.idToken);
          localStorage.setItem('userId', response.data.localId);
          localStorage.setItem('expirationDate', expirationDate);
          commit('authUser', {
            token: response.data.idToken,
            userId: response.data.localId,
          })
          dispatch('setLogoutTimer', response.data.expiresIn)
        })
        .catch(error => {
          console.log(error);
        })
    },

    logout({commit}) {
      commit('clearDataAuth');
      router.replace('/signin');
      localStorage.removeItem('expirationDate');
      localStorage.removeItem('userId');
      localStorage.removeItem('token');
    },

    storeUser ({commit, state}, payload) {
      if (!state.idToken) {
        return
      }
      globalAxios.post('/users.json' + '?auth=' + state.idToken, payload)
        .then(response => {
          console.log(response);
        })
        .catch(error => {
          console.log(error);
        })
    },

    fetchUser ({commit, state}, payload) {
      if (!state.idToken) {
        return
      }
      globalAxios.get('/users.json' + '?auth=' + state.idToken)
        .then(response => {
          console.log(response);
          const data = response.data;
          const users = [];
          for (let key in data) {
            const user = data[key];
            user.id = key;
            users.push(user);
            console.log(users);
            commit('storeUser', users[0])
          }
        })
        .catch(error => {
          console.log(error);
        })
    }
  }
})

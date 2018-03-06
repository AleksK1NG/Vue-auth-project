import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import Vuelidate from 'vuelidate'

Vue.use(Vuelidate);

axios.defaults.baseURL = 'https://vue-authentication-7d754.firebaseio.com';
axios.interceptors.request.use(config => {
  console.log(config);
  return config
});
axios.interceptors.response.use(response => {
  console.log(response);
  return response;
});


Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');

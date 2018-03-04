import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store'

import Welcome from './components/welcome/Welcome.vue';
import Signup from './components/auth/Signup.vue';
import Signin from './components/auth/Signin.vue';
import Dashboard from './components/dashboard/Dashboard.vue';

Vue.use(VueRouter);

const routes = [
  { path: '/', component: Welcome },
  { path: '/signup', component: Signup },
  { path: '/signin', component: Signin },
  { path: '/dashboard', component: Dashboard, beforeEnter (to, from, next) {
    if (store.state.idToken) {
      next()
    } else {
      next('/signin')
      }
    }
  }
];

export default new VueRouter({mode: 'history', routes})





















// import Vue from 'vue'
// import Router from 'vue-router'
// import Header from './components/header.vue';
//
//
// Vue.use(Router);
//
// export default new Router({
//   routes: [
//     {
//       path: '/',
//       name: 'home',
//       component: Home
//     },
//     {
//       path: '/about',
//       name: 'about',
//       component: About
//     }
//   ]
// })

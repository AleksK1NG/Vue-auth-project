<template>
  <div id="app">
    <app-header></app-header>
    <router-view></router-view>
  </div>
</template>

<script>
  import Header from './components/header/Header.vue';
  export default {
    name: 'app',
    components: {
      'app-header': Header
    },
    created() {
      this.$store.dispatch('autoLogin')
    },
  }
</script>

<style>
  body, html {
    margin: 0;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  }
</style>
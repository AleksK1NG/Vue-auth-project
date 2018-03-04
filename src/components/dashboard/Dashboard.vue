<template>
  <div id="dashboard">
    <h1>Dashboard</h1>
    <p>You logged in:</p>
    <p v-if="email">Your email is: {{ email }}</p>
  </div>
</template>

<script>
// 353 start

  export default {
    computed: {
      email () {
        return !this.$store.getters.user ? false : this.$store.getters.user.email
      }
    },
    created(){
      this.$store.dispatch('fetchUser')
    },
  }
</script>

<style scoped>
  h1, p {
    text-align: center;
  }

  p {
    color: red;
  }
</style>
<template>
  
</template>

<script>
  export default {
    name: "logout",
    created () {
    	this.$cookies.remove('access_token')
      this.$root.isLogged = false
      this.$router.push('/')
    }
  }
</script>

<style scoped>
  
</style>
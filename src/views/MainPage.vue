<template>

</template>

<script>
	export default {
		name: "main-page",
    created () {
      if(this.$root.isLogged) {
        this.$router.push('/sub/main')
      }
      else {
        this.$router.push('/login')
        this.$Progress.fail()
      }
    }
	}
</script>

<style scoped>

</style>

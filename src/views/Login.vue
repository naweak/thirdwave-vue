<template>
	<div id="loginPage" v-if='!$root.isLogged'>
    <h2>Логин</h2>
    <form v-on:submit.prevent="submitLogin()">
      <div class='formColumn'><label for="login">Логин: <input type="text" id="login" v-model="login"></label></div>
      <div class='formColumn'><label for="passwd">Пароль: <input type="password" id="passwd" v-model="passwd"></label></div>
      <div class='formColumn'><button type="submit">YARRR!</button></div>
    </form>
  </div>
  <forbidden v-else reason='Уже залогинен'></forbidden>
</template>

<script>
	export default {
		name: "login",
    data () {
		  return {
		    login: "",
        passwd: ""
      }
    },
    methods: {
		  submitLogin () {
        var that = this
        var vm = that.$root
        $.ajax({
          url: vm.config.api,
          async: false,
          data: {
            method: 'user.getToken',
            login: that.login,
            passwd: that.passwd
          },
          success (data) {
            if(data.success) {
              vm.$cookies.set('access_token', data.success.code, new Date(data.success['expires_in'] * 1000))
              vm.isLogged = true
              vm.$router.push('/')
            }
            else {
              vm.$status (data.error, 'error')
            }
          }
        })
      }
    },
    created () {
      this.$title('Логин')
    }
	}
</script>

<style scoped>

</style>

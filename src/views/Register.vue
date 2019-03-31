<template>
  <div id="register">
    <h2>Регистрация</h2>
    <p><big class='irony'><i>Осторожно, комраде! Двери кагбе ПЫЩЬ! Следующая остановка — Упячка!</i></big></p>
    <form v-on:submit.prevent="submitRegister()">
      <div class="formColumn"><label for="login">Логин: <input type="text" id="login" v-model="login"></label></div>
      <div class="formColumn"><label for="passwd">Пароль: <input type="password" id="passwd" v-model="passwd"></label></div>
      <div class="formColumn"><label for="passwd_verify">Подтверждение пароля: <input type="password" id="passwd_verify" v-model="passwd_verify"></label></div>
      <div class="formColumn"><label for="email">Мыло: <input type="text" id="email" v-model='email'></label></div>
      <div class="formColumn"><label for="invite">Инвайт (необязательно): <input type="text" id="invite" v-model='invite'></label></div>
      <div class="formColumn"><button type="submit">YARRR!</button></div>
    </form>
  </div>
</template>

<script>
export default {
  name: "register",
  data () {
    return {
      login: "",
      passwd: "",
      passwd_verify: "",
      email: "",
      invite: ""
    }
  },
  methods: {
    submitRegister () {
      var that = this
      var vm = that.$root
      $.ajax({
        url: vm.config.api,
        data: {
          method: "user.register",
          login: that.login,
          passwd: that.passwd,
          passwd_verify: that.passwd_verify,
          email: that.email,
          invite: that.invite
        },
        success (data) {
          if(data.success) {
            vm.$status(data.success, 'success')
            vm.$router.push('/')
          }
          else {
            vm.$status(data.error, 'error')
          }
        }
      })
    }
  },
  created () {
    this.$title('Регистрация')
  }
}
</script>

<style scoped>

</style>

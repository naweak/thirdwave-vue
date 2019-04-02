<template>
  <div class="moderator">
    <div class="info">
      <div class="nickname">{{ moderator.username }}</div>
    </div>
    <div class="options">
      <div class="removeModerator">
        <button v-on:click="removeModerator()">Отобрать банхаммер</button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "moderator",
    props: [ 'moderator' ],
    methods: {
      removeModerator () {
        var that = this
        var vm = that.$root
        $.ajax({
          url: vm.config.api,
          data: {
            method: 'sub.removeModerator',
            username: that.moderator.username,
            sub: that.moderator.sub,
            access_token: that.$cookies.get('access_token'),
          },
          success (data) {
            if (data.success) {
              vm.$status(data.success, 'success')
              vm.$emit('update_modlist')
            }
            else {
              vm.$status(data.error, 'error')
            }
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>

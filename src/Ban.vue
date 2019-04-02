<template>
  <div class="ban">
    <span class="term">
      {{ ban['banned_user'] }} забанен лопатой {{ dateFormat(Number(ban['ban_time']) * 1000, $root.config.date) }} до {{ dateFormat(Number(ban['time']) * 1000, $root.config.date) }}
    </span>
    <span class="sub">
      в разделе <router-link :to="'/sub/' + ban.sub">{{ ban.sub }}</router-link>
    </span>
    <span class="moderator">
      модератором {{ ban.moderator }}
    </span>
    <span class="reason">
      по причине <span class="reasonHtml" v-html="ban.reason"></span>
    </span>
    <span class="pardon" v-if="ban.discontinued">
      и разбанен {{ dateFormat(Number(ban['discontinued_in_date']) * 1000, $root.config.date) }}
    </span>
    <div class="options">
      <button class="pardon" v-on:click="pardon()" v-if="!ban.discontinued && !ban.expired">Разбанить</button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "ban",
    props: [ 'ban' ],
    methods: {
      pardon () {
        var that = this
        var vm = that.$root
        $.ajax({
          url: vm.config.api,
          data: {
            method: 'ban.pardon',
            id: that.ban.id,
            access_token: that.$cookies.get('access_token')
          },
          success (data) {
            if (data.success) {
              vm.$status(data.success, 'success')
              vm.$emit('update_banlist')
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
  .ban {
    margin-top: 5px;
    margin-bottom: 5px;
  }
</style>

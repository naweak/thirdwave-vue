<template>
  <div id="modlog" v-if='$root.isLogged'>
    <h2>Модлог</h2>
    <div id="entries">
      <table>
        <thead>
          <tr>
            <td>ID</td>
            <td>Мочератор</td>
            <td>Тип</td>
            <td>ID поста</td>
            <td>ID комментария</td>
            <td>Разлел</td>
            <td>На кого повлияло</td>
            <td>Время</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="entry in entries">
            <td class='id'>{{entry.id}}</td>
            <td class='moderator'>{{entry.moderator}}</td>
            <td class='type'>{{entry.type}}</td>
            <td class='postId'>{{entry.post_id}}</td>
            <td class='commentId'>{{entry.comment_id}}</td>
            <td class='sub'>{{entry.sub}}</td>
            <td class='userModerated'>{{entry.user_moderated}}</td>
            <td class='dateTime'>{{dateFormat(Number(entry.datetime) * 1000, $root.config.date)}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <forbidden reason="Не залогинен" v-else></forbidden>
</template>

<script>
export default {
  name: "modlog",
  data () {
    return {
      entries: []
    }
  },
  methods: {
    loadModlog() {
      var that = this
      var vm = that.$root
      $.ajax({
        url: vm.config.api,
        data: {
          method: "modlog.read",
          access_token: vm.$cookies.get("access_token")
        },
        success (data) {
          if(data.success) {
            that.entries = data.success
            this.$title("Провинности кровавой мочерации")
          }
          else {
            vm.$status(data.error, 'error')
          }
        }
      })
    },
    loadModlogPage () {
      this.loadModlog()
    }
  },
  created () {
    this.loadModlogPage()
  }
}
</script>

<style scoped>
  thead {
    font-weight: bold;
  }
  #modlog > #entries > table > tbody > tr > td, #modlog > #entries > table > thead > tr > td {
    padding: 5px;
  }
</style>

<template>
  <div id="manage">
    <div id="inMyManage" v-if="!$route.params.sub">
      <div id="list" v-if="inMyManageList.length">
        <h2>Управление разделами</h2>
        <h3
          class="subInMyManage"
          v-for="sub in inMyManageList"><router-link :to="{ name: 'manage', params: { sub: sub.address } }">{{ sub.name }}</router-link></h3>
      </div>
    </div>
    <div id="inSub" v-else-if="sub['can_moderate']">
      <h2>Управление разделом <router-link :to="'/sub/' + sub.address">{{ sub.name }}</router-link></h2>
      <div id="summary">
        <h3>Общий вид</h3>
        <form v-on:submit.prevent="submitSummary()">
          <div class="formColumn">
            <label>Имя раздела: <input type="text" id="name" v-model="summary.name"></label>
          </div>
          <div class="formColumn">
            <label><span style="vertical-align: top;">Описание:</span> <textarea id="description" cols="30" rows="10" v-model="summary.description"></textarea></label>
          </div>
          <div class="formColumn">
            <button type="submit">YARRR!</button>
          </div>
        </form>
      </div>
      <div id="bans">
        <h3>Баны</h3>
        <form v-on:submit.prevent="banUser()">
          <div class="formColumn">
            <label>Кого забанить: <input type="text" v-model="ban.username"></label>
          </div>
          <div class="formColumn">
            <label>
              Срок банана:
              <select id="term" v-model="ban.term">
                <option :value="86400">День</option>
                <option :value="86400*7">Неделя</option>
                <option :value="86400*30">Месяц</option>
                <option :value="86400*365">Год</option>
                <option :value="86400*365*2">Джва года</option>
                <option :value="86400*365*200">Дохуя</option>
              </select>
            </label>
          </div>
          <div class="formColumn">
            <label>Причина: <input type="text" v-model="ban.reason"></label>
          </div>
          <div class="formColumn">
            <button type="submit">Бан! Бан! Бан!</button>
          </div>
        </form>
        <div id="banList">
          <ban
            v-for="ban in bans"
            :ban="ban"></ban>
        </div>
      </div>
      <div id="moderators">
        <h3>Модераторы</h3>
        <form v-on:submit.prevent="addMod()" id="addMod">
          <div class="formColumn">
            <label>Никнейм: <input type="text" id="modUsername" v-model="modUsername"></label>
            <button type="submit">Назначить</button>
          </div>
        </form>
        <div id="modList">
          <moderator
            v-for="moderator in moderators"
            :moderator="moderator"></moderator>
        </div>
      </div>
      <div id="reports">
        <h2>Репорты</h2>
        <reports :reports="reports"></reports>
      </div>
    </div>
    <error
      v-else
      :code="403"
      reason="Вы не можете модерировать этот раздел"></error>
  </div>
</template>

<script>
export default {
  name: "manage",
  data () {
    return {
      inMyManageList: [],
      sub: {},
      summary: {},
      ban: {
        username: "",
        term: 86400,
        reason: ""
      },
      bans: [],
      modUsername: "",
      moderators: [],
      reports: []
    }
  },
  methods: {
    inMyManage () {
      var that = this
      var vm = that.$root
      $.ajax({
        url: vm.config.api,
        data: {
          method: "sub.inMyManage",
          access_token: $cookies.get('access_token'),
        },
        success (data) {
          if (data.success) {
            that.inMyManageList = data.success
            that.$title('Управление')
          }
          else {
            vm.$status(data.error, 'error')
          }
        }
      })
    },
    getSub () {
      var that = this
      var vm = that.$root
      $.ajax({
        url: vm.config.api,
        async: false,
        data: {
          method: 'sub.info',
          address: that.$route.params.sub,
          access_token: $cookies.get('access_token'),
        },
        success (data) {
          if (data.success) {
            that.sub = data.success
            that.summary = {
              name: data.success.name,
              description: data.success['raw_description']
            }
            that.$title('Управление разделом ' + data.success.name)
          }
          else {
            vm.$status(data.error, 'error')
          }
        }
      })
    },
    submitSummary () {
      var that = this
      var vm = that.$root
      $.ajax({
        url: vm.config.api,
        type: "POST",
        data: {
          method: "sub.edit",
          address: that.$route.params.sub,
          name: that.summary.name,
          description: that.summary.description,
          access_token: $cookies.get('access_token')
        },
        success (data) {
          if (data.success) {
            vm.$status(data.success, 'success')
            that.getSub()
          }
          else {
            vm.$status(data.error, 'error')
          }
        }
      })
    },
    banUser () {
      var that = this
      var vm = that.$root
      $.ajax({
        url: vm.config.api,
        type: "POST",
        data: {
          method: 'sub.ban',
          username:  that.ban.username,
          address: that.$route.params.sub,
          term: that.ban.term,
          reason: that.ban.reason,
          access_token: that.$cookies.get('access_token')
        },
        success (data) {
          if (data.success) {
            that.ban.username = ''
            that.ban.reason = ''
            that.banList()
            vm.$status(data.success, 'success')
          }
          else {
            vm.$status(data.error, 'error')
          }
        }
      })
    },
    banList () {
      var that = this
      var vm = that.$root
      $.ajax({
        url: vm.config.api,
        data: {
          method: 'ban.listInSub',
          sub: that.$route.params.sub,
          access_token: that.$cookies.get('access_token')
        },
        success (data) {
          if (data.success) {
            that.bans = data.success
          }
          else {
            vm.$status(data.error, 'error')
          }
        }
      })
    },
    loadModList () {
      var that = this
      var vm = that.$root
      $.ajax({
        url: vm.config.api,
        data: {
          method: 'sub.moderators',
          address: that.$route.params.sub,
          access_token: that.$cookies.get('access_token')
        },
        success (data) {
          if (data.success) {
            that.moderators = data.success
          }
          else {
            vm.$status(data.error, 'error')
          }
        }
      })
    },
    addMod () {
      var that = this
      var vm = that.$root
      $.ajax({
        url: vm.config.api,
        data: {
          method: 'sub.addModerator',
          username: that.modUsername,
          sub: that.$route.params.sub,
          access_token: that.$cookies.get('access_token')
        },
        success (data) {
          if (data.success) {
            that.loadModList()
            vm.$status(data.success, 'success')
          }
          else {
            vm.$status(data.error, 'error')
          }
        }
      })
    },
    getReports () {
      var that = this
      var vm = that.$root
      $.ajax({
        url: vm.config.api,
        data: {
          method: 'report.inSub',
          sub: that.$route.params.sub,
          access_token: that.$cookies.get('access_token'),
        },
        success (data) {
          if (data.success) {
            that.reports = data.success
          }
          else {
            vm.$status(data.error, 'error')
          }
        }
      })
    },
    loadPage () {
      if (!this.$route.params.sub) {
        this.inMyManage()
      }
      else {
        this.getSub()
        this.banList()
        this.$root.$on('update_banlist', () => this.banList())
        this.loadModList()
        this.$root.$on('update_modlist', () => this.loadModList())
        this.getReports()
      }
    }
  },
  created () {
    this.loadPage()
  },
  watch: {
    $route () {
      this.loadPage()
    }
  }
}
</script>

<style scoped>

</style>

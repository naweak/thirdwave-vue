<template>
  <div id="subList" v-if="$root.isLogged">
    <h2>Разделы</h2>
    <div class="subInfo" v-for="sub in subs">
      <h3 class="subName"><router-link :to="'/sub/' + sub.address">{{sub.name}}</router-link></h3>
    </div>
  </div>
  <forbidden
    reason="Не залогинен" v-else></forbidden>
</template>

<script>
export default {
  name: "sub-list",
  data: {
    subs: []
  },
  methods: {
    loadSubList() {
      var that = this
      var vm = that.$root
      $.ajax({
        url: vm.config.api,
        async: false,
        data: {
          method: "sub.list",
          access_token: $cookies.get('access_token'),
        },
        success (data) {
          if(data.success) {
            that.subs = data.success
          }
          else {
            vm.$status(data.error, 'error')
          }
        }
      })
    }
  },
  created () {
    this.loadSubList()
  }
}
</script>

<style scoped>

</style>

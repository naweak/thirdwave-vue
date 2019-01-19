<template>
  <div class="post">
    <div id="fromSub" v-if="showFromSub">
      <h2><router-link :to="'/sub/' + post.sub">{{ getSubTitle(post.sub) }}</router-link></h2>
    </div>
    <div class="text" v-html='post.post_text'></div>
    <div class="autograph">
      <span class="username">{{post.author}}</span> написал этот псто {{Number(post['create_time']) * 1000 | moment($root.config.date)}}, <router-link :to="'/comments/' + post.id">#{{post.id}}</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "post",
  props: ['post', 'showFromSub'],
  methods: {
    getSubTitle(sub) {
      var that = this
      var vm = that.$root
      $.ajax({
        url: vm.config.api,
        async: false,
        data: {
          method: "sub.info",
          address: sub,
          access_token: $cookies.get('access_token')
        },
        success (data) {
          if(data.success) {
            window.subInfo = data.success
          }
          else {
            vm.$status(data.error, 'error')
          }
        }
      })
      return subInfo.name
    }
  }
}
</script>

<style scoped>

</style>

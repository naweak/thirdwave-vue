<template>
  <div id="app">
    <vue-progress-bar></vue-progress-bar>
    <status></status>
    <main-menu></main-menu>
    <app-content></app-content>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      msg: "hello world"
    }
  },
  mounted () {
    this.$Progress.finish()
  },
  created () {
    this.$Progress.start()
    this.$router.beforeEach((to, from, next) => {
      if (to.meta.progress !== undefined) {
        let meta = to.meta.progress
        this.$Progress.parseMeta(meta)
      }
      this.$Progress.start()
      next()
    })
    this.$router.afterEach((to, from) => {
      this.$Progress.finish()
    })
    var chromeRegExp = new RegExp('chrome', 'ig')
    if (chromeRegExp.test(window.navigator.userAgent)) {
      this.$router.push('/fuckChrome')
    }
  }
}
</script>

<style>
</style>

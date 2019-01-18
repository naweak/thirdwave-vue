<template>
  <div id="error">
    <h2 id="code">{{code}}</h2>
    <div id="reason">{{reason}}</div>
  </div>
</template>

<script>
  export default {
    name: "error",
    props: ['code', 'reason'],
    created () {
      this.$Progress.fail()
    }
  }
</script>

<style scoped>
  #code {
    color: #cc3333;
  }
</style>

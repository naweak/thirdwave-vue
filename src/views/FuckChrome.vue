<template>
  <div id="fuckChrome">
    <a href="https://www.mozilla.org/en-US/firefox/new/">
      <img id="pic" src="dist/firefox265.png" alt="Firefox is 265% faster than Chrome!">
    </a>
  </div>
</template>

<script>
export default {
  name: "fuck-chrome",
  created () {
    this.$title('ПОПЯЧЬСЯ ХРОМОБЛЯДКЭ!!11')
    this.$Progress.fail()
  }
}
</script>

<style scoped>
  #pic {
    max-width: 700px;
  }
</style>

<template>
  <div id="sandbox">
    <form v-on:submit.prevent="submit()">
      <p>Ваш шедевр:</p>
      <div class="formColumn">
        <textarea id="text" cols="30" rows="10" v-model='text'></textarea>
      </div>
      <div class="formColumn">
        <button type="submit">YARRR!</button>
      </div>
    </form>
    <div id="output" v-html="output"></div>
  </div>
</template>

<script>
export default {
  name: "sandbox",
  data () {
    return {
      text: "",
      output: ""
    }
  },
  methods: {
    submit () {
      var that = this
      var vm = that.$root
      $.ajax({
        url: vm.config.api,
        async: false,
        type: "POST",
        data: {
          method: "sandbox.test",
          text: that.text
        },
        success (data) {
          if (data.success || data.success == '') {
            that.output = data.success
          }
          else {
            vm.$status(data.error, 'error')
          }
        }
      })
    }
  },
  created () {
    this.$title("Песочница")
  }
}
</script>

<style scoped>

</style>

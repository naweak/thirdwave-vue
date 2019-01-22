<template>
  <div id="createSubPage" v-if="$root.isLogged">
    <div class="hello">
      <p>Прежде чем создать раздел:</p>
			<ul>
				<li>Ваш раздел не может быть ни о чем</li>
				<li>Адрес вашего раздела не должен состоять из одной буквы, ибо не понятно — о чем, блять, раздел</li>
			</ul>
    </div>
    <form v-on:submit.prevent="submit()">
      <div class="formColumn">
        <label for="address">Адрес: <input type="text" id="address" v-model="address"></label>
      </div>
      <div class="formColumn">
        <label for="name">Имя: <input type="text" id="name" v-model="name"></label>
      </div>
      <div class="formColumn">
        <label for="description">Описание: <textarea id="description" cols="30" rows="10" v-model="description"></textarea></label>
      </div>
      <div class="formColumn">
        <button type="submit">Создать</button>
      </div>
    </form>
  </div>
  <forbidden
    v-else
    reason="Не залогинен"></forbidden>
</template>

<script>
export default {
  name: "create-sub-page",
  data () {
    return {
      address: "",
      name: "",
      description: ""
    }
  },
  methods: {
    submit () {
      var that = this
      var vm = that.$root
      $.ajax({
        url: vm.config.api,
        async: false,
        data: {
          method: "sub.create",
          address: that.address,
          name: that.name,
          description: that.description,
          access_token: $cookies.get('access_token')
        },
        success (data) {
          if(data.success) {
            vm.$status(data.success, 'success')
            vm.$router.push(`/sub/${that.address}`)
          }
          else {
            that.$status(data.error, 'error')
          }
        }
      })
    }
  }
}
</script>

<style scoped>

</style>

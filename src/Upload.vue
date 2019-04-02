<template>
  <div class="upload" :id="id" v-if="$root.config.imgurEnabled">
    <div class="uploadArea">
      <form enctype="multipart/form-data" method="post" v-on:submit.prevent="upload()">
        <div class="formColumn"><input type="file" class="file"></div>
        <button type="submit">Загрузить</button>
      </form>
    </div>
    <div class="links" v-if="imageLink">
      <p v-if="!notRetard">
        Пояснение для дебилов: просто нажать "Загрузить" недостаточно, чтобы картинка появилась в посте. Нужно добавить либо Markdown-разметку, чтобы в посте была картинка, либо просто ссылку.
        <button class="imNotRetard" v-on:click="imNotRetard()">Я понял</button>
      </p>
      <div class="formColumn">С разметкой: <input type="text" :value="`![${imageLink}](${imageLink})`" class="link markdown"></div>
      <div class="formColumn">Прямая ссылка: <input type="text" :value="imageLink" class="link direct"></div>
      <div class="formColumn"><img :src="imageLink" :alt="imageLink"></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "upload",
    data () {
      return {
        imageLink: "",
        notRetard: $cookies.get('notRetard'),
        id: this.randomId()
      }
    },
    methods: {
      randomId () {
        return `_${Math.floor(Math.random()*10000)}`
      },
      upload () {
        let xhr = new XMLHttpRequest()
        let formData = new FormData()
        let file = document.querySelector(`#${this.id} > .uploadArea > form > .formColumn > .file`).files[0]
        let key = this.$root.config.imgurClientId
        let response
        var that = this
        var vm = that.$root

        formData.append('image', file)
        xhr.open('POST', 'https://api.imgur.com/3/image')
        xhr.setRequestHeader('Authorization', `Client-ID ${key}`)
        xhr.onreadystatechange = function () {
          if (xhr.readyState == XMLHttpRequest.DONE) {
            response = JSON.parse(xhr.responseText)
            console.log(response)
            if (response.success) {
              that.imageLink = response.data.link
            }
            else {
              that.$status(`Ошибка загрузки: ${response.data.error}`, 'error')
            }
          }
        }
        xhr.send(formData)
      },
      imNotRetard () {
        $cookies.set('notRetard', true, Date.now() + 3.154e+7)
        this.notRetard = $cookies.get('notRetard')
      }
    }
  }
</script>

<style scoped>
  .link {
    width: 525px;
  }
</style>

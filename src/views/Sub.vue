<template>
  <div id="sub" v-if="$root.isLogged">
    <div id="info">
      <h2 id="name">{{sub.name}}</h2>
      <details>
        <summary>Описание</summary>
        <div id="description" v-html="sub.description"></div>
      </details>
      <details>
        <summary>Запостить</summary>
        <div id="postForm">
          <form v-on:submit.prevent="submitPost()">
            <p>Ваш шедевр:</p>
            <div class="formColumn"><textarea id="text" cols="30" rows="10" v-model="postText"></textarea></div>
            <div><button type="submit">YARRR!</button></div>
          </form>
        </div>
      </details>
      <details>
        <summary>Потыкать разные фишки</summary>
        <div id="features">
          <div class="loadNewPosts">
            <button v-on:click="loadPosts()">Загрузить новые посты</button>
          </div>
        </div>
      </details>
    </div>
    <div id="posts">
      <post
        v-for="post in posts"
        :post='post'></post>
    </div>
    <div id="nextPosts">
      <post
        v-for="post in next.posts" :post="post"></post>
    </div>
    <div id="loadNextPosts">
      <button v-on:click="loadNextPosts()">Еще? Еще!</button>
    </div>
    <div id="pagination">
      <table>
        <tbody>
          <tr>
            <td>
              <router-link :to="'/sub/' + sub.address + '/' + 0">0</router-link>
            </td>
            <td v-for="page in maxPages">
              <router-link :to="'/sub/' + sub.address + '/' + page">{{page}}</router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <forbidden
    reason="Не залогинен" v-else></forbidden>
</template>


<script>
export default {
  name: "sub-page",
  data () {
    return {
      sub: {},
      posts: [],
      maxPages: Number(),
      pageLinks: [],
      postText: "",
      next: {
        currentPage: Number(this.$route.params.page) || 0,
        posts: []
      }
    }
  },
  methods: {
    loadSubInfo() {
      var that = this
      var vm = that.$root
      $.ajax({
        url: vm.config.api,
        async: false,
        data: {
          method: "sub.info",
          address: that.$route.params.address,
          access_token: $cookies.get('access_token')
        },
        success (data) {
          if(data.success) {
            that.sub = data.success
            that.$title(that.sub.name)
          }
          else {
            vm.$status(data.error, 'error')
            that.$Progress.fail()
            vm.$router.push('/')
          }
        }
      })
    },
    loadPosts () {
      var that = this
      var vm = that.$root
      $.ajax({
        url: vm.config.api,
        async: false,
        data: {
          method: "post.listInSub",
          sub: that.$route.params.address,
          page: that.$route.params.page,
          access_token: $cookies.get('access_token')
        },
        success (data) {
          if(data.success) {
            that.posts = data.success
          }
          else {
            vm.$status(data.error, 'error')
            vm.$Progress.fail()
          }
        }
      })
    },
    loadPagination () {
      var that = this
      var vm = that.$root
      $.ajax({
        url: vm.config.api,
        async: false,
        data: {
          method: "post.totalPagesInSub",
          sub: that.$route.params.address,
          access_token: $cookies.get('access_token')
        },
        success (data) {
          if(data.success || data.success === 0) {
            that.maxPages = data.success
          }
          else {
            that.$status(data.error, 'error')
          }
        }
      })
    },
    loadNextPosts () {
      var that = this
      var vm = that.$root
      $.ajax({
        url: vm.config.api,
        async: false,
        data: {
          method: "post.listInSub",
          sub: that.$route.params.address,
          access_token: $cookies.get('access_token'),
          page: that.next.currentPage + 1
        },
        success (data) {
          if(data.success) {
            that.next.posts = that.next.posts.concat(data.success)
            that.next.currentPage++
          }
          else {
            vm.$status(data.error, 'error')
          }
        }
      })
    },
    loadSub() {
      this.loadSubInfo()
      this.loadPosts()
      this.loadPagination()
    },
    submitPost () {
      var that = this
      var vm = that.$root
      $.ajax({
        url: vm.config.api,
        async: false,
        type: "post",
        data: {
          method: "post.create",
          text: that.postText,
          sub: that.$route.params.address,
          access_token: $cookies.get('access_token')
        },
        success (data) {
          if(data.success) {
            vm.$status(data.success, 'success')
            that.loadPosts()
            that.loadPagination()
            that.postText = ""
          }
          else {
            vm.$status(data.error, 'error')
          }
        }
      })
    }
  },
  created() {
    this.loadSub()
  },
  watch: {
    '$route'() {
      this.loadSub()
    },
    '$route.params.page'() {
      this.next.currentPage = Number(this.$route.params.page)
      this.next.posts = []
    }
  }
}
</script>

<style scoped>

</style>

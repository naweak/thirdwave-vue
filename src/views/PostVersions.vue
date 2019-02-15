<template>
  <div id="postVersions" v-if="$root.isLogged">
    <h2>Версии поста #{{ $route.params.id }}</h2>
    <div id="list" v-if="versions.length">
      <post
        v-for="version in versions"
        :post="version"
        :hide-karma="true"
        :hide-moderation="true"></post>
    </div>
    <div v-else>У этого поста нет версий</div>
  </div>
  <forbidden v-else reason="Не залогинен"></forbidden>
</template>

<script>
  export default {
    name: "post-versions",
    data () {
      return {
        versions: []
      }
    },
    methods: {
      loadVersions () {
        var that = this
        var vm = that.$root
        $.ajax({
          url: vm.config.api,
          async: false,
          data: {
            method: "post.versions",
            id: that.$route.params.id,
            access_token: $cookies.get('access_token')
          },
          success (data) {
            if (data.success) {
              var versions = data.success
              $(versions).each((index, version) => {
                let _version = {
                  id: version['post_id'],
                  author: version['author'],
                  create_time: version['post_time'],
                  post_text: version['text'],
                  editor: version['editor'],
                  ver_time: version['ver_time']
                }
                versions[index] = _version
              })
              that.versions = versions
              that.$title(`Версии поста #${that.$route.params.id}`)
            }
          }
        })
      },
      loadPage () {
        this.loadVersions()
      }
    },
    created () {
      this.loadPage()
    },
    watch: {
      '$route' () {
        this.loadPage()
      }
    }
  }
</script>

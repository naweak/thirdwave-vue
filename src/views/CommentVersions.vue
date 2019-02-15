<template>
  <div id="commentVersions" v-if="$root.isLogged">
    <h2>Версии комментария #{{ $route.params.id }}</h2>
    <div id="list" v-if="versions.length">
      <comment
        v-for="version in versions"
        :comment="version"
        :hideModeration="true"
        :hideKarma="true"></comment>
    </div>
    <div v-else>У этого комментария нет версий</div>
  </div>
</template>

<script>
  export default {
    name: "comment-versions",
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
            method: "comment.versions",
            id: that.$route.params.id,
            access_token: $cookies.get('access_token'),
          },
          success (data) {
            if (data.success) {
              var versions = data.success
              $(data.success).each((index, version) => {
                let _version = {
                  id: version['post_id'],
                  author: version['author'],
                  editor: version['editor'],
                  comment_text: version['text'],
                  create_time: version['post_time'],
                  raw_text: version['raw_text'],
                  ver_time: version['ver_time']
                }
                versions[index] = _version
              })
              that.versions = versions
              that.$title(`Версии комментария #${that.$route.params.id}`)
            }
            else {
              that.$status(data.error, 'error')
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

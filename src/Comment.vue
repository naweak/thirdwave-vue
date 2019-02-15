<template>
  <div class="comment" :id="'comment-' + comment.id">
    <div class="commentContent">
      <div class="text" v-html="comment['comment_text']" v-if="!editionEnabled"></div>
      <form v-on:submit.prevent="submitEdition()" v-else>
        <div class="formColumn">
          <textarea id="text" v-model="comment['raw_text']"></textarea>
        </div>
        <div class="formColumn">
          <button type="submit">YARRR!</button>
        </div>
      </form>
      <div class="moderate" v-if="!hideModeration">
        <karma
          v-if="!hideKarma"
          content-type="comment"
          :content-id="comment.id"></karma>
        <div class="modButtons">
          <button class="delete" title="Удалить" v-if="comment['can_moderate']" v-on:click="deleteComment()"><i class="fa fa-close"></i></button>
          <button class="edit" title="Редактировать" v-if="comment['can_edit']" v-on:click="editionEnabled = !editionEnabled"><i class="fa fa-edit"></i></button>
          <button class="commentVersions" title="Версии комментария" v-on:click="commentVersions()"><i class="fa fa-archive"></i></button>
          <button class="report" title="Репорт" v-if="!comment['can_moderate']" v-on:click="report()"><i class="fa fa-exclamation"></i></button>
        </div>
      </div>
      <div class="autograph">
        <span class="username">{{comment.author}}</span>
        написал этот псто
        {{dateFormat (Number(comment['create_time']) * 1000, $root.config.date)}},
        <a :href="'#comment-' + comment.id">#{{comment.id}}</a>
        <a href="javascript:void(0)" v-on:click="reply(comment.id, comment['parent_post'])">ответить</a>
        <span class="editor" v-if="comment.editor">отредактировал {{ comment.editor }} {{ dateFormat(Number(comment['ver_time']) * 1000, $root.config.date) }}</span>
      </div>
    </div>
    <div class="children" v-if="loadChildren">
      <comment
        v-for="children in comment.children"
        :comment="children"
        :loadChildren="true"></comment>
    </div>
  </div>
</template>

<script>
export default {
  name: "comment",
  props: ['comment', 'loadChildren', 'hideKarma', 'hideModeration'],
  data () {
    return {
      editionEnabled: false,
      editionText: this.comment['comment_text']
    }
  },
  methods: {
    reply (commentId, postId) {
      this.$root.$emit('reply', commentId, postId)
    },
    deleteComment () {
      var that = this
      var vm = that.$root
      $.ajax({
        url: vm.config.api,
        data: {
          method: "comment.delete",
          id: that.comment.id,
          access_token: $cookies.get('access_token'),
        },
        success (data) {
          if (data.success) {
            that.$status(data.success, 'success')
            that.comment['comment_text'] = "<p>Удалено</p>"
          }
          else {
            that.$status(data.error, 'error')
          }
        }
      })
    },
    reloadCommentData () {
      var that = this
      var vm = that.$root
      $.ajax({
        url: vm.config.api,
        data: {
          method: "comment.info",
          id: that.comment.id,
          access_token: $cookies.get('access_token')
        },
        success (data) {
          if (data.success) {
            that.comment = data.success
          }
          else {
            that.$status(data.error, 'error')
          }
        }
      })
    },
    submitEdition () {
      var that = this
      var vm = that.$root
      $.ajax({
        url: vm.config.api,
        type: "post",
        data: {
          method: "comment.edit",
          text: that.comment['raw_text'],
          id: that.comment.id,
          access_token: $cookies.get('access_token')
        },
        success (data) {
          if (data.success) {
            that.$status(data.success, 'success')
            that.editionEnabled = false
            that.reloadCommentData()
          }
          else {
            that.$status(data.error, 'error')
          }
        }
      })
    },
    commentVersions () {
      this.$router.push(`/commentVersions/${this.comment.id}`)
    },
    report () {
      var reason = prompt('Почему горит жопа?')
      var that = this
      var vm = that.$root
      $.ajax({
        url: vm.config.api,
        data: {
          method: "report.create",
          content_type: "comment",
          content_id: that.comment.id,
          reason,
          access_token: $cookies.get('access_token')
        },
        success (data) {
          if (data.success) {
            that.$status(data.success, 'success')
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
  .commentContent {
    border-radius: 3px;
    border: gainsboro 1px solid;
    box-shadow: 0 0 10px 0 gainsboro;
    width: max-content;
    width: -moz-max-content;
    padding: 10px;
    max-width: 100%;
  }
</style>

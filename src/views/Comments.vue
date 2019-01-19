<template>
  <div id="comments" v-if="$root.isLogged">
    <div id="postInfo">
      <post
        :post="post"
        showFromSub=true></post>
    </div>
    <div id="separator" v-if="comments.length">
      <h2>Комментарии</h2>
      <hr>
    </div>
    <div id="commentsList">
      <comment
        v-for="comment in comments"
        :comment="comment"
        :loadChildren="true"></comment>
    </div>
    <div id="reply">
      <form v-on:submit.prevent="submitComment()">
        <div class="formColumn">
          Ответ на комментарий <input id="parentCommentId" type="text" v-model="replyToComment">
        </div>
        <div class="formColumn">
          <p>Ваш шедевр:</p>
          <div><textarea cols="30" rows="10" v-model="commentText"></textarea></div>
        </div>
        <div class="formColumn">
          <button type="submit">YARRR!</button>
        </div>
      </form>
    </div>
    <div id="features">
      <div>
        <button v-on:click="loadComments()">Загрузить новые комментарии</button>
      </div>
    </div>
  </div>
  <forbidden
    v-else
    reason="Не залогинен"></forbidden>
</template>

<script>
export default {
  name: "comments",
  data () {
    return {
      post: {},
      comments: [],
      replyToComment: 0,
      commentText: ""
    }
  },
  methods: {
    loadPost () {
      var that = this
      var vm = that.$root
      $.ajax({
        url: vm.config.api,
        async: false,
        data: {
          method: "post.info",
          id: that.$route.params.postId,
          access_token: $cookies.get('access_token')
        },
        success (data) {
          if(data.success) {
            that.post = data.success
          }
          else {
            vm.$status(data.error, 'error')
          }
        }
      })
    },
    loadComments() {
      var that = this
      var vm = that.$root
      $.ajax({
        url: vm.config.api,
        async: false,
        data: {
          method: "comment.listUnderPost",
          post_id: that.$route.params.postId,
          access_token: $cookies.get('access_token')
        },
        success (data) {
          if(data.success) {
            that.comments = data.success
          }
          else {
            vm.$status(data.error, 'error')
          }
        }
      })
    },
    loadCommentsPage() {
      this.loadPost()
      this.loadComments()
    },
    submitComment () {
      var that = this
      var vm = that.$root
      $.ajax({
        url: vm.config.api,
        async: false,
        data: {
          method: 'comment.create',
          text: that.commentText,
          post_id: that.$route.params.postId,
          parent_comment: that.replyToComment,
          access_token: $cookies.get('access_token')
        },
        success(data) {
          if(data.success) {
            // $(`#comment-${that.replyToComment}`)
            that.commentText = ""
            that.loadComments()
            if(that.replyToComment != 0) {
              $('html,body').animate({
                scrollTop: $(`#comment-${that.replyToComment}`).offset().top
              }, 500)
            }
          }
          else {
            vm.$status(data.error, 'error')
          }
        }
      })
    }
  },
  created() {
    this.$Progress.start()
    this.loadCommentsPage()
    this.$Progress.finish()
    var vm = this.$root
    var that = this
    vm.$on('reply', function (commentId, postId) {
      that.replyToComment = commentId
      $("html,body").animate({
        scrollTop: $(`#reply`).offset().top
      }, 500)
    })
  },
  watch: {
    '$route'() {
      this.loadCommentsPage()
    }
  }
}
</script>

<style scoped>
  #parentCommentId {
    border: 0
  }
</style>

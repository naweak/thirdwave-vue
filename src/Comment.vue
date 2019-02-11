<template>
  <div class="comment" :id="'comment-' + comment.id">
    <div class="commentContent">
      <div class="text" v-html="comment['comment_text']"></div>
      <div class="moderate" v-if="!hideModeration">
        <karma
          v-if="!hideKarma"
          content-type="comment"
          :content-id="comment.id"></karma>
      </div>
      <div class="autograph">
        <span class="username">{{comment.author}}</span>
        написал этот псто
        {{dateFormat (Number(comment['create_time']) * 1000, $root.config.date)}},
        <a :href="'#comment-' + comment.id">#{{comment.id}}</a>
        <a href="javascript:void(0)" v-on:click="reply(comment.id, comment['parent_post'])">ответить</a>
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
  methods: {
    reply (commentId, postId) {
      this.$root.$emit('reply', commentId, postId)
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

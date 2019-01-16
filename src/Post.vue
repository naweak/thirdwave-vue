<template>
  <div class="post">
    <div class="text" v-html='post.post_text'></div>
    <div class="autograph">
      <span class="username">{{post.author}}</span> написал этот псто {{Number(post['create_time']) * 1000 | moment($root.config.date)}}, <router-link :to="post.link">#{{post.id}}</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "post",
  props: ['post'],
  created () {
    this.post.link = `/comments/${this.post.id}`
  }
}
</script>

<style scoped>

</style>

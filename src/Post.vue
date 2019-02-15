<template>
  <div :class="Number(post.is_invited) ? 'post gold' : 'post'" :id="'post-' + post.id">
    <div id="fromSub" v-if="showFromSub">
      <h2><router-link :to="'/sub/' + post.sub">{{ getSubTitle(post.sub) }}</router-link></h2>
    </div>
    <div class="text" v-html='post.post_text' v-if="!editionEnabled"></div>
    <form v-on:submit.prevent="submitEdited()" v-else>
      <div class="formColumn">
        <textarea id="editionText" v-model="post['raw_text']"></textarea>
      </div>
      <div class="formColumn">
        <button type="submit">YARRR!</button>
      </div>
    </form>
    <div class="moderate" v-if="!hideModeration">
      <karma
        v-if="!hideKarma"
        content-type="post"
        :content-id="post.id"></karma>
      <div class="modButtons">
        <button title="Удалить" class="delete" v-on:click="deletePost()" v-if="post['can_moderate']"><i class="fa fa-close"></i></button>
        <button title="Редактировать" class="edit" v-on:click="editionEnabled = !editionEnabled" v-if="post['can_edit']"><i class="fa fa-edit"></i></button>
        <button title="Версии поста" class="postVersions" v-on:click="postVersions()"><i class="fa fa-archive"></i></button>
        <button title="Репорт" class="report" v-on:click="report()" v-if="!post['can_moderate']"><i class="fa fa-exclamation"></i></button>
        <button :class="Number(post['is_pinned']) ? 'pin pinned' : 'pin'" :title="Number(post['is_pinned']) ? 'Открепить' : 'Закрепить'" v-on:click="togglePin()" v-if="post['can_moderate']"><i class="fa fa-thumb-tack"></i></button>
      </div>
    </div>
    <div class="autograph">
      <i title="Пост закреплен" class="fa fa-thumb-tack pinned" v-if="!post['can_moderate'] && Number(post['is_pinned'])"></i>
      <span class="username">{{post.author}}</span> написал этот псто {{dateFormat(Number(post['create_time']) * 1000, $root.config.date)}}, <router-link :to="'/comments/' + post.id">#{{post.id}}</router-link>
      <span class="editor" v-if="post.editor">отредактировал {{ post.editor }} {{ dateFormat(Number(post['ver_time']) * 1000, $root.config.date) }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "post",
  props: ['post', 'showFromSub', 'hideKarma', 'hideModeration'],
  data () {
    return {
      editionEnabled: false,
    }
  },
  methods: {
    getSubTitle(sub) {
      var that = this
      var vm = that.$root
      $.ajax({
        url: vm.config.api,
        async: false,
        data: {
          method: "sub.info",
          address: sub,
          access_token: $cookies.get('access_token')
        },
        success (data) {
          if(data.success) {
            window.subInfo = data.success
          }
          else {
            vm.$status(data.error, 'error')
          }
        }
      })
      return subInfo.name
    },
    deletePost () {
      var that = this
      var vm = that.$root
      $.ajax({
        url: vm.config.api,
        data: {
          method: "post.delete",
          id: that.post.id,
          access_token: $cookies.get('access_token')
        },
        success (data) {
          if (data.success) {
            that.post['post_text'] = '<p>Удалено</p>'
          }
          else {
            that.$status(data.error, 'error')
          }
        }
      })
    },
    reloadPostData () {
      var that = this
      var vm = that.$root
      $.ajax({
        url: vm.config.api,
        data: {
          method: 'post.info',
          id: that.post.id,
          access_token: $cookies.get('access_token')
        },
        success (data) {
          if (data.success) {
            that.post = data.success
          }
          else {
            that.$status(data.error, 'error')
          }
        }
      })
    },
    submitEdited () {
      var that = this
      var vm = that.$root
      $.ajax({
        url: vm.config.api,
        type: "post",
        data: {
          method: "post.edit",
          id: that.post.id,
          text: that.post['raw_text'],
          access_token: $cookies.get('access_token')
        },
        success (data) {
          if (data.success) {
            that.$status(data.success, 'success')
            that.editionEnabled = false
            that.reloadPostData()
          }
          else {
            that.$status(data.error, 'error')
          }
        }
      })
    },
    postVersions () {
      this.$router.push(`/postVersions/${this.post.id}`)
    },
    report () {
      var reason = prompt('Почему горит жопа?')
      var that = this
      var vm = that.$root
      $.ajax({
        url: vm.config.api,
        data: {
          method: 'report.create',
          content_id: that.post.id,
          content_type: 'psto',
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
    },
    togglePin () {
      var that = this
      var vm = that.$root
      var method = Number(that.post['is_pinned']) ? 'post.unpin' : 'post.pin'
      $.ajax({
        url: vm.config.api,
        data: {
          method,
          id: that.post.id,
          access_token: $cookies.get('access_token')
        },
        success (data) {
          if (data.success) {
            that.$status(data.success, 'success')
            that.reloadPostData()
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
  .gold .autograph {
    background: #ffecb4;
  }
  .modButtons .pinned, .autograph .pinned {
    color: black;
    opacity: 1;
  }
</style>

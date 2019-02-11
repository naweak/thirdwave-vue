<template>
	<div class="karma">
    <button class="plus" v-on:click="setKarma('plus')" title="Риальне заебись"><i class="fa fa-thumbs-o-up"></i></button>
    <span class="count" v-on:click="toggleVotesList()">{{karma.count}}</span>
    <button class="minus" v-on:click="setKarma('minus')" title="Говнище ебаное"><i class="fa fa-thumbs-o-down"></i></button>
    <transition name="slide-fade">
      <div class="votes" v-show="showVotesList && karma.advanced.length">
        <ul class="list">
          <li v-for="karmaItem in karma.advanced">
            {{karmaItem['voting_user']}} ({{karmaItem.type === 'minus' ? '–' : ''}}{{karmaItem['mass']}})
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
	export default {
		name: "karma",
    data () {
		  return {
        karma: {},
        showVotesList: false
      }
    },
    props: [
      'contentType',
      'contentId'
    ],
    methods: {
		  getKarma () {
		    var that = this
        var vm = that.$root
        $.ajax({
          url: vm.config.api,
          data: {
            method: 'karma.get',
            content_type: that['contentType'],
            content_id: that['contentId'],
            access_token: that.$cookies.get('access_token')
          },
          success (data) {
            if (data.success) {
              that.karma = data.success
            }
            else {
              that.$status(data.error, 'error')
            }
          }
        })
      },
      setKarma (type) {
        var that = this
        var vm = that.$root
        $.ajax({
          url: vm.config.api,
          async: false,
          data: {
            method: "karma.set",
            content_type: that['contentType'],
            content_id: that['contentId'],
            access_token: $cookies.get('access_token'),
            type
          },
          success (data) {
            if (data.success) {
              that.getKarma()
            }
            else {
              that.$status(data.error, 'error')
            }
          }
        })
      },
      toggleVotesList () {
		    this.showVotesList = !this.showVotesList
      }
    },
    created () {
      this.getKarma()
    },
    watch: {
		  contentId () {
		    this.getKarma()
      }
    }
	}
</script>

<style scoped>
  button {
    border: none;
    background: none;
    margin: 0;
    cursor: pointer;
  }
  .count {
    cursor: pointer;
  }
  .slide-fade-enter-active {
    transition: all .2s ease;
  }
  .slide-fade-enter, .slide-fade-leave-to {
    transform: translateY(-10px);
    opacity: 0;
  }
  .slide-fade-leave-active {
    transition: all .2s ease;
  }
  .karma > .plus {
    color: forestgreen;
  }
  .karma > .minus {
    color: #db2a19;
    -moz-transform: scale(-1, 1);
    -webkit-transform: scale(-1, 1);
    -o-transform: scale(-1, 1);
    transform: scale(-1, 1);
    filter: FlipH;
    -ms-filter: "FlipH";
  }
  .votes {
    position: absolute;
    background: whitesmoke;
    border: #bcb9b9 1px solid;
    padding: 12px;
    margin: 10px;
    border-radius: 3px;
    z-index: 265;
    box-shadow: 0 0 10px 0 gainsboro;
  }
  .votes .list {
    margin: 0;
    padding: 0;
  }
  .votes .list li {
    list-style: none;
    padding: 0;
    margin: 3px;
  }
</style>

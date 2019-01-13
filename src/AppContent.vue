<template>
	<div id="content">
    <transition name='slide-fade'>
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
	export default {
		name: "app-content"
	}
</script>

<style scoped>
  .slide-fade-enter-active {
    transition: all .2s ease;
  }
  .slide-fade-enter, .slide-fade-leave-to {
    transform: translateY(-10px);
    opacity: 0;
  }
</style>

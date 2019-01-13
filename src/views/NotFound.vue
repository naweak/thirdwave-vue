<template>
	<error
    code="404"
    :reason="reason"></error>
</template>

<script>
	export default {
		name: "not-found",
    data () {
		  return {

      }
    },
    props: {
		  reason: {
		    default: "Не найдено"
      }
    }
	}
</script>

<style scoped>

</style>

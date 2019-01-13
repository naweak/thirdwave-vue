<template>
  <error 
    code="403" 
    :reason="reason"></error>
</template>

<script>
  export default {
    name: "forbidden",
    props: ['reason']
  }
</script>

<style scoped>
  
</style>
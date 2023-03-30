<template>
  <div>
    <button @click="this.$router.push('ComTestPage')">통신 테스트</button>
    <button @click="this.$router.push('WebGLPage')">WebGL 테스트</button>
    <button @click="this.$router.push('BabylonDemo')">Babylon 테스트</button>
  </div>
</template>

<script>

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  mounted() {
    console.log(this)
    console.log(this.$router) 
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only --> 런처2 0508
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
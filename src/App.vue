<template>
  <div id="app">
    <color-difference></color-difference>
  </div>
</template>

<script>
import ColorDifference from './components/ColorDifference.vue'

export default {
  name: 'app',
  components: {
    ColorDifference
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

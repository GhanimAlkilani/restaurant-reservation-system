<template>
  <div id="app">
    <branch-dashboard />
  </div>
</template>

<script>
import BranchDashboard from './components/Branch/branch-dashboard.vue'

export default {
  name: 'App',
  components: {
    BranchDashboard
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>

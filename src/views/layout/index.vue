<template>
  <el-container class="app-wrapper" :class="classObj">
    <side-bar></side-bar>
    <el-container class="app-container">
      <head-bar></head-bar>
      <el-main class="app-main">
        <nav-bar></nav-bar>
        <app-main></app-main>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { AppMain, HeadBar, NavBar, SideBar } from './components'
export default {
  data() {
    return {}
  },
  components: {
    AppMain,
    HeadBar,
    SideBar,
    NavBar
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-wrapper{
  width: 100%;
  height: 100%;
  position: relative;
  .app-container{
    margin-left: 200px;
    margin-top: 100px;
    .app-main{
      padding: 0;
      min-width: 900px;
      background: #f2f2f2;
    }
  }
}
</style>

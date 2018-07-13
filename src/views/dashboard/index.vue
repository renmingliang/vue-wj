<template>
  <div>
    欢迎使用问卷调研平台
  </div>
</template>

<script>

export default {
  name: 'index',
  data() {
    return {}
  },
  created() {
    // 获取游戏列表
    this.$store.dispatch('PROJECT_APP_LIST')
  },
  computed: {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>

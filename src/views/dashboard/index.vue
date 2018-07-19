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
    // 获取项目名称
    this.$store.dispatch('PROJECT_FETCH_LIST')
    // 获取问卷状态
    this.$store.dispatch('QUESTION_FETCH_STATUS')
    // 获取问卷类型
    this.$store.dispatch('QUESTION_FETCH_TYPE')
  },
  computed: {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>

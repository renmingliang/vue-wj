<template>
  <question-setting :is-edit="status"></question-setting>
</template>

<script>
import questionSetting from './components/question-setting'

export default {
  name: 'setting-create',
  data() {
    return {
      status: false
    }
  },
  beforeRouteEnter (to, from, next) {
    const { name, params } = from
    // 若从创建页返回
    if (name === 'preview-create' && params.id) {
      next({ name: 'setting-edit', params, replace: true })
    } else {
    // 其他页返回
      next()
    }
  },
  components: {
    questionSetting
  }
}
</script>

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
  components: {
    questionSetting
  }
}
</script>

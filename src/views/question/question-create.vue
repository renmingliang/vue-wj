<template>
  <div>
    <question-setting :is-edit="status"></question-setting>
    <question-preview></question-preview>
  </div>
</template>

<script>
import questionSetting from './question-setting'
import questionPreview from './question-preview'

export default {
  name: 'question-create',
  data() {
    return {
      status: false
    }
  },
  components: {
    questionSetting,
    questionPreview
  }
}
</script>

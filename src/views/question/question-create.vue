<template>
  <div>
    <div class="question-setting">
      <question-setting :is-edit="status"></question-setting>
    </div>
    <div class="question-preview">
      <question-preview :is-edit="status"></question-preview>
    </div>
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
  },
  methods: {
  }
}
</script>

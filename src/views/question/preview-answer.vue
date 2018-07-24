<template>
  <question-preview :is-answer="status" :id="id"></question-preview>
</template>

<script>
import questionPreview from './components/question-preview'

export default {
  name: 'preview-answer',
  data() {
    return {
      status: true,
      id: this.$route.params.id
    }
  },
  components: {
    questionPreview
  }
}
</script>

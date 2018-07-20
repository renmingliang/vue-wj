<template>
  <question-preview :id="id"></question-preview>
</template>

<script>
import questionPreview from './components/question-preview'

export default {
  name: 'preview-import',
  data() {
    return {
      id: this.$route.params.id
    }
  },
  components: {
    questionPreview
  }
}
</script>

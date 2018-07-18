<template>
  <question-preview :is-edit="status" :id="id"></question-preview>
</template>

<script>
import questionPreview from './components/question-preview'

export default {
  name: 'preview-create',
  data() {
    return {
      status: false,
      id: this.$route.params.id
    }
  },
  components: {
    questionPreview
  }
}
</script>

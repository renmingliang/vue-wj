<template>
  <question-preview :is-look="status" :id="id"></question-preview>
</template>

<script>
import questionPreview from './components/question-preview'

export default {
  name: 'preview-look',
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

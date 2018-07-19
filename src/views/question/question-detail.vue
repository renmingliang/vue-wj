<template>
  <question-preview :is-look="status" :is-detail="status" :id="id"></question-preview>
</template>

<script>
import questionPreview from './components/question-preview'

export default {
  name: 'question-detail',
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

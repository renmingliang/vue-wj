<template>
  <question-detail :is-look="status" :id="id"></question-detail>
</template>

<script>
import questionDetail from './components/question-detail'

export default {
  name: 'detail-look',
  data() {
    return {
      status: true,
      id: this.$route.params.id
    }
  },
  components: {
    questionDetail
  }
}
</script>

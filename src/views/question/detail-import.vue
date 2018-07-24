<template>
  <question-detail :id="id"></question-detail>
</template>

<script>
import questionDetail from './components/question-detail'

export default {
  name: 'detail-import',
  data() {
    return {
      id: this.$route.params.id
    }
  },
  components: {
    questionDetail
  }
}
</script>

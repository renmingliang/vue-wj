<template>
  <question-setting :is-edit="status" :id="id"></question-setting>
</template>

<script>
import questionSetting from './components/question-setting'

export default {
  name: 'setting-edit',
  data() {
    return {
      status: true,
      id: this.$route.params.id
    }
  },
  components: {
    questionSetting
  }
}
</script>

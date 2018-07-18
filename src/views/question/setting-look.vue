<template>
  <question-setting :is-look="status" :id="id"></question-setting>
</template>

<script>
import questionSetting from './components/question-setting'

export default {
  name: 'setting-look',
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

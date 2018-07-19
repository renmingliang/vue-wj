<template>
  <div
    ref="pdf"
    class="box-container"
    v-loading="screenPDFLoding"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)">
    <el-card class="box-card" shadow="never">
      <div slot="header" class="card-header">
        <span class="card-title">问卷信息</span>
      </div>
      <el-table
        highlight-current-row
        border
        stripe
        v-loading="questionLoading"
        :data="infoData">
        <el-table-column
          prop="id"
          label="问卷ID"
          align="center">
        </el-table-column>
        <el-table-column
          prop="title"
          label="问卷标题"
          align="center">
        </el-table-column>
        <el-table-column
          prop="type_name"
          label="问卷类型"
          align="center">
        </el-table-column>
        <el-table-column
          prop="project_name"
          label="所属项目"
          align="center">
        </el-table-column>
        <el-table-column
          prop="start_date"
          label="开始时间"
          align="center">
        </el-table-column>
        <el-table-column
          prop="end_date"
          label="结束时间"
          align="center">
        </el-table-column>
        <el-table-column
          prop="count"
          label="问卷数"
          align="center">
        </el-table-column>
      </el-table>
    </el-card>

    <el-card v-if="questionAnalyse" class="box-card" shadow="never">
      <div slot="header" class="card-header">
        <span class="card-title">问卷分析</span>
        <div class="card-control">
          <el-button @click="handleExport" type="text"><i class="el-icon-download"></i>下载报告</el-button>
        </div>
      </div>
      <div class="analyse-list">
        <div
          class="analyse-item"
          v-for="(item, index) in questionAnalyse"
          :key="index">
          <h3 class="analyse-item-title">{{item.title}}</h3>
          <el-table
            class="analyse-item-table"
            border
            stripe
            :data="item.list">
            <el-table-column
              v-for="(v, k, i) in item.label"
              :key="i"
              :prop="k"
              :label="v"
              align="center">
            </el-table-column>
          </el-table>
          <template v-if="item.type !== '3'">
            <div class="analyse-item-handle text-right">
              <template v-if="!(item.type === '4' || item.type === '5')">
                <el-button @click="handlePie(item, index)" size="medium">饼图</el-button>
              </template>
              <el-button @click="handleYBar(item, index)" size="medium">条形图</el-button>
              <el-button @click="handleXBar(item, index)" size="medium">柱状图</el-button>
              <el-button @click="handleShow(index)" size="medium">隐藏图表</el-button>
            </div>
            <div v-if="!hiddenEchart[index]" :id="`main-${index}`" style="width: 100%;height: 500px;"></div>
          </template>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import screenPDF from '@/utils/screenPDF'
import chartConfig from '@/utils/chartConfig'

export default {
  name: 'question-analyse',
  data() {
    return {
      id: this.$route.params.id,
      screenPDFLoding: false,
      infoData: null,
      questionAnalyse: null,
      hiddenEchart: {}
    }
  },
  computed: {
    ...mapGetters([
      'questionLoading'
    ])
  },
  created() {
    this.getInfo()
    this.getAnswer()
  },
  methods: {
    // 0.获取问卷信息
    getInfo() {
      this.$store.dispatch('QUESTION_FETCH_DETAIL', {question_id: this.id})
        .then(res => {
          const temp = res.data
          this.infoData = [temp]
        })
    },
    // 1.问卷答案分析
    getAnswer() {
      this.$store.dispatch('QUESTION_ANSWER_ANALYSE', {question_id: this.id})
        .then(res => {
          this.questionAnalyse = res.data
        })
    },
    // 2.下载报告
    handleExport() {
      if (this.screenPDFLoding) return false
      this.screenPDFLoding = true
      const { title, type_name } = this.infoData[0]
      screenPDF(title, type_name, this.$refs.pdf)
        .then(() => {
          this.screenPDFLoding = false
        })
    },
    // 3.隐藏图表
    handleShow(index) {
      this.$set(this.hiddenEchart, index, true)
    },
    // 4.图表适配
    resizeChart(eleId) {
      function resize() {
        chartConfig.resizeChart(eleId)
      }
      window.addEventListener('resize', resize)

      this.$once('hook:beforeDestroy', function () {
        window.removeEventListener('resize', resize)
      })
    },
    // 5.饼图
    handlePie(item, index) {
      this.$set(this.hiddenEchart, index, false)

      const name = item.title
      const legendData = item.list.map(v => {
        return v.option
      })
      const seriesData = item.list.map(v => {
        return { value: v.num, name: v.option }
      })

      this.$nextTick(() => {
        // 基于准备好的dom，初始化echarts实例
        const eleId = `main-${index}`
        const chartData = chartConfig.pie({
          name,
          legendData,
          seriesData
        })
        chartConfig.render(eleId, chartData)
        this.resizeChart(eleId)
      })
    },
    // 6.Y轴
    handleYBar(item, index) {
      this.$set(this.hiddenEchart, index, false)
      let axisData, seriesData, legendData

      const name = item.title
      const isMatrix = item.type === '4' || item.type === '5'

      if (isMatrix) {
        const keys = Object.keys(item.label).splice(1)
        legendData = Object.values(item.label).splice(1).map((v, i) => {
          return `${keys[i]}：${v}`
        })

        seriesData = item.list.map(v => {
          const vals = Object.values(v).splice(1)
          return vals.map((k, i) => {
            // 注意这里需去除后台返回的百分数据
            const sub = k.indexOf('(')
            return { value: k.substr(0, sub), name: legendData[i] }
          })
        })

        axisData = item.list.map(v => {
          return v.sub_title
        })
      } else {
        seriesData = item.list.map(v => {
          return { value: v.num, name: v.option }
        })

        axisData = item.list.map(v => {
          return v.option
        })
      }

      this.$nextTick(() => {
        // 基于准备好的dom，初始化echarts实例
        const eleId = `main-${index}`
        const chartData = chartConfig.yBar({
          name,
          legendData,
          axisData,
          seriesData
        })
        chartConfig.render(eleId, chartData)
        this.resizeChart(eleId)
      })
    },
    // 7.X轴
    handleXBar(item, index) {
      this.$set(this.hiddenEchart, index, false)
      let axisData, seriesData, legendData

      const name = item.title
      const isMatrix = item.type === '4' || item.type === '5'

      if (isMatrix) {
        const keys = Object.keys(item.label).splice(1)
        legendData = Object.values(item.label).splice(1).map((v, i) => {
          return `${keys[i]}：${v}`
        })

        seriesData = item.list.map(v => {
          const vals = Object.values(v).splice(1)
          return vals.map((k, i) => {
            // 注意这里需去除后台返回的百分数据
            const sub = k.indexOf('(')
            return { value: k.substr(0, sub), name: legendData[i] }
          })
        })

        axisData = item.list.map(v => {
          return v.sub_title
        })
      } else {
        seriesData = item.list.map(v => {
          return { value: v.num, name: v.option }
        })

        axisData = item.list.map(v => {
          return v.option
        })
      }

      this.$nextTick(() => {
        // 基于准备好的dom，初始化echarts实例
        const eleId = `main-${index}`
        const chartData = chartConfig.xBar({
          name,
          axisData,
          legendData,
          seriesData
        })
        chartConfig.render(eleId, chartData)
        this.resizeChart(eleId)
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.analyse-item-title{
  font-size: 16px;
  font-weight: 400;
  color: #333333;
  margin-bottom: 10px;
}
.analyse-item-table, .analyse-item-handle{
  margin-bottom: 20px;
}
</style>

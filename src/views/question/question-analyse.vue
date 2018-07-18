<template>
  <div class="box-container">
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

// 引入 ECharts 主模块
var echarts = require('echarts/lib/echarts')
// 引入柱状图
require('echarts/lib/chart/bar')
// 饼图
require('echarts/lib/chart/pie')
// 引入其他组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')
require('echarts/lib/component/toolbox')
require('echarts/lib/component/legendScroll')

export default {
  name: 'question-analyse',
  data() {
    return {
      id: this.$route.params.id,
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
    // 2.导出数据
    handleExport() {
      console.log('导出数据')
    },
    // 3.隐藏图表
    handleShow(index) {
      this.$set(this.hiddenEchart, index, true)
    },
    // 4.图表适配
    resizeChart(chart) {
      function resize() {
        chart.resize()
      }
      window.addEventListener('resize', resize)

      this.$once('hook:beforeDestroy', function () {
        window.removeEventListener('resize', resize)
      })
    },
    // 5.echart图表绘制
    handlePie(item, index) {
      this.$set(this.hiddenEchart, index, false)

      const legendData = item.list.map(v => {
        return v.option
      })
      const seriesData = item.list.map(v => {
        return { value: v.num, name: v.option }
      })

      this.$nextTick(() => {
        // 基于准备好的dom，初始化echarts实例
        const tempId = `main-${index}`
        const myChart = echarts.init(document.getElementById(tempId))
        myChart.setOption({
          title: {
            text: '',
            subtext: '',
            x: 'center'
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 'right',
            top: 40,
            type: 'scroll',
            data: legendData
          },
          series: [
            {
              name: item.title,
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: seriesData,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        }, true)

        this.resizeChart(myChart)
      })
    },
    handleYBar(item, index) {
      this.$set(this.hiddenEchart, index, false)
      let axisData, series, legendData

      const seriesConfig = {
        name: item.title,
        type: 'bar',
        label: {
          normal: {
            position: 'right',
            show: true
          }
        }
      }
      const isMatrix = item.type === '4' || item.type === '5'

      if (isMatrix) {
        const keys = Object.keys(item.label).splice(1)
        legendData = Object.values(item.label).splice(1).map((v, i) => {
          return `${keys[i]}：${v}`
        })

        const seriesData = item.list.map(v => {
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

        series = seriesData.map((s, i) => {
          return Object.assign({data: s}, seriesConfig, {name: legendData[i]})
        })
      } else {
        const seriesData = item.list.map(v => {
          return { value: v.num, name: v.option }
        })
        series = [Object.assign({data: seriesData}, seriesConfig)]

        axisData = item.list.map(v => {
          return v.option
        })
      }

      this.$nextTick(() => {
        // 基于准备好的dom，初始化echarts实例
        const tempId = `main-${index}`
        const myChart = echarts.init(document.getElementById(tempId))
        myChart.setOption({
          title: {
            text: '',
            subtext: ''
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: legendData
          },
          xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01]
          },
          yAxis: {
            type: 'category',
            data: axisData
          },
          series
        }, true)
        this.resizeChart(myChart)
      })
    },
    handleXBar(item, index) {
      this.$set(this.hiddenEchart, index, false)
      let axisData, series, legendData

      const seriesConfig = {
        name: item.title,
        type: 'bar',
        label: {
          normal: {
            position: 'top',
            show: true
          }
        }
      }
      const isMatrix = item.type === '4' || item.type === '5'

      if (isMatrix) {
        const keys = Object.keys(item.label).splice(1)
        legendData = Object.values(item.label).splice(1).map((v, i) => {
          return `${keys[i]}：${v}`
        })

        const seriesData = item.list.map(v => {
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

        series = seriesData.map((s, i) => {
          return Object.assign({data: s}, seriesConfig, {name: legendData[i]})
        })
      } else {
        const seriesData = item.list.map(v => {
          return { value: v.num, name: v.option }
        })
        series = [Object.assign({data: seriesData}, seriesConfig)]

        axisData = item.list.map(v => {
          return v.option
        })
      }

      this.$nextTick(() => {
        // 基于准备好的dom，初始化echarts实例
        const tempId = `main-${index}`
        const myChart = echarts.init(document.getElementById(tempId))
        myChart.setOption({
          title: {
            text: ''
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          legend: {
            data: legendData
          },
          xAxis: {
            type: 'category',
            data: axisData
          },
          yAxis: {
            type: 'value',
            boundaryGap: [0, 0.01]
          },
          series
        }, true)
        this.resizeChart(myChart)
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

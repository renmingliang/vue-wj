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
        v-loading="infoLoading"
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
          prop="type"
          label="问卷类型"
          align="center">
        </el-table-column>
        <el-table-column
          prop="project"
          label="所属项目"
          align="center">
        </el-table-column>
        <el-table-column
          prop="starttime"
          label="开始时间"
          align="center">
        </el-table-column>
        <el-table-column
          prop="endtime"
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

    <el-card class="box-card" shadow="never">
      <div slot="header" class="card-header">
        <span class="card-title">问卷分析</span>
        <div class="card-control">
          <el-button @click="handleExport" type="text"><i class="el-icon-download"></i>下载报告</el-button>
        </div>
      </div>
      <div>
        <el-button @click="handlePie" size="medium">饼图</el-button>
        <el-button @click="handleYBar" size="medium">条形图</el-button>
        <el-button @click="handleXBar" size="medium">柱状图</el-button>
        <el-button @click="handleShow" size="medium">隐藏图表</el-button>
      </div>
      <div v-if="isShow" id="main" style="width: 100%;height: 500px;"></div>
    </el-card>
  </div>
</template>

<script>
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

const defaultInfo = [
  {
    id: 1,
    title: '问卷的标题信息',
    type: '游戏内置型',
    project: '锦绣未央',
    starttime: '2018-2-3 10:00:00',
    endtime: '2018-9-3 10:00:00',
    count: 31254
  }
]

export default {
  name: 'question-analyse',
  data() {
    return {
      isShow: true,
      infoLoading: false,
      infoData: null
    }
  },
  computed: {
    myChart() {
      // 基于准备好的dom，初始化echarts实例
      return echarts.init(document.getElementById('main'))
    }
  },
  created() {
    this.getInfo()
  },
  methods: {
    // 0.获取问卷信息
    getInfo() {
      this.infoLoading = true
      setTimeout(() => {
        this.infoData = defaultInfo
        this.infoLoading = false
      }, 1000)
    },
    // 1.导出数据
    handleExport() {
      console.log('导出数据')
    },
    // 2.隐藏图表
    handleShow() {
      this.isShow = false
    },
    // 3.echart图表绘制
    handlePie() {
      this.myChart.setOption({
        title: {
          text: '某站点用户访问来源',
          subtext: '纯属虚构',
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
          data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
              {value: 335, name: '直接访问'},
              {value: 310, name: '邮件营销'},
              {value: 234, name: '联盟广告'},
              {value: 135, name: '视频广告'},
              {value: 1548, name: '搜索引擎'}
            ],
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
    },
    handleYBar() {
      this.myChart.setOption({
        title: {
          text: '世界人口总量',
          subtext: '数据来自网络'
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
          data: ['2011年', '2012年']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: 'category',
          data: ['巴西', '印尼', '美国', '印度', '中国', '世界人口(万)']
        },
        series: [
          {
            name: '2011年',
            type: 'bar',
            data: [18203, 23489, 29034, 104970, 131744, 630230],
            label: {
              normal: {
                position: 'right',
                show: true
              }
            }
          },
          {
            name: '2012年',
            type: 'bar',
            data: [19325, 23438, 31000, 121594, 134141, 681807],
            label: {
              normal: {
                position: 'right',
                show: true
              }
            }
          }
        ]
      }, true)
    },
    handleXBar() {
      this.myChart.setOption({
        title: {
          text: 'ECharts 入门示例'
        },
        tooltip: {},
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [{
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20],
          label: {
            normal: {
              position: 'top',
              show: true
            }
          }
        }]
      }, true)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>

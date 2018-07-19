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
  /**
   * 渲染eChart
   * @param  chartId(String)  '图表ID名称'
   * @param  option (Obj) '图表配置'
   */
  render(chartId, option) {
    const Chart = echarts.init(document.getElementById(chartId))
    // 设置true --> 清屏重新绘制
    Chart.setOption(option, true)
  },

  // 图表适配
  resizeChart(chartId) {
    const Chart = echarts.init(document.getElementById(chartId))
    Chart.resize()
  },

  /**
   * 饼图
   * @param option.text:图表标题
   * @param option.subtext:图表子级标题
   * @param option.name:子块标题
   * @param option.legendData:折线名称，(Array)
   * @param option.seriesData: 具体数据，数组包含多个对象(Array)
   */
  pie(option) {
    if (!Array.isArray(option.legendData) || !Array.isArray(option.seriesData)) {
      throw Error('Some type of parameter is not Array,Please fix it')
    }

    const { text, name, subtext, legendData, seriesData } = option

    const config = {
      title: {
        text,
        subtext,
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
          name,
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
    }
    return config
  },

  /**
   * 纵向柱状图
   * @param option.text:图表标题
   * @param option.subtext:图表子级标题
   * @param option.name:子块标题
   * @param option.legendData:折线名称，(Array)
   * @param option.axisData:坐标轴数据，(Array)
   * @param option.seriesData: 具体数据，数组包含多个对象(Array)
   */
  yBar(option) {
    if (!Array.isArray(option.axisData) || !Array.isArray(option.seriesData)) {
      throw Error('Some type of parameter is not Array,Please fix it')
    }

    const { text, name, subtext, legendData, axisData, seriesData } = option

    const seriesConfig = {
      name,
      type: 'bar',
      label: {
        normal: {
          position: 'right',
          show: true
        }
      }
    }

    let series
    if (Array.isArray(option.legendData)) {
      series = seriesData.map((s, i) => {
        return Object.assign({ data: s }, seriesConfig, { name: legendData[i] })
      })
    } else {
      series = [Object.assign({ data: seriesData }, seriesConfig)]
    }

    const config = {
      title: {
        text,
        subtext
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
    }

    return config
  },

  /**
   * 横向的柱状图
   * @param option.text:图表标题
   * @param option.subtext:图表子级标题
   * @param option.name:子块标题
   * @param option.legendData:折线名称，(Array)
   * @param option.axisData:坐标轴数据，(Array)
   * @param option.seriesData: 具体数据，数组包含多个对象(Array)
   */
  xBar(option) {
    option = option || {}
    if (!Array.isArray(option.axisData) || !Array.isArray(option.seriesData)) {
      throw Error('Some type of parameter is not Array,Please fix it')
    }

    const { text, name, subtext, legendData, axisData, seriesData } = option

    const seriesConfig = {
      name,
      type: 'bar',
      label: {
        normal: {
          position: 'top',
          show: true
        }
      }
    }

    let series
    if (Array.isArray(option.legendData)) {
      series = seriesData.map((s, i) => {
        return Object.assign({ data: s }, seriesConfig, { name: legendData[i] })
      })
    } else {
      series = [Object.assign({ data: seriesData }, seriesConfig)]
    }

    const config = {
      title: {
        text,
        subtext
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
    }

    return config
  }

}

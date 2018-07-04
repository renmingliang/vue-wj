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

      </div>
    </el-card>
  </div>
</template>

<script>
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
      infoLoading: false,
      infoData: null
    }
  },
  computed: {
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
    }
  }
}
</script>

<style lang="scss">
.box-card{
  .el-card__header{
    padding: 10px 20px;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.box-card{
  &+&{
    margin-top: 28px;
  }
  .card-header{
    position: relative;
    .card-title{
      font-size: 18px;
      font-weight: bold;
    }
    .card-control{
      position: absolute;
      right: 0;
      top: 0;
    }
  }
}
</style>

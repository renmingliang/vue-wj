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
          prop="create_name"
          label="创建人"
          align="center">
        </el-table-column>
        <el-table-column
          prop="review_name"
          label="审核人"
          align="center">
        </el-table-column>
      </el-table>
    </el-card>

    <el-card class="box-card" shadow="never">
      <div slot="header" class="card-header">
        <span class="card-title">问卷操作</span>
      </div>
      <div class="custom-step">
        <div class="step-line"></div>
        <ul class="step-box">
          <li class="step-item">
            <el-row>
              <el-col :span="4">
                <span class="step-item-title">提交问卷</span>
              </el-col>
              <el-col :span="10">
                <span class="step-item-desc">问卷已创建成功，是否提交审核？</span>
              </el-col>
              <el-col :span="10">
                <el-button type="info" size="mini">提交</el-button>
              </el-col>
            </el-row>
          </li>
          <li class="step-item">
            <el-row>
              <el-col :span="4">
                <span class="step-item-title">审核问卷</span>
              </el-col>
              <el-col :span="10">
                <span class="step-item-desc">问卷已创建完毕，是否通过审核？</span>
              </el-col>
              <el-col :span="10">
                <el-button type="info" size="mini">通过</el-button>
                <el-button type="info" size="mini">驳回</el-button>
                <span class="hover-show">
                  <router-link class="hover-link" :to="{name: 'question-preview', params: {id: 1}}" target="_blank">
                    查看问卷
                  </router-link>
                </span>
                <span class="hover-show">
                  <router-link class="hover-link" :to="{name: 'question-setting', params: {id: 1}}" target="_blank">
                    查看设置
                  </router-link>
                </span>
              </el-col>
            </el-row>
          </li>
          <li class="step-item">
            <el-row>
              <el-col :span="4">
                <span class="step-item-title">问卷发布</span>
              </el-col>
              <el-col :span="10">
                <span class="step-item-desc">问卷已审核通过，是否发布？</span>
              </el-col>
              <el-col :span="10">
                <el-button type="info" size="mini">发布</el-button>
              </el-col>
            </el-row>
          </li>
          <li class="step-item">
            <el-row>
              <el-col :span="4">
                <span class="step-item-title">回收问卷</span>
              </el-col>
              <el-col :span="10">
                <span class="step-item-desc">问卷正在进行中，是否结束调研？</span>
              </el-col>
              <el-col :span="10">
                <el-button type="info" size="mini">回收</el-button>
              </el-col>
            </el-row>
          </li>
        </ul>
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
    create_name: '小A',
    review_name: '小B'
  }
]

export default {
  name: 'question-handle',
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

.custom-step{
  position: relative;
  .step-line{
    position: absolute;
    left: 40px;
    top: 10px;
    bottom: 10px;
    width: 2px;
    background-color: #a7a7a7;
    z-index: 1;
  }
  .step-box{
    position: relative;
    z-index: 2;
  }
  .step-item{
    &+.step-item{
      margin-top: 100px;
    }
    .step-item-title{
      background: rgb(242, 242, 242);
      padding: 5px 14px;
    }
  }
  .hover-show{
    .hover-link{
      padding: 0 0 0 10px;
      color: #409eff;
    }
  }
}
</style>

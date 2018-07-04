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
        <span class="card-title">答题记录</span>
        <div class="card-control">
          <el-button @click="handleExport" type="text"><i class="el-icon-download"></i>导出数据</el-button>
        </div>
      </div>
      <div>
        <el-table
          highlight-current-row
          border
          stripe
          v-loading="listLoading"
          :data="listData">
          <el-table-column
            fixed
            type="index"
            label="序号"
            align="center"
            width="100">
          </el-table-column>
          <el-table-column
            prop="role_id"
            label="角色ID"
            align="center">
          </el-table-column>
          <el-table-column
            prop="role_name"
            label="角色昵称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="role_level"
            label="角色等级"
            align="center">
          </el-table-column>
          <el-table-column
            prop="server_name"
            label="服务器"
            align="center">
          </el-table-column>
          <el-table-column
            prop="answer_time"
            label="提交时间"
            align="center">
          </el-table-column>
          <el-table-column
            prop="answer_diff"
            label="耗时（秒）"
            align="center">
          </el-table-column>
          <el-table-column
            prop="answer_area"
            label="地区"
            align="center">
          </el-table-column>
          <el-table-column
            label="操作"
            align="center">
            <template slot-scope="scope">
              <span class="hover-show">
                <router-link
                  :to="{name:'question-preview', params: {id: scope.row.id}}"
                  class="hover-link"
                  target="_blank">查看</router-link>
              </span>
            </template>
          </el-table-column>
        </el-table>
        <div class="search-pagination">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="listQuery.page"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="listQuery.page_size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="listTotal">
          </el-pagination>
        </div>
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

const defaultList = [
  {
    id: 1,
    role_id: 1003,
    role_name: '角色的昵称名',
    role_level: 50,
    server_name: '服务器的名称',
    answer_time: '2018-8-8 12:00:01',
    answer_diff: '190s',
    answer_ip: '202.113.112.125',
    answer_area: '广东深圳'
  }
]

export default {
  name: 'question-download',
  data() {
    return {
      infoLoading: false,
      listLoading: false,
      infoData: null,
      listData: null,
      listTotal: null,
      listQuery: {
        page: 1,
        page_size: 10
      }
    }
  },
  computed: {
  },
  created() {
    this.getList()
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
    // 1.获取答题列表数据
    getList() {
      this.listLoading = true
      setTimeout(() => {
        this.listData = defaultList
        this.listTotal = this.listData.length
        this.listLoading = false
      }, 1000)
    },
    // 2.单页最大显示数据条数
    handleSizeChange(val) {
      this.listQuery.page_size = val
      this.getList()
    },
    // 3.处理分页
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    // 4.导出数据
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

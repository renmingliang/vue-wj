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

    <el-card class="box-card" shadow="never">
      <div slot="header" class="card-header">
        <span class="card-title">答题记录</span>
        <div class="card-control">
          <el-button @click="handleExport('paper/list')" type="text"><i class="el-icon-download"></i>导出数据</el-button>
        </div>
      </div>
      <div>
        <el-table
          highlight-current-row
          border
          stripe
          :data="listData">
          <el-table-column
            fixed
            type="index"
            label="序号"
            align="center"
            width="100">
          </el-table-column>
          <template v-if="questionType !== '1'">
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
          </template>
          <el-table-column
            prop="create_time"
            label="提交时间"
            align="center">
          </el-table-column>
          <el-table-column
            prop="use_time"
            label="耗时（秒）"
            align="center">
          </el-table-column>
          <el-table-column
            prop="ip"
            label="IP"
            align="center">
          </el-table-column>
          <el-table-column
            prop="region"
            label="省份"
            align="center">
          </el-table-column>
          <el-table-column
            prop="city"
            label="城市"
            align="center">
          </el-table-column>
          <el-table-column
            label="操作"
            align="center">
            <template slot-scope="scope">
              <span class="hover-show">
                <router-link
                  :to="{name:'preview-answer', params: {id: scope.row.id}}"
                  class="hover-link"
                  target="_blank">
                  <i class="el-icon-view"></i>
                  查看
                </router-link>
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
            :page-size="listQuery.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="listTotal">
          </el-pagination>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import { mapGetters } from 'vuex'
import qs from 'qs'

export default {
  name: 'question-download',
  data() {
    return {
      id: this.$route.params.id,
      questionType: '0',
      infoData: null,
      listData: null,
      listTotal: null,
      listQuery: {
        page: 1,
        size: 10
      }
    }
  },
  computed: {
    ...mapGetters([
      'questionLoading'
    ])
  },
  created() {
    this.getInfo()
    this.getList()
  },
  methods: {
    // 0.获取问卷信息
    getInfo() {
      this.$store.dispatch('QUESTION_FETCH_DETAIL', {question_id: this.id})
        .then(res => {
          const temp = res.data
          this.infoData = [temp]
          this.questionType = temp.type
        })
    },
    // 1.获取答题列表数据
    getList() {
      const params = Object.assign({}, this.listQuery, {question_id: this.id})
      this.$store.dispatch('QUESTION_ANSWER_LIST', params)
        .then(res => {
          const { list, count } = res.data
          this.listData = list
          this.listTotal = +count
        })
    },
    // 2.单页最大显示数据条数
    handleSizeChange(val) {
      this.listQuery.size = val
      this.getList()
    },
    // 3.处理分页
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    // 4.导出数据
    handleExport(url) {
      const token = getToken()
      const params = Object.assign({}, this.listQuery, {type: this.questionType}, {question_id: this.id}, { token }, { export: 1 })
      const query = qs.stringify(params)
      window.open(`/${url}?` + query)
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
.hover-link{
  color: #f40;
}
</style>

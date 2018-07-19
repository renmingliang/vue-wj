<template>
  <div class="search-container">
    <div class="common-wrap search-filter">
      <el-form ref="form" :model="listQuery" label-width="120px">
        <el-row :gutter="30">
          <el-col :span="8">
            <el-form-item label="角色 ID：">
              <el-input v-model="listQuery.role_id" placeholder="角色ID" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="问卷 ID：">
              <el-select v-model="listQuery.question_id" placeholder="请选择">
                <el-option
                  v-for="item in questionIdOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="领取起始时间：">
              <el-date-picker
                :picker-options="startDateOpt"
                type="date"
                placeholder="请选择"
                value-format="yyyy-MM-dd"
                v-model="listQuery.start_time">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="30">
          <el-col :span="8">
            <el-form-item label="角色昵称：">
              <el-autocomplete
                placeholder="支持模糊搜索"
                v-model="listQuery.role_name"
                :fetch-suggestions="querySearch"
                :trigger-on-focus="false"
              ></el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属项目：">
              <el-select v-model="listQuery.project_id" placeholder="请选择">
                <el-option
                  v-for="item in projectOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="领取结束时间：">
              <el-date-picker
                :picker-options="endDateOpt"
                type="date"
                placeholder="请选择"
                value-format="yyyy-MM-dd"
                v-model="listQuery.end_time">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="30">
          <el-col :span="10">
            <el-form-item>
              <el-button @click="handleFilter" type="primary" icon="el-icon-search">搜索</el-button>
              <el-button v-if="$_has('paper/item-list')" @click="handleExport('paper/item-list')" icon="el-icon-download">下载</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div class="common-wrap search-result">
      <el-table
        v-loading="awardLoading"
        element-loading-text="拼命加载中"
        highlight-current-row
        border
        stripe
        :data="awardData">
        <el-table-column
          type="index"
          label="序号"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          prop="question_id"
          label="问卷ID"
          align="center">
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
          prop="server_name"
          label="服务器名称"
          align="center">
        </el-table-column>
        <el-table-column
          prop="role_level"
          label="角色等级"
          align="center">
        </el-table-column>
        <el-table-column
          label="领取时间"
          align="center">
            <template slot-scope="scope">{{ scope.row.send_time }}</template>
        </el-table-column>
        <el-table-column
          label="发放状态"
          align="center">
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.send_status === '1'?'success':'danger'"
                disable-transitions>{{scope.row.send_status_name}}</el-tag>
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
          :total="awardTotal">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import { mapGetters } from 'vuex'
import qs from 'qs'

export default {
  name: 'record',
  data() {
    return {
      listQuery: {
        page: 1,
        size: 10,
        role_id: '',
        role_name: '',
        question_id: '',
        project_id: '',
        start_time: '',
        end_time: ''
      },
      startDateOpt: {
        disabledDate: (time) => {
          return time.getTime() > Date.parse(this.listQuery.end_time)
        }
      },
      endDateOpt: {
        disabledDate: (time) => {
          return time.getTime() < Date.parse(this.listQuery.start_time)
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'awardLoading',
      'defaultOptions',
      'projectName',
      'questionId',
      'awardData',
      'awardTotal'
    ]),
    questionIdOptions() {
      return this.defaultOptions.concat(this.questionId)
    },
    projectOptions() {
      return this.defaultOptions.concat(this.projectName)
    }
  },
  created() {
    // 默认执行一次查询
    this.getList()
  },
  methods: {
    // 0.获取数据
    getList() {
      this.$store.dispatch('AWARD_FETCH_LIST', this.listQuery)
    },
    // 1.搜索
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
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
    // 4.导出表格
    handleExport(url) {
      const token = getToken()
      const params = Object.assign({}, this.listQuery, { token }, { export: 1 })
      const query = qs.stringify(params)
      window.open(`/${url}?` + query)
    },
    // 5.模糊搜索角色昵称
    querySearch(role_name, cb) {
      this.$store.dispatch('AWARD_SEARCH_ROLE', { role_name })
        .then(res => {
          const result = res.data.map(item => {
            return {
              id: item.id,
              value: item.role_name
            }
          })
          // 调用callback返回建议列表的数据
          cb(result)
        })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

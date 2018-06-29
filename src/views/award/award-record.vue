<template>
  <div class="search-container">
    <div class="common-wrap search-filter">
      <el-form ref="form" :model="listQuery" label-width="120px">
        <el-row :gutter="30">
          <el-col :span="8">
            <el-form-item label="角色 ID：">
              <el-input v-model="listQuery.id" placeholder="角色ID" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="问卷 ID：">
              <el-select v-model="listQuery.sub_right" placeholder="请选择">
                <el-option
                  v-for="item in typeOptions"
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
                v-model="listQuery.right_begin">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="30">
          <el-col :span="8">
            <el-form-item label="角色昵称：">
              <el-autocomplete
                placeholder="支持模糊搜索"
                v-model="listQuery.name"
                :fetch-suggestions="querySearch"
                :trigger-on-focus="false"
              ></el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属项目：">
              <el-select v-model="listQuery.company" placeholder="请选择">
                <el-option
                  v-for="item in companyOptions"
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
                v-model="listQuery.right_end">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="30">
          <el-col :span="10">
            <el-form-item>
              <el-button @click="handleFilter" type="primary" icon="el-icon-search">搜索</el-button>
              <el-button @click="handleExport('ip/export-lists')" icon="el-icon-download">下载</el-button>
              <a ref="exportExcel" style="display:none;" :href="exportUrl" target="_blank">导出链接</a>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div class="common-wrap search-result">
      <el-table
        v-loading="listLoading"
        element-loading-text="拼命加载中"
        highlight-current-row
        border
        stripe
        :data="listData">
        <el-table-column
          type="index"
          label="序号"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          prop="survey_id"
          label="问卷ID"
          align="center">
        </el-table-column>
        <el-table-column
          label="角色ID"
          align="center">
          <template slot-scope="scope">{{ scope.row.role_id }}</template>
        </el-table-column>
        <el-table-column
          prop="role_name"
          label="角色名称"
          align="center">
        </el-table-column>
        <el-table-column
          prop="role_server"
          label="服务器名称"
          align="center">
        </el-table-column>
        <el-table-column
          prop="role_grade"
          label="角色等级"
          align="center">
        </el-table-column>
        <el-table-column
          label="领取时间"
          align="center">
            <template slot-scope="scope">{{ scope.row.record_time }}</template>
        </el-table-column>
        <el-table-column
          label="发放状态"
          align="center">
            <template slot-scope="scope">
              <el-tag
                v-if="scope.row.record_status > 0"
                type="success"
                disable-transitions>成功</el-tag>
              <el-tag
                v-else
                type="danger"
                disable-transitions>失败</el-tag>
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
  </div>
</template>

<script>
import qs from 'qs'

const defalutOptions = [
  {label: '全部', value: '0'}
]
const result = {
  data: [
    {
      survey_id: '1',
      role_id: '111222333',
      role_name: '角色昵称',
      role_server: '服务器名称',
      role_grade: '角色等级',
      record_time: '2018-06-06 19:00:01',
      record_status: 0
    },
    {
      survey_id: '2',
      role_id: '111222333',
      role_name: '角色昵称',
      role_server: '服务器名称',
      role_grade: '角色等级',
      record_time: '2018-06-06 19:11:01',
      record_status: 1
    },
    {
      survey_id: '3',
      role_id: '111222333',
      role_name: '角色昵称',
      role_server: '服务器名称',
      role_grade: '角色等级',
      record_time: '2018-06-06 19:22:01',
      record_status: 0
    },
    {
      survey_id: '4',
      role_id: '111222333',
      role_name: '角色昵称',
      role_server: '服务器名称',
      role_grade: '角色等级',
      record_time: '2018-06-06 19:33:01',
      record_status: 0
    },
    {
      survey_id: '5',
      role_id: '111222333',
      role_name: '角色昵称',
      role_server: '服务器名称',
      role_grade: '角色等级',
      record_time: '2018-06-06 19:44:01',
      record_status: 1
    }
  ],
  total_count: '100'
}

export default {
  name: 'record',
  data() {
    return {
      exportUrl: 'javascript:;',
      adaptationName: [],
      companyName: [],
      listLoading: false,
      listData: null,
      listTotal: null,
      listQuery: {
        page: 1,
        page_size: 10,
        id: null,
        name: '',
        company: '',
        sub_right: '',
        remark: '',
        right_begin: '',
        right_end: ''
      },
      multipleSelection: [],
      startDateOpt: {
        disabledDate: (time) => {
          return time.getTime() > Date.parse(this.listQuery.right_end)
        }
      },
      endDateOpt: {
        disabledDate: (time) => {
          return time.getTime() < Date.parse(this.listQuery.right_begin)
        }
      }
    }
  },
  computed: {
    typeOptions() {
      if (this.adaptationName) {
        return defalutOptions.concat(this.adaptationName)
      } else {
        return defalutOptions
      }
    },
    companyOptions() {
      if (this.companyName) {
        return defalutOptions.concat(this.companyName)
      } else {
        return defalutOptions
      }
    }
  },
  created() {
    // 默认执行一次查询
    this.getList()
  },
  methods: {
    // 0.获取数据
    getList() {
      this.listLoading = true
      setTimeout(() => {
        this.listData = result.data
        this.listTotal = +result.total_count
        this.listLoading = false
      }, 1000)
      /* this.$store.dispatch('AWARD_FETCH_LIST', this.listQuery)
        .then(res => {
          const result = res.data
          this.listData = result.data
          this.listTotal = +result.total_count
          this.listLoading = false
        })
        .catch(() => {
          this.listLoading = false
        }) */
    },
    // 1.搜索
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
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
    // 4.导出表格
    handleExport(params) {
      // 至少选择导出一项
      const tempIds = this.multipleSelection.map(item => {
        return item.id
      })
      const ids = tempIds.join(',')
      const query = qs.stringify(this.listQuery)
      // 浏览器兼容处理
      if (location.origin) {
        this.exportUrl = location.origin + `/${params}?${query}&ids=${ids}`
      } else {
        // IE
        this.exportUrl = `/${params}?${query}&ids=${ids}`
      }

      setTimeout(() => {
        this.$refs.exportExcel.click()
      }, 200)
    },
    // 5.处理选择
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 6.模糊搜索IP名称
    querySearch(name, cb) {
      this.$store.dispatch('IP_SEARCH_NAME', { name })
        .then(res => {
          const result = res.data.map(item => {
            return {
              id: item.id,
              value: item.name
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

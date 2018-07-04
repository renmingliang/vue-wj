<template>
  <div class="search-container">
    <div class="common-wrap search-filter">
      <el-form ref="form" :model="listQuery" label-width="120px">
        <el-row>
          <el-col :span="16">
            <el-row :gutter="30">
              <el-col :span="12">
                <el-form-item label="问卷标题：">
                  <el-autocomplete
                    placeholder="支持模糊搜索"
                    v-model.trim="listQuery.title"
                    :fetch-suggestions="querySearch"
                    :trigger-on-focus="false"
                  ></el-autocomplete>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="问卷状态：">
                  <el-select v-model="listQuery.status" placeholder="请选择">
                    <el-option
                      v-for="item in statusOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="30">
              <el-col :span="12">
                <el-form-item label="问卷类型：">
                  <el-select v-model="listQuery.type" placeholder="请选择">
                    <el-option
                      v-for="item in typeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="问卷项目：">
                  <el-select v-model="listQuery.project" placeholder="请选择">
                    <el-option
                      v-for="item in projectOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="10px">
              <el-button type="primary" @click="handleFilter">搜索问卷</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div class="common-wrap search-result">
      <div class="search-list" v-loading="listLoading">
        <ul>
          <li class="list-item">
            <div class="item-summary">
              <el-row>
                <el-col :span="3">
                  <p class="text-ellipsis">问卷ID：006</p>
                </el-col>
                <el-col :span="12">
                  <p class="text-ellipsis">问卷标题：我是问卷的标题这个标题很长长长长长长长长长长长长我是问卷的标题这个标题很长长长长长长长长长长长长</p>
                </el-col>
                <el-col :span="2">
                  <p class="text-center">已结束</p>
                </el-col>
                <el-col :span="5">
                  <p class="text-ellipsis">所属项目：妖精的尾巴</p>
                </el-col>
                <el-col :span="2">
                  <p class="text-right">
                    <el-tag
                      type="success"
                      disable-transitions>通用型</el-tag>
                  </p>
                </el-col>
              </el-row>
            </div>
            <div class="item-control">
              <el-row>
                <el-col :span="15" class="text-center">
                  <el-col :span="8">
                    <div class="control-custom">
                      <router-link :to="{ name: 'question-edit', params: {id: 1} }">问卷编辑</router-link>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div class="control-custom">
                      <router-link :to="{ name: 'question-analyse', params: {id: 1} }">问卷分析</router-link>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div class="control-custom">
                      <router-link :to="{ name: 'question-download', params: {id: 1} }">问卷下载</router-link>
                    </div>
                  </el-col>
                </el-col>
                <el-col :span="2">
                  <div class="control-btn">
                    <router-link :to="{name:'question-handle', params: {id: 1}}">
                      <el-button size="mini" icon="el-icon-edit" plain>操作</el-button>
                    </router-link>
                  </div>
                  <div class="control-btn"><el-button size="mini" icon="el-icon-document" type="info" plain>复制</el-button></div>
                  <div class="control-btn"><el-button size="mini" icon="el-icon-delete" type="danger" plain>删除</el-button></div>
                </el-col>
                <el-col :span="7">
                  <p>创建人：小A</p>
                  <p>创建时间：2018-7-8 12:20:01</p>
                  <p>审核人：小B</p>
                  <p>问卷数：<b class="red">300</b>份</p>
                </el-col>
              </el-row>
            </div>
          </li>
          <li class="list-item">
            <div class="item-summary">
              <el-row>
                <el-col :span="3">
                  <p class="text-ellipsis">问卷ID：006</p>
                </el-col>
                <el-col :span="12">
                  <p class="text-ellipsis">问卷标题：我是问卷的标题这个标题很长长长长长长长长长长长长我是问卷的标题这个标题很长长长长长长长长长长长长</p>
                </el-col>
                <el-col :span="2">
                  <p class="text-center">已结束</p>
                </el-col>
                <el-col :span="5">
                  <p class="text-ellipsis">所属项目：妖精的尾巴</p>
                </el-col>
                <el-col :span="2">
                  <p class="text-right">
                    <el-tag
                      type="success"
                      disable-transitions>通用型</el-tag>
                  </p>
                </el-col>
              </el-row>
            </div>
            <div class="item-control">
              <el-row>
                <el-col :span="15" class="text-center">
                  <el-col :span="8">
                    <div class="control-custom">
                      <router-link :to="{ name: 'question-edit', params: {id: 2} }">问卷编辑</router-link>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div class="control-custom">
                      <router-link :to="{ name: 'question-analyse', params: {id: 2} }">问卷分析</router-link>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div class="control-custom">
                      <router-link :to="{ name: 'question-download', params: {id: 2} }">问卷下载</router-link>
                    </div>
                  </el-col>
                </el-col>
                <el-col :span="2">
                  <div class="control-btn">
                    <router-link :to="{name:'question-handle', params: {id: 2}}">
                      <el-button size="mini" icon="el-icon-edit" plain>操作</el-button>
                    </router-link>
                  </div>
                  <div class="control-btn"><el-button size="mini" icon="el-icon-document" type="info" plain>复制</el-button></div>
                  <div class="control-btn"><el-button size="mini" icon="el-icon-delete" type="danger" plain>删除</el-button></div>
                </el-col>
                <el-col :span="7">
                  <p>创建人：小A</p>
                  <p>创建时间：2018-7-8 12:20:01</p>
                  <p>审核人：小B</p>
                  <p>问卷数：<b class="red">300</b>份</p>
                </el-col>
              </el-row>
            </div>
          </li>
        </ul>
      </div>

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
const defalutOptions = [
  {label: '全部', value: '0'}
]

export default {
  name: 'question-list',
  data() {
    return {
      listData: null,
      listTotal: null,
      listLoading: false,
      listQuery: {
        page: 1,
        page_size: 10,
        id: null,
        title: '',
        type: '',
        status: '',
        project: ''
      }
    }
  },
  created() {
    // 默认执行一次查询
    this.getList()
  },
  computed: {
    typeOptions() {
      return defalutOptions
    },
    statusOptions() {
      return defalutOptions
    },
    projectOptions() {
      return defalutOptions
    }
  },
  methods: {
    // 0.获取数据
    getList() {
      this.listLoading = true
      setTimeout(() => {
        this.listLoading = false
      }, 1000)
      /* this.$store.dispatch('IP_FETCH_LIST', this.listQuery)
        .then(res => {
          const result = res.data
          this.listData = result.data
          this.listTotal = +result.total_count
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
    // 4.复制
    handleCopy(index, row, paramsId) {
      console.log('copy')
    },
    // 6.删除
    handleDelete(index, row, paramsId) {
      let delData, delType, params
      if (paramsId) {
        delType = 'IP_PROJECT_DELETE'
        params = {ip_right_id: paramsId}
      } else {
        delData = this.listData
        delType = 'IP_DELETE'
        params = {id: row.id}
      }
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch(delType, params)
          .then(res => {
            if (delData) { delData.splice(index, 1) }
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
          .catch(err => {
            console.log(err.msg)
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 7.模糊搜索问卷标题
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

<style rel="stylesheet/scss" lang="scss" scoped>
.search-list{
  background: rgba(222, 222, 239, 0.498039215686275);
  .list-item{
    background-color: rgb(242, 242, 242);
    &+.list-item{
      margin-top: 26px;
    }
    .item-summary{
      overflow: hidden;
      background-color: #d7d7d7;
      padding: 0 10px;
      line-height: 40px;
    }
    .item-control{
      padding: 10px;
      .control-btn{
        text-align: center;
        &+.control-btn{
          margin-top: 10px;
        }
      }
      .control-custom{
        width: 104px;
        height: 40px;
        cursor: pointer;
        margin-top: 28px;
        line-height: 40px;
        border-radius: 5px;
        display: inline-block;
        transition: all 0.2s;
        border: 1px solid rgb(121, 121, 121);
        &:hover{
          border-color: rgb(204, 204, 204);
          background-color: rgb(204, 204, 204);
        }
      }
    }
  }
}
</style>

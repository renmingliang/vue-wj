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

    <div
      class="common-wrap search-result"
      v-loading="questionLoading">
      <div class="search-list">
        <ul v-if="questionList.length">
          <li
            class="list-item"
            v-for="(item, index) in questionList"
            :key="item.id">
            <div class="item-summary">
              <el-row>
                <el-col :span="3">
                  <p class="item-summary-id text-ellipsis">问卷ID：{{item.id}}</p>
                </el-col>
                <el-col :span="11">
                  <p class="text-ellipsis">问卷标题：{{item.title}}</p>
                </el-col>
                <el-col :span="3">
                  <p class="text-center"><span class="icon-status" :class="`status-${item.status}`">{{item.status_name}}</span></p>
                </el-col>
                <el-col :span="5">
                  <p class="text-ellipsis">所属项目：{{item.project_name}}</p>
                </el-col>
                <el-col :span="2">
                  <p class="text-right">
                    <template v-if="item.type === '0'">
                      <span class="item-summary-tag tag-0">{{item.type_name}}</span>
                    </template>
                    <template v-else>
                      <span class="item-summary-tag">{{item.type_name}}</span>
                    </template>
                  </p>
                </el-col>
              </el-row>
            </div>
            <div class="item-control">
              <el-row>
                <el-col :span="14" class="text-center">
                  <el-col :span="8">
                    <template v-if="item.status === '0' || item.status === '2'">
                      <div v-if="$_has('question/question-edit')" class="control-custom">
                        <router-link :to="{ name: 'setting-edit', params: {id: item.id} }">问卷编辑</router-link>
                      </div>
                    </template>
                    <template v-else>
                      <div v-if="$_has('question/question-edit')" class="not-allow control-custom">
                        <span>问卷编辑</span>
                      </div>
                    </template>
                  </el-col>
                  <el-col :span="8">
                    <div v-if="$_has('data/answer')" class="control-custom">
                      <router-link :to="{ name: 'question-analyse', params: {id: item.id} }">问卷分析</router-link>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div v-if="$_has('paper/list')" class="control-custom">
                      <router-link :to="{ name: 'question-download', params: {id: item.id} }">问卷下载</router-link>
                    </div>
                  </el-col>
                </el-col>
                <el-col :span="3">
                  <div class="control-btn">
                    <router-link :to="{name:'question-handle', params: {id: item.id}}">
                      <el-button size="mini" icon="el-icon-edit" plain>操作</el-button>
                    </router-link>
                  </div>
                  <div class="control-btn">
                    <el-button v-if="$_has('question/question-copy')" @click="handleCopy(index, item)" size="mini" icon="el-icon-document" type="info" plain>复制</el-button>
                  </div>
                  <div class="control-btn">
                    <el-button v-if="$_has('question/question-del')" @click="handleDelete(index, item)" size="mini" icon="el-icon-delete" type="danger" plain>删除</el-button>
                  </div>
                </el-col>
                <el-col :span="7">
                  <p>创建人：{{item.create_user}}</p>
                  <p>创建时间：{{item.create_time}}</p>
                  <p>审核人：{{item.verify_user}}</p>
                  <p>问卷数：<b class="red">{{item.count}}</b> 份</p>
                </el-col>
              </el-row>
            </div>
          </li>
        </ul>
        <div v-else class="empty-box">
          <span class="empty-tip">暂无数据</span>
        </div>
      </div>

      <div class="search-pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="listQuery.page"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="listQuery.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="questionTotal">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'question-list',
  data() {
    return {
      listQuery: {
        page: 1,
        size: 10,
        title: '',
        type: '',
        status: '',
        project_id: ''
      }
    }
  },
  created() {
    // 默认执行一次查询
    this.getList()
    // 更新获取项目名称
    this.$store.dispatch('PROJECT_FETCH_LIST')
  },
  computed: {
    ...mapGetters([
      'defaultOptions',
      'projectName',
      'questionType',
      'questionStatus',
      'questionList',
      'questionTotal',
      'questionLoading'
    ]),
    typeOptions() {
      return this.defaultOptions.concat(this.questionType)
    },
    statusOptions() {
      return this.defaultOptions.concat(this.questionStatus)
    },
    projectOptions() {
      return this.defaultOptions.concat(this.projectName)
    }
  },
  methods: {
    // 0.获取数据
    getList() {
      this.$store.dispatch('QUESTION_FETCH_LIST', this.listQuery)
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
    // 4.复制
    handleCopy(index, item) {
      const that = this
      this.$store.dispatch('QUESTION_COPY', {question_id: item.id})
        .then(() => {
          this.$message({
            type: 'success',
            message: '复制成功!',
            duration: 1 * 1000,
            onClose: function() {
              // 更新获取数据列表
              that.getList()
            }
          })
        })
        .catch(() => {
          this.$message.info('复制失败，请稍后重试')
        })
    },
    // 5.删除
    handleDelete(index, item) {
      const that = this
      this.$confirm('此操作将永久删除该问卷, 是否继续?', '提示', {
        closeOnClickModal: false,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('QUESTION_DEL', {question_id: item.id})
          .then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!',
              duration: 1 * 1000,
              onClose: function() {
                // 更新获取数据列表
                const isPageOne = that.questionTotal % that.listQuery.size === 1
                if (isPageOne) { that.listQuery.page-- }
                that.getList()
              }
            })
          })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    // 7.模糊搜索问卷标题
    querySearch(title, cb) {
      this.$store.dispatch('QUESTION_SEARCH_TITLE', { title })
        .then(res => {
          console.log(res.data)
          const result = res.data.list.map(item => {
            return {
              id: item.id,
              value: item.title
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
  .list-item{
    border: 1px solid #d7d8db;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.12);
    &+.list-item{
      margin-top: 26px;
    }
    .item-summary{
      overflow: hidden;
      background-color: #f0f0f0;
      padding: 0 10px;
      line-height: 40px;
      border-bottom: 1px solid #d7d8db;
      .item-summary-id{
        color: #8694ac;
      }
      .item-summary-tag{
        &.tag-0{
          background: #75d08d;
        }
        width: 60px;
        height: 30px;
        background: #55a8fd;
        display: inline-block;
        text-align: center;
        line-height: 30px;
        font-size: 12px;
        border-radius: 16px;
        color: #fff;
      }
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
        width: 98px;
        height: 34px;
        cursor: pointer;
        margin-top: 28px;
        line-height: 34px;
        border-radius: 5px;
        display: inline-block;
        -webkit-transition: all 0.2s;
        transition: all 0.2s;
        border: 1px solid #cdd1d5;
        color: #717171;
        &:hover{
          background: #8cc0ff;
          color: #fff;
          border-color: #68acff;
        }
        &.not-allow:hover{
          background: #ccc;
          border-color: #cdd1d5;
        }
      }
    }
    .red{
      font-weight: normal;
    }
  }
}

.icon-status{
  display: inline-block;
  padding: 2px 12px 2px 27px;
  border: 1px solid #ddd;
  border-radius: 30px;
  line-height: 18px;
  font-size: 12px;
  background-position: 10px center;
  background-repeat: no-repeat;
  &.status-0{
    color: #979fd6;
    border-color: #bdd9f5;
    background-image: url(../../assets/images/status-0.png);
  }
  &.status-1{
    color: #55a8fd;
    border-color: #55a8fd;
    background-image: url(../../assets/images/status-1.png);
  }
  &.status-2{
    color: #fc8b37;
    border-color: #fc8b37;
    background-image: url(../../assets/images/status-2.png);
  }
  &.status-3{
    color: #fe7373;
    border-color: #ff7272;
    background-image: url(../../assets/images/status-3.png);
  }
  &.status-4{
    color: #6db981;
    border-color: #c6ead0;
    background-image: url(../../assets/images/status-4.png);
  }
  &.status-5{
    color: #777b95;
    border-color: #cfdbe6;
    background-image: url(../../assets/images/status-5.png);
  }
}
</style>

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

    <div class="common-wrap search-result">
      <div class="search-list" v-loading="questionLoading">
        <ul v-if="questionList.length">
          <li
            class="list-item"
            v-for="(item, index) in questionList"
            :key="item.id">
            <div class="item-summary">
              <el-row>
                <el-col :span="3">
                  <p class="text-ellipsis">问卷ID：{{item.id}}</p>
                </el-col>
                <el-col :span="11">
                  <p class="text-ellipsis">问卷标题：{{item.title}}</p>
                </el-col>
                <el-col :span="3">
                  <p class="text-center">{{item.status_name}}</p>
                </el-col>
                <el-col :span="5">
                  <p class="text-ellipsis">所属项目：{{item.project_name}}</p>
                </el-col>
                <el-col :span="2">
                  <p class="text-right">
                    <template v-if="item.type === '0'">
                      <el-tag
                        type="success"
                        disable-transitions>{{item.type_name}}</el-tag>
                    </template>
                    <template v-else>
                      <el-tag
                        disable-transitions>{{item.type_name}}</el-tag>
                    </template>
                  </p>
                </el-col>
              </el-row>
            </div>
            <div class="item-control">
              <el-row>
                <el-col :span="14" class="text-center">
                  <el-col :span="8">
                    <template v-if="item.status === '5'">
                      <div v-if="$_has('question/question-edit')" class="not-allow control-custom">
                        <span>问卷编辑</span>
                      </div>
                    </template>
                    <template v-else>
                      <div v-if="$_has('question/question-edit')" class="control-custom">
                        <router-link :to="{ name: 'setting-edit', params: {id: item.id} }">问卷编辑</router-link>
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
          const result = res.data.map(item => {
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
    .red{
      font-weight: normal;
    }
  }
}
</style>

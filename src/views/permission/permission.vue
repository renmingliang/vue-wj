<template>
  <div class="search-container">
    <div class="common-wrap search-filter">
      <el-form ref="form" :model="filterQuery" label-width="120px">
        <el-row :gutter="30">
          <el-col :span="7">
            <el-form-item label="项目名称">
              <el-select v-model="filterQuery.name" placeholder="请选择">
                <el-option v-for="item in permissionOptions" :label="item.label" :value="item.value" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="员工姓名">
              <el-autocomplete
                placeholder="支持模糊搜索"
                popper-class="custom-autocomplete"
                v-model.trim="filterQuery.username"
                :trigger-on-focus="false"
                :fetch-suggestions="querySearchUser">
              </el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label-width="10px">
              <el-button type="primary" @click="handleFilter">查询</el-button>
              <router-link :to="{name:'create-permission'}">
                <el-button type="info">新增权限</el-button>
              </router-link>
              <el-button type="info" @click="dialogFormVisible = true">新增员工</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <el-dialog
      center
      custom-class="custom-dialog-form"
      title="新增员工"
      :visible.sync="dialogFormVisible">
      <el-form
        ref="ruleForm"
        label-width="110px"
        :model="ruleForm">
        <el-form-item
          label="员工姓名"
          prop="username"
          :rules="{ required: true, message: '请输入员工姓名', trigger: 'blur' }">
          <el-autocomplete
            placeholder="支持模糊搜索"
            popper-class="custom-autocomplete"
            v-model="ruleForm.username"
            :trigger-on-focus="false"
            :fetch-suggestions="querySearch"
            @select="handleSuggestions">
            <template slot-scope="{ item }">
              <div class="name">
                <span>{{ item.value }}</span>
                <span class="addr">{{ item.nickname }}</span>
              </div>
            </template>
          </el-autocomplete>
        </el-form-item>
        <el-form-item
          label="员工权限"
          prop="ipr_permission"
          :rules="{required: true, message: '请选择员工权限', trigger: 'change'}">
          <el-select
            v-model="ruleForm.ipr_permission"
            placeholder="请选择">
            <el-option
              v-for="item in permissionName"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelSubmit">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>

    <div class="common-wrap search-result">
      <el-table
        v-loading="listLoading"
        element-loading-text="拼命加载中"
        highlight-current-row
        border
        stripe
        :data="computedPermission">
        <el-table-column
          fixed
          type="index"
          label="序号"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          label="员工姓名"
          align="center">
          <template slot-scope="scope">
            <span class="hover-show">
              <router-link
                :to="{name:'look-permission', params: {id: scope.row.id}}"
                class="hover-link">
                {{ scope.row.name }}
              </router-link>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="员工邮箱"
          align="center">
          <template slot-scope="scope">{{ scope.row.email }}</template>
        </el-table-column>
        <el-table-column
          label="权限项目"
          align="center">
            <template slot-scope="scope">
              <el-tooltip effect="dark" content="点击修改权限人员" placement="top">
                <router-link :to="{name: 'edit-user', params: {id: scope.row.id}}">
                  <span
                    v-for="(user, index) in scope.row.users"
                    :key="index">
                      <em :class="user === filterQuery.username? 'hightlight-color' : ''">{{ user }}</em>
                      {{ index === scope.row.users.length-1? '':'、' }}
                  </span>
                </router-link>
              </el-tooltip>
            </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="240">
          <template slot-scope="scope">
            <router-link
              :to="{name:'edit-permission', params: {id: scope.row.id}}">
              <el-button size="mini" icon="el-icon-edit">编辑</el-button>
            </router-link>
            <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
const defalutOptions = [
  {label: '全部', value: '0'}
]

export default {
  data() {
    return {
      timeout: null,
      permissAll: null,
      dialogFormVisible: false,
      listLoading: false,
      filterQuery: {
        name: '',
        username: ''
      },
      ruleForm: {
        username: '',
        ipr_permission: '',
        ks: 0
      }
    }
  },
  computed: {
    ...mapGetters([
      'permissionFilter',
      'permissionName',
      'permissionUser',
      'userList'
    ]),
    permissionOptions() {
      if (this.permissionName) {
        return defalutOptions.concat(this.permissionName)
      } else {
        return defalutOptions
      }
    },
    computedPermission() {
      return this.permissionFilter || this.permissAll
    }
  },
  created() {
    this.fetchPermission()
    this.fetchSsoUser()
  },
  methods: {
    // 获取所有权限名称
    fetchPermission() {
      this.$store.dispatch('PERMISSION_FETCH_LIST')
        .then(res => {
          this.permissAll = res.data
        })
    },
    // 获取所有SSO用户
    fetchSsoUser() {
      this.$store.dispatch('USER_FETCH_SSO')
    },
    // 搜索搜索
    handleFilter() {
      const filterQuery = this.filterQuery
      this.$store.commit('PERMISSION_FILTER', {filterQuery})
    },
    // 新增员工
    submitForm() {
      const that = this
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.listLoading = true
          this.$store.dispatch('PERMISSION_USER_ADD', this.ruleForm)
            .then(res => {
              this.resetForm()
              this.listLoading = false
              this.dialogFormVisible = false
              this.$message({
                type: 'success',
                message: '操作成功!',
                duration: 1 * 1000,
                onClose: function() {
                  that.$store.dispatch('PERMISSION_FETCH_LIST')
                    .then(() => {
                      that.handleFilter()
                    })
                }
              })
            })
            .catch(err => {
              this.listLoading = false
              console.log(err.msg)
            })
        } else {
          return false
        }
      })
    },
    // 取消新增员工
    cancelSubmit() {
      this.dialogFormVisible = false
      this.resetForm()
    },
    // 重置表单
    resetForm() {
      this.$refs.ruleForm.resetFields()
    },
    // 删除权限
    handleDelete(index, row) {
      // console.log(index, row)
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        this.$store.dispatch('PERMISSION_DELETE', { id: row.id })
          .then(res => {
            this.listLoading = false
            this.permissionFilter.splice(index, 1)
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
          .catch(err => {
            this.listLoading = false
            console.log(err.msg)
          })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    // 模糊搜索匹配增加员工权限
    querySearch(queryString, cb) {
      const tempData = this.userList
      const results = queryString ? tempData.filter(this.createStateFilter(queryString)) : tempData
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        cb(results)
      }, 200)
    },
    // 返回搜索到用户 -- 支持英文名与中文
    createStateFilter(queryString) {
      return (item) => {
        if (item.nickname) {
          return (item.nickname.toLowerCase().indexOf(queryString.toLowerCase()) !== -1) || (item.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
        } else {
          return (item.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
        }
      }
    },
    handleSuggestions(item) {
      this.ruleForm.ks = 1
    },
    // 模糊搜索匹配已有权限员工
    querySearchUser(queryString, cb) {
      const tempData = this.permissionUser
      const results = queryString ? tempData.filter(this.createStateFilter(queryString)) : tempData
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        cb(results)
      }, 200)
    }
  }
}
</script>

<style lang="scss" scoped>
.hightlight-color{
  background: #ff9632;
  padding: 0 5px;
}
.custom-autocomplete {
  li {
    line-height: normal;
    padding: 7px;
    .name {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .addr {
      font-size: 12px;
      color: #b4b4b4;
    }
    .highlighted .addr {
      color: #ddd;
    }
  }
}
</style>

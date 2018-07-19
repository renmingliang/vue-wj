<template>
  <div class="search-container" v-loading="permissionLoading">
    <div class="common-wrap search-filter">
      <el-form ref="form" :model="listQuery" label-width="120px">
        <el-row>
          <el-col :span="16">
            <el-row>
              <el-col :span="12">
                <el-form-item label="员工姓名">
                  <el-autocomplete
                    placeholder="支持模糊搜索"
                    popper-class="custom-autocomplete"
                    v-model.trim="listQuery.true_name"
                    :trigger-on-focus="false"
                    :fetch-suggestions="querySearchUserTrueName">
                  </el-autocomplete>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="员工账号">
                  <el-autocomplete
                    placeholder="支持模糊搜索"
                    popper-class="custom-autocomplete"
                    v-model.trim="listQuery.username"
                    :trigger-on-focus="false"
                    :fetch-suggestions="querySearchUserName">
                  </el-autocomplete>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="项目名称">
                  <el-select v-model="listQuery.project_id" placeholder="请选择">
                    <el-option v-for="item in projectOptions" :label="item.label" :value="item.value" :key="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="账号状态">
                  <el-select v-model="listQuery.status" placeholder="请选择">
                    <el-option v-for="item in userStatusOptions" :label="item.label" :value="item.value" :key="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="50px">
              <el-button type="primary" @click="handleFilter">查询</el-button>
              <el-button v-if="$_has('user/add')" type="info" @click="handleEdit">新增账号</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <el-dialog
      custom-class="custom-dialog-permission"
      center
      @open="fetchInfo"
      :title="ruleFormTitle"
      :fullscreen="true"
      :visible.sync="dialogFormVisible">
      <el-form
        ref="ruleForm"
        :model="ruleForm">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="card-header">
            <span class="card-title">员工账号</span>
          </div>
          <el-form-item
            prop="username"
            :rules="{ required: true, message: '请输入员工账号', trigger: 'blur' }">
            <el-autocomplete
              :disabled="isLook"
              placeholder="企业微信账号，支持中英文模糊搜索"
              popper-class="custom-autocomplete"
              v-model="ruleForm.username"
              :trigger-on-focus="false"
              :fetch-suggestions="querySearch">
              <template slot-scope="{ item }">
                <div class="name">
                  <span>{{ item.value }}</span>
                  <span class="addr">{{ item.nickname }}</span>
                </div>
              </template>
            </el-autocomplete>
          </el-form-item>
        </el-card>

        <el-card class="box-card" shadow="never">
          <div slot="header" class="card-header">
            <span class="card-title">权限项目</span>
          </div>
          <el-form-item>
            <el-checkbox-group
              v-model="ruleForm.permitted_appids">
              <el-checkbox
                v-for="project in permissionConfigData.projects"
                :key="project.id"
                :label="project.id">{{project.project_name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-card>

        <el-card class="box-card" shadow="never">
          <div slot="header" class="card-header">
            <span class="card-title">权限板块</span>
          </div>
          <el-form-item>
            <el-checkbox-group
              v-model="ruleForm.permitted_permissions">
              <el-row>
                <div v-for="item in permissionConfigData.menus_permissions" :key="item.id">
                  <div
                    class="custom-group"
                    v-for="child in item.children"
                    :key="child.id">
                    <span style="font-size: 14px;">{{child.name}}</span>
                    <ul class="group-item">
                      <li
                        v-for="permission in child.permissions"
                        :key="permission.id">
                        <el-checkbox :label="permission.id">{{permission.name}}</el-checkbox>
                      </li>
                    </ul>
                  </div>
                </div>
              </el-row>
            </el-checkbox-group>
          </el-form-item>
        </el-card>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>

    <div class="common-wrap search-result">
      <el-table
        v-loading="permissionUserLoading"
        element-loading-text="拼命加载中"
        highlight-current-row
        border
        stripe
        :data="permissionUser">
        <el-table-column
          fixed
          type="index"
          label="序号"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          prop="true_name"
          label="员工姓名"
          align="center">
        </el-table-column>
        <el-table-column
          prop="username"
          label="员工账号"
          align="center">
        </el-table-column>
        <el-table-column
          label="权限项目"
          align="center">
            <template slot-scope="scope">
              <span>{{scope.row.permitted_appids_name}}</span>
            </template>
        </el-table-column>
        <el-table-column
          label="权限板块"
          align="center">
            <template slot-scope="scope">
              <span>{{scope.row.permitted_permissions_name}}</span>
            </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="240">
          <template slot-scope="scope">
            <el-button
              v-if="$_has('user/update-permission')"
              size="mini"
              icon="el-icon-edit"
              @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button
              v-if="$_has('user/change-status')"
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
          :total="permissionUserTotal">
        </el-pagination>
      </div>

    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

const defaultUserStatus = [
  {label: '正常', value: '0'},
  {label: '禁用', value: '1'}
]

export default {
  data() {
    return {
      isLook: false,
      timeout: null,
      dialogFormVisible: false,
      ruleFormTitle: '新增账号权限',
      postType: 'PERMISSION_ADD',
      listQuery: {
        page: 1,
        page_size: 10,
        project_id: '',
        username: '',
        true_name: '',
        status: ''
      },
      ruleForm: {
        username: '',
        permitted_appids: [],
        permitted_permissions: [],
        permitted_menus: []
      }
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'defaultOptions',
      'permissionConfigIds',
      'permissionConfigData',
      'permissionUserTotal',
      'permissionUserLoading',
      'permissionLoading',
      'permissionUser',
      'projectName',
      'userSsoList'
    ]),
    userStatusOptions() {
      return this.defaultOptions.concat(defaultUserStatus)
    },
    projectOptions() {
      return this.defaultOptions.concat(this.projectName)
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 0.获取sso用户与权限配置信息
    fetchInfo() {
      this.$store.dispatch('USER_FETCH_SSO')
      this.$store.dispatch('PERMISSION_CONFIG')
    },
    // 1.获取权限用户列表
    getList() {
      this.$store.dispatch('PERMISSION_USER_LIST', this.listQuery)
    },
    // 2.搜索搜索
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // 3.单页最大显示数据条数
    handleSizeChange(val) {
      this.listQuery.page_size = val
      this.getList()
    },
    // 4.处理分页
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    // 5.编辑用户权限
    handleEdit(index, row) {
      // console.log(index, row)
      if (!row) {
        this.isLook = false
        this.ruleFormTitle = '新增账号权限'
        this.postType = 'PERMISSION_ADD'
        // 初始化类别数据
        this.ruleForm = {
          username: '',
          permitted_appids: [],
          permitted_permissions: [],
          permitted_menus: []
        }
      } else {
        this.isLook = true
        this.ruleFormTitle = '修改账号权限'
        this.postType = 'PERMISSION_UPDATE'
        // 填充对应类别数据
        this.ruleForm = {
          username: row.username,
          permitted_appids: row.permitted_appids.split(','),
          permitted_permissions: row.permitted_permissions.split(','),
          permitted_menus: [],
          id: row.id
        }
      }
      this.dialogFormVisible = true
    },
    // 6.表单提交
    submitForm() {
      const that = this
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          // 自查询补全页面权限数据id
          const tempMenu = []
          this.permissionConfigIds.forEach(item => {
            this.ruleForm.permitted_permissions.forEach(child => {
              if (item.permission_id.includes(child)) {
                if (!tempMenu.includes(item.id)) {
                  tempMenu.push(item.id)
                }
                if (!tempMenu.includes(item.pid)) {
                  tempMenu.push(item.pid)
                }
              }
            })
          })
          this.ruleForm.permitted_menus = tempMenu

          this.$store.dispatch(this.postType, this.ruleForm)
            .then(res => {
              this.dialogFormVisible = false
              this.$message({
                type: 'success',
                message: '操作成功!',
                duration: 1 * 1000,
                onClose: function() {
                  if (that.ruleForm.username === that.name) {
                    location.reload()
                  } else {
                    that.handleFilter()
                  }
                }
              })
            })
        } else {
          return false
        }
      })
    },
    // 7.删除用户权限
    handleDelete(index, row) {
      // console.log(index, row)
      const that = this
      this.$confirm('此操作将禁用该账号权限，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('PERMISSION_DEL', { id: row.id })
          .then(res => {
            this.$message({
              type: 'success',
              message: '删除成功!',
              onClose: function() {
                if (that.ruleForm.username === that.name) {
                  that.$store.dispatch('FedLogOut').then(() => {
                    location.reload()
                  })
                } else {
                  that.handleFilter()
                }
              }
            })
          })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    // 8.前端 - 模糊搜索匹配增加员工权限
    querySearch(queryString, cb) {
      const tempData = this.userSsoList || []
      const results = queryString ? tempData.filter(this.createStateFilter(queryString)) : tempData
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        cb(results)
      }, 200)
    },
    // 9.返回搜索到用户 -- 支持英文名与中文
    createStateFilter(queryString) {
      return (item) => {
        if (item.nickname) {
          return (item.nickname.toLowerCase().indexOf(queryString.toLowerCase()) !== -1) || (item.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
        } else {
          return (item.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
        }
      }
    },
    // 10.模糊搜索匹配已有权限员工 -- 账号
    querySearchUserName(username, cb) {
      this.$store.dispatch('PERMISSION_USER_SEARCH', { username })
        .then(res => {
          const result = res.data.data.map(item => {
            return {
              id: item.id,
              value: item.username
            }
          })
          cb(result)
        })
    },
    // 11.模糊搜索匹配已有权限员工 -- 姓名
    querySearchUserTrueName(true_name, cb) {
      this.$store.dispatch('PERMISSION_USER_SEARCH', { true_name })
        .then(res => {
          const result = res.data.data.map(item => {
            return {
              id: item.id,
              value: item.true_name
            }
          })
          cb(result)
        })
    }
  }
}
</script>

<style lang="scss">
.custom-dialog-permission{
  .el-card__header{
    padding: 8px 20px;
    background: #F8F8F8;
  }
}
</style>

<style lang="scss" scoped>
.custom-dialog-permission{
  .el-card{
    margin-bottom: 22px;
  }
  .card-title{
    font-size: 16px;
    font-weight: bold;
  }
  .custom-group{
    float: left;
    width: 280px;
    border: 1px dashed #ebeef5;
    margin-left: 20px;
    margin-bottom: 20px;
    padding-left: 20px;
  }
  .group-item{
    padding-left: 30px;
  }
}

em{
  font-style: normal;
  .hightlight-color{
    background: #ff9632;
    padding: 0 5px;
  }
}

.custom-autocomplete{
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

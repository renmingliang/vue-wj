<template>
  <div class="box-container">
    <el-form
      v-loading="permissionLoading"
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="150px">
      <el-collapse v-model="activeNames" @change="handleCollapse">
        <el-collapse-item title="权限基本信息" :name="1">
          <div class="common-wrap">
            <el-form-item label="权限名称" prop="name">
              <el-input :disabled="(isLook || isUser)" v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="权限说明">
              <el-input
                type="textarea"
                :disabled="(isLook || isUser)"
                :autosize="{ minRows: 2 }"
                placeholder="请输入内容"
                v-model="ruleForm.desc">
              </el-input>
            </el-form-item>
          </div>
        </el-collapse-item>

        <el-collapse-item v-if="!isUser" title="权限配置" :name="2">
          <div class="common-wrap">

            <el-form-item
              label="所属主体："
              prop="company"
              :rules="{required: true, message: '请选择所属主体', trigger: 'change'}">
              <el-checkbox-group :disabled="isLook" v-model="ruleForm.company">
                <el-checkbox
                  v-for="(item, index) in configData.company"
                  :key="index"
                  :label="item.id">{{item.name}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>

            <el-form-item
              label="部门权限："
              prop="department"
              :rules="{required: true, message: '请选择部门权限', trigger: 'change'}">
              <el-radio-group
                :disabled="isLook"
                v-model="ruleForm.department">
                <el-radio
                  v-for="(value, key) in configData.department"
                  :key="key"
                  :label="key">{{value}}</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item
              label="IP信息："
              prop="field_ip"
              :rules="{required: true, message: '请选择IP信息', trigger: 'change'}">
              <el-checkbox-group
                :disabled="isLook"
                v-model="ruleForm.field_ip">
                <el-checkbox
                  v-for="(value, key) in configData.field_ip"
                  :key="key"
                  :label="key">{{value}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>

            <el-form-item
              label="项目信息："
              prop="field_project"
              :rules="{required: true, message: '请选择项目信息', trigger: 'change'}">
              <el-checkbox-group
                :disabled="isLook"
                v-model="ruleForm.field_project">
                <el-checkbox
                  v-for="(value, key) in configData.field_project"
                  :key="key"
                  :label="key">{{value}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>

            <el-form-item
              label="权限设置："
              prop="permission"
              :rules="{required: true, message: '请选择权限设置', trigger: 'change'}">
              <el-checkbox-group
                :disabled="isLook"
                v-model="ruleForm.permission">
                <ul>
                  <li v-for="(item, index) in configData.permission" :key="index">
                    <el-card
                      class="custom-group"
                      v-for="child in item.children"
                      :key="child.id"
                      shadow="never">
                        <div slot="header">
                          <span style="font-size: 14px;">{{child.name}}-{{child.id}}-{{child.pid}}</span>
                        </div>
                        <div
                          v-for="permission in child.permissions"
                          :key="permission.id">
                          <el-checkbox :label="permission.id">{{permission.desc}} - {{permission.id}}</el-checkbox>
                        </div>
                    </el-card>
                  </li>
                </ul>
              </el-checkbox-group>
            </el-form-item>
          </div>
        </el-collapse-item>

        <el-collapse-item v-if="isLook || isUser" title="人员信息" :name="3">
          <div class="common-wrap search-result">
            <el-table
              highlight-current-row
              border
              stripe
              :data="users">
              <el-table-column
                fixed
                type="index"
                label="序号"
                align="center"
                width="100">
              </el-table-column>
              <el-table-column
                prop="username"
                label="员工姓名"
                align="center"
                width="300">
              </el-table-column>
              <el-table-column
                prop="email"
                label="员工邮箱"
                align="center"
                width="300">
              </el-table-column>
              <el-table-column
                prop="department_name"
                label="所属部门"
                align="center"
                min-width="300">
              </el-table-column>
              <el-table-column
                v-if="isUser"
                label="操作"
                align="center"
                width="240">
                <template slot-scope="scope">
                  <el-button
                  size="mini"
                  icon="el-icon-edit"
                  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                  <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-collapse-item>
      </el-collapse>

      <div v-if="!isLook && !isUser" class="custom-btn" align="center">
        <el-button @click="submitForm" type="primary">提交</el-button>
      </div>

    </el-form>

    <el-dialog
      center
      custom-class="custom-dialog-form"
      title="修改员工权限"
      :visible.sync="dialogFormVisible">
      <el-form
        ref="userForm"
        label-width="110px"
        :model="userForm">
        <el-form-item
          label="员工姓名"
          prop="username">
          <el-input disabled v-model="username"></el-input>
        </el-form-item>
        <el-form-item
          label="员工权限"
          prop="ipr_permission">
          <el-select
            :disabled="isLook"
            v-model="userForm.ipr_permission"
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
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitUserForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

const defaultForm = {
  id: 0,
  name: '',
  company: [],
  department: '',
  field_ip: [],
  field_project: [],
  permission: [],
  menu: []
}

export default {
  name: 'PermissionForm',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    isUser: {
      type: Boolean,
      default: false
    },
    isLook: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      users: [],
      username: '',
      userForm: {
        id: '',
        ipr_permission: ''
      },
      dialogFormVisible: false,
      activeNames: [1, 2, 3],
      ruleForm: Object.assign({}, defaultForm),
      rules: {
        name: [
          { required: true, message: '请输入权限名称', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'configData',
      'configOptions',
      'permissionLoading',
      'permissionName'
    ])
  },
  created() {
    if (this.isEdit || this.isLook) {
      this.fetchData()
    } else {
      this.ruleForm = Object.assign({}, defaultForm)
    }
  },
  mounted() {
    this.$store.dispatch('PERMISSION_CONFIG')
  },
  methods: {
    // 0.获取权限详情
    fetchData() {
      this.$store.dispatch('PERMISSION_FETCH_DETAIL', {id: this.id})
        .then(res => {
          console.log(res)
          this.ruleForm = res.data.permission
          this.users = res.data.users
        })
    },
    // 1.折叠面板切换操作
    handleCollapse(val) {
      console.log(val)
    },
    // 2.提交权限表单
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const tempMenu = []
          this.configOptions.forEach(item => {
            this.ruleForm.permission.forEach(child => {
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
          this.ruleForm.menu = tempMenu
          const params = this.ruleForm

          console.log(params)
          this.$store.dispatch('PERMISSION_EDIT', params)
            .then(res => {
              this.$confirm('文件已成功提交, 是否查看详情?', '提示', {
                closeOnClickModal: false,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'success'
              }).then(() => {
                this.$router.push({ name: 'look-permission', params: {id: String(res.data)} })
              }).catch(() => {
                this.$router.push({ name: 'search' })
              })
            })
            .catch(err => {
              console.log(err.msg)
            })
        } else {
          return false
        }
      })
    },
    // 3.提交修改用户权限表单
    submitUserForm() {
      const that = this
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$store.dispatch('PERMISSION_USER_UPDATE', this.userForm)
            .then(res => {
              this.dialogFormVisible = false
              this.$message({
                type: 'success',
                message: '操作成功!',
                onClose: function() {
                  that.fetchData()
                }
              })
            })
            .catch(err => {
              console.log(err.msg)
            })
        } else {
          return false
        }
      })
    },
    // 4.编辑员工权限
    handleEdit(index, row) {
      // 填充对应类别数据
      this.username = row.username
      this.userForm = {
        ipr_permission: this.ruleForm.id,
        id: row.id
      }
      this.dialogFormVisible = true
    },
    // 5.删除用户
    handleDelete(index, row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('PERMISSION_USER_DELETE', { id: row.id })
          .then(() => {
            this.users.splice(index, 1)
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
          .catch(err => {
            console.log(err.msg)
          })
      }).catch(() => {
        this.$message.error('已取消删除')
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.custom-group{
  float: left;
  margin-right: 20px;
  margin-bottom: 20px;
  .el-card__header{
    padding: 5px 20px;
  }
}
</style>

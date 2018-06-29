<template>
  <div class="box-container">
    <el-form
      v-model="projectLoading"
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="150px">
      <el-collapse v-model="activeNames" @change="handleCollapse">
        <el-collapse-item title="IP基本信息" :name="1">
          <div class="common-wrap">
            <el-form-item label="IP名称" prop="ip_name">
              <el-autocomplete
                placeholder="请输入内容"
                v-model="ruleForm.ip_name"
                :disabled="(isLook || isEdit) && ruleForm.ip_name !== ''"
                :fetch-suggestions="querySearch"
                :trigger-on-focus="false"
                @select="handleSuggestions"
              ></el-autocomplete>
            </el-form-item>
            <el-form-item label="改编权类别" prop="ip_right.sub_right_id">
              <el-select
                :disabled="(isLook || isEdit) && ruleForm.ip_right.sub_right_id !== ''"
                v-model="ruleForm.ip_right.sub_right_id"
                @change="handleIpRightIp"
                placeholder="请选择">
                  <template v-if="(isLook || isEdit)">
                    <el-option v-for="item in typeOptions" :label="item.label" :value="item.value" :key="item.value"></el-option>
                  </template>
                  <template v-else>
                    <el-option v-for="item in ipTypeOptions" :label="item.label" :value="item.value" :key="item.value"></el-option>
                  </template>
              </el-select>
            </el-form-item>
          </div>
        </el-collapse-item>

        <el-collapse-item
          v-for="(column, index) in ruleForm.projects"
          :key="index"
          :name="index+2">
          <template slot="title">
            <span>{{ `项目信息${index + 1 > 10 ? index+1 : '0'+(index+1)}` }}</span>
            <span :class="`project-status status-${column.project_status}`">{{ formateShowStatus(column.project_status) }}</span>
          </template>
          <div class="common-wrap">
            <el-form-item
              label="项目名称"
              :prop="'projects.' + index + '.name'"
              :rules="{required: true, trigger: 'blur',validator: validateProjectName }">
              <el-input :disabled="isLook" v-model="column.name" clearable></el-input>
            </el-form-item>

            <el-form-item label="项目类型"
              :prop="'projects.' + index + '.type'"
              :rules="{trigger: 'blur',validator: validate20 }">
              <el-input :disabled="isLook" v-model="column.type" clearable></el-input>
            </el-form-item>

            <el-form-item label="合作公司"
              :prop="'projects.' + index + '.cooperation_company'"
              :rules="{trigger: 'blur',validator: validate20 }">
              <el-input :disabled="isLook" v-model="column.cooperation_company" clearable></el-input>
            </el-form-item>

            <el-form-item label="合作形式"
              :prop="'projects.' + index + '.cooperation_type'"
              :rules="{trigger: 'blur',validator: validate50 }">
              <el-input :disabled="isLook" v-model="column.cooperation_type" clearable></el-input>
            </el-form-item>

            <el-form-item label="合作金额">
              <el-input :disabled="isLook" v-model.number="column.cooperation_money" clearable></el-input>
            </el-form-item>

            <el-form-item label="分摊成本">
              <el-input :disabled="isLook" v-model.number="column.apportionment_costs" clearable></el-input>
            </el-form-item>

            <el-form-item label="项目负责人">
              <el-input :disabled="isLook" v-model="column.project_principal" clearable></el-input>
            </el-form-item>

            <el-form-item label="项目计划">
              <el-input :disabled="isLook" v-model="column.project_plan" type="textarea" :autosize="{ minRows: 2 }"></el-input>
            </el-form-item>

            <el-form-item label="项目进度">
              <el-input :disabled="isLook" v-model="column.project_progress" clearable></el-input>
            </el-form-item>

            <el-form-item
              label="项目状态"
              :prop="'projects.' + index + '.project_status'"
              :rules="{required: true, message: '请选择项目状态', trigger: 'change'}">
              <el-radio-group :disabled="isLook" v-model="column.project_status">
                <el-radio v-for="item in statusOptions" :key="item.value" :label="item.value">{{item.label}}</el-radio>
              </el-radio-group>
            </el-form-item>

            <div v-if="!isLook" class="custom-btn" align="right">
              <el-button @click.prevent="removeForm(column)" type="info">删除该项目</el-button>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>

      <div v-if="!isLook" class="custom-btn" align="center">
        <el-button @click="submitForm" type="primary">提交</el-button>
        <el-button @click="addForm" class="btn-add">增加项目</el-button>
      </div>

    </el-form>
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import { validateInput } from '@/utils/validate'
import { mapGetters } from 'vuex'

const defaultForm = {
  ip_name: '',
  ip_right: {
    id: 0,
    sub_right_id: ''
  },
  projects: [
    {
      id: 0,
      name: '',
      type: '',
      cooperation_company: '',
      cooperation_type: '',
      cooperation_money: '',
      apportionment_costs: '',
      project_principal: '',
      project_plan: '',
      project_progress: '',
      project_status: ''
    }
  ]
}

export default {
  name: 'ProjectForm',
  props: {
    isEdit: {
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
      activeNames: [1, 2],
      ipTypeOptions: null,
      ruleForm: Object.assign({}, defaultForm),
      rules: {
        ip_name: [
          { required: true, message: '请输入IP名称', trigger: 'blur' }
        ],
        sub_right_id: [
          { required: true, message: '请选择改编权类别', trigger: 'change' }
        ]
      },
      statusOptions: [
        {label: '正常', value: '0'},
        {label: '异常', value: '1'},
        {label: '高度预警', value: '2'}
      ]
    }
  },
  computed: {
    ...mapGetters([
      'adaptationName',
      'projectLoading'
    ]),
    typeOptions() {
      if (this.adaptationName) {
        return this.adaptationName
      } else {
        return []
      }
    }
  },
  created() {
    if (this.isEdit || this.isLook) {
      this.fetchData()
    } else {
      // 利用深拷贝对象，重新清空赋值ruleForm表单，不然会记录v-model的值
      this.ruleForm = deepClone(defaultForm)
    }
  },
  methods: {
    validateProjectName(rule, value, callback) {
      if (!value) {
        callback(new Error('请输入项目名称'))
      } else if (value.length > 20) {
        callback(new Error('输入内容不得超过20个字符'))
      } else {
        callback()
      }
    },
    validate20(rule, value, callback) {
      if (validateInput(value, 20)) {
        callback(new Error('输入内容不得超过20个字符'))
      } else {
        callback()
      }
    },
    validate50(rule, value, callback) {
      if (validateInput(value, 50)) {
        callback(new Error('输入内容不得超过50个字符'))
      } else {
        callback()
      }
    },
    // 0.获取数据
    fetchData() {
      this.$store.dispatch('PROJECT_FETCH_DETAIL', {ip_right_id: this.id})
        .then(res => {
          this.ruleForm = res.data
        })
    },
    // 1.折叠面板切换操作
    handleCollapse(val) {
      console.log(val)
    },
    // 2.提交表单
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const tempIpRightId = this.id !== '0' ? this.id : this.ruleForm.ip_right.id

          let tempSub = {}
          this.ruleForm.projects.forEach((column, index) => {
            tempSub[`project[${index}][ip_right_id]`] = tempIpRightId
            tempSub[`project[${index}][id]`] = column.id
            tempSub[`project[${index}][name]`] = column.name
            tempSub[`project[${index}][type]`] = column.type
            tempSub[`project[${index}][cooperation_company]`] = column.cooperation_company
            tempSub[`project[${index}][cooperation_type]`] = column.cooperation_type
            tempSub[`project[${index}][cooperation_money]`] = column.cooperation_money
            tempSub[`project[${index}][apportionment_costs]`] = column.apportionment_costs
            tempSub[`project[${index}][project_principal]`] = column.project_principal
            tempSub[`project[${index}][project_plan]`] = column.project_plan
            tempSub[`project[${index}][project_progress]`] = column.project_progress
            tempSub[`project[${index}][project_status]`] = column.project_status
          })

          const params = Object.assign({}, tempSub)

          this.$store.dispatch('PROJECT_EDIT', params)
            .then(res => {
              this.$confirm('文件已成功提交, 是否查看详情?', '提示', {
                closeOnClickModal: false,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'success'
              }).then(() => {
                this.$router.push({name: 'look-project', params: {id: this.ruleForm.ip_right.id}})
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
    // 3.动态删除子项
    removeForm(item) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const id = item.id
        const index = this.ruleForm.projects.indexOf(item)
        if (!id && index !== -1) {
          this.ruleForm.projects.splice(index, 1)
          return false
        } else {
          this.$store.dispatch('PROJECT_DELETE', { id })
            .then(res => {
              if (index !== -1) {
                this.ruleForm.projects.splice(index, 1)
              }
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            })
            .catch(err => {
              console.log(err.msg)
            })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 4.动态增加子项
    addForm() {
      this.ruleForm.projects.push({
        id: 0,
        name: '',
        type: '',
        cooperation_company: '',
        cooperation_type: '',
        cooperation_money: '',
        apportionment_costs: '',
        project_principal: '',
        project_plan: '',
        project_progress: '',
        project_status: ''
      })
      // 展开增加子项的折叠面板
      const tempName = this.ruleForm.projects.length + 1
      this.activeNames.push(tempName)
    },
    // 5.模糊搜索
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
    },
    // 6.根据选中的IP获取改编权类别
    handleSuggestions(val) {
      this.$store.dispatch('IP_RIGHT_ALL', { ip_id: val.id })
        .then(res => {
          const result = res.data.map(item => {
            return {
              label: item.sub_right_name,
              value: item.sub_right_id,
              ip_right_id: item.id
            }
          })
          this.ipTypeOptions = result
        })
    },
    // 7.切换选择的ip_right_id
    handleIpRightIp(val) {
      this.ipTypeOptions.forEach(item => {
        if (item.value === val) {
          this.ruleForm.ip_right.id = item.ip_right_id
        }
      })
    },
    // 8.根据进度显示相应状态
    formateShowStatus(type) {
      let tempLabel = ''
      this.statusOptions.forEach(item => {
        if (type === item.value) {
          tempLabel = item.label
        }
      })
      return tempLabel
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.project-status{
  margin-left: 20px;
  color: #fff;
  font-size: 14px;
  width: 80px;
  height: 30px;
  display: inline-block;
  line-height: 30px;
  text-align: center;
  &.status-0{
    background: #008000;
  }
  &.status-1{
    background: #ffa801;
  }
  &.status-2{
    background: #ff0000;
  }
}
</style>

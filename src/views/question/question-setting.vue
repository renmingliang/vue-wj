<template>
  <div class="box-container">
    <el-form
      v-loading="listLoading"
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="150px">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="基本信息" :name="1">
          <div class="common-wrap">
            <el-form-item label="问卷类型" prop="type">
              <el-select :disabled="isLook" v-model="ruleForm.type" placeholder="请选择">
                <el-option v-for="item in typeOptions" :label="item.label" :value="item.value" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所属项目" prop="project">
              <el-select :disabled="isLook" v-model="ruleForm.project" placeholder="请选择">
                <el-option v-for="item in projectOptions" :label="item.label" :value="item.value" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="游戏列表"
              prop="p_name_system">
              <el-select
                :disabled="isLook"
                multiple
                v-model="ruleForm.p_name_system"
                placeholder="请选择">
                <el-option
                  v-for="item in projectOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="问卷说明" prop="desc">
              <el-input
                type="textarea"
                :disabled="isLook"
                :autosize="{ minRows: 2 }"
                placeholder="请输入内容"
                v-model="ruleForm.desc">
              </el-input>
            </el-form-item>
            <el-form-item label="设定时间">
              <el-switch :disabled="isLook" v-model="ruleForm.settime"></el-switch>
            </el-form-item>
            <template v-if="ruleForm.settime">
              <el-form-item
                label="开始时间"
                prop="starttime"
                :rules="{ trigger: 'blur', validator: validateRightBegin }">
                <el-date-picker
                  :picker-options="{disabledDate: (time) => {return time.getTime() > Date.parse(ruleForm.endtime)}}"
                  :disabled="isLook"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="请选择"
                  v-model="ruleForm.starttime"></el-date-picker>
              </el-form-item>

              <el-form-item
                label="结束时间"
                prop="endtime"
                :rules="{ trigger: 'blur', validator: validateRightEnd }">
                <el-date-picker
                  :picker-options="{disabledDate: (time) => {return time.getTime() < Date.parse(ruleForm.starttime)}}"
                  :disabled="isLook"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="请选择"
                  v-model="ruleForm.endtime"></el-date-picker>
              </el-form-item>
            </template>
          </div>
        </el-collapse-item>

        <el-collapse-item title="触发设置" :name="2">
          <div class="common-wrap">
            <el-form-item label="等级限定" prop="limit_grade">
              <el-input :disabled="isLook" v-model="ruleForm.limit_grade" clearable></el-input>
            </el-form-item>
          </div>
        </el-collapse-item>

        <el-collapse-item title="邮件设置" :name="3">
          <div class="common-wrap">
            <el-form-item label="邮件标题" prop="email_title">
              <el-input :disabled="isLook" v-model="ruleForm.email_title" clearable></el-input>
            </el-form-item>
            <el-form-item label="邮件内容" prop="email_content">
              <el-input
                type="textarea"
                :disabled="isLook"
                :autosize="{ minRows: 2 }"
                placeholder="请输入内容"
                v-model="ruleForm.email_content">
              </el-input>
            </el-form-item>
          </div>
        </el-collapse-item>

        <el-collapse-item title="奖品设置" :name="4">
          <div class="common-wrap">
            <div v-if="!isLook" class="custom-btn">
              <el-button @click.prevent="handleEdit" type="info">添加奖品</el-button>
            </div>
            <el-table
              highlight-current-row
              border
              stripe
              :data="ruleForm.award_list">
              <el-table-column
                fixed
                type="index"
                label="序号"
                align="center"
                width="100">
              </el-table-column>
              <el-table-column
                prop="award_name"
                label="奖品名称"
                align="center">
              </el-table-column>
              <el-table-column
                label="奖品类型"
                align="center">
                  <template slot-scope="scope">{{ scope.row.award_type }}</template>
              </el-table-column>
              <el-table-column
                prop="award_id"
                label="奖品ID"
                align="center">
              </el-table-column>
              <el-table-column
                prop="award_num"
                label="奖品数量"
                align="center">
              </el-table-column>
              <el-table-column
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

      <div class="custom-btn" align="center">
        <el-button @click="handleNext" type="primary">保存，下一步</el-button>
      </div>

    </el-form>

    <el-dialog
      center
      custom-class="custom-dialog-form"
      :title="awardFormTitle"
      :visible.sync="dialogVisible">
      <el-form
        ref="awardForm"
        :rules="awardRules"
        label-width="110px"
        :model="awardForm">
        <el-form-item
          label="奖品类型"
          prop="award_type">
          <el-select
            :disabled="isLook"
            v-model="awardForm.award_type"
            placeholder="请选择">
            <el-option
              v-for="item in awardTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="奖品名称"
          prop="award_name"
          :rules="{ required: true, message: '请输入奖品名称', trigger: 'blur' }">
          <el-autocomplete
            placeholder="支持模糊搜索"
            popper-class="custom-autocomplete"
            v-model="awardForm.award_name"
            :trigger-on-focus="false"
            :fetch-suggestions="querySearch"
            @select="handleSuggestions">
          </el-autocomplete>
        </el-form-item>
        <el-form-item
          label="奖品数量"
          prop="award_num">
          <el-input-number v-model="awardForm.award_num" @change="handleAwardNum" :min="1"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAward">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import { validateInput } from '@/utils/validate'
const defaultType = [
  {
    'value': '1',
    'label': '通用型问卷'
  },
  {
    'value': '2',
    'label': '内置型问卷'
  }
]

const awardType = [
  {
    'value': '1',
    'label': '道具'
  },
  {
    'value': '2',
    'label': '货币'
  }
]

const defaultProject = [
  {
    'value': '1',
    'label': '锦绣未央'
  },
  {
    'value': '2',
    'label': '妖精的尾巴'
  },
  {
    'value': '3',
    'label': '银之守墓人'
  }
]

const defaultForm = {
  id: 0,
  type: '',
  project: '',
  p_name_system: [],
  desc: '',
  settime: 0,
  starttime: '',
  endtime: '',
  limit_grade: '',
  email_title: '',
  email_content: '',
  award_list: []
}

const awardForm = {
  award_name: '',
  awrad_type: '',
  award_id: '',
  award_num: ''
}

export default {
  name: 'question-setting',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    isLook: {
      type: Boolean,
      default: false
    },
    id: [String, Number]
  },
  data() {
    const validateNum = (rule, value, callback) => {
      if (value && isNaN(value)) {
        callback(new Error('请输入数字类型的值'))
      } else {
        callback()
      }
    }
    const validate200 = (rule, value, callback) => {
      if (validateInput(value, 200)) {
        callback(new Error('输入内容不得超过200个字符'))
      } else {
        callback()
      }
    }
    return {
      activeNames: [1, 2, 3, 4],
      listLoading: false,
      dialogVisible: false,
      setType: 'SET_ADD',
      awardType: 'AWARD_ADD',
      awardObj: null,
      awardFormTitle: '添加奖品',
      awardForm: deepClone(awardForm),
      awardRules: {
        award_type: [
          { required: true, message: '请选择奖品类型', trigger: 'change' }
        ],
        award_name: [
          { required: true, message: '请输入奖品名称', trigger: 'blur' }
        ]
      },
      ruleForm: deepClone(defaultForm),
      rules: {
        type: [
          { required: true, message: '请选择问卷类型', trigger: 'change' }
        ],
        project: [
          { required: true, message: '请选择所属项目', trigger: 'change' }
        ],
        p_name_system: [
          { required: true, message: '请选择游戏列表', trigger: 'change' }
        ],
        desc: [
          { validator: validate200, trigger: 'blur' }
        ],
        limit_grade: [
          { required: true, validator: validateNum, trigger: 'blur' }
        ],
        email_title: [
          { required: true, message: '邮件标题不能为空', trigger: 'blur' }
        ],
        email_content: [
          { required: true, message: '邮件内容不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    typeOptions() {
      return defaultType
    },
    awardTypeOptions() {
      return awardType
    },
    projectOptions() {
      return defaultProject
    }
  },
  created() {
    if (this.isEdit || this.isLook) {
      this.fetchData()
      this.setType = 'SET_UPDATE'
    } else {
      // 利用深拷贝对象，重新清空赋值ruleForm表单，不然会指向同一个内存地址
      this.ruleForm = deepClone(defaultForm)
      this.setType = 'SET_ADD'
    }
  },
  methods: {
    // 校验开始时间
    validateRightBegin(rule, value, callback) {
      if (this.ruleForm.settime && !value) {
        callback(new Error('请选择版权起始时间'))
      } else {
        callback()
      }
    },
    // 校验结束时间
    validateRightEnd(rule, value, callback) {
      if (this.ruleForm.settime && !value) {
        callback(new Error('请选择版权结束时间'))
      } else {
        callback()
      }
    },
    // 处理奖品数量
    handleAwardNum(val) {
      console.log(val)
    },
    fetchData() {
      this.$store.dispatch('IP_FETCH_DETAIL', {id: this.id})
    },
    // 1.模糊搜索
    querySearch(name, cb) {
      this.$store.dispatch('AWARD_SEARCH_NAME', { name })
        .then(res => {
          const result = res.data.map(item => {
            return {
              label: item.award_name,
              value: item.award_id,
              type: item.award_type,
              id: item.id
            }
          })
          // 调用callback返回建议列表的数据
          cb(result)
        })
    },
    // 2.处理选择的奖品名称
    handleSuggestions(val) {
      this.awardObj = val
    },
    // 3.提交表单
    submitAward() {
      const that = this
      this.$refs.awardForm.validate((valid) => {
        if (valid) {
          this.$store.dispatch(this.awardType, this.awardForm)
            .then(() => {
              this.dialogVisible = false
              this.$message({
                type: 'success',
                message: '操作成功!',
                duration: 1 * 1000,
                onClose: function() {
                  that.ruleForm.award_list.push(this.awardObj)
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
    // 4.新增或编辑
    handleEdit(index, row) {
      if (!row) {
        this.isLook = false
        this.awardFormTitle = '添加奖品'
        this.awardType = 'AWARD_ADD'
        // 初始化类别数据
        this.awardForm = deepClone(awardForm)
      } else {
        this.isLook = true
        this.ruleFormTitle = '编辑奖品'
        this.awardType = 'AWARD_UPDATE'
        // 填充对应类别数据
        this.awardForm = {
          award_type: row.award_type,
          award_name: row.award_name,
          award_num: row.award_num,
          award_id: row.award_id
        }
      }
      this.dialogVisible = true
    },
    // 5.删除奖品
    handleDelete(index, row) {
      const that = this
      this.$confirm('此操作将会删除该条信息，是否确认删除？', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('AWARD_DELETE', { id: row.id })
          .then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!',
              duration: 1 * 1000,
              onClose: function() {
                that.ruleForm.award_list.splice(index, 1)
              }
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
    // 6.进入下一步
    handleNext() {
      console.log(this.ruleForm)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>

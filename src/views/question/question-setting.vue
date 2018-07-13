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
            <el-form-item label="所属项目" prop="project_id">
              <el-select :disabled="isLook" v-model="ruleForm.project_id" placeholder="请选择">
                <el-option v-for="item in projectOptions" :label="item.label" :value="item.value" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="游戏列表"
              prop="app_ids">
              <el-select
                :disabled="isLook"
                multiple
                v-model="ruleForm.app_ids"
                placeholder="请选择">
                <el-option
                  v-for="item in appList"
                  :key="item.appid"
                  :label="item.appname"
                  :value="item.appid">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="问卷说明" prop="remark">
              <el-input
                type="textarea"
                :disabled="isLook"
                :autosize="{ minRows: 2 }"
                placeholder="请输入内容"
                v-model="ruleForm.remark">
              </el-input>
            </el-form-item>
            <el-form-item label="设定时间">
              <el-switch :disabled="isLook" active-value="1" inactive-value="0" v-model="ruleForm.open_status"></el-switch>
            </el-form-item>
            <template v-if="ruleForm.open_status>0">
              <el-form-item
                label="开始时间"
                prop="start_date"
                :rules="{ trigger: 'blur', validator: validateRightBegin }">
                <el-date-picker
                  :picker-options="{disabledDate: (time) => {return time.getTime() > Date.parse(ruleForm.end_date)}}"
                  :disabled="isLook"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="请选择"
                  v-model="ruleForm.start_date"></el-date-picker>
              </el-form-item>

              <el-form-item
                label="结束时间"
                prop="end_date"
                :rules="{ trigger: 'blur', validator: validateRightEnd }">
                <el-date-picker
                  :picker-options="{disabledDate: (time) => {return time.getTime() < Date.parse(ruleForm.start_date)}}"
                  :disabled="isLook"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="请选择"
                  v-model="ruleForm.end_date"></el-date-picker>
              </el-form-item>
            </template>
          </div>
        </el-collapse-item>

        <el-collapse-item v-if="!ruleForm.type" title="触发设置" :name="2">
          <div class="common-wrap">
            <el-form-item label="等级限定" prop="need_level">
              <el-input :disabled="isLook" v-model="ruleForm.need_level" clearable></el-input>
            </el-form-item>
          </div>
        </el-collapse-item>

        <el-collapse-item v-if="!ruleForm.type" title="邮件设置" :name="3">
          <div class="common-wrap">
            <el-form-item label="邮件标题" prop="mail_title">
              <el-input :disabled="isLook" v-model="ruleForm.mail_title" clearable></el-input>
            </el-form-item>
            <el-form-item label="邮件内容" prop="mail_content">
              <el-input
                type="textarea"
                :disabled="isLook"
                :autosize="{ minRows: 2 }"
                placeholder="请输入内容"
                v-model="ruleForm.mail_content">
              </el-input>
            </el-form-item>
          </div>
        </el-collapse-item>

        <el-collapse-item v-if="!ruleForm.type" title="奖品设置" :name="4">
          <div class="common-wrap">
            <div v-if="!isLook" class="custom-btn">
              <el-button @click.prevent="handleEdit" type="info">添加奖品</el-button>
            </div>
            <el-table
              highlight-current-row
              border
              stripe
              :data="ruleForm.item">
              <el-table-column
                fixed
                type="index"
                label="序号"
                align="center"
                width="100">
              </el-table-column>
              <el-table-column
                prop="item_name"
                label="奖品名称"
                align="center">
              </el-table-column>
              <el-table-column
                label="奖品类型"
                align="center">
                  <template slot-scope="scope">{{ scope.row.item_type }}</template>
              </el-table-column>
              <el-table-column
                prop="item_id"
                label="奖品ID"
                align="center">
              </el-table-column>
              <el-table-column
                prop="item_num"
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
      @open="handleItemAppid"
      :title="awardFormTitle"
      :visible.sync="dialogVisible">
      <el-form
        ref="awardForm"
        :rules="awardRules"
        label-width="110px"
        :model="awardForm">
        <el-form-item
          label="所在游戏"
          prop="appid">
          <el-select
            :disabled="isLook"
            v-model="awardForm.appid"
            placeholder="请选择">
            <el-option
              v-for="item in itemAppIds"
              :key="item.appid"
              :label="item.appname"
              :value="item.appid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="奖品类型"
          prop="item_type">
          <el-select
            :disabled="isLook"
            v-model="awardForm.item_type"
            @change="fetchCpList"
            placeholder="请选择">
            <el-option
              v-for="item in itemTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="奖品名称"
          prop="item_name"
          :rules="{ required: true, message: '请输入奖品名称', trigger: 'blur' }">
          <el-select
            v-model="awardForm.item_name"
            filterable
            placeholder="请选择，支持模糊搜索"
            @change="handleItemId($event, item)">
            <el-option
              v-for="item in awardCpList"
              :key="item.id"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="奖品数量"
          prop="item_num">
          <el-input-number v-model="awardForm.item_num" :min="1"></el-input-number>
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
import { mapGetters } from 'vuex'
import { deepClone } from '@/utils'
import { validateInput } from '@/utils/validate'

const defaultForm = {
  id: 0,
  title: '问卷标题',
  type: '',
  project_id: '',
  app_ids: [],
  remark: '',
  open_status: '',
  start_date: '',
  end_date: '',
  need_level: '',
  mail_title: '',
  mail_content: '',
  submit_text: '提交成功提示',
  item: []
}

const defaultAwardForm = {
  appid: '',
  item_id: '',
  item_name: '',
  item_type: '',
  item_num: ''
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
      if (!value) {
        callback(new Error('等级限定不能为空'))
      } else if (value && isNaN(value)) {
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
      postType: '',
      listLoading: false,
      dialogVisible: false,
      itemAppIds: [],
      awardFormTitle: '添加奖品',
      awardForm: deepClone(defaultAwardForm),
      awardRules: {
        appid: [
          { required: true, message: '请选择所在游戏', trigger: 'blur' }
        ],
        item_type: [
          { required: true, message: '请选择奖品类型', trigger: 'blur' }
        ],
        item_name: [
          { required: true, message: '请输入奖品名称', trigger: 'blur' }
        ]
      },
      ruleForm: deepClone(defaultForm),
      rules: {
        type: [
          { required: true, message: '请选择问卷类型', trigger: 'change' }
        ],
        project_id: [
          { required: true, message: '请选择所属项目', trigger: 'change' }
        ],
        app_ids: [
          { required: true, message: '请选择游戏列表', trigger: 'change' }
        ],
        remark: [
          { validator: validate200, trigger: 'blur' }
        ],
        need_level: [
          { required: true, validator: validateNum, trigger: 'blur' }
        ],
        mail_title: [
          { required: true, message: '邮件标题不能为空', trigger: 'blur' }
        ],
        mail_content: [
          { required: true, message: '邮件内容不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'defaultItemType',
      'questionType',
      'projectName',
      'awardCpList',
      'appList'
    ]),
    itemTypeOptions() {
      return this.defaultItemType
    },
    typeOptions() {
      return this.questionType
    },
    projectOptions() {
      return this.projectName
    }
  },
  created() {
    if (this.isEdit || this.isLook) {
      this.fetchData()
      this.postType = 'QUESTION_EDIT'
    } else {
      // 利用深拷贝对象，重新清空赋值ruleForm表单，不然会指向同一个内存地址
      this.ruleForm = deepClone(defaultForm)
      this.postType = 'QUESTION_CREATE'
    }
  },
  methods: {
    // 校验开始时间
    validateRightBegin(rule, value, callback) {
      if (this.ruleForm.open_status > 0 && !value) {
        callback(new Error('请选择问卷起始时间'))
      } else {
        callback()
      }
    },
    // 校验结束时间
    validateRightEnd(rule, value, callback) {
      if (this.ruleForm.open_status > 0 && !value) {
        callback(new Error('请选择问卷结束时间'))
      } else {
        callback()
      }
    },
    // 0.获取问卷信息
    fetchData() {
      this.$store.dispatch('QUESTION_FETCH_DETAIL', {question_id: this.id})
        .then(res => {
          console.log(res.data)
        })
    },
    // 1.根据选择游戏列表设置可供奖品选择游戏列表
    handleItemAppid() {
      this.itemAppIds = this.appList.filter(item => {
        return this.ruleForm.app_ids.includes(item.appid)
      })
      this.awardForm.appid = this.awardForm.appid || this.ruleForm.app_ids[0]
    },
    // 1.获取cp奖品列表
    fetchCpList(type) {
      if (!this.ruleForm.app_ids.length) {
        this.$message.info('请先选择 -> 基本设置 -> 游戏列表')
        return false
      }
      const params = { type, appid: this.awardForm.appid }
      this.$store.dispatch('ITEM_CP_LIST', params)
    },
    // 2.获取该项奖品Id
    handleItemId(val, item) {
      this.awardForm.item_id = item.id
    },
    // 3.奖品新增或编辑
    handleEdit(index, row) {
      if (!row) {
        this.awardFormTitle = '添加奖品'
        // 初始化类别数据
        this.awardForm = deepClone(defaultAwardForm)
      } else {
        this.ruleFormTitle = '编辑奖品'
        // 填充对应类别数据
        this.awardForm = {
          item_id: row.item_id,
          item_name: row.item_name,
          item_type: row.item_type,
          item_num: row.item_num
        }
      }
      this.dialogVisible = true
    },
    // 4.奖品对话框
    submitAward() {
      this.$refs.awardForm.validate((valid) => {
        if (valid) {
          this.dialogVisible = false
          console.log(this.awardForm)
        } else {
          return false
        }
      })
    },
    // 5.奖品删除
    handleDelete(index, row) {
      this.$confirm('此操作将会永久删除该奖品，是否确认删除？', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(this.ruleForm)
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    // 6.进入下一步
    handleNext() {
      const that = this
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          // 将app_ids数组改为字符串格式
          const app_ids = this.ruleForm.app_ids.join()
          const params = Object.assign({}, this.ruleForm, {app_ids})
          this.$store.dispatch(this.postType, params)
            .then(() => {
              this.$message({
                type: 'success',
                message: '操作成功!',
                duration: 1 * 1000,
                onClose: function() {
                  // 更新获取数据列表
                  console.log(that)
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
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>

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
            <el-form-item label="问卷标题" prop="title">
              <el-input :disabled="isLook" v-model="ruleForm.title" clearable></el-input>
            </el-form-item>
            <el-form-item label="问卷类型" prop="type">
              <el-select :disabled="isLook" v-model="ruleForm.type" placeholder="请选择">
                <el-option v-for="item in typeOptions" :label="item.label" :value="item.value" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所属项目" prop="project_id">
              <el-select
                :disabled="isLook"
                v-model="ruleForm.project_id"
                placeholder="请选择"
                @change="getProjectApp">
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
                  v-for="item in projectAppList"
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
                :autosize="{ minRows: 3 }"
                placeholder="请输入内容（不可超过200字）"
                v-model="ruleForm.remark">
              </el-input>
            </el-form-item>
            <el-form-item label="设定时间">
              <el-switch :disabled="isLook" active-value="1" inactive-value="0" v-model="ruleForm.open_status"></el-switch>
            </el-form-item>
            <template v-if="ruleForm.open_status === '1'">
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
        <el-collapse-item title="跳转设置" :name="2">
          <div class="common-wrap">
            <el-form-item prop="submit_text" label-width="30px">
              <el-input id="submitText" :disabled="isLook" type="textarea" v-model="ruleForm.submit_text"></el-input>
            </el-form-item>
          </div>
        </el-collapse-item>

        <template v-if="ruleForm.type === '0'">
          <el-collapse-item title="触发设置" :name="3">
            <div class="common-wrap">
              <el-form-item label="等级限定" prop="need_level">
                <el-input :disabled="isLook" v-model="ruleForm.need_level" clearable></el-input>
              </el-form-item>
            </div>
          </el-collapse-item>

          <el-collapse-item title="邮件设置" :name="4">
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

          <el-collapse-item title="奖品设置" :name="5">
            <div class="common-wrap">
              <div v-if="!isLook" class="custom-btn">
                <el-button @click.prevent="handleEdit" type="info">添加奖品</el-button>
              </div>
              <el-table
                highlight-current-row
                border
                stripe
                :data="itemData">
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
                    <template slot-scope="scope">{{ scope.row.item_type | formateTypeLabel }}</template>
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
                  v-if="!isLook"
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
        </template>

      </el-collapse>

      <div v-if="$_has('question/question-create') || $_has('question/question-edit') && !isLook" class="custom-btn" align="center">
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
            @change="changeParams($event, 0)"
            placeholder="请选择">
            <el-option
              v-for="item in awardAppIds"
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
            @change="changeParams($event, 1)"
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
            @change="handleItemId">
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
  title: '',
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
  submit_text: '',
  items: ''
}

const defaultAwardForm = {
  index: '',
  appid: '',
  item_id: '',
  item_name: '',
  item_num: '',
  item_type: ''
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
    const validate50 = (rule, value, callback) => {
      if (!value) {
        callback(new Error('问卷标题不能为空'))
      } else if (validateInput(value, 50)) {
        callback(new Error('输入内容不得超过50个字符'))
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
      activeNames: [1, 2, 3, 4, 5],
      postType: '',
      ckeditorText: null,
      listLoading: false,
      dialogVisible: false,
      projectAppList: [],
      itemData: [],
      awardAppIds: [],
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
        title: [
          { required: true, validator: validate50, trigger: 'blur' }
        ],
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
      if (this.ruleForm.open_status === '1' && !value) {
        callback(new Error('请选择问卷起始时间'))
      } else {
        callback()
      }
    },
    // 校验结束时间
    validateRightEnd(rule, value, callback) {
      if (this.ruleForm.open_status === '1' && !value) {
        callback(new Error('请选择问卷结束时间'))
      } else {
        callback()
      }
    },
    // 0.获取问卷信息
    fetchData() {
      this.$store.dispatch('QUESTION_FETCH_DETAIL', {question_id: this.id})
        .then(res => {
          const temp = res.data
          const app_ids = temp.app_ids ? temp.app_ids.split(',') : []
          const {project_id, submit_text} = temp
          this.getProjectApp(project_id)
          this.setSubmitText(submit_text)
          this.ruleForm = Object.assign({}, temp, {question_id: this.id, app_ids})
        })

      this.$store.dispatch('ITEM_LIST', {question_id: this.id})
        .then(res => {
          this.itemData = res.data
        })
    },
    // 0.1设置submit_text富文本框
    setSubmitText(submit_text) {
      const that = this

      this.$nextTick(() => {
        // 初始化创建富文本
        this.ckeditorText = window.CKEDITOR.replace('submitText', {
          removeButtons: 'Subscript,Superscript,Cut,Copy,SpellChecker,Unlink,Anchor,Maximize,Source,Strike,Outdent,Indent',
          removePlugins: 'image'
        })
        // 实例化加载后赋值-并控制是否可编辑模式
        this.ckeditorText.on('instanceReady', function (ev) {
          if (that.isLook) {
            that.ckeditorText.setReadOnly()
          } else {
            that.ckeditorText.setReadOnly(false)
          }
          that.ckeditorText.setData(submit_text)
        })

        // 退出后摧毁实例
        this.$once('hook:beforeDestroy', function () {
          this.ckeditorText.destroy()
        })
      })
    },
    // 0.2根据项目获取对应游戏列表
    getProjectApp(project_id) {
      this.$store.dispatch('PROJECT_DETAIL', { project_id })
        .then(res => {
          const tempArr = res.data.app_ids.split(',')
          this.projectAppList = this.appList.filter(item => {
            return tempArr.includes(item.appid)
          })
          if (!this.projectAppList.length) {
            this.ruleForm.app_ids = []
          }
        })
    },
    // 1.添加奖品对话框打开时，处理其游戏选择项
    handleItemAppid() {
      if (!this.ruleForm.app_ids.length) {
        // 使用nextTick是为了保证message提示，不被dialog对话框遮罩层级覆盖
        this.$nextTick(() => {
          this.$message({
            message: '请先完成选择 -> 基本设置 -> 游戏列表',
            type: 'info',
            onClose: () => {
              this.dialogVisible = false
            }
          })
        })
      } else {
        this.awardAppIds = this.projectAppList.filter(item => {
          return this.ruleForm.app_ids.sort().includes(item.appid)
        })
        this.awardForm.appid = this.awardForm.appid || this.ruleForm.app_ids[0]
      }
    },
    // 2.转换获取CP奖品列表的参数
    changeParams(type, isType) {
      let params = {}
      if (isType) {
        params = { type, appid: this.awardForm.appid }
      } else {
        params = { type: this.awardForm.item_type, appid: type }
      }
      this.fetchCpList(params)
    },
    // 3.获取cp奖品列表
    fetchCpList(params) {
      this.$store.dispatch('ITEM_CP_LIST', params)
        .then(res => {
          if (!res.data || !res.data.length) {
            this.$message.info('该项游戏下的奖品数据为空，请选择其他游戏')
          }
        })
    },
    // 4.获取该项奖品Id
    handleItemId(val) {
      this.awardCpList.forEach(item => {
        if (item.name === val) {
          this.awardForm.item_id = item.id
        }
      })
    },
    // 5.奖品新增或编辑
    handleEdit(index, row) {
      if (!row) {
        this.awardFormTitle = '添加奖品'
        // 初始化类别数据
        this.awardForm = deepClone(defaultAwardForm)
      } else {
        this.ruleFormTitle = '编辑奖品'
        // 填充对应类别数据
        this.awardForm = {
          index,
          appid: row.appid,
          item_id: row.item_id,
          item_name: row.item_name,
          item_type: row.item_type,
          item_num: row.item_num
        }
      }
      this.dialogVisible = true
    },
    // 6.奖品对话框
    submitAward() {
      this.$refs.awardForm.validate((valid) => {
        if (valid) {
          const { index } = this.awardForm
          if (!Number.isInteger(index)) {
            this.itemData.push(this.awardForm)
          } else {
            this.$set(this.itemData, index, this.awardForm)
          }
          this.changeAwardItem()
          this.dialogVisible = false
        } else {
          return false
        }
      })
    },
    // 7.奖品删除
    handleDelete(index, row) {
      this.$confirm('此操作将会永久删除该奖品，是否确认删除？', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 执行删除
        this.itemData.splice(index, 1)
        this.changeAwardItem()
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    // 8.处理后台需要奖品格式
    changeAwardItem() {
      // item_id:item_name:item_num:item_type
      const params = this.itemData.map(item => {
        return [item.item_id, item.item_name, item.item_num, item.item_type].join(':')
      })
      this.ruleForm.items = params.join(',')
    },
    // 9.保存，进入下一步
    handleNext() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          // 将app_ids数组改为字符串格式
          const app_ids = this.ruleForm.app_ids.join()
          // 手动获取富文本框内容
          const submit_text = this.ckeditorText.getData()
          if (!submit_text) {
            this.$message.warning('跳转设置不能为空')
            return false
          }
          // 合并参数
          const params = Object.assign({}, this.ruleForm, {app_ids, submit_text})
          this.$store.dispatch(this.postType, params)
            .then(res => {
              const { question_id } = res.data
              this.$message({
                type: 'success',
                message: '操作成功!',
                duration: 1 * 1000,
                onClose: () => {
                  // 进入问题创建页
                  this.$router.push({ name: 'preview-create', params: { id: question_id } })
                }
              })
            })
        } else {
          return false
        }
      })
    }
  },
  filters: {
    formateTypeLabel(val) {
      if (val === '1') {
        return '道具'
      } else {
        return '货币'
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>

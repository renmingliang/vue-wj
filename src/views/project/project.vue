<template>
  <div class="search-container">
    <div class="common-wrap search-filter">
      <el-form ref="form" :model="listQuery" label-width="120px">
        <el-row :gutter="30">
          <el-col :span="8">
            <el-form-item label="游戏列表">
              <el-select
                v-model="listQuery.p_name_system"
                placeholder="请选择">
                <el-option v-for="item in typeTopOptions" :label="item.label" :value="item.value" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label-width="10px">
              <el-button type="primary" @click="handleFilter">查询</el-button>
              <el-button @click="handleEdit">添加项目</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <el-dialog
      center
      custom-class="custom-dialog-form"
      :title="ruleFormTitle"
      :visible.sync="dialogFormVisible">
      <el-form
        ref="ruleForm"
        :rules="rules"
        label-width="110px"
        :model="ruleForm">
        <el-form-item
          label="游戏列表"
          prop="p_name_system">
          <el-select
            :disabled="isLook"
            multiple
            collapse-tags
            v-model="ruleForm.p_name_system"
            placeholder="请选择">
            <el-option
              v-for="item in adaptationTop"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="项目名称"
          prop="pid">
          <el-input v-model="ruleForm.pid"></el-input>
        </el-form-item>
        <el-form-item
          label="备注"
          prop="desc">
          <el-input v-model="ruleForm.desc" type="textarea" :autosize="{ minRows: 2 }"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
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
        :data="adaptationData">
        <el-table-column
          fixed
          type="index"
          label="序号"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          prop="p_name"
          label="项目名称"
          align="center">
        </el-table-column>
        <el-table-column
          prop="p_name_system"
          label="游戏列表"
          align="center">
        </el-table-column>
        <el-table-column
          label="备注"
          align="center">
            <template slot-scope="scope">{{ scope.row.desc }}</template>
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
  </div>
</template>

<script>
const defalutOptions = [
  {label: '全部', value: '0'}
]
const defaultData = [
  {pid: '1', p_name: '项目1', p_name_system: ['妖精的尾巴-ios'], desc: '备注1'},
  {pid: '2', p_name: '项目2', p_name_system: ['妖精的尾巴-ios'], desc: '备注2'},
  {pid: '3', p_name: '项目3', p_name_system: ['妖精的尾巴-ios'], desc: '备注3'},
  {pid: '4', p_name: '项目4', p_name_system: ['妖精的尾巴-ios'], desc: '备注4'},
  {pid: '5', p_name: '项目5', p_name_system: ['妖精的尾巴-ios'], desc: '备注5'},
  {pid: '6', p_name: '项目6', p_name_system: ['妖精的尾巴-ios'], desc: '备注6'}
]

export default {
  data() {
    const validateDesc = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入备注信息'))
      } else if (value.length > 20) {
        callback(new Error('输入内容不得超过20个字符'))
      } else {
        callback()
      }
    }
    return {
      adaptationData: [],
      dialogFormVisible: false,
      listLoading: false,
      isLook: false,
      postType: 'ADAPTATION_ADD',
      ruleFormTitle: '添加项目',
      ruleForm: {
        pid: '',
        p_name_system: [],
        desc: '',
        id: ''
      },
      listQuery: {
        p_name_system: ''
      },
      rules: {
        pid: [
          {required: true, message: '请输入项目名称', trigger: 'change'}
        ],
        p_name_system: [
          {required: true, message: '请选择游戏列表', trigger: 'blur'}
        ],
        desc: [
          { required: true, trigger: 'blur', validator: validateDesc }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  computed: {
    adaptationTop() {
      return this.adaptationData.map(item => {
        return {
          'label': item.p_name,
          'value': item.pid
        }
      })
    },
    typeTopOptions() {
      if (this.adaptationTop) {
        return defalutOptions.concat(this.adaptationTop)
      } else {
        return defalutOptions
      }
    }
  },
  methods: {
    // 1.获取所有类别列表数据
    getList() {
      this.listLoading = true
      setTimeout(() => {
        this.adaptationData = defaultData
        this.listLoading = false
      }, 1000)
      /* this.$store.dispatch('ADAPTATION_FETCH_LIST', this.listQuery)
        .then(res => {
          this.adaptationData = res.data
          this.listLoading = false
        })
        .catch(() => {
          this.listLoading = false
        }) */
    },
    // 2.搜索
    handleFilter() {
      this.getList()
    },
    // 3.提交表单
    submitForm() {
      const that = this
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$store.dispatch(this.postType, this.ruleForm)
            .then(() => {
              this.dialogFormVisible = false
              this.$message({
                type: 'success',
                message: '操作成功!',
                duration: 1 * 1000,
                onClose: function() {
                  // 更新获取所有类别
                  that.$store.dispatch('ADAPTATION_FETCH_LIST')
                  // 再次执行搜索，刷新数据
                  that.handleFilter()
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
        this.ruleFormTitle = '添加项目'
        this.postType = 'ADAPTATION_ADD'
        // 初始化类别数据
        this.ruleForm = {
          pid: '',
          p_name_system: [],
          desc: '',
          id: ''
        }
      } else {
        this.isLook = true
        this.ruleFormTitle = '编辑项目'
        this.postType = 'ADAPTATION_UPDATE'
        // 填充对应类别数据
        this.ruleForm = {
          p_name_system: row.p_name_system,
          pid: row.pid,
          desc: row.desc,
          id: row.id
        }
      }
      this.dialogFormVisible = true
    },
    // 5.删除子改编权
    handleDelete(index, row) {
      const that = this
      this.$confirm('此操作将会永久删除该项目，是否确认删除？', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('ADAPTATION_DELETE', { id: row.id })
          .then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!',
              duration: 1 * 1000,
              onClose: function() {
                // 更新获取所有类别
                that.$store.dispatch('ADAPTATION_FETCH_LIST')
                // 再次执行搜索，刷新数据
                that.handleFilter()
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
    }
  }
}
</script>

<style scoped lang="scss">

</style>

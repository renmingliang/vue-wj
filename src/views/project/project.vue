<template>
  <div class="box-container">
    <el-card class="box-card" shadow="never">
      <div slot="header" class="card-header">
        <span class="card-title">项目信息</span>
        <div class="card-control">
          <el-button @click="handleEdit" type="text"><i class="el-icon-plus"></i>添加项目</el-button>
        </div>
      </div>
      <div>
        <el-table
          v-loading="projectLoading"
          element-loading-text="拼命加载中"
          highlight-current-row
          border
          stripe
          :data="projectList">
          <el-table-column
            fixed
            type="index"
            label="序号"
            align="center"
            width="100">
          </el-table-column>
          <el-table-column
            prop="project_name"
            label="项目名称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="app_ids"
            label="游戏列表"
            align="center">
          </el-table-column>
          <el-table-column
            label="备注"
            align="center">
              <template slot-scope="scope">{{ scope.row.remark }}</template>
          </el-table-column>
          <el-table-column
            label="奖品格式"
            align="center">
              <template slot-scope="scope">{{ scope.row.item_format }}</template>
          </el-table-column>
          <el-table-column
            label="GM发邮箱地址"
            align="center">
              <template slot-scope="scope">{{ scope.row.send_url }}</template>
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

        <div class="search-pagination">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="listQuery.page"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="listQuery.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="projectTotal">
          </el-pagination>
        </div>
      </div>
    </el-card>

    <el-dialog
      center
      custom-class="custom-dialog-form"
      :title="ruleFormTitle"
      :visible.sync="dialogFormVisible">
      <el-form
        ref="ruleForm"
        :rules="rules"
        label-width="120px"
        :model="ruleForm">
        <el-form-item
          label="项目名称"
          prop="project_name">
          <el-input v-model="ruleForm.project_name"></el-input>
        </el-form-item>
        <el-form-item
          label="游戏列表"
          prop="app_ids">
          <el-select
            multiple
            collapse-tags
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
        <el-form-item
          label="备注"
          prop="remark">
          <el-input v-model="ruleForm.remark" type="textarea" :autosize="{ minRows: 2 }"></el-input>
        </el-form-item>
        <el-form-item
          label="格式"
          prop="item_format">
          <el-input v-model="ruleForm.item_format" type="textarea" :autosize="{ minRows: 2 }"></el-input>
        </el-form-item>
        <el-form-item
          label="GM发邮箱地址"
          prop="send_url">
          <el-input v-model="ruleForm.send_url"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelForm">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import { mapGetters } from 'vuex'

const defaultForm = {
  project_name: '',
  app_ids: [],
  remark: '',
  item_format: '',
  send_url: '',
  id: ''
}

export default {
  data() {
    const validateRemark = (rule, value, callback) => {
      if (!value) {
        callback(new Error('备注信息不能为空'))
      } else if (value.length > 20) {
        callback(new Error('输入内容不得超过20个字符'))
      } else {
        callback()
      }
    }
    return {
      dialogFormVisible: false,
      postType: 'PROJECT_CREATE',
      ruleFormTitle: '添加项目',
      ruleForm: Object.assign({}, defaultForm),
      listQuery: {
        page: 1,
        size: 10,
        id: ''
      },
      rules: {
        project_name: [
          {required: true, message: '项目名称不能为空', trigger: 'blur'}
        ],
        app_ids: [
          {required: true, message: '请选择游戏列表', trigger: 'blur'}
        ],
        remark: [
          {required: true, trigger: 'blur', validator: validateRemark}
        ],
        item_format: [
          {required: true, message: '格式不能为空', trigger: 'blur'}
        ],
        send_url: [
          {required: true, message: 'GM发送邮箱地址不能为空', trigger: 'blur'}
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  computed: {
    ...mapGetters([
      'appList',
      'projectList',
      'projectTotal',
      'projectLoading'
    ])
  },
  methods: {
    // 0.获取列表数据 -- 并默认搜索全部
    getList() {
      this.$store.dispatch('PROJECT_FETCH_LIST', this.listQuery)
    },
    // 1.单页最大显示数据条数
    handleSizeChange(val) {
      this.listQuery.size = val
      this.getList()
    },
    // 2.处理分页
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    // 3.取消并重置表单
    cancelForm() {
      this.$refs.ruleForm.resetFields()
      this.dialogFormVisible = false
    },
    // 4.提交表单
    submitForm() {
      const that = this
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          // 将app_ids数组改为字符串格式
          const app_ids = this.ruleForm.app_ids.join()
          const params = Object.assign({}, this.ruleForm, {app_ids})
          this.$store.dispatch(this.postType, params)
            .then(() => {
              this.dialogFormVisible = false
              this.$message({
                type: 'success',
                message: '操作成功!',
                duration: 1 * 1000,
                onClose: function() {
                  // 更新获取数据列表
                  that.getList()
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
    // 5.新增或编辑
    handleEdit(index, row) {
      if (!row) {
        this.ruleFormTitle = '添加项目'
        this.postType = 'PROJECT_CREATE'
        // 初始化类别数据
        this.ruleForm = deepClone(defaultForm)
      } else {
        this.ruleFormTitle = '编辑项目'
        this.postType = 'PROJECT_EDIT'
        // 填充对应类别数据
        const appIds = row.app_ids ? row.app_ids.split(',') : []
        this.ruleForm = {
          project_id: row.id,
          project_name: row.project_name,
          app_ids: appIds,
          remark: row.remark,
          item_format: row.item_format,
          send_url: row.send_url
        }
      }
      this.dialogFormVisible = true
    },
    // 6.删除项目
    handleDelete(index, row) {
      const that = this
      this.$confirm('此操作将会永久删除该项目，是否确认删除？', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('PROJECT_DEL', { project_id: row.id })
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

<template>
  <header class="head-container">
    <div class="admin-logo">
      <router-link to="/">
        <img src="../../../assets/images/logo.png" title="凯撒文化">
      </router-link>
    </div>
    <div class="admin-name">
      <h1>问卷调研平台</h1>
    </div>
    <div class="admin-control">
      <div class="avator-wrap">
        <img :src="userAvator">
        <span class="username">{{username}}</span>
      </div>
      <div class="control-wrap">
        <div class="control-item toggle-screen">
          <screenfull :width="16" :height="16" class="screenfull">
            <span>全屏切换</span>
          </screenfull>
        </div>
        <!-- <div class="control-item edit-password" @click="dialogFormVisible = true">
          <div>修改密码</div>
        </div> -->
        <div class="control-item logout" @click="logout">
          <div>注销登录</div>
        </div>
      </div>
    </div>

    <el-dialog
      center
      custom-class="custom-dialog-form"
      title="修改密码"
      :visible.sync="dialogFormVisible">
      <el-form
        ref="ruleForm"
        :rules="rules"
        label-width="110px"
        :model="ruleForm">
        <el-form-item
          label="原密码"
          prop="origin_password">
          <el-input placeholder="输入原始密码" v-model="ruleForm.origin_password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="新密码"
          prop="new_password">
          <el-input placeholder="输入新密码" v-model="ruleForm.new_password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="新密码"
          prop="check_password">
          <el-input placeholder="再次输入新密码" v-model="ruleForm.check_password" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </header>
</template>

<script>
import { mapGetters } from 'vuex'
import Screenfull from '@/components/Screenfull'

export default {
  name: 'HeadBar',
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm.check_password !== '') {
          this.$refs.ruleForm.validateField('check_password')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.new_password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      dialogFormVisible: false,
      ruleForm: {
        origin_password: '',
        new_password: '',
        check_password: ''
      },
      rules: {
        origin_password: [
          {required: true, message: '请输入原始密码', trigger: 'blur'}
        ],
        new_password: [
          { required: true, trigger: 'blur', validator: validatePass }
        ],
        check_password: [
          { required: true, trigger: 'blur', validator: validatePass2 }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar'
    ]),
    userAvator() {
      return this.avatar ? this.avatar : require('../../../assets/images/icon-ip-user.png')
    },
    username() {
      return this.name ? this.name : 'kaiser'
    }
  },
  created() {
    // 获取用户信息
    this.$store.dispatch('GetInfo')
  },
  methods: {
    // 0.登出
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 前端路由重载
      })
    },
    // 1.提交修改密码表单
    submitForm() {
      const that = this
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const parmas = {
            username: that.username,
            origin_password: that.ruleForm.origin_password,
            new_password: that.ruleForm.new_password
          }
          this.$store.dispatch('EditPass', parmas)
            .then(() => {
              this.dialogFormVisible = false
              this.$message({
                type: 'success',
                message: '操作成功，请您稍后重新登陆',
                onClose: function() {
                  // 重置密码登出，防止错误
                  that.logout()
                }
              })
            })
        } else {
          return false
        }
      })
    }
  },
  components: {
    Screenfull
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '../../../assets/styles/mixin.scss';

.head-container{
  background-color: #27a9e3;
  color: #fff;
  height: 100px;
  line-height: 100px;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  padding: 0 20px;
  box-sizing: border-box;
  flex-shrink: 0;
  // z-index: 10;
  text-align: center;
  @include clearfix;
  .admin-logo{
    float: left;
    width: 180px;
    margin-left: -20px;
    background: #219ad0;
    img{
      width: 140px;
      vertical-align: middle;
    }
  }
  .admin-name{
    position: absolute;
    left: 50%;
    margin-left: -108px;
    h1{
      font-size: 36px;
    }
  }
  .admin-control{
    line-height: 25px;
    position: absolute;
    right: 20px;
    bottom: 0;
    .avator-wrap{
      display: inline-block;
      img{
        width: 20px;
        height: 20px;
        border-radius: 50%;
        vertical-align: middle;
      }
      .username{
        display: inline-block;
        padding-left: 5px;
      }
    }
    .control-wrap{
      display: inline-block;
      .screenfull{
        display: inline-block;
      }
      .control-item{
        display: inline-block;
        cursor: pointer;
        height: 25px;
        line-height: 25px;
        color: #fff;
        padding-left: 20px;
        margin-left: 15px;
        background: url('../../../assets/images/icon-head.png') no-repeat;
        :hover{
          text-decoration: underline;
        }
      }
      .toggle-screen{
        background: none;
        padding-left: 0;
      }
      .edit-password{
        background-position: 0 5px;
      }
      .logout{
        background-position: 0 -28px;
      }
    }
  }
}
</style>

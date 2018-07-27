<template>
  <div class="box-container" v-loading="questionVerify">
    <el-card class="box-card" shadow="never">
      <div slot="header" class="card-header">
        <span class="card-title">问卷信息</span>
      </div>
      <el-table
        highlight-current-row
        border
        stripe
        v-loading="questionLoading"
        :data="infoData">
        <el-table-column
          prop="id"
          label="问卷ID"
          align="center">
        </el-table-column>
        <el-table-column
          prop="title"
          label="问卷标题"
          align="center">
        </el-table-column>
        <el-table-column
          prop="type_name"
          label="问卷类型"
          align="center">
        </el-table-column>
        <el-table-column
          prop="project_name"
          label="所属项目"
          align="center">
        </el-table-column>
        <el-table-column
          prop="create_user"
          label="创建人"
          align="center">
        </el-table-column>
        <el-table-column
          prop="verify_user"
          label="审核人"
          align="center">
        </el-table-column>
      </el-table>
    </el-card>

    <el-card class="box-card" shadow="never">
      <div slot="header" class="card-header">
        <span class="card-title">问卷操作</span>
      </div>
      <div class="custom-step">
        <div class="step-line"></div>
        <ul class="step-box">
          <li class="step-item">
            <el-row>
              <el-col :span="4">
                <span class="step-item-title" :class="isSubimitVerify? 'active' : ''">1</span>
              </el-col>
              <el-col :span="10">
                <p class="step-item-tips">提交问卷</p>
                <span class="step-item-desc">
                  <template v-if="isSubimitVerify">问卷已提交，请等待审核</template>
                  <template v-else>问卷已创建成功，是否提交审核？</template>
                </span>
              </el-col>
              <el-col :span="10">
                <button
                  v-if="$_has('question/question-submit-verify')"
                  @click="handleCheck('QUESTION_SUBMIT_VERIFY')"
                  :disabled="isSubimitVerify"
                  class="custom-btn"
                  :class="isSubimitVerify? 'is-over': ''">提交</button>
              </el-col>
            </el-row>
          </li>
          <li class="step-item">
            <el-row>
              <el-col :span="4">
                <span class="step-item-title" :class="isVerify? 'active' : ''">2</span>
              </el-col>
              <el-col :span="10">
                <p class="step-item-tips">审核问卷</p>
                <span class="step-item-desc">
                  <template v-if="isVerifyOk">问卷审核通过，请发布问卷</template>
                  <template v-else-if="isVerify">问卷未审核通过，请重新编辑问卷</template>
                  <template v-else>问卷已创建完毕，是否通过审核？</template>
                </span>
              </el-col>
              <el-col :span="10">
                <template v-if="$_has('question/question-verify')">
                  <button
                    @click="handleCheck('QUESTION_VERIFY', 1)"
                    :disabled="isVerify"
                    class="custom-btn"
                    :class="isVerify? 'is-over': ''">通过</button>
                  <button
                    @click="handleCheck('QUESTION_VERIFY', 2)"
                    :disabled="isVerify"
                    class="custom-btn"
                    :class="isVerify? 'is-over': ''">驳回</button>
                </template>
                <span class="hover-show">
                  <router-link class="hover-link" :to="{name: 'detail-look', params: {id: this.id}}" target="_blank">
                    查看问卷
                  </router-link>
                </span>
                <span class="hover-show">
                  <router-link class="hover-link" :to="{name: 'setting-look', params: {id: this.id}}" target="_blank">
                    查看设置
                  </router-link>
                </span>
              </el-col>
            </el-row>
          </li>
          <li class="step-item">
            <el-row>
              <el-col :span="4">
                <span class="step-item-title" :class="isPublish? 'active' : ''">3</span>
              </el-col>
              <el-col :span="10">
                <p class="step-item-tips">问卷发布</p>
                <span class="step-item-desc">
                  <template v-if="isPublish">问卷已发布，问卷链接已生成</template>
                  <template v-else>问卷已审核通过，是否发布？</template>
                </span>
              </el-col>
              <el-col :span="10">
                <button
                  v-if="$_has('question/question-publish')"
                  @click="handleCheck('QUESTION_PUBLISH')"
                  :disabled="isPublish"
                  class="custom-btn"
                  :class="isPublish? 'is-over':''">发布</button>
              </el-col>
            </el-row>
          </li>
          <li class="step-item">
            <el-row>
              <el-col :span="4">
                <span class="step-item-title" :class="isOver? 'active' : ''">4</span>
              </el-col>
              <el-col :span="10">
                <p class="step-item-tips">回收问卷</p>
                <span class="step-item-desc">
                  <template v-if="isOver">问卷已成功回收</template>
                  <template v-else>问卷正在进行中，是否结束调研？</template>
                </span>
              </el-col>
              <el-col :span="10">
                <button
                  v-if="$_has('question/question-over')"
                  @click="handleCheck('QUESTION_OVER')"
                  :disabled="isOver"
                  class="custom-btn"
                  :class="isOver? 'is-over':''">回收</button>
              </el-col>
            </el-row>
          </li>
        </ul>
      </div>
    </el-card>

    <el-card v-if="isPublish" class="box-card" shadow="never">
      <div slot="header" class="card-header">
        <span class="card-title">问卷链接</span>
      </div>
      <el-input readonly placeholder="问卷链接地址 -- 若为空，请联系管理员" v-model="url">
        <el-tooltip slot="append" effect="dark" content="点我复制链接" placement="top">
          <el-button id="copyBtn" :data-clipboard-text="url">复制</el-button>
        </el-tooltip>
      </el-input>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ClipBoard from 'clipboard'

export default {
  name: 'question-handle',
  data() {
    return {
      id: this.$route.params.id,
      infoData: null,
      infoStatus: '',
      url: ''
    }
  },
  created() {
    this.getInfo()
  },
  mounted() {
    this.copyLink()
  },
  computed: {
    ...mapGetters([
      'questionLoading',
      'questionVerify'
    ]),
    isSubimitVerify() {
      return this.infoStatus > 0
    },
    isVerify() {
      return this.infoStatus > 1
    },
    isVerifyOk() {
      return this.infoStatus > 2
    },
    isPublish() {
      return this.infoStatus > 3
    },
    isOver() {
      return this.infoStatus > 4
    }
  },
  methods: {
    // 0.获取问卷信息
    getInfo() {
      this.$store.dispatch('QUESTION_FETCH_DETAIL', {question_id: this.id})
        .then(res => {
          const temp = res.data
          this.infoData = [temp]
          this.infoStatus = temp.status
          this.url = temp.url
        })
    },
    // 1.提交审核
    handleCheck(type, verify) {
      let params = {question_id: this.id}
      if (verify) {
        params = Object.assign({}, params, { verify })
      }
      this.$store.dispatch(type, params)
        .then(res => {
          this.$message({
            type: 'success',
            message: res.msg,
            duration: 1 * 1000,
            onClose: () => {
              // 更新获取数据列表
              this.getInfo()
            }
          })
        })
    },
    // 2.复制问卷链接
    copyLink() {
      const self = this // 指明this对象
      const clipboard = new ClipBoard('#copyBtn')
      clipboard.on('success', function(e) {
        // console.info('Action:', e.action)
        // console.info('Text:', e.text)
        // console.info('Trigger:', e.trigger)
        self.$message.success('已成功复制到剪切板')
      })

      clipboard.on('error', function(e) {
        self.$message.error('点击复制失败，请手动选择复制')
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

.custom-step{
  position: relative;
  .custom-btn{
    width: 98px;
    display: inline-block;
    text-align: center;
    line-height: 34px;
    background: #fff;
    border: 1px solid #a5b5c5;
    border-radius: 5px;
    cursor: pointer;
    &:hover{
      background: #f8f8f8;
    }
    &+.custom-btn{
      margin-left: 10px;
    }
    &.is-over{
      cursor: not-allowed;
      border-color: #d4d4d4;
      background: #f8f8f8;
      color: #ababaa;
    }
  }
  .step-line{
    position: absolute;
    left: 60px;
    top: 10px;
    bottom: 40px;
    width: 2px;
    background-color: #a7a7a7;
    z-index: 1;
  }
  .step-box{
    position: relative;
    z-index: 2;
  }
  .step-item{
    &+.step-item{
      margin-top: 100px;
    }
    .step-item-title{
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: inline-block;
      text-align: center;
      background: #b5b5b5;
      line-height: 40px;
      color: #fff;
      font-size: 20px;
      margin-left: 40px;
      &.active{
        background: #70b6ff;
      }
    }
    .step-item-tips{
      font-size: 16px;
      color: #333;
      font-weight: 700;
    }
    .step-item-desc{
      color: #677387;
    }
  }
  .hover-show{
    .hover-link{
      padding: 0 0 0 10px;
      color: #409eff;
    }
  }
}
</style>

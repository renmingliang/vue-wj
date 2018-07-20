<template>
  <div class="editor-container">
    <sticky v-if="!isLook" className="editor-topbar" :stickyTop="100">
      <div class="topbar-question">
        <ul>
          <li
            class="type-item"
            v-for="type in questionsTemplate"
            :key="type.id">
            <span @click="createItem(type)">{{type.iTitle}}</span>
          </li>
        </ul>
      </div>
      <div class="topbar-action">
        <el-button-group>
          <el-button @click="goBack" type="primary" icon="el-icon-arrow-left">返回</el-button>
          <el-button @click="saveQuestions('btn')" type="primary">保存至草稿箱</el-button>
          <router-link :to="{name: 'preview-look', params: {id: this.id}}" target="_blank">
            <el-button type="primary" icon="el-icon-view">预览</el-button>
          </router-link>
        </el-button-group>
      </div>
    </sticky>

    <div class="editor-main" v-loading="questionLoading">
      <div class="survey-wrap">
        <div class="survey-main">
          <!-- <div class="survey-com">
            <div class="inner text-center">
              <template v-if="!isLook">
                <h1 id="title" class="com-content title-content" contenteditable="true">
                  {{questions.title}}
                </h1>
              </template>
              <template v-else>
                <h1 class="com-content title-content" v-html="questions.title"></h1>
              </template>
            </div>
          </div>
          <div class="survey-com">
            <div class="inner">
              <template v-if="!isLook">
                <div id="prefix" class="com-content" contenteditable="true">
                  {{questions.prefix}}
                </div>
              </template>
              <template v-else>
                <div class="com-content" v-html="questions.prefix"></div>
              </template>
            </div>
          </div> -->
          <div class="survey-question">
            <draggable
              element="ul"
              v-model="questions.lists"
              :options="{ group: 'editor', disabled: isLook || viewEdit }"
              @end="dragItem">
              <li
                v-for="(list, index) in questions.lists"
                :key="index">
                <template v-if="editorNum[index+1]">
                  <div
                    class="editor-question"
                    :class="!editorNum[prevEditorNum]?'shake':''"
                    :key="`${index + 1}-editor`">
                    <div class="inner">
                      <div class="row">
                        <label class="row-title">题目</label>
                        <div class="row-content">
                          <div :id="`${index+1}_title`" contenteditable="true" class="inline-editor">
                            <div v-html="list.iTitle"></div>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <label class="row-title">备注</label>
                        <div class="row-content">
                          <div :id="`${index+1}_remark`" contenteditable="true" class="inline-editor">
                            <div v-html="list.iRemark"></div>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="row-content">
                          <el-checkbox v-model="list.iRequired">必填</el-checkbox>
                          <el-input v-if="list.iType === 'textarea'" v-model="list.iMaxlength" placeholder="输入字数长度限定"></el-input>
                        </div>
                      </div>
                      <div class="row">
                        <div class="row-content">
                          <template v-if="list.iType ==='radio' || list.iType ==='checkbox'">
                            <div class="options-list">
                              <ul class="options-normal">
                                <li
                                  v-for="(option, ind) in list.iOptions"
                                  :key="ind"
                                  class="list-item">
                                  <div class="option-input-wrap">
                                    <div :id="`${index+1}_${ind+1}`" class="inline-editor" contenteditable="true">
                                      <div v-html="option.txt"></div>
                                    </div>
                                  </div>
                                  <div class="btn-del-option">
                                    <span @click="delOption(index+1, list.iOptions, ind)"><i class="el-icon-delete"></i></span>
                                  </div>
                                </li>
                              </ul>
                              <ul v-if="addInput[index+1]" class="options-other">
                                <li class="list-item">
                                  <div class="option-input-wrap">
                                    <div :id="`${index+1}_addInput`" class="inline-editor" contenteditable="true"><p>其他</p></div>
                                  </div>
                                  <div class="btn-del-option">
                                    <span @click="delOption(index+1, list.iOptions)"><i class="el-icon-delete"></i></span>
                                    <span @click="ruleOther(index+1, list.iRuleOther)"><i class="el-icon-setting"></i></span>
                                  </div>
                                </li>
                              </ul>
                            </div>
                            <div class="options-control">
                              <span
                                class="add-option"
                                @click="createOption(index+1, list.iOptions, list.iType)">新建选项</span>
                              <span
                                class="add-option"
                                :class="addInput[index+1]?'not-allow':''"
                                @click="createOption(index+1)">添加「其他」项</span>
                            </div>
                          </template>
                          <template v-else-if="list.iType.split('_')[0] === 'matrix'">
                            <div class="matrix-subtitles">
                              <div class="options-list">
                                <ul class="options-normal">
                                  <li
                                    v-for="(subtitle, ind) in list.iSubTitles"
                                    :key="ind"
                                    class="list-item">
                                    <div class="option-input-wrap">
                                      <div :id="`${index+1}_${ind+1}_subtitle`" class="inline-editor" contenteditable="true">
                                        <div v-html="subtitle.txt"></div>
                                      </div>
                                    </div>
                                    <div class="btn-del-option">
                                      <span @click="delSubtitle(index+1, list.iSubTitles, ind)"><i class="el-icon-delete"></i></span>
                                    </div>
                                  </li>
                                </ul>
                              </div>
                              <div class="options-control">
                                <span
                                  class="add-option"
                                  @click="createSubtitle(index+1, list.iSubTitles)">新建问题</span>
                              </div>
                            </div>
                            <div class="matrix-options">
                              <div class="options-list">
                                <ul class="options-normal">
                                  <li
                                    v-for="(option, ind) in list.iOptions"
                                    :key="ind"
                                    class="list-item">
                                    <div class="option-input-wrap">
                                      <div :id="`${index+1}_${ind+1}`" class="inline-editor" contenteditable="true">
                                        <div v-html="option.txt"></div>
                                      </div>
                                    </div>
                                    <div class="btn-del-option">
                                      <span @click="delOption(index+1, list.iOptions, ind)"><i class="el-icon-delete"></i></span>
                                    </div>
                                  </li>
                                </ul>
                              </div>
                              <div class="options-control">
                                <span
                                  class="add-option"
                                  @click="createOption(index+1, list.iOptions, list.iType)">新建选项</span>
                              </div>
                            </div>
                          </template>
                        </div>
                      </div>
                      <div class="row text-right">
                        <el-button type="info" @click="cancelEditor(index+1)">取消</el-button>
                        <el-button type="success" @click="confirmEditor(index+1)">确定</el-button>
                      </div>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class="preview-question" :class="isLook?'not-move':''" :key="`${index + 1}-preview`">
                      <div class="inner">
                        <div class="title">
                          <span class="float-left">{{index + 1}}.</span>
                          <h3 v-html="list.iTitle" class="float-left title-txt"></h3>
                          <span v-if="list.iRequired" class="float-left required">*</span>
                        </div>
                        <div v-if="list.iRemark" v-html="list.iRemark" class="remark"></div>
                        <div class="options">
                          <template v-if="list.iType === 'radio' || list.iType === 'checkbox'">
                            <div
                              class="options-item"
                              v-for="(option, ind) in list.iOptions"
                              :key="ind">
                              <input
                              class="options-type"
                              :id="`q${list.iID}_${ind+1}`"
                              :name="`q${list.iID}`"
                              :type="list.iType"
                              :value="option.value">
                              <label class="options-txt clearfix" :for="`q${list.iID}_${ind+1}`">
                                <span class="options-value float-left">{{option.value}}</span>
                                <div v-html="option.txt" class="float-left"></div>
                              </label>
                              <div class="options-tip">
                                <template v-if="logicType === 'display'">
                                  <span v-if="option.display">
                                    选择后<b>显示</b>：<b>{{getQuestionIndex(option.display, ind, index)}}</b>
                                  </span>
                                </template>
                                <template v-else>
                                  <span v-if="option.goto">
                                    选择后<b>跳转</b>到：<b>{{getQuestionIndex(option.goto, ind, index)}}</b>
                                  </span>
                                </template>
                              </div>
                              <textarea
                                class="options-input"
                                v-if="option.input"
                                :maxlength="list.iRuleOther.maxlength"
                                :placeholder="option.placeholder"
                                rows="3"></textarea>
                            </div>
                          </template>
                          <template v-else-if="list.iType.split('_')[0] === 'matrix'">
                            <div class="matrix-container">
                              <table class="matrix-table">
                                <thead>
                                  <tr>
                                    <th></th>
                                    <th
                                      class="text-center"
                                      v-for="(option, ind) in list.iOptions"
                                      v-html="option.txt"
                                      :key="ind"></th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr
                                    v-for="(subtitle, index) in list.iSubTitles"
                                    :key="index">
                                    <td v-html="subtitle.txt"></td>
                                    <td
                                      class="text-center"
                                      v-for="(option, ind) in list.iOptions"
                                      :key="ind">
                                        <input
                                          :id="`q${list.iID}_${index+1}_${ind+1}`"
                                          :name="`q${list.iID}_${index+1}`"
                                          :type="list.iType.split('_')[1]"
                                          :value="option.value">
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </template>
                          <template v-else>
                            <div
                              class="options-item"
                              v-for="(option, ind) in list.iOptions"
                              :key="ind">
                              <textarea
                                class="options-input"
                                :name="`q${list.iID}`"
                                :maxlength="list.iMaxlength"
                                :placeholder="option.placeholder"
                                rows="3"
                                ></textarea>
                            </div>
                          </template>
                        </div>
                      </div>
                      <template v-if="!isLook">
                        <div @click="enterItem(index+1)" class="mask-control"></div>
                        <div class="control">
                          <ul>
                            <li @click="enterItem(index+1)" class="control-btn">编辑</li>
                            <li @click="logicItem(list, index+1)" class="control-btn">逻辑</li>
                            <li @click="copyItem(list)" class="control-btn">复制</li>
                            <li @click="delItem(list)" class="control-btn">删除</li>
                          </ul>
                        </div>
                      </template>
                  </div>
                </template>
              </li>
            </draggable>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      center
      title="填空设置"
      :visible.sync="dialogOtherVisible"
      :close-on-click-modal="false"
      custom-class="custom-dialog-form">
      <el-form
        ref="otherForm"
        label-width="110px"
        :model="otherForm">
        <el-form-item label="最多填写">
          <el-input-number v-model="otherForm.maxlength" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="是否必填">
          <el-checkbox v-model="otherForm.required"></el-checkbox>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogOtherVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitOtherForm">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="逻辑设置"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible">
      <el-tabs
        v-model="logicType"
        :before-leave="beforeToggle">
        <el-tab-pane label="显示逻辑" name="display">
          <template v-if="logicData.iType === 'radio' || logicData.iType === 'checkbox'">
            <div class="logic-container">
              <div class="logic-left">
                <p>当用户选择本题选项:</p>
                <ul class="logic-item">
                  <li
                    class="clearfix"
                    v-for="(option, index) in logicData.iOptions"
                    :class="logicIndex === index ? 'logic-active' : ''"
                    @click="logicChange(index)"
                    :key="index">
                      <span class="float-left">{{option.value}}. </span>
                      <div v-html="option.txt" class="float-left"></div>
                  </li>
                </ul>
              </div>
              <div class="logic-right">
                <p>则<b> 显示 </b>以下题目:</p>
                <ul class="logic-item">
                  <li
                    v-for="(list, index) in questions.lists"
                    @click="logicToggle(list, $event)"
                    class="clearfix"
                    :class="index <= questions.lists.indexOf(logicData)? 'not-allow' : (logicActive[logicIndex].includes(list.iID)?'logic-active':'')"
                    :key="index">
                    <span class="float-left">{{index+1}}. </span>
                    <div v-html="list.iTitle" class="float-left"></div>
                  </li>
                </ul>
              </div>
            </div>
          </template>
          <template v-else>
            <div>当前题型不支持显示逻辑控制</div>
          </template>
        </el-tab-pane>
        <el-tab-pane label="跳题逻辑" name="goto">
          <template v-if="logicData.iType === 'radio'">
            <div class="logic-container">
              <div class="logic-left">
                <p>当用户选择本题选项:</p>
                <ul class="logic-item">
                  <li
                    class="clearfix"
                    v-for="(option, index) in logicData.iOptions"
                    :class="logicIndex === index ? 'logic-active' : ''"
                    @click="logicChange(index)"
                    :key="index">
                      <span class="float-left">{{option.value}}. </span>
                      <div v-html="option.txt" class="float-left"></div>
                  </li>
                </ul>
              </div>
              <div class="logic-right">
                <p>则<b> 跳题 </b>至以下题目:</p>
                <ul class="logic-item">
                  <li
                    v-for="(list, index) in questions.lists"
                    @click="logicToggle(list, $event)"
                    class="clearfix"
                    :class="index <= questions.lists.indexOf(logicData)? 'not-allow' : (logicActive[logicIndex].includes(list.iID)?'logic-active':'')"
                    :key="index">
                    <span class="float-left">{{index+1}}. </span>
                    <div v-html="list.iTitle" class="float-left"></div>
                  </li>
                </ul>
              </div>
            </div>
          </template>
          <template v-else>
            <div>仅有<b> 单选题 </b>支持跳题逻辑设置</div>
          </template>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button @click="logicCancel">取 消</el-button>
        <el-button type="primary" @click="logicConfirm">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import Sticky from '@/components/Sticky'
import draggable from 'vuedraggable'
import { deepClone } from '@/utils'
import { mapGetters } from 'vuex'

const defaultForm = {
  // title: '问卷标题',
  lists: []
}

const defaultLogicType = [
  {label: '显示', value: 'display'},
  {label: '跳转', value: 'goto'}
]

export default {
  name: 'question-preview',
  props: {
    isLook: {
      type: Boolean,
      default: false
    },
    isDetail: {
      type: Boolean,
      default: false
    },
    id: [String, Number]
  },
  data() {
    return {
      viewEdit: false,
      viewCreate: false,
      dialogVisible: false,
      dialogOtherVisible: false,
      logicType: 'display',
      logicIndex: '',
      logicActive: {},
      logicData: {},
      otherForm: {},
      addInput: {},
      prevEditorNum: 1,
      editorNum: {},
      editorData: {},
      editorClone: null,
      optionClone: null,
      editorCom: [], // ['title']
      answers: {},
      questions: deepClone(defaultForm)
    }
  },
  computed: {
    CKEDITOR() {
      return window.CKEDITOR
    },
    logicTypeOptions() {
      return defaultLogicType
    },
    ...mapGetters([
      'questionLoading',
      'questionsTemplate',
      'questionLetters'
    ])
  },
  created() {
    // if (!this.isLook) {
    //   this.initCKEditor()
    // }
    if (this.isDetail) {
      this.fetchAnswerDetail()
    } else {
      this.fetchData()
    }
  },
  methods: {
    // 0.返回
    goBack() {
      // 返回设置创建页 -- 需重定向进入设置编辑页
      if (this.id) {
        const params = { id: this.id }
        this.$router.push({ name: 'setting-edit', params, replace: true })
      } else {
      // 其他页返回
        window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/')
      }
    },
    // 0.1.获取问卷数据
    fetchData() {
      this.$store.dispatch('QUESTION_ORIGIN_DETAIL', {question_id: this.id})
        .then(res => {
          const tempQ = JSON.parse(res.data)
          if (tempQ) {
            this.questions = tempQ
          } else {
            this.questions = deepClone(defaultForm)
          }
        })
    },
    // 0.2.获取问题答题详情
    fetchAnswerDetail() {
      this.$store.dispatch('QUESTION_ANSWER_DETAIL', {paper_id: this.id})
        .then(res => {
          const { question, answer } = res.data
          const tempQ = JSON.parse(question)
          const tempA = JSON.parse(answer)
          this.questions = tempQ
          this.answers = tempA.answer
          console.log(this.answers)
        })
    },
    // 0.3.保存至草稿
    saveQuestions(isBtn) {
      const params = Object.assign({}, this.questions, {question_id: this.id})
      console.log(params)

      this.$store.dispatch('QUESTION_ORIGIN_IMPORT', params)
        .then(() => {
          if (isBtn) {
            this.$confirm('该问卷已成功保存至草稿箱，是否继续相关操作？', '提示', {
              closeOnClickModal: false,
              confirmButtonText: '前往操作',
              cancelButtonText: '取消',
              type: 'success'
            }).then(() => {
              this.$router.push({name: 'question-handle', params: {id: this.id}})
            }).catch(() => {
              console.log('取消')
            })
          }
        })
    },
    // 1.初始化公用富文本框
    initCKEditor() {
      this.$nextTick(() => {
        this.editorCom.forEach(item => {
          this.CKEDITOR.inline(item)
        })

        this.$once('hook:beforeDestroy', function () {
          this.destoryCKEditor()
        })
      })
    },
    // 2.摧毁所有富文本框
    destoryCKEditor() {
      Object.values(this.CKEDITOR.instances).forEach(instace => {
        instace.destroy()
      })
    },
    // 3.根据选项逻辑的iID提示对应题目
    getQuestionIndex(val, ind, index) {
      const arr = val.split(',')
      const temp = []
      arr.forEach((item, i) => {
        this.questions.lists.forEach((list, n) => {
          if (item === list.iID) {
            if (index < n) {
              // 更新来源题ID
              list.iFrom = this.questions.lists[index].iID
              // 添加大于该题选项位置的逻辑题
              temp.push(`第 ${n + 1} 题`)
            } else {
              // 重置来源题ID
              list.iFrom = ''
              // 删除小于该题选项位置的逻辑题
              arr.splice(i, 1)
              // 更新该题选项逻辑
              this.questions.lists[index].iOptions[ind][this.logicType] = arr.join()
            }
          }
        })
      })
      return temp.join('、')
    },
    // 4.拖拽结束更新富文本框
    dragItem(evt) {
      const oldNum = evt.oldIndex + 1
      const newNum = evt.newIndex + 1
      const tempObj = {}

      // 考虑复制题但未编辑创建该题富文本框情况
      if (this.editorData[oldNum]) {
        // 复制当前拖拽的题
        Object.keys(this.editorData[oldNum]).forEach(key => {
          const newKey = key.replace(/^\d+/, newNum)
          tempObj[newKey] = this.editorData[oldNum][key]
        })
      }

      // 判断拖拽前后两者间的索引值大小，并更新数据
      if (oldNum < newNum) {
        for (let i = oldNum; i < newNum; i++) {
          this.editorData[i] = {}
          // 考虑未创建该题富文本框情况
          if (this.editorData[i + 1]) {
            Object.keys(this.editorData[i + 1]).forEach(key => {
              const newKey = key.replace(/^\d+/, i)
              this.editorData[i][newKey] = this.editorData[i + 1][key]
            })
          }
        }
      } else {
        for (let i = oldNum; i > newNum; i--) {
          this.editorData[i] = {}
          // 考虑未创建该题富文本框情况
          if (this.editorData[i - 1]) {
            Object.keys(this.editorData[i - 1]).forEach(key => {
              const newKey = key.replace(/^\d+/, i)
              this.editorData[i][newKey] = this.editorData[i - 1][key]
            })
          }
        }
      }

      // 更新后的位置
      this.editorData[newNum] = tempObj
      console.log(this.editorData)

      this.saveQuestions()
    },
    // 5.创建题目
    createItem(item) {
      const num = this.questions.lists.length + 1
      this.prevEditorNum = num
      if (this.viewCreate || this.viewEdit) {
        return false
      }
      this.viewCreate = true
      const temp = deepClone(item)
      this.questions.lists.push(temp)
      this.enterItem(num)
    },
    // 6.编辑该题
    enterItem(num) {
      this.prevEditorNum = num
      if (this.viewEdit) {
        return false
      }
      console.log('进入编辑', num)
      this.viewEdit = true
      this.$set(this.editorNum, num, true)
      const tempData = this.questions.lists[num - 1]
      this.editorData[num] = this.editorData[num] || {}
      this.editorClone = deepClone(this.editorData[num])
      this.optionClone = deepClone(tempData)

      // 若含有其他项，先将其从选项中删除
      const isAddInput = this.editorData[num][`${num}_addInput`]
      if (this.addInput[num] && isAddInput) {
        tempData.iOptions.pop()
      }
      this.setDataEditor(num)
    },
    // 7.逻辑设置
    logicItem(item) {
      this.logicData = item
      // 先清空之前题目选择
      this.logicActiveReset()
      // 再渲染该题第一项
      this.logicChange()
      this.dialogVisible = true
      console.log('逻辑设置', item)
    },
    // 8.切换选项
    logicChange(index) {
      const tempInd = index || 0
      this.logicIndex = tempInd
    },
    // 9.修改该选项控制的逻辑题
    logicToggle(item, e) {
      console.log(e)
      // 阻止禁选项
      const isNotAllow = e.currentTarget.classList.contains('not-allow')
      if (isNotAllow) return false
      // 获取题号自身ID
      const tempID = item.iID
      const tempInd = this.logicActive[this.logicIndex].indexOf(tempID)
      if (tempInd > -1) {
        this.logicActive[this.logicIndex].splice(tempInd, 1)
      } else {
        if (this.logicType === 'display') {
          // 显示题可多项
          this.logicActive[this.logicIndex].push(tempID)
        } else {
          // 跳题只能选一项
          // 注意这里需要通过观察数组对象，控制页面logic-active的渲染
          this.$set(this.logicActive, this.logicIndex, [tempID])
        }
      }
    },
    // 10.确认逻辑编辑
    logicConfirm() {
      console.log(this.logicActive)
      Object.values(this.logicActive).forEach((item, index) => {
        const tempOption = this.logicData.iOptions[index]
        if (tempOption && tempOption.hasOwnProperty(this.logicType)) {
          tempOption[this.logicType] = item.sort().join()
        }
      })
      this.dialogVisible = false

      this.saveQuestions()
    },
    // 11.取消逻辑编辑
    logicCancel() {
      this.logicActiveReset()
      this.dialogVisible = false
    },
    // 12.重置该题选项对应逻辑题
    logicActiveReset() {
      this.logicActive = {}
      this.logicData.iOptions.forEach((option, index) => {
        const tempData = option[this.logicType]
        const changeData = tempData ? tempData.split(',') : []
        // 注意这里需要通过观察数组对象，控制页面logic-active的渲染
        this.$set(this.logicActive, index, changeData)
      })
    },
    // 13.切换逻辑类型后重置所有选项之前逻辑
    logicAllReset() {
      this.questions.lists.forEach(list => {
        list.iOptions.forEach(option => {
          if (this.logicType === 'goto') {
            if (option.hasOwnProperty('display')) {
              option.display = ''
            }
          } else {
            if (option.hasOwnProperty('goto')) {
              option.goto = ''
            }
          }
        })
      })
    },
    // 14.切换逻辑类型前提问
    beforeToggle(activeName, oldActiveName) {
      let nextName, prevName
      this.logicTypeOptions.forEach(item => {
        if (item.value === activeName) {
          nextName = item.label
        }
        if (item.value === oldActiveName) {
          prevName = item.label
        }
      })
      return this.$confirm(`切换到 ${nextName} 逻辑设置后，问卷现有的 ${prevName} 逻辑设置将会失效，是否继续操作？`)
    },
    // 15.复制
    copyItem(item) {
      const len = this.questions.lists.length + 1
      const temp = deepClone(item)
      // 更新复制后的题iID
      temp.iID = `${len}`
      // temp.iID = `q_${len}`
      this.questions.lists.push(temp)

      this.saveQuestions()
      console.log('复制', temp)
    },
    // 16.删除
    delItem(item) {
      console.log(item)
      this.$confirm('此操作将永久删除，是否继续?', '温馨提示', {
        closeOnClickModal: false,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const tempInd = this.questions.lists.indexOf(item)
        if (tempInd !== -1) {
          this.$message({
            type: 'success',
            message: '删除成功!',
            duration: 1 * 1000,
            onClose: () => {
              this.updateDataEditor(tempInd)
              this.saveQuestions()
            }
          })
        } else {
          this.$message.info('操作有误，请稍后重试')
        }
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    // 17.创建富文本
    createEditor() {
      const that = this
      // 先摧毁
      Object.values(this.CKEDITOR.instances).forEach(instace => {
        instace.destroy()
      })
      // 再CKEDITOR初始化加载完毕
      this.CKEDITOR.domReady(
        // 创建行内富文本
        that.CKEDITOR.inlineAll()
      )
    },
    // 18.该题富文本设值
    setDataEditor(num) {
      this.$nextTick(() => {
        // 先存公用富文本值
        this.getDataEditor(num)
        // 再创建题目富文本
        this.createEditor()
        // 后赋值题目值
        Object.values(this.CKEDITOR.instances).forEach(instace => {
          let tempData
          const tempName = instace.name
          if (this.editorCom.indexOf(tempName) === -1) {
            tempData = this.editorData[num][tempName]
          } else {
            tempData = this.editorData[tempName]
          }
          if (tempData) {
            instace.setData(tempData, {
              callback: function() {
                this.checkDirty()
              }
            })
          }
        })
      })
    },
    // 19.更新该题预览
    setDataPreview(num) {
      const tempData = this.questions.lists[num - 1]
      const isAddInput = this.editorData[num][`${num}_addInput`]
      tempData.iTitle = this.editorData[num][`${num}_title`]
      tempData.iRemark = this.editorData[num][`${num}_remark`]
      // 处理当前题号ID
      if (!tempData.iID) {
        tempData.iID = `${num}`
        // tempData.iID = `q_${num}`
      }
      // 遍历处理选项
      tempData.iOptions.forEach((option, index) => {
        const temp = this.editorData[num][`${num}_${index + 1}`]
        if (!option.input && temp) {
          option.txt = temp
          option.value = this.questionLetters[index]
        }
      })
      // 若存在矩阵题
      if (tempData.iSubTitles) {
        tempData.iSubTitles.forEach((subtitle, index) => {
          const temp = this.editorData[num][`${num}_${index + 1}_subtitle`]
          if (temp) {
            subtitle.txt = temp
          }
        })
      }
      // 若含有其他项，则将其追加到选项中
      if (this.addInput[num] && isAddInput) {
        tempData.iOptions.push({
          'value': this.questionLetters[tempData.iOptions.length],
          'txt': isAddInput,
          'input': true,
          'placeholder': '请输入内容'
        })
      }
    },
    // 20.获取该题富文本值
    getDataEditor(num) {
      Object.values(this.CKEDITOR.instances).forEach(instace => {
        const tempName = instace.name
        if (this.editorCom.indexOf(tempName) === -1) {
          this.editorData[num][tempName] = instace.getData()
        } else {
          this.editorData[tempName] = instace.getData()
        }
      })
      console.log(this.editorData)
    },
    // 21.删除该题后更新富文本
    updateDataEditor(tempInd) {
      const len = this.questions.lists.length
      const tempNum = tempInd + 1
      for (let i = tempNum; i < len; i++) {
        const nextEditor = this.editorData[i + 1]
        this.editorData[i] = {}
        // 考虑复制题但未编辑创建该题富文本框时
        if (nextEditor) {
          Object.keys(this.editorData[i + 1]).forEach(key => {
            const newKey = key.replace(/^\d+/, i)
            this.editorData[i][newKey] = this.editorData[i + 1][key]
          })
        }
      }
      this.editorData[len] && delete this.editorData[len]
      this.questions.lists.splice(tempInd, 1)
      console.log(this.editorData)
    },
    // 22.创建矩阵题标题
    createSubtitle(num, subtitles) {
      console.log('添加问题')
      const len = subtitles.length
      const addEditorId = `${num}_${len + 1}_subtitle`
      subtitles.splice(len, 0, {'txt': '问题'})
      this.$nextTick(() => {
        this.CKEDITOR.inline(addEditorId)
      })
    },
    // 23.删除矩阵图标题
    delSubtitle(num, subtitles, ind) {
      console.log('删除问题')
      this.getDataEditor(num)
      const len = subtitles.length
      if (len <= 2) {
        this.$message.error('问题不得少于2个')
        return false
      }
      const removeEditorId = `${num}_${len}_subtitle`
      subtitles.splice(ind, 1)
      subtitles.forEach((subtitle, index) => {
        if (ind <= index) {
          const tempTitle = this.editorData[num][`${num}_${index + 2}_subtitle`]
          this.editorData[num][`${num}_${index + 1}_subtitle`] = tempTitle
          this.CKEDITOR.instances[`${num}_${index + 1}_subtitle`].setData(tempTitle, {
            callback: function() {
              this.checkDirty()
            }
          })
        }
      })
      delete this.editorData[num][removeEditorId]
      this.CKEDITOR.instances[removeEditorId].destroy()
    },
    // 24.创建选项
    createOption(num, options, tempType) {
      let addEditorId
      if (options) {
        let temp = {'txt': '选项'}
        const len = options.length
        addEditorId = `${num}_${len + 1}`
        switch (tempType) {
        case 'radio':
          temp = Object.assign({}, temp, {'display': '', 'goto': ''})
          break
        case 'checkbox':
          temp = Object.assign({}, temp, {'display': ''})
          break
        }
        options.push(temp)
      } else {
        if (this.addInput[num]) return false
        this.$set(this.addInput, num, true)
        addEditorId = `${num}_addInput`
      }
      this.$nextTick(() => {
        this.CKEDITOR.inline(addEditorId)
      })
    },
    // 25.删除选项
    delOption(num, options, ind) {
      this.getDataEditor(num)
      let removeEditorId
      if (ind > -1) {
        const len = options.length
        if (len <= 2) {
          this.$message.error('选项不得少于2个')
          return false
        }
        removeEditorId = `${num}_${len}`
        options.splice(ind, 1)
        options.forEach((option, index) => {
          if (ind <= index) {
            const tempTxt = this.editorData[num][`${num}_${index + 2}`]
            this.editorData[num][`${num}_${index + 1}`] = tempTxt
            this.CKEDITOR.instances[`${num}_${index + 1}`].setData(tempTxt, {
              callback: function() {
                this.checkDirty()
              }
            })
          }
        })
      } else {
        removeEditorId = `${num}_addInput`
        this.$set(this.addInput, num, false)
      }
      delete this.editorData[num][removeEditorId]
      this.CKEDITOR.instances[removeEditorId].destroy()
    },
    // 26.设值其他项校验规则
    ruleOther(num, other) {
      console.log('设置其他项规则')
      this.otherForm = other
      this.dialogOtherVisible = true
    },
    // 27.提交设定的其他项规则
    submitOtherForm() {
      console.log('提交其他项规则', this.otherForm)
      this.dialogOtherVisible = false
    },
    // 28.该题编辑完成
    confirmEditor(num) {
      console.log('确定', num)
      this.getDataEditor(num)
      this.setDataPreview(num)
      this.destoryEditor(num)
      this.saveQuestions()
    },
    // 29.该题取消编辑
    cancelEditor(num) {
      console.log('取消', num)
      if (this.viewCreate) {
        this.questions.lists.pop()
      } else {
        this.questions.lists[num - 1] = this.optionClone
        this.editorData[num] = this.editorClone
      }
      // 考虑添加其他项，但未保存情况，需要去除
      const isAddInput = this.editorData[num][`${num}_addInput`]
      if (!isAddInput) {
        this.$set(this.addInput, num, false)
      }
      this.destoryEditor(num)
    },
    // 30.摧毁该题富文本框
    destoryEditor(num) {
      this.viewEdit = false
      this.viewCreate = false
      this.$set(this.editorNum, num, false)
      Object.values(this.CKEDITOR.instances).forEach(instace => {
        const noDestory = instace.name
        if (this.editorCom.indexOf(noDestory) === -1) {
          instace.destroy()
        }
      })
    }
  },
  components: {
    draggable,
    Sticky
  },
  watch: {
    // 监听逻辑类型变化并重置
    logicType(val) {
      this.logicAllReset()
      this.logicActiveReset()
    }
  }
}
</script>

<style lang="scss">
.editor-topbar{
  padding: 10px;
  box-shadow: 0 2px 5px #f2f2f2;
  background-color: #e6e6e6;
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>

.logic-container{
  display: flex;
  height: 320px;
  .logic-left{
    width: 40%;
    background: #f5f5f5;
    border: 1px solid #ccc;
    border-right: none;
    padding: 10px;
    overflow-y: auto;
  }
  .logic-right{
    flex: 1;
    border: 1px solid #ccc;
    padding: 10px;
    overflow-y: auto;
  }
  .logic-item{
    li{
      cursor: pointer;
      &.logic-active{
        background: #84574c;
        color: #fff;
        margin-left: -10px;
        padding-left: 10px;
        margin-right: -10px;
      }
    }
  }
}

.editor-container, .options-item{
  position: relative;
}

.editor-topbar{
  .topbar-action{
    text-align: right;
  }
  .topbar-question{
    float: left;
    overflow: hidden;
    .type-item{
      height: 38px;
      cursor: pointer;
      padding: 0 20px;
      line-height: 38px;
      margin-right: 10px;
      border-radius: 5px;
      border: 1px solid #e0e0e0;
      background-color: #fff;
      text-align: center;
      float: left;
      &:hover{
        background-color: rgba(255,255,255,.8);
        color: #6b6666;
      }
    }
  }
}

.editor-main{
  margin-top: 40px;
  .survey-wrap{
    display: inline-block;
    position: relative;
    zoom: 1;
    width: 100%;
    min-width: 730px;
    line-height: 1.8em;
    vertical-align: middle;
    white-space: normal;
    border: 1px solid #dadada;
    background-color: #fff;
    padding: 30px 0 30px;
    font-size: 14px;
  }
  .inner{
    margin-left: auto;
    margin-right: auto;
    max-width: 1000px;
    padding: 0 20px;
  }
}

.survey-main{
  .survey-com{
    padding-top: 5px;
    padding-bottom: 5px;
    border-top: 1px solid transparent;
    border-bottom: 1px solid transparent;
    word-break: break-all;
    &:hover{
      background-color: #fafafa;
      border-top: 1px solid #e0e0e0;
      border-bottom: 1px solid #e0e0e0;
      .com-content{
        background: #fff;
        border: 1px solid #e0e0e0;
        margin-left: -10px;
        margin-right: -10px;
        padding-left: 9px;
        padding-right: 9px;
      }
    }
  }
  .com-content{
    padding: 10px 0;
    font-size: 14px;
    color: #333333;
    font-weight: normal;
    word-break: break-word;
    border-top: 1px solid transparent;
    border-bottom: 1px solid transparent;
  }
  .title-content{
    font-size: 24px;
  }
  .suffix-content{
    margin-top: 80px;
  }
  .title-txt, .options-txt{
    color: #333333;
    font-size: 14px;
  }
}

.survey-question{
  .inline-editor{
    padding: 0 10px;
    min-height: 36px;
    line-height: 36px;
    background: #fff;
    border: 1px solid #e0e0e0;
    display: inline-block;
    width: 100%;
  }
  .preview-question{
    border-top: 1px solid transparent;
    border-bottom: 1px solid transparent;
    padding-top: 20px;
    position: relative;
    zoom: 1;
    overflow: hidden;
    cursor: move;
    &.not-move{
      cursor: default;
    }
    &:hover{
      background-color: #fafafa;
      border-top: 1px solid #e0e0e0;
      border-bottom: 1px solid #e0e0e0;
      .control{
        transform: translateX(0);
      }
    }
    .inner{
      min-height: 160px;
    }
    .title{
      overflow: hidden;
      padding-bottom: 10px;
      .required{
        font-weight: 700;
        color: #f00;
        margin-left: 5px;
      }
    }
    .remark{
      font-size: 12px;
      padding-bottom: 10px;
    }
    .options-type{
      position: absolute;
      left: 0px;
      top: 5px;
      width: 14px;
      height: 14px;
    }
    .options-txt{
      display: block;
      padding-left: 20px;
    }
    .options-value{
      margin-right: 5px;
    }
    .options-tip{
      color: #999;
    }
    .options-input{
      resize: none;
      outline: none;
      box-sizing: border-box;
      width: 100%;
      padding-top: 5px;
      padding-bottom: 5px;
      padding-left: 15px;
      padding-right: 15px;
      border-radius: 8px;
    }
    .mask-control{
      z-index: 1;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }
    .control{
      position: absolute;
      z-index: 1;
      top: 0;
      right: 0;
      bottom: 0;
      width: 58px;
      background-color: #f5f5f5;
      border-left: 1px solid #e0e0e0;
      transform: translateX(60px);
      transition: transform 0.2s;
      ul{
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 100%;
        .control-btn{
          display: block;
          height: 42px;
          line-height: 42px;
          text-align: center;
          cursor: pointer;
          &:hover{
            background-color: #479de6;
            color: #fff;
          }
        }
      }
    }
  }
}

.editor-question{
  background-color: #fafafa;
  border-top: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
  .row{
    margin-top: 10px;
    margin-bottom: 10px;
    .row-title{
      float: left;
      width: 40px;
      height: 36px;
      line-height: 36px;
      word-break: break-all;
    }
    .row-content{
      margin-left: 40px;
      min-height: 36px;
      line-height: 36px;
      word-break: break-all;
      overflow: hidden;
      .matrix-subtitles, .matrix-options{
        width: 50%;
        float: left;
      }
    }
  }
  .list-item{
    position: relative;
    overflow: hidden;
    zoom: 1;
    margin: 3px 0 3px 0;
    font-size: 14px;
    line-height: 1.8em;
    .option-input-wrap{
      width: 80%;
      float: left;
    }
    .btn-del-option{
      color: #999999;
      cursor: pointer;
      float: left;
      position: relative;
      top: 8px;
      z-index: 1;
      &>span{
        margin-left: 5px;
      }
    }
  }
  .add-option{
    border: 1px dashed #e0e0e0;
    padding: 6px 10px;
    background: #fafafa;
    color: #b2b2b2;
    cursor: pointer;
  }
}

</style>

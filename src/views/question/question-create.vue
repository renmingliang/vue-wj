<template>
  <div class="editor-container">
    <sticky className="editor-topbar" :stickyTop="100">
      <div class="topbar-question">
        <ul>
          <li
            class="type-item"
            v-for="type in questionsType"
            :key="type.id">
            <span @click="createItem(type)">{{type.iTitle}}</span>
          </li>
        </ul>
      </div>
      <div class="topbar-action">
        <el-button-group>
          <el-button type="primary" icon="el-icon-arrow-left">返回</el-button>
          <el-button type="primary">保存至草稿箱</el-button>
          <el-button @click="saveQuestions" type="primary" icon="el-icon-view">预览</el-button>
        </el-button-group>
      </div>
    </sticky>

    <div class="editor-main" v-loading="loading">
      <div class="survey-wrap">
        <div class="survey-main">
          <div class="survey-com">
            <div class="inner text-center">
              <h1 id="title" class="com-content title-content" contenteditable=true>
                {{questions.title}}
              </h1>
            </div>
          </div>
          <div class="survey-com">
            <div class="inner">
              <div id="prefix" class="com-content" contenteditable=true>
                {{questions.prefix}}
              </div>
            </div>
          </div>
          <div class="survey-question">
            <draggable
              element="ul"
              v-model="questions.lists"
              :options="{ group: 'editor', disabled: isEdit }"
              @end="dragItem">
              <li
                v-for="(list, index) in questions.lists"
                :key="index">
                <template v-if="editorNum[index+1]">
                  <div
                    class="editor-question"
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
                                @click="createOption(index+1, list.iOptions)">新建选项</span>
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
                                  @click="createOption(index+1, list.iOptions)">新建选项</span>
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
                  <div class="preview-question" :key="`${index + 1}-preview`">
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
                              :type="list.iType"
                              :value="option.value">
                              <label class="options-txt clearfix">
                                <span class="options-value float-left">{{option.value}}</span>
                                <div v-html="option.txt" class="float-left"></div>
                              </label>
                              <div class="options-tip">
                                <template v-if="logicType === 'display'">
                                  <span v-if="option.display">
                                    选择后显示：<b>题目{{option.display}}</b>
                                  </span>
                                </template>
                                <template v-else>
                                  <span v-if="option.goto">
                                    选择后跳转到：<b>第{{option.goto}}题</b>
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
                                    v-for="(subtitle, i) in list.iSubTitles"
                                    :key="i">
                                    <td v-html="subtitle.txt"></td>
                                    <td
                                      class="text-center"
                                      v-for="(option, ind) in list.iOptions"
                                      :key="ind">
                                        <input
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
                                :maxlength="list.iMaxlength"
                                :placeholder="option.placeholder"
                                rows="3"
                                ></textarea>
                            </div>
                          </template>
                        </div>
                      </div>
                      <div @click="enterItem(index+1)" class="mask-control"></div>
                      <div class="control">
                        <ul>
                          <li @click="enterItem(index+1)" class="control-btn">编辑</li>
                          <li @click="logicItem(list)" class="control-btn">逻辑</li>
                          <li @click="copyItem(list)" class="control-btn">复制</li>
                          <li @click="delItem(list)" class="control-btn">删除</li>
                        </ul>
                      </div>
                  </div>
                </template>
              </li>
            </draggable>
          </div>
          <div class="survey-com suffix-content">
            <div class="inner">
              <div id="suffix" class="com-content" contenteditable=true>
                {{questions.suffix}}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      title="填空设置"
      :visible.sync="dialogOtherVisible"
      center
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

    <el-dialog title="逻辑设置" :visible.sync="dialogVisible">
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
                    @click="handleDisplay(option, index)"
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
                    @click="toggleDisplay(list, $event)"
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
                    @click="handleDisplay(option, index)"
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
                    @click="toggleDisplay(list, $event)"
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
import { deepClone } from '@/utils'
import draggable from 'vuedraggable'

export default {
  name: 'question-create',
  data() {
    return {
      isEdit: false,
      isCreate: false,
      loading: false,
      dialogVisible: false,
      dialogOtherVisible: false,
      logicType: 'display',
      logicIndex: '',
      logicActive: {},
      logicData: {},
      otherForm: {},
      addInput: {},
      editorNum: {},
      editorData: {},
      editorClone: null,
      optionClone: null,
      editorCom: ['title', 'prefix', 'suffix'],
      questionsType: [
        {
          iCode: 1,
          iFrom: '',
          iType: 'radio',
          iTitle: '单选题',
          iRequired: true,
          iRuleOther: {
            'maxlength': '',
            'required': false
          },
          iOptions: [
            {
              'txt': '选项',
              'goto': '',
              'display': ''
            },
            {
              'txt': '选项',
              'goto': '',
              'display': ''
            }
          ]
        },
        {
          iCode: 2,
          iFrom: '',
          iType: 'checkbox',
          iTitle: '多选题',
          iMaxlength: '',
          iRequired: true,
          iRuleOther: {
            'maxlength': '',
            'required': false
          },
          iOptions: [
            {
              'txt': '选项',
              'display': ''
            },
            {
              'txt': '选项',
              'display': ''
            }
          ]
        },
        {
          iCode: 3,
          iFrom: '',
          iType: 'textarea',
          iTitle: '填空题',
          iMaxlength: '',
          iRequired: true,
          iOptions: [
            {
              'placeholder': '请输入内容'
            }
          ]
        },
        {
          iCode: 4,
          iFrom: '',
          iType: 'matrix_radio',
          iTitle: '矩阵单选题',
          iRequired: true,
          iSubTitles: [
            {
              'txt': '问题'
            },
            {
              'txt': '问题'
            }
          ],
          iOptions: [
            {
              'txt': '选项'
            },
            {
              'txt': '选项'
            }
          ]
        },
        {
          iCode: 5,
          iFrom: '',
          iType: 'matrix_checkbox',
          iTitle: '矩阵多选题',
          iRequired: true,
          iSubTitles: [
            {
              'txt': '问题'
            },
            {
              'txt': '问题'
            }
          ],
          iOptions: [
            {
              'txt': '选项'
            },
            {
              'txt': '选项'
            }
          ]
        }
      ],
      questionsLetters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'],
      questions: {
        title: '问卷标题',
        prefix: '问卷描述及其目的',
        suffix: '问卷提交成功文本',
        lists: []
      }
    }
  },
  computed: {
    CKEDITOR() {
      return window.CKEDITOR
    }
  },
  created() {
    this.initCKEditor()
  },
  destroyed() {
    this.destoryCKEditor()
  },
  methods: {
    // 初始化公用富文本框
    initCKEditor() {
      this.$nextTick(() => {
        this.editorCom.forEach(item => {
          this.CKEDITOR.inline(item)
        })
      })
    },
    // 摧毁所有富文本框
    destoryCKEditor() {
      Object.values(this.CKEDITOR.instances).forEach(instace => {
        instace.destroy()
      })
    },
    // 拖拽结束
    dragItem(evt) {
      const oldNum = evt.oldIndex + 1
      const newNum = evt.newIndex + 1
      const tempObj = {}

      // 复制当前拖拽的题
      Object.keys(this.editorData[oldNum]).forEach(key => {
        const newKey = key.replace(/^\d+/, newNum)
        tempObj[newKey] = this.editorData[oldNum][key]
      })

      // 判断拖拽前后两者间的索引值大小，并更新数据
      if (oldNum < newNum) {
        for (let i = oldNum; i < newNum; i++) {
          this.editorData[i] = {}
          Object.keys(this.editorData[i + 1]).forEach(key => {
            const newKey = key.replace(/^\d+/, i)
            this.editorData[i][newKey] = this.editorData[i + 1][key]
          })
        }
      } else {
        for (let i = oldNum; i > newNum; i--) {
          this.editorData[i] = {}
          Object.keys(this.editorData[i - 1]).forEach(key => {
            const newKey = key.replace(/^\d+/, i)
            this.editorData[i][newKey] = this.editorData[i - 1][key]
          })
        }
      }

      // 更新后的位置
      this.editorData[newNum] = tempObj
      console.log(this.editorData)
    },
    createItem(item) {
      if (this.isCreate || this.isEdit) {
        return false
      }
      this.isCreate = true
      const num = this.questions.lists.length + 1
      const temp = deepClone(item)
      this.questions.lists.push(temp)
      this.enterItem(num)
    },
    enterItem(num) {
      if (this.isEdit) {
        return false
      }
      console.log('进入编辑', num)
      this.isEdit = true
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
    logicItem(item) {
      this.logicData = item
      // 默认处理第一项
      this.logicChange()
      this.dialogVisible = true
      console.log('逻辑设置', item)
    },
    logicChange(index) {
      const tempInd = index || 0
      this.logicIndex = tempInd
      // 临时保存逻辑题数据
      if (!this.logicActive[tempInd]) {
        const tempData = this.logicData.iOptions[tempInd][this.logicType]
        const changeData = tempData ? tempData.split(',') : []
        // 注意这里需要修改为观察数据格式，控制页面logic-active的渲染
        this.$set(this.logicActive, tempInd, changeData)
      }
    },
    handleDisplay(val, index) {
      console.log(val, index)
      this.logicChange(index)
    },
    toggleDisplay(item, e) {
      console.log(item, e)
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
          this.logicActive[this.logicIndex].push(tempID)
        } else {
          // 跳题默认只能选一项
          this.logicActive[this.logicIndex][0] = tempID
        }
      }
    },
    logicConfirm() {
      console.log(this.logicActive)
      Object.values(this.logicActive).forEach((item, index) => {
        this.logicData.iOptions[index][this.logicType] = item.join()
      })
      this.dialogVisible = false
    },
    logicCancel() {
      this.logicReset()
      this.dialogVisible = false
    },
    logicReset() {
      // 重置清空
      Object.keys(this.logicActive).forEach(key => {
        this.$set(this.logicActive, key, [])
      })
    },
    beforeToggle(activeName, oldActiveName) {
      return this.$confirm(`切换到${activeName}逻辑设置后，问卷现有的${oldActiveName}逻辑设置将会失效，是否继续操作？`)
    },
    copyItem(item) {
      console.log('复制', item)
      const temp = deepClone(item)
      this.questions.lists.push(temp)
    },
    delItem(item) {
      this.$confirm('此操作将永久删除，是否继续?', '温馨提示', {
        closeOnClickModal: false,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const id = item.id
        const tempInd = this.questions.lists.indexOf(item)
        // 未录入提交到后台的情况下删除，不发生请求
        if (!id && tempInd !== -1) {
          this.updateDataEditor(tempInd)
          return false
        } else {
          // 已有id情况，发送删除请求
          this.loading = true
          setTimeout(() => {
            if (tempInd !== -1) {
              this.updateDataEditor(tempInd)
            }
            this.loading = false
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }, 1000)
          /* this.$store.dispatch('IP_RIGHT_DELETE', { id })
            .then(res => {
              if (tempInd !== -1) {
                this.questions.lists.splice(tempInd, 1)
              }
              this.loading = false
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            })
            .catch(() => {
              this.loading = false
            }) */
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    saveQuestions() {
      console.log('保存', this.questions)
    },
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
    setDataPreview(num) {
      const tempData = this.questions.lists[num - 1]
      const isAddInput = this.editorData[num][`${num}_addInput`]
      tempData.iTitle = this.editorData[num][`${num}_title`]
      tempData.iRemark = this.editorData[num][`${num}_remark`]
      // 处理当前题号ID
      if (!tempData.iID) {
        tempData.iID = `q_${num}`
      }
      // 遍历处理选项
      tempData.iOptions.forEach((option, index) => {
        const temp = this.editorData[num][`${num}_${index + 1}`]
        if (!option.input && temp) {
          option.txt = temp
          option.value = this.questionsLetters[index]
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
          'value': this.questionsLetters[tempData.iOptions.length],
          'txt': isAddInput,
          'input': true,
          'placeholder': '请输入内容'
        })
      }
    },
    getDataEditor(num) {
      Object.values(this.CKEDITOR.instances).forEach(instace => {
        const tempName = instace.name
        if (this.editorCom.indexOf(tempName) === -1) {
          this.editorData[num][tempName] = instace.getData()
        } else {
          this.editorData[tempName] = instace.getData()
          this.questions[tempName] = instace.getData()
        }
      })
      console.log(this.editorData)
    },
    updateDataEditor(tempInd) {
      const len = this.questions.lists.length
      const tempNum = tempInd + 1
      for (let i = tempNum; i < len; i++) {
        this.editorData[i] = {}
        Object.keys(this.editorData[i + 1]).forEach(key => {
          const newKey = key.replace(/^\d+/, i)
          this.editorData[i][newKey] = this.editorData[i + 1][key]
        })
      }
      delete this.editorData[len]
      this.questions.lists.splice(tempInd, 1)
      console.log(this.editorData)
    },
    createSubtitle(num, subtitles) {
      console.log('添加问题')
      const len = subtitles.length
      const addEditorId = `${num}_${len + 1}_subtitle`
      subtitles.splice(len, 0, {'txt': '问题'})
      this.$nextTick(() => {
        this.CKEDITOR.inline(addEditorId)
      })
    },
    delSubtitle(num, subtitles, ind) {
      console.log('删除问题')
      const len = subtitles.length
      const removeEditorId = `${num}_${len}_subtitle`
      subtitles.splice(ind, 1)
      subtitles.forEach((subtitle, index) => {
        if (ind <= index) {
          this.editorData[num][`${num}_${index + 1}_subtitle`] = subtitle.txt
          this.CKEDITOR.instances[`${num}_${index + 1}_subtitle`].setData(subtitle.txt, {
            callback: function() {
              this.checkDirty()
            }
          })
        }
      })
      delete this.editorData[num][removeEditorId]
      this.CKEDITOR.instances[removeEditorId].destroy()
    },
    createOption(num, options) {
      let addEditorId
      if (options) {
        console.log('添加选项')
        const len = options.length
        addEditorId = `${num}_${len + 1}`
        options.push({'txt': '选项'})
      } else {
        console.log('添加其他')
        if (this.addInput[num]) return false
        this.$set(this.addInput, num, true)
        addEditorId = `${num}_addInput`
      }
      this.$nextTick(() => {
        this.CKEDITOR.inline(addEditorId)
      })
    },
    delOption(num, options, ind) {
      let removeEditorId
      if (ind > -1) {
        console.log('删除该选项')
        const len = options.length
        removeEditorId = `${num}_${len}`
        options.splice(ind, 1)
        options.forEach((option, index) => {
          if (ind <= index) {
            this.editorData[num][`${num}_${index + 1}`] = option.txt
            this.CKEDITOR.instances[`${num}_${index + 1}`].setData(option.txt, {
              callback: function() {
                this.checkDirty()
              }
            })
          }
        })
      } else {
        console.log('删除其他项')
        removeEditorId = `${num}_addInput`
        this.$set(this.addInput, num, false)
      }
      delete this.editorData[num][removeEditorId]
      this.CKEDITOR.instances[removeEditorId].destroy()
    },
    ruleOther(num, other) {
      console.log('设置其他项规则')
      this.otherForm = other
      this.dialogOtherVisible = true
    },
    submitOtherForm() {
      console.log('提交其他项规则', this.otherForm)
      this.dialogOtherVisible = false
    },
    confirmEditor(num) {
      console.log('确定', num)
      this.getDataEditor(num)
      this.setDataPreview(num)
      this.destoryEditor(num)
    },
    cancelEditor(num) {
      console.log('取消', num)
      if (this.isCreate) {
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
    destoryEditor(num) {
      this.isEdit = false
      this.isCreate = false
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
      this.logicReset()
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

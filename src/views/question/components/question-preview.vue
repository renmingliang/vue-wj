<template>
  <div class="editor-container">

    <div class="editor-main">
      <div class="survey-wrap">
        <div class="survey-main">
          <div class="survey-com">
            <div class="inner text-center">
              <h1 class="com-content title-content" v-html="title"></h1>
            </div>
          </div>
            <template v-if="question.lists">
              <div class="survey-question">
                <ul>
                  <li
                    v-for="(list, num) in question.lists"
                    v-show="logicDisplay[list.iID] !== 0"
                    :id="`q${num+1}`"
                    :key="num">
                      <div class="preview-question" :key="`${num + 1}-preview`">
                        <div class="inner">
                          <div class="title" :class="list.iRequired ?'required':''">
                            <span class="float-left">{{num + 1}}.</span>
                            <h3 v-html="list.iTitle" class="title-txt"></h3>
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
                                  :disabled="isAnswer"
                                  :type="list.iType"
                                  :name="`q${num+1}`"
                                  :id="`q${num+1}_${ind+1}`"
                                  :value="option.value"
                                  @change="changeItem(num, option, ind, $event)">
                                <label class="options-txt clearfix" :for="`q${num+1}_${ind+1}`">
                                  <span class="options-value float-left">{{option.value}}</span>
                                  <div v-html="option.txt"></div>
                                </label>
                                <textarea
                                  class="options-input"
                                  v-if="option.input && (addInput[num+1] || tempInput[num+1])"
                                  v-model="tempInput[num+1]"
                                  :disabled="isAnswer"
                                  :name="`q${num+1}_addInput`"
                                  :id="`q${num+1}_addInput`"
                                  :maxlength="list.iRuleOther.maxlength"
                                  :placeholder="`${option.placeholder}（不得超过${list.iRuleOther.maxlength}字）`"
                                  @focus="focusKeyBorad"
                                  rows="3"
                                  ></textarea>
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
                                            :disabled="isAnswer"
                                            :id="`q${num+1}_${index+1}_${ind+1}`"
                                            :name="`q${num+1}_${index+1}`"
                                            :type="list.iType.split('_')[1]"
                                            :value="option.value"
                                            @change="changeItem(num, option, index, $event)">
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
                                  v-model="answer[num+1]"
                                  :disabled="isAnswer"
                                  :name="`q${num+1}`"
                                  :id="`q${num+1}_${ind+1}`"
                                  :placeholder="`${option.placeholder}（不得超过${list.iMaxlength}字）`"
                                  @focus="focusKeyBorad"
                                  rows="3"
                                  ></textarea>
                              </div>
                            </template>
                          </div>
                        </div>
                      </div>
                  </li>
                </ul>
              </div>
              <div v-if="isSubmit && question.lists" class="text-center">
                <el-button type="primary" @click="submitAnswer">提交</el-button>
              </div>
            </template>
          </div>
      </div>
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'question-preview',
  props: {
    isAnswer: {
      type: Boolean,
      default: false
    },
    isSubmit: {
      type: Boolean,
      default: false
    },
    id: [String, Number]
  },
  data() {
    return {
      title: '',
      logicType: '',
      logicDisplay: {},
      logicGoto: {},
      addInput: {}, // 选择其他需要输入
      question: {}, // 问卷题库
      answerDetail: {}
    }
  },
  computed: {
    ...mapGetters([
      'questionLetters'
    ]),
    // 问卷题目id集合
    ids () {
      return this.question.lists.map(list => list.iID)
    },
    // 答案
    answer () {
      const computedAnswer = {}
      this.question.lists.forEach((item, index) => {
        const tempType = item.iType
        // 1.2类型checkbox
        if (tempType === 'checkbox' || tempType.split('_')[0] === 'matrix') {
          computedAnswer[index + 1] = []
        } else {
          // 1.3类型其他
          computedAnswer[index + 1] = ''
        }
      })
      return computedAnswer
    },
    // 选择其他输入的值
    tempInput() {
      const computedInput = {}
      this.question.lists.forEach((item, index) => {
        // 1.1设置选择其他 --> 手动填写
        item.iOptions.forEach((option) => {
          if (option.input) {
            computedInput[index + 1] = ''
          }
        })
      })
      return computedInput
    }
  },
  created() {
    if (this.isAnswer) {
      this.fetchAnswerPreview()
    } else {
      this.fetchPreview()
    }
  },
  methods: {
    // 1.1.获取问卷数据
    fetchPreview() {
      // 获取问卷标题
      this.$store.dispatch('QUESTION_FETCH_DETAIL', {question_id: this.id})
        .then(res => {
          const {title} = res.data
          this.title = title || ''
        })
      // 获取问题详情
      this.$store.dispatch('QUESTION_ORIGIN_DETAIL', {question_id: this.id})
        .then(res => {
          const tempQ = JSON.parse(res.data)
          this.question = tempQ || {}
          console.log(this.question)
          this.logicType = tempQ && tempQ.logicType ? tempQ.logicType : 'display'

          // 显示逻辑
          if (this.logicType === 'display') {
            this.question.lists.forEach(list => {
              list.iOptions.forEach((option) => {
                const temp = option.display ? option.display.split(',') : []
                temp.forEach(id => {
                  this.$set(this.logicDisplay, id, 0)
                })
              })
            })
          } else {
          // 跳题逻辑
            this.question.lists.forEach((list, index) => {
              const isRadio = list.iType === 'radio'
              list.iOptions.forEach((option) => {
                if (isRadio && option.goto) {
                  this.$set(this.logicGoto, option.goto, 0)
                  const tempInd = this.ids.indexOf(option.goto)
                  const temp = this.ids.filter((id, i) => index < i && i <= tempInd)
                  temp.forEach(id => {
                    this.$set(this.logicDisplay, id, 0)
                  })
                }
              })
            })
            console.log(this.logicDisplay)
          }
        })
    },
    // 1.2.获取问题答题详情
    fetchAnswerPreview() {
      this.$store.dispatch('QUESTION_ANSWER_DETAIL', {paper_id: this.id})
        .then(res => {
          const { question, answer, title } = res.data
          const tempQ = JSON.parse(question)
          const tempA = JSON.parse(answer)
          this.title = title || ''
          this.question = tempQ
          this.answerDetail = tempA.answer
          this.setPreviewAnswer()
        })
    },
    // 1.3.处理后台返回答卷格式
    setPreviewAnswer() {
      console.log(this.answerDetail)
      Object.values(this.answerDetail).forEach((item, index) => {
        const temp = `q${index + 1}`
        const { type, checked, input } = item
        // 若该题为空，则跳过
        if (type !== 3 && !checked.length) return false
        switch (type) {
        // 单选框
        case 1:
          const ind = this.questionLetters.indexOf(checked)
          const checkeds_1 = [{ val: checked, ind }]
          this.setChecked(temp, checkeds_1)
          // 存在输入框
          if (input) {
            this.tempInput[index + 1] = input
          }
          break
        // 多选框
        case 2:
          const checkeds_2 = checked.map(val => {
            const ind = this.questionLetters.indexOf(val)
            return { val, ind }
          })
          this.setChecked(temp, checkeds_2)
          // 存在输入框
          if (input) {
            this.tempInput[index + 1] = input
          }
          break
        // 填空题
        case 3:
          this.answer[index + 1] = input
          break
        // 矩阵单选题
        case 4:
          checked.forEach(item => {
            const arr = item.split(':')
            const num = arr[0]
            const val = arr[1]
            const ind = this.questionLetters.indexOf(val)
            const checkeds_4 = [{ val, ind }]
            this.setChecked(`${temp}_${num}`, checkeds_4)
          })
          break
        // 矩阵多选题
        case 5:
          checked.forEach(item => {
            const arr = item.split(':')
            const num = arr[0]
            const valArr = arr[1].split(',')
            const checkeds_5 = valArr.map(val => {
              const ind = this.questionLetters.indexOf(val)
              return { val, ind }
            })
            this.setChecked(`${temp}_${num}`, checkeds_5)
          })
          break
        }
      })
    },
    // 1.4.设置该题选中项
    setChecked (name, checkeds) {
      this.$nextTick(() => {
        let eles = document.getElementsByName(name)
        checkeds.forEach(item => {
          eles[item.ind].checked = true
        })
      })
    },
    // 2.提交答卷
    submitAnswer() {
      // 2.1暂存答案变量
      const tempAnswer = this.answer
      // 2.2校验答题情况
      for (let [key, val] of Object.entries(tempAnswer)) {
        // 2.0题目编号
        const tempNum = key
        const isAddInput = this.addInput[key]
        const AddInputValue = this.tempInput[key]
        const tempQ = this.question.lists[key - 1]
        const tempID = tempQ.iID
        const isRequired = tempQ.iRequired
        let jumpStatus = false
        let checkTips = ''

        // 2.2.1是否隐藏题
        if (this.logicDisplay[tempID] !== 0) {
          const isMatrix = tempQ.iType.indexOf('matrix') !== -1
          if (isRequired && (val.length === 0 || (isMatrix && val.length < tempQ.iSubTitles.length))) {
            // 2.2.2必答题
            checkTips = `请完成第${tempNum}题`
            jumpStatus = true
          } else if (isAddInput) {
            const {maxlength, required} = tempQ.iRuleOther
            // 2.2.3其他项时输入框
            if (required && AddInputValue === '') {
              // 必填
              checkTips = `第${tempNum}题的其他选项需填写哦~`
              jumpStatus = true
            } else if (AddInputValue.length > maxlength) {
              // 限制长度
              checkTips = `第${tempNum}题输入过长，不得超过${maxlength}字`
              jumpStatus = true
            }
          } else if (val.length > tempQ.iMaxlength && tempQ.iMaxlength) {
          // 2.2.4限定输入框字符长度不得超过iMaxlength
            checkTips = `第${tempNum}题输入过长，不得超过${tempQ.iMaxlength}字`
            jumpStatus = true
          }
          // 2.2.5跳至不符合条件题目
          if (jumpStatus) {
            this.$message.warning(checkTips)
            this.jump(`#q${key}`)
            return false
          }
        }
      }

      console.log(this.answer)

      // 2.3验证通过，假提交
      this.$message.success('逻辑验证成功，可返回保存问卷至草稿箱')
    },
    // 3.处理选项
    changeItem(num, option, ind, e) {
      const id = num + 1
      const beforeValue = this.answer[id]
      const tempQ = this.question.lists[num]
      const tempType = tempQ.iType.split('_')[0]
      const tempOption = tempQ.iType.split('_')[1]

      // 3.0选项答案处理 -- 复选框
      if (tempType === 'checkbox') {
        const beforeIndex = beforeValue.indexOf(option.value)
        if (beforeIndex !== -1) {
          this.answer[id].splice(beforeIndex, 1)
        } else {
          this.answer[id].push(option.value)
        }
      } else if (tempType === 'matrix') {
        const tempNum = String(ind + 1)
        // 当前已操作的子选项索引集合
        const numAll = beforeValue.map(str => {
          const i = str.indexOf(':')
          return str.substr(0, i)
        })
        // 若已有值
        if (numAll.includes(tempNum)) {
          beforeValue.forEach((str, i) => {
            const itemNum = str.split(':')[0]
            const itemValue = str.split(':')[1].split(',')
            if (itemNum === tempNum) {
              const beforeIndex = itemValue.indexOf(option.value)
              if (tempOption === 'checkbox') {
                if (beforeIndex !== -1) {
                  itemValue.splice(beforeIndex, 1)
                } else {
                  itemValue.push(option.value)
                }
              } else {
                itemValue[0] = option.value
              }

              // 若该子问题选项不为空
              if (itemValue.length) {
                const tempVal = `${tempNum}:${itemValue.sort().join()}`
                this.answer[id][i] = tempVal
              } else {
              // 若为空，去除该子题选项数据
                this.answer[id].splice(i, 1)
              }
            }
          })
        } else {
        // 若没有
          const tempVal = `${tempNum}:${option.value}`
          this.answer[id].push(tempVal)
        }
      } else {
        // 类型其他
        this.answer[id] = option.value
      }

      const selectValue = this.answer[id]
      // 3.1其他项选择 -- 是否隐藏输入框
      tempQ.iOptions.forEach((ele) => {
        if (ele.input) {
          const inputValue = ele.value
          // 3.1.1利用vm.set来监听对象数据变化
          if (selectValue.indexOf(inputValue) !== -1) {
            this.$set(this.addInput, id, true)
            // 若选择其他输入项，触发聚焦事件
            const otherID = `q${id}_addInput`
            // 处理未选择前获取输入框元素DOM
            const otherInputDOM = document.getElementById(otherID)
            // 若元素不存在则执行
            if (!otherInputDOM) {
              this.$nextTick(() => {
                document.getElementById(otherID).focus()
              })
            }
          } else {
            this.$set(this.addInput, id, false)
          }
        }
      })

      // 3.2逻辑控制 -- 显示
      if (this.logicType === 'display') {
        const tempD = option.display ? option.display.split(',') : []
        // 3.2.1包含该选项
        if (selectValue.indexOf(option.value) !== -1) {
          tempD.forEach(d => { this.logicDisplay[d]++ })
          // 3.2.1.1单选框需要排他-- 注意只需处理上次选择的项
          if (beforeValue && tempType === 'radio') {
            tempQ.iOptions.forEach(ele => {
              // 非上次选择的值，结束终止
              if (beforeValue !== ele.value) return false
              // 其他选项
              const eleD = ele.display ? ele.display.split(',') : []
              eleD.forEach(d => {
                this.logicDisplay[d] > 0 && this.logicDisplay[d]--

                const i = this.ids.indexOf(d)
                if (!this.logicDisplay[d]) {
                  // -- 处理子项逻辑
                  const childAnswer = this.answer[i + 1]
                  // 若逻辑题已选择
                  if (childAnswer.length) {
                    this.question.lists[i].iOptions.forEach(o => {
                      // 当前题是否选中此选项
                      if (childAnswer.indexOf(o.value) !== -1) {
                        // 该项一级控制题
                        const tempK = o.display ? o.display.split(',') : []
                        tempK.forEach(k => {
                          this.logicDisplay[k] > 0 && this.logicDisplay[k]--
                          if (!this.logicDisplay[k]) {
                            const kNum = this.ids.indexOf(k) + 1
                            this.answer[kNum] = Array.isArray(this.answer[kNum]) ? [] : ''
                            this.removeChecked(`q${kNum}`)
                          }
                        })
                        // 子孙题控制
                        const childLogic = o.childId ? o.childId.split(',') : []
                        childLogic.forEach(c => {
                          this.logicDisplay[c] > 0 && this.logicDisplay[c]--
                          if (!this.logicDisplay[c]) {
                            const cNum = this.ids.indexOf(c) + 1
                            this.answer[cNum] = Array.isArray(this.answer[cNum]) ? [] : ''
                            this.removeChecked(`q${cNum}`)
                          }
                        })
                      }
                    })
                  }

                  // -- 重置答案
                  const tempNum = i + 1
                  const tempItemType = this.question.lists[i].iType
                  this.answer[tempNum] = Array.isArray(this.answer[tempNum]) ? [] : ''
                  if (tempItemType.indexOf('matrix') !== -1) {
                    this.question.lists[i].iSubTitles.forEach((s, n) => {
                      this.removeChecked(`q${tempNum}_${n + 1}`)
                    })
                  } else {
                    this.removeChecked(`q${tempNum}`)
                  }
                }
              })
            })
          }
        } else {
        // 3.2.2不含该选项
          tempD.forEach(d => {
            // 直接一级控制题情况
            this.logicDisplay[d] > 0 && this.logicDisplay[d]--

            const i = this.ids.indexOf(d)
            // 若逻辑题隐藏
            if (!this.logicDisplay[d]) {
              // -- 处理子项逻辑
              const childAnswer = this.answer[i + 1]
              // 若逻辑题已选择
              if (childAnswer.length) {
                this.question.lists[i].iOptions.forEach(o => {
                  // 当前题是否选中此选项
                  if (childAnswer.indexOf(o.value) !== -1) {
                    // 该项一级控制题
                    const tempK = o.display ? o.display.split(',') : []
                    tempK.forEach(k => {
                      this.logicDisplay[k] > 0 && this.logicDisplay[k]--
                      if (!this.logicDisplay[k]) {
                        const kNum = this.ids.indexOf(k) + 1
                        this.answer[kNum] = Array.isArray(this.answer[kNum]) ? [] : ''
                        this.removeChecked(`q${kNum}`)
                      }
                    })
                    // 子孙题控制
                    const childLogic = o.childId ? o.childId.split(',') : []
                    childLogic.forEach(c => {
                      this.logicDisplay[c] > 0 && this.logicDisplay[c]--
                      if (!this.logicDisplay[c]) {
                        const cNum = this.ids.indexOf(c) + 1
                        this.answer[cNum] = Array.isArray(this.answer[cNum]) ? [] : ''
                        this.removeChecked(`q${cNum}`)
                      }
                    })
                  }
                })
              }

              // -- 重置答案
              const dNum = i + 1
              const tempItemType = this.question.lists[i].iType
              this.answer[dNum] = Array.isArray(this.answer[dNum]) ? [] : ''
              if (tempItemType.indexOf('matrix') !== -1) {
                this.question.lists[i].iSubTitles.forEach((s, n) => {
                  this.removeChecked(`q${dNum}_${n + 1}`)
                })
              } else {
                this.removeChecked(`q${dNum}`)
              }
            }
          })
        }
        console.log('----- 显示 ----')
        console.log(this.logicDisplay)
      } else {
      // 3.3处理跳题 -- 只针对单选题
        if (tempType === 'radio') {
          // 若不存在跳题，取当前题下一题
          const tempD = option.goto || this.question.lists[id].iID

          // 需处理上次选择的项
          if (beforeValue) {
            tempQ.iOptions.forEach(ele => {
              // 非上次选择的值，结束终止
              if (beforeValue !== ele.value) return false

              // 处理上一选项的逻辑
              const eleD = ele.goto
              const t = this.ids.indexOf(eleD) !== -1 ? this.ids.indexOf(eleD) : id
              if (eleD) {
                this.logicDisplay[eleD] > 0 && this.logicDisplay[eleD]--
                if (!this.logicDisplay[eleD]) {
                  // -- 处理子项逻辑
                  const childAnswer = this.answer[t + 1]
                  // 若逻辑题已选择
                  if (childAnswer.length) {
                    this.question.lists[t].iOptions.forEach(o => {
                      // 当前题是否选中此选项
                      if (childAnswer.indexOf(o.value) !== -1) {
                        // 该项一级控制题
                        const tempK = o.goto
                        this.logicDisplay[tempK] > 0 && this.logicDisplay[tempK]--
                        const i = this.ids.indexOf(tempK)
                        if (!this.logicDisplay[tempK]) {
                          const kNum = i + 1
                          this.answer[kNum] = Array.isArray(this.answer[kNum]) ? [] : ''
                          this.removeChecked(`q${kNum}`)
                        }

                        // 当前跳题与下一个跳题控制之间的其他题
                        for (let n = i; n < this.question.lists.length; n++) {
                          const nextList = this.question.lists[n]
                          const gotoId = nextList.iID
                          const nextGoto = nextList.iOptions.filter(o => o.goto)
                          if (!nextGoto.length) {
                            if (tempD !== gotoId && this.logicDisplay[gotoId] > 0) {
                              this.logicDisplay[gotoId]--
                            }
                            // -- 重置答案
                            if (!this.logicDisplay[gotoId]) {
                              const tempNum = n + 1
                              const tempItemType = nextList.iType
                              this.answer[tempNum] = Array.isArray(this.answer[tempNum]) ? [] : ''
                              if (tempItemType.indexOf('matrix') !== -1) {
                                nextList.iSubTitles.forEach((s, n) => {
                                  this.removeChecked(`q${tempNum}_${n + 1}`)
                                })
                              } else {
                                this.removeChecked(`q${tempNum}`)
                              }
                            }
                          } else {
                            return false
                          }
                        }
                      }
                    })
                  }

                  // -- 重置答案
                  const tempNum = t + 1
                  const tempItemType = this.question.lists[t].iType
                  this.answer[tempNum] = Array.isArray(this.answer[tempNum]) ? [] : ''
                  if (tempItemType.indexOf('matrix') !== -1) {
                    this.question.lists[t].iSubTitles.forEach((s, n) => {
                      this.removeChecked(`q${tempNum}_${n + 1}`)
                    })
                  } else {
                    this.removeChecked(`q${tempNum}`)
                  }
                }
              }

              // 当前跳题与下一个跳题控制之间的其他题
              for (let n = t; n < this.question.lists.length; n++) {
                const nextList = this.question.lists[n]
                const gotoId = nextList.iID
                const nextGoto = nextList.iOptions.filter(o => o.goto)
                if (!nextGoto.length) {
                  this.logicDisplay[gotoId] > 0 && this.logicDisplay[gotoId]--
                  // -- 重置答案
                  if (!this.logicDisplay[gotoId]) {
                    const tempNum = n + 1
                    const tempItemType = nextList.iType
                    this.answer[tempNum] = Array.isArray(this.answer[tempNum]) ? [] : ''
                    if (tempItemType.indexOf('matrix') !== -1) {
                      nextList.iSubTitles.forEach((s, n) => {
                        this.removeChecked(`q${tempNum}_${n + 1}`)
                      })
                    } else {
                      this.removeChecked(`q${tempNum}`)
                    }
                  }
                } else {
                  return false
                }
              }
            })
          }

          // 指定跳题处理
          this.logicDisplay[tempD]++

          // 当前指定跳题与下一个跳题控制之间的其他题显示
          const i = this.ids.indexOf(tempD)
          for (let n = i; n < this.question.lists.length; n++) {
            const nextList = this.question.lists[n]
            const gotoId = nextList.iID
            const nextGoto = nextList.iOptions.filter(o => o.goto)
            if (!nextGoto.length) {
              if (tempD !== gotoId && this.logicDisplay.hasOwnProperty(gotoId)) {
                this.logicDisplay[gotoId]++
              }
            } else {
              return false
            }
          }

          console.log('----- 跳题 ----')
          console.log(this.logicDisplay)
        }
      }
    },
    // 4.滚动跳至
    jump (id) {
      let jump = document.querySelector(id)
      // 4.1获取需要滚动的距离
      let total = jump.offsetTop
      // 兼容处理
      document.body.scrollTop = total
      document.documentElement.scrollTop = total
    },
    // 5.重置表单
    removeChecked (name) {
      let eles = document.getElementsByName(name)
      for (let i = 0; i < eles.length; i++) {
        eles[i].checked = false
      }
    },
    // 6.输入聚焦唤起键盘
    focusKeyBorad (e) {
      const element = document.getElementById(e.target.id)
      element.scrollIntoView()
    }
  }
}
</script>

<style lang="scss">
.title.required {
  .title-txt > *:last-child:after{
    content: '*';
    font-weight: 700;
    color: #f00;
    margin-left: 5px;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.editor-container, .options-item{
  position: relative;
}
.editor-container{
  height: 100%;
  background: #f2f2f2;
  padding: 20px;
}

.editor-main{
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
    word-break: break-all;
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
    .inner{
      min-height: 160px;
    }
    .title{
      overflow: hidden;
      padding-bottom: 10px;
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
  }
}

.matrix-table{
  width: 100%;
  table-layout: auto;
  border-collapse: collapse;
  border-spacing: 0;
  tr td:first-child{
    width: 25%;
  }
}
</style>

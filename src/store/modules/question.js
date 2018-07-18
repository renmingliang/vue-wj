import api from '@/api'
import { localData } from '@/utils'

const KEY_STATUS = 'q_status'
const KEY_TYPE = 'q_type'
const KEY_ID = 'q_id'

const question = {
  state: {
    questionLoading: false,
    questionVerify: false,
    questionStatus: localData.get(KEY_STATUS),
    questionType: localData.get(KEY_TYPE),
    questionId: localData.get(KEY_ID),
    questionList: [],
    questionTotal: null
  },

  getters: {
    questionLoading: state => state.questionLoading,
    questionVerify: state => state.questionVerify,
    questionStatus: state => state.questionStatus,
    questionType: state => state.questionType,
    questionId: state => state.questionId,
    questionList: state => state.questionList,
    questionTotal: state => state.questionTotal,
    questionsTemplate: () => {
      return [
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
      ]
    },
    questionLetters: () => {
      return ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N']
    }
  },

  mutations: {
    LIST_LOADING: (state, payload) => {
      state.questionLoading = payload.loading
    },
    VERIFY_LOADING: (state, payload) => {
      state.questionVerify = payload.loading
    },
    QUESTION_LIST: (state, payload) => {
      state.questionList = payload.list
      state.questionTotal = +payload.list.length
    },
    QUESTION_ID: (state, payload) => {
      state.questionId = payload.list.map(item => {
        return {
          value: item.id,
          label: item.id
        }
      })
      localData.set(KEY_ID, state.questionId)
    },
    QUESTION_STATUS: (state, payload) => {
      state.questionStatus = payload.list.map((item, index) => {
        return {
          value: String(index),
          label: item
        }
      })
      localData.set(KEY_STATUS, state.questionStatus)
    },
    QUESTION_TYPE: (state, payload) => {
      state.questionType = payload.list.map((item, index) => {
        return {
          value: String(index),
          label: item
        }
      })
      localData.set(KEY_TYPE, state.questionType)
    }
  },

  actions: {
    // 设置创建
    QUESTION_CREATE({ commit }, params) {
      return new Promise((resolve, reject) => {
        commit('LIST_LOADING', { loading: true })
        api.questionSettingCreate(params)
          .then(res => {
            console.log(res)
            commit('LIST_LOADING', { loading: false })
            resolve(res)
          })
          .catch(error => {
            commit('LIST_LOADING', { loading: false })
            console.log(error)
          })
      })
    },
    // 设置编辑
    QUESTION_EDIT({ commit }, params) {
      return new Promise((resolve, reject) => {
        commit('LIST_LOADING', { loading: true })
        api.questionSettingEdit(params)
          .then(res => {
            console.log(res)
            commit('LIST_LOADING', { loading: false })
            resolve(res)
          })
          .catch(error => {
            commit('LIST_LOADING', { loading: false })
            console.log(error)
          })
      })
    },
    // 问题导入
    QUESTION_ORIGIN_IMPORT({ commit }, params) {
      return new Promise((resolve, reject) => {
        commit('LIST_LOADING', { loading: true })
        api.questionOriginImport(params)
          .then(res => {
            console.log(res)
            commit('LIST_LOADING', { loading: false })
            resolve(res)
          })
          .catch(error => {
            commit('LIST_LOADING', { loading: false })
            console.log(error)
          })
      })
    },
    // 问题详情
    QUESTION_ORIGIN_DETAIL({ commit }, params) {
      return new Promise((resolve, reject) => {
        commit('LIST_LOADING', { loading: true })
        api.questionOriginDetail(params)
          .then(res => {
            console.log(res)
            commit('LIST_LOADING', { loading: false })
            resolve(res)
          })
          .catch(error => {
            commit('LIST_LOADING', { loading: false })
            console.log(error)
          })
      })
    },
    // 复制
    QUESTION_COPY({ commit }, params) {
      return new Promise((resolve, reject) => {
        commit('LIST_LOADING', { loading: true })
        api.questionCopy(params)
          .then(res => {
            console.log(res)
            commit('LIST_LOADING', { loading: false })
            resolve(res)
          })
          .catch(error => {
            console.log(error)
            commit('LIST_LOADING', { loading: false })
          })
      })
    },
    // 删除
    QUESTION_DEL({ commit }, params) {
      return new Promise((resolve, reject) => {
        commit('LIST_LOADING', { loading: true })
        api.questionDel(params)
          .then(res => {
            console.log(res)
            commit('LIST_LOADING', { loading: false })
            resolve(res)
          })
          .catch(error => {
            console.log(error)
            commit('LIST_LOADING', { loading: false })
          })
      })
    },
    // 标题搜索 -- 等同列表查询接口
    QUESTION_SEARCH_TITLE({ commit }, params) {
      return new Promise((resolve, reject) => {
        api.questionList(params)
          .then(res => {
            console.log(res)
            resolve(res)
          })
          .catch(error => {
            console.log(error)
          })
      })
    },
    // 详情
    QUESTION_FETCH_DETAIL({ commit }, params) {
      return new Promise((resolve, reject) => {
        commit('LIST_LOADING', { loading: true })
        api.questionSettingDetail(params)
          .then(res => {
            console.log(res)
            commit('LIST_LOADING', { loading: false })
            resolve(res)
          })
          .catch(error => {
            console.log(error)
            commit('LIST_LOADING', { loading: false })
          })
      })
    },
    // 列表
    QUESTION_FETCH_LIST({ commit, state }, params) {
      return new Promise((resolve, reject) => {
        commit('LIST_LOADING', { loading: true })
        api.questionList(params)
          .then(res => {
            console.log(res)
            commit('LIST_LOADING', { loading: false })
            commit('QUESTION_LIST', { list: res.data })
            if (!state.questionId || (state.questionId && state.questionId.length < res.data.length)) {
              commit('QUESTION_ID', { list: res.data })
            }
            resolve(res)
          })
          .catch(error => {
            console.log(error)
            commit('LIST_LOADING', { loading: false })
          })
      })
    },
    // 问卷状态
    QUESTION_FETCH_STATUS({ commit }) {
      return new Promise((resolve, reject) => {
        api.questionStatus()
          .then(res => {
            console.log(res)
            commit('QUESTION_STATUS', { list: res.data })
            resolve(res)
          })
          .catch(error => {
            console.log(error)
          })
      })
    },
    // 问卷类型
    QUESTION_FETCH_TYPE({ commit }) {
      return new Promise((resolve, reject) => {
        api.questionType()
          .then(res => {
            console.log(res)
            commit('QUESTION_TYPE', { list: res.data })
            resolve(res)
          })
          .catch(error => {
            console.log(error)
          })
      })
    },
    // 问卷提审
    QUESTION_SUBMIT_VERIFY({ commit }, params) {
      return new Promise((resolve, reject) => {
        commit('VERIFY_LOADING', { loading: true })
        api.questionSubmitVerify(params)
          .then(res => {
            console.log(res)
            commit('VERIFY_LOADING', { loading: false })
            resolve(res)
          })
          .catch(error => {
            commit('VERIFY_LOADING', { loading: false })
            console.log(error)
          })
      })
    },
    // 问卷审核
    QUESTION_VERIFY({ commit }, params) {
      return new Promise((resolve, reject) => {
        commit('VERIFY_LOADING', { loading: true })
        api.questionVerify(params)
          .then(res => {
            console.log(res)
            commit('VERIFY_LOADING', { loading: false })
            resolve(res)
          })
          .catch(error => {
            commit('VERIFY_LOADING', { loading: false })
            console.log(error)
          })
      })
    },
    // 问卷发布
    QUESTION_PUBLISH({ commit }, params) {
      return new Promise((resolve, reject) => {
        commit('VERIFY_LOADING', { loading: true })
        api.questionPublish(params)
          .then(res => {
            console.log(res)
            commit('VERIFY_LOADING', { loading: false })
            resolve(res)
          })
          .catch(error => {
            commit('VERIFY_LOADING', { loading: false })
            console.log(error)
          })
      })
    },
    // 问卷回收
    QUESTION_OVER({ commit }, params) {
      return new Promise((resolve, reject) => {
        commit('VERIFY_LOADING', { loading: true })
        api.questionOver(params)
          .then(res => {
            console.log(res)
            commit('VERIFY_LOADING', { loading: false })
            resolve(res)
          })
          .catch(error => {
            commit('VERIFY_LOADING', { loading: false })
            console.log(error)
          })
      })
    },
    // 问卷答案分析
    QUESTION_ANSWER_ANALYSE({ commit }, params) {
      return new Promise((resolve, reject) => {
        api.answerAnalyse(params)
          .then(res => {
            console.log(res)
            resolve(res)
          })
          .catch(error => {
            console.log(error)
          })
      })
    },
    // 问卷答题记录
    QUESTION_ANSWER_LIST({ commit }, params) {
      return new Promise((resolve, reject) => {
        api.answerList(params)
          .then(res => {
            console.log(res)
            resolve(res)
          })
          .catch(error => {
            console.log(error)
          })
      })
    }
  }
}

export default question

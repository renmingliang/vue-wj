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
    questionTotal: state => state.questionTotal
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
          value: index,
          label: item
        }
      })
      localData.set(KEY_STATUS, state.questionStatus)
    },
    QUESTION_TYPE: (state, payload) => {
      state.questionType = payload.list.map((item, index) => {
        return {
          value: index,
          label: item
        }
      })
      localData.set(KEY_TYPE, state.questionType)
    }
  },

  actions: {
    // 创建
    QUESTION_CREATE({ commit }, params) {
      return new Promise((resolve, reject) => {
        commit('LIST_LOADING', { loading: true })
        api.questionCreate(params)
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
    // 创建
    QUESTION_EDIT({ commit }, params) {
      return new Promise((resolve, reject) => {
        commit('LIST_LOADING', { loading: true })
        api.questionEdit(params)
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
        api.questionDetail(params)
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
    // 问卷分析
    QUESTION_ANALYSE({ commit }, params) {
      return new Promise((resolve, reject) => {
        api.questionAnalyse(params)
          .then(res => {
            console.log(res)
            resolve(res)
          })
          .catch(error => {
            console.log(error)
          })
      })
    },
    // 问卷导出
    QUESTION_EXPORT({ commit }, params) {
      return new Promise((resolve, reject) => {
        api.questionExport(params)
          .then(res => {
            console.log(res)
            resolve(res)
          })
          .catch(error => {
            console.log(error)
          })
      })
    },
    // 下载报告
    QUESTION_DOWNLOAD({ commit }, params) {
      return new Promise((resolve, reject) => {
        api.questionDownload(params)
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

import api from '@/api'
import { localData } from '@/utils'

const KEY_APP = 'appList'
const KEY_NAME = 'p_name'

const project = {
  state: {
    appList: localData.get(KEY_APP),
    projectName: localData.get(KEY_NAME),
    projectLoading: false,
    projectList: [],
    projectTotal: null,
    projectFilter: null
  },

  getters: {
    appList: state => state.appList,
    projectLoading: state => state.projectLoading,
    projectList: state => state.projectList,
    projectTotal: state => state.projectTotal,
    projectFilter: state => state.projectFilter,
    projectName: state => state.projectName
  },

  mutations: {
    PROJECT_LOADING: (state, payload) => {
      state.projectLoading = payload.loading
    },
    PROJECT_LIST: (state, payload) => {
      state.projectList = payload.list.list
      state.projectTotal = +payload.list.count
    },
    APP_LIST: (state, payload) => {
      state.appList = payload.list
      localData.set(KEY_APP, payload.list)
    },
    PROJECT_FILTER: (state, payload) => {
      state.projectFilter = state.projectList.filter(item => {
        return !payload.id || item.id === payload.id
      })
    },
    PROJECT_NAME: (state, payload) => {
      state.projectName = payload.list.list.map(item => {
        return {
          value: item.id,
          label: item.project_name
        }
      })
      localData.set(KEY_NAME, state.projectName)
    }
  },

  actions: {
    // 添加项目
    PROJECT_CREATE({ commit }, params) {
      return new Promise((resolve, reject) => {
        api.projectCreate(params)
          .then(res => {
            console.log(res)
            resolve(res)
          })
          .catch(error => {
            console.log(error)
          })
      })
    },
    // 项目详情
    PROJECT_DETAIL({ commit }, params) {
      return new Promise((resolve, reject) => {
        api.projectDetail(params)
          .then(res => {
            console.log(res)
            resolve(res)
          })
          .catch(error => {
            console.log(error)
          })
      })
    },
    // 编辑项目
    PROJECT_EDIT({ commit }, params) {
      return new Promise((resolve, reject) => {
        api.projectEdit(params)
          .then(res => {
            console.log(res)
            resolve(res)
          })
          .catch(error => {
            console.log(error)
          })
      })
    },
    // 删除项目
    PROJECT_DEL({ commit }, params) {
      return new Promise((resolve, reject) => {
        api.projectDel(params)
          .then(res => {
            console.log(res)
            resolve(res)
          })
          .catch(error => {
            console.log(error)
          })
      })
    },
    // 项目列表
    PROJECT_FETCH_LIST({ commit }, params) {
      return new Promise((resolve, reject) => {
        commit('PROJECT_LOADING', { loading: true })
        api.projectList(params)
          .then(res => {
            console.log(res)
            commit('PROJECT_LOADING', { loading: false })
            commit('PROJECT_NAME', { list: res.data })
            commit('PROJECT_LIST', { list: res.data })
            resolve(res)
          })
          .catch(error => {
            console.log(error)
            commit('PROJECT_LOADING', { loading: false })
          })
      })
    },
    // 游戏列表
    PROJECT_APP_LIST({ commit }, params) {
      return new Promise((resolve, reject) => {
        api.projectAppList(params)
          .then(res => {
            console.log(res)
            commit('APP_LIST', { list: res.data })
            resolve(res)
          })
          .catch(error => {
            console.log(error)
          })
      })
    }
  }
}

export default project

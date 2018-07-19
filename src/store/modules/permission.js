import api from '@/api'

const permission = {
  state: {
    permissionUser: null,
    permissionLoading: false,
    permissionUserLoading: false,
    permissionConfigData: [],
    permissionUserTotal: null
  },

  getters: {
    permissionUser: state => state.permissionUser,
    permissionUserTotal: state => state.permissionUserTotal,
    permissionLoading: state => state.permissionLoading,
    permissionUserLoading: state => state.permissionUserLoading,
    permissionConfigData: state => state.permissionConfigData,
    permissionConfigIds: state => {
      let temp = []
      if (state.permissionConfigData.menus_permissions) {
        state.permissionConfigData.menus_permissions.forEach(item => {
          item.children.forEach(child => {
            temp.push({
              id: child.id,
              pid: child.pid,
              permission_id: child.permission_ids.split(',')
            })
          })
        })
      }
      return temp
    }
  },

  mutations: {
    PERMISSION_LOADING: (state, payload) => {
      state.permissionLoading = payload.loading
    },
    PERMISSION_USER_LOADING: (state, payload) => {
      state.permissionUserLoading = payload.loading
    },
    PERMISSION_USER: (state, payload) => {
      state.permissionUser = payload.list.data
      state.permissionUserTotal = +payload.list.total_count
    },
    SET_CONFIG: (state, payload) => {
      state.permissionConfigData = payload.list
    }
  },

  actions: {
    // 新增
    PERMISSION_ADD({ commit }, params) {
      return new Promise((resolve, reject) => {
        commit('PERMISSION_LOADING', { loading: true })
        api.userAdd(params)
          .then(res => {
            // console.log(res)
            commit('PERMISSION_LOADING', { loading: false })
            resolve(res)
          })
          .catch(error => {
            console.log(error)
            commit('PERMISSION_LOADING', { loading: false })
          })
      })
    },
    // 编辑
    PERMISSION_UPDATE({ commit }, params) {
      return new Promise((resolve, reject) => {
        commit('PERMISSION_LOADING', { loading: true })
        api.userUpdate(params)
          .then(res => {
            // console.log(res)
            commit('PERMISSION_LOADING', { loading: false })
            resolve(res)
          })
          .catch(error => {
            console.log(error)
            commit('PERMISSION_LOADING', { loading: false })
          })
      })
    },
    // 删除
    PERMISSION_DEL({ commit }, params) {
      return new Promise((resolve, reject) => {
        commit('PERMISSION_LOADING', { loading: true })
        api.userDel(params)
          .then(res => {
            // console.log(res)
            commit('PERMISSION_LOADING', { loading: false })
            resolve(res)
          })
          .catch(error => {
            console.log(error)
            commit('PERMISSION_LOADING', { loading: false })
          })
      })
    },
    // 配置
    PERMISSION_CONFIG({ commit }, params) {
      return new Promise((resolve, reject) => {
        api.permissionConfig()
          .then(res => {
            // console.log(res)
            commit('SET_CONFIG', { list: res.data })
            resolve(res)
          })
          .catch(error => {
            console.log(error)
          })
      })
    },
    // 详情
    PERMISSION_FETCH_DETAIL({ commit }, params) {
      return new Promise((resolve, reject) => {
        api.permissionDetail(params)
          .then(res => {
            // console.log(res)
            resolve(res)
          })
          .catch(error => {
            console.log(error)
          })
      })
    },
    // 列表
    PERMISSION_USER_LIST({ commit }, params) {
      return new Promise((resolve, reject) => {
        commit('PERMISSION_USER_LOADING', { loading: true })
        api.userList(params)
          .then(res => {
            // console.log(res)
            commit('PERMISSION_USER', { list: res.data })
            commit('PERMISSION_USER_LOADING', { loading: false })
            resolve(res)
          })
          .catch(error => {
            console.log(error)
            commit('PERMISSION_USER_LOADING', { loading: false })
          })
      })
    },
    // 列表 -- 模糊搜索username
    PERMISSION_USER_SEARCH({ commit }, params) {
      return new Promise((resolve, reject) => {
        api.userList(params)
          .then(res => {
            // console.log(res)
            resolve(res)
          })
          .catch(error => {
            console.log(error)
          })
      })
    }
  }
}

export default permission

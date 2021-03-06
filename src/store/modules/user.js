import api from '@/api'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { localData } from '@/utils'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // sso登录
    ssoLogin({ commit }, payload) {
      return new Promise((resolve, reject) => {
        console.log(payload.token)
        setToken(payload.token)
        commit('SET_TOKEN', payload.token)
        resolve()
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        api.getInfo().then(res => {
          const user = res.data
          commit('SET_NAME', user.username)
          commit('SET_AVATAR', user.avatar)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户权限列表
    GetMenu({ commit, state }) {
      return new Promise((resolve, reject) => {
        api.getMenu().then(res => {
          const data = {roles: res.data}
          console.log(res)
          if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', data.roles)
          } else {
            reject(new Error('getMenu: roles must be a non-null array !'))
          }
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        localData.clear()
        location.href = api.logout
        resolve()
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        localData.clear()
        resolve()
      })
    }
  }
}

export default user

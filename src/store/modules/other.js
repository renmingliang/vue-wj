import api from '@/api'

const other = {
  state: {
    userSsoList: null
  },

  getters: {
    userSsoList: state => state.userSsoList
  },

  mutations: {
    USER_SSO_LIST: (state, payload) => {
      state.userSsoList = payload.list.map(item => {
        return {
          value: item.result.name,
          nickname: item.result.nickname
        }
      })
    }
  },

  actions: {
    // sso用户
    USER_FETCH_SSO({ commit }, params) {
      return new Promise((resolve, reject) => {
        api.userSso()
          .then(res => {
            // console.log(res)
            commit('USER_SSO_LIST', { list: res.data })
            resolve(res)
          })
          .catch(error => {
            console.log(error)
          })
      })
    }
  }
}

export default other

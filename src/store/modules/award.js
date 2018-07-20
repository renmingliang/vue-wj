import api from '@/api'

const award = {
  state: {
    awardLoading: false,
    awardData: null,
    awardTotal: null,
    awardCpList: null
  },

  getters: {
    awardLoading: state => state.awardLoading,
    awardData: state => state.awardData,
    awardCpList: state => state.awardCpList,
    awardTotal: state => state.awardTotal
  },

  mutations: {
    AWARD_LOADING: (state, payload) => {
      state.awardLoading = payload.loading
    },
    AWARD_LIST: (state, payload) => {
      state.awardData = payload.list.list
      state.awardTotal = +payload.list.count
    },
    AWARD_CP_LIST: (state, payload) => {
      state.awardCpList = payload.list
    }
  },

  actions: {
    // 问卷设置 --> CP奖品
    ITEM_CP_LIST({ commit }, params) {
      return new Promise((resolve, reject) => {
        api.itemCpList(params)
          .then(res => {
            console.log(res)
            commit('AWARD_CP_LIST', { list: res.data })
            resolve(res)
          })
          .catch(error => {
            console.log(error)
          })
      })
    },
    // 问卷设置 --> 奖品列表
    ITEM_LIST({ commit }, params) {
      return new Promise((resolve, reject) => {
        api.itemList(params)
          .then(res => {
            console.log(res)
            resolve(res)
          })
          .catch(error => {
            console.log(error)
          })
      })
    },
    // 发放列表
    AWARD_FETCH_LIST({ commit }, params) {
      return new Promise((resolve, reject) => {
        commit('AWARD_LOADING', { loading: true })
        api.awardList(params)
          .then(res => {
            console.log(res)
            commit('AWARD_LOADING', { loading: false })
            commit('AWARD_LIST', { list: res.data })
            resolve(res)
          })
          .catch(error => {
            console.log(error)
            commit('AWARD_LOADING', { loading: false })
          })
      })
    },
    // 发放列表 - 角色昵称-模糊搜索
    AWARD_SEARCH_ROLE({ commit }, params) {
      return new Promise((resolve, reject) => {
        api.awardList(params)
          .then(res => {
            console.log(res)
            commit('AWARD_LIST', { list: res.data })
            resolve(res)
          })
          .catch(error => {
            console.log(error)
          })
      })
    }
  }
}

export default award

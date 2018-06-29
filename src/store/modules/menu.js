import { asyncRouterMap, constantRouterMap } from '@/router'
import { localData } from '@/utils'

const KEY_NAME = 'asynBtn'
/**
 * 通过meta.roles判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.code) {
    return roles.some(role => route.meta.code === role)
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(asyncRouterMap, roles) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (hasPermission(roles, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, roles)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

/**
 * 递归过滤视图，返回控制用户角色视图页面权限数组
 * @param roles
 */
let asynMenu = []
function handleMenu(roles) {
  roles.forEach(item => {
    if (item.code) {
      if (item.children && item.children.length) {
        handleMenu(item.children)
      }
      asynMenu.push(item.code)
    }
  })
  return asynMenu
}

/**
 * 递归过滤控制按钮，返回控制用户角色按钮权限数组
 * @param roles
 */
let asynBtn = []
function handleBtn(roles) {
  roles.forEach(item => {
    if (item.code) {
      if (item.permissions && item.permissions.length) {
        asynBtn = asynBtn.concat(item.permissions)
      } else if (item.children && item.children.length) {
        handleBtn(item.children)
      }
    }
  })
  return asynBtn
}

const menu = {
  state: {
    routers: constantRouterMap,
    addRouters: [],
    addControl: localData.get(KEY_NAME)
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    },
    SET_CONTROL: (state, btn) => {
      state.addControl = btn
      localData.set(KEY_NAME, state.addControl)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { roles } = data
        let accessedRouters
        const tempBtn = handleBtn(roles)
        const tempMenu = handleMenu(roles)
        accessedRouters = filterAsyncRouter(asyncRouterMap, tempMenu)
        console.log(tempBtn)
        commit('SET_CONTROL', tempBtn)
        console.log(accessedRouters)
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default menu

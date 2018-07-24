import router from './router'
import store from './store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getQueryString } from '@/utils'
import { getToken } from '@/utils/auth'

NProgress.configure({ showSpinner: false })

const whiteList = ['/401']// 白名单--不需要token页面

const str = location.search.substr(1)
const token = getQueryString(str, 'token')

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    // has token
    // 判断当前用户是否已拉取完user_info信息
    if (store.getters.roles.length === 0) {
      // 拉取user_menu
      store.dispatch('GetMenu')
        .then(res => {
          // note: roles must be a array! such as: ['editor','develop']
          const roles = res.data
          store.dispatch('GenerateRoutes', { roles }).then(() => {
            // 动态添加可访问路由表
            router.addRoutes(store.getters.addRouters)
            // hack方法 确保addRoutes已完成，replace：true确保浏览器不会产生history记录
            next({ ...to, replace: true })
          })
        })
        .catch(() => {
          store.dispatch('FedLogOut').then(() => {
            next({ path: '/' })
          })
        })
    } else {
      next()
    }
  } else {
    // has no token
    if (token) {
      // sso登录 进入首页
      store.dispatch('ssoLogin', { token }).then(() => {
        // 浏览器兼容处理
        if (location.origin) {
          location.href = location.origin + '/#/'
        } else {
        // IE
          location.href = '/#/'
        }
      })
    } else {
      if (whiteList.indexOf(to.path) !== -1) {
        next()
      } else {
        // 否则全部重定向到401页
        next({ path: '/401' })
        NProgress.done()
      }
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

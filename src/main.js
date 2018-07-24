import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

import ElementUI from 'element-ui'
import '@/assets/styles/element-variables.scss'

import '@/assets/styles/reset.scss' // reset css
import '@/assets/styles/index.scss' // global css

import '@/assets/icons' // icon

import './permission'// user-roles permission

// 页面按钮权限控制
Vue.prototype.$_has = function (value) {
  const permission = store.getters.addControl
  return permission.some(item => item.route === value)
}

Vue.use(ElementUI)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})

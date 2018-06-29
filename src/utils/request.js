import axios from 'axios'
import qs from 'qs'
import store from '../store'
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 15000, // 请求超时时间
  headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }, // `headers` 是即将被发送的自定义请求头
  // `transformRequest` 允许在向服务器发送前，修改请求数据
  // 只能用在 'PUT', 'POST' 和 'PATCH' 这几个请求方法
  // 后面数组中的函数必须返回一个字符串，或 ArrayBuffer，或 Stream
  transformRequest: [function (data) {
    // 对 data 进行任意转换处理
    return qs.stringify(data)
  }]
})

// request拦截器
service.interceptors.request.use(config => {
  // 用户token信息
  if (store.getters.token) {
    config.headers['access-token'] = getToken()
  }
  // 防止get请求获取数据304缓存，必须保证状态为200
  if (config.method === 'get') {
    if (config.params) {
      config.params['_'] = +new Date()
    } else {
      config.params = { '_': +new Date() }
    }
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 10000) {
      // 10005:没有操作权限; 10007:其他客户端登录了;  10014:Token 过期了;
      if (res.code === 10007) {
        Message({
          message: '您的账号已在其他客户端登录，如需要，请重新登录',
          type: 'warning',
          duration: 3 * 1000,
          onClose: function() {
            store.dispatch('FedLogOut').then(() => {
              location.reload()// 为了重新实例化vue-router对象 避免bug
            })
          }
        })
      } else {
        Message({
          message: res.msg,
          type: 'error',
          duration: 3 * 1000
        })
      }
      return Promise.reject(res)
    } else {
      return response.data
    }
  },
  error => {
    console.log('err' + error)// for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service

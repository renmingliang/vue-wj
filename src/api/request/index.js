import instance from './instance'
import { Message } from 'element-ui'

import store from '../store'
import { ERR_OK, ERR_LOGIN } from '../config'

/**
 * 请求前loading效果处理
 * */
export const beforeRequest = (loading) => {
  // 不显示则终止
  if (!loading) {
    return
  }
  // Loading开始
  if (loading) {
    console.log('beforeRequest-loading', loading)
  }
}

/**
 * 请求后loading效果处理
 * */
export const afterRequest = (loading) => {
  // 不显示则终止
  if (!loading) {
    return
  }
  // Loading结束
  if (loading) {
    console.log('afterRequest-loading', loading)
  }
}

/**
 * 共用类  的接口请求实例
 * 针对返回结果数据字段
 * { code, message, result }
 *
 * 封装API接口请求方法, 针对aixos实例方法调用
 * options = {
 *   url：请求地址
 *   method: 请求使用的方法，如 GET、POST
 *   data:  请求数据，针对post
 *   params: 请求数据，针对get
 *   loading: 请求自定义是否前后自动加载与关闭loading效果, 默认 false
 *   catchs: 异常处理，接口抛出的异常是否自己处理：true 是，false 否
 *           由公共方法统一处理展示在控制台 默认 false
 *   toast: 异常弹框，true 是，false 否
 *          由公共方法统一处理优化显示给用户 默认 true
 * }
 */

export const apiAsync = function (options) {
  // 获取自定义配置参数
  const { loading = false, catchs = false, toast = true, ...obj } = options

  beforeRequest(loading)
  return new Promise((resolve, reject) => {
    instance(obj)
      .then(res => {
        afterRequest(loading)
        const { config, data } = res

        // 接口请求数据格式固定
        const { code, result, message = '网络繁忙，请稍后再试' } = data

        // 处理请求完成 - 非成功状态码
        if (code !== ERR_OK) {
          console.log('axios-response-url ===> ', config.url)
          console.log('axios-response-params ===> ', config.data)
          console.log('axios-response-message ===> ', data)

          // 10005:没有操作权限; 10007:其他客户端登录了;  10014:Token 过期了;
          if (code === ERR_LOGIN) {
            Message({
              message: '您的账号已在其他客户端登录，如需要，请重新登录',
              type: 'warning',
              duration: 3 * 1000,
              onClose: function () {
                store.dispatch('FedLogOut').then(() => {
                  location.reload()// 为了重新实例化vue-router对象 避免bug
                })
              }
            })
          } else {
            // 异常信息-弹框
            if (toast) {
              Message({
                message: message,
                type: 'error',
                duration: 3 * 1000
              })
            }
          }

          // 自补获异常
          if (catchs) {
            reject(data)
          }
        } else {
          // 成功状态码
          resolve(result)
        }
      })
      .catch(err => {
        console.log('axios-error-url ===> ', err.config.url)
        console.log('axios-error-params ===> ', err.config.data)
        console.log('axios-error-message ===> ', err.message)

        afterRequest(loading)
        // 异常信息-弹框
        if (toast) {
          let message = err.message
          // 超时错误
          if (err.code === 'ECONNABORTED' && message.indexOf('timeout') !== -1) {
            message = '网络繁忙，请稍后再试'
          }
          // 网络异常
          if (message.indexOf('Network Error') !== -1) {
            message = '网络异常，请检查您的网络是否连接正常'
          }
          Message({
            message: message,
            type: 'error',
            duration: 3 * 1000
          })
        }

        if (catchs) {
          reject(err)
        }
      })
  })
}

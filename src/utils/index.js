/**
 * 获取表单结构数据中指定参数的值
 */
export function getQueryString (str, name) {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  const r = str.match(reg)
  if (r != null) return decodeURIComponent(r[2])
  return ''
}

/**
 * 表单数据转JSON对象
 */
export function param2Obj(str) {
  if (!str) { return {} }
  return JSON.parse('{"' + decodeURIComponent(str).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
}

/**
 * 深度拷贝对象-利用es6延展符
 */
export function deepClone(params) {
  if (Array.isArray(params)) {
    let [ ...arr ] = params
    return arr
  } else {
    return JSON.parse(JSON.stringify(params))
  }
}

/**
 * localStorage
 */
export const localData = {
  set: function (key, val) {
    if (typeof val === 'string') {
      localStorage.setItem(key, val)
    } else {
      localStorage.setItem(key, JSON.stringify(val))
    }
  },
  get: function (key) {
    const res = localStorage.getItem(key)
    if (res) {
      return JSON.parse(res)
    } else {
      return null
    }
  },
  remove: function (key) {
    localStorage.removeItem(key)
  },
  clear: function () {
    localStorage.clear()
  }
}

import Mock from 'mockjs'
import MockAdapter from 'axios-mock-adapter'
import Axios from '@/api/axios'
import { ERR_OK } from '@/api/config'

/**********************************************
 * 具体配置参考以下链接，可自行搭配参数
 * https://github.com/ctimmerm/axios-mock-adapter
 * *******************************************/

// 获取mock文件夹下所有js文件 => 即对应请求地址
const files = require.context('./', true, /\.js$/)
const interfaces = []
files.keys().forEach(filePath => {
  // 排除文件
  if (filePath === './index.js') return false
  // 过滤仅保留接口名
  const key = filePath.replace(/\.|js/g, '')
  interfaces.push(key)
})

class CreateInterface {
  constructor() {
    this.SUCCESS_STATUS = 200 // 成功状态
    this.FAIL_STATUS = 500 // 失败状态
    this.mocker = new MockAdapter(Axios)
    this.interfaces = interfaces // mock接口列表
  }
  init() {
    const { interfaces, mocker, SUCCESS_STATUS } = this
    console.log('当前接口请求MOCK：', interfaces)
    interfaces.forEach(filename => {
      const fileData = require(`.${filename}`)
      mocker.onPost(filename).reply(config => {
        const obj = config.data ? JSON.parse(config.data) : {}
        const result = Object.keys(fileData).length ? Object.assign({}, fileData, obj) : fileData
        const data = { code: ERR_OK, message: 'success', result }
        return [SUCCESS_STATUS, Mock.mock(data)]
      })
    })
  }
}

const createInterface = new CreateInterface()

createInterface.init()

export default createInterface.mocker

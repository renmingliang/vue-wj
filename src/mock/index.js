import Mock from 'mockjs'
import loginAPI from './login'

// 登录相关
Mock.mock(/\/site\/get-token/, 'post', loginAPI.loginByUsername)
Mock.mock(/\/user\/logout/, 'post', loginAPI.logout)
Mock.mock(/\/user\/info/, 'get', loginAPI.getUserInfo)
Mock.mock(/\/user\/permission\.*/, 'get', loginAPI.getUserPermission)

export default Mock

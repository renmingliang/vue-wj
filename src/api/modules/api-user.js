import { apiAsync } from '../request'
import { InterFaceUrl } from '../config'

export default {

  /**
   * 登出
   *
   */
  logout: data => apiAsync({
    method: 'post',
    url: InterFaceUrl('/user/logout'),
    data: data,
    toast: true
  }),

  /**
   * 用户信息
   *
   */
  getInfo: data => apiAsync({
    method: 'get',
    url: InterFaceUrl('/user/info'),
    params: data,
    toast: true
  }),

  /**
   * 权限菜单
   *
   */
  getMenu: data => apiAsync({
    method: 'get',
    url: InterFaceUrl('/user/permission'),
    params: data,
    toast: true
  }),

  /**
   * 所有用户
   *
   */
  userSso: data => apiAsync({
    method: 'get',
    url: InterFaceUrl('/user/all-users'),
    params: data,
    toast: true
  }),

  /**
   * 用户权限列表
   *
   */
  userList: data => apiAsync({
    method: 'get',
    url: InterFaceUrl('/user/list'),
    params: data,
    toast: true
  }),

  /**
   * 添加用户权限
   *
   */
  userAdd: data => apiAsync({
    method: 'post',
    url: InterFaceUrl('/user/add'),
    data: data,
    toast: true
  }),

  /**
   * 修改用户权限
   *
   */
  userUpdate: data => apiAsync({
    method: 'post',
    url: InterFaceUrl('/user/update-permission'),
    data: data,
    toast: true
  }),

  /**
   * 删除用户权限
   *
   */
  userDel: data => apiAsync({
    method: 'post',
    url: InterFaceUrl('/user/change-status'),
    data: data,
    toast: true
  })
}

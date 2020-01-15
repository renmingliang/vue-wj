import { apiAsync } from '../request'
import { InterFaceUrl } from '../config'

export default {

  /**
   * 项目游戏列表
   *
   */
  projectAppList: data => apiAsync({
    method: 'post',
    url: InterFaceUrl('/project/app-list'),
    data: data,
    toast: true
  }),

  /**
   * 项目列表
   *
   */
  projectList: data => apiAsync({
    method: 'post',
    url: InterFaceUrl('/project/list'),
    data: data,
    toast: true
  }),

  /**
   * 项目详情
   *
   */
  projectDetail: data => apiAsync({
    method: 'post',
    url: InterFaceUrl('/project/one'),
    data: data,
    toast: true
  }),

  /**
   * 项目添加
   *
   */
  projectCreate: data => apiAsync({
    method: 'post',
    url: InterFaceUrl('/project/edit'),
    data: data,
    toast: true
  }),

  /**
   * 项目编辑
   *
   */
  projectEdit: data => apiAsync({
    method: 'post',
    url: InterFaceUrl('/project/edit'),
    data: data,
    toast: true
  }),

  /**
   * 项目删除
   *
   */
  projectDel: data => apiAsync({
    method: 'post',
    url: InterFaceUrl('/project/del'),
    data: data,
    toast: true
  })
}

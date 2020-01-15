import { apiAsync } from '../request'
import { InterFaceUrl } from '../config'

export default {

  /**
   * CP奖品列表
   *
   */
  itemCpList: data => apiAsync({
    method: 'post',
    url: InterFaceUrl('/item/cp-item'),
    data: data,
    toast: true
  }),

  /**
   * 设置--奖品列表
   *
   */
  itemList: data => apiAsync({
    method: 'post',
    url: InterFaceUrl('/item/list'),
    data: data,
    toast: true
  })
}

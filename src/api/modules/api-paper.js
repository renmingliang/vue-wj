import { apiAsync } from '../request'
import { InterFaceUrl } from '../config'

export default {

  /**
   * 问卷发放奖品列表
   *
   */
  awardList: data => apiAsync({
    method: 'post',
    url: InterFaceUrl('/paper/item-list'),
    data: data,
    toast: true
  }),

  /**
   * 问卷答题记录
   *
   */
  answerList: data => apiAsync({
    method: 'post',
    url: InterFaceUrl('/paper/list'),
    data: data,
    toast: true
  }),

  /**
   * 问卷答题详情
   *
   */
  answerDetail: data => apiAsync({
    method: 'post',
    url: InterFaceUrl('/paper/one'),
    data: data,
    toast: true
  })
}

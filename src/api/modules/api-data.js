import { apiAsync } from '../request'
import { InterFaceUrl } from '../config'

export default {

  /**
   * 问卷答案分析
   *
   */
  answerAnalyse: data => apiAsync({
    method: 'post',
    url: InterFaceUrl('/data/answer'),
    data: data,
    toast: true
  })
}

import { apiAsync } from '../request'
import { InterFaceUrl } from '../config'

export default {

  /**
   * 问卷状态
   *
   */
  questionStatus: data => apiAsync({
    method: 'get',
    url: InterFaceUrl('/question/question-status-list'),
    params: data,
    toast: true
  }),

  /**
   * 问卷类型
   *
   */
  questionType: data => apiAsync({
    method: 'get',
    url: InterFaceUrl('/question/question-type-list'),
    params: data,
    toast: true
  }),

  /**
   * 问卷列表
   *
   */
  questionList: data => apiAsync({
    method: 'post',
    url: InterFaceUrl('/question/question-list'),
    data: data,
    toast: true
  }),

  /**
   * 问卷设置创建
   *
   */
  questionSettingCreate: data => apiAsync({
    method: 'post',
    url: InterFaceUrl('/question/question-create'),
    data: data,
    toast: true
  }),

  /**
   * 问卷设置编辑
   *
   */
  questionSettingEdit: data => apiAsync({
    method: 'post',
    url: InterFaceUrl('/question/question-edit'),
    data: data,
    toast: true
  }),

  /**
   * 问卷设置详情
   *
   */
  questionSettingDetail: data => apiAsync({
    method: 'post',
    url: InterFaceUrl('/question/question-one'),
    data: data,
    toast: true
  }),

  /**
   * 问卷问题导入
   *
   */
  questionOriginImport: data => apiAsync({
    method: 'post',
    url: InterFaceUrl('/question/question-origin-import'),
    data: data,
    toast: true
  }),

  /**
   * 问卷问题详情
   *
   */
  questionOriginDetail: data => apiAsync({
    method: 'post',
    url: InterFaceUrl('/question/question-origin-one'),
    data: data,
    toast: true
  }),

  /**
   * 问卷提审
   *
   */
  questionSubmitVerify: data => apiAsync({
    method: 'post',
    url: InterFaceUrl('/question/question-submit-verify'),
    data: data,
    toast: true
  }),

  /**
   * 问卷审核
   *
   */
  questionVerify: data => apiAsync({
    method: 'post',
    url: InterFaceUrl('/question/question-verify'),
    data: data,
    toast: true
  }),

  /**
   * 问卷发布
   *
   */
  questionPublish: data => apiAsync({
    method: 'post',
    url: InterFaceUrl('/question/question-publish'),
    data: data,
    toast: true
  }),

  /**
   * 问卷回收
   *
   */
  questionOver: data => apiAsync({
    method: 'post',
    url: InterFaceUrl('/question/question-over'),
    data: data,
    toast: true
  }),

  /**
   * 问卷复制
   *
   */
  questionCopy: data => apiAsync({
    method: 'post',
    url: InterFaceUrl('/question/question-copy'),
    data: data,
    toast: true
  }),

  /**
   * 问卷删除
   *
   */
  questionDel: data => apiAsync({
    method: 'post',
    url: InterFaceUrl('/question/question-del'),
    data: data,
    toast: true
  })
}

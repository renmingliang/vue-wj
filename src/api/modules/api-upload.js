import { apiAsync } from '../request'
import { InterFaceUrl } from '../config'

export default {

  /**
   * 文件上传
   *
   */
  upload: data => apiAsync({
    method: 'post',
    url: InterFaceUrl('/upload/upload-attachment'),
    data: data,
    toast: true
  })
}

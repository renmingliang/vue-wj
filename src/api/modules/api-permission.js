import { apiAsync } from '../request'
import { InterFaceUrl } from '../config'

export default {

  /**
   * 权限配置
   *
   */
  permissionConfig: data => apiAsync({
    method: 'get',
    url: InterFaceUrl('/permission/config'),
    params: data,
    toast: true
  })
}

import request from '@/utils/request'

export default {
  // 登录
  login: (data) => {
    return request.post('/site/get-token', data)
  },
  // 登出
  logout: () => {
    return request.post('/user/logout')
  },
  // 修改密码
  editPass: (data) => {
    return request.post('/user/change-pwd', data)
  },
  // 用户信息
  getInfo: () => {
    return request.get('/user/info')
  },
  // 权限菜单
  getMenu: () => {
    return request.get('/user/permission')
  },
  // 添加用户权限
  UserAdd: (data) => {
    return request.post('/user/add', data)
  },
  // 修改用户权限
  UserUpdate: (data) => {
    return request.post('/user/update-permission', data)
  },
  // 删除用户权限
  UserDelete: (data) => {
    return request.post('/user/del', data)
  },
  // sso所有用户
  UserSso: () => {
    return request.get('/sso/all-users')
  },
  // IP录入
  IPAdd: (data) => {
    return request.post('/ip/form-add', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      transformRequest: [function (data) {
        return data
      }]
    })
  },
  // IP编辑
  IPUpdate: (data) => {
    return request.post('/ip/form-update', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      transformRequest: [function (data) {
        return data
      }]
    })
  },
  // IP删除
  IPDelete: (data) => {
    return request.post('/ip/del', data)
  },
  // 对应IP改编权类别的项目删除
  IPProjectDelete: (data) => {
    return request.post('/ip/right-del-project', data)
  },
  // 对应IP改编权类别单项目删除
  IPRightDelete: (data) => {
    return request.post('/ip/right-del', data)
  },
  // 对应IP下的所有改编权类别
  IPRightAll: (data) => {
    return request.get('/adaptation-right/ip', { params: data })
  },
  // IP详情
  IPDetail: (data) => {
    return request.get('/ip/detail', { params: data })
  },
  // IP列表
  IPList: (data) => {
    return request.get('/ip/lists', { params: data })
  },
  // IP名称搜索
  IPSearchByName: (data) => {
    return request.get('/ip/search-by-name', { params: data })
  },
  // Project删除
  ProjectDelete: (data) => {
    return request.post('/project/del', data)
  },
  // Project录入
  ProjectAdd: (data) => {
    return request.post('/project/form-add', data)
  },
  // Project编辑
  ProjectUpdate: (data) => {
    return request.post('/project/form-update', data)
  },
  // Project详情
  ProjectDetail: (data) => {
    return request.get('/ip/right-projects', { params: data })
  },
  // 新增改编权类别
  AdaptationAdd: (data) => {
    return request.post('/adaptation-right/sub-add', data)
  },
  // 编辑改编权类别
  AdaptationUpdate: (data) => {
    return request.post('/adaptation-right/sub-update', data)
  },
  // 删除子改编权类别
  AdaptationDelete: (data) => {
    return request.post('/adaptation-right/sub-del', data)
  },
  // 子改编权类别列表
  AdaptationList: (data) => {
    return request.get('/adaptation-right/sub-all', { params: data })
  },
  // TOP改编权类别列表
  AdaptationTop: () => {
    return request.get('/adaptation-right/top-all')
  },
  // 公司主体列表
  CompanyList: () => {
    return request.get('/company/all')
  },
  // 权限配置
  PermissionConfig: () => {
    return request.get('/ipr-permission/config')
  },
  // 权限列表
  PermissionList: () => {
    return request.get('/ipr-permission/list')
  },
  // 权限详情
  PermissionDetail: (data) => {
    return request.get('/ipr-permission/detail', { params: data })
  },
  // 权限详情+用户
  PermissionDetailUser: (data) => {
    return request.get('/ipr-permission/detail-and-users', { params: data })
  },
  // 权限添加
  PermissionAdd: (data) => {
    return request.post('/ipr-permission/add', data)
  },
  // 权限编辑
  PermissionUpdate: (data) => {
    return request.post('/ipr-permission/update', data)
  },
  // 权限删除
  PermissionDelete: (data) => {
    return request.post('/ipr-permission/del', data)
  },
  // 导出
  Export: (data) => {
    return request.get('/ip/export-lists', { params: data })
  },
  // 文件上传
  Upload: (data) => {
    return request.post('/upload/upload-attachment', data)
  },
  // 操作日志列表
  LogList: (data) => {
    return request.get('/operation-log/list', { params: data })
  }
}

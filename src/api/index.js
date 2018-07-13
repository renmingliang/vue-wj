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
  // 权限配置
  permissionConfig: () => {
    return request.get('/permission/config')
  },
  // sso所有用户
  userSso: () => {
    return request.get('/sso/all-users')
  },
  // 用户权限列表
  userList: (data) => {
    return request.get('/user/list', { params: data })
  },
  // 添加用户权限
  userAdd: (data) => {
    return request.post('/user/add', data)
  },
  // 修改用户权限
  userUpdate: (data) => {
    return request.post('/user/update-permission', data)
  },
  // 删除用户权限
  userDel: (data) => {
    return request.post('/user/change-status', data)
  },

  // 项目游戏列表
  projectAppList: (data) => {
    return request.post('project/app-list', data)
  },
  // 项目列表
  projectList: (data) => {
    return request.post('/project/list', data)
  },
  // 项目添加
  projectCreate: (data) => {
    return request.post('/project/create', data)
  },
  // 项目编辑
  projectEdit: (data) => {
    return request.post('/project/edit', data)
  },
  // 项目删除
  projectDel: (data) => {
    return request.post('/project/del', data)
  },

  // 问卷状态
  questionStatus: () => {
    return request.get('/question/question-status-list')
  },
  // 问卷状态
  questionType: () => {
    return request.get('/question/question-type-list')
  },
  // 问卷列表
  questionList: (data) => {
    return request.post('/question/question-list', data)
  },
  // 问卷设置创建
  questionCreate: (data) => {
    return request.post('question/question-create', data)
  },
  // 问卷设置编辑
  questionEdit: (data) => {
    return request.post('question/question-edit', data)
  },
  // 问卷设置详情
  questionDetail: (data) => {
    return request.post('/question/question-one', data)
  },
  // 问卷提审
  questionSubmitVerify: (data) => {
    return request.post('/question/question-submit-verify', data)
  },
  // 问卷审核
  questionVerify: (data) => {
    return request.post('/question/question-verify', data)
  },
  // 问卷发布
  questionPublish: (data) => {
    return request.post('/question/question-publish', data)
  },
  // 问卷回收
  questionOver: (data) => {
    return request.post('/question/question-over', data)
  },
  // 问卷复制
  questionCopy: (data) => {
    return request.post('/question/question-copy', data)
  },

  // 发放奖品列表
  awardList: (data) => {
    return request.post('/paper/list', data)
  },
  // CP奖品列表
  itemCpList: (data) => {
    return request.post('/item/cp-item', data)
  },
  // 问卷奖品列表
  itemList: (data) => {
    return request.post('/item/list', data)
  },
  // 奖品添加
  itemCreate: (data) => {
    return request.post('/item/create', data)
  },
  // 奖品编辑
  itemEdit: (data) => {
    return request.post('/item/edit', data)
  },
  // 奖品详情
  itemOne: (data) => {
    return request.post('/item/one', data)
  },
  // 奖品删除
  itemDel: (data) => {
    return request.post('/item/del', data)
  },

  // 导出
  export: (data) => {
    return request.get('/question/export-lists', { params: data })
  },
  // 文件上传
  upload: (data) => {
    return request.post('/upload/upload-attachment', data)
  }
}

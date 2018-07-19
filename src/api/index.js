import request from '@/utils/request'

export default {
  // 登录
  login: (data) => {
    return request.post('/site/get-token', data)
  },
  // 登出--href直接跳转
  logout: '/site/logout',
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
  // 项目详情
  projectDetail: (data) => {
    return request.post('/project/one', data)
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
  questionSettingCreate: (data) => {
    return request.post('/question/question-create', data)
  },
  // 问卷设置编辑
  questionSettingEdit: (data) => {
    return request.post('/question/question-edit', data)
  },
  // 问卷设置详情
  questionSettingDetail: (data) => {
    return request.post('/question/question-one', data)
  },
  // 问卷问题导入
  questionOriginImport: (data) => {
    return request.post('/question/question-origin-import', data, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      transformRequest: [function (data) {
        return JSON.stringify(data)
      }]
    })
  },
  // 问卷问题详情
  questionOriginDetail: (data) => {
    return request.post('/question/question-origin-one', data)
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
  // 问卷删除
  questionDel: (data) => {
    return request.post('/question/question-del', data)
  },

  // CP奖品列表
  itemCpList: (data) => {
    return request.post('/item/cp-item', data)
  },
  // 设置--奖品列表
  itemList: (data) => {
    return request.post('/item/list', data)
  },

  // 问卷答案分析
  answerAnalyse: (data) => {
    return request.post('/data/answer', data)
  },

  // 问卷发放奖品列表
  awardList: (data) => {
    return request.post('/paper/item-list', data)
  },
  // 问卷答题记录
  answerList: (data) => {
    return request.post('/paper/list', data)
  },
  // 问卷答题详情
  answerDetail: (data) => {
    return request.post('/paper/one', data)
  },

  // 文件上传
  upload: (data) => {
    return request.post('/upload/upload-attachment', data)
  }
}

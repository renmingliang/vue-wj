import request from '@/utils/request'

export default {
  // 权限配置
  permissionConfig: () => request.get('/permission/config'),
  // 登出
  logout: () => request.post('/user/logout'),
  // 用户信息
  getInfo: () => request.get('/user/info'),
  // 权限菜单
  getMenu: () => request.get('/user/permission'),
  // 所有用户
  userSso: () => request.get('/user/all-users'),
  // 用户权限列表
  userList: data => request.get('/user/list', { params: data }),
  // 添加用户权限
  userAdd: data => request.post('/user/add', data),
  // 修改用户权限
  userUpdate: data => request.post('/user/update-permission', data),
  // 删除用户权限
  userDel: data => request.post('/user/change-status', data),

  // 项目游戏列表
  projectAppList: data => request.post('project/app-list', data),
  // 项目列表
  projectList: data => request.post('/project/list', data),
  // 项目详情
  projectDetail: data => request.post('/project/one', data),
  // 项目添加
  projectCreate: data => request.post('/project/create', data),
  // 项目编辑
  projectEdit: data => request.post('/project/edit', data),
  // 项目删除
  projectDel: data => request.post('/project/del', data),

  // 问卷状态
  questionStatus: () => request.get('/question/question-status-list'),
  // 问卷状态
  questionType: () => request.get('/question/question-type-list'),
  // 问卷列表
  questionList: data => request.post('/question/question-list', data),
  // 问卷设置创建
  questionSettingCreate: data => request.post('/question/question-create', data),
  // 问卷设置编辑
  questionSettingEdit: data => request.post('/question/question-edit', data),
  // 问卷设置详情
  questionSettingDetail: data => request.post('/question/question-one', data),
  // 问卷问题导入
  questionOriginImport: data => {
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
  questionOriginDetail: data => request.post('/question/question-origin-one', data),
  // 问卷提审
  questionSubmitVerify: data => request.post('/question/question-submit-verify', data),
  // 问卷审核
  questionVerify: data => request.post('/question/question-verify', data),
  // 问卷发布
  questionPublish: data => request.post('/question/question-publish', data),
  // 问卷回收
  questionOver: data => request.post('/question/question-over', data),
  // 问卷复制
  questionCopy: data => request.post('/question/question-copy', data),
  // 问卷删除
  questionDel: data => request.post('/question/question-del', data),

  // CP奖品列表
  itemCpList: data => request.post('/item/cp-item', data),
  // 设置--奖品列表
  itemList: data => request.post('/item/list', data),

  // 问卷答案分析
  answerAnalyse: data => request.post('/data/answer', data),

  // 问卷发放奖品列表
  awardList: data => request.post('/paper/item-list', data),
  // 问卷答题记录
  answerList: data => request.post('/paper/list', data),
  // 问卷答题详情
  answerDetail: data => request.post('/paper/one', data),

  // 文件上传
  upload: data => request.post('/upload/upload-attachment', data)
}

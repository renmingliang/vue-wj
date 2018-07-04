import { param2Obj } from '@/utils'
import { getToken } from '@/utils/auth' // getToken from cookie

const userMap = {
  admin: {
    roles: [
      {
        code: 'manage',
        type: 'menu',
        title: '问卷管理',
        children: [
          {
            code: 'question-create',
            type: 'menu',
            title: '问卷创建',
            permissions: [
              {
                code: 'edit-question',
                type: 'button',
                title: '编辑'
              },
              {
                code: 'delete-question',
                type: 'button',
                title: '删除'
              }
            ]
          },
          {
            code: 'question-list',
            type: 'menu',
            title: '问卷列表'
          },
          {
            code: 'question-setting',
            type: 'menu',
            title: '问卷设置'
          },
          {
            code: 'question-preview',
            type: 'menu',
            title: '问卷预览'
          },
          {
            code: 'question-edit',
            type: 'menu',
            title: '问卷编辑'
          },
          {
            code: 'question-download',
            type: 'menu',
            title: '问卷下载'
          },
          {
            code: 'question-analyse',
            type: 'menu',
            title: '问卷分析'
          },
          {
            code: 'question-handle',
            type: 'menu',
            title: '问卷操作'
          }
        ]
      },
      {
        code: 'award',
        type: 'menu',
        title: '奖励发放',
        children: [
          {
            code: 'award-record',
            type: 'menu',
            title: '发放记录'
          }
        ]
      },
      {
        code: 'setting',
        type: 'menu',
        title: '系统设置',
        children: [
          {
            code: 'project',
            type: 'menu',
            title: '项目设置'
          },
          {
            code: 'permission',
            type: 'menu',
            title: '权限设置'
          }
        ]
      }
    ],
    token: 'admin',
    introduction: '我是超级管理员',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    username: 'Super Admin'
  },
  test: {
    roles: [
      {
        code: 'manage',
        type: 'menu',
        title: '问卷管理',
        children: [
          {
            code: 'question-create',
            type: 'menu',
            title: '问卷创建',
            permissions: [
              {
                code: 'edit-question',
                type: 'button',
                title: '编辑'
              },
              {
                code: 'delete-question',
                type: 'button',
                title: '删除'
              }
            ]
          },
          {
            code: 'question-list',
            type: 'menu',
            title: '问卷列表'
          }
        ]
      },
      {
        code: 'award',
        type: 'menu',
        title: '奖励发放',
        children: [
          {
            code: 'award-record',
            type: 'menu',
            title: '发放记录'
          }
        ]
      }
    ],
    token: 'test',
    introduction: '我是编辑',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    username: 'Normal test'
  }
}

export default {
  loginByUsername: config => {
    const { username } = param2Obj(config.body)
    if (userMap[username]) {
      return {
        code: 10000,
        msg: '登录成功',
        data: userMap[username].token
      }
    } else {
      return {
        code: 10001,
        msg: '该用户不存在',
        data: {}
      }
    }
  },
  getUserInfo: config => {
    const token = getToken()
    if (token) {
      return {
        code: 10000,
        msg: '拉取用户信息成功',
        data: userMap[token]
      }
    } else {
      return {
        code: 10001,
        msg: '该用户没有权限',
        data: []
      }
    }
  },
  getUserPermission: config => {
    const token = getToken()
    if (token) {
      return {
        code: 10000,
        msg: '拉取用户权限操作',
        data: userMap[token].roles
      }
    } else {
      return {
        code: 10001,
        msg: '该用户没有权限',
        data: []
      }
    }
  },
  logout: () => {
    return {
      code: 10000,
      msg: '登出成功',
      data: []
    }
  }
}

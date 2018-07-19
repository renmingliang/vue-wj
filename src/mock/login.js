import { param2Obj } from '@/utils'
import { getToken } from '@/utils/auth' // getToken from cookie

export const permissRouter = [
  {
    code: 'manage',
    name: '问卷管理',
    children: [
      {
        code: 'manage',
        name: '问卷管理',
        children: [
          {
            code: 'setting-create',
            name: '问卷创建',
            permissions: [
              {
                route: 'question/question-create',
                name: '问卷创建'
              }
            ]
          },
          {
            code: 'question-list',
            name: '问卷列表',
            permissions: [
              {
                route: 'question/question-edit',
                name: '问卷编辑'
              },
              {
                route: 'data/answer',
                name: '问卷分析'
              },
              {
                route: 'paper/list',
                name: '问卷下载'
              },
              {
                route: 'question/question-copy',
                name: '复制'
              },
              {
                route: 'question/question-del',
                name: '删除'
              }
            ]
          },
          {
            code: 'question-handle',
            name: '问卷操作',
            permissions: [
              {
                route: 'question/question-submit-verify',
                name: '提交'
              },
              {
                route: 'question/question-verify',
                name: '通过、驳回'
              },
              {
                route: 'question/question-publish',
                name: '发布'
              },
              {
                route: 'question/question-over',
                name: '回收'
              }
            ]
          }
        ]
      },
      {
        code: 'award',
        type: 'menu',
        name: '奖励发放',
        children: [
          {
            code: 'award-record',
            name: '发放记录',
            permissions: [
              {
                route: 'paper/item-list',
                name: '下载'
              }
            ]
          }
        ]
      },
      {
        code: 'setting',
        name: '系统设置',
        children: [
          {
            code: 'project',
            name: '项目设置',
            permissions: [
              {
                route: 'project/create',
                name: '添加项目'
              },
              {
                route: 'project/edit',
                name: '编辑项目'
              },
              {
                route: 'project/del',
                name: '删除项目'
              }
            ]
          },
          {
            code: 'permission',
            name: '权限设置',
            permissions: [
              {
                route: 'user/add',
                name: '新增'
              },
              {
                route: 'user/update-permission',
                name: '编辑'
              },
              {
                route: 'user/change-status',
                name: '删除'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    code: 'award',
    type: 'menu',
    name: '奖励发放',
    children: [
      {
        code: 'award-record',
        name: '发放记录'
      }
    ]
  },
  {
    code: 'setting',
    name: '系统设置',
    children: [
      {
        code: 'project',
        name: '项目设置'
      },
      {
        code: 'permission',
        name: '权限管理'
      }
    ]
  }
]

const userMap = {
  admin: {
    roles: permissRouter,
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
        name: '问卷管理',
        children: [
          {
            code: 'question-create',
            type: 'menu',
            name: '问卷创建'
          },
          {
            code: 'question-list',
            type: 'menu',
            name: '问卷列表',
            permissions: [
              {
                code: 'edit-question',
                type: 'button',
                name: '编辑'
              },
              {
                code: 'delete-question',
                type: 'button',
                name: '删除'
              }
            ]
          }
        ]
      },
      {
        code: 'award',
        type: 'menu',
        name: '奖励发放',
        children: [
          {
            code: 'award-record',
            type: 'menu',
            name: '发放记录'
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

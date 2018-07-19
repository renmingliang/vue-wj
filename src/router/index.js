import Vue from 'vue'
import Router from 'vue-router'

/* Layout */
import Layout from '../views/layout/index'

const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;

Vue.use(Router)

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    code: 'code-name'            the name compare with backend request router-data,
  }
**/
export const constantRouterMap = [
  { path: '/login', name: 'login', component: _import('login/index'), hidden: true },
  { path: '/404', component: _import('errorPage/404'), hidden: true },
  { path: '/401', component: _import('errorPage/401'), hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: _import('dashboard/index')
    }]
  }
]

export default new Router({
  // mode: 'history', // 后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/manage',
    name: 'manage',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    meta: { title: '问卷管理', icon: 'table', code: 'manage' },
    children: [
      {
        path: 'setting-create',
        name: 'setting-create',
        component: _import('question/setting-create'),
        meta: { title: '问卷创建', code: 'setting-create' }
      },
      {
        path: 'setting-edit/:id',
        name: 'setting-edit',
        hidden: true,
        component: _import('question/setting-edit'),
        meta: { title: '问卷设置' }
      },
      {
        path: 'setting-look/:id',
        name: 'setting-look',
        hidden: true,
        component: _import('question/setting-look'),
        meta: { title: '查看设置' }
      },
      {
        path: 'preview-create/:id',
        name: 'preview-create',
        hidden: true,
        component: _import('question/preview-create'),
        meta: { title: '问题创建' }
      },
      {
        path: 'preview-look/:id',
        name: 'preview-look',
        hidden: true,
        component: _import('question/preview-look'),
        meta: { title: '问卷预览' }
      },
      {
        path: 'question-list',
        name: 'question-list',
        component: _import('question/question-list'),
        meta: { title: '问卷列表', code: 'question-list' }
      },
      {
        path: 'question-handle/:id',
        name: 'question-handle',
        hidden: true,
        component: _import('question/question-handle'),
        meta: { title: '问卷操作' }
      },
      {
        path: 'question-download/:id',
        name: 'question-download',
        hidden: true,
        component: _import('question/question-download'),
        meta: { title: '问卷下载' }
      },
      {
        path: 'question-analyse/:id',
        name: 'question-analyse',
        hidden: true,
        component: _import('question/question-analyse'),
        meta: { title: '问卷分析' }
      },
      {
        path: 'question-detail/:id',
        name: 'question-detail',
        hidden: true,
        component: _import('question/question-detail'),
        meta: { title: '答题详情' }
      }
    ]
  },
  {
    path: '/award',
    name: 'award',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    meta: { title: '奖励发放', icon: 'tree', code: 'award' },
    children: [{
      path: 'award-record',
      name: 'award-record',
      component: _import('award/award-record'),
      meta: { title: '发放记录', code: 'award-record' }
    }]
  },
  {
    path: '/setting',
    name: 'setting',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    meta: { title: '系统设置', icon: 'example', code: 'setting' },
    children: [
      {
        path: 'project',
        name: 'project',
        component: _import('project/project'),
        meta: { title: '项目管理', code: 'project' }
      },
      {
        path: 'permission',
        name: 'permission',
        component: _import('permission/permission'),
        meta: { title: '权限设置', code: 'permission' }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

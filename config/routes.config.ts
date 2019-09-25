export interface IRoute {
  path?: string
  title?: string
  children?: IRoute[]
  active?: string
  component?: string
  breadcrumb?: string | null
  exclude?: number[]
  noShowInMenu?: boolean
  routes?: IRoute[]
  redirect?: string
}

export const menuRoutesData: IRoute[] = [
  {
    path: '/dashboard',
    title: '控制面板',
    active: 'dashboard',
    component: './dashboard',
    breadcrumb: '控制面板',
    exclude: [1]
  },
  {
    path: '/account',
    title: '账户管理',
    active: 'account',
    routes: [
      {
        path: '/account',
        redirect: '/account/user',
        noShowInMenu: true
      },
      {
        path: '/account/user',
        title: '个人中心',
        active: 'account',
        component: './account/User',
        breadcrumb: '个人中心'
      },
      {
        path: '/account/list',
        title: '账户列表',
        active: 'account',
        component: './account/List',
        breadcrumb: '账户列表'
      }
    ]
  },
  {
    path: '/help',
    title: '帮助中心',
    active: 'help',
    component: './help',
    breadcrumb: '帮助中心'
  },
  {
    path: '/404',
    title: '找不到页面',
    component: './404',
    noShowInMenu: true
  }
]

export default [
  {
    path: '/',
    component: '../layouts/BasicLayout',
    routes: [
      {
        path: '/',
        redirect: '/dashboard'
      },
      ...menuRoutesData,
      {
        path: '/login',
        component: './login',
        title: '登录'
      }
    ]
  }
]

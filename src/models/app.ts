import { Effect, SubscriptionsMapObject } from 'dva'
import { Reducer } from 'redux'
import pathToRegexp from 'path-to-regexp'
import { router } from 'umi'
import Cookies from 'js-cookie'
import { ConnectState } from '@/models/connect'
import { IRoute, menuRoutesData } from 'config/routes.config'
import { MS_COLLAPSE_STATUS } from '@/utils/constant'

type Action = 'PUSH' | 'REPLACE' | 'POP'
export interface IAppModalState {
  collapsed: boolean
}

interface IModel {
  state: IAppModalState
  subscriptions: SubscriptionsMapObject
  effects: {
    toggleSider: Effect
  }
  reducers: {
    updateState: Reducer<IAppModalState>
  }
}

const notInMainLayouts = ['/login']

const getRouteUnAuthorized = (pathname: string, routerData: IRoute[]) => {
  let unauthorizedRole: number[] = []
  routerData.forEach((route: IRoute) => {
    if (pathToRegexp(`${route.path}(.*)`).test(pathname)) {
      unauthorizedRole = route.exclude || unauthorizedRole
      if (route.routes) {
        unauthorizedRole = unauthorizedRole.concat(
          getRouteUnAuthorized(pathname, route.routes) || unauthorizedRole
        )
      }
    } else if (route.children) {
      unauthorizedRole = unauthorizedRole.concat(getRouteUnAuthorized(pathname, route.children))
    }
  })
  return unauthorizedRole
}

const getInfoCallback = (roleIndex: number, pathname: string) => {
  // 获取当前路径的权限：不允许的角色
  const unauthorizedRole = getRouteUnAuthorized(pathname, menuRoutesData)
  if (unauthorizedRole.includes(roleIndex)) {
    router.replace('/')
  }
}

const AppModel: IModel = {
  state: {
    collapsed: !!(Cookies.get(MS_COLLAPSE_STATUS) === 'true')
  },

  subscriptions: {
    setup({ history, dispatch }) {
      // 刷新页面操作 或 replace 路由后，请求用户信息接口
      history.listen(({ pathname }, action: Action) => {
        const isRefreshedPage = !notInMainLayouts.includes(pathname) && history.action === 'POP' // 排除登录页
        const isReplaceRoute = action === 'REPLACE'
        if (isRefreshedPage || isReplaceRoute) {
          dispatch({
            type: 'user/getAccountInfo',
            callback: (roleIndex: number) => getInfoCallback(roleIndex, pathname)
          })
        }
      })
    }
  },

  effects: {
    *toggleSider({ payload }, { put, select }) {
      const collapsed =
        payload === 'hover' ? false : yield select(({ app }: ConnectState) => !app.collapsed)
      Cookies.set(MS_COLLAPSE_STATUS, collapsed)
      yield put({
        type: 'updateState',
        payload: {
          collapsed
        }
      })
    }
  },

  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload
      }
    }
  }
}

export default AppModel

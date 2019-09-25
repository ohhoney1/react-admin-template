import fetch from 'isomorphic-fetch'
import { notification } from 'antd'
import { IconType } from 'antd/lib/notification'
import router from 'umi/router'
import Cookies from 'js-cookie'
import { stringify } from 'qs'
import pathToRegexp, { Key } from 'path-to-regexp'
import { typeOf, isEmptyObject } from '@/utils/common'
import { MS_LOGIN_TOKEN } from '@/utils/constant'

interface IApiResponse {
  code: number
  message: string
  result?: any
}
type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | string

const codeMessage: MSObjectAny = {
  200: '服务器成功返回请求的数据',
  201: '新建或修改数据成功',
  202: '一个请求已经进入后台排队（异步任务）',
  204: '删除数据成功',
  400: '请求有错误，服务器没有进行新建或修改数据的操作',
  401: '用户没有权限',
  403: '用户得到授权，但是访问是被禁止的',
  404: '请求地址不存在',
  406: '请求的格式不可得',
  422: '当创建一个对象时，发生一个验证错误',
  500: '服务器发生错误，请检查服务器',
  502: '网关错误',
  503: '服务不可用，服务器暂时过载或维护',
  504: '网关超时'
}

const checkStatus = (response: Response) => {
  const { status, statusText } = response
  if (status >= 200 && status < 300) {
    return response
  }

  const errorText = codeMessage[status] || statusText
  if (status === 401) {
    Cookies.remove(MS_LOGIN_TOKEN)
    router.push('/login')
  } else {
    if (status !== 410) {
      notification.error({
        message: `请求错误 ${status}`,
        description: errorText
      })
    }
  }
  const error = new Error(errorText)
  error.name = `${status} \n ${response}`
  throw error
}

/**
 * 检查 api 接口的返回结果。
 * 若返回成功（ok: true），根据 data 的值，包装一层后返回 data；
 * 若不成功（ok: false），根据请求里的 errorType 字段，给出对应的错误类型提示，并返回 null；
 * 若 data 值为 “未登录”，直接退出登录。
 * @param errorType 错误类型
 * @param response api返回的数据
 */
const checkCode = (errorType: IconType = 'error', response: IApiResponse) => {
  const { code, message, result } = response
  if (code === 201) {
    return typeOf(result) === 'null' || result === '' ? true : result
  }

  if (code === 401 || message === '未登录') {
    Cookies.remove(MS_LOGIN_TOKEN)
    router.push('/login')
    window.location.reload()
    return null
  }

  notification[errorType]({
    message: '提示',
    description: message || result
  })
  return null
}

/**
 * 请求信息
 * @param  {string} 请求接口地址
 * @param  {string} 请求方法
 * @param  {string} 处理错误的类型 error warning info
 * @return {object} 包括 data 或者 err 的对象
 */
const request = (url: string, method: Method = 'GET', errorType: IconType = 'error'): object => {
  const newOptions: any = {
    credentials: 'include',
    method
  }
  let compileUrl = ''

  if (['POST', 'PUT', 'DELETE'].includes(method)) {
    const match = pathToRegexp.parse(url)
    compileUrl = pathToRegexp.compile(url)(newOptions.body)
    for (const item of match) {
      if (typeOf(item) === 'object' && (<Key>item).name) {
        delete newOptions.body[(<Key>item).name]
      }
    }

    if (newOptions.body instanceof FormData) {
      newOptions.headers = {
        Accept: 'application/json',
        ...newOptions.headers
      }
    } else {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers
      }
      // newOptions.body = options.headers ? newOptions.body : JSON.stringify(newOptions.body)
    }
  } else if (method === 'GET') {
    const { params = {} } = newOptions
    const shallowData = { ...params }
    const match = pathToRegexp.parse(url)
    // query参数中 : 导致解析失败
    const [host, ...query] = url.split('?')
    compileUrl =
      pathToRegexp.compile(host)(params) + (query.length !== 0 ? `?${query.join('?')}` : '')
    for (const item of match) {
      if (typeOf(item) === 'object' && (<Key>item).name) {
        delete shallowData[(<Key>item).name]
      }
    }
    shallowData.timestamp = new Date().getTime()

    compileUrl = isEmptyObject(shallowData) ? compileUrl : `${compileUrl}&${stringify(shallowData)}`
  }

  return fetch(compileUrl, newOptions)
    .then(checkStatus)
    .then(response => {
      if (newOptions.method === 'DELETE' || response!.status === 204) {
        return response!.text()
      }
      return response!.json()
    })
    .then(checkCode.bind(null, errorType))
    .catch(e => {
      const status = e.name
      if (status === 'TypeError') {
        Cookies.remove(MS_LOGIN_TOKEN)
        router.push('/login')
      }
    })
}

export default request

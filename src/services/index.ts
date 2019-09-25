import { stringify } from 'qs'
import { IconType } from 'antd/lib/notification'
import request from '@/utils/request'
import api from './api'

const gen = (params: string) => {
  let url = params
  let method = 'GET'
  let errorType: IconType = 'error'

  const paramsArray = params.split(' ')
  if (paramsArray.length >= 2) {
    method = paramsArray[0]
    url = paramsArray[1]
  }
  if (paramsArray.length === 3) {
    errorType = (paramsArray[2] || 'error') as IconType
  }

  return (opt: any) => request(`/api${url}?${stringify(opt)}`, method, errorType)
}

const APIFunction: any = {}
for (const key in api) {
  if (api.hasOwnProperty(key)) {
    APIFunction[key] = gen(api[key])
  }
}

export default APIFunction

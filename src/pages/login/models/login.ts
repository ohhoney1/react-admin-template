import router from 'umi/router'
import Cookies from 'js-cookie'
import api from '@/services'
import { Effect } from 'dva'
import { MS_LOGIN_TOKEN } from '@/utils/constant'

interface IModel {
  state: {}
  effects: {
    login: Effect
  }
}

const { authLogin } = api

const LoginModel: IModel = {
  state: {},
  effects: {
    *login({ payload, callback }, { call }) {
      const response = yield call(authLogin, payload)
      if (response) {
        Cookies.set(MS_LOGIN_TOKEN, 'true')
        router.replace('/')
      } else {
        if (callback) callback()
      }
    }
  }
}

export default LoginModel

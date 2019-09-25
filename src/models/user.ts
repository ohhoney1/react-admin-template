import { Effect } from 'dva'
import { Reducer } from 'redux'
import { router } from 'umi'
import api from '@/services'

export interface IAccountInfo {
  user_name: string
  role: number
}

interface IModel {
  state: IAccountInfo
  effects: {
    getAccountInfo: Effect
    logout: Effect
  }
  reducers: {
    updateState: Reducer<IAccountInfo>
  }
}

const { authLogout, accountInfo } = api

const userModel: IModel = {
  state: {
    user_name: '',
    role: 0
  },
  effects: {
    *getAccountInfo({ callback }, { call, put }) {
      const response = yield call(accountInfo)
      const { role } = response
      yield put({
        type: 'updateState',
        payload: response
      })

      if (callback) callback(role)
    },
    *logout(_, { call }) {
      const response = yield call(authLogout)
      if (response) {
        router.push('/login')
      }
    }
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload }
    }
  }
}

export default userModel

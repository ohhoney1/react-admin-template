/* eslint-disable @typescript-eslint/generic-type-naming */
/* eslint-disable @typescript-eslint/interface-name-prefix */
import { RouterTypes } from 'umi'
import { AnyAction } from 'redux'
import { IRoute } from 'umi-types'
import { EffectsCommandMap } from 'dva'
import { match } from 'react-router-dom'
import { IAppModalState } from '@/models/app'
// 账号管理
import { IAccountInfo } from '@/models/user'

export interface ConnectState {
  loading: Loading
  app: IAppModalState
  user: IAccountInfo
}

export { IAppModalState, IAccountInfo }

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: ConnectState) => T) => T }
) => void

export type Dispatch = <P = any, C = (payload: P) => void>(action: {
  type: string
  payload?: P
  callback?: C
  [key: string]: any
}) => any

export interface Loading {
  global: boolean
  effects: { [key: string]: boolean }
  models: {
    app?: boolean
    user?: boolean
  }
}

export interface ConnectProps<P extends { [K in keyof P]?: string } = {}>
  extends Partial<RouterTypes<IRoute>> {
  dispatch?: Dispatch
  match?: match<P>
  loading?: boolean
}

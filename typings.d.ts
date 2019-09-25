/* eslint-disable @typescript-eslint/interface-name-prefix */
declare module '*.css'
declare module '*.less'
declare module '*.png'
declare module '*.jpg'
declare module '*.svg'

// 扩展 Location ，支持 query 字段
interface MSLocation extends Location {
  query: any
}

// 针对一类常量对象，允许任意的 key
interface MSObjectAny {
  [propName: string]: any
}

interface IPagination {
  total: number
  current: number
  pageSize: number
}

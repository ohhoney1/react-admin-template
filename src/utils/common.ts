import { parse } from 'qs'

// 验证数据的类型
export const typeOf = (obj: any): string => {
  const map: any = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object',
    '[object Symbol]': 'symbol'
  }
  return map[Object.prototype.toString.call(obj)]
}

// 简单判断一个对象是都为空对象（忽略不可枚举属性）
export const isEmptyObject = (obj: object): boolean => {
  if (!obj) return true
  return obj && Object.keys(obj).length === 0
}

// 获取url参数对象
export const getSearchParams = (search: string) => parse(search, { ignoreQueryPrefix: true })

// 文件下载
export const downloadFiles = (url: string, multiple?: boolean) => {
  if (multiple) {
    // 支持多个文件同时下载。利用 iframe 标签不会影响的特性，a 标签就不行。
    const iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    iframe.style.height = '0'
    iframe.src = url
    document.body.appendChild(iframe)
    setTimeout(() => {
      iframe.remove()
    }, 5 * 60 * 1000)
  } else {
    const a = document.createElement('a')
    a.style.display = 'none'
    a.href = url
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }
}

// 延迟多少秒执行
export const delay = (millSeconds: number) => {
  return new Promise(function(resolve) {
    setTimeout(resolve, millSeconds)
  })
}

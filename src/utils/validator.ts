export interface IRule {
  field: string
  fullField: string
  type: string | number | boolean
  validator: Function
}

const PHONE_NUMBER_REG = /^1[345789]\d{9}$/

// example
export const validatePhoneNumber = (rule: IRule, value = '', callback: Function): void => {
  if (!value) {
    callback('手机号码不能为空')
  } else if (PHONE_NUMBER_REG.test(value)) {
    callback()
  } else {
    callback('手机号码格式不正确')
  }
}

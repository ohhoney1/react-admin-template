import React from 'react'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'

const LoginLayout: React.FC = props => (
  // eslint-disable-next-line react/destructuring-assignment
  <ConfigProvider locale={zhCN}>{props.children}</ConfigProvider>
)

export default LoginLayout

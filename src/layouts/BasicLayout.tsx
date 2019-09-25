import React from 'react'
import { ConfigProvider, Layout } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import { connect } from 'dva'
import { ConnectState, IAppModalState } from '@/models/connect'
import LoginLayout from './LoginLayout'
import BasicHeader from './components/BasicHeader'
import BasicSider from './components/BasicSider'
import Breadcrumbs from './components/Breadcrumbs'
import styles from './styles/BasicLayout.less'

interface IProps extends React.Props<any>, IAppModalState {
  location: Location
}

const BasicLayout: React.FC<IProps> = props => {
  const { children, collapsed } = props

  // 针对登录页面，单独设置布局
  const loginLayoutRoutes = ['/login']
  if (loginLayoutRoutes.includes(window.location.pathname)) {
    return <LoginLayout {...props} />
  }

  return (
    <ConfigProvider locale={zhCN}>
      <Layout>
        <BasicHeader />
        <Layout>
          <BasicSider pathname={window.location.pathname} />
          <Layout
            className={styles.main_container_wrapper}
            style={{ marginLeft: collapsed ? '45px' : '175px' }}
          >
            <Breadcrumbs />
            <div className={styles.main_container}>{children}</div>
          </Layout>
        </Layout>
      </Layout>
    </ConfigProvider>
  )
}

export default connect(({ app }: ConnectState) => ({
  collapsed: app.collapsed
}))(BasicLayout)

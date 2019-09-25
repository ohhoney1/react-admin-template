import React from 'react'
import { Layout, Icon, Modal } from 'antd'
import { connect, useDispatch } from 'dva'
import Link from 'umi/link'
import classnames from 'classnames'

import { ConnectState, IAppModalState, IAccountInfo } from '@/models/connect'
import LogoImg from '@/assets/images/logo.png'
import styles from '../styles/BasicHeader.less'

interface IProps extends IAppModalState, Partial<IAccountInfo> {}

const { Header } = Layout
const { confirm } = Modal

const BasicHeader: React.FC<IProps> = props => {
  const dispatch = useDispatch()
  const { collapsed, user_name } = props

  const toggleCollapse = () => {
    dispatch({
      type: 'app/toggleSider'
    })
  }

  const handleLogout = () => {
    confirm({
      title: '提示',
      content: '确认退出登录吗？',
      onOk: () => {
        dispatch({
          type: 'user/logout'
        })
      }
    })
  }

  return (
    <Header className={styles.header}>
      <div className={classnames(styles.left, { [styles.logo_hide]: collapsed })}>
        <Link to="/" className={styles.logo_wrapper}>
          <img src={LogoImg} alt="logo" />
        </Link>
        <Icon
          type={collapsed ? 'menu-unfold' : 'menu-fold'}
          className={styles.icon_fold}
          onClick={toggleCollapse}
        />
      </div>
      <div className={styles.right}>
        <span className={styles.username}>{user_name}</span>
        <Icon type="logout" title="退出登录" onClick={handleLogout} />
      </div>
    </Header>
  )
}

export default connect(({ app, user }: ConnectState) => ({
  collapsed: app.collapsed,
  user_name: user.user_name
}))(BasicHeader)

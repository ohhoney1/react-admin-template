import React, { useState, useEffect } from 'react'
import { Layout, Menu, Icon } from 'antd'
import { connect } from 'dva'
import Link from 'umi/link'
import MSIcon from '@/components/MSIcon'
import { menuRoutesData, IRoute } from 'config/routes.config'
import styles from '../styles/BasicSider.less'
import { ConnectState, IAppModalState, IAccountInfo } from '@/models/connect'

import DashboardSvg from '@/assets/icons/menu/dashboard.svg'
import DashboardActiveSvg from '@/assets/icons/menu/dashboard_active.svg'
import AccountSvg from '@/assets/icons/menu/account.svg'
import AccountActiveSvg from '@/assets/icons/menu/account_active.svg'
import HelpSvg from '@/assets/icons/menu/help.svg'
import HelpActiveSvg from '@/assets/icons/menu/help_active.svg'

interface IProps extends IAppModalState, Partial<IAccountInfo> {
  pathname: string
}

const { Sider } = Layout
const { SubMenu, Item } = Menu

const mapNameToIcon: MSObjectAny = {
  dashboard: DashboardSvg,
  dashboard_active: DashboardActiveSvg,
  account: AccountSvg,
  account_active: AccountActiveSvg,
  help: HelpSvg,
  help_active: HelpActiveSvg
}

// 获取当前路由的父级。比如：'/threats/events' -> 'threats'
const getRouteFather = (pathname: string) => pathname.split('/')[1]

const getCurrentActiveMenuItemKey = (pathname: string) => {
  const pathArray = pathname.split('/')
  return pathArray[2] ? `/${pathArray[1]}/${pathArray[2]}` : `/${pathArray[1]}`
}

// 根据路由配置项，动态生成菜单
const getMenusNode = (pathname: string, role: number) =>
  menuRoutesData.map((routeItem: IRoute, index: number) => {
    const { active, routes, exclude, title: t, path, noShowInMenu } = routeItem

    if (noShowInMenu) return null

    const activeMenuName = active === getRouteFather(pathname) ? `${active}_active` : active
    const icon = MSIcon(mapNameToIcon[activeMenuName || 'dashboard'])

    if (routes) {
      if (exclude && exclude.includes(role)) return null
      return (
        <SubMenu
          key={active}
          title={
            <span>
              <Icon component={icon} />
              <span>{t}</span>
            </span>
          }
        >
          {routes.map(
            (item: IRoute) =>
              !item.noShowInMenu &&
              !(item.exclude && item.exclude.includes(role)) && (
                <Item key={item.path}>
                  <Link to={item.path!} replace={window.location.pathname === item.path}>
                    {item.title}
                  </Link>
                </Item>
              )
          )}
        </SubMenu>
      )
    } else {
      if (exclude && exclude.includes(role)) return null
      return (
        <Item key={path}>
          <Link to={path!} replace={window.location.pathname === path}>
            <Icon component={icon} />
            <span>{t}</span>
          </Link>
        </Item>
      )
    }
  })

// 遍历拿到左右的根菜单
const rootSubmenuKeys = menuRoutesData.map(menu => menu.active).filter(Boolean)

const BasicSider: React.FC<IProps> = props => {
  const { collapsed, pathname, role } = props
  const [fold, setFold] = useState<boolean>(collapsed)
  const [currentMenu, setCurrentMenu] = useState<string[]>([getCurrentActiveMenuItemKey(pathname)])
  const [openKeys, setOpenKeys] = useState<string[]>([getRouteFather(pathname)])

  useEffect(() => {
    setCurrentMenu([getCurrentActiveMenuItemKey(pathname)])
  }, [pathname])

  useEffect(() => {
    setFold(collapsed)
  }, [collapsed])

  const handleOpenChange = (keys: string[]) => {
    const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1) || ''
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys)
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : [])
    }
  }

  return (
    <Sider width={175} collapsedWidth={45} collapsed={fold} className={styles.sider}>
      <Menu
        mode="inline"
        theme="dark"
        inlineIndent={20}
        openKeys={openKeys}
        defaultSelectedKeys={currentMenu}
        onOpenChange={handleOpenChange}
      >
        {getMenusNode(pathname, role || 0)}
      </Menu>
    </Sider>
  )
}

export default connect(({ app, user }: ConnectState) => ({
  collapsed: app.collapsed,
  role: user.role
}))(BasicSider)

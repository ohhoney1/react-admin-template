import React from 'react'
import Link from 'umi/link'
import withBreadcrumbs, {
  InjectedProps,
  BreadcrumbsProps,
  BreadcrumbsRoute
} from 'react-router-breadcrumbs-hoc'
import { menuRoutesData, IRoute } from 'config/routes.config'
import styles from '../styles/Breadcrumbs.less'

interface IBreadcrumbsRoute extends BreadcrumbsRoute {
  routes?: BreadcrumbsProps[]
}

const getBreadcrumb = (currentRoutes: IRoute[]): any => {
  return currentRoutes.map(({ path, breadcrumb, title, routes }) => {
    if (routes && routes.length > 0) {
      return {
        path,
        breadcrumb: title,
        routes: getBreadcrumb(routes)
      }
    }
    return {
      path,
      breadcrumb
    }
  })
}

const routeConfig: IBreadcrumbsRoute[] = [
  {
    path: '/',
    breadcrumb: '首页',
    routes: getBreadcrumb(menuRoutesData)
  }
]
const customConfig = {
  excludePaths: ['/page-that-hide-bc'],
  disableDefaults: true
}

const Breadcrumbs = ({ breadcrumbs }: InjectedProps<any>) => {
  // 排除特殊页面，不用显示面包屑
  const hideBreadcrumbList = ['/page-that-hide-bc', '/page-that-hide-bc2']
  const hideBc = hideBreadcrumbList.includes(breadcrumbs[0].location.pathname)
  if (hideBc) return null

  return (
    <div className={`${styles.breadcrumbs} breadcrumbs_wrapper`}>
      {breadcrumbs.map(({ breadcrumb, match }: BreadcrumbsProps, index: number) => (
        <span key={match.url}>
          <Link to={match.url}>{breadcrumb}</Link>
          {index < breadcrumbs.length - 1 && <i> &gt; </i>}
        </span>
      ))}
    </div>
  )
}

export default withBreadcrumbs(routeConfig, customConfig)(Breadcrumbs)

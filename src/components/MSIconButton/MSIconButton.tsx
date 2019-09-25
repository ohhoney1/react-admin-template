import React from 'react'
import { Icon } from 'antd'
import { CustomIconComponentProps } from 'antd/lib/icon'
import classnames from 'classnames'
import MSIcon from '../MSIcon'
import styles from './index.less'

import DetailSvg from '@/assets/icons/common/detail.svg'
import DownloadSvg from '@/assets/icons/common/download.svg'
import DeleteSvg from '@/assets/icons/common/delete.svg'
import EditSvg from '@/assets/icons/common/edit.svg'
import UploadSvg from '@/assets/icons/common/upload.svg'

interface IProps extends React.HTMLAttributes<any> {
  type?: string
  svg?: React.ComponentType
  svgProps?: CustomIconComponentProps
  size?: 'large'
  disabled?: boolean
  active?: boolean
  className?: string
  onClick?: (e?: any) => void
}

const mapTypeToSvg: any = {
  detail: DetailSvg,
  download: DownloadSvg,
  delete: DeleteSvg,
  edit: EditSvg,
  upload: UploadSvg
}

const MSIconButton: React.FC<IProps> = ({
  title,
  type,
  svg,
  svgProps,
  size,
  disabled,
  active,
  className,
  onClick
}) => {
  let svgComponent = null
  if (type && mapTypeToSvg[type]) {
    svgComponent = mapTypeToSvg[type]
  } else if (svg) {
    svgComponent = svg
  } else {
    throw new Error('调用 MSIconButton 组件时，请确认能找到对应的 icon')
  }

  const buttonCls = classnames(styles.ms_icon_button, className, {
    [styles.large]: size === 'large',
    [styles.disabled]: !!disabled,
    [styles.active]: !!active
  })

  return (
    <Icon
      className={buttonCls}
      title={title}
      component={MSIcon(svgComponent, svgProps)}
      onClick={onClick}
    />
  )
}

export default MSIconButton

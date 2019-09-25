import React from 'react'
import { Button } from 'antd'
import Link from 'umi/link'
// import Image404 from '@/assets/images/404.png'
import styles from './index.less'

const NotFound = () => (
  <div className={styles.wrapper}>
    {/* <img src={Image404} alt="not found" /> */}
    <div className={styles.desc}>抱歉，你访问的页面不存在</div>
    <Link to="/">
      <Button type="primary">返回首页</Button>
    </Link>
  </div>
)

export default NotFound

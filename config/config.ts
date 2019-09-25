import { IConfig } from 'umi-types'
import routes from './routes.config'
import theme from './theme.config'
import webpack from './webpack.config'

const config: IConfig = {
  treeShaking: true,
  plugins: [
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: true,
        dynamicImport: {
          webpackChunkName: true
        },
        title: {{projectName}},
        dll: true
      }
    ]
  ],
  targets: {
    ie: 9
  },
  proxy: {
    '/api': {
      target: 'https://127.0.0.1',
      secure: false,
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/api'
      }
    }
  },
  routes,
  theme,
  ...webpack
}

export default config

import path from 'path'

const resolve = (p: string) => path.resolve(__dirname, p)

export default {
  alias: {
    vars: resolve('../src/themes/vars.less'),
    config: resolve('../config')
  },
  urlLoaderExcludes: [/\.svg$/],
  chainWebpack(config: any, { webpack }: any) {
    config.module
      .rule('svg')
      .test(/\.svg(\?v=\d+\.\d+\.\d+)?$/)
      .use([
        {
          loader: 'babel-loader'
        },
        {
          loader: '@svgr/webpack',
          options: {
            babel: false,
            icon: true
          }
        }
      ])
      .loader(require.resolve('@svgr/webpack'))

    config.plugin('ignore').use(webpack.IgnorePlugin, [/^\.\/locale$/, /moment$/])
  }
}

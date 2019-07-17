const path = require('path')
const ExtractPlugin = require('extract-text-webpack-plugin')
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')
// 打包不会有 js 输出
const VueServerPlugin = require('vue-server-renderer/server-plugin')
const isDev = process.env.NODE_ENV === 'development'
const plugins = [
  new ExtractPlugin('styles.[contentHash:8].css'),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(
      process.env.NODE_ENV || 'development'
    ),
    'process.env.VUE_ENV': '"server"'
  })
]

if (isDev) {
  plugins.push(new VueServerPlugin())
}

const config = merge(baseConfig, {
  // 执行环境
  target: 'node',
  entry: path.join(__dirname, '../client/server-entry.js'),
  // 出错在哪一行
  devtool: 'source-map',
  output: {
    // 通过 module.export 放出去
    libraryTarget: 'commonjs2',
    // 不需要哈希
    filename: 'server-entry.js',
    // 输出目录
    path: path.join(__dirname, '../server-build')
  },
  // 不要打包指定的文件
  externals: Object.keys(require('../package.json').dependencies),
  module: {
    rules: [
      {
        test: /\.styl/,
        use: ExtractPlugin.extract({
          fallback: 'vue-style-loader',
          use: [
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true
              }
            },
            'stylus-loader'
          ]
        })
      }
    ]
  },
  plugins
})

config.resolve = {
  alias: {
    model: path.join(__dirname, '../client/model/server-model.js')
  }
}

module.exports = config

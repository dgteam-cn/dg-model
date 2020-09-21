const isDev = process.env.NODE_ENV !== 'production'

const path = require('path')

const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const templateContent = `
<!DOCTYPE html>
<html>
    <head>        
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">
        <title>DGTEAM/MODEL</title>
    </head>
    <body>
        <div id="app">
            <h1>DGTEAM/MODEL</h1>
            <h3>window._index</h3>
        </div>
    </body>
</html>
`

const plugins = isDev ? [
    new HtmlWebpackPlugin({ templateContent }) // 测试环境下使用 html 热更新服务调试
] : [
    new CleanWebpackPlugin() // 正式打包
]

module.exports = {
    entry: {
        "index": "./src/library/main.js",
        "mixins/store": "./src/mixins/store.js",
    },
    output: {      
        filename: '[name].js',
        path: path.resolve(__dirname,'../dist'),
        library: isDev ? '_[name]' : undefined,
        libraryTarget: 'umd'
    },
    resolve: {
        extensions: ['.ts','.tsx','.js']
    },
    externals: {
        // 'vue': {umd: 'vue'},
        // 'dg-helper': {umd: 'dg-helper'},
        // 'dg-helper': 'dg-helper'
    },
    //target: 'node',
    // target: 'electron-renderer', //isDev ? 'web' : 'async-node',
    module: {
        rules: [
            {
                test: /\.js$/, 
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                '@babel/preset-env'
                            ],
                            plugins: [
                                '@babel/plugin-proposal-class-properties'
                            ]
                        }
                    }
                ],
            },
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.tex?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    devtool: isDev ? 'inline-source-map' : false,
    devServer: {
        contentBase: './dist',
        stats: 'errors-only',
        compress: false,
        host: 'localhost',
        port: 8090
    },
    plugins
}
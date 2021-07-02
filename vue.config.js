const path = require("path")

module.exports = {
    pages: {
        index: {
            entry: '/example/main.js', // page 的入口
            template: '/example/index.html' // 模板来源
        }
    },
    publicPath: '/example',
    chainWebpack: config => {
        config.resolve.alias
            .set("@", path.join(__dirname, '/'))
            .set("~", path.join(__dirname, '/example'))
    }
}
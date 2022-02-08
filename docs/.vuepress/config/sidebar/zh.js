module.exports = {
    '/zh': [
        {
            // text: '基础',
            children: [
                '/zh/introduction.md', // 介绍
                '/zh/installation.md', // 安装
                '/zh/dashboard.md', //  在线调试
                '/zh/changelog.md' // 更新日志
            ]
        },
        {
            text: '教程',
            children: [
                {text: '声明模型', link: '/zh/statement.md'}, // 声明模型
                {text: '调用模型', link: '/zh/apis.md'}, // 调用模型
                {text: '内置对象', link: '/zh/objects.md'} // 内置对象
            ]
        },
        {
            text: '进阶',
            children: [
                {text: '网络适配器'}
            ]
        },
        {
            text: '相关文献',
            children: [
                {text: '后端接口规范'},
                {text: '性能优化'}
            ]
        }
    ]
}
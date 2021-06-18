module.exports = {
    extends: [
        "@dgteam/eslint-config-team"
    ],
    globals: {
        _: true
    },
    parser: "esprima",
    parserOptions: {
        // ECMAScript 版本 6 7 8 9 10
        ecmaVersion: 7,
        sourceType: "module", // script: node 环境   module: browser 环境
        ecmaFeatures: {
            // globalReturn: false, // 允许在全局作用域下使用 return 语句
            // impliedStrict: false, // 启用全局 strict mode (如果 ecmaVersion 是 5 或更高)
            // jsx: false, // 启用 JSX
            experimentalObjectRestSpread: false // 启用实验性的 object rest/spread properties 支持
        },
        parser: 'babel-eslint'
    }
}

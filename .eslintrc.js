module.exports = {
    root: true,
    extends: ["eslint-config-egg", "plugin:vue/recommended", "eslint:recommended"],
    env: {
        browser: true,
        node: true,
        es6: true
    },
    rules: {

        // Possible Errors
        'for-direction': 2,             // 强制 “for” 循环中更新子句的计数器朝着正确的方向移动
        'getter-return': 2,             // 强制 getter 函数中出现 return 语句
        'no-async-promise-executor': 2, // 禁止使用异步函数作为 Promise executor
        'no-await-in-loop': 0,          // 禁止在循环中出现 await
        'no-compare-neg-zero': 2,       // 禁止与 -0 进行比较
        'no-cond-assign': 2,            // 禁止条件表达式中出现赋值操作符
        'no-console': 1,                // console 警告
        'no-debugger': 2,               // 禁用 debugger 
        'no-extra-semi': 2,             // FIX 禁止不必要的分号（连续输入多个分号）

        // Stylistic Issues 风格	
        
        // 'array-bracket-newline': ['error', 'never'],  // Fix 在数组开括号后和闭括号前强制换行
        'array-bracket-spacing': ["error", "never"],     // Fix 强制数组方括号中使用一致的空格
        // 'array-element-newline': ['error', 'never'],  // Fix 强制数组元素间出现换行
        // 'block-spacing': ['error', 'never'],          // Fix 禁止或强制在代码块中开括号前和闭括号后有空格
        // 'brace-style': ['error', 'never'],            // Fix 强制在代码块中使用一致的大括号风格
        // 'camelcase': ['error', 'never'],              // 强制使用骆驼拼写法命名约定
        // 'capitalized-comments': ['error', 'never'],   // Fix 强制或禁止对注释的第一个字母大写
        'comma-dangle': ["error", "never"],              // Fix 要求或禁止末尾逗号
        'comma-spacing': ["error", {before: false, after: true}], // Fix 强制在逗号前后使用一致的空格
        // 'comma-style': ['error', 'never'], // Fix 强制使用一致的逗号风格
        'computed-property-spacing': ['error', 'never'], // Fix 强制在计算的属性的方括号中使用一致的空格
        // 'consistent-this': ['error', 'never'], // 当获取当前执行环境的上下文时，强制使用一致的命名
        // 'eol-last': ['error', 'never'], // Fix 要求或禁止文件末尾存在空行
        'func-call-spacing': ['error', 'never'], // Fix 要求或禁止在函数标识符和其调用之间有空格
        // 'func-name-matching': ['error', 'never'], // 要求函数名与赋值给它们的变量名或属性名相匹配
        // 'func-names': ['error', 'never'], // 要求或禁止使用命名的 function 表达式
        // 'func-style': ['error', 'never'], // 强制一致地使用 function 声明或表达式
        'function-paren-newline': ['error', 'never'], // Fix 强制在函数括号内使用一致的换行
        // 'id-blacklist': 0, // 禁用指定的标识符
        // 'id-length': 0, // 强制标识符的最小和最大长度
        // 'id-match': 0, // 要求标识符匹配一个指定的正则表达式
        'implicit-arrow-linebreak': ['error', 'beside'], // Fix 强制隐式返回的箭头函数体的位置
        'indent': ['error', 4], // Fix 强制使用一致的缩进
        'jsx-quotes': ['error', "prefer-double"], // Fix 强制在 JSX 属性中一致地使用双引号或单引号
        'key-spacing': ['error', {beforeColon: false, afterColon: true, mode: 'strict'}], // Fix 强制在对象字面量的属性中键和值之间使用一致的间距
        'keyword-spacing': ['error', {before: true, after: true}], // Fix 强制在关键字前后使用一致的空格
        // 'line-comment-position': 0, // 强制行注释的位置
        'linebreak-style': ['error', 'unix'], // Fix 强制使用一致的换行风格
        'lines-around-comment': ['error', 'beforeBlockComment'], // Fix 要求在注释周围有空行
        // 'lines-between-class-members': ["error", "always"], // Fix 要求或禁止类成员之间出现空行
        // 'max-depth': ['error', 5], // 强制可嵌套的块的最大深度
        // 'max-len': ['error', {code: 80, tabWidth: 4}], // 强制一行的最大长度
        // 'max-lines': ['error', 300], // 强制最大行数
        // 'max-lines-per-function':  ['error', {'max': 100, 'skipBlankLines': true}], // 强制函数最大代码行数
        // 'max-nested-callbacks': ['error', 4], // 强制回调函数最大嵌套深度
        // 'max-params': 0, // 强制函数定义中最多允许的参数数量
        // 'max-statements': 0, // 强制函数块最多允许的的语句数量
        // 'max-statements-per-line': 0, // 强制每一行中所允许的最大语句数量
        // 'multiline-comment-style': 0, // Fix 强制对多行注释使用特定风格
        // 'multiline-ternary': 0, // 要求或禁止在三元操作数中间换行
        // 'new-cap': 0, // Fix 要求构造函数首字母大写
        'new-parens': ['error', 'always'], // Fix 强制或禁止调用无参构造函数时有圆括号
        // 'newline-per-chained-call': 0, // 要求方法链中每个调用都有一个换行符
        'no-array-constructor': 'error', // 禁用 Array 构造函数
        // 'no-bitwise': 0, // 禁用按位运算符
        // 'no-continue': 0, // 禁用 continue 语句
        // 'no-inline-comments': 0, // 禁止在代码后使用内联注释
        'no-lonely-if': 'error', // Fix 禁止 if 作为唯一的语句出现在 else 语句中
        // 'no-mixed-operators': 0, // 禁止混合使用不同的操作符
        'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'], // 禁止空格和 tab 的混合缩进
        // 'no-multi-assign': 0, // 禁止连续赋值
        'no-multiple-empty-lines': ['error', {max: 2}], // Fix 禁止出现多行空行
        // 'no-negated-condition': 0, // 禁用否定的表达式
        // 'no-nested-ternary': 0, // 禁用嵌套的三元表达式
        'no-new-object': 'error', // 禁用 Object 的构造函数
        // 'no-plusplus': 0, // 禁用一元操作符 ++ 和 --
        // 'no-restricted-syntax': 0, //禁用特定的语法
        // 'no-tabs': 0, //禁用 tab
        // 'no-ternary': 0, // 禁用三元操作符
        // 'no-trailing-spaces': 0,                              // Fix 禁用行尾空格
        // 'no-underscore-dangle': 0,                            // 禁止标识符中有悬空下划线
        'no-unneeded-ternary': 'error',                          // Fix 禁止可以在有更简单的可替代的表达式时使用三元操作符
        'no-whitespace-before-property': 'error',                // Fix 禁止属性前有空白
        'nonblock-statement-body-position': ['error', 'beside'], // Fix 强制单个语句的位置
        // 'object-curly-newline': 0,                            // Fix 强制大括号内换行符的一致性
        'object-curly-spacing': ['error', 'never'],              // Fix 强制在大括号中使用一致的空格
        // 'object-property-newline': 0,                         // Fix 强制将对象的属性放在不同的行上
        // 'one-var': 0,                                         // Fix 强制函数中的变量要么一起声明要么分开声明
        // 'one-var-declaration-per-line': 0, // Fix 要求或禁止在变量声明周围换行
        // 'operator-assignment': 0,          // Fix 要求或禁止在可能的情况下使用简化的赋值操作符
        // 'operator-linebreak': 0,           // Fix 强制操作符使用一致的换行符
        // 'padded-blocks': 0,                // Fix 要求或禁止块内填充
        // 'padding-line-between-statements': 0, // Fix 要求或禁止在语句间填充空行
        // 'prefer-object-spread': 0, // Fix 禁止使用以对象字面量作为第一个参数的 Object.assign，优先使用对象扩展。
        // 'quote-props': 0, // Fix 要求对象字面量属性名称用引号括起来
        // 'quotes': 0, // Fix 强制使用一致的反勾号、双引号或单引号
        'semi': ['error', 'always'], // Fix 要求或禁止使用分号代替 ASI
        'semi-spacing': 'error', // Fix 强制分号之前和之后使用一致的空格
        'semi-style': ['error', 'last'], // Fix 强制分号的位置
        // 'sort-keys': 0, // 要求对象属性按序排列
        // 'sort-vars': 0, // Fix 要求同一个声明块中的变量按顺序排列
        // 'space-before-blocks': 0, // Fix 强制在块之前使用一致的空格
        // 'space-before-function-paren': 0, // Fix 强制在 function 的左括号之前使用一致的空格
        // 'space-in-parens': 0, // Fix 强制在圆括号内使用一致的空格
        // 'space-infix-ops': 0, // Fix 要求操作符周围有空格
        // 'space-unary-ops': 0, // Fix 强制在一元操作符前后使用一致的空格
        // 'spaced-comment': 0, // Fix 强制在注释中 // 或 /* 使用一致的空格
        'switch-colon-spacing': ['error', {after: true, before: false}], // Fix 强制在 switch 的冒号左右有空格
        // 'template-tag-spacing': 0, // Fix 要求或禁止在模板标记和它们的字面量之间有空格
        // 'unicode-bom': 0, // Fix 要求或禁止 Unicode 字节顺序标记 (BOM)
        // 'wrap-regex': 0, // Fix 要求正则表达式被括号括起来

        // ECMAScript 6
    }
}

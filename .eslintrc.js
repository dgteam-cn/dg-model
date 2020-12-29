module.exports = {

    extends: [
        // "eslint-config-egg",
        // "plugin:vue/recommended",
        "eslint:recommended"
    ],

    // 定义了一组预定义的全局变量
    env: {
        commonjs: true,
        browser: true,
        node: true,
        es6: true
    },

    // 全局变量
    globals: {
        _: true
    },

    // 解析器
    parser: "esprima",

    // 指定语言版本为和模块类型
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
    },

    // 验证规则
    rules: {


        /**
         * @name Possible Errors
         * @description 这些规则与 JavaScript 代码中可能的错误或逻辑错误有关
         */

        "for-direction": "error", // 强制 “for” 循环中更新子句的计数器朝着正确的方向移动
        "getter-return": "error", // 强制 getter 函数中出现 return 语句
        // "no-async-promise-executor": "error", // 禁止使用异步函数作为 Promise executor
        // "no-await-in-loop": "error", // 禁止在循环中出现 await
        "no-compare-neg-zero": "error",       // 禁止与 -0 进行比较
        "no-cond-assign": "error", // 禁止条件表达式中出现赋值操作符
        "no-console": ["warn", {"allow": ["warn", "error"]}], // console 警告
        "no-constant-condition": "error", // 禁止在条件中使用常量表达式
        "no-control-regex": "error", //禁止在正则表达式中使用控制字符
        "no-debugger": "warn", // 禁用 debugger 
        "no-dupe-args": "error", // 禁止 function 定义中出现重名参数
        "no-dupe-keys": "error", // 禁止对象字面量中出现重复的 key
        "no-duplicate-case": "error", // 禁止重复的 case
        "no-empty": "off", // 禁止出现空语句块
        "no-empty-character-class": "error", // 禁止在正则表达式中使用空字符集
        "no-ex-assign": "error", // 禁止对 catch 子句的参数重新赋值
        "no-extra-boolean-cast": "error", // 禁止不必要的布尔转换
        // "no-extra-parens": "error", // 禁止不必要的括号
        "no-extra-semi": "error", // [Fix] 禁止不必要的分号（连续输入多个分号）
        // "no-func-assign": "error", // 禁止对 function 声明重新赋值
        // "no-inner-declarations": "error", // 禁止在嵌套的块中出现变量声明或 function 声明
        // "no-invalid-regexp": "error", // 禁止 RegExp 构造函数中存在无效的正则表达式字符串
        "no-irregular-whitespace": "off", // 禁止不规则的空白
        // "no-misleading-character-class": "error", // 不允许在字符类语法中出现由多个代码点组成的字符
        "no-obj-calls": "error", // 禁止把全局对象作为函数调用
        "no-prototype-builtins": "error", // 禁止直接调用 Object.prototypes 的内置属性
        "no-regex-spaces": "error", // [Fix] 禁止正则表达式字面量中出现多个空格
        "no-sparse-arrays": "error", // 禁用稀疏数组
        "no-template-curly-in-string": "error", // 禁止在常规字符串中出现模板字面量占位符语法
        "no-unexpected-multiline": "error", // 禁止出现令人困惑的多行表达式
        "no-unreachable": "error", // 禁止在 return、throw、continue 和 break 语句之后出现不可达代码
        "no-unsafe-finally": "error", // 禁止在 finally 语句块中出现控制流语句
        "no-unsafe-negation": "error", // [Fix] 禁止对关系运算符的左操作数使用否定操作符
        // "require-atomic-updates": "error", // 禁止由于 await 或 yield的使用而可能导致出现竞态条件的赋值
        "use-isnan": "error", // 要求使用 isNaN() 检查 NaN
        "valid-typeof": "error", // 强制 typeof 表达式与有效的字符串进行比较
        

        /**
         * @name Best Practices
         * @description 这些规则是关于最佳实践的，帮助你避免一些问题
         */
	
        // "accessor-pairs": "error", // 强制 getter 和 setter 在对象中成对出现
        // "array-callback-return": "error", // 强制数组方法的回调函数中有 return 语句
        // "block-scoped-var": "error", // 强制把变量的使用限制在其定义的作用域范围内
        // "class-methods-use-this": "error", // 强制类方法使用 this
        // "complexity": "error", // 指定程序中允许的最大环路复杂度
        // "consistent-return": "error", // 要求 return 语句要么总是指定返回的值，要么不指定
        // "curly": "error", // 强制所有控制语句使用一致的括号风格
        // "default-case": "error", // 要求 switch 语句中有 default 分支
        // "dot-location": "error", // 强制在点号之前和之后一致的换行
        // "dot-notation": "error", // 强制尽可能地使用点号
        // "eqeqeq": "error", // 要求使用 === 和 !==
        // "guard-for-in": "error", // 要求 for-in 循环中有一个 if 语句
        // "max-classes-per-file": "error", // 强制每个文件中包含的的类的最大数量
        // "no-alert": "error", // 禁用 alert、confirm 和 prompt
        // "no-caller": "error", // 禁用 arguments.caller 或 arguments.callee
        // "no-case-declarations": "error", // 不允许在 case 子句中使用词法声明
        // "no-div-regex": "error", // 禁止除法操作符显式的出现在正则表达式开始的位置
        // "no-else-return": "error", // 禁止 if 语句中 return 语句之后有 else 块
        // "no-empty-function": "error", // 禁止出现空函数
        "no-empty-pattern": "error", // 禁止使用空解构模式
        // "no-eq-null": "error", // 禁止在没有类型检查操作符的情况下与 null 进行比较
        "no-eval": "warn", // 禁用 eval()
        // "no-extend-native": "error", // 禁止扩展原生类型
        // "no-extra-bind": "error", // 禁止不必要的 .bind() 调用
        // "no-extra-label": "error", // 禁用不必要的标签
        "no-fallthrough": "error", // 禁止 case 语句落空
        // "no-floating-decimal": "warn", // 禁止数字字面量中使用前导和末尾小数点
        // "no-global-assign": "warn", // 禁止对原生对象或只读的全局对象进行赋值
        // "no-implicit-coercion": "warn", // 禁止使用短符号进行类型转换
        // "no-implicit-globals": "warn", // 禁止在全局范围内使用变量声明和 function 声明
        "no-implied-eval": "warn", // 禁止使用类似 eval() 的方法
        // "no-invalid-this": "error", // 禁止 this 关键字出现在类和类对象之外
        // "no-iterator": "error", // 禁用 __iterator__ 属性
        // "no-labels": "error", // 禁用标签语句
        // "no-lone-blocks": "error", // 禁用不必要的嵌套块
        // "no-loop-func": "error", // 禁止在循环语句中出现包含不安全引用的函数声明
        // "no-magic-numbers": "error", // 禁用魔术数字
        // "no-multi-spaces": "error", // 禁止使用多个空格
        // "no-multi-str": "error", // 禁止使用多行字符串
        // "no-new": "error", // 禁止使用 new 以避免产生副作用
        // "no-new-func": "error", // 禁止对 Function 对象使用 new 操作符
        // "no-new-wrappers": "error", // 禁止对 String，Number 和 Boolean 使用 new 操作符
        "no-octal": "warn", // 禁用八进制字面量
        // "no-octal-escape": "error", // 禁止在字符串中使用八进制转义序列
        // "no-param-reassign": "error", // 禁止对 function 的参数进行重新赋值
        // "no-proto": "error", // 禁用 __proto__ 属性
        "no-redeclare": "error", // 禁止多次声明同一变量
        // "no-restricted-properties": "error", // 禁止使用对象的某些属性
        // "no-return-assign": "error", // 禁止在 return 语句中使用赋值语句
        // "no-return-await": "error", // 禁用不必要的 return await
        // "no-script-url": "error", // 禁止使用 javascript: url
        "no-self-assign": "error", // 禁止自我赋值
        "no-self-compare": "error", // 禁止自身比较
        // "no-sequences": "error", // 禁用逗号操作符
        // "no-throw-literal": "error", // 禁止抛出异常字面量
        // "no-unmodified-loop-condition": "error", // 禁用一成不变的循环条件
        // "no-unused-expressions": "error", // 禁止出现未使用过的表达式
        "no-unused-labels": "error", // 禁用出现未使用过的标
        // "no-useless-call": "error", // 禁止不必要的 .call() 和 .apply()
        // "no-useless-catch": "error", // 禁止不必要的 catch 子句
        // "no-useless-concat": "error", // 禁止不必要的字符串字面量或模板字面量的连接
        // "no-useless-escape": "error", // 禁用不必要的转义字符
        // "no-useless-return": "error", // 禁止多余的 return 语句
        // "no-void": "error", // 禁用 void 操作符
        // "no-warning-comments": "error", // 禁止在注释中使用特定的警告术语
        "no-with": "error", // 禁用 with 语句
        // "prefer-named-capture-group": "error", // 建议在正则表达式中使用命名捕获组
        // "prefer-promise-reject-errors": "error", // 要求使用 Error 对象作为 Promise 拒绝的原因
        // "radix": "error", // 强制在 parseInt() 使用基数参数
        // "require-await": "error", // 禁止使用不带 await 表达式的 async 函数
        // "require-unicode-regexp": "error", // 强制在 RegExp 上使用 u 标志
        // "vars-on-top": "error", // 要求所有的 var 声明出现在它们所在的作用域顶部
        // "wrap-iife": "error", // 要求 IIFE 使用括号括起来
        // "yoda": "error", // 要求或禁止 “Yoda” 条件


        /**
         * @name Strict Mode
         * @description 该规则与使用严格模式和严格模式指令有关
         */	

        // "strict": "error", // 要求或禁止使用严格模式指令


        /**
         * @name Variables
         * @description 这些规则与变量声明有关
         */

        // "init-declarations": "error", // 要求或禁止 var 声明中的初始化
        "no-delete-var": "error", // 禁止删除变量
        // "no-label-var": "error", // 不允许标签与变量同名
        // "no-restricted-globals": "error", // 禁用特定的全局变量
        // "no-shadow": "error", // 禁止变量声明与外层作用域的变量同名
        "no-shadow-restricted-names": "error", // 禁止将标识符定义为受限的名字
        "no-undef": "warn", // 禁用未声明的变量，除非它们在 /* global */ 注释中被提到
        // "no-undef-init": "error", // 禁止将变量初始化为 undefined
        // "no-undefined": "error", // 禁止将 undefined 作为标识符
        "no-unused-vars": ["warn", {"vars": "local"}], // 禁止出现未使用过的变量
        // "no-use-before-define": "error", // 禁止在变量定义之前使用它们


        /**
         * @name Node.js and CommonJS
         * @description 这些规则是关于Node.js 或 在浏览器中使用CommonJS 的
         */

        // "callback-return": "error", // 强制数组方法的回调函数中有 return 语句
        // "global-require": "error", // 要求 require() 出现在顶层模块作用域中
        // "handle-callback-err": "error", // 要求回调函数中有容错处理
        // "no-buffer-constructor": "error", // 禁用 Buffer() 构造函数
        // "no-mixed-requires": "error", // 禁止混合常规变量声明和 require 调用
        // "no-new-require": "error", // 禁止调用 require 时使用 new 操作符
        // "no-path-concat": "error", // 禁止对 __dirname 和 __filename 进行字符串连接
        // "no-process-env": "error", // 禁用 process.env
        // "no-process-exit": "error", // 禁用 process.exit()
        // "no-restricted-modules": "error", // 禁用通过 require 加载的指定模块
        // "no-sync": "error", // 禁用同步方法


        /**
         * @name Stylistic Issues
         * @description 这些规则是关于风格指南的，而且是非常主观的
         */

        // 'array-bracket-newline': ['error', 'never'],  // Fix 在数组开括号后和闭括号前强制换行
        'array-bracket-spacing': ["error", "never"],     // Fix 强制数组方括号中使用一致的空格
        // 'array-element-newline': ['error', 'never'],  // Fix 强制数组元素间出现换行
        // 'block-spacing': ['error', 'never'],          // Fix 禁止或强制在代码块中开括号前和闭括号后有空格
        // 'brace-style': ['error', 'never'],            // Fix 强制在代码块中使用一致的大括号风格
        // 'camelcase': ['error', 'never'],              // 强制使用骆驼拼写法命名约定
        // 'capitalized-comments': ['error', 'never'],   // Fix 强制或禁止对注释的第一个字母大写
        'comma-dangle': ["error", "never"],              // Fix 要求或禁止末尾逗号
        'comma-spacing': ["error", {"before": false, "after": true}], // Fix 强制在逗号前后使用一致的空格
        // 'comma-style': ['error', 'never'], // Fix 强制使用一致的逗号风格
        'computed-property-spacing': ['error', 'never'], // Fix 强制在计算的属性的方括号中使用一致的空格
        // 'consistent-this': ['error', 'never'], // 当获取当前执行环境的上下文时，强制使用一致的命名
        // 'eol-last': ['error', 'never'], // Fix 要求或禁止文件末尾存在空行
        'func-call-spacing': ['error', 'never'], // Fix 要求或禁止在函数标识符和其调用之间有空格
        // 'func-name-matching': ['error', 'never'], // 要求函数名与赋值给它们的变量名或属性名相匹配
        // 'func-names': ['error', 'never'], // 要求或禁止使用命名的 function 表达式
        // 'func-style': ['error', 'never'], // 强制一致地使用 function 声明或表达式
        //    'function-paren-newline': ['error', {'never': true, 'multiline-arguments': true}], // Fix 强制在函数括号内使用一致的换行
        // 'id-blacklist': 0, // 禁用指定的标识符
        // 'id-length': 0, // 强制标识符的最小和最大长度
        // 'id-match': 0, // 要求标识符匹配一个指定的正则表达式
        'implicit-arrow-linebreak': ['error', 'beside'], // Fix 强制隐式返回的箭头函数体的位置
        'indent': ['error', 4, {"SwitchCase": 1}], // Fix 强制使用一致的缩进
        'jsx-quotes': ['error', "prefer-double"], // Fix 强制在 JSX 属性中一致地使用双引号或单引号
        'key-spacing': ['error', {"beforeColon": false, "afterColon": true, "mode": "strict"}], // Fix 强制在对象字面量的属性中键和值之间使用一致的间距
        'keyword-spacing': ['error', {"before": true, "after": true}], // Fix 强制在关键字前后使用一致的空格
        // 'line-comment-position': 0, // 强制行注释的位置
        'linebreak-style': [0, 'error', 'windows'], // Fix 强制使用一致的换行风格
        // 'lines-around-comment': ['error', 'beforeBlockComment'], // Fix 要求在注释周围有空行
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
        'new-parens': 'error', // Fix 强制或禁止调用无参构造函数时有圆括号
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
        // 'semi': ['error', 'always'], // Fix 要求或禁止使用分号代替 ASI
        // 'semi-spacing': 'error', // Fix 强制分号之前和之后使用一致的空格
        // 'semi-style': ['error', 'last'], // Fix 强制分号的位置
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


        /**
         * @name ECMAScript 6
         * @description 这些规则只与 ES6 有关, 即通常所说的 ES2015
         */
        
        // "arrow-body-style": "error", // 要求箭头函数体使用大括号
        // "arrow-parens": "error", // 要求箭头函数的参数使用圆括号
        "arrow-spacing": ["error", {"before": true, "after": true}], // 强制箭头函数的箭头前后使用一致的空格
        "constructor-super": "error", // 要求在构造函数中有 super() 的调用
        "generator-star-spacing": ["error", {"before": true, "after": false}], // 强制 generator 函数中 * 号周围使用一致的空格
        "no-class-assign": "error", // 禁止修改类声明的变量
        // "no-confusing-arrow": "error", // 禁止在可能与比较操作符相混淆的地方使用箭头函数
        "no-const-assign": "error", // 禁止修改 const 声明的变量
        "no-dupe-class-members": "error", // 禁止类成员中出现重复的名称
        // "no-duplicate-imports": "error", // 禁止重复模块导入
        "no-new-symbol": "error", // 禁止 Symbolnew 操作符和 new 一起使用
        // "no-restricted-imports": "error", // 禁止使用指定的 import 加载的模块
        "no-this-before-super": "error", // 禁止在构造函数中，在调用 super() 之前使用 this 或 super
        // "no-useless-computed-key": "error", // 禁止在对象中使用不必要的计算属性
        // "no-useless-constructor": "error", // 禁用不必要的构造函数
        // "no-useless-rename": "error", // 禁止在 import 和 export 和解构赋值时将引用重命名为相同的名字
        "no-var": "warn" // 要求使用 let 或 const 而不是 var
        // "object-shorthand": "error", // 要求或禁止对象字面量中方法和属性使用简写语法
        // "prefer-arrow-callback": "error", // 要求回调函数使用箭头函数
        // "prefer-const": "error", // 要求使用 const 声明那些声明后不再被修改的变量
        // "prefer-destructuring": "error", // 优先使用数组和对象解构
        // "prefer-numeric-literals": "error", // 禁用 parseInt() 和 Number.parseInt()，使用二进制，八进制和十六进制字面量
        // "prefer-rest-params": "error", // 要求使用剩余参数而不是 arguments
        // "prefer-spread": "error", // 要求使用扩展运算符而非 .apply()
        // "prefer-template": "error", // 要求使用模板字面量而非字符串连接
        // "require-yield": "error", // 要求 generator 函数内有 yield
        // "rest-spread-spacing": "error", // 强制剩余和扩展运算符及其表达式之间有空格
        // "sort-imports": "error", // 强制模块内的 import 排序
        // "symbol-description": "error", // 要求 symbol 描述
        // "template-curly-spacing": "error", // 要求或禁止模板字符串中的嵌入表达式周围空格的使用
        // "yield-star-spacing": "error", // 强制在 yield* 表达式中 * 周围使用空格


        /**
         * @name eslint-plugin-vue
         * @description Vue ^2.0 文件格式化配置
         */

        // // => LEVEL 1
        // "vue/custom-event-name-casing": "warn", // 事件传递中，禁用驼峰命名法 (建议用中划线或其他符号分割) userName => user-name
        // "vue/no-arrow-functions-in-watch": "error", // 禁止在 watch 中使用箭头函数
        // "vue/no-async-in-computed-properties": "error", // 在 computed 中返回非同步的方法
        // "vue/no-custom-modifiers-on-v-model": "warn", // 在 v-model 中使用多个修饰符
        // "vue/no-dupe-keys": "error", // 在 data props computed methods... 中定义了相同的属性或方法 
        // "vue/no-dupe-v-else-if": "error", // 在 if 中使用了相同的判断条件
        // "vue/no-duplicate-attributes": "error", // 在 vdom 中设置了相同的属性
        // "vue/no-multiple-template-root": "error", // 不允许向模板添加多个根节点
        // "vue/no-mutating-props": "error", // 组件 props 中的参数仅为只读数据
        // "vue/no-parsing-error": "error", //	在 <template> 禁用错误分析
        // "vue/no-reserved-keys": "error", //	禁止使用保留字创建属性或方法
        // "vue/no-shared-component-data": "error", // component's data 必须能是返回返回对象分方法 🔧
        // "vue/no-side-effects-in-computed-properties": "warn", // 禁止在 computed 去改变 data 属性
        // "vue/no-template-key": "warn", // 禁止在 <template> 添加属性
        // "vue/no-textarea-mustache": "off", // 禁止直接在 <textarea> 标签内打印数据
        // "vue/no-unused-components": "warn", // 声明的组件必须要使用
        // "vue/no-unused-vars": "error", // 不允许v-for指令或作用域属性的未使用变量定义
        // "vue/no-use-v-if-with-v-for": ["warn", {allowUsingIterationVar: true}], // 禁止 v-for 与 v-if 同时使用; allowUsingIterationVar 允许迭代变量
        // "vue/no-v-for-template-key": "error", // 禁止在 <template v-for>	中设置属性
        // "vue/no-v-model-argument": "warn", // 禁止在自定义组件的 v-model 中添加修饰符
        // "vue/require-component-is": "warn", // 自定义组件的 is 必须是动态变量，静态变量的 is 请使用单一组件而不是动态 component
        // "vue/require-prop-type-constructor": "error", // 要求 prop 的 type 必须是构造器函数	🔧
        // "vue/require-render-return": "error", // 强制 render 函数必须要有返回值
        // "vue/require-v-for-key": "warn", // 强制 v-for 控制中必须指定组件 key
        // "vue/require-valid-default-prop": "warn", // 检验 props 中 default 必须是个有效值（object 必须 return）
        // "vue/return-in-computed-property": "warn", // computed 中必须有 return 语句
        // "vue/use-v-on-exact": "warn", // 当有另一个带有修饰符的 v-on 时，此规则强制对 v-on 使用精确修饰符。
        // "vue/valid-template-root": "warn", // 检查每个模板根是否有效
        // "vue/valid-v-bind-sync": "warn", //此规则检查v-bind指令上的每个.sync修饰符是否有效
        // "vue/valid-v-bind": "warn", // enforce valid v-bind directives
        // "vue/valid-v-cloak": "warn", // enforce valid v-cloak directives
        // "vue/valid-v-else-if": "warn", // enforce valid v-else-if directives
        // "vue/valid-v-else": "warn", // enforce valid v-else directives
        // "vue/valid-v-for": "warn", // enforce valid v-for directives
        // "vue/valid-v-html": "warn", // enforce valid v-html directives
        // "vue/valid-v-if": "warn", // enforce valid v-if directives
        // "vue/valid-v-model": "warn", // enforce valid v-model directives
        // "vue/valid-v-on": "warn", // enforce valid v-on directives
        // "vue/valid-v-once": "warn", // enforce valid v-once directives
        // "vue/valid-v-pre": "warn", // enforce valid v-pre directives
        // "vue/valid-v-show": "warn", // enforce valid v-show directives
        // "vue/valid-v-slot": "warn", // enforce valid v-slot directives
        // "vue/valid-v-text": "warn", // enforce valid v-text directives

        // // => LEVEL 2
        // "vue/attribute-hyphenation": "error", // 组件属性中禁止使用驼峰命名法，推荐使用分隔符 🔧
        // "vue/component-definition-name-casing": "error", // 注册组件强制要求使用驼峰命名法 🔧
        // "vue/html-closing-bracket-newline": "warn", // 组件内换行符必须符合规范 🔧
        // "vue/html-closing-bracket-spacing": "error", //	检查标签的末尾符格式 🔧
        // "vue/html-end-tags": "error", //	标签强制要求有末尾符 🔧
        // "vue/html-indent": ["warn", 4, {"attribute": 1, "baseIndent": 1, "closeBracket": 0, "alignAttributesVertically": true,}], // enforce consistent indentation in <template> 🔧
        // "vue/html-quotes": "error", // 强制 HTML 属性的引号样式 🔧
        // "vue/html-self-closing": "error", // 无内容标签自动闭合 🔧
        // "vue/max-attributes-per-line": ["error", {singleline: 8, multiline: {max: 5, allowFirstLine: true}}], // 限制每行属性的最大数量 🔧
        // "vue/multiline-html-element-content-newline": ["off", {ignores: ['pre', 'textarea']}], // 多行元素的内容前后强制执行换行符 🔧
        // "vue/mustache-interpolation-spacing": "error", // 组件内部的数据插槽需要有空格分隔符 🔧
        // "vue/no-multi-spaces": ["error", {ignoreProperties: true}], // 多个空格; ignoreProperties 忽略属性 🔧
        // "vue/no-spaces-around-equal-signs-in-attribute": "error", // 属性中不允许使用等号 🔧
        // "vue/no-template-shadow": "warn", // 消除v-for指令或作用域属性的隐藏变量声明	
        // "vue/one-component-per-file": "warn", // 检查每个文件是否只有一个组件
        // "vue/prop-name-casing": "warn", //	props 中 name 必须是驼峰命名法
        // "vue/require-default-prop": "off", // 要求 props 中的型配置完全
        // "vue/require-prop-types": "off", //要 求 props 中的型配置 type
        // "vue/singleline-html-element-content-newline": "off", // 在单行元素的内容前后强制执行换行符 🔧
        // "vue/v-bind-style": "error", //	enforce v-bind directive style 🔧
        // "vue/v-on-style": "error", //	enforce v-on directive style 🔧
        // "vue/v-slot-style": "error", //	enforce v-slot directive style

        // // LEVEL other
        // "vue/attributes-order": ["error", {
        //     // 组件属性排序 🔧
        //     order: [
        //         "DEFINITION", // 定义 is
        //         "LIST_RENDERING", // 列表渲染 v-for
        //         "CONDITIONALS", // 条件句 v-if v-show
        //         "RENDER_MODIFIERS", // 渲染修改器 v-once
        //         "GLOBAL", // 全局属性 id
        //         "UNIQUE", // 独一无二 ref
        //         "TWO_WAY_BINDING", // 条件绑定 v-model
        //         "OTHER_DIRECTIVES", // 其他自定义指令
        //         "OTHER_ATTR", // 其他自定义属性
        //         "EVENTS", // 事件 @click
        //         "CONTENT" // 内容 v-text
        //     ],
        //     alphabetical: false
        // }],
        // "vue/component-tags-order": "off", // 顶级标签排序；默认：{ "order": [ [ "script", "template" ], "style" ] }
        // // "vue/no-lone-template": "error", 
        // // "no-multiple-slot-args": "warn", // 不允许向作用域插槽传递多个参数
        // "vue/no-v-html": "warn", // 禁止使用 v-html
        // "vue/order-in-components": ["error", {
        //     // 组件属性排序 🔧
        //     order: [
        //         "name", "el", "key", "parent", "layout", "head", "functional", "setup", // 声明层
        //         "mixins","middleware", "validate",  "transition", "loading", ["provide", "inject"], "inheritAttrs",  "model", "emits", // 数据混合
        //         "fetch", "asyncData", "data", ["props", "propsData"], "computed", "watch", // 数据层
        //         ["delimiters", "comments"], ["directives", "filters"], "extends",                
        //         "methods", // 方法
        //         "components", // 组件
        //         ["template", "render"], // 模板
        //         "renderError",
        //         "scrollToTop", "onPageScroll", "onResize", // UNIAPP 窗口尺寸变化
        //         "onPullDownRefresh", "onReachBottom", "onShareAppMessage", "onNavigationBarButtonTap", "onBackPress", // UNIAPP 页面交互事件
        //         "onNavigationBarSearchInputChanged", "onNavigationBarSearchInputConfirmed", "onNavigationBarSearchInputClicked", "onShareTimeline", "onAddToFavorites", // UNIAPP 导航栏事件
        //         "onUniNViewMessage", "onUnhandledRejection", "onPageNotFound", "onThemeChange", // UNIAPP 路由事件
        //         "onShow", "onHide", "onLaunch", "onUnload", "onError", // UNIAPP 生命周期
        //         "LIFECYCLE_HOOKS", // 生命周期
        //     ]
        // }],

        // "vue/block-tag-newline": "warn", // 在打开和关闭块级标记之前强制换行 🔧
        // "vue/component-name-in-template-casing": ["warn", "kebab-case", {"registeredComponentsOnly": true}], // 在模板中强制组件命名样式的特定大小写 🔧
        // "vue/html-comment-content-newline": "off", // 在HTML注释中强制统一行制动 🔧
        // "vue/html-comment-content-spacing": "off", // 在HTML注释中强制统一间距 🔧
        // "vue/html-comment-indent": "off", // 在HTML注释中强制一致缩进 🔧
        // "vue/match-component-file-name": "off", // 要求组件名属性与其文件名匹配
        // "vue/no-bare-strings-in-template": "off", // disallow the use of bare strings in <template>	
        // "vue/no-boolean-defaul": "off", // 布尔型参数禁止有默认值 🔧
        // "vue/no-duplicate-attr-inheritance": "off", // 使用 v-bind="$attrs" 时强制将 inheritAttrs 设置为 false
        // "vue/no-empty-component-block": "off", // 不允许 <template> <script> <style> 块为空
        // "vue/no-multiple-objects-in-class": "warn", // 不允许将多个对象传入数组到类
        // "vue/no-potential-component-option-typo": "off", // 不允许在您的组件配置中输入潜在错误（ 不兼容 uniapp ）
        // "vue/no-reserved-component-names": "warn", // 不允许在组件定义中使用保留名称
        // "vue/no-restricted-component-options": "off", // 不允许特定组件选项
        // "vue/no-restricted-static-attribute": "off", // 不允许特定属性
        // "vue/no-restricted-v-bind": "off", // 在 v-bind 中不允许特定参数
        // "vue/no-static-inline-styles": "off", // 不允许静态内联样式属性
        // "vue/no-template-target-blank": "off", // 不允许 target=“_blank” 属性不带 rel=“noopener noreferrer”
        // "vue/no-unregistered-components": "off", //禁止使用模板中未注册的组件
        // "vue/no-unsupported-features": "off", // 不允许不支持Vue.js版指定版本的语法 🔧
        // "vue/no-unused-properties": "off", // 不允许未使用的属性
        // "vue/no-useless-mustaches": "warn", // 不允许不必要的插值 🔧
        // "vue/no-useless-v-bind": "warn", // 不允许不必要的 v-bind 指令 🔧
        // "vue/padding-line-between-blocks": "off", // 要求或不允许块之间的填充线 🔧
        // "vue/require-direct-export": "warn", // 要求直接导出组件
        // "vue/require-name-property": "off", // 需要 Vue 组件中的 name 属性
        // "vue/script-indent": ["warn", 4], // 在 <script> 中强制一致缩进 🔧
        // "vue/sort-keys": "off", // 以与组件中的顺序兼容的方式强制排序键
        // "vue/static-class-names-order": "off", // 强制 class 的名顺序 🔧
        // "vue/v-for-delimiter-style": "warn", // 强制 v-for 指令的分隔符样式 🔧
        // "vue/v-on-function-call": "off", // 在 v-on 指令中不带参数的方法调用后强制或禁止括号

        // "vue/array-bracket-newline": "warn", // 在数组括号开始后和结束之前强制换行 🔧
        // "vue/array-bracket-spacing": "warn", // 在数组括号内强制使用一致的间距 🔧
        // "vue/arrow-spacing": "warn", // 在箭头函数中，在箭头前后强制使用一致的间距 🔧
        // "vue/block-spacing": "warn", // 在打开块之后和关闭块之前不允许或强制块内部有空格 🔧
        // "vue/brace-style": "warn", // 对块强制使用一致的大括号样式 🔧
        // "vue/camelcase": "warn", // 对块强制使用一致的大括号样式
        // "vue/comma-dangle": "warn", // 要求或不允许使用尾随逗号 🔧
        // "vue/comma-spacing": "warn", // 执行逗号前后一致的间距 🔧
        // "vue/comma-style": "warn", // 强制使用一致的逗号样式 🔧
        // "vue/dot-location": "warn", // 在点前后强制使用一致的换行符 🔧
        // "vue/dot-notation": "warn", // 尽可能强制使用点表示法 🔧
        // "vue/eqeqeq": "off", // 强制使用 === 和 !== 🔧
        // "vue/func-call-spacing": "warn", // 要求或不允许函数标识符与其调用之间的间距 🔧
        // "vue/key-spacing": "warn", // 在对象文字属性中强制键和值之间保持一致的间距 🔧
        // "vue/keyword-spacing": "warn", // 在关键字前后强制使用一致的间距 🔧
        // "vue/max-len": "off", // 强制执行最大线长度
        // "vue/no-empty-pattern": "warn", // 不允许空的解构模式
        // "vue/no-extra-parens": "warn", // 不允许不必要的括号 🔧
        // "vue/no-irregular-whitespace": "off", // 不允许不规则空白
        // "vue/no-restricted-syntax": "off", // 不允许指定的语法
        // "vue/no-sparse-arrays": "warn", // 不允许稀疏数组
        // "vue/no-useless-concat": "warn", // 不允许文字或模板文字的不必要的连接
        // "vue/object-curly-newline": "warn", // 在大括号内强制一致的换行符 🔧
        // "vue/object-curly-spacing": "warn", // 在大括号内强制使用一致的间距 🔧
        // "vue/object-property-newline": "warn", // 强制将对象特性放置在单独的行上 🔧
        // "vue/operator-linebreak": "warn", // 为运算符强制使用一致的换行符样式 🔧
        // "vue/prefer-template": "warn", // 需要模板文本而不是字符串连接 🔧
        // "vue/space-in-parens": "warn", // 在括号内强制一致间距 🔧
        // "vue/space-infix-ops": "warn", // 中缀运算符周围需要间距 🔧
        // "vue/space-unary-ops": "warn", // 在一元运算符之前或之后强制使用一致的间距 🔧
        // "vue/template-curly-spacing": "warn", // 要求或不允许模板字符串的嵌入表达式之间有间距
    }
}

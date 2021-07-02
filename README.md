

### 更新建议
```shell
=== model ===
✅ POST 支持自动注入（自配 + 公配）
✅ DELETE 中删删除数据支持联动
❌ RESFUL 增加提交防抖与节流（自配 + 公配）：前一个相同请求完成前无法提交下一个请求 | 前一个请求发送后的 x 毫秒内无法提交相同请求
    => 使用 only loading editing 等属性可以在外部实现防抖与节流
    => 不需要内置防抖或节流
✅ 支持 filter 参数锁定（强制绑定在模型中）
⬜ 支持中间件（拦截器）
⬜ 支持使用对象引用 store // 使用别名
⬜ 支持动态增加模型
❌ 支持本地 MOCK 支持，并且对 RESEFUL 操作能产生联动效果: 应当使用 mockjs 等方案在外部实现
❌ 增加 List 类
    => vue 会改写 Array 对象的 __proto__ 原型对象
✅ 增加 Item 类, 在 Item 对象中打上模型的引用戳
✅ GET => FETCH {method: 'GET'} 的语法糖
⬜ URL 类（格式解析）
✅ 在 Submit 等方法传入系统的 $event 值时候的报错
✅ [❗❗❗] Item 方法不返回 res 已修复
    => 为确保链式调用，其他不按 res 格式返回的接口会陆续改回 res 格式（{err: 0, msg: '', result}）
✅ RESFUL 增加 only 特性，同一类型在结果成功返回时候只能请求一次
🔶 增加 limit（自配 + 公配） 提交 GET POST PUT DELETE 请求时候强制覆盖 params 或 paths 或 data
✅ 增加 public 属性，在设为 true 时候，退出登录该模块不会被清除

=== BUG ===
✅ 低网络状态下，请求超时后无法移除 AJAX 队列
✅ 3 级 paths 下 Active 失效 (已更换为纯 ID 模式)

=== mixins ===
✅ GetInit 支持本地缓存（使用 GET 会清除掉 GetInit 的缓存）
✅ GetInit 支持强制刷新
✅ [❗❗❗] Submit 支持传入提交参数，传参方式改变，第一个参数为提交体对象
✅ GetFilter => MakeFilter 增加语法糖
✅ GetMore => LoadMore 增加语法糖
✅ LoadMore 将支持 marker 模式
✅ 增加 Clean 快速清理模型方法
❌ 增加 StorePath 方法去快速引用模型
```
### 0.2.8
✅  POST 方法进行数据联动时候，没有正确打破 empty = true
✅  DELETE 方法进行数据联动时候，没有配置联动也会自动进行联动的错误

### 0.3.0
⬜  节流、防抖（不实用 lodash 的方案，而是内部实现）
⬜  测试 class Item 字段如果是 function 在微信小程序的性能表现（影响 setData ）
⬜  增加 relation 模型关联
⬜  后端文档导出（高风险）、拓展表单验证的方法
⬜  增加四个钩子（中间件函数）
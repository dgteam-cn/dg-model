## install 安装
```shell
npm i @dgteam/model --save
# or
yarn add @dgteam/model --save
```

## use 使用

### 实例化 MODEL 基类
```javascript
// @/plugins/store.js
// 实例化 model 类
import Model from '@dgteam/model/dist/index'
import ajax from '@/plugins/ajax.js'
Model.install({
    fetch: {
        ajax,
        handle: 'ajax',
    }
})
export default Model
```

### 使用 MODEL 基类去创建模型
```javascript
// @/store/modules/mine.js
// 使用工厂函数 model 类去创建模型
import Model from '@/plugins/store.js'
const DGX = new Model({
    store: 'mine', // 模块名，即本 js 文件的名称
    state: {
        // 示例声明一个 address 地址模型
        // Model 类会自动为其拓展属性和方法
		address: {
            options: {
                url: 'api/user/address'
            }
        }
    },
    actions: {
		// 自定义接口 {动作名}_{模型名}
		CHECK_ADDRESS({ state, dispatch, commit }, {id, params}){
            return dispatch('FETCH', {method: 'PUT',url: 'api/user/address/check', id, params, data: {}}).then(res => {
                if(!res.err){
                    console.log('CHECK_ADDRESS 请求成功: ', res)
                    commit('UPDATE_ADDRESS', res.result)
                }
                return res
            })
        }
    },
    mutations: {
        // 自定义突变
        UPDATE_ADDRESS(state, data){
            // 执行你想要的代码
            console.log('UPDATE_ADDRESS')
        }
    }
})
```

### 加载全局混合辅组函数
```html
// @/pages/mine/address.vue
<template>
    <div class="App Center l-flex">
        <pre>{{ Main.list }}</pre>
    </div>
</template>
<script>
    import StoreMix from '@dgteam/model/dist/mixins/store'
    export default {
        mixins: [StoreMix],
        data(){
            return {
                // 被绑定的模型路径，第一个为库名，第二个为模型名
                // 绑定成功后可以通过 this.Main 和 this.StoreInfo 查看当前组件绑定的模型
                // 支持动态的去切换 store 变更模型，支持 computed 去返回 store
                store: 'mine/address', 
                // 过滤属性暂存器，模型默认在使用 GET 方法时候，会通过 Filter 对象去填充筛选参数
                Filter: {
                    size: 12
                },
                // 参数暂存器，模型默认在使用 POST 和 PUT 的时候，会自动加载 Params 对象为表单参数
                Params: {}
            }
        }
    methods: {
        init(){
            this.reload()
        },
        reload(){
            let page = 1 // 不传默认为 1
            let paths = 'mine/address' // 不传默认取 this.store
            let filter = {} // 不传默认取 this.Filter
            this.Get(page, paths, filter) // 拉取默认数据
        }
    },
    mounted(){
        this.init()
    }
  }
</script>
```
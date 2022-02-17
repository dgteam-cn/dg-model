---
lang: zh-CN
title: 声明模型
---

# 声明模型

## 基本配置
为了应对复杂业务需求，以及打通 Dgx 与 [Vuex](https://next.vuex.vuejs.org/zh/index.html) 数据交互问题，声明数据模型是在创建 [Vuex](https://next.vuex.vuejs.org/zh/index.html) 中完成的，框架体统了 Model 类去拓展 Vuex 的接口，完整的配置项请参见 [TableConfig](./objects#TableConfig) 对象。
> 注意: 在多模块架构下，会强制要求开始 [命名空间](https://next.vuex.vuejs.org/zh/guide/modules.html#%E5%91%BD%E5%90%8D%E7%A9%BA%E9%97%B4) 的配置，即 namespaced = true
<CodeGroup>
  <CodeGroupItem title="基础用法" active>

```javascript
import { Model } from '@dgteam/model'
const options = new Model({

  table: {
    // 声明一个 user 模型
    user: {
      title: '用户列表',
      url: 'http://api.project.com/user', // 该路径仅做示范
      POST: {
        interact: true
      }
    }
  },

  // 以下参数为 Vuex 配置原生参数，详见 Vuex 官方文档
  state: {},
  getters: {},
  actions: {},
  mutations: {},
  modules: {},
  plugins: {},
  strict: false,
  devtools: false
  // namespaced: true // 多模块下强制要求开启
})
```

  </CodeGroupItem>
  <CodeGroupItem title="多模块示例" active>

```javascript
import { Model } from '@dgteam/model'
const options = new Model({
  // 使用 Vuex 的 modules 进行多模块数据模型的声明
  modules: {
    account: new Model({
      table: {
        customer: {
          url: 'http://api.project.com/account/customer // 该路径仅做示范
        }
      }
    }),
    business: new Model({
      table: {
        product: {
          url: 'http://api.project.com/business/product // 该路径仅做示范
        },
        order: {
          url: 'http://api.project.com/business/order // 该路径仅做示范
        }
      }
    })
  }
})
```

  </CodeGroupItem>
</CodeGroup>

创建 options 对象后，再加载进 vuex 中
<CodeGroup>
  <CodeGroupItem title="Vue2" active>

```javascript
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const Store = new Vuex.Store(options)
Vue.prototype.$store = Store
export default Store
```
  </CodeGroupItem>
  <CodeGroupItem title="Vue3" active>

```javascript
import { createStore } from 'vuex'
export default createStore(options)
```
  </CodeGroupItem>
  <CodeGroupItem title="Nuxt2" active>

```javascript
export const state = () => options.state
export const getters = options.getters
export const actions = options.actions
export const mutations = options.mutations
export const namespaced = true
```
  </CodeGroupItem>
</CodeGroup>
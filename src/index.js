import {Model, Table} from './library/main.js'
import mixin from './mixins/store.js'
import TableProxy from './library/proxy'
import helper from './helper'
import pkg from '../package.json'

// 在 UMD 规范下，Vue 可能需要到 window 全局变量上寻找

/**
 * 脱离 vuex 实现 （需要兼容 nuxt）以下方法可以封装成响应式
 * VUE2 实现响应式对象核心代码
 * import Vue from 'vue'
 * const $state = {num: 1}
 * const _vm = new Vue({
 *     data: {
 *         $$state: $state
 *     }
 * })
 * export default $state
 *
 * VUE3 实现响应式对象核心代码
 * import { reactive } from 'vue'
 * const $state = reactive({data: {num: 1}})
 */

const version = pkg.version
function install (app, options) {

    const vueVersion = Number(app.version.split('.')[0]) // 版本

    // 获取模型数据库实例
    function getModels(store) {
        // 必须使用 $store.state 而不是 $store._modules.root.state, 否则在 Vue3 中会失去响应式
        const models = {}
        const deepInspect = (tunnel, state, nodes, path = '') => {
            if (tunnel._children) {
                for (const name in tunnel._children) {
                    if (nodes[name]) helper.consoleWarn(`Model name is already use ('${name}') please check`) // 命名重复提示
                    const nextPath = path ? `${path}/${name}` : `${name}`
                    // nodes[name] = deepInspect(tunnel._children[name], state[name], {}, nextPath)
                    Object.defineProperty(nodes, name, {
                        configurable: true, enumerable: true,
                        get() {
                            return deepInspect(tunnel._children[name], state[name], {}, nextPath)
                        }
                    })
                }
            }
            if (tunnel.state) {
                for (const name in tunnel.state) {
                    if (helper.instance(state[name], Table) || state[name].__table__) { // __table__ 用于兼容 nuxt2
                        if (nodes[name]) helper.consoleWarn(`Table name is already use ('${name}') please check`) // 命名重复提示
                        // nodes[name] = new TableProxy(state[name], path ? `${path}/${name}` : `${name}`)
                        Object.defineProperty(nodes, name, {
                            configurable: true, enumerable: true,
                            get() {
                                return new TableProxy(state[name], path ? `${path}/${name}` : `${name}`)
                            }
                        })
                    }
                }
                return nodes
            }
        }
        if (store) deepInspect(store._modules.root, store.state, models)
        return models
    }


    /**
     * 不同 vue 版全局方法挂载方式:
     * Vue 2.0: Vue.prototype.$model = {}
     * Vue 3.0: app.config.globalProperties.$model = {}
     * nuxt2 环境，$store 必须由外部传入
     */
    if (!options.store) {
        if (vueVersion === 2) {
            if (typeof app.prototype.$store !== 'undefined') {
                options.store = app.prototype.$store
            }
        } else if (vueVersion === 3) {
            if (typeof app.config.globalProperties.$store !== 'undefined') {
                options.store = app.config.globalProperties.$store
            }
        }
    }
    const $models = typeof Proxy !== 'undefined' ?
        new Proxy({}, {
            get(target, key) {
                return getModels(options.store)[key]
            }
        }) : getModels(options.store)
    if (vueVersion === 2) {
        options.dataSet = app.set // Vue2 需要传入 Vue.set 方法; Vue3 废弃了该方法;
        app.prototype.$models = $models
        // console.log('vue:', vueVersion, '\n app.prototype: ', app.prototype, typeof app.prototype.$store, '\n ======== \n process:', process.client, process.server)
    } else if (vueVersion === 3) {
        app.config.globalProperties.$models = $models
    }

    Model.setup(options)

    // app.mixin({
    //     beforeCreate() {
    //         var options = this.$options;
    //         // store injection
    //         if (options.store) {
    //           this.$store = typeof options.store === 'function'
    //             ? options.store()
    //             : options.store;
    //         } else if (options.parent && options.parent.$store) {
    //           this.$store = options.parent.$store;
    //         }
    //     }
    // })
}

const tools = {}
export default {
    version,
    Model,
    Table,
    install,
    mixin,
    tools
}
export {
    version,
    Model,
    Table,
    install,
    mixin,
    tools
}
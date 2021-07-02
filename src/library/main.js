import Vue from 'vue'
import helper from './helper'
import * as Mutations from "./mutations"
import * as Actions from "./actions"
import {ACTIVE, RESTFUL} from "./factory"
import pkg from '../../package.json'
const {FETCH, GET, FETCH_FINISH} = Actions
const {
    FETCH_REMOVE, FETCH_CANCEL, FETCH_UPDATE,
    MODEL_ADD, MODEL_MORE, MODEL_UPDATE, MODEL_REMOVE, MODEL_RESET,
    MODEL_ROW_EXTEND
} = Mutations

const Model = function constructor(opt = {}) {

    const {store, auth, fetch, namespaced = true} = opt
    this.store = store
    this.auth = auth
    this.fetch = Object.assign(Model.config.fetch, fetch)
    this.namespaced = namespaced

    // 混合配置
    for (const key of ['state', 'actions', 'mutations', 'getters']) {
        if (opt && typeof opt[key] === 'object') {
            this[key] = Object.assign(this[key], opt[key])
        }
    }

    // 遍历所有 state 查找 dgx 模块并创建方法
    for (const model in this.state) {
        if (helper.isObject(this.state[model]) && this.state[model].options) {

            // if (typeof options === 'string') {
            //     options = {url: options}
            // }

            // 模块通用状态属性
            this.state.ajax[model] = 0
            this.state.models.push(model)

            // 基础属性
            Vue.set(this.state, model, Object.assign({
                name: model,
                auth: this.state[model].options.auth ? this.state[model].options.auth : this.auth,
                init: false,
                loading: false,
                editing: false,
                ajax: [],
                error: false,
                page: 1,
                marker: undefined,
                total: null,
                count: undefined,
                empty: false,
                list: [],
                filter: {},
                // id: null, // 此字段即将废弃
                active: null,
                item: null
            }, this.state[model]))
            Vue.set(this.state[model], 'reset', Object.assign({}, this.state[model]))

            this.actions = {FETCH: FETCH.bind(this), GET: GET.bind(this), FETCH_FINISH: FETCH_FINISH.bind(this)}
            // 合并工厂方法
            this.actions = Object.assign(this.actions, ACTIVE(model, this), RESTFUL(model, this))
        }
    }
}
Model.prototype.state = {
    ajax: [], models: [],
    common: {options: {}}
}
// Model.prototype.actions = {
//     FETCH: FETCH,
//     GET: GET,
//     FETCH_FINISH: FETCH_FINISH
// }
Model.prototype.mutations = {
    FETCH_UPDATE, FETCH_CANCEL, FETCH_REMOVE,
    MODEL_ADD, MODEL_MORE, MODEL_REMOVE, MODEL_UPDATE, MODEL_RESET,
    MODEL_ROW_EXTEND
}
Model.prototype.getters = {}

Model.Mutations = Mutations
Model.Actions = Actions
Model.Factory = {ACTIVE, RESTFUL}
Model.config = {
    primaryKey: 'id', // 主键字段名称
    fetch: {
        ajax: null,
        socket: null,
        handle: 'auto' // 使用模式 [ajax | scocket | auto]
        // beforeFetch: null,
        // beforeRestful: null,
        // afterFetch: null,
        // afterRestful: null
    },
    RESTful: {
        GET: {
            // debounce: 200,
            interact: true
        },
        POST: {
            // debounce: 500,
            interact: false
        },
        PUT: {
            // debounce: 500,
            interact: true
        },
        DELETE: {
            // debounce: 500,
            interact: true
        }
    },
    middleware: {
        beforeFetch: new Function(),
        afterFetch: new Function(),
        beforeRESTful: new Function(),
        afterRESTful: new Function()
    }
}
Model.version = pkg.version
Model.install = function(opt) {
    for (const key of ['fetch', 'RESTful']) {
        if (opt && opt[key] && typeof opt[key] === 'object') {
            Model.config[key] = Object.assign(Model.config[key], opt[key])
        }
    }
}
// Model.register = function(opt) {

// }

export default Model
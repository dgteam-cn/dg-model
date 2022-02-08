// import Vue from 'vue'
import helper from '../helper'
import * as Mutations from "./mutations"
import * as Actions from "./actions"
import {ACTIVE, RESTFUL} from "./factory"
import pkg from '../../package.json'
const {
    FETCH, GET
} = Actions
const {
    FETCH_JOIN, FETCH_UPDATE, FETCH_REMOVE, FETCH_CHECK,
    TABLE_UPDATE, TABLE_RESET,
    TABLE_ROWS_JOIN, TABLE_ROWS_MERGE, TABLE_ROW_EXTEND, TABLE_ROW_REMOVE
} = Mutations

// 在 Vue 2 中 Array 会被代理，因此创建 List 类没有意义


const Table = function(model, ...args) {
    const obj = helper.extend({
        enums: {} // 0.4.0 版本新增，枚举对象
    }, ...args, {
        name: model, // 模型名称
        // path: model, // 模型路径
        // auth: this.state[model].options.auth ? this.state[model].options.auth : this.auth,
        init: false, // 是否初始化（至少 GET 过一次）
        error: false, // 最后一 GET 是否错误
        loading: 0, // 正在执行 GET 接口的数量
        editing: 0, // 正在执行 POST PUT DELETE 接口的数量
        ajax: [], // 请求队列
        page: 1, // 当前请求的野马
        total: null,
        count: null,
        marker: null, // 下一页地址
        next: null, // 下一页标记
        empty: false,
        list: [], // 数据表
        filter: {}, // 过滤器缓存
        // id: null, // 此字段即将废弃
        active: null, // 焦点在数据的索引
        item: null // 焦点对象
    })
    obj.reset = helper.originJSON(obj)
    for (const key in obj) {
        this[key] = obj[key]
    }
    if (process.server) this.__table__ = true // 兼容 nuxt 2, nuxt 2 的模式会去除 constructor
    return this
}

const Model = function constructor(opt = {}, config = {}) {
    const {httpAdapter, namespaced = true} = opt
    const {auth} = config

    this.id = helper.randomString(16) // 唯一标识
    this.auth = auth
    this.httpAdapter = httpAdapter || Model.httpAdapter
    this.namespaced = namespaced
    this.modules = {}
    this.plugins = {}
    this.strict = false
    this.devtools = false

    // 混合配置
    for (const key of ['state', 'actions', 'mutations', 'getters']) {
        // typeof null === 'object' 且 null 不能作为 Object.assign 的第一个参数
        this[key] = helper.extend({}, this[key], opt[key])
    }

    // 覆盖配置
    // 2021-12-30 新增 plugins、strict、devtools 参数
    // 2022-02-08 新增 tables 参数
    for (const key of ['tables', 'modules', 'plugins', 'strict', 'devtools']) {
        this[key] = opt[key]
    }

    // 遍历所有 state 查找 dgx 模块并创建方法
    const tableActions = {}
    // 兼容 0.4.0 之前版本声明方式
    if (Model.enableStateOptions) {
        for (const model in this.state) {
            if (helper.isObject(this.state[model]) && this.state[model].options) {

                // if (typeof options === 'string') {
                //     options = {url: options}
                // }

                // 模块通用状态属性 // 2021-12-29 暂时取消该功能
                // this.state.ajax[model] = 0
                // this.state._models.names.push(model)

                // 基础属性
                const opt = {
                    auth: this.state[model].options.auth ? this.state[model].options.auth : this.auth // TODO 该字段与框架耦合，之后版本会考虑剔除
                }
                Model.dataSet(this.state, model, new Table(model, opt, this.state[model]))

                // // 合并工厂方法
                // // 2021-08-02 fix 此处没有继承原对象，导致自定义方法被重置的 bug
                // this.actions = helper.extend({}, this.actions, {
                //     FETCH: FETCH.bind(this), GET: GET.bind(this)
                // }, ACTIVE(model, this), RESTFUL(model, this))
                helper.extend(tableActions, ACTIVE(model, this), RESTFUL(model, this))
            }
        }
    }
    // 0.4.0 推荐 table 声明方式
    if (typeof this.tables === 'object') {
        for (const name in this.tables) {
            let options = this.tables[name]
            if (typeof options === 'string') {
                options = {url: options}
            }
            // Model.dataSet(this.state, name, new Table(name, options))
            this.state[name] = new Table(name, options, {options})
            helper.extend(tableActions, ACTIVE(name, this), RESTFUL(name, this))
        }
    }

    // 合并工厂方法
    this.actions = helper.extend({}, {
        FETCH: FETCH.bind(this), GET: GET.bind(this)
    }, tableActions, this.actions)
}

// Model.framework = 'vue-2'
Model.store = null // 对应 vuex 实例，在 setup 方法中加载
Model.httpAdapter = null // 对应 ajax 适配器，在 setup 方法中加载
Model.uniRequestAdapter = false // 在 uni.request 中是否自动对 config 和 res 进行转译
Model.enableStateOptions = true // 兼容旧版本，是否启用 state 配置数据模型 【之后版本会完全禁用】
Model.primaryKey = 'id', // 默认主键字段名称
Model.prototype.state = {
    // _models: {ajax: [], names: []} // 2021-12-29 暂时取消该功能
    // ajax: [], models: [], // 这两个对象需要重命名，放入深层对象 _models
    // common: {options: {}} // 取消掉 common
}
Model.prototype.mutations = {
    FETCH_JOIN, FETCH_UPDATE, FETCH_REMOVE, FETCH_CHECK,
    TABLE_UPDATE, TABLE_RESET,
    TABLE_ROWS_JOIN, TABLE_ROWS_MERGE, TABLE_ROW_EXTEND, TABLE_ROW_REMOVE
}
Model.prototype.getters = {}

Model.Mutations = Mutations
Model.Actions = Actions
Model.Factory = {ACTIVE, RESTFUL}
const ModelDefaultConfig = {
    GET: {
        // debounce: 200,
        interact: true, // 数据联动
        mode: 'page' // 切换模式 page marker next
    },
    POST: {
        // debounce: 500,
        interact: false
    },
    PUT: {
        // debounce: 500,
        interact: true
    },
    PATCH: {
        // debounce: 500,
        interact: true
    },
    DELETE: {
        // debounce: 500,
        interact: true
    }
}
Model.config = helper.originJSON(ModelDefaultConfig)
Model.dataSet = function(obj, key, value) {
    obj[key] = value // 此为 Vue3 的方案，Vue2需要另外传入
}
Model.version = pkg.version // 设置版本号
Model.setup = function(opt) {
    for (const key in ModelDefaultConfig) {
        if (opt && opt[key] !== undefined) {
            Model.config[key] = Object.assign(Model.config[key], opt[key])
        }
    }
    // 全局配置
    if (opt.primaryKey && typeof opt.primaryKey === 'string') Model.primaryKey = opt.primaryKey
    if (typeof opt.dataSet === 'function') Model.dataSet = opt.dataSet // vue2 要求传入 Vue.set 方法（由框架自动判断注入）
    if (opt.httpAdapter) Model.httpAdapter = opt.httpAdapter // 设置 ajax 请求适配器
    if (opt.uniRequestAdapter) Model.uniRequestAdapter = !!opt.uniRequestAdapter // uni.request 转译器
    if (opt.store) Model.store = opt.store // 设置状态管理模型
    if (opt.enableStateOptions !== undefined) Model.enableStateOptions = !!opt.enableStateOptions // 启用 state 配置
}
// Model.register = function(opt) {

// }

export {Model, Table}
import Vue from 'vue'
import Helper from '@dgteam/helper'
import * as Mutations from "./mutations"
import * as Actions from "./actions"
import { ACTIVE, RESTFUL } from "./factory"
import { List } from './class'
import pkg from '../../package.json'
const { FETCH, GET, FETCH_FINISH } = Actions
const { 
    FETCH_REMOVE, FETCH_CANCEL, FETCH_UPDATE,
    MODEL_ADD, MODEL_MORE, MODEL_UPDATE, MODEL_REMOVE, MODEL_RESET,
    MODEL_ROW_EXTEND
} = Mutations


class Model {

    state = {
        ajax: [], models: [],
        common: {options: {}}
    }
    actions = {
        FETCH: FETCH.bind(this),
        GET: GET.bind(this),
        FETCH_FINISH: FETCH_FINISH.bind(this)
    }
    mutations = {
        FETCH_UPDATE, FETCH_CANCEL, FETCH_REMOVE,
        MODEL_ADD, MODEL_MORE, MODEL_REMOVE, MODEL_UPDATE, MODEL_RESET,
        MODEL_ROW_EXTEND
    }
    getters = {}

    static Mutations = Mutations
    static Actions = Actions
    static Factory = { ACTIVE, RESTFUL }
    static Options = {
        version: pkg.version,
        fetch: {
            ajax: null, 
            socket: null, 
            handle: 'auto', // 使用模式 [ajax | scocket | auto]
            beforeFetch: null,            
            beforeRestful: null,
            afterFetch: null,
            afterRestful: null
        },
        RESTful: {
            GET: {
                debounce: 200,
                interact: true
            },
            POST: {
                debounce: 500,
                interact: false
            },
            PUT: {
                debounce: 500,
                interact: true
            },
            DELETE: {
                debounce: 500,
                interact: true
            }
        }
    }

    // 安装默认配置
    static install(opt){
        for (let key of ['fetch', 'RESTful']) {
            if (opt && opt[key] && typeof opt[key] === 'object') {
                Model.Options[key] = Object.assign(Model.Options[key], opt[key])
            }
        }
    }
    
    // 注册新模型
    static register(model, options){

    }

    constructor(opt={}){
       
        this.store = opt.store
        this.auth = opt.auth        
        this.fetch = Object.assign(Model.Options.fetch, opt.fetch)
        this.namespaced = true

        // 混合配置
        for (let key of ['state', 'actions', 'mutations', 'getters']) {
            if (opt && typeof opt[key] === 'object') {
                this[key] = Object.assign(this[key], opt[key])
            }
        }

        // 遍历所有 state 查找 dgx 模块并创建方法
        for (let model in this.state) {
            if(Helper.IsObject(this.state[model]) && this.state[model].options){

                if (typeof options === 'string') {
                    options = {url: options}
                }

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
                    ajax: [], //new List(),
                    error: false,
                    page: 1,
                    marker: undefined,
                    total: null,
                    count: undefined,
                    empty: false,
                    list: [], // new List(),
                    filter: {},
                    id: null,
                    active: null,
                    item: null
                }, this.state[model]))
                Vue.set(this.state[model], 'reset', Object.assign({}, this.state[model]))

                // 合并工厂方法
                this.actions = Object.assign(this.actions, ACTIVE(model, this), RESTFUL(model, this))                 
            }
        }
    }
}

export default Model
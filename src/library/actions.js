import {Model} from './main.js'
import helper from '../helper.js'

const requestConfigAdapter = (config, {uni = false} = {}) => {
    if (uni) {
        const result = helper.originJSON(config)
        // headers > header
        if (result.headers && typeof result.headers === 'object') {
            result.header = helper.originJSON(result.headers)
            delete result.headers
        }
        // 拼接 params 查询参数
        if (result.params && typeof result.params === 'object') {
            if (result.url.indexOf('?') === -1) result.url += '?'
            for (let key in result.params) {
                if (result.params[key] !== undefined) {
                    if (typeof result.params[key] === 'string' || typeof result.params[key] === 'number') {
                        result.url += `${key}=${result.params[key]}&`
                    } else {
                        result.url += `${key}=${JSON.stringify(result.params[key])}&`
                    }
                }
            }
        }
        return result
    }
    return config
}

/**
 * FETCH 请求
 * @param {String} config.method - 请求方式: GET POST PUT DELETE
 * @param {Object} config.params - 请求参数，会自动拼接到 url 中
 * @param {Object} config.paths - 路由参数，会自动替换到 url 中（若 paths 无法找到必要参数，框架自动从 params 中寻找）
 * @param {Object} config.data - 请求体
 * @param {Object} config.header - 请求头
 * @param {Boolean | String} config.only - 时执行相同唯一键的请求，前一个请求会被作废; 传 true 由框架自动生成唯一键，也可以手动传入字符串
 * @returns Promise
 */
const FETCH = function({state, commit}, config = {}) {

    const table = config.table || config.model || false // 2021-12-29 由于取消了 common 模块，在不指定 table 时候将无法正确挂载
    const {method, silent, only} = config

    // 检测是否重复，如果重复则取消之前相同的方法
    if (only && table && state[table] && helper.isArray(state[table].ajax)) {
        state[table].ajax.forEach((fetch, index) => {
            if (fetch.only === only) {
                try {
                    fetch.cancel({table, only})
                } catch (e) {
                    helper.consoleWarn('need cancelHandler.')
                }
                commit('FETCH_REMOVE', [table, index])
                commit('FETCH_CHECK', table)
            }
        })
    }

    // uni.request 所传递的参数不一样，需要改写部分字段

    // 整合请求头
    if (!config.headers) config.headers = {}

    if (table && state[table] && state[table].auth) {
        config.headers['Identity'] = state[table].auth // 此步骤不符合规范
        if (!config.auth) {
            config.auth = state[table].auth
        }
    }
    if (config.auth) {
        config.headers['Identity'] = config.auth
    }
    delete config.auth // 会和其他参数


    const paths = []  // 自动填充路由参数，例如 /user/:id 等，默认从 paths 中获取，若获取不到则尝试从 params 中获取
    for (const route of config.url.split('/')) {
        if (route[0] === ':' && route.length > 1) {
            const key = route.substr(1)
            if (config.paths && config.paths[key] !== undefined && typeof config.paths[key].toString === 'function') {
                paths.push(config.paths[key].toString())
            } else if (config.params && config.params[key] !== undefined && typeof config.params[key].toString === 'function') {
                paths.push(config.params[key].toString())
            } else {
                paths.push('')
                helper.consoleWarn(`lose paths variables"${key}"`)
            }
        } else {
            paths.push(route)
        }
    }
    config.url = paths.join('/')


    return new Promise(resolve => {

        // 内部请求 id
        const id = helper.randomString(16)
        // 请求完成回调函数
        const fetchFinish = function(id) {
            const index = table && state[table].ajax.findIndex(item => item.id === id)
            if (typeof index === 'number' && index >= 0) {
                commit('FETCH_REMOVE', [table, index])
                commit('FETCH_CHECK', table)
            }
        }

        const callback = {

            // 成功回调
            success: function(res) {

                // 兼容原生 uni.request
                if (Model.uniRequestAdapter && Array.isArray(res) && res.length === 2) {
                    const {data, header: headers, statusCode: status} = res[1]
                    res = {config, status, headers, data}
                }

                commit('TABLE_UPDATE', [table, {init: true, error: false}])
                fetchFinish(id)
                if (typeof config.responseType === 'string' && config.responseType.toLowerCase() === "arraybuffer") {
                    resolve({data: res.data, config: Object.assign({}, config, res.config)})
                } else {
                    resolve({...res.data, config: Object.assign({}, config, res.config)})
                }
            },

            // 失败回调
            error: function(res) {
                fetchFinish(id)
                commit('TABLE_UPDATE', [table, {error: true}])
                resolve({...res.data, config: Object.assign({}, config, res.config)})
            }
        }

        if (Model.httpAdapter) {
            commit('FETCH_JOIN', [table, {id, table, only, method, silent}]) // 2021-12-29 fix 如果 httpAdapter 没有注册 getCancel 方法导致请求无法加入 ajax 队列的问题
            commit('FETCH_CHECK', table)
            const getCancel = (requestId, cancel) => commit('FETCH_UPDATE', [table, {id, requestId, cancel}])  // 取消事件注册，需要获取 cancel 方法，以便之后取消时候执行
            const requestConfig = requestConfigAdapter(config, {uni: Model.uniRequestAdapter})
            return Model.httpAdapter({getCancel, ...requestConfig}).then(callback.success, callback.error)
        } else {
            helper.consoleWarn('need httpAdapter.')
        }
    })
}

/**
 * Fetch GET 语法糖
 * 2021-12-29 不推荐使用，之后会被移除
 */
const GET = function({dispatch}, config) {
    if (typeof config === 'string') {
        config = {url: config}
    } else if (Array.isArray(config)) { // 2021-07-09 fix 原本没有判断到 config 参数
        const [url, parmas = {}, options = {}] = config
        config = {url, parmas, ...options}
    }
    return dispatch('FETCH', {...config, method: 'GET'})
}

export {
    FETCH, GET
}
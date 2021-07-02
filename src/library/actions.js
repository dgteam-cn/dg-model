import Model from './main.js'

const FETCH = function({state, dispatch, commit}, config = {}) {

    const model = config.model || 'common'
    const {method, silent, only} = config

    // 检测是否重复，如果重复则取消之前相同的方法
    if (only) {
        commit('FETCH_CANCEL', [model, only]) //console.warn('dgx 请求重复，自动取消前一个请求。',config)
    }

    if (!config.headers) {
        config.headers = {}
    }
    if (state[model] && state[model].auth) {
        config.headers['Identity'] = state[model].auth
        if (!config.auth) {
            config.auth = state[model].auth
        }
    }
    if (config.auth) {
        config.headers['Identity'] = config.auth
    }
    delete config.auth
    // 返回 Fetch 方法

    // 自动填充路由参数，例如 /user/:id 等，默认从 paths 中获取，若获取不到则尝试从 params 中获取
    const paths = []
    for (const route of config.url.split('/')) {
        if (route[0] === ':' && route.length > 1) {
            const key = route.substr(1)
            if (config.paths && config.paths[key] !== undefined) {
                paths.push(config.paths[key])
                delete config.paths[key]
            } else if (config.params && config.params[key] !== undefined) {
                paths.push(config.params[key])
                delete config.params[key]
            } else {
                // eslint-disable-next-line no-console
                console.log('[DGX FETCH] - lose paths ' + key)
            }
        } else {
            paths.push(route)
        }
    }
    config.url = paths.join('/')

    return new Promise(resolve => {

        const callback = {
            // 成功回调
            success: function(res) {
                commit('MODEL_UPDATE', [model, 'init', true])
                commit('MODEL_UPDATE', [model, 'error', false])
                dispatch('FETCH_FINISH', [model, res.config.id])
                if (config.responseType === "arraybuffer") {
                    resolve({data: res.data, config: res.config})
                } else {
                    resolve({...res.data, config: res.config})
                }
            },
            // 失败回调
            error: function(res) {
                if (res && res.config && res.config.id) {
                    dispatch('FETCH_FINISH', [model, res.config.id])
                }
                commit('MODEL_UPDATE', [model, 'error', true])
                resolve({...res.data, config: res.config ? res.config : {}})
            }
        }

        const getCancel = function(id, cancel) {
            commit('MODEL_ADD', [model, 'ajax', {id, model, only, method, cancel, silent}])
            commit('FETCH_UPDATE', [model])
        }

        // const {fetch} = this
        const {fetch} = Model.config
        if (fetch.socket && fetch.socket.status === 'online' && fetch.handle === 'auto' && config.use != 'ajax') {
            config.use = 'socket'
            return fetch.socket.proxy({getCancel, ...config}).then(callback.success, callback.error)
        } else {
            config.use = 'ajax'
            return fetch.ajax({getCancel, ...config}).then(callback.success, callback.error)
        }
    })
}

/**
 * Fetch GET 语法糖
 * @param {string} opt[0] model - 模型名称
 * @param {string} opt[1] id - 请求 id
 */
const GET = function({dispatch}, config) {
    if (typeof config === 'string') {
        config = {url: config}
    } else if (Array.isArray) {
        const [url, parmas = {}, options = {}] = config
        config = {url, parmas, ...options}
    }
    return dispatch('FETCH', {...config, method: 'GET'})
}

/**
 * Fetch 结束请求
 * @param {string} opt[0] model - 模型名称
 * @param {string} opt[1] id - 请求 id
 */
const FETCH_FINISH = function({state, commit}, [model, id]=[]) {
    const index = state[model].ajax.findIndex(item => item.id === id)
    if (index >= 0) {
        commit('FETCH_REMOVE', [model, index])
        commit('FETCH_UPDATE', [model])
    }
    // state[model].ajax.forEach((item, index) => {
    //     if (item.id === id) {
    //         commit('FETCH_REMOVE', [model, index])
    //         return commit('FETCH_UPDATE', [model])
    //     }
    // })
}

export {
    FETCH, GET, FETCH_FINISH
}
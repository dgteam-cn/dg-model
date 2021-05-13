import helper from './helper'
import {Item} from './class'
import Model from './main.js'
// import debounce from 'lodash/debounce'
// import throttle from 'lodash/throttle'


const ACTIVE = function(model){

    const MODEL = model.toUpperCase()

    const ACTIVE_MODEL = `ACTIVE_${MODEL}`
    const ACTIVE_MODEL_CHANGE = `ACTIVE_${MODEL}_CHANGE`
    const ACTIVE_MODEL_RESET = `ACTIVE_${MODEL}_RESET`

    const apis = {
        [ACTIVE_MODEL]({state, dispatch}, active) {
            if (Array.isArray(active) && active[0]) {
                active = active[0]
            }
            if (active === undefined || active === null) {
                // 重置
                dispatch(ACTIVE_MODEL_RESET)
            } else if (typeof active === "object") {
                // 以 对象条件 来确定焦点
                const list = state[model].list
                for (let i = 0; i < list.length; i++) {
                    if (active.id && list[i].id && list[i].id === active.id) {
                        return dispatch(ACTIVE_MODEL_CHANGE, {id: list[i].id || undefined, active: i, item: list[i]})
                    }
                }
            } else {
                // 以索引来确定焦点，（ -1 = 选择数组的最后一个）
                if (active==-1) {
                    active = state[model].list.length > 0 ? state[model].list.length - 1 : 0
                }
                // 如果焦点不存在则默认使用原焦点，如果原焦点不存在则默认使用 0
                let queue = [active, state[model].active, 0]
                for (let i=0; i< queue.length; i++) {
                    if (state[model].list[queue[i]]) {
                        active = queue[i]
                        break
                    }
                }
                // 如果列表存在键值
                if (state[model].list && state[model].list[active]) {
                    return dispatch(`ACTIVE_${MODEL}_CHANGE`, {id: state[model].list[active].id, active, item: state[model].list[active]})
                }
                dispatch(`ACTIVE_${MODEL}_RESET`)
            }
        },

        [ACTIVE_MODEL_CHANGE]({commit}, config={}){
            for (const key of ['id', 'active', 'item']) {
                if (config[key] || config[key] == 0) {
                    commit('MODEL_UPDATE', [model, key, config[key]])      
                }
            }
            return config.item
        },

        [ACTIVE_MODEL_RESET]({commit}){
            for (const key of ['id', 'active', 'item']) {
                commit('MODEL_UPDATE', [model, key, undefined])
            }
        }
    }
    return apis
}

const RESTFUL = function(model, {state, fetch}) {
    
    const MODEL = model.toUpperCase()
    const opt = state[model].options
    const apis = {}
    const actions = [
        {name: 'GET', method: 'GET'},
        {name: 'MORE', method: 'GET'},
        {name: 'POST', method: 'POST'},
        {name: 'PUT', method: 'PUT'},
        {name: 'DELETE', method: 'DELETE'}
    ]
    for (let action of actions) {

        const {name, method} = action
        let path = `${name}_${MODEL}`

        apis[path] = ({state, dispatch, commit}, data={}) => {

            /**
             * @name 获取配置项目
             * @param {string} key [only, interact, debounce, throttle, silent, loading]
             * @param {string} method [GET, POST, PUT, DELETE]
             */
            const getRESTfulConfig = (key, method) => {
                let infer = false
                if (typeof key === 'string') {                    
                    if (data[key]) {
                        // 优先从 action 的 data 中获取
                        infer = data[key] 
                    } else if (opt[method] && opt[method][key]) {
                        // 否则从 model 的 options 中获取
                        infer = opt[method][key]
                    } else if (opt[key]) {
                        infer = opt[key]
                    } else if (typeof Model.Options.RESTful === 'object') {
                        // 尝试在全局属性中获取
                        if (typeof Model.Options.RESTful[method] === 'object' && Model.Options.RESTful[method][key]) {
                            infer = Model.Options.RESTful[method][key]
                        } else if (Model.Options.RESTful[key]) {
                            infer = Model.Options.RESTful[key]
                        }
                    }
                    if (infer === true && key === 'only') {
                        infer = method // only 特性
                    }
                }
                return infer
            }

            // 自动填充路由参数，例如 /user/:id 等，默认从 paths 中获取，若获取不到则尝试从 params 中获取
            const paths = []
            for (let route of opt.url.split('/')) {
                if (route[0] === ':') {
                    const key = route.substr(1)
                    if (data.paths && data.paths[key] != undefined) {
                        paths.push(data.paths[key])
                        delete data.paths[key]
                    } else if (data.params && data.params[key] != undefined) {
                        paths.push(data.params[key])
                        delete data.params[key]
                    } else {
                        console.warn('DGX RESTFUL - lose paths ' + key)
                    }
                } else {
                    paths.push(route)
                }
            }
            
            const fetchData = {
                method, model,
                url: data.id ? `${paths.join('/')}/${data.id}` : paths.join('/'),
                data: data.data || {},
                params: data.params || {},
                paths: data.paths || {},
                header: data.header || {},
                limit: getRESTfulConfig('limit', method) || {}, // 请求限制
                only: getRESTfulConfig('only', method), // 是否是禁止重复请求
                silent: getRESTfulConfig('silent', method), // 是否静默加载
                loading: getRESTfulConfig('loading', method) // 是否显示加载中动画 （移动端）
            }

            if (typeof fetchData.limit === 'object') {
                for (const key in fetchData.limit) {
                    for (const name of ['params', 'paths', 'data']) {
                        if (
                            (method === 'GET' && name === 'params') ||
                            (method !== 'GET' && name === 'data') ||
                            name === 'paths'
                        ) {
                            fetchData[name][key] = fetchData.limit[key]
                        }
                    }
                }
            }

            // 加载更多时，自动区分 marker 模式与 page 模式
            if (name === 'MORE') {
                if (state[model].marker !== undefined) {
                    fetchData.params.marker = state[model].marker
                } else {
                    fetchData.params.page = state[model].page + 1
                }
            }

            // 数据联动
            const interactHandles = {

                GET: ({commit, model}, res, config) => {
                    const interact = getRESTfulConfig('interact', 'GET')
                    if (config.id) {
                        if (interact) {
                            commit('MODEL_UPDATE', [model, 'id', res.result.id])
                            commit('MODEL_UPDATE', [model, 'item', res.result]) // new Item(res.result)
                        }
                    } else if (Array.isArray(res.result)) {
                        if (interact) {
                            if (name === 'MORE') {
                                commit('MODEL_MORE', [model, 'list', res.result]) // new List(res.result)
                            } else {
                                commit('MODEL_UPDATE', [model, 'list', res.result])
                            }
                        }
                        commit('MODEL_UPDATE', [model, 'page', res.page])
                        commit('MODEL_UPDATE', [model, 'marker', res.marker !== undefined ? res.marker : undefined])
                        commit('MODEL_UPDATE', [model, 'count', res.count != undefined && res.count >= 0 ? res.count : undefined])
                        commit('MODEL_UPDATE', [model, 'total', res.total])
                        commit('MODEL_UPDATE', [model, 'empty', !!(res.page == 1 && !res.result.length)])
                        commit('MODEL_UPDATE', [model, 'more', res.page < res.total])
                        commit('MODEL_UPDATE', [model, 'filter', config.params ? helper.Origin(config.params) : {}])
                    } else if (interact) {
                        commit('MODEL_UPDATE', [model, 'list', res.result || res]) // new List(res.result)
                        commit('MODEL_UPDATE', [model, 'item', res.result || res])
                    }
                },
                
                POST: ({state, commit, model}, res, config) => {
                    const interact = getRESTfulConfig('interact', 'POST')
                    if (interact && res.result && res.result.id) {
                        let position = 'end' // 判定增加数据的位置
                        if (typeof interact === 'object' && interact.position) {
                            position = interact.position
                        } else if (typeof interact === 'number' || ~['start', 'begin', 'head', 'end', 'finish', 'foot', 'last'].indexOf(interact)) {
                            position = interact
                        }
                        commit('MODEL_ADD', [model, 'list', new Item(res.result), position])
                        if (state[model].count != undefined && state[model].count >= 0) {
                            commit('MODEL_UPDATE', [model, 'count', state[model].count + 1])
                        }
                        // 是否需要取消列表
                        if (state[model].empty) {
                            commit('MODEL_UPDATE', [model, 'empty', false])
                        }
                    }
                },

                PUT: ({commit, model}, res, config) => {
                    const interact = getRESTfulConfig('interact', 'PUT')
                    if (interact && res.result && res.result.id) {
                        commit('MODEL_ROW_EXTEND', [model, res.result])
                    }
                },

                DELETE: ({state, commit, model}, res, config) => {
                    const interact = getRESTfulConfig('interact', 'DELETE')
                    if (interact) {
                        commit('MODEL_REMOVE', {base: model, id: config.id,  key: 'list'})
                        if (state[model].item && state[model].item.id === config.id) {
                            commit('MODEL_UPDATE', [model, 'id', null])
                            commit('MODEL_UPDATE', [model, 'active', null])
                            commit('MODEL_UPDATE', [model, 'item', null])
                        }
                        // 影响统计数
                        if (state[model].count != undefined && state[model].count > 0) {
                            commit('MODEL_UPDATE', [model, 'count', state[model].count - 1])
                        }
                        // 是否需要触发空列表
                        if (state[model].page === 1 && state[model].list.length === 0) {
                            commit('MODEL_UPDATE', [model, 'empty', true])
                            commit('MODEL_UPDATE', [model, 'more', false])
                        }
                    }
                } 
            }

            // fetch 主函数
            const fetchHandle = res => {
                if (res && res.result) {
                    // 事件联动
                    interactHandles[method]({state, dispatch, commit, model}, res, data)
                }
                if (data.active || data.active == 0) {
                    dispatch(`ACTIVE_${MODEL}`, data.active)
                }
                return res
            }

            return dispatch('FETCH', fetchData).then(res => fetchHandle(res))
        }
    }
    return apis
}
export {
    ACTIVE, RESTFUL
}
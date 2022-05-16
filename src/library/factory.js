import helper from '../helper'
import {Model} from './main.js'
// import {debounce, throttle} from '/dist/lodash.js'


const ACTIVE = function(table) {

    const TABLE = table.toUpperCase()

    const ACTIVE_TABLE = `ACTIVE_${TABLE}`
    const ACTIVE_TABLE_CHANGE = `ACTIVE_${TABLE}_CHANGE`
    const ACTIVE_TABLE_RESET = `ACTIVE_${TABLE}_RESET`

    const apis = {
        [ACTIVE_TABLE]({state, dispatch}, active) {
            if (helper.isArray(active) && active[0]) {
                active = active[0]
            }
            if (active === undefined || active === null) {
                // 重置
                dispatch(ACTIVE_TABLE_RESET)
            } else if (typeof active === "object") {
                // 以 对象条件 来确定焦点
                const item = active
                const list = state[table].list
                const {primaryKey} = Model
                for (let i = 0; i < list.length; i++) {
                    if (item[primaryKey] && list[i][primaryKey] && list[i][primaryKey] === item[primaryKey]) {
                        return dispatch(ACTIVE_TABLE_CHANGE, {[primaryKey]: list[i][primaryKey] || undefined, active: i, item: list[i]})
                    }
                }
            } else {
                // 以索引来确定焦点，（ -1 = 选择数组的最后一个）
                if (active == -1) {
                    active = state[table].list.length > 0 ? state[table].list.length - 1 : 0
                }
                // 如果焦点不存在则默认使用原焦点，如果原焦点不存在则默认使用 0
                let queue = [active, state[table].active, 0]
                for (let i=0; i< queue.length; i++) {
                    if (state[table].list[queue[i]]) {
                        active = queue[i]
                        break
                    }
                }
                // 如果列表存在键值
                if (state[table].list && state[table].list[active]) {
                    const {primaryKey} = Model
                    return dispatch(ACTIVE_TABLE_CHANGE, {[primaryKey]: state[table].list[active][primaryKey], active, item: state[table].list[active]})
                }
                dispatch(ACTIVE_TABLE_RESET)
            }
        },

        [ACTIVE_TABLE_CHANGE]({commit}, config = {}) {
            for (const key of ['active', 'item']) {
                if (config[key] || config[key] == 0) {
                    commit('TABLE_UPDATE', [table, key, config[key]])
                }
            }
            return config.item
        },

        [ACTIVE_TABLE_RESET]({commit}) {
            for (const key of ['active', 'item']) {
                commit('TABLE_UPDATE', [table, key, undefined])
            }
        }
    }
    return apis
}

const RESTFUL = function(table, {state}) {

    const TABLE = table.toUpperCase()
    const opt = state[table].options
    const apis = {}
    const actions = [
        {name: 'GET', method: 'GET'},
        {name: 'MORE', method: 'GET'},
        {name: 'POST', method: 'POST'},
        {name: 'PUT', method: 'PUT'},
        {name: 'PATCH', method: 'PATCH'},
        {name: 'DELETE', method: 'DELETE'}
    ]
    for (let action of actions) {

        const {name, method} = action
        let path = `${name}_${TABLE}`

        apis[path] = ({state, dispatch, commit}, data = {}) => {

            /**
             * @name 获取配置项目
             * @param {string} key [only, interact, debounce, throttle, silent, loading]
             * @param {string} method [GET, POST, PUT, DELETE]
             */
            const getRESTfulConfig = (key, method) => {
                let result = false
                if (typeof key === 'string') {
                    if (data[key]) {
                        // #1 - 优先从 action 的 fetchData 中获取
                        result = data[key]
                    } else if (opt[method] && opt[method][key]) {
                        // #2 否则从 Table 的 options 中获取
                        result = opt[method][key]
                    } else if (typeof Model.config === 'object') {
                        // #3 最终尝试在 Model 的静态属性 config 中获取
                        if (typeof Model.config[method] === 'object' && Model.config[method][key]) {
                            result = Model.config[method][key]
                        }
                    }
                    if (result === true && key === 'only') {
                        result = method // only 特性，如果未传 onlyKey 则自动指定 method 字段为 onlyKey
                    }
                }
                return result
            }

            // 封装 fetch 数据
            const fetchData = {
                method, table,
                // url: data.id ? `${paths.join('/')}/${data.id}` : paths.join('/'),
                url: `${opt.url}${data.id ? '/' + data.id : ''}`,
                data: data.data || {}, // 请求体
                params: data.params || {}, // url 参数
                paths: data.paths || {}, // url path 参数
                header: data.header || {}, // 请求头
                limit: getRESTfulConfig('limit', method) || {}, // 请求限制
                only: getRESTfulConfig('only', method), // 是否是禁止重复请求
                silent: getRESTfulConfig('silent', method), // 是否静默加载
                loading: getRESTfulConfig('loading', method), // 是否显示加载中动画 （移动端）
                customData: getRESTfulConfig('customData', method) // 自定义对象
            }

            if (typeof fetchData.limit === 'object') {
                for (const key in fetchData.limit) {
                    for (const name of ['params', 'paths', 'data']) {
                        if (
                            method === 'GET' && name === 'params' ||
                            method !== 'GET' && name === 'data' ||
                            name === 'paths'
                        ) {
                            fetchData[name][key] = fetchData.limit[key]
                        }
                    }
                }
            }

            // 加载更多时，自动区分 marker 模式与 page 模式
            if (name === 'MORE') {
                if (state[table].marker !== undefined) {
                    fetchData.params.marker = state[table].marker
                } else {
                    fetchData.params.page = state[table].page + 1
                }
            }

            // 封装 vuex 方法方便之后的 table 操作调用
            const tableCtrl = {
                update: (key, value) => commit('TABLE_UPDATE', [table, key, value]), // 更新 table 的属性
                rows: {
                    add: (item, position) => commit('TABLE_ROWS_JOIN', [table, item, position]), // 新增 row 到 table.list
                    update: item => commit('TABLE_ROW_EXTEND', [table, item]), // 更新 row 到 table.list
                    merge: list => commit('TABLE_ROWS_MERGE', [table, list]), // 合并 rows 到 table.list
                    remove(id) { // 移除 row 到 table.list
                        if (id && typeof id === 'object') {
                            try {
                                id = id[Model.primaryKey] // 兼容对象写法
                            } catch (e) {}
                        }
                        commit('TABLE_ROW_REMOVE', [table, id])
                    }
                }
            }

            // 数据联动
            const interactHandles = {

                GET: (opt, res, config) => {
                    const interact = getRESTfulConfig('interact', 'GET')
                    if (config.primaryKey && !config.id) config.id = config.primaryKey
                    if (config.id) {
                        if (interact) {
                            // TODO 此方式无法触发 model.active 字段
                            tableCtrl.update('item', res.result)
                        }
                    } else if (Array.isArray(res.result)) {
                        if (interact) {
                            if (name === 'MORE') {
                                tableCtrl.rows.merge(res.result)
                            } else {
                                tableCtrl.update('list', res.result)
                            }
                        }
                        const page = res.page || config.params && config.params.page || 1
                        const marker = res.marker !== undefined ? res.marker : undefined
                        const count = res.count != undefined && res.count >= 0 ? Number(res.count) : undefined
                        const total = res.total // TODO 如果 total 不传但是有 count & size 值，那么应该手动计算 total 值
                        const empty = !!(res.page == 1 && !res.result.length)
                        const more = res.page < res.total
                        const filter = config.params ? helper.originJSON(config.params) : {}
                        tableCtrl.update({page, marker, count, total, empty, more, filter})
                    } else if (interact) {
                        tableCtrl.update('list', res.result || res)
                    }
                },

                POST: ({state, table}, res) => {
                    const interact = getRESTfulConfig('interact', 'POST')
                    const {primaryKey} = Model
                    if (interact && res.result && res.result[primaryKey]) {
                        let position = 'end' // 判定增加数据的位置
                        if (typeof interact === 'object' && interact.position) {
                            position = interact.position
                        } else if (typeof interact === 'number' || ~['start', 'begin', 'head', 'end', 'finish', 'foot', 'last'].indexOf(interact)) {
                            position = interact
                        }
                        tableCtrl.rows.add(res.result, position)
                        if (state[table].count != undefined && state[table].count >= 0) {
                            tableCtrl.update('count', state[table].count + 1)  // commit('TABLE_UPDATE', [model, 'count', state[model].count + 1])
                        }
                        if (state[table].empty) {
                            tableCtrl.update('empty', false) // 判断是否已经脱离 “空列表” 状态 commit('TABLE_UPDATE', [model, 'empty', false])
                        }
                    }
                },

                PUT: (opt, res) => {
                    const interact = getRESTfulConfig('interact', 'PUT')
                    const {primaryKey} = Model
                    if (interact && res.result && res.result[primaryKey]) {
                        tableCtrl.rows.update(res.result)
                    }
                },

                DELETE: ({state, table}, res, config) => {
                    const interact = getRESTfulConfig('interact', 'DELETE')
                    if (interact) {
                        const {primaryKey} = Model
                        tableCtrl.rows.remove(config.id)
                        if (state[table].item && state[table].item[primaryKey] === config.id) {
                            tableCtrl.update({active: null, item: null})
                        }
                        // 影响统计数
                        if (state[table].count != undefined && state[table].count > 0) {
                            tableCtrl.update({count: state[table].count - 1})
                        }
                        if (state[table].page === 1 && state[table].list.length === 0) {
                            tableCtrl.update({empty: true, more: false})  // 判断是否需要触发 “空列表” 状态
                        }
                    }
                }
            }
            interactHandles.PATCH = interactHandles.PUT // patch 语法糖

            // fetch 主函数
            const fetchHandle = res => {
                if (res && res.result) {
                    // 事件联动
                    interactHandles[method]({state, dispatch, commit, table}, res, data)
                }
                if (data.active || data.active == 0) {
                    dispatch(`ACTIVE_${TABLE}`, data.active)
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
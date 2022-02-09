import {Model, Table} from './main.js'
import helper from '../helper'

// ==================== 请求器 ====================

// Fetch 加入
const FETCH_JOIN = function(state, [table, ajax] = []) {
    // state._models.ajax.push(ajax) // 2021-12-29 暂时取消该功能
    if (table && state[table] && state[table].ajax) {
        state[table].ajax.push(ajax)
    }
}

// Fetch 数据移除
const FETCH_REMOVE = function(state, [table, index] = []) {
    if (table && state[table] && state[table].ajax) {
        state[table].ajax.splice(index, 1) // index 索引是由 FETCH_FINISH 去计算的
    }
}

// Fetch 数据更新
const FETCH_UPDATE = function(state, [table, fetch] = []) {
    if (table && state[table] && state[table].ajax && fetch && fetch.id) {
        const instance = state[table].ajax.find(item => item.id === fetch.id)
        if (instance) {
            for (const key in fetch) {
                Model.dataSet(instance, key, fetch[key])
            }
        }
    }
}

// Fetch 数据统计核查更新
const FETCH_CHECK = function(state, table) {
    if (table && state[table] && state[table].ajax) {
        let loading = 0, editing = 0;
        for (const fetch of state[table].ajax) {
            if (fetch.method) {
                let method = fetch.method.toUpperCase()
                if (method === 'GET') {
                    loading += 1
                } else if (~['POST', 'PUT', 'DELETE'].indexOf(method)) {
                    editing += 1
                }
            }
        }
        Model.dataSet(state[table], 'loading', loading)
        Model.dataSet(state[table], 'editing', editing)
    }
}

// ==================== 表字段 ====================

// 表字段更新
const TABLE_UPDATE = function(state, [table, key = 'list', value] = []) {
    if (table && typeof state[table] === 'object') {
        if (typeof key === 'string') {
            Model.dataSet(state[table], key, value)
        } else if (typeof key === 'object' && key !== null) {
            for (let k in key) {
                Model.dataSet(state[table], k, key[k])
            }
        }
    }
}

// 表属性重置
const TABLE_RESET = function(state, table) {
    const tables = Array.isArray(table) ? table : [table]
    tables.forEach(name => {
        window.test = state[name]
        // 在 nuxt2 service 模式中 instance 方法会失效，需要根据 table 属性判断
        if (name && state[name] && (helper.instance(state[name], Table) || state[name].__table__)) {
            const reset = Object.assign({}, state[name].__reset__)
            for (const key in reset) {
                Model.dataSet(state[name], key, reset[key]) // 2021-12-23 v0.4 部分新增的自定义字段不会被重置，仅重置初始字段
            }
        }
    })
}

// // ==================== 行字段 ====================

/**
 * 添加 row 数据到 table.list
 * @param {Object} state - vuex state
 * @param {String} agrs[table] - 表名称
 * @param {Object} agrs[row] - 行数据
 * @param {Number|String} agrs[position] = 添加位置
 */
const TABLE_ROWS_JOIN = function(state, [table, row, position = -1] = []) {
    if (typeof position === 'string') {
        if (~['start', 'begin', 'head'].indexOf(position)) {
            position = 0
        } else if (~['end', 'foot', 'last'].indexOf(position)) {
            position = -1
        } else {
            position = parseInt(position)
        }
    }
    if (position === 0) {
        state[table].list.unshift(row)
    } else if (position === -1) {
        state[table].list.push(row)
    } else if (Number.isInteger(position)) {
        state[table].list.splice(position, 0, row)
    }
}


/**
 * 合并 row 数据到 table.list
 * @param {Object} state - vuex state
 * @param {String} agrs[table] - 表名称
 * @param {Array<Row>} agrs[list] - 表名称
 */
const TABLE_ROWS_MERGE = function(state, [table, list]) {
    if (helper.isArray(list)) {
        for (const row of list) {
            state[table].list.push(row)
        }
    }
}

/**
 * 行数据更新（覆盖）
 */
// TODO 应该不同数据模型可以设置不同 primaryKey
const TABLE_ROW_EXTEND = function(state, [table, item] = []) {
    try {
        const {primaryKey} = Model
        if (item[primaryKey]) {
            for (let row of state[table].list) {
                if (row[primaryKey] && row[primaryKey] === item[primaryKey]) {
                    Object.assign(row, item)
                }
            }
            if (state[table].item) {
                let row = state[table].item
                if (row[primaryKey] && row[primaryKey] === item[primaryKey]) {
                    Object.assign(row, item)
                }
            }
        }
    } catch (error) {
        helper.consoleWarn(`dgx error`, error)
    }
}

/**
 * 行数据移除
 */
// TODO 应该不同数据模型可以设置不同 primaryKey
const TABLE_ROW_REMOVE = function(state, [table, id]) {
    const {primaryKey} = Model
    const index = id ? state[table].list.findIndex(item => item[primaryKey] === id) : undefined
    if (index >= 0) state[table].list.splice(index, 1)
}

export {
    FETCH_JOIN, FETCH_UPDATE, FETCH_REMOVE, FETCH_CHECK,
    TABLE_UPDATE, TABLE_RESET,
    TABLE_ROWS_JOIN, TABLE_ROWS_MERGE, TABLE_ROW_EXTEND, TABLE_ROW_REMOVE
}
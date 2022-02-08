import {Model} from './main.js'
import helper from '../helper'

const TableDescription = function(data) {
    for (const key in data) {
        this[key] = data[key]
    }
    return this
}

const TableController = function() {

}

/**
 * @param {Number} page - 列表页码，默认: 1
 * @param {String} path - 模型路径，不传则默认从 this.store 中获取
 * @param {Object} filter - 过滤器（筛选参数），不传则默认从 this.Filter 中获取
 * @param {Object} opt - 参数集，会传递到 FETCH 方法中，可见相关参数说明
 * @param {Boolean} opt.clean - 请求前是否先清空模型 list 数据
 * @param {any} opt[key] - 其他参数会保留并传递给其他中间件
 * @returns {Promise}
 */
TableController.prototype.get = function(page, path, filter, opt = {}) {
    if (typeof page === 'string' || typeof page === 'object') {
        filter = path
        path = page
        page = 1
    }
    const params = helper.originJSON((typeof filter === 'object' ? filter : this.Filter) || {})
    params.page = page ? page : 1
    if (typeof opt === 'object' && opt.clean) {
        const {model, table} = this.__modelFormat(path, 'get')
        this.__commit(`${model}${model ? '/' : ''}TABLE_RESET`, table)
    }
    return this.__dispatch(this.__modelFormat(path, 'get'), {...opt, params})
}


/**
 * 初始化数据
 * @overview 初始化列表，此方法初始化过一次后便不会重复拉取请求，一般用于拉取固定数据
 * @param {string} path - 模型路径，不传则默认从 this.store 中获取
 * @param {object} filter - 筛选参数，默认没有 page 参数，若有 page 的需求可以在此对象中传递
 * @param {object} opt - 参数集，会传递到 Fetch 方法中
 * @param {number} opt.cache - 缓存时间，秒为单位，超时后会强制重新来去
 * @param {boolean} opt.strict - 严格的，将会比对 filter 条件，如果不同将会触发重新来去
 * @param {boolean} opt.immediate - 立即执行，强制重新拉取
 * @param {boolean} opt.clean - 触发请求前清空源列表（若判断读取缓存，该参数无效）
 * @returns {Promise}
 */
TableController.prototype.getInit = function(path, filter = {}, opt = {}) {

    const {cache, strict, immediate, clean} = opt
    const info = this.__modelFormat(path, 'get')
    const instance = this.__getTableInstance(info.path)
    let needFetch = !instance.init || Boolean(immediate)
    if (typeof filter !== 'object') filter = {}
    const fetchHandle = () => {
        if (clean) this.__commit(`${info.model}${info.model ? '/' : ''}TABLE_RESET`, info.table) // 清理模型
        return this.__dispatch(info.action_path_full, {...opt, params: filter}).then(res => {
            if (!res.err) {
                const update = this.Time ? this.Time(new Date(), 'yyyy/MM/dd hh:mm:ss') : new Date() // TODO Time 方法替换
                this.__commit(`${info.model}${info.model ? '/' : ''}TABLE_UPDATE`, [info.table, 'update', update]) // 把本次请求的时间戳记录起来，便以判断是否缓存超时
                return {...res, filter, fetch: true}
            }
            return {...res, result: [], filter, fetch: true}
        })
    }
    if (instance.list.length === 0) {
        needFetch = true // 如果列表为空表示则缓存无效
    } else if (typeof cache === 'number' && instance.update && !needFetch) {
    // 判断是否缓存超时需要重新拉取
        const update = new Date(instance.update).getTime()
        const expire = update + cache * 1000
        needFetch = Date.now() > expire // 如果 当前时间 > 到期时间 需要重新加载
    } else if (strict) {
    // 如果是严格的，需要坚持筛选条件
        try {
            needFetch = JSON.stringify(instance.filter) !== JSON.stringify(filter)
        } catch (err) {
        // eslint-disable-next-line no-console
            helper.consoleWarn('[@dgteam/model] GetInit: filter is invalid.')
        }
    }
    return needFetch ? fetchHandle() : Promise.resolve({err: 0, msg: '', result: instance.list, filter: instance.filter, fetch: false})
}


/**
 * 重新加载列表数据
 */
TableController.prototype.getFilter = function(path, filter, {clean = true, loading = false} = {}) {
    return this.get(1, path, filter, {clean, loading})
}


/**
 * 加载单行数据
 * @overview 通过主键拉取单行数据，如果拉取成功会联动触发 this.Active(item) 方法
 * @param {number} primaryKey - 数据主键值
 * @param {string} path - 模型路径，不传则默认从 this.store 中获取
 * @param {object} params - 筛选参数
 * @param {object} opt - 参数集，会传递到 Fetch 方法中
 * @returns {Promise}
 */
TableController.prototype.getItem = function(primaryKey, path, params = {}, opt = {}) {
    if (typeof primaryKey === 'object') {
        primaryKey = primaryKey[Model.primaryKey]
    }
    return this.__dispatch(this.__modelFormat(path, 'get'), {...opt, [Model.primaryKey]: primaryKey, params})
}


/**
 * 加载更多数据
 * @overview 一般用在移动端的 "触底加载" 的效果，拉取的数据会连接上一页的列表
 * @param {string} path - 模型路径，不传则默认从 this.store 中获取
 * @param {object} filter - 过滤器（筛选参数），不传则默认从 this.Filter 中获取
 * @param {object} opt - 参数集，会传递到 Fetch 方法中
 * @returns {Promise}
 */
TableController.prototype.getMore = function(path, filter, opt) {
    const info = this.__modelFormat(path, 'more')
    const instance = this.__getTableInstance(info.path)
    if (instance) {
        const {init, loading, more, empty} = instance
        if (init && !loading && more && !empty) {
            const params = helper.originJSON(typeof filter === 'object' ? filter : this.Filter) || {}
            return this.__dispatch(info.action_path_full, {...opt, params})
        }
    }
    return Promise.resolve(null)
}


/**
 * 模型动作
 * @param {string} name - 动作名称，会自动转换为大写字母
 * @param {string} path - 模型路径，不传则默认从 this.store 中获取
 * @param {object} opt - 参数集，会传递到 Fetch 方法中
 * @returns {Promise}
 */
TableController.prototype.action = function(name = 'POST', path, opt = {}) {
    return this.__dispatch(this.__modelFormat(path, name), opt)
}


/**
 * 设为焦点
 * @param {object} item - 被设为焦点的实例
 * @param {string} path - 模型路径，不传则默认从 this.store 中获取
 * @returns {Promise}
 */
TableController.prototype.activeRow = function(item, path) {
    return this.__dispatch(this.__modelFormat(path, 'active'), item)
}


/**
 * 模型更新
 * @param {object} item - 模型 row 实例，必须要包含主键
 * @param {function} path - 模型路径，不传则默认从 this.store 中获取
 */
TableController.prototype.updateRow = function(item = {}, path) {
    const {model, table} = this.__modelFormat(path, 'get')
    return this.__commit(`${model}${model ? '/' : ''}TABLE_ROW_EXTEND`, [table, item])
}

/**
 * 提交数据行
 * 0.4+ 版本开始取消 callback 参数，需要自行实现
 * @param {object} data - 提交数据，不传则默认从 this.Params 中获取
 * @param {string} path - 模型路径，不传则默认从 this.store 中获取
 * @param {object} opt - 附加参数
 * @returns {Promise}
 */
TableController.prototype.post = function(data, path, opt = {}) {
    if (data === undefined || data === null || typeof data.preventDefault === 'function') data = helper.originJSON(this.Params || {})
    return this.__dispatch(this.__modelFormat(path, 'post'), {...opt, data})
}


/**
 * 修改数据行
 * 0.4+ 版本开始取消 callback 参数，需要自行实现
 * @param {object} data - 提交数据，不传则默认从 this.Params 中获取
 * @param {string} path - 模型路径，不传则默认从 this.store 中获取
 * @param {object} opt - 附加参数
 * @returns {Promise}
 */
TableController.prototype.put = function(data, path, opt = {}) {
    if (data === undefined || data === null || typeof data.preventDefault === 'function') data = helper.originJSON(this.Params || {})
    return this.__dispatch(this.__modelFormat(path, 'put'), {...opt, [Model.primaryKey]: data[Model.primaryKey], data})
}


/**
 * 提交表单
 * 自动从 this.Params 拉取数据，根据是否有主键判断是新增还是修改
 * @param {object} data - 提交数据，不传则默认从 this.Params 中获取
 * @param {string} path - 模型路径，不传则默认从 this.store 中获取
 * @param {object} opt - 参数集
 * @param {object} opt.callback - 回调函数
 * @returns {Promise}
 */
TableController.prototype.submit = function(data, path, opt) {
    if (data === undefined || data === null || typeof data.preventDefault === 'function') data = helper.originJSON(this.Params || {})
    return data[Model.primaryKey] ?
        this.put(data, path, opt) :
        this.post(data, path, opt)
}


/**
 * 删除数据行
 * 0.4+ 版本开始取消 callback、confirm 参数，需要自行实现
 * @param {object} data - 提交数据，不传则默认从 this.Params 中获取
 * @param {string} path - 模型路径，不传则默认从 this.store 中获取
 * @param {object} opt - 参数集
 * @returns {Promise}
 */
TableController.prototype.delete = function(data, path, opt) {
    if (data === undefined || data === null || typeof data.preventDefault === 'function') data = helper.originJSON(this.Params || {})
    if (~['string', 'number'].indexOf(typeof data)) data = {[Model.primaryKey]: data}
    return this.__dispatch(this.__modelFormat(path, 'delete'), {...opt, [Model.primaryKey]: data[Model.primaryKey], data})
}


/**
 * 模型清理（重置）
 * @param {function} path - 模型路径，不传则默认从 this.store 中获取
 */
TableController.prototype.resetTable = function(path) {
    const {model, table} = this.__modelFormat(path, 'get')
    return this.__commit(`${model}${model ? '/' : ''}TABLE_RESET`, table)
}

// ==================================== 内部方法 ====================================

/**
 * 执行 vuex 动作
 * @overview this.$store.dispatch 的语法糖，会自动格式化 paths
 * @param {string} [path] - 模型路径
 * @param {object} [data] - 提交数据
 * @returns {Promise}
 */
TableController.prototype.__dispatch = function(path, data) {
    return Model.store.dispatch(this.__modelFormat(path).action_path_full, data)
}

/**
 * 执行 vuex 突变
 * @overview this.$store.commit 的语法糖，会自动格式化 paths
 * @param {string} [path] - 模型路径
 * @param {object} [data] - 提交数据
 */
TableController.prototype.__commit = function(path, data) {
    return Model.store.commit(this.__modelFormat(path).action_path_full, data)
}

/**
 * 格式化模型
 * @overview 框架内方法，业务层无需使用
 * @param {string} [path] - 模型路径
 * @param {string} [action] - 执行动作
 */
TableController.prototype.__modelFormat = function(paths, action = '') {

    if (!paths) {
        if (this.__path__) {
            paths = this.__path__ // 仅在 TableProxy 中有效
        } else {
            try {
                paths = this.__getTableInfo().path_origin
            } catch (err) {
                throw new Error('model error', err)
            }
        }
    } else if (helper.instance(paths, TableDescription)) {
        return paths // 重复调用，直接返回
    }

    // TODO 如果是已经拼接好的 path 那么取消重新拼接
    if (!paths) throw new Error(`[@dgteam/model] model path invalid.`)
    if (typeof paths === 'string') paths = paths.split('/')
    // if (!action && model.toUpperCase() === model) {
    //     action_path = model
    //     model = null
    // }
    const path = paths.join('/')
    const _paths = Array.from(paths)
    let table = _paths.pop() // 表明为路径的最后一个
    const model = _paths.join('/') // 剩余的微模型名称
    let action_path = ''
    if (!action && table.toUpperCase() === table) {
        action_path = table // 如果没有传递 action 参数，且最后一个单词是全大写，那么可以判断是 model 级别的方法，没有 table
        table = ''
    } else if (action) {
        action_path = `${action.toUpperCase()}_${table.toUpperCase()}`
    }
    action ?  `${action.toUpperCase()}_${table.toUpperCase()}` : ''
    const action_path_full = model ? `${model}/${action_path}` : action_path

    // 如果 vuex 没有此模型，尝试兼容路径
    // ...

    return new TableDescription({model, table, action, action_path, action_path_full, path, paths})
}

TableController.prototype.__getTableInstance = function(paths, models = this.$models) {
    const deepInspect = (tunnel, paths) => {
        if (paths) {
            if (typeof paths === 'string') paths = paths.split('/')
            if (paths.length > 0) {
                const path = paths.shift()
                if (typeof path === 'string' && tunnel[path]) {
                    if (paths.length === 0)  return tunnel[path] // 查询成功，返回实例
                    return deepInspect(tunnel[path], paths)
                }
            }
        }
        return null
    }
    return deepInspect(models, paths)
}

TableController.prototype.__getTableInfo = function() {
    let opt = this.$options && this.$options.model || this.store // 仅在 vue component 实例下有效
    if (opt) {
        if (typeof opt === 'string') {
            opt = {path: opt}
        }
        if (typeof opt === 'object') {
            // const inspect = this.__getTableInstance(opt.path)
            let {path: path_origin, as} = opt
            const {model, table, path} = this.__modelFormat(path_origin)
            return {model, table, path, path_origin, as}
        }
    }
    return null
}

export default TableController
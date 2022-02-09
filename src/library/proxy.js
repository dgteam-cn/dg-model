
import TableController from './controller'
const TableProxy = function(table, path) {

    TableController.call(this) // super

    for (const key in table) {
        this[key] = table[key]
    }

    Object.defineProperties(this, {__path__: {value: path,  enumerable: !!process.server, configurable: true, writable: true}})  // enumerable 为了兼容 nuxt2 的 server 模式
    const defineProperty = (name, value) => Object.defineProperty(this, name, {value})

    defineProperty('get', (page, filter, opt) =>           Object.getPrototypeOf(this).get.call(this, page, path, Object.assign({}, this.filter, filter), opt)) // 试验性: 默认继承当前实例的 filter
    defineProperty('getInit', (filter, opt) =>             Object.getPrototypeOf(this).getInit.call(this, this.__path__, filter, opt))
    defineProperty('getFilter', (filter, opt) =>           Object.getPrototypeOf(this).getFilter.call(this, this.__path__, filter, opt))
    defineProperty('getItem', (primaryKey, filter, opt) => Object.getPrototypeOf(this).getItem.call(this, primaryKey, this.__path__, filter, opt))
    defineProperty('getMore', (filter, opt) =>             Object.getPrototypeOf(this).getMore.call(this, this.__path__, Object.assign({}, this.filter, filter), opt)) // 试验性: 默认继承当前实例的 filter
    defineProperty('activeRow', (item) =>                  Object.getPrototypeOf(this).use.call(this, item, this.__path__))
    defineProperty('updateRow', (item) =>                  Object.getPrototypeOf(this).updateRow.call(this, item, this.__path__))
    defineProperty('action', (name, opt) =>                Object.getPrototypeOf(this).action.call(this, name, this.__path__, opt))
    defineProperty('post', (item, opt) =>                  Object.getPrototypeOf(this).post.call(this, item, this.__path__, opt))
    defineProperty('put', (item, opt) =>                   Object.getPrototypeOf(this).put.call(this, item, this.__path__, opt))
    defineProperty('submit', (item, opt) =>                Object.getPrototypeOf(this).submit.call(this, item, this.__path__, opt))
    defineProperty('del', (item, opt) =>                Object.getPrototypeOf(this).delete.call(this, item, this.__path__, opt))
    defineProperty('destroy', (item, opt) =>                Object.getPrototypeOf(this).delete.call(this, item, this.__path__, opt))
    defineProperty('resetTable', () =>                     Object.getPrototypeOf(this).resetTable.call(this, this.__path__))

    return this
}

// 继承父类
TableProxy.prototype = new TableController()
TableProxy.prototype.constructor = TableProxy

export default TableProxy
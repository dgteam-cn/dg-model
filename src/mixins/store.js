import {Model} from '../library/main'
import TableController from '../library/controller'
import helper from '../helper'

const ctrl = new TableController()

export default {
    data() {
        return {
            Filter: {}, // 组件过滤暂存器, 影响某些方法的默认获取参数
            Params: {}, // 组件表单暂存器, 影响某些方法的默认获取参数
            Editer: {view: false, title: null, form: null} // 单行数据编辑器信息，般用于 PC 端管理后台，移动端无需使用
        }
    },
    computed: {
        /**
         * 默认数据模型
         * @overview 根据当前组件 this.store 值自动映射相关模型实例
         */
        Main() {
            const info = this.__getTableInfo()
            return this.__getTableInstance(info && info.path_origin) // path_origin
        }
    },
    methods: {

        Get: ctrl.get,
        GetInit: ctrl.getInit,
        GetFilter: function(path, filter, opt) {
            return this.Get(1, path, filter, opt)
        },
        GetItem: ctrl.getItem,
        GetMore: ctrl.getMore,
        Action: ctrl.action,
        Active: ctrl.activeRow,
        ActiveRow: ctrl.activeRow, // 语法糖
        UpdateRow: ctrl.updateRow,
        Post: ctrl.post,
        Put: ctrl.put,
        Submit: function(data, path, opt) {
            if (data === undefined || data === null || typeof data.preventDefault === 'function') data = helper.originJSON(this.Params || {})
            return data[Model.primaryKey] ?
                this.Put(data, path, opt) :
                this.Post(data, path, opt)
        },
        Del: ctrl.delete,   // 语法糖
        Delete: ctrl.delete,
        ResetTable: ctrl.resetTable,

        __dispatch: ctrl.__dispatch,
        __commit: ctrl.__commit,
        __modelFormat: ctrl.__modelFormat,
        __getTableInstance: ctrl.__getTableInstance,
        __getTableInfo: ctrl.__getTableInfo,

        Dp: (path, data) => ctrl.__dispatch(path, data),
        Cm: (path, data) => ctrl.__commit(path, data),

        /**
         * 编辑弹窗控制器
         * @overview 自动从 this.Params 拉取数据，根据是否有主键判断是新增还是修改
         * @param {object} item - 编辑的对象，传 NULL 表示新增对象
         * @param {string} title - 弹窗的标题
         * @param {string} model - 控制器所对应的键值
         * @returns {Promise}
         */
        Edit(item, title, model='Editer') {
            this.Active(item)
            if (this[model]) {
                this[model].view  = true
                this[model].title = title ? title : item ? '修改数据' : '新增数据'
                this[model].form  = item ? helper.originJSON(item) : null
            }
        }
    }
}

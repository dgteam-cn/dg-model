
import Model from '@/dist/index'
import ajax from '~/plugins/ajax.js'

Model.install({
    fetch: {
        ajax, handle: 'ajax'
    },
    RESTful: {
        GET: {
            interact: true // 数据联动
        },
        POST: {
            interact: false
        },
        PUT: {
            interact: true
        },
        DELETE: {
            interact: true
        }
    }
})
export default Model

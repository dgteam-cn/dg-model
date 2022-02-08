
import axios from 'axios'

let CancelToken = axios.CancelToken

const ajax = axios.create({
    baseURL: '',
    auth: false,
    timeout: 15000
})
const errToast = (...msg) => console.warn('[plugins/ajax.js]', ...msg)

// 添加请求拦截器
ajax.interceptors.request.use(config => {
    if (!config.data) {
        config.data = {}
    }
    if (!config.headers['content-type']) {
        config.headers['content-type'] = 'application/json; charset=utf-8'
    }
    return config
}, error => {
    errToast('请求拦截器：请求错误', error)
    return Promise.reject(error)
})

// 添加响应拦截器
ajax.interceptors.response.use(res => {
    if (res) {
        let {config, status, data} = res
        if (data.err === undefined) {
            if (`${status}`[0] == '4' || `${status}`[0] == '5') {
                try {
                    data = {err: status, msg: JSON.stringify(data), result: null}
                } catch {
                    data = {err: status, msg: 'service error.', result: null}
                }
            }
        }
        const {err, msg} = data
        if (err) {
            errToast( 'content-type throw error.', msg)
        } else {
            return Promise.resolve(res)
        }
    }
    console.warn('@plugins/ajax.js', '响应拦截器：服务端错误', res )
    return Promise.reject(res)
}, error => {
    console.warn('@plugins/ajax.js', '响应拦截器：本地网络错误，或服务器无响应', error)
    let config = {}
    try {
        config = error.config
    } catch (e) {}
    return Promise.reject({
        config,
        data: {
            err: 500,
            result: null,
            msg: `${error.name ? error.name + ':' : ''}${error.message}`
        }
    })
})

let count = 0
export default function(config={}) {

    // 计数器
    count ++
    // 取消令牌
    let cancel = null
    let cancelToken = new CancelToken(fun => {
        cancel = fun
        if (config.getCancel) {
            config.getCancel(count, cancel)
        }
    })
    // 返回封装后的 ajax 对象
    return ajax({
        validateStatus: status => {
            return status >= 200 && status < 600
        },
        requestId: count,
        cancelToken, cancel,
        ...config
    })
}
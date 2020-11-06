import Vue from 'vue'

// Fetch 数据移除
const FETCH_REMOVE = function(state, [model, index]=[]) {
    state[model].ajax.splice(index, 1)
}

// Fetch 取消请求
const FETCH_CANCEL = function(state, [model, only, id]) {
    let opt = Object.assign({model: undefined, only: undefined, id: undefined}, {model, only, id})
    let models = opt.model ? opt.model : state.models
    if (typeof models != 'object') {
        models = [models]
    }
    finish:
    for (let m of models) {
        for (let i=0; i<state[m].ajax.length; i++) {                
            // 当存在 only 条件时且不满足 only 条件时候进行 break 操作
            if (opt.only !== undefined && opt.only != state[m].ajax[i].only) {
                break
            }
            // 当存在 id 条件时且不满足 id 条件时候进行 break 操作
            if (opt.id !== undefined && opt.id != state[m].ajax[i].id) {
                break
            }
            // 剩余为满足取消条件
            try {
                state[m].ajax[i].cancel()
            } catch (err) {
                console.log('DGX FETCH_CANCEL, 需要给请求配置取消函数')
            }
            state[m].ajax.splice(i, 1)
            break finish
        }
    }
}

// Fetch 数据更新
const FETCH_UPDATE = function(state, [model]=[]) {
    let loading = 0
    let editing = 0
    for (let fetch of state[model].ajax) {
        if (fetch.method) {
            let method = fetch.method.toUpperCase()
            if (method === 'GET') {
                loading += 1
            } else if (~['POST','PUT','DELETE'].indexOf(method)) {
                editing += 1
            }
        }
    }
    Vue.set(state[model], 'loading', loading)
    Vue.set(state[model], 'editing', editing)
}

/**
 * @name 模型添加
 * @param {*} state 
 * @param {*} param1 
 */
const MODEL_ADD = function(state, [model, key='ajax', value, position=-1 ]=[]){
    if(typeof position === 'string'){
        if(~['start', 'begin', 'head'].indexOf(position)){
            position = 0
        } else if (~['end', 'finish', 'foot', 'last'].indexOf(position)){
            position = -1
        } else {
            position = parseInt(position)
        }
    }
    if(position === 0){
        state[model][key].unshift(value)
    }else if(position === -1){
        state[model][key].push(value)
    } else if(Number.isInteger(position)){
        state[model][key].splice(position, 0, value)
    }
}
const MODEL_MORE = function(state, [model, key='list', value]){
    if(Array.isArray(value)){
        for(let item of value){
            state[model][key].push(item)
        }
    }
}
const MODEL_REMOVE = function(state, {base, key, id, index}){
    if (id) {
        let list = state[base][key]
        for(let i=0; i < list.length; i++){
            if(list[i].id == id){
                state[base][key].splice(i, 1)
                break;
            }
        }
    } else if (index || index == 0) {
        state[base][key].splice(index, 1)
    } else {
        delete state[base][key]
    }
}
const MODEL_RESET = function(state, model){
    if(model && state[model] && state[model].reset){
        let reset = Object.assign({}, state[model].reset)
        state[model] = Object.assign({}, reset)
        state[model].reset = Object.assign({}, reset)
    }
}
const MODEL_UPDATE = function(state, [model, key='list', value]=[]){
    if(typeof key === 'object'){
        for(let k in key){
            Vue.set(state[model], k, key[k])
        }
    } else {
        Vue.set(state[model], key, value)
    }
}
const MODEL_ROW_EXTEND = function(state, [model, item, relation] = []){
　  try {
        if(item.id){
            for(let row of state[model].list){
                if(row.id && row.id === item.id){
                    Object.assign(row, item)
                }
            }
            if(state[model].item){
                let row = state[model].item
                if(row.id && row.id === item.id){
                    Object.assign(row, item)
                }
            }
        }
　　} catch(error) {
        console.info(`dgx error`,error)
　　}		
}

export {
    FETCH_REMOVE, FETCH_CANCEL, FETCH_UPDATE,
    MODEL_ADD, MODEL_MORE, MODEL_UPDATE, MODEL_ROW_EXTEND, MODEL_REMOVE, MODEL_RESET
}
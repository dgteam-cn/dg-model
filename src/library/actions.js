const FETCH = function({state, dispatch, commit}, config={}) {

    let model = config.model || 'common'
    let base = model
    let { method, silent, only, middleware } = config

    // 检测是否重复，如果重复则取消之前相同的方法
    // if(only){
    //     commit('FETCH_CANCEL',[model, only ]) //console.warn('dgx 请求重复，自动取消前一个请求。',config)
    // }

    if(!config.headers){
        config.headers = {}
    }
    if(state[model] && state[model].auth){
        config.headers['Identity'] = state[model].auth
        if(!config.auth){
            config.auth = state[model].auth
        }
    }
    if(config.auth){
        config.headers['Identity'] = config.auth
    }
    delete config.auth
    // 返回 Fetch 方法
    return new Promise(resolve => {
        const callback = {
            // 成功回调
            success: res => {
                commit('MODEL_UPDATE', [model, 'init', true])
                commit('MODEL_UPDATE', [model, 'error', false])
                dispatch('FETCH_FINISH', [model, res.config.id])
                if(config.responseType === "arraybuffer"){
                    resolve({data: res.data, config: res.config})
                }else{
                    resolve({...res.data, config: res.config})
                }                        
            },
            // 失败回调
            error: res => {
                if(res && res.config && res.config.id){
                    dispatch('FETCH_FINISH', [model, res.config.id])
                }
                commit('MODEL_UPDATE', [model, 'error', true])
                resolve({...res.data, config: res.config ? res.config : {}})
            }
        }
        const getCancel = (id, cancel) => {
            commit('MODEL_ADD', [model, 'ajax', {id, model, only, method, cancel, silent}])
            commit('FETCH_UPDATE', [model])
        }

        if(this.fetch.socket && this.fetch.socket.status === 'online' && this.fetch.handle === 'auto' && config.use != 'ajax'){
            config.use = 'socket'
            return this.fetch.socket.proxy({ getCancel, ...config }).then( callback.success, callback.error )
        }else{
            config.use = 'ajax'
            return this.fetch.ajax({ getCancel, ...config }).then( callback.success, callback.error )
        }
    })
}

// Fetch 结束请求
const FETCH_FINISH = function({ state, dispatch, commit },[model,id]=[]) {
    for(let i=0; i<state[model].ajax.length; i++){
        if(state[model].ajax[i].id === id){
            commit('MODEL_REMOVE',{ base: model, key: 'ajax', index: i })
            return commit('FETCH_UPDATE',[model])
        }
    }
}

export {
    FETCH, FETCH_FINISH
}
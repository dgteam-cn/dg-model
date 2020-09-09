import Helper from '@dgteam/helper'

const ACTIVE = function(model){

    const MODEL = model.toUpperCase()

    const ACTIVE_MODEL = `ACTIVE_${MODEL}`
    const ACTIVE_MODEL_CHANGE = `ACTIVE_${MODEL}_CHANGE`
    const ACTIVE_MODEL_RESET = `ACTIVE_${MODEL}_RESET`

    const apis = {
        [ACTIVE_MODEL]({state, dispatch}, active) {
            if(Helper.IsArray(active) && active[0]){
                active = active[0]
            }
            if(active===undefined || active===null){
                // 重置
                dispatch(ACTIVE_MODEL_RESET)
            }else if(typeof active==="object"){
                // 以 对象条件 来确定焦点
                //let id = active.id
                const list = state[model].list
                for(let o in active){
                    for(let i=0; i<list.length; i++){
                        if(list[i][o] && list[i][o] == active[o]){
                            return dispatch(ACTIVE_MODEL_CHANGE,{ id: list[i].id || undefined, active: i, item:list[i] })
                        }
                    }
                }
            } else {
                // 以索引来确定焦点，（ -1 = 选择数组的最后一个）
                if(active==-1){
                    active = state[model].list.length > 0 ? state[model].list.length - 1 : 0
                }
                // 如果焦点不存在则默认使用原焦点，如果原焦点不存在则默认使用 0
                let queue = [active, state[model].active, 0]
                for(let i=0;i<queue.length;i++){
                    if(state[model].list[queue[i]]){
                        active = queue[i]
                        break
                    }
                }
                // 如果列表存在键值
                if( state[model].list && state[model].list[active]){
                    return dispatch(`ACTIVE_${MODEL}_CHANGE`,{ id: state[model].list[active].id, active, item: state[model].list[active] })
                }
                dispatch(`ACTIVE_${MODEL}_RESET`)
            }
        },

        [ACTIVE_MODEL_CHANGE]({state, dispatch, commit}, config={}){
            for(let key of ['id', 'active', 'item']){
                if(config[key] || config[key]==0){     
                    commit('MODEL_UPDATE', [model, key, config[key]])      
                }
            }
            return config.item
        },

        [ACTIVE_MODEL_RESET]({state, dispatch, commit}, config={}){
            for(let key of ['id', 'active', 'item']){
                commit('MODEL_UPDATE', [model, key, undefined])
            }
        }
    }
    return apis
}

const RESTFUL = function(model, { state, fetch }){

    const MODEL = model.toUpperCase()
    const opt = state[model].options
    const apis = {}

    for(let action of [
        { name: 'GET', method: 'GET' },
        { name: 'MORE', method: 'GET' },
        { name: 'POST', method: 'POST' },
        { name: 'PUT', method: 'PUT' },
        { name: 'DELETE', method: 'DELETE' },
    ]){
        let { name, method } = action
        let path = `${name}_${MODEL}`
        apis[path] = ({ state, dispatch, commit }, data={}) => {

            // 自动填充路由参数，例如 /user/:id 等，默认从 paths 中获取，若获取不到则尝试从 params 中获取
            let paths = []
            for(let route of opt.url.split('/')){
                if(route[0] === ':'){
                    let key = route.substr(1)
                    if(data.paths && data.paths[key] != undefined){
                        paths.push(data.paths[key])
                        delete data.paths[key]
                    }else if(data.params && data.params[key] != undefined){
                        paths.push(data.params[key])
                        delete data.params[key]
                    }else{
                        console.warn('[dgx] lose paths ' + key)
                    }
                }else{
                    paths.push(route)
                }
            }

            let fetchData = {
                method,
                url: data.id ? `${paths.join('/')}/${data.id}` : paths.join('/'),
                data: data.data || {},
                params: data.params,
                model,
                only: data.only !== undefined ? data.only : ( method === 'GET'),
                silent: Boolean(data.silent),
                loading: data.loading
            }
            if(name === 'MORE'){
                fetchData.params.page = state[model].page + 1
            }
            const fetchHandle = res => {
                if(res && res.result){
                    switch(method){
                        case 'GET':
                            if(data.id){
                                commit('MODEL_UPDATE', [model, 'item', res.result.id])
                                commit('MODEL_UPDATE', [model, 'id', res.result.id])
                            }else if(Array.isArray(res.result)){
                                // 列表数据
                                if(name === 'MORE'){
                                    commit('MODEL_MORE', [model, 'list', res.result])
                                }else{
                                    commit('MODEL_UPDATE', [model, 'list', res.result])
                                }
                                commit('MODEL_UPDATE', [model, 'page', res.page])
                                commit('MODEL_UPDATE', [model, 'count', res.count != undefined && res.count >= 0 ? res.count : undefined])
                                commit('MODEL_UPDATE', [model, 'total', res.total])
                                commit('MODEL_UPDATE', [model, 'empty', res.page == 1 && !res.result.length ? true : false])
                                commit('MODEL_UPDATE', [model, 'more', res.page < res.total])
                            }else{
                                // 特殊数据
                                commit('MODEL_UPDATE',[model, 'list', res.result || res ])
                                commit('MODEL_UPDATE',[model, 'item', res.result || res ])
                            }
                            break;
                        case 'POST':
                            if(state[model].count != undefined && state[model].count >= 0){
                                commit('MODEL_UPDATE' ,[model, 'count', state[model].count + 1]) // 影响统计数
                            }
                            break;
                        case 'PUT':
                            commit('MODEL_ROW_EXTEND', [model, res.result])
                            break;
                        case 'DELETE':
                            commit('MODEL_REMOVE', {base: model, id: data.id,  key: 'list'})
                            if(state[model].item && state[model].item.id === data.id){
                                commit('MODEL_UPDATE', [model, 'id', null])
                                commit('MODEL_UPDATE', [model, 'active', null])
                                commit('MODEL_UPDATE', [model, 'item', null])
                            }
                            if(state[model].count != undefined && state[model].count > 0){
                                commit('MODEL_UPDATE', [model, 'count', state[model].count - 1 ]) // 影响统计数
                            }
                            break;
                        default:
                            break;
                    }
                }
                if(data.active || data.active == 0){
                    dispatch(`ACTIVE_${MODEL}`,data.active)
                }
                return res
            }
            
            let beforeRestful = opt.beforeRestful || fetch.beforeRestful
            return dispatch('FETCH', fetchData).then(async res => {
                if(beforeRestful){
                    let beforeRes = await beforeRestful(res)
                    if(beforeRes === undefined || beforeRes === true){
                        return fetchHandle(res)
                    } else if(beforeRes){
                        return fetchHandle(beforeRes)
                    }
                } else {
                    return fetchHandle(res)
                }
            }, err => {
                return err
            })
        }
    }
    return apis
}
export {
    ACTIVE, RESTFUL
}
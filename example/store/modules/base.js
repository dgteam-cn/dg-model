import Vue from 'vue'
import Model from '~/plugins/store.js'

export default new Model({
    store: 'base',
    state: {
        block: {
            user: {}, // 用户基础信息
            config: {
                // 可以让部分公共数据模型不会因切换账号而被清除
                // 隐私 block , 退出时将会被清空
                privateBlcoks: ['user']
            }
        }
    },
    actions: {
        
    },
    mutations: {
        UPDATE_BLOCK(state, data = []) {
            if (data[0]) {
                const name = data[0]
                if (!state.block[name]) {
                    Vue.set(state.block, name, {})
                }
                if (!data[1]) {
                    Vue.set(state.block, name, {})
                } else if (typeof data[1] === 'string') {
                    Vue.set(state.block[name], data[1], data[2])
                } else if (typeof data[1] === 'object') {
                    for (const key in data[1]) {
                        Vue.set(state.block[name], key, data[1][key])
                    }
                }
            }
        },
        CLEAN_BLOCK(state) {
            for (const key of state.block.config.privateBlcoks) {
                Vue.set(state.block, key, {})
            }
        },
        UPDATE(state, {key, val}) {
            Vue.set(state, key, val)
        }
    }
})
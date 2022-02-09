import {Model} from '@dgteam/model'
const options = new Model({
    tables: {
        user: {
            url: '/user',
            POST: {
                interact: true
            }
        }
    },
    state: {
        testState: true,
        testMutations: false
    },
    actions: {
        TEST_ACTION({commit}) {
            commit('TEST_MUTATIONS')
        }
    },
    mutations: {
        TEST_MUTATIONS(state) {
            state.testMutations = true
        }
    },
    modules: {
        systeam: new Model({
            state: {
                country: {
                    title: '地区',
                    options: {
                        url: '/user'
                    }
                }
            }
        })
    }
})

// Vue 2
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const Store = new Vuex.Store(options)
Vue.prototype.$store = Store
export default Store

// Nuxt 2

// Vue 3
// import { createStore } from 'vuex'
// export default createStore(options)

// Nuext 3
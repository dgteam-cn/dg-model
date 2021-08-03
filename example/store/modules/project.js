import Vue from 'vue'
import Model from '~/plugins/store.js'

const DGX = new Model({
    store: 'project',
    state: {
        user: {
            title: '用户列表',
            options: {
                url: '/user',
                // POST: {interact: true}
            }
        }
    },
    actions: {
        CHECK_USER() {
            return new Promise(resolve => {
                resolve({err: 0, msg: 'suc', result: {check: true}}) 
            })
        }  
    },
    mutations: {
        CHANGE_USER() {
            
        }
    }
})
export default DGX
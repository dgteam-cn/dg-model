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
    mutations: {}
})
export default DGX
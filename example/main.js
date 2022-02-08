import Vue from 'vue'
import App from './App.vue'

import dgx from '../dist/index.js'
import store from './store'
import axios from './plugins/axios'
// console.log('./main.js', dgx)
Vue.use(dgx, {
    httpAdapter: axios
})

import router from './router'
Vue.config.productionTip = false

const app = new Vue({
    render: h => h(App),
    router
}).$mount('#app')
import Vue from 'vue'
import App from './App.vue'

import Store from './store/index'
Vue.prototype.$store = Store

import router from './router'
Vue.config.productionTip = false

new Vue({
    render: h => h(App),
    router
}).$mount('#app')

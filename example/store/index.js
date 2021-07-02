
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

// 载入模型
import base from '~/store/modules/base'
import project from '~/store/modules/project'

// 载入 mock 数据
import '~/mock/project'

export default new Vuex.Store({
    modules: {
    	base,
		project
    }
})
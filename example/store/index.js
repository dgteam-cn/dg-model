
// import Vue from 'vue'
// import Vuex from 'vuex'
// Vue.use(Vuex)

// // 载入模型
// import base from '~/store/modules/base'
// import project from '~/store/modules/project'

// // 载入 mock 数据
// import '~/mock/project'

// export default new Vuex.Store({
//     modules: {
//     	base,
// 		project
//     }
// })

import '~/mock/project'
import { Model } from '@/dist/index.js'

const options = new Model({
	tables: {
		// 
	},
	state: {
		user: {
			title: '客户',
			options: {
				auth: 'none',
				url: 'http://api.petpop.dgteam.cn/business/structure/species',
			}
		}
	},
	mutations: {},
	modules: {
		systeam: new Model({
			state: {
				country: {
					title: '地区',
					options: {
						auth: 'none',
						url: 'http://api.petpop.dgteam.cn/system/country',
					}
				}
			},
		})
	}
}, {
	auth: 'admin'
})

// Vue 2
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const Store = new Vuex.Store(options)
Vue.prototype.$store = Store
export default Store



// Vue 3
// import { createStore } from 'vuex'
// export default createStore(options)
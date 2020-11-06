
export default {
    data(){
        return {

            /**
             * @name 组件过滤暂存器
             * @description 影响某些方法的默认获取参数
             */
            Filter: {},

            /**
             * @name 组件表单暂存器
             * @description 影响某些方法的默认获取参数
             */
            Params: {},

            /**
             * @name 单行数据编辑器信息
             * @description 一般用于 PC 端管理后台，移动端无需使用
             */
            Editer: {view: false, title: null, form: null}
        }
    },
    computed: {
        
        /**
         * @name 默认数据模型
         * @description 根据当前组件 this.store 值自动映射相关模型实例
         */
        Main: vm => vm.StoreInfo ? vm.StoreInfo.main : {},

        /**
         * @name 默认数据模型信息
         * @description 框架内方法，业务层无需使用
         */
        StoreInfo() {
            let opt = this.store
            if (opt) {
                if (typeof opt === 'string') {
                    opt = {path: opt}
                }
                if (typeof opt === 'object') {
                    let {path: path_origin, url, as, auth} = opt
                    let {store, model, path, main} = this.ModelFormat(path_origin)
                    if (this.$store._modulesNamespaceMap[`${store}/`]) {
                        if (as) {
                            if (!url) {
                                url = path_origin
                            }
                        }
                        return {main, path, paths: path.split('/'), path_origin, store, model, auth}
                    } else {
                        
                    }
                }
            }
            return null
        }
    },
    methods: {
        
        /**
         * @name 加载数据
         * @description 按页码加载数据
         * @param {number} [page] - 列表页码，默认加载第一页
         * @param {string} [paths] - 模型路径，不传则默认从 this.store 中获取
         * @param {object} [filter] - 过滤器（筛选参数），不传则默认从 this.Filter 中获取
         * @param {object} [opt] - 参数集，会传递到 Fetch 方法中
         * @param {object} [opt.clean] - 触发请求前清空源列表
         * @returns {Promise}
         */
        Get(page, paths, filter, opt={}) {
            if (typeof page === 'string') {
                filter = paths
                paths = page
                page = null
            }
            const params = this.Origin(typeof filter === 'object' ? filter : this.Filter) || {}
            params.page = page ? page : 1
            if (typeof opt === 'object' && opt.clean) {
                const {store, model} = this.ModelFormat(paths, 'get')
                this.Cm(`${store}/MODEL_RESET`, model)
            }
            return this.Dp(this.ModelFormat(paths, 'get'), {...opt, params})
        },

        /**
         * @name 初始化数据
         * @description 初始化列表，此方法初始化过一次后便不会重复拉取请求，一般用于拉取固定数据
         * @param {string} [paths] - 模型路径，不传则默认从 this.store 中获取
         * @param {object} [filter] - 筛选参数，默认没有 page 参数，若有 page 的需求可以在此对象中传递
         * @param {object} [opt] - 参数集，会传递到 Fetch 方法中
         * @param {number} [opt.cache] - 缓存时间，秒为单位，超时后会强制重新来去
         * @param {number} [opt.strict] - 严格的，将会比对 filter 条件，如果不同将会触发重新来去
         * @param {number} [opt.immediate] - 立即执行，强制重新拉取
         * @param {object} [opt.clean] - 触发请求前清空源列表（若判断读取缓存，该参数无效）
         * @returns {Promise}
         */
        GetInit(paths, filter={}, opt={}) {
            const {cache, strict, immediate, clean} = opt
            const model = this.ModelFormat(paths, 'get')
            let needFetch = !model.main.init || Boolean(immediate)
            if (typeof filter !== 'object') filter = {}
            const fetchHandle = () => {
                if (clean) {
                    this.Cm(`${model.store}/MODEL_RESET`, model.model)
                }
                return this.Dp(model, {...opt, params: filter}).then(res => {
                    if (!res.err) {
                        const update = this.Time(new Date(), 'yyyy/MM/dd hh:mm:ss')
                        this.Cm(`${model.store}/MODEL_UPDATE`, [model.model, 'update', update]) // 把本次请求的时间戳记录起来，便以判断是否缓存超时
                        return {...res, filter, fetch: true}
                    }
                    return {...res, result: [], filter, fetch: true}
                })
            }
			if (model.main.list.length === 0) {
				needFetch = true // 如果列表为空表示则缓存无效
			} else if (typeof cache === 'number' && model.main.update && !needFetch) {
				// 判断是否缓存超时需要重新拉取
				const update = (new Date(model.main.update)).getTime()
				const expire = update + cache * 1000
				needFetch = Date.now() > expire // 如果 当前时间 > 到期时间 需要重新加载
            } else if (strict) {
                // 如果是严格的，需要坚持筛选条件
                try {
                    needFetch = JSON.stringify(model.main.filter) !== JSON.stringify(filter)
                } catch (err) {
                    console.log('DGX GetInit: filter is invalid.')
                }
            }
			return needFetch ? fetchHandle() : Promise.resolve({err: 0, msg: '', result: model.main.list, filter: model.main.filter, fetch: false})
        },

        /**
         * @description MakeFilter 的语法糖
         */
        GetFilter(paths, filter, opt) {
            return this.MakeFilter(paths, filter, opt)
        },

        /**
         * @description LoadMore 的语法糖
         */
        GetMore(paths, filter, opt) {
            return this.LoadMore(paths, filter, opt)
        },

        /**
         * @name 加载单行数据
         * @description 通过主键拉取单行数据，如果拉取成功会联动触发 this.Active(item) 方法
         * @param {number} id - 数据主键值
         * @param {string} paths - 模型路径，不传则默认从 this.store 中获取
         * @param {Object} params - 筛选参数，默认没有 page 参数，若有 page 的需求可以在此对象中传递
         * @param {Object} opt - 参数集，会传递到 Fetch 方法中
         * @returns {Promise}
         */
        Item(id, paths, filter={}, opt={}) {
            return this.Dp(this.ModelFormat(paths, 'get'), {...opt, id, params: filter})
        },

        /**
         * @name 加载更多数据
         * @description 一般用在移动端的 "触底加载" 的效果，拉取的数据会连接上一页的列表
         * @param {string} paths - 模型路径，不传则默认从 this.store 中获取
         * @param {Object} filter - 过滤器（筛选参数），不传则默认从 this.Filter 中获取
         * @param {Object} opt - 参数集，会传递到 Fetch 方法中
         * @returns {Promise}
         */
        LoadMore(paths, filter, opt) {
            let model = this.ModelFormat(paths, 'more')
            let { init, loading, more, empty } = model.main
            if (init && !loading && more && !empty) {
                // if(loading){
                //     this.Loading()
                // }
                // let params = this.Origin( this.Filter ? this.Filter : {} )
                let params = this.Origin(typeof filter === 'object' ? filter : this.Filter) || {}
                return this.Dp(model, {params}).then(res=>{
                    // if(loading){
                    //     this.HideLoading()
                    // }
                    return res
                })
            } else {
                console.log(`无法加载更多 - init:${init} loading:${!loading} more:${more} empty:${!empty}`)
                return Promise.resolve(null)
            }
        },


        /**
         * @name 模型动作
         * @param {string} name - 动作名称，会自动转换为大写字母
         * @param {string} paths - 模型路径，不传则默认从 this.store 中获取
         * @param {Object} data - 参数集，会传递到 Fetch 方法中
         * @returns {Promise}
         */
        Action(name='POST', paths, data={}) {
            return this.Dp(this.ModelFormat(paths, name), data)
        },


        /**
         * @name 设为焦点
         * @param {Object} item - 被设为焦点的实例
         * @param {string} paths - 模型路径，不传则默认从 this.store 中获取
         * @returns {Promise}
         */
        Active(item, paths) {
            return this.Dp(this.ModelFormat(paths, 'active'), item)
        },

        /**
         * @name 提交数据行
         * @param {Object} data - 提交数据，不传则默认从 this.Params 中获取
         * @param {string} paths - 模型路径，不传则默认从 this.store 中获取
         * @param {function} callback - 回调函数
         * @returns {Promise}
         */
        Post(data=this.Origin(this.Params), paths, callback) {
            let opt = {}
            if (!callback) {
                callback = res => {
                    if (res && !res.err) {
                        if (typeof this.Suc === 'function') {
                            this.Suc('操作成功')
                        }
                        if (typeof this.view !== "undefined") {
                            this.view = false
                            this.$emit('finish', res ? res : 1)
                        }
                    }
                }
            } else if (typeof callback === 'object') {
                opt = callback
            }
            return this.Dp(this.ModelFormat(paths, 'post'), {...opt, data}).then(res => {
                if(typeof callback === 'function') callback(res)
                return res
            })
        },


        /**
         * @name 修改数据行
         * @param {Object} data - 提交数据，不传则默认从 this.Params 中获取
         * @param {string} paths - 模型路径，不传则默认从 this.store 中获取
         * @param {function} callback - 回调函数
         * @returns {Promise}
         */
        Put(data=this.Origin(this.Params), paths, callback) {
            let opt = {}
            if (!callback) {
                callback = res => {
                    if (res && !res.err) {
                        if (typeof this.Suc === 'function') {
                            this.Suc('操作成功')
                        }
                        if (typeof this.view !== "undefined") {
                            this.view = false
                            this.$emit('finish', res ? res : 1)
                        }
                    }
                }
            } else if (typeof callback === 'object') {
                opt = callback
            }
            return this.Dp(this.ModelFormat(paths, 'put'), {...opt, id: data.id, data}).then(res => {
                if(typeof callback === 'function') callback(res)
                return res
            })
        },


        /**
         * @name 删除数据行
         * @param {Object} data - 提交数据，不传则默认从 this.Params 中获取
         * @param {string} paths - 模型路径，不传则默认从 this.store 中获取
         * @param {function} callback - 回调函数
         * @returns {Promise}
         */
        Del(data=this.Origin(this.Params), paths, callback, {confirm=true}={}) {
            let opt = {}
            if (!callback) {
                callback = res => {
                    if (res && !res.err) {
                        if (typeof this.Suc === 'function') {
                            this.Suc('删除成功')
                        } else if (typeof this.Toast === 'function'){
                            this.Toast('删除成功')
                        }
                    }
                }
            } else if (typeof callback === 'object') {
                opt = callback
            }
            const next = () => this.Dp(this.ModelFormat(paths, 'delete'), {...opt, id: data.id, data}).then(res => {
                if(typeof callback === 'function') callback(res)
                return res
            })
            return confirm ? this.DelConfirm().then(res => next()) : next()
        },

        /**
         * @name 模型清理（充值）
         * @param {function} paths - 模型路径，不传则默认从 this.store 中获取
         */
        Reset(paths) {
            let { store, model } = this.ModelFormat(paths, 'get')
            return this.Cm(`${store}/MODEL_RESET`, model)
        },

        /**
         * @name 提交表单
         * @description 自动从 this.Params 拉取数据，根据是否有主键判断是新增还是修改
         * @param {function} data - 提交数据，不传则默认从 this.Params 中获取
         * @param {function} paths - 模型路径，不传则默认从 this.store 中获取
         * @param {function} callback - 回调函数
         * @returns {Promise}
         */
        Submit(data=this.Origin(this.Params), paths, callback) {
            return data.id ?
                this.Put(data, paths, callback) :
                this.Post(data, paths, callback)
        },

        /**
         * @name 编辑弹窗控制器
         * @description 自动从 this.Params 拉取数据，根据是否有主键判断是新增还是修改
         * @param {function} item - 编辑的对象，传 NULL 表示新增对象
         * @param {function} title - 弹窗的标题
         * @param {function} model - 控制器所对应的键值
         * @returns {Promise}
         */
        Edit(item, title, model='Editer') {
            this.Active(item)
            if (this[model]) {
                this[model].view  = true
                this[model].title = title ? title : (item ? '修改数据' : '新增数据')
                this[model].form  = item ? this.Origin(item) : null
            }
        },

        // Next(router, item, paths){
        //     if(!item){
        //         this.Edit()
        //     }else if(item.id && model){
        //         let [ base, store ] = model.split('/')
        //         this.Dp(`${base}/ACTIVE_${store.toUpperCase()}`,item)
        //         this.$nextTick(()=>{
        //             this.Go(router,{ id: item.id })
        //         })                
        //     }
        // },

        /**
         * @name 筛选查询
         * @description 类似 Get 方法，一般用于用户切换了筛选条件后重新查询
         * @param {string} [paths] - 模型路径，不传则默认从 this.store 中获取
         * @param {Object} [filter] - 筛选条件，不传则默认从 this.Filter 中获取
         * @param {Object} [opt] - 其他参数
         * @returns {Promise}
         */
        MakeFilter(paths, filter, {clean=true, loading=false}={}) {
			let {store, model} = this.ModelFormat(paths, 'get')
			if (clean) {
				this.Cm(`${store}/MODEL_RESET`, model)
			}
            return this.Get(1, paths, filter, { loading })
        },


        /**
         * @name 执行 vuex 动作
         * @description this.$store.dispatch 的语法糖，会自动格式化 paths
         * @param {string} [paths] - 模型路径，不传则默认从 this.store 中获取
         * @param {Object} [data] - 提交数据
         * @returns {Promise}
         */
        Dp(paths, data) {
            return this.$store.dispatch(paths && paths.path ? paths.path : this.ModelFormat(paths).path, data)
        },


        /**
         * @name 执行 vuex 图片
         * @description this.$store.commit 的语法糖，会自动格式化 paths
         * @param {string} [path] - 模型路径，不传则默认从 this.store 中获取
         * @param {object} [data] - 提交数据
         * @returns {Promise}
         */
        Cm(paths, data) {
            return this.$store.commit(paths && paths.path ? paths.path : this.ModelFormat(paths).path, data)
        },


        /**
         * @name 递归查询模型数据
         * @description 框架内方法，业务层无需使用
         */
        StoreDeepInspect(paths, tunnel=this.$store.state) {
            let name = null
            if (Boolean(paths.length)) {
                name = paths.shift()
            } else {
                return tunnel
            }
            if (name) {
                if (tunnel[name]) {                    
                    return this.StoreDeepInspect(paths, tunnel[name])
                }
                // else if (paths.length + 1 === this.StorePath.length && this.$nuxt && this.$nuxt.layoutName){
                //     // 兼容 nuxt 深层模块
                //     paths.unshift(name)
                //     return this.StoreDeepInspect(paths, tunnel[this.$nuxt.layoutName])
                // }
            }
            return {}
        },

        /**
         * @name 格式化模型
         * @description 框架内方法，业务层无需使用
         */
        ModelFormat(paths, action='') {
            
            const StoreDeepInspect = location => {
                return this.StoreDeepInspect(location)
            }
            class ModelPath {
                constructor({ store, model, action, action_path }) {
                    this.store = store
                    this.model = model
                    this.action = action
                    this.action_path = action_path
                    this.path = `${store}/${this.action_path}`
                    this.paths = store.split('/').concat(model)
                }
                get main(){
                    return this.store && this.model ? StoreDeepInspect([...this.store.split('/'), this.model]) : {}
                }
            }

            if (!paths) {
                paths = this.StoreInfo.path_origin
            }

            if (typeof paths === 'string') {
                paths = paths.split('/')
            }
            let store, model, action_path;
            // store 为 vuex 的命名空间，若不传则尝试自动取值
            if (paths.length === 1) {
                store = this.StoreInfo.store
                model = paths[0]
            } else {
                // 路径最后一个为模型
                model = paths.pop()
                // 若代码为全大写则表示为动作名
                
                if(!action && model.toUpperCase() === model){
                    action_path = model
                    model = null
                } else if(action){
                    action_path = `${action.toUpperCase()}_${model.toUpperCase()}`
                }
                store = paths.join('/') // 去掉最后一个剩余的为模块路径
            }

            // 如果 vuex 没有此模型，尝试兼容路径
            // console.log('Store.mix.js - ModelFormat:','| paths:', paths, '| store:', store, '| hasStore:', this.$store.hasModule(paths[0]), '| model', model, '\n\n')
            // if(paths[0] && !this.$store.hasModule(store.split('/'))){
            //     if(this.$nuxt && this.$nuxt.layoutName){
            //         store = this.$nuxt.layoutName + '/' + store
            //     }
            // }
            
            return new ModelPath({store, model, action, action_path})
        },

        // ModelParamType(sample) {

        // }
    }
}

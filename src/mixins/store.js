
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
            Editer: {
                view: false,
                title: null,
                form: null
            }
        }
    },
    computed: {
        
        /**
         * @name 默认数据模型
         * @description 根据当前组件 this.store 值自动映射相关模型实例
         */
        Main(){
            return this.StoreInfo ? this.StoreInfo.main : {}
        },

        /**
         * @name 默认数据模型信息
         * @description 框架内方法，业务层无需使用
         */
        StoreInfo(){
            let opt = this.$options.model || this.store
            if(opt){
                if(typeof opt === 'string'){
                    opt = { path: opt }
                }
                if(typeof opt === 'object'){
                    let { path: path_origin, url, title, as, auth } = opt
                    let { store, model, path, main } = this.ModelFormat(path_origin)
                    if(this.$store._modulesNamespaceMap[`${store}/`]){
                        if(as){
                            if(!url){
                                url = path_origin
                            }
                        }
                        return { main, path, paths: path.split('/'), path_origin, store, model, auth }
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
         * @param {number} page - 列表页码，默认加载第一页
         * @param {string} paths - 模型路径，不传则默认从 this.store 中获取
         * @param {Object} filter - 过滤器（筛选参数），不传则默认从 this.Filter 中获取
         * @param {Object} opt - 参数集，会传递到 Fetch 方法中
         * @returns {Promise}
         */
        Get(page, paths, filter, opt={}){
            if(typeof page === 'string'){
                filter = paths
                paths = page
                page = null
            }
            let params = this.Origin(typeof filter === 'object' ? filter : this.Filter) || {}
            params.page = page ? page : 1
            return this.Dp(this.ModelFormat(paths, 'get'), {...opt, params}).then(res => {
                return res
            })
        },

        /**
         * @name 初始化数据
         * @description 初始化列表，此方法初始化过一次后便不会重复拉取请求，一般用于拉取固定数据
         * @param {string} paths - 模型路径，不传则默认从 this.store 中获取
         * @param {Object} params - 筛选参数，默认没有 page 参数，若有 page 的需求可以在此对象中传递
         * @param {Object} opt - 参数集，会传递到 Fetch 方法中
         * @returns {Promise}
         */
        GetInit(paths, params={}, opt={}){
            let { cache } = opt
            let model = this.ModelFormat(paths, 'get')
            if(cache){

            }
            return model.main.init ? 
                Promise.resolve(model.main.list) :
                this.Dp(model, {...opt, params}).then(res => {
                    if(!res.err){
                        return res.result
                    }
                    return null
                })
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
        Item(id, paths, params={}, opt={}){
            return this.Dp(this.ModelFormat(paths, 'get'), {...opt, id, params}).then(res => {
                if(!res.err){
                    if(Array.isArray(res.result)){
                        return res.result[0] ? res.result[0] : null
                    }
                    return res.result
                }
                return null
            })
        },

        /**
         * @name 加载更多数据
         * @description 一般用在移动端的 "触底加载" 的效果，拉取的数据会连接上一页的列表
         * @param {string} paths - 模型路径，不传则默认从 this.store 中获取
         * @param {Object} filter - 过滤器（筛选参数），不传则默认从 this.Filter 中获取
         * @param {Object} opt - 参数集，会传递到 Fetch 方法中
         * @returns {Promise}
         */
        LoadMore(paths, filter, opt){
            let model = this.ModelFormat(paths, 'more')
            let { init, loading, more, empty } = model.main
            if(init && !loading && more && !empty){
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
        Action(name='POST', paths, data={}){
            return this.Dp(this.ModelFormat(paths, name), data)
        },


        /**
         * @name 设为焦点
         * @param {Object} item - 被设为焦点的实例
         * @param {string} paths - 模型路径，不传则默认从 this.store 中获取
         * @returns {Promise}
         */
        Active(item, paths){
            return this.Dp(this.ModelFormat(paths, 'active'), item)
        },

        /**
         * @name 提交数据行
         * @param {Object} data - 提交数据，不传则默认从 this.Params 中获取
         * @param {string} paths - 模型路径，不传则默认从 this.store 中获取
         * @param {function} callback - 回调函数
         * @returns {Promise}
         */
        Post(data=this.Origin(this.Params), paths, callback){
            let opt = {}
            if(!callback){
                callback = (res) => {
                    if(res && !res.err){
                        this.Suc('操作成功')
                        this.$emit('finish', res ? res : 1)
                        if(typeof this.view !== "undefined"){
                            this.view = false
                        }
                    }
                }
            } else if(typeof callback === 'object'){
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
        Put(data=this.Origin(this.Params), paths, callback){
            let opt = {}
            if(!callback){
                callback = res => {
                    if(res && !res.err){                        
                        this.Suc('操作成功')
                        this.$emit('finish', res ? res : 1)
                        if(typeof this.view !== "undefined"){
                            this.view = false
                        }
                    }
                }
            } else if(typeof callback === 'object'){
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
        Del(data=this.Origin(this.Params), paths, callback, {confirm=true}={}){
            let opt = {}
            if(!callback){
                callback = res => {
                    if(res && !res.err){
                        this.Suc('删除成功')
                    }
                }
            } else if(typeof callback === 'object'){
                opt = callback
            }
            const next = () => this.Dp(this.ModelFormat(paths, 'delete'), {...opt, id: data.id, data}).then(res => {
                if(typeof callback === 'function') callback(res)
                return res
            })
            return confirm ? this.DelConfirm().then(res => next()) : next()
        },

        // Clean(model=this.StorePath[1]){
        //     // let path = `${this.StorePath[0]}/MODEL_RESET`
        //     return this.Cm(this.ModelFormat(paths + '/MODEL_RESET'))
        // },

        /**
         * @name 提交表单
         * @description 自动从 this.Params 拉取数据，根据是否有主键判断是新增还是修改
         * @param {function} callback - 回调函数
         * @returns {Promise}
         */
        Submit(paths, callback){
            let params = this.Origin(this.Params)
            return params.id ?
                this.Put(params, paths, callback) :
                this.Post(params, paths, callback)
        },


        Edit(row, title, model='Editer'){
            this.Active(row)
            if(this[model]){
                this[model].view  = true
                this[model].title = title ? title : (row ? '修改数据' : '新增数据')
                this[model].form  = row ? this.Origin(row) : null
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
        // Reset(model=this.StorePath[1]){
        //     let path = `${this.StorePath[0]}/MODEL_RESET`
        //     return this.$store.commit(path,{name:model.toLowerCase()})
        // },

        /**
         * @name 筛选查询
         * @description 类似 Get 方法，一般用于用户切换了筛选条件后重新查询
         * @param {string} paths - 模型路径，不传则默认从 this.store 中获取
         * @param {Object} filter - 筛选条件，不传则默认从 this.Filter 中获取
         * @param {Object} opt - 其他参数
         * @returns {Promise}
         */
        MakeFilter(paths, filter, {clean=true, loading=false}={}){
			let { store, model } = this.ModelFormat(paths, 'get')
			if(clean){
				this.Cm(`${store}/MODEL_RESET`, model)
			}
            return this.Get(1, paths, filter, { loading })
        },


        /**
         * @name 执行 vuex 动作
         * @description this.$store.dispatch 的语法糖，会自动格式化 paths
         * @param {string} paths - 模型路径，不传则默认从 this.store 中获取
         * @param {Object} data - 提交数据
         * @returns {Promise}
         */
        Dp(paths, data){
            return this.$store.dispatch(paths && paths.path ? paths.path : this.ModelFormat(paths).path, data)
        },


        /**
         * @name 执行 vuex 图片
         * @description this.$store.commit 的语法糖，会自动格式化 paths
         * @param {string} paths - 模型路径，不传则默认从 this.store 中获取
         * @param {Object} data - 提交数据
         * @returns {Promise}
         */
        Cm(paths, data){
            return this.$store.commit(paths && paths.path ? paths.path : this.ModelFormat(paths).path, data)
        },


        /**
         * @name 递归查询模型数据
         * @description 框架内方法，业务层无需使用
         */
        StoreDeepInspect(paths, tunnel=this.$store.state){
            let name = null
            if(Boolean(paths.length)){
                name = paths.shift()
            } else {
                return tunnel
            }
            if(name){
                if(tunnel[name]){                    
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
        ModelFormat(paths, action=''){
            
            const StoreDeepInspect = location => {
                return this.StoreDeepInspect(location)
            }
            class Model {
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

            if(!paths){
                paths = this.StoreInfo.path_origin
            }

            if(typeof paths === 'string'){
                paths = paths.split('/')
            }
            let store, model, action_path;
            // store 为 vuex 的命名空间，若不传则尝试自动取值
            if(paths.length === 1){
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
            
            let result = new Model({ store, model, action, action_path })
            return result
        }
    }
}

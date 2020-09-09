"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _default = {
  data: function data() {
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
    };
  },
  computed: {
    /**
     * @name 默认数据模型
     * @description 根据当前组件 this.store 值自动映射相关模型实例
     */
    Main: function Main() {
      return this.StoreInfo ? this.StoreInfo.main : {};
    },

    /**
     * @name 默认数据模型信息
     * @description 框架内方法，业务层无需使用
     */
    StoreInfo: function StoreInfo() {
      var opt = this.$options.model || this.store;

      if (opt) {
        if (typeof opt === 'string') {
          opt = {
            path: opt
          };
        }

        if (_typeof(opt) === 'object') {
          var _opt = opt,
              path_origin = _opt.path,
              url = _opt.url,
              title = _opt.title,
              as = _opt.as,
              auth = _opt.auth;

          var _this$ModelFormat = this.ModelFormat(path_origin),
              store = _this$ModelFormat.store,
              model = _this$ModelFormat.model,
              path = _this$ModelFormat.path,
              main = _this$ModelFormat.main;

          if (this.$store._modulesNamespaceMap["".concat(store, "/")]) {
            if (as) {
              if (!url) {
                url = path_origin;
              }
            }

            return {
              main: main,
              path: path,
              paths: path.split('/'),
              path_origin: path_origin,
              store: store,
              model: model,
              auth: auth
            };
          } else {}
        }
      }

      return null;
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
    Get: function Get(page, paths, filter) {
      var opt = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

      if (typeof page === 'string') {
        filter = paths;
        paths = page;
        page = null;
      }

      var params = this.Origin(_typeof(filter) === 'object' ? filter : this.Filter) || {};
      params.page = page ? page : 1;
      return this.Dp(this.ModelFormat(paths, 'get'), _objectSpread(_objectSpread({}, opt), {}, {
        params: params
      })).then(function (res) {
        return res;
      });
    },

    /**
     * @name 初始化数据
     * @description 初始化列表，此方法初始化过一次后便不会重复拉取请求，一般用于拉取固定数据
     * @param {string} paths - 模型路径，不传则默认从 this.store 中获取
     * @param {Object} params - 筛选参数，默认没有 page 参数，若有 page 的需求可以在此对象中传递
     * @param {Object} opt - 参数集，会传递到 Fetch 方法中
     * @returns {Promise}
     */
    GetInit: function GetInit(paths) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var opt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var cache = opt.cache;
      var model = this.ModelFormat(paths, 'get');

      if (cache) {}

      return model.main.init ? Promise.resolve(model.main.list) : this.Dp(model, _objectSpread(_objectSpread({}, opt), {}, {
        params: params
      })).then(function (res) {
        if (!res.err) {
          return res.result;
        }

        return null;
      });
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
    Item: function Item(id, paths) {
      var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var opt = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      return this.Dp(this.ModelFormat(paths, 'get'), _objectSpread(_objectSpread({}, opt), {}, {
        id: id,
        params: params
      })).then(function (res) {
        if (!res.err) {
          if (Array.isArray(res.result)) {
            return res.result[0] ? res.result[0] : null;
          }

          return res.result;
        }

        return null;
      });
    },

    /**
     * @name 加载更多数据
     * @description 一般用在移动端的 "触底加载" 的效果，拉取的数据会连接上一页的列表
     * @param {string} paths - 模型路径，不传则默认从 this.store 中获取
     * @param {Object} filter - 过滤器（筛选参数），不传则默认从 this.Filter 中获取
     * @param {Object} opt - 参数集，会传递到 Fetch 方法中
     * @returns {Promise}
     */
    LoadMore: function LoadMore(paths, filter, opt) {
      var model = this.ModelFormat(paths, 'more');
      var _model$main = model.main,
          init = _model$main.init,
          loading = _model$main.loading,
          more = _model$main.more,
          empty = _model$main.empty;

      if (init && !loading && more && !empty) {
        // if(loading){
        //     this.Loading()
        // }
        // let params = this.Origin( this.Filter ? this.Filter : {} )
        var params = this.Origin(_typeof(filter) === 'object' ? filter : this.Filter) || {};
        return this.Dp(model, {
          params: params
        }).then(function (res) {
          // if(loading){
          //     this.HideLoading()
          // }
          return res;
        });
      } else {
        console.log("\u65E0\u6CD5\u52A0\u8F7D\u66F4\u591A - init:".concat(init, " loading:").concat(!loading, " more:").concat(more, " empty:").concat(!empty));
        return Promise.resolve(null);
      }
    },

    /**
     * @name 模型动作
     * @param {string} name - 动作名称，会自动转换为大写字母
     * @param {string} paths - 模型路径，不传则默认从 this.store 中获取
     * @param {Object} data - 参数集，会传递到 Fetch 方法中
     * @returns {Promise}
     */
    Action: function Action() {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'POST';
      var paths = arguments.length > 1 ? arguments[1] : undefined;
      var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return this.Dp(this.ModelFormat(paths, name), data);
    },

    /**
     * @name 设为焦点
     * @param {Object} item - 被设为焦点的实例
     * @param {string} paths - 模型路径，不传则默认从 this.store 中获取
     * @returns {Promise}
     */
    Active: function Active(item, paths) {
      return this.Dp(this.ModelFormat(paths, 'active'), item);
    },

    /**
     * @name 提交数据行
     * @param {Object} data - 提交数据，不传则默认从 this.Params 中获取
     * @param {string} paths - 模型路径，不传则默认从 this.store 中获取
     * @param {function} callback - 回调函数
     * @returns {Promise}
     */
    Post: function Post() {
      var _this = this;

      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.Origin(this.Params);
      var paths = arguments.length > 1 ? arguments[1] : undefined;
      var callback = arguments.length > 2 ? arguments[2] : undefined;
      var opt = {};

      if (!callback) {
        callback = function callback(res) {
          if (res && !res.err) {
            _this.Suc('操作成功');

            _this.$emit('finish', res ? res : 1);

            if (typeof _this.view !== "undefined") {
              _this.view = false;
            }
          }
        };
      } else if (_typeof(callback) === 'object') {
        opt = callback;
      }

      return this.Dp(this.ModelFormat(paths, 'post'), _objectSpread(_objectSpread({}, opt), {}, {
        data: data
      })).then(function (res) {
        if (typeof callback === 'function') callback(res);
        return res;
      });
    },

    /**
     * @name 修改数据行
     * @param {Object} data - 提交数据，不传则默认从 this.Params 中获取
     * @param {string} paths - 模型路径，不传则默认从 this.store 中获取
     * @param {function} callback - 回调函数
     * @returns {Promise}
     */
    Put: function Put() {
      var _this2 = this;

      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.Origin(this.Params);
      var paths = arguments.length > 1 ? arguments[1] : undefined;
      var callback = arguments.length > 2 ? arguments[2] : undefined;
      var opt = {};

      if (!callback) {
        callback = function callback(res) {
          if (res && !res.err) {
            _this2.Suc('操作成功');

            _this2.$emit('finish', res ? res : 1);

            if (typeof _this2.view !== "undefined") {
              _this2.view = false;
            }
          }
        };
      } else if (_typeof(callback) === 'object') {
        opt = callback;
      }

      return this.Dp(this.ModelFormat(paths, 'put'), _objectSpread(_objectSpread({}, opt), {}, {
        id: data.id,
        data: data
      })).then(function (res) {
        if (typeof callback === 'function') callback(res);
        return res;
      });
    },

    /**
     * @name 删除数据行
     * @param {Object} data - 提交数据，不传则默认从 this.Params 中获取
     * @param {string} paths - 模型路径，不传则默认从 this.store 中获取
     * @param {function} callback - 回调函数
     * @returns {Promise}
     */
    Del: function Del() {
      var _this3 = this;

      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.Origin(this.Params);
      var paths = arguments.length > 1 ? arguments[1] : undefined;
      var callback = arguments.length > 2 ? arguments[2] : undefined;

      var _ref = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
          _ref$confirm = _ref.confirm,
          confirm = _ref$confirm === void 0 ? true : _ref$confirm;

      var opt = {};

      if (!callback) {
        callback = function callback(res) {
          if (res && !res.err) {
            _this3.Suc('删除成功');
          }
        };
      } else if (_typeof(callback) === 'object') {
        opt = callback;
      }

      var next = function next() {
        return _this3.Dp(_this3.ModelFormat(paths, 'delete'), _objectSpread(_objectSpread({}, opt), {}, {
          id: data.id,
          data: data
        })).then(function (res) {
          if (typeof callback === 'function') callback(res);
          return res;
        });
      };

      return confirm ? this.DelConfirm().then(function (res) {
        return next();
      }) : next();
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
    Submit: function Submit(paths, callback) {
      var params = this.Origin(this.Params);
      return params.id ? this.Put(params, paths, callback) : this.Post(params, paths, callback);
    },
    Edit: function Edit(row, title) {
      var model = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'Editer';
      this.Active(row);

      if (this[model]) {
        this[model].view = true;
        this[model].title = title ? title : row ? '修改数据' : '新增数据';
        this[model].form = row ? this.Origin(row) : null;
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
    MakeFilter: function MakeFilter(paths, filter) {
      var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
          _ref2$clean = _ref2.clean,
          clean = _ref2$clean === void 0 ? true : _ref2$clean,
          _ref2$loading = _ref2.loading,
          loading = _ref2$loading === void 0 ? false : _ref2$loading;

      var _this$ModelFormat2 = this.ModelFormat(paths, 'get'),
          store = _this$ModelFormat2.store,
          model = _this$ModelFormat2.model;

      if (clean) {
        this.Cm("".concat(store, "/MODEL_RESET"), model);
      }

      return this.Get(1, paths, filter, {
        loading: loading
      });
    },

    /**
     * @name 执行 vuex 动作
     * @description this.$store.dispatch 的语法糖，会自动格式化 paths
     * @param {string} paths - 模型路径，不传则默认从 this.store 中获取
     * @param {Object} data - 提交数据
     * @returns {Promise}
     */
    Dp: function Dp(paths, data) {
      return this.$store.dispatch(paths && paths.path ? paths.path : this.ModelFormat(paths).path, data);
    },

    /**
     * @name 执行 vuex 图片
     * @description this.$store.commit 的语法糖，会自动格式化 paths
     * @param {string} paths - 模型路径，不传则默认从 this.store 中获取
     * @param {Object} data - 提交数据
     * @returns {Promise}
     */
    Cm: function Cm(paths, data) {
      return this.$store.commit(paths && paths.path ? paths.path : this.ModelFormat(paths).path, data);
    },

    /**
     * @name 递归查询模型数据
     * @description 框架内方法，业务层无需使用
     */
    StoreDeepInspect: function StoreDeepInspect(paths) {
      var tunnel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.$store.state;
      var name = null;

      if (Boolean(paths.length)) {
        name = paths.shift();
      } else {
        return tunnel;
      }

      if (name) {
        if (tunnel[name]) {
          return this.StoreDeepInspect(paths, tunnel[name]);
        } // else if (paths.length + 1 === this.StorePath.length && this.$nuxt && this.$nuxt.layoutName){
        //     // 兼容 nuxt 深层模块
        //     paths.unshift(name)
        //     return this.StoreDeepInspect(paths, tunnel[this.$nuxt.layoutName])
        // }

      }

      return {};
    },

    /**
     * @name 格式化模型
     * @description 框架内方法，业务层无需使用
     */
    ModelFormat: function ModelFormat(paths) {
      var _this4 = this;

      var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

      var StoreDeepInspect = function StoreDeepInspect(location) {
        return _this4.StoreDeepInspect(location);
      };

      var Model = /*#__PURE__*/function () {
        function Model(_ref3) {
          var store = _ref3.store,
              model = _ref3.model,
              action = _ref3.action,
              action_path = _ref3.action_path;

          _classCallCheck(this, Model);

          this.store = store;
          this.model = model;
          this.action = action;
          this.action_path = action_path;
          this.path = "".concat(store, "/").concat(this.action_path);
          this.paths = store.split('/').concat(model);
        }

        _createClass(Model, [{
          key: "main",
          get: function get() {
            return this.store && this.model ? StoreDeepInspect([].concat(_toConsumableArray(this.store.split('/')), [this.model])) : {};
          }
        }]);

        return Model;
      }();

      if (!paths) {
        paths = this.StoreInfo.path_origin;
      }

      if (typeof paths === 'string') {
        paths = paths.split('/');
      }

      var store, model, action_path; // store 为 vuex 的命名空间，若不传则尝试自动取值

      if (paths.length === 1) {
        store = this.StoreInfo.store;
        model = paths[0];
      } else {
        // 路径最后一个为模型
        model = paths.pop(); // 若代码为全大写则表示为动作名

        if (!action && model.toUpperCase() === model) {
          action_path = model;
          model = null;
        } else if (action) {
          action_path = "".concat(action.toUpperCase(), "_").concat(model.toUpperCase());
        }

        store = paths.join('/'); // 去掉最后一个剩余的为模块路径
      } // 如果 vuex 没有此模型，尝试兼容路径
      // console.log('Store.mix.js - ModelFormat:','| paths:', paths, '| store:', store, '| hasStore:', this.$store.hasModule(paths[0]), '| model', model, '\n\n')
      // if(paths[0] && !this.$store.hasModule(store.split('/'))){
      //     if(this.$nuxt && this.$nuxt.layoutName){
      //         store = this.$nuxt.layoutName + '/' + store
      //     }
      // }


      var result = new Model({
        store: store,
        model: model,
        action: action,
        action_path: action_path
      });
      return result;
    }
  }
};
exports["default"] = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.install = install;
Object.defineProperty(exports, "Model", {
  enumerable: true,
  get: function get() {
    return _main.Model;
  }
});
Object.defineProperty(exports, "Table", {
  enumerable: true,
  get: function get() {
    return _main.Table;
  }
});
Object.defineProperty(exports, "mixin", {
  enumerable: true,
  get: function get() {
    return _store["default"];
  }
});
exports.tools = exports.version = exports["default"] = void 0;

var _main = require("./library/main.js");

var _store = _interopRequireDefault(require("./mixins/store.js"));

var _proxy = _interopRequireDefault(require("./library/proxy"));

var _helper = _interopRequireDefault(require("./helper"));

var _package = _interopRequireDefault(require("../package.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// 在 UMD 规范下，Vue 可能需要到 window 全局变量上寻找

/**
 * 脱离 vuex 实现 （需要兼容 nuxt）以下方法可以封装成响应式
 * VUE2 实现响应式对象核心代码
 * import Vue from 'vue'
 * const $state = {num: 1}
 * const _vm = new Vue({
 *     data: {
 *         $$state: $state
 *     }
 * })
 * export default $state
 *
 * VUE3 实现响应式对象核心代码
 * import { reactive } from 'vue'
 * const $state = reactive({data: {num: 1}})
 */
var version = _package["default"].version;
exports.version = version;

function install(app, options) {
  var vueVersion = Number(app.version.split('.')[0]); // 版本

  console.log('dgx install vueVersion:', vueVersion); // 获取模型数据库实例

  function getModels(store) {
    // 必须使用 $store.state 而不是 $store._modules.root.state, 否则在 Vue3 中会失去响应式
    var models = {};

    var deepInspect = function deepInspect(tunnel, state, nodes) {
      var path = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';

      if (tunnel._children) {
        var _loop = function _loop(name) {
          if (nodes[name]) _helper["default"].consoleWarn("Model name is already use ('".concat(name, "') please check")); // 命名重复提示

          var nextPath = path ? "".concat(path, "/").concat(name) : "".concat(name); // nodes[name] = deepInspect(tunnel._children[name], state[name], {}, nextPath)

          Object.defineProperty(nodes, name, {
            configurable: true,
            enumerable: true,
            get: function get() {
              return deepInspect(tunnel._children[name], state[name], {}, nextPath);
            }
          });
        };

        for (var name in tunnel._children) {
          _loop(name);
        }
      }

      if (tunnel.state) {
        var _loop2 = function _loop2(_name) {
          if (_helper["default"].instance(state[_name], _main.Table) || state[_name].__table__) {
            // __table__ 用于兼容 nuxt2
            if (nodes[_name]) _helper["default"].consoleWarn("Table name is already use ('".concat(_name, "') please check")); // 命名重复提示
            // nodes[name] = new TableProxy(state[name], path ? `${path}/${name}` : `${name}`)

            Object.defineProperty(nodes, _name, {
              configurable: true,
              enumerable: true,
              get: function get() {
                return new _proxy["default"](state[_name], path ? "".concat(path, "/").concat(_name) : "".concat(_name));
              }
            });
          }
        };

        for (var _name in tunnel.state) {
          _loop2(_name);
        }

        return nodes;
      }
    };

    if (store) deepInspect(store._modules.root, store.state, models);
    return models;
  }
  /**
   * 不同 vue 版全局方法挂载方式:
   * Vue 2.0: Vue.prototype.$model = {}
   * Vue 3.0: app.config.globalProperties.$model = {}
   * nuxt2 环境，$store 必须由外部传入
   */


  if (!options.store) {
    if (vueVersion === 2) {
      if (typeof app.prototype.$store !== 'undefined') {
        options.store = app.prototype.$store;
      }
    } else if (vueVersion === 3) {
      if (typeof app.config.globalProperties.$store !== 'undefined') {
        options.store = app.config.globalProperties.$store;
      }
    }
  }

  var $models = typeof Proxy !== 'undefined' ? new Proxy({}, {
    get: function get(target, key) {
      return getModels(options.store)[key];
    }
  }) : getModels(options.store);

  if (vueVersion === 2) {
    options.dataSet = app.set; // Vue2 需要传入 Vue.set 方法; Vue3 废弃了该方法;

    app.prototype.$models = $models; // console.log('vue:', vueVersion, '\n app.prototype: ', app.prototype, typeof app.prototype.$store, '\n ======== \n process:', process.client, process.server)
  } else if (vueVersion === 3) {
    app.config.globalProperties.$models = $models;
  }

  _main.Model.setup(options); // app.mixin({
  //     beforeCreate() {
  //         var options = this.$options;
  //         // store injection
  //         if (options.store) {
  //           this.$store = typeof options.store === 'function'
  //             ? options.store()
  //             : options.store;
  //         } else if (options.parent && options.parent.$store) {
  //           this.$store = options.parent.$store;
  //         }
  //     }
  // })

}

var tools = {};
exports.tools = tools;
var _default = {
  version: version,
  Model: _main.Model,
  Table: _main.Table,
  install: install,
  mixin: _store["default"],
  tools: tools
};
exports["default"] = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vue = _interopRequireDefault(require("vue"));

var _helper = _interopRequireDefault(require("./helper"));

var Mutations = _interopRequireWildcard(require("./mutations"));

var Actions = _interopRequireWildcard(require("./actions"));

var _factory = require("./factory");

var _package = _interopRequireDefault(require("../../package.json"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var FETCH = Actions.FETCH,
    GET = Actions.GET,
    FETCH_FINISH = Actions.FETCH_FINISH;
var FETCH_REMOVE = Mutations.FETCH_REMOVE,
    FETCH_CANCEL = Mutations.FETCH_CANCEL,
    FETCH_UPDATE = Mutations.FETCH_UPDATE,
    MODEL_ADD = Mutations.MODEL_ADD,
    MODEL_MORE = Mutations.MODEL_MORE,
    MODEL_UPDATE = Mutations.MODEL_UPDATE,
    MODEL_REMOVE = Mutations.MODEL_REMOVE,
    MODEL_RESET = Mutations.MODEL_RESET,
    MODEL_ROW_EXTEND = Mutations.MODEL_ROW_EXTEND;

var Model = function constructor() {
  var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var store = opt.store,
      auth = opt.auth,
      fetch = opt.fetch,
      _opt$namespaced = opt.namespaced,
      namespaced = _opt$namespaced === void 0 ? true : _opt$namespaced;
  this.store = store;
  this.auth = auth;
  this.fetch = Object.assign(Model.config.fetch, fetch);
  this.namespaced = namespaced; // 混合配置

  for (var _i = 0, _arr = ['state', 'actions', 'mutations', 'getters']; _i < _arr.length; _i++) {
    var key = _arr[_i];

    if (opt && _typeof(opt[key]) === 'object') {
      this[key] = Object.assign(this[key], opt[key]);
    }
  } // 遍历所有 state 查找 dgx 模块并创建方法


  for (var model in this.state) {
    if (_helper["default"].isObject(this.state[model]) && this.state[model].options) {
      // if (typeof options === 'string') {
      //     options = {url: options}
      // }
      // 模块通用状态属性
      this.state.ajax[model] = 0;
      this.state.models.push(model); // 基础属性

      _vue["default"].set(this.state, model, Object.assign({
        name: model,
        auth: this.state[model].options.auth ? this.state[model].options.auth : this.auth,
        init: false,
        loading: false,
        editing: false,
        ajax: [],
        error: false,
        page: 1,
        marker: undefined,
        total: null,
        count: undefined,
        empty: false,
        list: [],
        filter: {},
        // id: null, // 此字段即将废弃
        active: null,
        item: null
      }, this.state[model]));

      _vue["default"].set(this.state[model], 'reset', Object.assign({}, this.state[model]));

      this.actions = {
        FETCH: FETCH.bind(this),
        GET: GET.bind(this),
        FETCH_FINISH: FETCH_FINISH.bind(this)
      }; // 合并工厂方法

      this.actions = Object.assign(this.actions, (0, _factory.ACTIVE)(model, this), (0, _factory.RESTFUL)(model, this));
    }
  }
};

Model.prototype.state = {
  ajax: [],
  models: [],
  common: {
    options: {}
  }
}; // Model.prototype.actions = {
//     FETCH: FETCH,
//     GET: GET,
//     FETCH_FINISH: FETCH_FINISH
// }

Model.prototype.mutations = {
  FETCH_UPDATE: FETCH_UPDATE,
  FETCH_CANCEL: FETCH_CANCEL,
  FETCH_REMOVE: FETCH_REMOVE,
  MODEL_ADD: MODEL_ADD,
  MODEL_MORE: MODEL_MORE,
  MODEL_REMOVE: MODEL_REMOVE,
  MODEL_UPDATE: MODEL_UPDATE,
  MODEL_RESET: MODEL_RESET,
  MODEL_ROW_EXTEND: MODEL_ROW_EXTEND
};
Model.prototype.getters = {};
Model.Mutations = Mutations;
Model.Actions = Actions;
Model.Factory = {
  ACTIVE: _factory.ACTIVE,
  RESTFUL: _factory.RESTFUL
};
Model.config = {
  primaryKey: 'id',
  // 主键字段名称
  fetch: {
    ajax: null,
    socket: null,
    handle: 'auto' // 使用模式 [ajax | scocket | auto]
    // beforeFetch: null,
    // beforeRestful: null,
    // afterFetch: null,
    // afterRestful: null

  },
  RESTful: {
    GET: {
      // debounce: 200,
      interact: true
    },
    POST: {
      // debounce: 500,
      interact: false
    },
    PUT: {
      // debounce: 500,
      interact: true
    },
    DELETE: {
      // debounce: 500,
      interact: true
    }
  },
  middleware: {
    beforeFetch: new Function(),
    afterFetch: new Function(),
    beforeRESTful: new Function(),
    afterRESTful: new Function()
  }
};
Model.version = _package["default"].version;

Model.install = function (opt) {
  for (var _i2 = 0, _arr2 = ['fetch', 'RESTful']; _i2 < _arr2.length; _i2++) {
    var key = _arr2[_i2];

    if (opt && opt[key] && _typeof(opt[key]) === 'object') {
      Model.config[key] = Object.assign(Model.config[key], opt[key]);
    }
  }
}; // Model.register = function(opt) {
// }


var _default = Model;
exports["default"] = _default;
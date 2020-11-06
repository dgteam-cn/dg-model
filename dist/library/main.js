"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vue = _interopRequireDefault(require("vue"));

var _helper = _interopRequireDefault(require("@dgteam/helper"));

var Mutations = _interopRequireWildcard(require("./mutations"));

var Actions = _interopRequireWildcard(require("./actions"));

var _factory = require("./factory");

var _class = require("./class");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

var Model = /*#__PURE__*/function () {
  _createClass(Model, null, [{
    key: "install",
    // 安装默认配置
    value: function install(opt) {
      for (var _i = 0, _arr = ['fetch', 'RESTful']; _i < _arr.length; _i++) {
        var key = _arr[_i];

        if (opt && opt[key] && _typeof(opt[key]) === 'object') {
          Model.Options[key] = Object.assign(Model.Options[key], opt[key]);
        }
      }
    } // 注册新模型

  }, {
    key: "register",
    value: function register(model, options) {}
  }]);

  function Model() {
    var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Model);

    _defineProperty(this, "state", {
      ajax: [],
      models: [],
      common: {
        options: {}
      }
    });

    _defineProperty(this, "actions", {
      FETCH: FETCH.bind(this),
      GET: GET.bind(this),
      FETCH_FINISH: FETCH_FINISH.bind(this)
    });

    _defineProperty(this, "mutations", {
      FETCH_UPDATE: FETCH_UPDATE,
      FETCH_CANCEL: FETCH_CANCEL,
      FETCH_REMOVE: FETCH_REMOVE,
      MODEL_ADD: MODEL_ADD,
      MODEL_MORE: MODEL_MORE,
      MODEL_REMOVE: MODEL_REMOVE,
      MODEL_UPDATE: MODEL_UPDATE,
      MODEL_RESET: MODEL_RESET,
      MODEL_ROW_EXTEND: MODEL_ROW_EXTEND
    });

    _defineProperty(this, "getters", {});

    this.store = opt.store;
    this.auth = opt.auth;
    this.fetch = Object.assign(Model.Options.fetch, opt.fetch);
    this.namespaced = true; // 混合配置

    for (var _i2 = 0, _arr2 = ['state', 'actions', 'mutations', 'getters']; _i2 < _arr2.length; _i2++) {
      var key = _arr2[_i2];

      if (opt && _typeof(opt[key]) === 'object') {
        this[key] = Object.assign(this[key], opt[key]);
      }
    } // 遍历所有 state 查找 dgx 模块并创建方法


    for (var model in this.state) {
      if (_helper["default"].IsObject(this.state[model]) && this.state[model].options) {
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
          //new List(),
          error: false,
          page: 1,
          marker: undefined,
          total: null,
          count: undefined,
          empty: false,
          list: [],
          // new List(),
          filter: {},
          id: null,
          active: null,
          item: null
        }, this.state[model]));

        _vue["default"].set(this.state[model], 'reset', Object.assign({}, this.state[model])); // 合并工厂方法


        this.actions = Object.assign(this.actions, (0, _factory.ACTIVE)(model, this), (0, _factory.RESTFUL)(model, this));
      }
    }
  }

  return Model;
}();

_defineProperty(Model, "Mutations", Mutations);

_defineProperty(Model, "Actions", Actions);

_defineProperty(Model, "Factory", {
  ACTIVE: _factory.ACTIVE,
  RESTFUL: _factory.RESTFUL
});

_defineProperty(Model, "Options", {
  fetch: {
    ajax: null,
    socket: null,
    handle: 'auto',
    // 使用模式 [ajax | scocket | auto]
    beforeFetch: null,
    beforeRestful: null,
    afterFetch: null,
    afterRestful: null
  },
  RESTful: {
    GET: {
      debounce: 200,
      interact: true
    },
    POST: {
      debounce: 500,
      interact: false
    },
    PUT: {
      debounce: 500,
      interact: true
    },
    DELETE: {
      debounce: 500,
      interact: true
    }
  }
});

var _default = Model;
exports["default"] = _default;
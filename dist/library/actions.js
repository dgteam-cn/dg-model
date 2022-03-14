"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GET = exports.FETCH = void 0;

var _main = require("./main.js");

var _helper = _interopRequireDefault(require("../helper.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var requestConfigAdapter = function requestConfigAdapter(config) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$uni = _ref.uni,
      uni = _ref$uni === void 0 ? false : _ref$uni;

  if (uni) {
    var result = _helper["default"].originJSON(config); // headers > header


    if (result.headers && _typeof(result.headers) === 'object') {
      result.header = _helper["default"].originJSON(result.headers);
      delete result.headers;
    } // 拼接 params 查询参数


    if (result.params && _typeof(result.params) === 'object') {
      if (result.url.indexOf('?') === -1) result.url += '?';

      for (var key in result.params) {
        if (result.params[key] !== undefined) {
          if (typeof result.params[key] === 'string' || typeof result.params[key] === 'number') {
            result.url += "".concat(key, "=").concat(result.params[key], "&");
          } else {
            result.url += "".concat(key, "=").concat(JSON.stringify(result.params[key]), "&");
          }
        }
      }
    }

    return result;
  }

  return config;
};
/**
 * FETCH 请求
 * @param {String} config.method - 请求方式: GET POST PUT DELETE
 * @param {Object} config.params - 请求参数，会自动拼接到 url 中
 * @param {Object} config.paths - 路由参数，会自动替换到 url 中（若 paths 无法找到必要参数，框架自动从 params 中寻找）
 * @param {Object} config.data - 请求体
 * @param {Object} config.header - 请求头
 * @param {Boolean | String} config.only - 时执行相同唯一键的请求，前一个请求会被作废; 传 true 由框架自动生成唯一键，也可以手动传入字符串
 * @returns Promise
 */


var FETCH = function FETCH(_ref2) {
  var state = _ref2.state,
      commit = _ref2.commit;
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var table = config.table || config.model || false; // 2021-12-29 由于取消了 common 模块，在不指定 table 时候将无法正确挂载

  var method = config.method,
      silent = config.silent,
      only = config.only; // 检测是否重复，如果重复则取消之前相同的方法

  if (only && table && state[table] && _helper["default"].isArray(state[table].ajax)) {
    state[table].ajax.forEach(function (fetch, index) {
      if (fetch.only === only) {
        try {
          fetch.cancel({
            table: table,
            only: only
          });
        } catch (e) {
          _helper["default"].consoleWarn('need cancelHandler.');
        }

        commit('FETCH_REMOVE', [table, index]);
        commit('FETCH_CHECK', table);
      }
    });
  } // uni.request 所传递的参数不一样，需要改写部分字段
  // 整合请求头


  if (!config.headers) config.headers = {};

  if (table && state[table] && state[table].auth) {
    config.headers['Identity'] = state[table].auth; // 此步骤不符合规范

    if (!config.auth) {
      config.auth = state[table].auth;
    }
  }

  if (config.auth) {
    config.headers['Identity'] = config.auth;
  }

  delete config.auth; // 会和其他参数

  var paths = []; // 自动填充路由参数，例如 /user/:id 等，默认从 paths 中获取，若获取不到则尝试从 params 中获取

  var _iterator = _createForOfIteratorHelper(config.url.split('/')),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var route = _step.value;

      if (route[0] === ':' && route.length > 1) {
        var key = route.substr(1);

        if (config.paths && config.paths[key] !== undefined && typeof config.paths[key].toString === 'function') {
          paths.push(config.paths[key].toString());
        } else if (config.params && config.params[key] !== undefined && typeof config.params[key].toString === 'function') {
          paths.push(config.params[key].toString());
        } else {
          paths.push('');

          _helper["default"].consoleWarn("lose paths variables\"".concat(key, "\""));
        }
      } else {
        paths.push(route);
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  config.url = paths.join('/');
  return new Promise(function (resolve) {
    // 内部请求 id
    var id = _helper["default"].randomString(16); // 请求完成回调函数


    var fetchFinish = function fetchFinish(id) {
      var index = table && state[table].ajax.findIndex(function (item) {
        return item.id === id;
      });

      if (typeof index === 'number' && index >= 0) {
        commit('FETCH_REMOVE', [table, index]);
        commit('FETCH_CHECK', table);
      }
    };

    var callback = {
      // 成功回调
      success: function success(res) {
        // 兼容原生 uni.request
        if (_main.Model.uniRequestAdapter && Array.isArray(res) && res.length === 2) {
          var _res$ = res[1],
              data = _res$.data,
              headers = _res$.header,
              status = _res$.statusCode;
          res = {
            config: config,
            status: status,
            headers: headers,
            data: data
          };
        }

        commit('TABLE_UPDATE', [table, {
          init: true,
          error: false
        }]);
        fetchFinish(id);

        if (typeof config.responseType === 'string' && config.responseType.toLowerCase() === "arraybuffer") {
          resolve({
            data: res.data,
            config: Object.assign({}, config, res.config)
          });
        } else {
          resolve(_objectSpread(_objectSpread({}, res.data), {}, {
            config: Object.assign({}, config, res.config)
          }));
        }
      },
      // 失败回调
      error: function error(res) {
        fetchFinish(id);
        commit('TABLE_UPDATE', [table, {
          error: true
        }]);
        resolve(_objectSpread(_objectSpread({}, res.data), {}, {
          config: Object.assign({}, config, res.config)
        }));
      }
    };

    if (_main.Model.httpAdapter) {
      commit('FETCH_JOIN', [table, {
        id: id,
        table: table,
        only: only,
        method: method,
        silent: silent
      }]); // 2021-12-29 fix 如果 httpAdapter 没有注册 getCancel 方法导致请求无法加入 ajax 队列的问题

      commit('FETCH_CHECK', table);

      var getCancel = function getCancel(requestId, cancel) {
        return commit('FETCH_UPDATE', [table, {
          id: id,
          requestId: requestId,
          cancel: cancel
        }]);
      }; // 取消事件注册，需要获取 cancel 方法，以便之后取消时候执行


      var requestConfig = requestConfigAdapter(config, {
        uni: _main.Model.uniRequestAdapter
      });
      return _main.Model.httpAdapter(_objectSpread({
        getCancel: getCancel
      }, requestConfig)).then(callback.success, callback.error);
    } else {
      _helper["default"].consoleWarn('need httpAdapter.');
    }
  });
};
/**
 * Fetch GET 语法糖
 * 2021-12-29 不推荐使用，之后会被移除
 */


exports.FETCH = FETCH;

var GET = function GET(_ref3, config) {
  var dispatch = _ref3.dispatch;

  if (typeof config === 'string') {
    config = {
      url: config
    };
  } else if (Array.isArray(config)) {
    // 2021-07-09 fix 原本没有判断到 config 参数
    var _config = config,
        _config2 = _slicedToArray(_config, 3),
        url = _config2[0],
        _config2$ = _config2[1],
        parmas = _config2$ === void 0 ? {} : _config2$,
        _config2$2 = _config2[2],
        options = _config2$2 === void 0 ? {} : _config2$2;

    config = _objectSpread({
      url: url,
      parmas: parmas
    }, options);
  }

  return dispatch('FETCH', _objectSpread(_objectSpread({}, config), {}, {
    method: 'GET'
  }));
};

exports.GET = GET;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FETCH_FINISH = exports.GET = exports.FETCH = void 0;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var FETCH = function FETCH(_ref) {
  var _this = this;

  var state = _ref.state,
      dispatch = _ref.dispatch,
      commit = _ref.commit;
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var model = config.model || 'common';
  var method = config.method,
      silent = config.silent,
      only = config.only,
      middleware = config.middleware; // 检测是否重复，如果重复则取消之前相同的方法

  if (only) {
    commit('FETCH_CANCEL', [model, only]); //console.warn('dgx 请求重复，自动取消前一个请求。',config)
  }

  if (!config.headers) {
    config.headers = {};
  }

  if (state[model] && state[model].auth) {
    config.headers['Identity'] = state[model].auth;

    if (!config.auth) {
      config.auth = state[model].auth;
    }
  }

  if (config.auth) {
    config.headers['Identity'] = config.auth;
  }

  delete config.auth; // 返回 Fetch 方法
  // 自动填充路由参数，例如 /user/:id 等，默认从 paths 中获取，若获取不到则尝试从 params 中获取

  var paths = [];

  var _iterator = _createForOfIteratorHelper(config.url.split('/')),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var route = _step.value;

      if (route[0] === ':') {
        var key = route.substr(1);

        if (config.paths && config.paths[key] != undefined) {
          paths.push(config.paths[key]);
          delete config.paths[key];
        } else if (config.params && config.params[key] != undefined) {
          paths.push(config.params[key]);
          delete config.params[key];
        } else {
          console.log('DGX FETCH - lose paths ' + key);
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
    var callback = {
      // 成功回调
      success: function success(res) {
        commit('MODEL_UPDATE', [model, 'init', true]);
        commit('MODEL_UPDATE', [model, 'error', false]);
        dispatch('FETCH_FINISH', [model, res.config.id]);

        if (config.responseType === "arraybuffer") {
          resolve({
            data: res.data,
            config: res.config
          });
        } else {
          resolve(_objectSpread(_objectSpread({}, res.data), {}, {
            config: res.config
          }));
        }
      },
      // 失败回调
      error: function error(res) {
        if (res && res.config && res.config.id) {
          dispatch('FETCH_FINISH', [model, res.config.id]);
        }

        commit('MODEL_UPDATE', [model, 'error', true]);
        resolve(_objectSpread(_objectSpread({}, res.data), {}, {
          config: res.config ? res.config : {}
        }));
      }
    };

    var getCancel = function getCancel(id, cancel) {
      commit('MODEL_ADD', [model, 'ajax', {
        id: id,
        model: model,
        only: only,
        method: method,
        cancel: cancel,
        silent: silent
      }]);
      commit('FETCH_UPDATE', [model]);
    };

    if (_this.fetch.socket && _this.fetch.socket.status === 'online' && _this.fetch.handle === 'auto' && config.use != 'ajax') {
      config.use = 'socket';
      return _this.fetch.socket.proxy(_objectSpread({
        getCancel: getCancel
      }, config)).then(callback.success, callback.error);
    } else {
      config.use = 'ajax';
      return _this.fetch.ajax(_objectSpread({
        getCancel: getCancel
      }, config)).then(callback.success, callback.error);
    }
  });
}; // 语法糖


exports.FETCH = FETCH;

var GET = function GET(_ref2, config) {
  var dispatch = _ref2.dispatch;

  if (typeof config === 'string') {
    config = {
      url: config
    };
  }

  return dispatch('FETCH', _objectSpread(_objectSpread({}, config), {}, {
    method: 'GET'
  }));
}; // Fetch 结束请求


exports.GET = GET;

var FETCH_FINISH = function FETCH_FINISH(_ref3) {
  var state = _ref3.state,
      dispatch = _ref3.dispatch,
      commit = _ref3.commit;

  var _ref4 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [],
      _ref5 = _slicedToArray(_ref4, 2),
      model = _ref5[0],
      id = _ref5[1];

  for (var i = 0; i < state[model].ajax.length; i++) {
    if (state[model].ajax[i].id === id) {
      commit('MODEL_REMOVE', {
        base: model,
        key: 'ajax',
        index: i
      });
      return commit('FETCH_UPDATE', [model]);
    }
  }
}; // 本地请求


exports.FETCH_FINISH = FETCH_FINISH;

var MOCK = function MOCK() {};
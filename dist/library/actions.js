"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FETCH_FINISH = exports.FETCH = void 0;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var FETCH = function FETCH(_ref) {
  var _this = this;

  var state = _ref.state,
      dispatch = _ref.dispatch,
      commit = _ref.commit;
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var model = config.model || 'common';
  var base = model;
  var method = config.method,
      silent = config.silent,
      only = config.only,
      middleware = config.middleware; // 检测是否重复，如果重复则取消之前相同的方法
  // if(only){
  //     commit('FETCH_CANCEL',[model, only ]) //console.warn('dgx 请求重复，自动取消前一个请求。',config)
  // }

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
}; // Fetch 结束请求


exports.FETCH = FETCH;

var FETCH_FINISH = function FETCH_FINISH(_ref2) {
  var state = _ref2.state,
      dispatch = _ref2.dispatch,
      commit = _ref2.commit;

  var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [],
      _ref4 = _slicedToArray(_ref3, 2),
      model = _ref4[0],
      id = _ref4[1];

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
};

exports.FETCH_FINISH = FETCH_FINISH;
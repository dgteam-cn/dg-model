"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RESTFUL = exports.ACTIVE = void 0;

var _helper = _interopRequireDefault(require("@dgteam/helper"));

var _class = require("./class");

var _main = _interopRequireDefault(require("./main.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

// import debounce from 'lodash/debounce'
// import throttle from 'lodash/throttle'
var ACTIVE = function ACTIVE(model) {
  var _apis;

  var MODEL = model.toUpperCase();
  var ACTIVE_MODEL = "ACTIVE_".concat(MODEL);
  var ACTIVE_MODEL_CHANGE = "ACTIVE_".concat(MODEL, "_CHANGE");
  var ACTIVE_MODEL_RESET = "ACTIVE_".concat(MODEL, "_RESET");
  var apis = (_apis = {}, _defineProperty(_apis, ACTIVE_MODEL, function (_ref, active) {
    var state = _ref.state,
        dispatch = _ref.dispatch;

    if (Array.isArray(active) && active[0]) {
      active = active[0];
    }

    if (active === undefined || active === null) {
      // 重置
      dispatch(ACTIVE_MODEL_RESET);
    } else if (_typeof(active) === "object") {
      // 以 对象条件 来确定焦点
      var list = state[model].list;

      for (var i = 0; i < list.length; i++) {
        if (active.id && list[i].id && list[i].id === active.id) {
          return dispatch(ACTIVE_MODEL_CHANGE, {
            id: list[i].id || undefined,
            active: i,
            item: list[i]
          });
        }
      }
    } else {
      // 以索引来确定焦点，（ -1 = 选择数组的最后一个）
      if (active == -1) {
        active = state[model].list.length > 0 ? state[model].list.length - 1 : 0;
      } // 如果焦点不存在则默认使用原焦点，如果原焦点不存在则默认使用 0


      var queue = [active, state[model].active, 0];

      for (var _i = 0; _i < queue.length; _i++) {
        if (state[model].list[queue[_i]]) {
          active = queue[_i];
          break;
        }
      } // 如果列表存在键值


      if (state[model].list && state[model].list[active]) {
        return dispatch("ACTIVE_".concat(MODEL, "_CHANGE"), {
          id: state[model].list[active].id,
          active: active,
          item: state[model].list[active]
        });
      }

      dispatch("ACTIVE_".concat(MODEL, "_RESET"));
    }
  }), _defineProperty(_apis, ACTIVE_MODEL_CHANGE, function (_ref2) {
    var commit = _ref2.commit;
    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    for (var _i2 = 0, _arr = ['id', 'active', 'item']; _i2 < _arr.length; _i2++) {
      var key = _arr[_i2];

      if (config[key] || config[key] == 0) {
        commit('MODEL_UPDATE', [model, key, config[key]]);
      }
    }

    return config.item;
  }), _defineProperty(_apis, ACTIVE_MODEL_RESET, function (_ref3) {
    var commit = _ref3.commit;

    for (var _i3 = 0, _arr2 = ['id', 'active', 'item']; _i3 < _arr2.length; _i3++) {
      var key = _arr2[_i3];
      commit('MODEL_UPDATE', [model, key, undefined]);
    }
  }), _apis);
  return apis;
};

exports.ACTIVE = ACTIVE;

var RESTFUL = function RESTFUL(model, _ref4) {
  var state = _ref4.state,
      fetch = _ref4.fetch;
  var MODEL = model.toUpperCase();
  var opt = state[model].options;
  var apis = {};
  var actions = [{
    name: 'GET',
    method: 'GET'
  }, {
    name: 'MORE',
    method: 'GET'
  }, {
    name: 'POST',
    method: 'POST'
  }, {
    name: 'PUT',
    method: 'PUT'
  }, {
    name: 'DELETE',
    method: 'DELETE'
  }];

  var _loop = function _loop() {
    var action = _actions[_i4];
    var name = action.name,
        method = action.method;
    var path = "".concat(name, "_").concat(MODEL);

    apis[path] = function (_ref5) {
      var state = _ref5.state,
          dispatch = _ref5.dispatch,
          commit = _ref5.commit;
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      /**
       * @name 获取配置项目
       * @param {string} key [only, interact, debounce, throttle, silent, loading]
       * @param {string} method [GET, POST, PUT, DELETE]
       */
      var getRESTfulConfig = function getRESTfulConfig(key, method) {
        var infer = false;

        if (typeof key === 'string') {
          if (data[key]) {
            // 优先从 action 的 data 中获取
            infer = data[key];
          } else if (opt[method] && opt[method][key]) {
            // 否则从 model 的 options 中获取
            infer = opt[method][key];
          } else if (opt[key]) {
            infer = opt[key];
          } else if (_typeof(_main["default"].Options.RESTful) === 'object') {
            // 尝试在全局属性中获取
            if (_typeof(_main["default"].Options.RESTful[method]) === 'object' && _main["default"].Options.RESTful[method][key]) {
              infer = _main["default"].Options.RESTful[method][key];
            } else if (_main["default"].Options.RESTful[key]) {
              infer = _main["default"].Options.RESTful[key];
            }
          }

          if (infer === true && key === 'only') {
            infer = method; // only 特性
          }
        }

        return infer;
      }; // 自动填充路由参数，例如 /user/:id 等，默认从 paths 中获取，若获取不到则尝试从 params 中获取


      var paths = [];

      var _iterator = _createForOfIteratorHelper(opt.url.split('/')),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var route = _step.value;

          if (route[0] === ':') {
            var _key = route.substr(1);

            if (data.paths && data.paths[_key] != undefined) {
              paths.push(data.paths[_key]);
              delete data.paths[_key];
            } else if (data.params && data.params[_key] != undefined) {
              paths.push(data.params[_key]);
              delete data.params[_key];
            } else {
              console.warn('DGX RESTFUL - lose paths ' + _key);
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

      var fetchData = {
        method: method,
        model: model,
        url: data.id ? "".concat(paths.join('/'), "/").concat(data.id) : paths.join('/'),
        data: data.data || {},
        params: data.params || {},
        paths: data.paths || {},
        header: data.header || {},
        limit: getRESTfulConfig('limit', method) || {},
        // 请求限制
        only: getRESTfulConfig('only', method),
        // 是否是禁止重复请求
        silent: getRESTfulConfig('silent', method),
        // 是否静默加载
        loading: getRESTfulConfig('loading', method) // 是否显示加载中动画 （移动端）

      };

      if (_typeof(fetchData.limit) === 'object') {
        for (var key in fetchData.limit) {
          for (var _i5 = 0, _arr3 = ['params', 'paths', 'data']; _i5 < _arr3.length; _i5++) {
            var _name = _arr3[_i5];

            if (method === 'GET' && _name === 'params' || method !== 'GET' && _name === 'data' || _name === 'paths') {
              fetchData[_name][key] = fetchData.limit[key];
            }
          }
        }
      } // 加载更多时，自动区分 marker 模式与 page 模式


      if (name === 'MORE') {
        if (state[model].marker !== undefined) {
          fetchData.params.marker = state[model].marker;
        } else {
          fetchData.params.page = state[model].page + 1;
        }
      } // 数据联动


      var interactHandles = {
        GET: function GET(_ref6, res, config) {
          var commit = _ref6.commit,
              model = _ref6.model;
          var interact = getRESTfulConfig('interact', 'GET');

          if (config.id) {
            if (interact) {
              commit('MODEL_UPDATE', [model, 'id', res.result.id]);
              commit('MODEL_UPDATE', [model, 'item', res.result]); // new Item(res.result)
            }
          } else if (Array.isArray(res.result)) {
            if (interact) {
              if (name === 'MORE') {
                commit('MODEL_MORE', [model, 'list', res.result]); // new List(res.result)
              } else {
                commit('MODEL_UPDATE', [model, 'list', res.result]);
              }
            }

            commit('MODEL_UPDATE', [model, 'page', res.page]);
            commit('MODEL_UPDATE', [model, 'marker', res.marker !== undefined ? res.marker : undefined]);
            commit('MODEL_UPDATE', [model, 'count', res.count != undefined && res.count >= 0 ? res.count : undefined]);
            commit('MODEL_UPDATE', [model, 'total', res.total]);
            commit('MODEL_UPDATE', [model, 'empty', !!(res.page == 1 && !res.result.length)]);
            commit('MODEL_UPDATE', [model, 'more', res.page < res.total]);
            commit('MODEL_UPDATE', [model, 'filter', config.params ? _helper["default"].Origin(config.params) : {}]);
          } else if (interact) {
            commit('MODEL_UPDATE', [model, 'list', res.result || res]); // new List(res.result)

            commit('MODEL_UPDATE', [model, 'item', res.result || res]);
          }
        },
        POST: function POST(_ref7, res, config) {
          var state = _ref7.state,
              commit = _ref7.commit,
              model = _ref7.model;
          var interact = getRESTfulConfig('interact', 'POST');

          if (interact && res.result && res.result.id) {
            var position = 'end'; // 判定增加数据的位置

            if (_typeof(interact) === 'object' && interact.position) {
              position = interact.position;
            } else if (typeof interact === 'number' || ~['start', 'begin', 'head', 'end', 'finish', 'foot', 'last'].indexOf(interact)) {
              position = interact;
            }

            commit('MODEL_ADD', [model, 'list', new _class.Item(res.result), position]);

            if (state[model].count != undefined && state[model].count >= 0) {
              commit('MODEL_UPDATE', [model, 'count', state[model].count + 1]);
            } // 是否需要取消列表


            if (state[model].empty) {
              commit('MODEL_UPDATE', [model, 'empty', false]);
            }
          }
        },
        PUT: function PUT(_ref8, res, config) {
          var commit = _ref8.commit,
              model = _ref8.model;
          var interact = getRESTfulConfig('interact', 'PUT');

          if (interact && res.result && res.result.id) {
            commit('MODEL_ROW_EXTEND', [model, res.result]);
          }
        },
        DELETE: function DELETE(_ref9, res, config) {
          var state = _ref9.state,
              commit = _ref9.commit,
              model = _ref9.model;
          var interact = getRESTfulConfig('interact', 'DELETE');

          if (interact) {
            commit('MODEL_REMOVE', {
              base: model,
              id: config.id,
              key: 'list'
            });

            if (state[model].item && state[model].item.id === config.id) {
              commit('MODEL_UPDATE', [model, 'id', null]);
              commit('MODEL_UPDATE', [model, 'active', null]);
              commit('MODEL_UPDATE', [model, 'item', null]);
            } // 影响统计数


            if (state[model].count != undefined && state[model].count > 0) {
              commit('MODEL_UPDATE', [model, 'count', state[model].count - 1]);
            } // 是否需要触发空列表


            if (state[model].page === 1 && state[model].list.length === 0) {
              commit('MODEL_UPDATE', [model, 'empty', true]);
              commit('MODEL_UPDATE', [model, 'more', false]);
            }
          }
        }
      }; // fetch 主函数

      var fetchHandle = function fetchHandle(res) {
        if (res && res.result) {
          // 事件联动
          interactHandles[method]({
            state: state,
            dispatch: dispatch,
            commit: commit,
            model: model
          }, res, data);
        }

        if (data.active || data.active == 0) {
          dispatch("ACTIVE_".concat(MODEL), data.active);
        }

        return res;
      };

      return dispatch('FETCH', fetchData).then(function (res) {
        return fetchHandle(res);
      });
    };
  };

  for (var _i4 = 0, _actions = actions; _i4 < _actions.length; _i4++) {
    _loop();
  }

  return apis;
};

exports.RESTFUL = RESTFUL;
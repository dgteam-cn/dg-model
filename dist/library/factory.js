"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RESTFUL = exports.ACTIVE = void 0;

var _helper = _interopRequireDefault(require("@dgteam/helper"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var ACTIVE = function ACTIVE(model) {
  var _apis;

  var MODEL = model.toUpperCase();
  var ACTIVE_MODEL = "ACTIVE_".concat(MODEL);
  var ACTIVE_MODEL_CHANGE = "ACTIVE_".concat(MODEL, "_CHANGE");
  var ACTIVE_MODEL_RESET = "ACTIVE_".concat(MODEL, "_RESET");
  var apis = (_apis = {}, _defineProperty(_apis, ACTIVE_MODEL, function (_ref, active) {
    var state = _ref.state,
        dispatch = _ref.dispatch;

    if (_helper["default"].IsArray(active) && active[0]) {
      active = active[0];
    }

    if (active === undefined || active === null) {
      // 重置
      dispatch(ACTIVE_MODEL_RESET);
    } else if (_typeof(active) === "object") {
      // 以 对象条件 来确定焦点
      //let id = active.id
      var list = state[model].list;

      for (var o in active) {
        for (var i = 0; i < list.length; i++) {
          if (list[i][o] && list[i][o] == active[o]) {
            return dispatch(ACTIVE_MODEL_CHANGE, {
              id: list[i].id || undefined,
              active: i,
              item: list[i]
            });
          }
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
    var state = _ref2.state,
        dispatch = _ref2.dispatch,
        commit = _ref2.commit;
    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    for (var _i2 = 0, _arr = ['id', 'active', 'item']; _i2 < _arr.length; _i2++) {
      var key = _arr[_i2];

      if (config[key] || config[key] == 0) {
        commit('MODEL_UPDATE', [model, key, config[key]]);
      }
    }

    return config.item;
  }), _defineProperty(_apis, ACTIVE_MODEL_RESET, function (_ref3) {
    var state = _ref3.state,
        dispatch = _ref3.dispatch,
        commit = _ref3.commit;
    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

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

  var _loop = function _loop() {
    var action = _arr3[_i4];
    var name = action.name,
        method = action.method;
    var path = "".concat(name, "_").concat(MODEL);

    apis[path] = function (_ref5) {
      var state = _ref5.state,
          dispatch = _ref5.dispatch,
          commit = _ref5.commit;
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      // 自动填充路由参数，例如 /user/:id 等，默认从 paths 中获取，若获取不到则尝试从 params 中获取
      var paths = [];

      var _iterator = _createForOfIteratorHelper(opt.url.split('/')),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var route = _step.value;

          if (route[0] === ':') {
            var key = route.substr(1);

            if (data.paths && data.paths[key] != undefined) {
              paths.push(data.paths[key]);
              delete data.paths[key];
            } else if (data.params && data.params[key] != undefined) {
              paths.push(data.params[key]);
              delete data.params[key];
            } else {
              console.warn('[dgx] lose paths ' + key);
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
        url: data.id ? "".concat(paths.join('/'), "/").concat(data.id) : paths.join('/'),
        data: data.data || {},
        params: data.params,
        model: model,
        only: data.only !== undefined ? data.only : method === 'GET',
        silent: Boolean(data.silent),
        loading: data.loading
      };

      if (name === 'MORE') {
        fetchData.params.page = state[model].page + 1;
      }

      var fetchHandle = function fetchHandle(res) {
        if (res && res.result) {
          switch (method) {
            case 'GET':
              if (data.id) {
                commit('MODEL_UPDATE', [model, 'item', res.result.id]);
                commit('MODEL_UPDATE', [model, 'id', res.result.id]);
              } else if (Array.isArray(res.result)) {
                // 列表数据
                if (name === 'MORE') {
                  commit('MODEL_MORE', [model, 'list', res.result]);
                } else {
                  commit('MODEL_UPDATE', [model, 'list', res.result]);
                }

                commit('MODEL_UPDATE', [model, 'page', res.page]);
                commit('MODEL_UPDATE', [model, 'count', res.count != undefined && res.count >= 0 ? res.count : undefined]);
                commit('MODEL_UPDATE', [model, 'total', res.total]);
                commit('MODEL_UPDATE', [model, 'empty', res.page == 1 && !res.result.length ? true : false]);
                commit('MODEL_UPDATE', [model, 'more', res.page < res.total]);
              } else {
                // 特殊数据
                commit('MODEL_UPDATE', [model, 'list', res.result || res]);
                commit('MODEL_UPDATE', [model, 'item', res.result || res]);
              }

              break;

            case 'POST':
              if (state[model].count != undefined && state[model].count >= 0) {
                commit('MODEL_UPDATE', [model, 'count', state[model].count + 1]); // 影响统计数
              }

              break;

            case 'PUT':
              commit('MODEL_ROW_EXTEND', [model, res.result]);
              break;

            case 'DELETE':
              commit('MODEL_REMOVE', {
                base: model,
                id: data.id,
                key: 'list'
              });

              if (state[model].item && state[model].item.id === data.id) {
                commit('MODEL_UPDATE', [model, 'id', null]);
                commit('MODEL_UPDATE', [model, 'active', null]);
                commit('MODEL_UPDATE', [model, 'item', null]);
              }

              if (state[model].count != undefined && state[model].count > 0) {
                commit('MODEL_UPDATE', [model, 'count', state[model].count - 1]); // 影响统计数
              }

              break;

            default:
              break;
          }
        }

        if (data.active || data.active == 0) {
          dispatch("ACTIVE_".concat(MODEL), data.active);
        }

        return res;
      };

      var beforeRestful = opt.beforeRestful || fetch.beforeRestful;
      return dispatch('FETCH', fetchData).then( /*#__PURE__*/function () {
        var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(res) {
          var beforeRes;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  if (!beforeRestful) {
                    _context.next = 12;
                    break;
                  }

                  _context.next = 3;
                  return beforeRestful(res);

                case 3:
                  beforeRes = _context.sent;

                  if (!(beforeRes === undefined || beforeRes === true)) {
                    _context.next = 8;
                    break;
                  }

                  return _context.abrupt("return", fetchHandle(res));

                case 8:
                  if (!beforeRes) {
                    _context.next = 10;
                    break;
                  }

                  return _context.abrupt("return", fetchHandle(beforeRes));

                case 10:
                  _context.next = 13;
                  break;

                case 12:
                  return _context.abrupt("return", fetchHandle(res));

                case 13:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));

        return function (_x) {
          return _ref6.apply(this, arguments);
        };
      }(), function (err) {
        return err;
      });
    };
  };

  for (var _i4 = 0, _arr3 = [{
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
  }]; _i4 < _arr3.length; _i4++) {
    _loop();
  }

  return apis;
};

exports.RESTFUL = RESTFUL;
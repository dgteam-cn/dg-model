"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MODEL_RESET = exports.MODEL_REMOVE = exports.MODEL_ROW_EXTEND = exports.MODEL_UPDATE = exports.MODEL_MORE = exports.MODEL_ADD = exports.FETCH_UPDATE = exports.FETCH_CANCEL = exports.FETCH_REMOVE = void 0;

var _vue = _interopRequireDefault(require("vue"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// Fetch 数据移除
var FETCH_REMOVE = function FETCH_REMOVE(state) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [],
      _ref2 = _slicedToArray(_ref, 2),
      model = _ref2[0],
      index = _ref2[1];

  state[model].ajax.splice(index, 1);
}; // Fetch 取消请求


exports.FETCH_REMOVE = FETCH_REMOVE;

var FETCH_CANCEL = function FETCH_CANCEL(state) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var opt = Object.assign({
    model: undefined,
    only: undefined,
    id: undefined
  }, config);
  var models = opt.model ? opt.model : state.models;

  if (_typeof(models) != 'object') {
    models = [models];
  }

  var _iterator = _createForOfIteratorHelper(models),
      _step;

  try {
    finish: for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var m = _step.value;

      for (var i = 0; i < state[m].ajax.length; i++) {
        // 当存在 only 条件时且不满足 only 条件时候进行 break 操作
        if (opt.only !== undefined && opt.only != state[m].ajax[i].only) {
          break;
        } // 当存在 id 条件时且不满足 id 条件时候进行 break 操作


        if (opt.id !== undefined && opt.id != state[m].ajax[i].id) {
          break;
        } // 剩余为满足取消条件


        state[m].ajax[i].cancel();
        state[m].ajax.splice(i, 1);
        break finish;
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
}; // Fetch 数据更新


exports.FETCH_CANCEL = FETCH_CANCEL;

var FETCH_UPDATE = function FETCH_UPDATE(state) {
  var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [],
      _ref4 = _slicedToArray(_ref3, 1),
      model = _ref4[0];

  var loading = 0;
  var editing = 0;

  var _iterator2 = _createForOfIteratorHelper(state[model].ajax),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var fetch = _step2.value;

      if (fetch.method) {
        var method = fetch.method.toUpperCase();

        if (method === 'GET') {
          loading += 1;
        } else if (~['POST', 'PUT', 'DELETE'].indexOf(method)) {
          editing += 1;
        }
      }
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }

  _vue["default"].set(state[model], 'loading', loading);

  _vue["default"].set(state[model], 'editing', editing);
};

exports.FETCH_UPDATE = FETCH_UPDATE;

var MODEL_ADD = function MODEL_ADD(state) {
  var _ref5 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [],
      _ref6 = _slicedToArray(_ref5, 4),
      model = _ref6[0],
      _ref6$ = _ref6[1],
      key = _ref6$ === void 0 ? 'ajax' : _ref6$,
      value = _ref6[2],
      _ref6$2 = _ref6[3],
      position = _ref6$2 === void 0 ? -1 : _ref6$2;

  if (typeof position === 'string') {
    if (~['start', 'begin', 'head'].indexOf(position)) {
      position = 0;
    } else if (~['end', 'finish', 'foot', 'last'].indexOf(position)) {
      position = -1;
    } else {
      position = parseInt(position);
    }
  }

  if (position === 0) {
    state[model][key].unshift(value);
  } else if (position === -1) {
    state[model][key].push(value);
  } else if (Number.isInteger(position)) {
    state[model][key].splice(position, 0, value);
  }
};

exports.MODEL_ADD = MODEL_ADD;

var MODEL_MORE = function MODEL_MORE(state, _ref7) {
  var _ref8 = _slicedToArray(_ref7, 3),
      model = _ref8[0],
      _ref8$ = _ref8[1],
      key = _ref8$ === void 0 ? 'list' : _ref8$,
      value = _ref8[2];

  if (Array.isArray(value)) {
    var _iterator3 = _createForOfIteratorHelper(value),
        _step3;

    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var item = _step3.value;
        state[model][key].push(item);
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
  }
};

exports.MODEL_MORE = MODEL_MORE;

var MODEL_REMOVE = function MODEL_REMOVE(state, _ref9) {
  var base = _ref9.base,
      key = _ref9.key,
      id = _ref9.id,
      index = _ref9.index;

  if (id) {
    var list = state[base][key];

    for (var i = 0; i < list.length; i++) {
      if (list[i].id == id) {
        state[base][key].splice(i, 1);
        break;
      }
    }
  } else if (index || index == 0) {
    state[base][key].splice(index, 1);
  } else {
    delete state[base][key];
  }
};

exports.MODEL_REMOVE = MODEL_REMOVE;

var MODEL_RESET = function MODEL_RESET(state, model) {
  if (model && state[model] && state[model].reset) {
    var reset = Object.assign({}, state[model].reset);
    state[model] = Object.assign({}, reset);
    state[model].reset = Object.assign({}, reset);
  }
};

exports.MODEL_RESET = MODEL_RESET;

var MODEL_UPDATE = function MODEL_UPDATE(state) {
  var _ref10 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [],
      _ref11 = _slicedToArray(_ref10, 3),
      model = _ref11[0],
      _ref11$ = _ref11[1],
      key = _ref11$ === void 0 ? 'list' : _ref11$,
      value = _ref11[2];

  if (_typeof(key) === 'object') {
    for (var k in key) {
      _vue["default"].set(state[model], k, key[k]);
    }
  } else {
    _vue["default"].set(state[model], key, value);
  }
};

exports.MODEL_UPDATE = MODEL_UPDATE;

var MODEL_ROW_EXTEND = function MODEL_ROW_EXTEND(state) {
  var _ref12 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [],
      _ref13 = _slicedToArray(_ref12, 3),
      model = _ref13[0],
      item = _ref13[1],
      relation = _ref13[2];

  try {
    if (item.id) {
      var _iterator4 = _createForOfIteratorHelper(state[model].list),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var _row = _step4.value;

          // if(relation && item[relation]){
          //     for(let sub of item[relation]){
          //         if(sub.id && sub.id === data.id){
          //             console.log('MODEL_ROW_EXTEND',item)
          //             Object.assign(sub,data)
          //         }
          //     }
          // }else
          if (_row.id && _row.id === item.id) {
            Object.assign(_row, item);
          }
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }

      if (state[model].item) {
        var row = state[model].item;

        if (row.id && row.id === data.id) {
          Object.assign(row, item);
        }
      }
    }
  } catch (error) {
    console.info("dgx error", error);
  }
};

exports.MODEL_ROW_EXTEND = MODEL_ROW_EXTEND;
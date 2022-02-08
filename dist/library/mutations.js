"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TABLE_ROW_REMOVE = exports.TABLE_ROW_EXTEND = exports.TABLE_ROWS_MERGE = exports.TABLE_ROWS_JOIN = exports.TABLE_RESET = exports.TABLE_UPDATE = exports.FETCH_CHECK = exports.FETCH_REMOVE = exports.FETCH_UPDATE = exports.FETCH_JOIN = void 0;

var _main = require("./main.js");

var _helper = _interopRequireDefault(require("../helper"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// ==================== 请求器 ====================
// Fetch 加入
var FETCH_JOIN = function FETCH_JOIN(state) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [],
      _ref2 = _slicedToArray(_ref, 2),
      table = _ref2[0],
      ajax = _ref2[1];

  // state._models.ajax.push(ajax) // 2021-12-29 暂时取消该功能
  if (table && state[table] && state[table].ajax) {
    state[table].ajax.push(ajax);
  }
}; // Fetch 数据移除


exports.FETCH_JOIN = FETCH_JOIN;

var FETCH_REMOVE = function FETCH_REMOVE(state) {
  var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [],
      _ref4 = _slicedToArray(_ref3, 2),
      table = _ref4[0],
      index = _ref4[1];

  if (table && state[table] && state[table].ajax) {
    state[table].ajax.splice(index, 1); // index 索引是由 FETCH_FINISH 去计算的
  }
}; // Fetch 数据更新


exports.FETCH_REMOVE = FETCH_REMOVE;

var FETCH_UPDATE = function FETCH_UPDATE(state) {
  var _ref5 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [],
      _ref6 = _slicedToArray(_ref5, 2),
      table = _ref6[0],
      fetch = _ref6[1];

  if (table && state[table] && state[table].ajax && fetch && fetch.id) {
    var instance = state[table].ajax.find(function (item) {
      return item.id === fetch.id;
    });

    if (instance) {
      for (var key in fetch) {
        _main.Model.dataSet(instance, key, fetch[key]);
      }
    }
  }
}; // Fetch 数据统计核查更新


exports.FETCH_UPDATE = FETCH_UPDATE;

var FETCH_CHECK = function FETCH_CHECK(state, table) {
  if (table && state[table] && state[table].ajax) {
    var loading = 0,
        editing = 0;

    var _iterator = _createForOfIteratorHelper(state[table].ajax),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var fetch = _step.value;

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
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    _main.Model.dataSet(state[table], 'loading', loading);

    _main.Model.dataSet(state[table], 'editing', editing);
  }
}; // ==================== 表字段 ====================
// 表字段更新


exports.FETCH_CHECK = FETCH_CHECK;

var TABLE_UPDATE = function TABLE_UPDATE(state) {
  var _ref7 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [],
      _ref8 = _slicedToArray(_ref7, 3),
      table = _ref8[0],
      _ref8$ = _ref8[1],
      key = _ref8$ === void 0 ? 'list' : _ref8$,
      value = _ref8[2];

  if (table && _typeof(state[table]) === 'object') {
    if (typeof key === 'string') {
      _main.Model.dataSet(state[table], key, value);
    } else if (_typeof(key) === 'object' && key !== null) {
      for (var k in key) {
        _main.Model.dataSet(state[table], k, key[k]);
      }
    }
  }
}; // 表属性重置


exports.TABLE_UPDATE = TABLE_UPDATE;

var TABLE_RESET = function TABLE_RESET(state, table) {
  var tables = Array.isArray(table) ? table : [table];
  tables.forEach(function (name) {
    if (name && state[name] && _helper["default"].instance(state[name], _main.Table)) {
      var reset = Object.assign({}, state[name].reset);

      for (var key in reset) {
        _main.Model.dataSet(state[name], key, reset[key]); // 2021-12-23 v0.4 部分新增的自定义字段不会被重置，仅重置初始字段

      }
    }
  });
}; // // ==================== 行字段 ====================

/**
 * 添加 row 数据到 table.list
 * @param {Object} state - vuex state
 * @param {String} agrs[table] - 表名称
 * @param {Object} agrs[row] - 行数据
 * @param {Number|String} agrs[position] = 添加位置
 */


exports.TABLE_RESET = TABLE_RESET;

var TABLE_ROWS_JOIN = function TABLE_ROWS_JOIN(state) {
  var _ref9 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [],
      _ref10 = _slicedToArray(_ref9, 3),
      table = _ref10[0],
      row = _ref10[1],
      _ref10$ = _ref10[2],
      position = _ref10$ === void 0 ? -1 : _ref10$;

  if (typeof position === 'string') {
    if (~['start', 'begin', 'head'].indexOf(position)) {
      position = 0;
    } else if (~['end', 'foot', 'last'].indexOf(position)) {
      position = -1;
    } else {
      position = parseInt(position);
    }
  }

  if (position === 0) {
    state[table].list.unshift(row);
  } else if (position === -1) {
    state[table].list.push(row);
  } else if (Number.isInteger(position)) {
    state[table].list.splice(position, 0, row);
  }
};
/**
 * 合并 row 数据到 table.list
 * @param {Object} state - vuex state
 * @param {String} agrs[table] - 表名称
 * @param {Array<Row>} agrs[list] - 表名称
 */


exports.TABLE_ROWS_JOIN = TABLE_ROWS_JOIN;

var TABLE_ROWS_MERGE = function TABLE_ROWS_MERGE(state, _ref11) {
  var _ref12 = _slicedToArray(_ref11, 2),
      table = _ref12[0],
      list = _ref12[1];

  if (_helper["default"].isArray(list)) {
    var _iterator2 = _createForOfIteratorHelper(list),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var row = _step2.value;
        state[table].list.push(row);
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
  }
};
/**
 * 行数据更新（覆盖）
 */
// TODO 应该不同数据模型可以设置不同 primaryKey


exports.TABLE_ROWS_MERGE = TABLE_ROWS_MERGE;

var TABLE_ROW_EXTEND = function TABLE_ROW_EXTEND(state) {
  var _ref13 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [],
      _ref14 = _slicedToArray(_ref13, 2),
      table = _ref14[0],
      item = _ref14[1];

  try {
    var primaryKey = _main.Model.primaryKey;

    if (item[primaryKey]) {
      var _iterator3 = _createForOfIteratorHelper(state[table].list),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var _row = _step3.value;

          if (_row[primaryKey] && _row[primaryKey] === item[primaryKey]) {
            Object.assign(_row, item);
          }
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }

      if (state[table].item) {
        var row = state[table].item;

        if (row[primaryKey] && row[primaryKey] === item[primaryKey]) {
          Object.assign(row, item);
        }
      }
    }
  } catch (error) {
    _helper["default"].consoleWarn("dgx error", error);
  }
};
/**
 * 行数据移除
 */
// TODO 应该不同数据模型可以设置不同 primaryKey


exports.TABLE_ROW_EXTEND = TABLE_ROW_EXTEND;

var TABLE_ROW_REMOVE = function TABLE_ROW_REMOVE(state, _ref15) {
  var _ref16 = _slicedToArray(_ref15, 2),
      table = _ref16[0],
      id = _ref16[1];

  var primaryKey = _main.Model.primaryKey;
  var index = id ? state[table].list.findIndex(function (item) {
    return item[primaryKey] === id;
  }) : undefined;
  if (index >= 0) state[table].list.splice(index, 1);
};

exports.TABLE_ROW_REMOVE = TABLE_ROW_REMOVE;
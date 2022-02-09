"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RESTFUL = exports.ACTIVE = void 0;

var _helper = _interopRequireDefault(require("../helper"));

var _main = require("./main.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

// import {debounce, throttle} from '/dist/lodash.js'
var ACTIVE = function ACTIVE(table) {
  var _apis;

  var TABLE = table.toUpperCase();
  var ACTIVE_TABLE = "ACTIVE_".concat(TABLE);
  var ACTIVE_TABLE_CHANGE = "ACTIVE_".concat(TABLE, "_CHANGE");
  var ACTIVE_TABLE_RESET = "ACTIVE_".concat(TABLE, "_RESET");
  var apis = (_apis = {}, _defineProperty(_apis, ACTIVE_TABLE, function (_ref, active) {
    var state = _ref.state,
        dispatch = _ref.dispatch;

    if (_helper["default"].isArray(active) && active[0]) {
      active = active[0];
    }

    if (active === undefined || active === null) {
      // 重置
      dispatch(ACTIVE_TABLE_RESET);
    } else if (_typeof(active) === "object") {
      // 以 对象条件 来确定焦点
      var item = active;
      var list = state[table].list;
      var primaryKey = _main.Model.primaryKey;

      for (var i = 0; i < list.length; i++) {
        if (item[primaryKey] && list[i][primaryKey] && list[i][primaryKey] === item[primaryKey]) {
          var _dispatch;

          return dispatch(ACTIVE_TABLE_CHANGE, (_dispatch = {}, _defineProperty(_dispatch, primaryKey, list[i][primaryKey] || undefined), _defineProperty(_dispatch, "active", i), _defineProperty(_dispatch, "item", list[i]), _dispatch));
        }
      }
    } else {
      // 以索引来确定焦点，（ -1 = 选择数组的最后一个）
      if (active == -1) {
        active = state[table].list.length > 0 ? state[table].list.length - 1 : 0;
      } // 如果焦点不存在则默认使用原焦点，如果原焦点不存在则默认使用 0


      var queue = [active, state[table].active, 0];

      for (var _i = 0; _i < queue.length; _i++) {
        if (state[table].list[queue[_i]]) {
          active = queue[_i];
          break;
        }
      } // 如果列表存在键值


      if (state[table].list && state[table].list[active]) {
        var _dispatch2;

        var _primaryKey = _main.Model.primaryKey;
        return dispatch(ACTIVE_TABLE_CHANGE, (_dispatch2 = {}, _defineProperty(_dispatch2, _primaryKey, state[table].list[active][_primaryKey]), _defineProperty(_dispatch2, "active", active), _defineProperty(_dispatch2, "item", state[table].list[active]), _dispatch2));
      }

      dispatch(ACTIVE_TABLE_RESET);
    }
  }), _defineProperty(_apis, ACTIVE_TABLE_CHANGE, function (_ref2) {
    var commit = _ref2.commit;
    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    for (var _i2 = 0, _arr = ['active', 'item']; _i2 < _arr.length; _i2++) {
      var key = _arr[_i2];

      if (config[key] || config[key] == 0) {
        commit('TABLE_UPDATE', [table, key, config[key]]);
      }
    }

    return config.item;
  }), _defineProperty(_apis, ACTIVE_TABLE_RESET, function (_ref3) {
    var commit = _ref3.commit;

    for (var _i3 = 0, _arr2 = ['active', 'item']; _i3 < _arr2.length; _i3++) {
      var key = _arr2[_i3];
      commit('TABLE_UPDATE', [table, key, undefined]);
    }
  }), _apis);
  return apis;
};

exports.ACTIVE = ACTIVE;

var RESTFUL = function RESTFUL(table, _ref4) {
  var state = _ref4.state;
  var TABLE = table.toUpperCase();
  var opt = state[table].options;
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
    name: 'PATCH',
    method: 'PATCH'
  }, {
    name: 'DELETE',
    method: 'DELETE'
  }];

  var _loop = function _loop() {
    var action = _actions[_i4];
    var name = action.name,
        method = action.method;
    var path = "".concat(name, "_").concat(TABLE);

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
        var result = false;

        if (typeof key === 'string') {
          if (data[key]) {
            // #1 - 优先从 action 的 fetchData 中获取
            result = data[key];
          } else if (opt[method] && opt[method][key]) {
            // #2 否则从 Table 的 options 中获取
            result = opt[method][key];
          } else if (_typeof(_main.Model.config) === 'object') {
            // #3 最终尝试在 Model 的静态属性 config 中获取
            if (_typeof(_main.Model.config[method]) === 'object' && _main.Model.config[method][key]) {
              result = _main.Model.config[method][key];
            }
          }

          if (result === true && key === 'only') {
            result = method; // only 特性，如果未传 onlyKey 则自动指定 method 字段为 onlyKey
          }
        }

        return result;
      }; // 封装 fetch 数据


      var fetchData = {
        method: method,
        table: table,
        // url: data.id ? `${paths.join('/')}/${data.id}` : paths.join('/'),
        url: "".concat(opt.url).concat(data.id ? '/' + data.id : ''),
        data: data.data || {},
        // 请求体
        params: data.params || {},
        // url 参数
        paths: data.paths || {},
        // url path 参数
        header: data.header || {},
        // 请求头
        limit: getRESTfulConfig('limit', method) || {},
        // 请求限制
        only: getRESTfulConfig('only', method),
        // 是否是禁止重复请求
        silent: getRESTfulConfig('silent', method),
        // 是否静默加载
        loading: getRESTfulConfig('loading', method),
        // 是否显示加载中动画 （移动端）
        customData: getRESTfulConfig('customData', method) // 自定义对象

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
        if (state[table].marker !== undefined) {
          fetchData.params.marker = state[table].marker;
        } else {
          fetchData.params.page = state[table].page + 1;
        }
      } // 封装 vuex 方法方便之后的 table 操作调用


      var tableCtrl = {
        update: function update(key, value) {
          return commit('TABLE_UPDATE', [table, key, value]);
        },
        // 更新 table 的属性
        rows: {
          add: function add(item, position) {
            return commit('TABLE_ROWS_JOIN', [table, item, position]);
          },
          // 新增 row 到 table.list
          update: function update(item) {
            return commit('TABLE_ROW_EXTEND', [table, item]);
          },
          // 更新 row 到 table.list
          merge: function merge(list) {
            return commit('TABLE_ROWS_MERGE', [table, list]);
          },
          // 合并 rows 到 table.list
          remove: function remove(id) {
            // 移除 row 到 table.list
            if (id && _typeof(id) === 'object') {
              try {
                id = id[_main.Model.primaryKey]; // 兼容对象写法
              } catch (e) {}
            }

            commit('TABLE_ROW_REMOVE', [table, id]);
          }
        }
      }; // 数据联动

      var interactHandles = {
        GET: function GET(opt, res, config) {
          var interact = getRESTfulConfig('interact', 'GET');
          if (config.primaryKey && !config.id) config.id = config.primaryKey;

          if (config.id) {
            if (interact) {
              // TODO 此方式无法触发 model.active 字段
              tableCtrl.update('item', res.result);
            }
          } else if (Array.isArray(res.result)) {
            if (interact) {
              if (name === 'MORE') {
                tableCtrl.merge(res.result);
              } else {
                tableCtrl.update('list', res.result);
              }
            }

            var page = res.page || config.params && config.params.page || 1;
            var marker = res.marker !== undefined ? res.marker : undefined;
            var count = res.count != undefined && res.count >= 0 ? Number(res.count) : undefined;
            var total = res.total; // TODO 如果 total 不传但是有 count & size 值，那么应该手动计算 total 值

            var empty = !!(res.page == 1 && !res.result.length);
            var more = res.page < res.total;
            var filter = config.params ? _helper["default"].originJSON(config.params) : {};
            tableCtrl.update({
              page: page,
              marker: marker,
              count: count,
              total: total,
              empty: empty,
              more: more,
              filter: filter
            });
          } else if (interact) {
            tableCtrl.update('list', res.result || res);
          }
        },
        POST: function POST(_ref6, res) {
          var state = _ref6.state,
              table = _ref6.table;
          var interact = getRESTfulConfig('interact', 'POST');
          var primaryKey = _main.Model.primaryKey;

          if (interact && res.result && res.result[primaryKey]) {
            var position = 'end'; // 判定增加数据的位置

            if (_typeof(interact) === 'object' && interact.position) {
              position = interact.position;
            } else if (typeof interact === 'number' || ~['start', 'begin', 'head', 'end', 'finish', 'foot', 'last'].indexOf(interact)) {
              position = interact;
            }

            tableCtrl.rows.add(res.result, position);

            if (state[table].count != undefined && state[table].count >= 0) {
              tableCtrl.update('count', state[table].count + 1); // commit('TABLE_UPDATE', [model, 'count', state[model].count + 1])
            }

            if (state[table].empty) {
              tableCtrl.update('empty', false); // 判断是否已经脱离 “空列表” 状态 commit('TABLE_UPDATE', [model, 'empty', false])
            }
          }
        },
        PUT: function PUT(opt, res) {
          var interact = getRESTfulConfig('interact', 'PUT');
          var primaryKey = _main.Model.primaryKey;

          if (interact && res.result && res.result[primaryKey]) {
            tableCtrl.rows.update(res.result);
          }
        },
        DELETE: function DELETE(_ref7, res, config) {
          var state = _ref7.state,
              table = _ref7.table;
          var interact = getRESTfulConfig('interact', 'DELETE');

          if (interact) {
            var primaryKey = _main.Model.primaryKey;
            tableCtrl.rows.remove(config.id);

            if (state[table].item && state[table].item[primaryKey] === config.id) {
              tableCtrl.update({
                active: null,
                item: null
              });
            } // 影响统计数


            if (state[table].count != undefined && state[table].count > 0) {
              tableCtrl.update({
                count: state[table].count - 1
              });
            }

            if (state[table].page === 1 && state[table].list.length === 0) {
              tableCtrl.update({
                empty: true,
                more: false
              }); // 判断是否需要触发 “空列表” 状态
            }
          }
        }
      };
      interactHandles.PATCH = interactHandles.PUT; // patch 语法糖
      // fetch 主函数

      var fetchHandle = function fetchHandle(res) {
        if (res && res.result) {
          // 事件联动
          interactHandles[method]({
            state: state,
            dispatch: dispatch,
            commit: commit,
            table: table
          }, res, data);
        }

        if (data.active || data.active == 0) {
          dispatch("ACTIVE_".concat(TABLE), data.active);
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
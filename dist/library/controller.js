"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _main = require("./main.js");

var _helper = _interopRequireDefault(require("../helper"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var TableDescription = function TableDescription(data) {
  for (var key in data) {
    this[key] = data[key];
  }

  return this;
};

var TableController = function TableController() {};
/**
 * @param {Number} page - 列表页码，默认: 1
 * @param {String} path - 模型路径，不传则默认从 this.store 中获取
 * @param {Object} filter - 过滤器（筛选参数），不传则默认从 this.Filter 中获取
 * @param {Object} opt - 参数集，会传递到 FETCH 方法中，可见相关参数说明
 * @param {Boolean} opt.clean - 请求前是否先清空模型 list 数据
 * @param {any} opt[key] - 其他参数会保留并传递给其他中间件
 * @returns {Promise}
 */


TableController.prototype.get = function (page, path, filter) {
  var opt = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  if (typeof page === 'string' || _typeof(page) === 'object') {
    filter = path;
    path = page;
    page = 1;
  }

  var params = _helper["default"].originJSON((_typeof(filter) === 'object' ? filter : this.Filter) || {});

  params.page = page ? page : 1;

  if (_typeof(opt) === 'object' && opt.clean) {
    var _this$__modelFormat = this.__modelFormat(path, 'get'),
        model = _this$__modelFormat.model,
        table = _this$__modelFormat.table;

    this.__commit("".concat(model).concat(model ? '/' : '', "TABLE_RESET"), table);
  }

  return this.__dispatch(this.__modelFormat(path, 'get'), _objectSpread(_objectSpread({}, opt), {}, {
    params: params
  }));
};
/**
 * 初始化数据
 * @overview 初始化列表，此方法初始化过一次后便不会重复拉取请求，一般用于拉取固定数据
 * @param {string} path - 模型路径，不传则默认从 this.store 中获取
 * @param {object} filter - 筛选参数，默认没有 page 参数，若有 page 的需求可以在此对象中传递
 * @param {object} opt - 参数集，会传递到 Fetch 方法中
 * @param {number} opt.cache - 缓存时间，秒为单位，超时后会强制重新来去
 * @param {boolean} opt.strict - 严格的，将会比对 filter 条件，如果不同将会触发重新来去
 * @param {boolean} opt.immediate - 立即执行，强制重新拉取
 * @param {boolean} opt.clean - 触发请求前清空源列表（若判断读取缓存，该参数无效）
 * @returns {Promise}
 */


TableController.prototype.getInit = function (path) {
  var _this = this;

  var filter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var opt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var cache = opt.cache,
      strict = opt.strict,
      immediate = opt.immediate,
      clean = opt.clean;

  var info = this.__modelFormat(path, 'get');

  var instance = this.__getTableInstance(info.path);

  var needFetch = !instance.init || Boolean(immediate);
  if (_typeof(filter) !== 'object') filter = {};

  var fetchHandle = function fetchHandle() {
    if (clean) _this.__commit("".concat(info.model).concat(info.model ? '/' : '', "TABLE_RESET"), info.table); // 清理模型

    return _this.__dispatch(info.action_path_full, _objectSpread(_objectSpread({}, opt), {}, {
      params: filter
    })).then(function (res) {
      if (!res.err) {
        var update = _this.Time ? _this.Time(new Date(), 'yyyy/MM/dd hh:mm:ss') : new Date(); // TODO Time 方法替换

        _this.__commit("".concat(info.model).concat(info.model ? '/' : '', "TABLE_UPDATE"), [info.table, 'update', update]); // 把本次请求的时间戳记录起来，便以判断是否缓存超时


        return _objectSpread(_objectSpread({}, res), {}, {
          filter: filter,
          fetch: true
        });
      }

      return _objectSpread(_objectSpread({}, res), {}, {
        result: [],
        filter: filter,
        fetch: true
      });
    });
  };

  if (instance.list.length === 0) {
    needFetch = true; // 如果列表为空表示则缓存无效
  } else if (typeof cache === 'number' && instance.update && !needFetch) {
    // 判断是否缓存超时需要重新拉取
    var update = new Date(instance.update).getTime();
    var expire = update + cache * 1000;
    needFetch = Date.now() > expire; // 如果 当前时间 > 到期时间 需要重新加载
  } else if (strict) {
    // 如果是严格的，需要坚持筛选条件
    try {
      needFetch = JSON.stringify(instance.filter) !== JSON.stringify(filter);
    } catch (err) {
      _helper["default"].consoleWarn('GetInit: filter is invalid.');
    }
  }

  return needFetch ? fetchHandle() : Promise.resolve({
    err: 0,
    msg: '',
    result: instance.list,
    filter: instance.filter,
    fetch: false
  });
};
/**
 * 重新加载列表数据
 */


TableController.prototype.getFilter = function (path, filter) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      _ref$clean = _ref.clean,
      clean = _ref$clean === void 0 ? true : _ref$clean,
      _ref$loading = _ref.loading,
      loading = _ref$loading === void 0 ? false : _ref$loading;

  return this.get(1, path, filter, {
    clean: clean,
    loading: loading
  });
};
/**
 * 加载单行数据
 * @overview 通过主键拉取单行数据，如果拉取成功会联动触发 this.Active(item) 方法
 * @param {number} primaryKey - 数据主键值
 * @param {string} path - 模型路径，不传则默认从 this.store 中获取
 * @param {object} params - 筛选参数
 * @param {object} opt - 参数集，会传递到 Fetch 方法中
 * @returns {Promise}
 */


TableController.prototype.getItem = function (primaryKey, path) {
  var _objectSpread2;

  var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var opt = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  if (_typeof(primaryKey) === 'object') {
    primaryKey = primaryKey[_main.Model.primaryKey];
  }

  return this.__dispatch(this.__modelFormat(path, 'get'), _objectSpread(_objectSpread({}, opt), {}, (_objectSpread2 = {}, _defineProperty(_objectSpread2, _main.Model.primaryKey, primaryKey), _defineProperty(_objectSpread2, "params", params), _objectSpread2)));
};
/**
 * 加载更多数据
 * @overview 一般用在移动端的 "触底加载" 的效果，拉取的数据会连接上一页的列表
 * @param {string} path - 模型路径，不传则默认从 this.store 中获取
 * @param {object} filter - 过滤器（筛选参数），不传则默认从 this.Filter 中获取
 * @param {object} opt - 参数集，会传递到 Fetch 方法中
 * @returns {Promise}
 */


TableController.prototype.getMore = function (path, filter, opt) {
  var info = this.__modelFormat(path, 'more');

  var instance = this.__getTableInstance(info.path);

  if (instance) {
    var init = instance.init,
        loading = instance.loading,
        more = instance.more,
        empty = instance.empty;

    if (init && !loading && more && !empty) {
      var params = _helper["default"].originJSON(_typeof(filter) === 'object' ? filter : this.Filter) || {};
      return this.__dispatch(info.action_path_full, _objectSpread(_objectSpread({}, opt), {}, {
        params: params
      }));
    }
  }

  return Promise.resolve(null);
};
/**
 * 模型动作
 * @param {string} name - 动作名称，会自动转换为大写字母
 * @param {string} path - 模型路径，不传则默认从 this.store 中获取
 * @param {object} opt - 参数集，会传递到 Fetch 方法中
 * @returns {Promise}
 */


TableController.prototype.action = function () {
  var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'POST';
  var path = arguments.length > 1 ? arguments[1] : undefined;
  var opt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return this.__dispatch(this.__modelFormat(path, name), opt);
};
/**
 * 设为焦点
 * @param {object} item - 被设为焦点的实例
 * @param {string} path - 模型路径，不传则默认从 this.store 中获取
 * @returns {Promise}
 */


TableController.prototype.activeRow = function (item, path) {
  return this.__dispatch(this.__modelFormat(path, 'active'), item);
};
/**
 * 模型更新
 * @param {object} item - 模型 row 实例，必须要包含主键
 * @param {function} path - 模型路径，不传则默认从 this.store 中获取
 */


TableController.prototype.updateRow = function () {
  var item = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var path = arguments.length > 1 ? arguments[1] : undefined;

  var _this$__modelFormat2 = this.__modelFormat(path, 'get'),
      model = _this$__modelFormat2.model,
      table = _this$__modelFormat2.table;

  return this.__commit("".concat(model).concat(model ? '/' : '', "TABLE_ROW_EXTEND"), [table, item]);
};
/**
 * 提交数据行
 * 0.4+ 版本开始取消 callback 参数，需要自行实现
 * @param {object} data - 提交数据，不传则默认从 this.Params 中获取
 * @param {string} path - 模型路径，不传则默认从 this.store 中获取
 * @param {object} opt - 附加参数
 * @returns {Promise}
 */


TableController.prototype.post = function (data, path) {
  var opt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  if (data === undefined || data === null || typeof data.preventDefault === 'function') data = _helper["default"].originJSON(this.Params || {});
  return this.__dispatch(this.__modelFormat(path, 'post'), _objectSpread(_objectSpread({}, opt), {}, {
    data: data
  }));
};
/**
 * 修改数据行
 * 0.4+ 版本开始取消 callback 参数，需要自行实现
 * @param {object} data - 提交数据，不传则默认从 this.Params 中获取
 * @param {string} path - 模型路径，不传则默认从 this.store 中获取
 * @param {object} opt - 附加参数
 * @returns {Promise}
 */


TableController.prototype.put = function (data, path) {
  var _objectSpread3;

  var opt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  if (data === undefined || data === null || typeof data.preventDefault === 'function') data = _helper["default"].originJSON(this.Params || {});
  return this.__dispatch(this.__modelFormat(path, 'put'), _objectSpread(_objectSpread({}, opt), {}, (_objectSpread3 = {}, _defineProperty(_objectSpread3, _main.Model.primaryKey, data[_main.Model.primaryKey]), _defineProperty(_objectSpread3, "data", data), _objectSpread3)));
};
/**
 * 提交表单
 * 自动从 this.Params 拉取数据，根据是否有主键判断是新增还是修改
 * @param {object} data - 提交数据，不传则默认从 this.Params 中获取
 * @param {string} path - 模型路径，不传则默认从 this.store 中获取
 * @param {object} opt - 参数集
 * @param {object} opt.callback - 回调函数
 * @returns {Promise}
 */


TableController.prototype.submit = function (data, path, opt) {
  if (data === undefined || data === null || typeof data.preventDefault === 'function') data = _helper["default"].originJSON(this.Params || {});
  return data[_main.Model.primaryKey] ? this.put(data, path, opt) : this.post(data, path, opt);
};
/**
 * 删除数据行
 * 0.4+ 版本开始取消 callback、confirm 参数，需要自行实现
 * @param {object} data - 提交数据，不传则默认从 this.Params 中获取
 * @param {string} path - 模型路径，不传则默认从 this.store 中获取
 * @param {object} opt - 参数集
 * @returns {Promise}
 */


TableController.prototype["delete"] = function (data, path, opt) {
  var _objectSpread4;

  if (data === undefined || data === null || typeof data.preventDefault === 'function') data = _helper["default"].originJSON(this.Params || {});
  if (~['string', 'number'].indexOf(_typeof(data))) data = _defineProperty({}, _main.Model.primaryKey, data);
  return this.__dispatch(this.__modelFormat(path, 'delete'), _objectSpread(_objectSpread({}, opt), {}, (_objectSpread4 = {}, _defineProperty(_objectSpread4, _main.Model.primaryKey, data[_main.Model.primaryKey]), _defineProperty(_objectSpread4, "data", data), _objectSpread4)));
};
/**
 * 模型清理（重置）
 * @param {function} path - 模型路径，不传则默认从 this.store 中获取
 */


TableController.prototype.resetTable = function (path) {
  var _this$__modelFormat3 = this.__modelFormat(path, 'get'),
      model = _this$__modelFormat3.model,
      table = _this$__modelFormat3.table;

  return this.__commit("".concat(model).concat(model ? '/' : '', "TABLE_RESET"), table);
}; // ==================================== 内部方法 ====================================

/**
 * 执行 vuex 动作
 * @overview this.$store.dispatch 的语法糖，会自动格式化 paths
 * @param {string} [path] - 模型路径
 * @param {object} [data] - 提交数据
 * @returns {Promise}
 */


TableController.prototype.__dispatch = function (path, data) {
  return _main.Model.store.dispatch(this.__modelFormat(path).action_path_full, data);
};
/**
 * 执行 vuex 突变
 * @overview this.$store.commit 的语法糖，会自动格式化 paths
 * @param {string} [path] - 模型路径
 * @param {object} [data] - 提交数据
 */


TableController.prototype.__commit = function (path, data) {
  return _main.Model.store.commit(this.__modelFormat(path).action_path_full, data);
};
/**
 * 格式化模型
 * @overview 框架内方法，业务层无需使用
 * @param {string} [path] - 模型路径
 * @param {string} [action] - 执行动作
 */


TableController.prototype.__modelFormat = function (paths) {
  var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  if (!paths) {
    if (this.__path__) {
      paths = this.__path__; // 仅在 TableProxy 中有效
    } else {
      try {
        paths = this.__getTableInfo().path_origin;
      } catch (err) {
        throw new Error('model error', err);
      }
    }
  } else if (_helper["default"].instance(paths, TableDescription)) {
    return paths; // 重复调用，直接返回
  } // TODO 如果是已经拼接好的 path 那么取消重新拼接


  if (!paths) throw new Error("[@dgteam/model] model path invalid.");
  if (typeof paths === 'string') paths = paths.split('/'); // if (!action && model.toUpperCase() === model) {
  //     action_path = model
  //     model = null
  // }

  var path = paths.join('/');

  var _paths = Array.from(paths);

  var table = _paths.pop(); // 表明为路径的最后一个


  var model = _paths.join('/'); // 剩余的微模型名称


  var action_path = '';

  if (!action && table.toUpperCase() === table) {
    action_path = table; // 如果没有传递 action 参数，且最后一个单词是全大写，那么可以判断是 model 级别的方法，没有 table

    table = '';
  } else if (action) {
    action_path = "".concat(action.toUpperCase(), "_").concat(table.toUpperCase());
  }

  action ? "".concat(action.toUpperCase(), "_").concat(table.toUpperCase()) : '';
  var action_path_full = model ? "".concat(model, "/").concat(action_path) : action_path; // 如果 vuex 没有此模型，尝试兼容路径
  // ...

  return new TableDescription({
    model: model,
    table: table,
    action: action,
    action_path: action_path,
    action_path_full: action_path_full,
    path: path,
    paths: paths
  });
};

TableController.prototype.__getTableInstance = function (paths) {
  var models = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.$models;

  var deepInspect = function deepInspect(tunnel, paths) {
    if (paths) {
      if (typeof paths === 'string') paths = paths.split('/');

      if (paths.length > 0) {
        var path = paths.shift();

        if (typeof path === 'string' && tunnel[path]) {
          if (paths.length === 0) return tunnel[path]; // 查询成功，返回实例

          return deepInspect(tunnel[path], paths);
        }
      }
    }

    return null;
  };

  return deepInspect(models, paths);
};

TableController.prototype.__getTableInfo = function () {
  var opt = this.$options && this.$options.model || this.store; // 仅在 vue component 实例下有效

  if (opt) {
    if (typeof opt === 'string') {
      opt = {
        path: opt
      };
    }

    if (_typeof(opt) === 'object') {
      // const inspect = this.__getTableInstance(opt.path)
      var _opt = opt,
          path_origin = _opt.path,
          as = _opt.as;

      var _this$__modelFormat4 = this.__modelFormat(path_origin),
          model = _this$__modelFormat4.model,
          table = _this$__modelFormat4.table,
          path = _this$__modelFormat4.path;

      return {
        model: model,
        table: table,
        path: path,
        path_origin: path_origin,
        as: as
      };
    }
  }

  return null;
};

var _default = TableController;
exports["default"] = _default;
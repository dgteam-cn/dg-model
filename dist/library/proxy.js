"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _controller = _interopRequireDefault(require("./controller"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var TableProxy = function TableProxy(table, path) {
  var _this = this;

  _controller["default"].call(this); // super


  for (var key in table) {
    this[key] = table[key];
  }

  Object.defineProperties(this, {
    __path__: {
      value: path,
      enumerable: !!process.server,
      configurable: true,
      writable: true
    }
  }); // enumerable 为了兼容 nuxt2 的 server 模式

  var defineProperty = function defineProperty(name, value) {
    return Object.defineProperty(_this, name, {
      value: value
    });
  };

  defineProperty('get', function (page, filter, opt) {
    return Object.getPrototypeOf(_this).get.call(_this, page, path, Object.assign({}, _this.filter, filter), opt);
  }); // 试验性: 默认继承当前实例的 filter

  defineProperty('getInit', function (filter, opt) {
    return Object.getPrototypeOf(_this).getInit.call(_this, _this.__path__, filter, opt);
  });
  defineProperty('getFilter', function (filter, opt) {
    return Object.getPrototypeOf(_this).getFilter.call(_this, _this.__path__, filter, opt);
  });
  defineProperty('getItem', function (primaryKey, filter, opt) {
    return Object.getPrototypeOf(_this).getItem.call(_this, primaryKey, _this.__path__, filter, opt);
  });
  defineProperty('getMore', function (filter, opt) {
    return Object.getPrototypeOf(_this).getMore.call(_this, _this.__path__, Object.assign({}, _this.filter, filter), opt);
  }); // 试验性: 默认继承当前实例的 filter

  defineProperty('activeRow', function (item) {
    return Object.getPrototypeOf(_this).use.call(_this, item, _this.__path__);
  });
  defineProperty('updateRow', function (item) {
    return Object.getPrototypeOf(_this).updateRow.call(_this, item, _this.__path__);
  });
  defineProperty('action', function (name, opt) {
    return Object.getPrototypeOf(_this).action.call(_this, name, _this.__path__, opt);
  });
  defineProperty('post', function (item, opt) {
    return Object.getPrototypeOf(_this).post.call(_this, item, _this.__path__, opt);
  });
  defineProperty('put', function (item, opt) {
    return Object.getPrototypeOf(_this).put.call(_this, item, _this.__path__, opt);
  });
  defineProperty('submit', function (item, opt) {
    return Object.getPrototypeOf(_this).submit.call(_this, item, _this.__path__, opt);
  });
  defineProperty('del', function (item, opt) {
    return Object.getPrototypeOf(_this)["delete"].call(_this, item, _this.__path__, opt);
  });
  defineProperty('destroy', function (item, opt) {
    return Object.getPrototypeOf(_this)["delete"].call(_this, item, _this.__path__, opt);
  });
  defineProperty('resetTable', function () {
    return Object.getPrototypeOf(_this).resetTable.call(_this, _this.__path__);
  });
  return this;
}; // 继承父类


TableProxy.prototype = new _controller["default"]();
TableProxy.prototype.constructor = TableProxy;
var _default = TableProxy;
exports["default"] = _default;
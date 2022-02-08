"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function objectToString(o) {
  return Object.prototype.toString.call(o);
}

var _default = {
  originJSON: function originJSON(obj) {
    return JSON.parse(JSON.stringify(obj));
  },
  isArray: function isArray(sample) {
    if (Array.isArray) return Array.isArray(sample);
    return objectToString(sample) === '[object Array]';
  },
  isObject: function isObject(sample, strict) {
    if (sample && _typeof(sample) === 'object') {
      if (strict && objectToString(sample) !== "[object Object]") {
        return false; // 严格模式下只有 {} 的对象可以返回 true
      }

      return true; // 非严格模式，[] 等也会返回 true
    }

    return false;
  },
  // 深拷贝一个对象
  extend: function extend(target) {
    var i = 0;
    var length = arguments.length <= 1 ? 0 : arguments.length - 1;
    var options, name, src, copy;

    if (!target) {
      target = this.isArray(arguments.length <= 1 ? undefined : arguments[1]) ? [] : {};
    }

    for (; i < length; i++) {
      options = i + 1 < 1 || arguments.length <= i + 1 ? undefined : arguments[i + 1];

      if (!options) {
        continue;
      }

      for (name in options) {
        src = target[name];
        copy = options[name];

        if (src && src === copy) {
          continue;
        }

        if (this.isArray(copy)) {
          target[name] = this.extend([], copy);
        } else if (this.isObject(copy)) {
          target[name] = this.extend(src && this.isObject(src) ? src : {}, copy);
        } else {
          target[name] = copy;
        }
      }
    }

    return target;
  },
  // 判断一个对象是否包含某一个基类
  instance: function instance(left, right) {
    left = left.__proto__;
    right = right.prototype;

    while (left != null) {
      if (left === right) return true;
      left = left.__proto__;
    }

    return false;
  },
  // 按指定长度，生成随机字符串
  randomString: function randomString() {
    var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 16;
    var result = '';
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

    for (var i = 0; i <= 16; i++) {
      var index = Math.random() * length | 0;
      result += chars[index];
    }

    return result;
  },
  // 打印错误
  consoleWarn: function consoleWarn() {
    var _console;

    for (var _len = arguments.length, params = new Array(_len), _key = 0; _key < _len; _key++) {
      params[_key] = arguments[_key];
    }

    (_console = console).warn.apply(_console, ['[@dgteam/model]: '].concat(params));
  } // 枚举
  // enum(list = [], fun = new Function(), options = {}) {
  //     if (typeof options === 'string') {
  //         options = {defLabel: options}
  //     }
  //     const config = Object.assign({name: ['name'], label: ['label', 'title'], strict: false, defLabel: ''}, options)
  //     let {name, label, strict = false, defLabel} = config
  //     // 枚举匹配判定函数
  //     const handel = typeof fun !== 'function' ? (item) => {
  //         if (typeof name === 'string') {
  //             name = [name]
  //         }
  //         for (const _name of name) {
  //             if (strict ? item[_name] === fun : item[_name] == fun) {
  //                 return true
  //             }
  //         }
  //         return false
  //     } : fun
  //     for (const item of list) {
  //         if (handel(item)) {
  //             if (typeof label === 'string') {
  //                 label = [label]
  //             }
  //             if (Array.isArray(label)) {
  //                 for (let key of label) {
  //                     if (item[key] !== undefined) {
  //                         return item[key]
  //                     }
  //                 }
  //             }
  //             return item
  //         }
  //     }
  //     return defLabel
  // }

};
exports["default"] = _default;
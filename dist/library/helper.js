"use strict";

module.exports = {
  isObject: function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
  },
  originJSON: function originJSON(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
};
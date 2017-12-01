'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by reamd on 2017/11/29.
 */
;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define([], factory);
    } else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {
        // Node, CommonJS之类的
        module.exports = factory();
    } else {
        // 浏览器全局变量(root 即 window)
        root.checkData = factory();
    }
})(typeof window !== "undefined" ? window : undefined, function () {
    var CheckData = function () {
        function CheckData() {
            _classCallCheck(this, CheckData);

            this.rules = {};
        }

        _createClass(CheckData, [{
            key: '_iterateCore',
            value: function _iterateCore(rule, data) {
                var rArr = Object.keys(rule);
                var errorObj = {};
                var me = this;
                var flag = false;
                var pArr = [];

                if (Object.is(data, null) || Object.is(data, {})) {
                    return errorObj;
                }

                rArr.forEach(function (item) {
                    if (flag) {
                        return;
                    }
                    var rVal = rule[item];
                    var dVal = data[item];
                    var rVal_type = (typeof rVal === 'undefined' ? 'undefined' : _typeof(rVal)) === 'object' ? 'object' : rVal;
                    var dVal_type = typeof dVal === 'undefined' ? 'undefined' : _typeof(dVal);
                    if (rVal_type === 'object') {
                        dVal_type === 'object' ? (pArr.push(item), errorObj = me._iterateCore(rVal, dVal)) : (errorObj['errorKey'] = item, errorObj['errorType'] = dVal_type, flag = true);
                        if (!errorObj['hasError']) {
                            pArr.pop();
                        } else {
                            flag = true;
                        }
                    } else {
                        if (rVal_type !== dVal_type) {
                            errorObj['errorKey'] = item;
                            errorObj['errorType'] = dVal_type;
                            flag = true;
                        }
                    }
                });

                if (!(Object.is(errorObj, {}) || !errorObj['hasError'])) {
                    var errorKey = errorObj['errorKey'];
                    errorObj['errorKey'] = pArr.join('.') + '.' + errorKey;
                }

                errorObj['hasError'] = flag;

                return errorObj;
            }
        }, {
            key: 'init',
            value: function init(opt) {
                this.rules = opt;
            }
        }, {
            key: 'add',
            value: function add(opt) {
                Object.assign(this.rules, opt);
            }
        }, {
            key: 'test',
            value: function test(rule, data) {
                var temp = rule;
                rule = this.rules[rule];
                if (typeof rule === 'undefined') {
                    console.warn('(Warning): method of [test] apply ' + temp + ' rule not found!');
                    return false;
                }
                return this._iterateCore(rule, data)['hasError'];
            }
        }, {
            key: 'use',
            value: function use(rule, data) {
                var temp = rule;
                rule = this.rules[rule];
                if (typeof rule === 'undefined') {
                    console.warn('(Warning): method of [use] apply ' + temp + ' rule not found!');
                    return [false, '', ''];
                }
                var error = this._iterateCore(rule, data);
                var key = void 0,
                    val = void 0;
                error['errorKey'] ? (key = error['errorKey'], val = '(type error): type of [' + key + '] should not be a ' + error['errorType'] + '!') : (key = '', val = '');
                return [error.hasError, key, val];
            }
        }, {
            key: 'clear',
            value: function clear() {
                var rule = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

                rule === '' ? this.rules = {} : delete this.rules[rule];
            }
        }]);

        return CheckData;
    }();

    return new CheckData();
});
/**
 * Created by reamd on 2017/11/29.
 */
;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define([], factory);
    } else if (typeof exports === 'object') {
        // Node, CommonJS之类的
        module.exports = factory();
    } else {
        // 浏览器全局变量(root 即 window)
        root.checkData = factory();
    }
}(typeof window !== "undefined" ? window : this, function () {
    class CheckData {
        constructor () {
            this.rules = {};
        }

        _iterateCore (rule, data) {
            let rArr = Object.keys(rule);
            let errorObj = {};
            let me = this;
            let flag = false;
            let pArr = [];

            if(Object.is(data, null) || Object.is(data, {})) {
                return errorObj;
            }

            rArr.forEach(item => {
                if(flag) {
                    return;
                }
                let rVal = rule[item];
                let dVal = data[item];
                let rVal_type = (
                    typeof rVal === 'object'
                    ? 'object'
                    : rVal);
                let dVal_type = (typeof dVal);
                if(rVal_type === 'object'){
                    dVal_type === 'object'
                        ? (pArr.push(item), errorObj = me._iterateCore(rVal, dVal))
                        : (errorObj['errorKey'] = item, errorObj['errorType'] = dVal_type, flag = true);
                    if(!errorObj['hasError']) {
                       pArr.pop();
                    }else {
                       flag = true;
                    }
                }else {
                    if(rVal_type !== dVal_type){
                        errorObj['errorKey'] = item;
                        errorObj['errorType'] = dVal_type;
                        flag = true;
                    }
                }
            });

            if(!(Object.is(errorObj, {}) || !errorObj['hasError'])) {
                let errorKey = errorObj['errorKey'];
                errorObj['errorKey'] = `${pArr.join('.')}.${errorKey}`;
            }

            errorObj['hasError'] = flag;

            return errorObj;
        }

        init (opt) {
            this.rules = opt;
        }

        add (opt) {
            Object.assign(this.rules, opt);
        }

        test (rule, data) {
            let temp = rule;
            rule = this.rules[rule];
            if(typeof rule === 'undefined'){
                console.warn(`(Warning): method of [test] apply ${temp} rule not found!`);
                return false;
            }
            return this._iterateCore(rule, data)['hasError'];
        }

        use (rule, data) {
            let temp = rule;
            rule = this.rules[rule];
            if(typeof rule === 'undefined'){
                console.warn(`(Warning): method of [use] apply ${temp} rule not found!`);
                return [false, '', ''];
            }
            let error = this._iterateCore(rule, data);
            let key, val;
            error['errorKey']
                ? (key = error['errorKey'], val = `(type error): type of [${key}] should not be a ${error['errorType']}!`)
                : (key = '', val = '');
            return [error.hasError, key, val];
        }

        clear (rule = '') {
            rule === ''
                ? (this.rules = {})
                : (delete this.rules[rule]);
        }
    }
    return new CheckData();
}));

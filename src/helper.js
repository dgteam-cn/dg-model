function objectToString(o) {
    return Object.prototype.toString.call(o)
}

export default {
    originJSON(obj) {
        return JSON.parse(JSON.stringify(obj))
    },
    isArray(sample) {
        if (Array.isArray) return Array.isArray(sample)
        return objectToString(sample) === '[object Array]'
    },
    isObject(sample, strict) {
        if (sample && typeof sample === 'object') {
            if (strict && objectToString(sample) !== "[object Object]") {
                return false // 严格模式下只有 {} 的对象可以返回 true
            }
            return true // 非严格模式，[] 等也会返回 true
        }
        return false
    },

    // 深拷贝一个对象
    extend(target, ...args) {
        let i = 0
        const length = args.length
        let options, name, src, copy
        if (!target) {
            target = this.isArray(args[0]) ? [] : {}
        }
        for (; i < length; i++) {
            options = args[i]
            if (!options) {
                continue
            }
            for (name in options) {
                src = target[name]
                copy = options[name]
                if (src && src === copy) {
                    continue;
                }
                if (this.isArray(copy)) {
                    target[name] = this.extend([], copy)
                } else if (this.isObject(copy)) {
                    target[name] = this.extend(src && this.isObject(src) ? src : {}, copy)
                } else {
                    target[name] = copy
                }
            }
        }
        return target
    },

    // 判断一个对象是否包含某一个基类
    instance(left, right) {
        left = left.__proto__
        right = right.prototype
        while (left != null) {
            if (left === right) return true
            left = left.__proto__
        }
        return false
    },

    // 按指定长度，生成随机字符串
    randomString(length = 16) {
        let result = ''
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
        for (let i = 0; i <= 16; i++) {
            const index = Math.random() * length | 0
            result += chars[index]
        }
        return result
    },

    // 打印错误
    consoleWarn(...params) {
        console.warn('[@dgteam/model]: ', ...params)
    }

    // 枚举
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
}
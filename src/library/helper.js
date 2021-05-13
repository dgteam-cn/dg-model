module.exports = {
    isObject(obj) {
        return Object.prototype.toString.call(obj) === '[object Object]'
    },
    origin(obj) {
        return JSON.parse(JSON.stringify(obj))
    }
}
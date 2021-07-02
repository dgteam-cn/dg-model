module.exports = {
    isObject(obj) {
        return Object.prototype.toString.call(obj) === '[object Object]'
    },
    originJSON(obj) {
        return JSON.parse(JSON.stringify(obj))
    }
}
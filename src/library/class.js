
// import Model from './main.js'
// TODO List 会被 vue 重写
// class List extends Array {
//     constructor(arr) {
//         super()
//         if (Array.isArray(arr) && arr.length > 0) {
//             for (let item of arr) {
//                 this.push(new Item(item))
//             }
//         }
//     }
// }

class Item extends Object {
    constructor(item) {
        super()
        Object.assign(this, item)
    }
    copy() {
        return new Item(this)
    }
}

export {
    Item
}
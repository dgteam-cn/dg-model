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
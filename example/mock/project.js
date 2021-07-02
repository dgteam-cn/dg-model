import Mock from 'mockjs'
import qs from 'qs'
// import {Random} from 'mockjs'

const answer = (err, msg, result = null, opt = {}) => ({err, msg, result, date: new Date(), ...opt})

Mock.setup({
	timeout: 350
})
const DbUser = {
    primaryKey: 13,
    list: [
        {id: 1, name: '毕芳洲', age: 24},
        {id: 2, name: '藩建章', age: 22},
        {id: 3, name: '但凡之', age: 28},
        {id: 4, name: '繁子石', age: 36},
        {id: 5, name: '受昆', age: 18},
        {id: 6, name: '戎春冬', age: 45},
        {id: 7, name: '郭嫔', age: 46},
        {id: 8, name: '印望慕', age: 46},
        {id: 9, name: '虞兴邦', age: 58},
        {id: 10, name: '颜青亦', age: 32},
        {id: 11, name: '步紫薇', age: 19},
        {id: 12, name: '伊艳卉', age: 33}
    ]
}
Mock.mock(/^\/user\/?/i, /get/i, function(opt) {
    let id = opt.url.split('?')[0].split('user/')[1]
    if (id) {
        if (id != Number(id)) return answer(403, '"id" must be Integer.')
        id = Number(id)
        const result = DbUser.list.find(item => item.id == id)
        if (!result) return answer(404, 'not fount.')
        return answer(0, 'successful.', result)
    } else {
        let {page = 1, size = 6} = qs.parse(opt.url.split('?')[1])
        if (page != Number(page)) return answer(403, '"page" must be Integer.')
        if (size != Number(size) || size > 100) return answer(403, '"size" must be Integer and length <= 100.')
        page = Number(page)
        size = Number(size)
        const count = DbUser.list.length
        const total = count ? Math.ceil(count / size) : 0
        const start = (page - 1) * size
        const end = start + size - 1
        return answer(0, 'successful.', DbUser.list.filter((item, index) => index >= start && index <= end), {page, size, count, total})
    }
})
Mock.mock(/^\/user\/?/i, /post/i, function(opt) {
    const {primaryKey: id} = DbUser
    const {name, age} = opt.body ? JSON.parse(opt.body) : {}
    if (!name || typeof name !== 'string' || name.length > 4) return answer(403, '"name" must be String and length <= 4.')
    if (!age || typeof age !== 'number' || age % 1 !== 0) return answer(403, '"age" must be Integer.')
    const result = {id, name, age}
    DbUser.primaryKey ++
    DbUser.list.push(result)
	return answer(0, 'successful.', result)
})
Mock.mock(/^\/user\/\d{1,10}$/i, /put/i, function(opt) {
    let id = opt.url.split('user/')[1]
    if (id != Number(id)) return answer(403, '"id" must be Integer.')
    id = Number(id)
    const result = DbUser.list.find(item => item.id == id)
    if (!result) return answer(404, 'not fount.')
    const {name, age} = opt.body ? JSON.parse(opt.body) : {}
    if (name != undefined && (!name || typeof name !== 'string' || name.length > 4)) return answer(403, '"name" must be String and length <= 4.')
    if (name != undefined && (!age || typeof age !== 'number' || age % 1 !== 0)) return answer(403, '"age" must be Integer.')
    Object.assign(result, {name: name !== undefined ? name : result.name, age: age !== undefined ? age : result.age})
	return answer(0, 'successful.', result)
})
Mock.mock(/^\/user\/\d{1,10}$/i, /delete/i, function(opt) {
    let id = opt.url.split('user/')[1]
    if (id != Number(id)) return answer(403, '"id" must be Integer.')
    id = Number(id)
    const index = DbUser.list.findIndex(item => item.id == id)
    if (index == -1) return answer(404, 'not fount.')
    DbUser.list.splice(index, 1)
	return answer(0, 'successful.', {id})
})
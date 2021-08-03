export default {
    data() {
        return {
            store: 'project/user',
            testData: {
                table: {

                }
            }
        }
    },
    methods: {
        testReport(name, decision) {
            if (!this.testData.table[name])  this.$set(this.testData.table, name, {success: 0, fail: 0})
            if (!decision) {
                console.error(`[testReport] ${name} error.`)
                this.testData.table[name].fail = this.testData.table[name].fail + 1
            } else {
                this.testData.table[name].success = this.testData.table[name].success + 1
            }
        },
        async testRun() {
            const res_get_1 = await this.Get()
            const res_get_2 = await this.Dp('project/GET_USER')
            this.testReport('get', res_get_1.result.length === res_get_2.result.length)

            const res_post_1 = await this.Post({name: '测试 1', age: 29})
            this.testReport('post', res_post_1.result.name === '测试 1' && res_post_1.result.age === 29)
            const res_post_2 = await this.Dp('project/POST_USER', {data: {name: '测试 2', age: 30}})
            this.testReport('post', res_post_2.result.id === res_post_1.result.id + 1 && res_post_2.result.name === '测试 2' && res_post_2.result.age === 30)

            const res_put_1 = await this.Put({id: res_post_1.result.id, name: '测试 3', age: 31})
            this.testReport('put', res_put_1.result.id === res_post_1.result.id && res_put_1.result.name === '测试 3' && res_put_1.result.age === 31)
            const res_put_2 = await this.Dp('project/PUT_USER', {id: res_post_2.result.id, data: {id: res_post_2.result.id, name: '测试 4', age: 32}})
            this.testReport('put', res_put_2.result.id === res_post_2.result.id && res_put_2.result.name === '测试 4' && res_put_2.result.age === 32)
            
            const res_submit_1 = await this.Submit({name: '测试 5', age: 28})
            this.testReport('submit', res_submit_1.result.id === res_post_2.result.id + 1 && res_submit_1.result.name === "测试 5" && res_submit_1.result.age === 28)
            const res_submit_2 = await this.Submit({id: res_put_2.result.id, name: '测试 6', age: 27})
            this.testReport('submit', res_submit_2.result.id === res_put_2.result.id && res_submit_2.result.name === "测试 6" && res_submit_2.result.age === 27)

            const res_get_3 = await this.Get(1, undefined, {size: 100})
            this.testReport('get', res_get_3.count === res_get_1.count + 3)

            const res_delete_1 = await this.Dp('project/DELETE_USER', {id: res_post_1.result.id})
            const res_delete_2 = await this.Del(res_submit_1.result)

            const res_get_4 = await this.Get(1, undefined, {size: 100})
            this.testReport('delete', res_get_4.count === res_get_1.count + 1 && res_delete_1.result.id === res_post_1.result.id && res_delete_2.result.id === res_submit_1.result.id)

            const res_item_1 = await this.Item(res_post_2.result.id)
            this.testReport('item', res_item_1.result.id === res_post_2.result.id && this.Main.item && this.Main.item.id === res_post_2.result.id)

            const res_active_1 = await this.Active(null)
            this.testReport('active', !this.Main.item)

            const res_active_2 = await this.Active(res_post_2.result)
            this.testReport('active', this.Main.item && this.Main.item.id === res_post_2.result.id)

            this.Cm('project/MODEL_ROW_EXTEND', ['user', {id: res_post_2.result.id, age: 100}])
            this.testReport('extend', this.Main.item && this.Main.item.age === 100)

            await this.Del(res_post_2.result.id)

            this.Cm('project/MODEL_RESET', ['user'])
            this.testReport('reset', this.Main.init === false && this.Main.list.length === 0)

            
            console.log('运行完成', this.testData.table)
        }
    }
}
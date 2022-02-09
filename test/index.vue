<style>
    input {
        display: block;
        width: 100%; height: 32px; line-height: 32px; padding: 0 6px; margin: 0; font-size: 14px;
        border: 1px solid #DDD; border-radius: 5px; outline: none; box-sizing: border-box;
    }
    h4 {
        font-size: 20px; font-weight: bold; line-height: 34px; margin: 0;
    }
    .attr_name {
        height: 20px; line-height: 22px; padding: 0 8px; font-size: 14px; line-height: 20px;
        background-color: #F0F0F0; border-radius: 4px;
    }
    .attr_title {
        font-size: 13px; line-height: 20px; color: #666; padding-right: 8px;
    }
    .attr_value {
        flex: 1; font-size: 14px; line-height: 20px;
        text-align: right;
    }
    .btn, .btn-small, .btn-small-danger {
        background-color: #409EFF; color: #FFF; cursor: pointer;
        display: inline-block; font-size: 12px; height: 20px; line-height: 20px; padding: 0 7px; border-radius: 5px;
    }
    .btn-small-danger {
        background-color: #F56C6C;
    }
    .btn {
        font-size: 14px; height: 34px; line-height: 34px; padding: 0 10px; border-radius: 6px;
    }

    .btn-page {
        display: inline-block; width: 26px; height: 26px; line-height: 26px; font-size: 13px; text-align: center; cursor: pointer; border-radius: 4px; margin: 3px;
        background-color: #F0F0F0; color: #555;
    }
    .btn-page.active {
        background-color: #409EFF; color: #FFF;
    }
</style>
<template>
    <div class="Index">
        <div style="display: flex;">
            <div style="width: 350px; padding: 16px;">
                <h4>List</h4>
                <li style="font-size: 14px; line-height: 26px; display: flex; padding: 3px 0 9px 0; color: #AAA;">
                    <div style="flex: 0 0 45px;">ID</div>
                    <div style="flex: 0 0 85px;">姓名</div>
                    <div style="flex: 0 0 45px;">年龄</div>
                    <div style="flex: 1; text-align: right;">操作</div>
                </li>
                <li v-for="item in $model.list" :key="item.id" style="font-size: 14px; line-height: 26px; display: flex; padding: 3px 0;">
                    <div style="flex: 0 0 45px;">{{ item.id }}</div>
                    <div style="flex: 0 0 85px;">{{ item.name }}</div>
                    <div style="flex: 0 0 45px;">{{ item.age }}</div>
                    <div style="flex: 1;" />
                    <div class="btn-small" style="margin-left: 6px;" @click="$models.user.activeRow(item)">焦点</div>
                    <div class="btn-small" style="margin-left: 6px;" @click="$models.user.put({id: item.id, name: item.name, age: item.age + 1})">编辑</div>
                    <div class="btn-small-danger" style="margin-left: 6px;" @click="$models.user.del(item)">删除</div>
                </li>
                <div v-if="Main.total > 1" style="text-align: right; padding: 9px 0 3px 0;">
                    <span style="margin: 0 9px; font-size: 12.5px; color: #AAA; line-height: 26px;">分页器</span>
                    <a v-for="page in Main.total" class="btn-page" :class="{'active': Main.page == page}" @click="$models.user.get(page, Filter)">{{ page }}</a>
                </div>
            </div>
            <div style="width: 250px; padding: 16px; border-left: 1px solid #EEE;">
                <h4>Attr</h4>
                <div v-for="item in [
                    {name: 'name', title: '模型名称'},
                    {name: 'init', title: '已初始化'},
                    {name: 'more', title: '还有更多', format: value => !!value},
                    {name: 'empty', title: '列表为空'},
                    {name: 'error', title: '加载失败'},
                    {name: 'item', title: '焦点主键', format: item => item && item.id || 'null'},
                    {name: 'list', title: '列表长度', format: value => value.length},
                    {name: 'page', title: '当前页码'},
                    // {name: 'size', title: '分页大小'},
                    {name: 'total', title: '总计页码'},
                    {name: 'count', title: '总计条数'},
                    {name: 'marker', title: '分页标记', format: value => value ? '有' : '无'},
                    {name: 'loading', title: '加载队列'},
                    {name: 'editing', title: '编辑队列'},
                    
                ]" style="display: flex; padding: 5px 0;">
                    <div class="attr_title">{{ item.title }}</div>
                    <div class="attr_name">{{ item.name }}</div>
                    <div class="attr_value">{{ item.format ? item.format($model[item.name]) : $model[item.name] }}</div>
                </div>
            </div>
            <div style="width: 250px; padding: 16px; border-left: 1px solid #EEE;">
                <h4>Filter</h4>
                <div>
                    <div style="display: flex; padding: 2px 0; margin-top: 4px;">
                        <div style="font-size: 14px; line-height: 32px; flex: 0 0 65px;">分页大小</div>
                        <input v-model.number="Filter.size" placeholder="分页大小" maxlength="2" />
                    </div>
                </div>
                <div style="padding-top: 12px;">
                    <div class="btn" @click="$model.get(1, Filter)">重载数据</div>
                    <div class="btn" @click="$model.resetTable()" style="margin-left: 6px;">重置表模型</div>
                </div>
                <h4 style="margin-top: 12px;">Params</h4>
                <div style="display: flex; padding: 2px 0; margin-top: 4px;">
                    <div style="font-size: 14px; line-height: 32px; flex: 0 0 65px;">姓名</div>
                    <input v-model="Params.name" placeholder="输入姓名" maxlength="4" />
                </div>
                <div style="display: flex; padding: 2px 0; margin-top: 4px;">
                    <div style="font-size: 14px; line-height: 32px; flex: 0 0 65px;">年龄</div>
                    <input v-model.number="Params.age" placeholder="输入年龄" maxlength="3" />
                </div>
                <div style="padding-top: 12px;">
                    <div class="btn" @click="submit()">提交数据</div>
                </div>
                <h4 style="margin-top: 12px;">Test</h4>
                <div style="padding: 12px 0; font-size: 13px;">
                    <span style="display: inline-block; min-width: 80px; margin-right: 6px;">成功: {{ testData.statis.success }}</span>
                    <span style="display: inline-block; min-width: 80px;">失败: {{ testData.statis.fail }}</span>
                </div>
                <div class="btn" style="margin-right: 6px;" @click="testRun()">启用自动化测试</div>
                <div class="btn" @click="DBReset()">重置数据库</div>
            </div>
        </div>
        <div>
            <h4>Ctrl</h4>
            <div>
                <button @click="$model.get(1, Filter)">$model.get</button>
                <button @click="Main.get()">Main.get</button>
                <button @click="Get()">Get</button>
                <button @click="$models.user.resetTable()">resetTable</button>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import {mixin as StoreMix} from '@dgteam/model'
import Mock from './mock.js'
export default {
    name: "Index",
    mixins: [StoreMix],
    data() {
        return {
            Filter: {
                size: 10
            },
            Params: {
                name: '',
                age: undefined
            },
            testData: {
                statis: {
                    success: 0,
                    fail: 0
                },
                table: {}
            }
        }
    },
    model: 'user',
    computed: {
        $model: vm => vm.$models.user
    },
    methods: {
        submit() {
            if (!this.Params.name) return alert('请输入姓名')
            if (!this.Params.age) return alert('请输入年龄')
            this.Submit().then(res => {
                if (res.err) {
                    alert(res.msg)
                }
            })
        },

        async testRun() {

            this.testData.statis.success = 0
            this.testData.statis.fail = 0

            const report = (name, decision) => {
                if (!this.testData.table[name]) this.$set(this.testData.table, name, {success: 0, fail: 0})
                if (!decision) {
                    console.error(`[testReport] ${name} error.`)
                    this.testData.table[name].fail = this.testData.table[name].fail + 1
                    this.testData.statis.fail = this.testData.statis.fail + 1
                } else {
                    this.testData.table[name].success = this.testData.table[name].success + 1
                    this.testData.statis.success = this.testData.statis.success + 1
                }
            }

            // 基本测试
            const res_get_1 = await this.Get()
            const res_get_2 = await this.Dp('GET_USER')
            report('get', res_get_1.result.length === res_get_2.result.length)

            const res_post_1 = await this.Post({name: '测试 1', age: 29})
            report('post', res_post_1.result.name === '测试 1' && res_post_1.result.age === 29)
            const res_post_2 = await this.Dp('POST_USER', {data: {name: '测试 2', age: 30}})
            report('post', res_post_2.result.id === res_post_1.result.id + 1 && res_post_2.result.name === '测试 2' && res_post_2.result.age === 30)

            const res_put_1 = await this.Put({id: res_post_1.result.id, name: '测试 3', age: 31})
            report('put', res_put_1.result.id === res_post_1.result.id && res_put_1.result.name === '测试 3' && res_put_1.result.age === 31)
            const res_put_2 = await this.Dp('PUT_USER', {id: res_post_2.result.id, data: {id: res_post_2.result.id, name: '测试 4', age: 32}})
            report('put', res_put_2.result.id === res_post_2.result.id && res_put_2.result.name === '测试 4' && res_put_2.result.age === 32)

            const res_submit_1 = await this.Submit({name: '测试 5', age: 28})
            report('submit', res_submit_1.result.id === res_post_2.result.id + 1 && res_submit_1.result.name === "测试 5" && res_submit_1.result.age === 28)
            const res_submit_2 = await this.Submit({id: res_put_2.result.id, name: '测试 6', age: 27})
            report('submit', res_submit_2.result.id === res_put_2.result.id && res_submit_2.result.name === "测试 6" && res_submit_2.result.age === 27)

            const res_get_3 = await this.Get(1, undefined, {size: 100})
            report('get', res_get_3.count === res_get_1.count + 3)

            const res_delete_1 = await this.Dp('DELETE_USER', {id: res_post_1.result.id})
            const res_delete_2 = await this.Del(res_submit_1.result)

            const res_get_4 = await this.Get(1, undefined, {size: 100})
            report('delete', res_get_4.count === res_get_1.count + 1 && res_delete_1.result.id === res_post_1.result.id && res_delete_2.result.id === res_submit_1.result.id)

            const res_item_1 = await this.GetItem(res_post_2.result.id)
            report('item', res_item_1.result.id === res_post_2.result.id && this.Main.item && this.Main.item.id === res_post_2.result.id)

            const res_active_1 = await this.Active(null)
            report('active', !this.Main.item)

            const res_active_2 = await this.Active(res_post_2.result)
            report('active', this.Main.item && this.Main.item.id === res_post_2.result.id)

            // this.Cm('MODEL_ROW_EXTEND', ['user', {id: res_post_2.result.id, age: 100}])
            this.UpdateRow({id: res_post_2.result.id, age: 100}, 'user')
            report('extend', this.Main.item && this.Main.item.age === 100)

            await this.Del(res_post_2.result.id)

            // this.Cm('MODEL_RESET', ['user'])
            this.ResetTable('user')
            report('reset', this.Main.init === false && this.Main.list.length === 0)

            this.DBReset()
            console.log('运行完成', JSON.parse(JSON.stringify(this.testData.table)))
        },
        DBReset() {
            Mock.reset() // 重置数据库
        }
    },
    components: {
        
    },
    mounted() {
        window.App = this
        window.Vue = Vue
    }
}
</script>
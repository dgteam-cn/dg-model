<style>

</style>
<template>
    <div class="Index">
        Index测试 {{ __data }}
        <div style="display: flex;">
            <div style="background-color: #F5F5F5; width: 300px;">
                <ul>
                    <li v-for="item in $model.list" :key="item.id" style="display: flex;">
                        <div style="flex: 0 0 70px;">{{ item.id }}</div>
                        <div style="flex: 1;">{{ item.name }}</div>
                        <div style="flex: 0 0 70px;">{{ item.age }}</div>
                    </li>
                </ul>
                <div style="padding: 10px; color: #CCC; text-align: center;">
                    <div v-if="$model.editing">数据编辑中</div>
                    <div v-else-if="$model.loading">数据加载中</div>
                    <div v-else-if="!$model.init">请先初始化</div>
                    <span v-else-if="$model.empty">列表是空的</span>
                    <span v-else-if="!$model.more">没有更多了</span>
                </div>
            </div>
            <div style="background-color: #F5F5F5; width: 250px; line-height: 20px; margin-left: 15px;">
                <div style="display: flex; padding: 10px 0;">
                    <div style="flex: 0 0 100px;">init</div>
                    <div style="flex: 1;">{{ $model.init }}</div>
                </div>
            </div>
            <div style="background-color: #F5F5F5; width: 250px; line-height: 16px; margin-left: 15px;">
                <pre>
                    {{ JSON.stringify(Filter, undefined, 2) }}
                </pre>
                <pre>
                    {{ JSON.stringify(Params, undefined, 2) }}
                </pre>
            </div>
        </div>
        <div>
            <button @click="$model.get(1)">$model.get</button>
            <button @click="Main.get(1)">Main.get</button>
            <button @click="Get(1)">Get</button>
            <button @click="$models.user.resetTable()">resetTable</button>
        </div>
        <button @click="_dataAdd()">_dataAdd</button>
    </div>
</template>

<script>
var _data = {num: 1}
import Vue from 'vue'
// import StoreMix from '@/dist/mixins/store'
import {mixin as StoreMix} from '@/dist/index'

import TestMin from '~/mixins/test'
export default {
    name: "Index",
    mixins: [StoreMix, TestMin],
    data() {
        return {
           // store: 'project/user',
            Filter: {
                size: 6
            },
            Params: {
                name: '',
                age: undefined
            }
        }
    },
    model: 'user',
    computed: {
        $model: vm => vm.$models.user,
        __data() {
            return _data
        }
    },
    methods: {
        _dataAdd() {
            Vue.util.defineReactive(_data, 'num', _data.num + 1)
            // _data.num = _data.num + 1
            Vue.set(_data, 'num', _data.num + 1)
            console.log(_data)
        }
        // get(page = 1) {
        //     if (!this.Main.loading) {
        //         this.Get(page)
        //     }
        // },
        // post(e) {
        //     console.log(e)
        //     if (!this.Main.editing) {
        //         this.Post({name: '冬瓜', age: 29})
        //     }
        // },
        // put() {
        //     if (!this.Main.editing) {
        //         this.Put({id: 1, name: '冬瓜', age: 29})
        //     }
        // },
        // del() {
        //     if (!this.Main.editing) {
        //         this.Dp('project/DELETE_USER', {id: 1})
        //     }
        // }
    },
    components: {
        
    },
    mounted() {
        window.App = this
        window.Vue = Vue
    }
}
</script>
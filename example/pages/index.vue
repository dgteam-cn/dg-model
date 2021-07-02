<style>

</style>
<template>
    <div class="Index">
        Index测试测试
        <div style="display: flex;">
            <div style="background-color: #F5F5F5; width: 300px;">
                <ul>
                    <li v-for="item in Main.list" :key="item.id" style="display: flex;">
                        <div style="flex: 0 0 70px;">{{ item.id }}</div>
                        <div style="flex: 1;">{{ item.name }}</div>
                        <div style="flex: 0 0 70px;">{{ item.age }}</div>
                    </li>
                </ul>
                <div style="padding: 10px; color: #CCC; text-align: center;">
                    <div v-if="Main.editing">数据编辑中</div>
                    <div v-else-if="Main.loading">数据加载中</div>
                    <div v-else-if="!Main.init">请先初始化</div>
                    <span v-else-if="Main.empty">列表是空的</span>
                    <span v-else-if="!Main.more">没有更多了</span>
                </div>
            </div>
            <div style="background-color: #F5F5F5; width: 250px; line-height: 20px; margin-left: 15px;">
                <div style="display: flex; padding: 10px 0;">
                    <div style="flex: 0 0 100px;">init</div>
                    <div style="flex: 1;">{{ Main.init }}</div>
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
            <div>
                <a @click="get(1)">Get(1)</a>
                <a @click="get(2)">Get(2)</a>
                <a @click="get(3)">Get(3)</a>
                <br>
                <a @click="post">post()</a>
                <a @click="put()">put()</a>
                <a @click="del()">del()</a>
            </div>
        </div>
    </div>
</template>

<script>
import StoreMix from '@/dist/mixins/store'
import TestMin from '~/mixins/test'
import Helper from '@dgteam/helper'
export default {
    name: "Index",
    mixins: [StoreMix, TestMin],
    data() {
        return {
            store: 'project/user',
            Filter: {
                size: 6
            },
            Params: {
                name: '',
                age: undefined
            }
        }
    },
    methods: {
        get(page = 1) {
            if (!this.Main.loading) {
                this.Get(page)
            }
        },
        post(e) {
            console.log(e)
            if (!this.Main.editing) {
                this.Post({name: '冬瓜', age: 29})
            }
        },
        put() {
            if (!this.Main.editing) {
                this.Put({id: 1, name: '冬瓜', age: 29})
            }
        },
        del() {
            if (!this.Main.editing) {
                this.Dp('project/DELETE_USER', {id: 1})
            }
        }
    },
    components: {
        
    },
    mounted() {
        window.page = this
    }
}
</script>
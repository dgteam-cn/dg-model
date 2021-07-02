<style>

</style>
<template>
    <div id="app">
        <div>@dgteam/model</div>
        <router-view></router-view>
    </div>
</template>

<script>
import StoreMix from '@/dist/mixins/store'
import Helper from '@dgteam/helper'
import model from '~/plugins/store.js'
import axios from '~/plugins/ajax'
export default {
    name: "App",
    mixins: [StoreMix],
    mounted() {
        window.App = this.$root
        window.helper = Helper
        window.axios = axios
        window.model = model
    }
}
</script>
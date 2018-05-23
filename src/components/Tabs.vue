<template>
    <div class="tabs">
        <div class="tabsTitle">
            <span v-for="(item,index) in tabs.title" :class="{active:index === tabs.activeIndex}" @click="tab(index)">{{item}}</span>
        </div>

    </div>
</template>

<script>
    export default {
        name: "Tabs",
        methods: {
            tab(index) {
                this.$emit('tabClick', index);
            }
        },
        props: ['tabs']
    }
</script>

<style scoped>
    .tabsTitle {
        font-size: 16px;
        height: auto;
        overflow: hidden;
        box-shadow: inset 0 -2px 0 #e8e8e8;
    }

    .tabsTitle span {
        padding: 12px 20px;
        display: inline-block;
        float: left;
        cursor: pointer;
    }

    .tabsTitle span.active {
        color: #d01a39;
        box-shadow: inset 0 -2px 0 #d01a39;
    }
</style>

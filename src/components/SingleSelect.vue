<template>
    <div>
        <div class="singleSelect">
            <span v-for="(item,index) in selectArr" :class="{'active':item.isSelected}" @click="selected(index)">
                {{item.text}}
            </span>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'SingleSelect',
        data() {
            return {
                selectArr: [],
            }
        },
        mounted() {
            let arr = [];
            this.selectList.options.map((item, index) => {
                arr.push({
                    text:item,
                    isSelected: index === 0 ? true : false,
                })
            });
            this.selectArr = arr;
        },
        computed: {},
        methods: {
            selected(index) {
                const arr = this.selectArr;
                for (let i in arr) {
                    arr[i].isSelected = false;
                }
                arr[index].isSelected = true;
                this.$emit('clickSelected', arr[index].text);
            }
        },
        props: ['selectList']
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    @import '../assets/style/_flex';

    .singleSelect {
        @include flex-box;
        span {
            margin-right: 20px;
            border: 1px solid #afafaf;
            padding: 8px 15px;
            position: relative;
            cursor: pointer;
            &:hover {
                border-color: #d01a39;
            }
        }
        .active {
            border-color: #d01a39;
            &:after {
                width: 0;
                height: 0;
                border-color: #d01a39 transparent;
                border-width: 0 0 20px 20px;
                border-style: solid;
                position: absolute;
                right: 0;
                bottom: 0;
                content: '';
            }
            &:before {
                content: '';
                position: absolute;
                right: 0;
                bottom: 0;
                display: block;
                color: #fff;
                background: url(/static/svg/selected.svg);
                background-size: cover;
                width: 13px;
                height: 13px;
                z-index: 1000;
                -webkit-transform: rotate(-8deg);
                transform: rotate(-8deg);
            }
        }
    }
</style>

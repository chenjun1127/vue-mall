<template>
    <div class="pagination-box">
        <ul class="pagination pagination-lg">
            <li :class="{disabled:1===pageNo ? true:false}"><a href="javascript:void(0)" @click="prev">&laquo;</a></li>
            <li v-for="i in pageSum" :class="{active:i===pageNo ? true:false}">
                <a href="javascript:void(0)" @click="toPage(i)">{{i}}</a>
            </li>
            <li :class="{disabled:pageSum===pageNo ? true:false}"><a href="javascript:void(0)" @click="next">&raquo;</a></li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "pagination",
        mounted() {
            console.log(this.pageSize, this.pageNo)
        },
        methods: {
            prev() {
                let pageNo = this.pageNo;
                if (1 !== pageNo) {
                    pageNo--;
                    this.$emit('prevClick', pageNo);
                }
            },
            next() {
                let pageNo = this.pageNo;
                if (this.pageSum !== pageNo) {
                    pageNo++;
                    this.$emit('nextClick', pageNo);
                }
            },
            toPage(index) {
                this.$emit('toPageClick', index);
            }
        },
        computed: {
            pageSum() {
                return this.totalPage / this.pageSize > parseInt(this.totalPage / this.pageSize) ? parseInt(this.totalPage / this.pageSize) + 1 : this.totalPage / this.pageSize;
            }
        },
        props: ['totalPage', 'pageSize', 'pageNo']
    }
</script>

<style scoped>
    .pagination-box {
        text-align: center
    }

    .pagination a {
        color: #d9534f;
    }

    .pagination a:hover {
        color: #d43f3a;
    }

    .pagination .active a {
        background: #d9534f;
        border-color: #d43f3a;
        color: #fff;
    }

    .pagination .active a:hover {
        background: #d43f3a;
        border-color: #d43f3a;
        color: #fff;
    }
</style>

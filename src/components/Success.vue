<template>
    <div class="container pt">
        <img :src="success" class="status_ok">
        <div class="msg"> {{msg}}，{{number}}秒后返回 </div>
    </div>
</template>

<script>
    export default {
        name: 'Success',
        data() {
            return {
                msg: '操作成功',
                success: require('../../static/svg/success.svg'),
                number: 3,
            }
        },
        mounted() {
            let timer = setInterval(() => {
                this.number--;
                if (this.number === 0) {
                    clearInterval(timer);
                    this.$router.go(-1);
                }
            }, 1000)
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .status_ok {
        width: 120px;
        margin: 0 auto;
        display: block
    }

    .msg {
        text-align: center;
        padding: 15px 0;
        color: #e02f2f;
        font-size: 18px;
    }

    .pt {
        padding-top: 200px;
    }
</style>

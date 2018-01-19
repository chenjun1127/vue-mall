<template lang="jade">
    .container
        .row
            .col-md-12
                .form-horizontal
                    .form-group
                        label.col-md-2.control-label 用户名：
                        .col-md-10
                            input.form-control(type="text")
                    .form-group
                        label.col-md-2.control-label 密码：
                        .col-md-10
                            input.form-control(type="text")
</template>

<script>
    export default {
        name: "Login"
    }
</script>

<style scoped>

</style>

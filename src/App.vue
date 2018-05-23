<template>
    <div id="app" class="container-fluid wrap">
        <router-view/>
    </div>
</template>

<script>
    export default {
        name: 'app',
    }
</script>

<style>
    #app {
        font-family: 'Consolas', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: rayscale;
    }

    .cartImg {
        width: 80px;
        height: 80px;
    }

    a {
        color: #333;
    }

    a:hover {
        color: #e4393c;
        text-decoration: none;
    }

    .focus, .verify-error {
        border-color: #d01a39;
        outline: 0;
        -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(208, 26, 57, .6);
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(208, 26, 57, .6);
    }

    .verify-error-msg {
        color: #d01a39;
        display: block;
        margin-top: 10px;
        min-height: 20px;
        line-height: 20px;
        background: url("/static/images/tips.png") no-repeat left -1px;
        padding-left: 25px;
        margin-bottom: 0;
        clear: both;
    }

    .wrap {
        padding: 0
    }

    /*定义滚动条*/
    ::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        border-radius: 10px;
        background-color: #F5F5F5;
    }

    ::-webkit-scrollbar {
        width: 8px;
        background-color: #F5F5F5;
    }

    ::-webkit-scrollbar-thumb {
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
        background-color: #888;
    }
    a.link {
        color: #e4393c;

    }

    a.link:hover {
        color: #b32b2e;
        text-decoration: none;
    }
</style>

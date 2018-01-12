<template>
    <div id="app" class="container">
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
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: rayscale;
    }

    a {
        color: #333;
    }

    a:hover {
        color: #e4393c;
        text-decoration: none;
    }
</style>

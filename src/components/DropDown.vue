<template>
    <div>
        <div class="drop-wrap" v-click-outside="handleClose">
            <a href="#" ref="dropBtn" class="drop-btn" @click="show = !show">{{dropDown.title}} <span class="caret"></span></a>
            <ul class="drop-menu" v-show='show' :style="dropStyle">
                <slot name="dropLi"></slot>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'dropDown',
        data() {
            return {
                show: false,
                dropRightPosition: ''
            }
        },
        computed: {
            dropStyle() {
                let position = this.dropDown.position;
                if (position === 'right') {
                    return {right: this.dropRightPosition + 'px', left: 'inherit'};
                } else if (position === 'left') {
                    return {left: 0};
                } else {
                    return {left: position};
                }
            }
        },
        mounted() {
            this.dropRightPosition = this.$refs.dropBtn.parentNode.offsetWidth - this.$refs.dropBtn.offsetWidth;
        },
        methods: {
            handleClose() {
                this.show = false;
            }
        },
        directives: {
            clickOutside: {
                bind(el, binding, vnode) {
                    function documentHandler(e) {
                        if (el.contains(e.target)) {
                            return false;
                        }
                        if (binding.expression) {
                            binding.value(e);
                        }
                    }

                    el.__vueClickOutside__ = documentHandler;
                    document.addEventListener('click', documentHandler);
                },
                unbind(el, binding) {
                    document.removeEventListener('click', el.__vueClickOutside__);
                    delete el.__vueClickOutside__;
                }
            }
        },
        props: ['dropDown']
    }
</script>

<style scoped>

    .drop-wrap {
        position: relative;
    }

    .drop-btn {
        border: 1px solid #adadad;
        padding: 6px 10px;
        border-radius: 4px;
        text-decoration: none;
        display: inline-block;
    }

    .drop-btn:hover {
        background: #eee;
        color: #333;
    }

    .caret {
        display: inline-block;
        width: 0;
        height: 0;
        margin-left: 2px;
        vertical-align: middle;
        border-top: 4px dashed;
        border-right: 4px solid transparent;
        border-left: 4px solid transparent;
    }

    .drop-menu {
        list-style: none;
        padding: 0;
        margin-top: 4px;
        background-color: #fff;
        -webkit-background-clip: padding-box;
        background-clip: padding-box;
        border: 1px solid #ccc;
        position: absolute;
        top: 100%;
        left: 0;
        border-radius: 4px;
        -webkit-box-shadow: 0 6px 12px rgba(0, 0, 0, .175);
        box-shadow: 0 6px 12px rgba(0, 0, 0, .175);
        min-width: 150px;
        z-index: 3000;
    }

    .drop-menu li a {
        display: block;
        padding: 8px 15px;
        clear: both;
        font-weight: 400;
        line-height: 1.42857143;
        color: #333;
        white-space: nowrap;
        text-decoration: none;
    }

    .drop-menu li a:hover {
        background: #eee;
    }
</style>

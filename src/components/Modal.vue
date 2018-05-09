<template lang="jade">
    .v-modal.fade(:class="{show:modal.show}")
        .v-modal-dialog(:style="`width:${modal.style.width}`")
            .v-modal-content
                .v-modal-header
                    h5.v-modal-title {{modal.title}}
                    span.close-btn(@click="handleClose") &times;
                .v-modal-body
                    .v-modal-inner
                        <slot name='content'></slot>
                .v-modal-footer(:style="modal.footerStyle")
                    <slot name='footer'></slot>
</template>

<script>
    export default {
        name: 'modal',
        methods: {
            handleClose() {
                this.modal.show = false;
            }
        },
        props: ['modal'],
    }
</script>

<style scoped lang="scss">
    .v-modal {
        position: fixed;
        top: 0;
        right: 0;
        width: 100%;
        height: 100%;
        z-index: 1040;
        background: rgba(0, 0, 0, .6);
        opacity: 0;
        visibility: hidden;
    }

    .fade {
        transition: all .15s linear;
    }

    .show {
        opacity: 1;
        visibility: visible;
    }

    .v-modal-dialog {
        width: 80%;
        height: auto;
        background: #fff;
        border-radius: 5px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .v-modal-title {
        padding: 15px;
        border-bottom: 1px solid #eceeef;
        font-size: 16px;
        margin: 0;
        height: 44px;

    }

    .close-btn {
        font-size: 24px;
        position: absolute;
        right: 15px;
        font-weight: 400;
        cursor: pointer;
        color: #888;
        top: 3px;
    }

    .v-modal-body {
        padding: 15px;
    }

    .v-modal-inner {
        margin-bottom: 10px;
    }

    .v-modal-footer {
        justify-content: flex-end;
        padding: 15px;
        border-top: 1px solid #eceeef;
        display: flex;
        button:last-child {
            margin-left: 10px;
        }
    }
</style>

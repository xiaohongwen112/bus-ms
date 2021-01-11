<template>
  <div class="alert-back-div">
    <div class="alert-div">
      <div class="alert-title-div">
        <span class="alert-title-span">{{tipTitle}}</span>
      </div>
      <slot name="content">
        <div class="alert-body-div">{{tipContent}}</div>
      </slot>
      <div class="alert-foot-div" v-if="showFooter">
        <button class="alert-btn cancel-bnt" @click="onCancel">取消</button>
        <button class="alert-btn save-cen-bnt" @click="onConfirm">确定</button>
      </div>
      <div class="alert-foot-div" v-else>
        <span class="alert-btn save-bnt" v-if="!noConfirm" @click="closeFn">确定</span>
      </div>

    </div>
  </div>
</template>

<script>
  export default {
    props: {
      showTip: { type: Boolean, isRequired: true }, // 是否显示
      tipTitle: { type: String, default: '提示' }, // 提示标题
      tipContent: { type: String, default: '' }, // 提示内容
      tipHeight: { type: Boolean, default: false }, // 弹框高度
      autoClose: { type: Boolean, default: false }, // 是否自动关闭
      closeFn: { type: Function, isRequired: true },
      showFooter: { type: Boolean, dafault: false }, // 是否显示底部按钮
      noConfirm: { type: Boolean, dafault: false }, // 是否显示确定按钮
    },
    data() {
      return {
      };
    },
    methods: {
      onConfirm() {
        this.$emit('on-confirm');
        if (this.autoClose) {
          this.closeFn();
        }
      },
      onCancel() {
        this.$emit('on-cancel');
        this.closeFn();
      },
    },
  };
</script>

<style lang="scss" scoped>
@import '../../../assets/css/iconbms.css';
  .alert-back-div {
    position: fixed;
    top: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    z-index: 1000;
    left: 0;
    right: 0;
    .alert-div {
      width: 620px;
      height: 210px;
      position: absolute;
      background:url(../../../assets/common/alert.png);
      left: 50%;
      top: 50%;
      transform: translate(-50%,-50%);
      background-size: cover;
      .alert-title-div {
        width: 100%;
        height: 40px;
        margin-top: 12px;
        .alert-title-span {
          display: inline-block;
          height: 100%;
          width: auto;
          float: left;
          margin-left: 50px;
          line-height: 38px;
          color: #0bbce1;
          font-size: 18px;
        }
        .alert-title-img {
          display: inline-block;
          height: 40px;
          float: right;
          width: 40px;
          cursor: pointer;
          line-height: 40px;
          font-size: 12px;
          color: #ABABAB;
          font-family: "黑体";
          text-align: center;
          margin-right: 10px;
          border-top-right-radius: 10px;
        }
      }
      .alert-body-div {
        width: 100%;
        min-height: 40px;
        font-size: 16px;
        max-width: 455px;
        margin: 20px 0px 0px 70px;
        color: #aff0ff;
      }
      .alert-foot-div {
        height: 40px;
        background: transparent;
        border-top: none;
        position: absolute;
        bottom: 20px;
        text-align: center;
        left: 20px;
        right: 10px;
        .determine-btn {
          background: #257E8C;
          margin-right: 50px;
        }

        .alert-btn{
          text-align: center;
          width: 60px;
          height: 30px;
          line-height: 28px;
          border-radius: 3px;
          font-size: 14px;
          cursor: pointer;
          float: right;
          border: #12c2e9 1px solid;
          color: #12c2e9;
          &:hover{
            background: #0fb9db;
            color: #fff
          }
        }
        .save-bnt{
          margin-right: 50px;
          &:hover{
            color: #fff;
            background: #0fb9db;
          }
        }
        .cancel-bnt{
          margin-right: 50px;
          line-height: 26px;
          background: transparent;
        }
        .save-cen-bnt{
          background: transparent;
          margin-right: 10px;
          &:hover{
            background: #0fb9db;
          }
        }
      }
    }
  }
</style>

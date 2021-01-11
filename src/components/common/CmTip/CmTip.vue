<template>
  <div class="alert-back-div">
    <div class="alert-div" v-bind:style="{'height':tipHeight ? '352px':'200px',
    'background':tipHeight ? `url(${require('../../../assets/common/alertDabg.svg')})`:`url(${require('../../../assets/common/alertbg.svg')})`,
    'background-size':'cover'}"
     >
      <div class="alert-title-div">
        <span class="alert-title-span">{{tipTitle}}</span>
        <span class="alert-title-img icon-bms-close alert-btn" @click="closeFn"></span>
      </div>
      <slot name="content">
        <div class="alert-body-div">{{tipContent}}</div>
      </slot>
      <div class="alert-foot-div" v-show="showFooter">
        <button class="determine-btn alert-btn" @click="onConfirm">确定</button>
        <button class="cancle-btn alert-btn" @click="onCancel">取消</button>
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
      width: 415px;
      position: absolute;
      background:url(../../../assets/common/alertbg.svg);
      left: 50%;
      top: 50%;
      transform: translate(-50%,-50%);
      background-size: cover;
      .alert-title-div {
        width: 100%;
        height: 40px;
        margin-top: 20px;
        .alert-title-span {
          display: inline-block;
          height: 100%;
          width: auto;
          float: left;
          margin-left: 50px;
          line-height: 40px;
          color: #2BB4B5;
          font-size: 16px;
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
        max-width: 335px;
        margin: 10px auto;
        color: #fff;
      }
      .alert-foot-div {
        height: 40px;
        background: #0F2A3F;
        border-top: 1px solid #0D4555;
        position: absolute;
        bottom: 20px;
        text-align: center;
        left: 20px;
        right: 10px;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
        .determine-btn {
          background: #257E8C;
          margin-right: 50px;
        }
        .determine-btn, .cancle-btn {
          width: 60px;
          height: 25px;
          border: none;
          color: #fff;
          border-radius: 30px;
          display: inline-block;
          margin: 7.5px;
          cursor: pointer;
          outline: none;
          -webkit-appearance: none;
        }
        .cancle-btn {
          background: #B47021;
        }
      }
    }
  }
</style>

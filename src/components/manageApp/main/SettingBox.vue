<template>
    <div class="manageApp-settingHealth-bg" v-if="show">
      <div class="manageApp-settingHealth-main">
        <div class="tab-title">
          <div>
            <div class="one-tab" v-for="one in tabList" :key="one.name">
              <i :class="one.icon"></i>
              <span>{{one.name}}</span>
            </div>
          </div>
          <div>
            <span class="manageBox-store">保存</span>
            <span class="manageBox-close">关闭</span>
          </div>
        </div>
        <div class="tab-content-box">
          <slot name="content">123</slot>
        </div>
      </div>
  </div>
</template>
<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    tabList: {
      type: Array,
      default: [],
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../../assets/css/iconbms.css';
.manageApp-settingHealth-bg {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(16,25,32,0.5);
  z-index: 99;
}
.manageApp-settingHealth-main{
    position: absolute;
    left: 15%;
    top: 20%;
    right: 15%;
    bottom: 20%;
    color: #ffffff;
    padding: 15px 30px;
    border-radius: 5px;
    z-index: 100;
    .tab-title {
      height: 50px;
      span {
        display: inline-block;
        height: 41px;
        font-size: 18px;
        cursor: pointer;
      }
      >div{
        &:nth-child(1) {
          float: left;
          .one-tab{
            box-sizing: border-box;
            background: url('../../../assets/manageApp/scheduleNavBg.png') 0 0 no-repeat;
            background-size: 100% 100%;
            padding: 0 20px;
            height: 47px;
            >i {
              font-size: 22px;
              vertical-align: middle;
              display: inline-block;
              margin-top: 13px;
            }
            >span {
              vertical-align: middle;
              height: 25px;
              margin-top: 13px;
            }
        }
          
        }
        &:nth-child(2) {
          float: right;
          >span {
            width: 80px;
            height: 40px;
            margin: 7px -19px 0 0;
            padding: 7px 0 0 25px;
          }
          >.manageBox-store {
            background: url('../../../assets/manageApp/navSave.png') 0 0 no-repeat;
            background-size: 100% 100%;
            margin: 7px -28px 0 0;
            padding: 7px 0 0 15px;
          }
          >.manageBox-close {
            background: url('../../../assets/manageApp/navClose.png') 0 0 no-repeat;
            background-size: 100% 100%;
          }
        }
      }

    }
    .tab-content-box {
      border: 1px solid #14cff5;
      background: #071c2a;
      height: calc(100% - 50px);
    }
}
</style>

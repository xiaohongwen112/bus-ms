<template>
  <div id="alert-tip">
    <slot></slot>
    <div class="tip" v-if="tipIsShow" :style="'width:' + width + 'px;'">
      {{tipContent}}
    </div>
    <div class="san" v-if="tipIsShow" :style="'left:' + Math.ceil(width / 2) + 'px;'"></div>
    <i class="sear-icon" v-if="isRight"></i>
  </div>
</template>
<script>
export default {
  props: {
    tipContent: {
      type: String,
      default: '姓名已存在',
    },
    show: {
      type: Boolean,
      default: false,
    },
    isRight: {
      type: Boolean,
      default: false,
    },
    width: {
      type: Number,
      default: 375,
    },
  },
  watch: {
    show() {
      if (this.show === true) {
        this.tipIsShow = true;
      } else {
        this.tipIsShow = false;
      }
    },
  },
  data() {
    return {
      tipIsShow: false,
    };
  },
};
</script>
<style lang="scss" scoped>
  #alert-tip{
    position: relative;
    .tip{
      position: absolute;
      top: -35px;
      left: 0;
      // width: 375px;
      height: 30px;
      background-color: #442326;
      color: #b84144;
      border: 0;
      border-radius: 5px;
      display: flex;
      align-items: center;
      justify-content: left;
      padding-left: 10px;
      padding-right: 10px;
      box-sizing: border-box;
      z-index: 999;
    }
    .san{
      content: "";
      width:0;
      height:0;
      border-width:5px 5px 0;
      border-style:solid;
      border-color:#442326 transparent transparent;/*灰 透明 透明 */
      margin:40px auto;
      position: absolute;
      top: -47px;
      // left: 180px;
    } 
    .sear-icon{
      display: inline-block;
      position: absolute;
      bottom: 3px;
      right: 3px;
      width: 24px;
      height: 24px;
      top: 1px;
      cursor: pointer;
      background: url(../../../../../assets/common/correct.svg) no-repeat center;
    }
  }
</style>
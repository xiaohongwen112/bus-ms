<template>
  <div class="switch">
    <span class="switch-text">{{switchText}}</span>
    <span class="bms-switch" :class="{'bms-switch-checked':status}" @click="changeStatus">
      <input type="hidden" :value="status">
      <span class="bms-switch-inner">{{status===true?statusOne:statusOther}}</span>
    </span>
  </div>
</template>

<script>
  export default{
    name: 'CmSwitch',
    props: {
      switchText: { type: String, default: '' }, // 切换标题文本
      switchStatus: { type: Boolean, isRequired: true }, // 是否选中
      statusOne: { type: String, isRequired: true }, // 选中状态1
      statusOther: { type: String, isRequired: true }, // 选中状态2
    },
    watch: {
      switchStatus(newVal) {
        this.status = newVal;
      },
    },
    data() {
      return {
        status: this.switchStatus,
      };
    },
    methods: {
      changeStatus() {
        this.status = !this.status;
        this.$emit('on-change', this.status);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .switch{
    white-space:nowrap;
    .switch-text{
      display:inline-block;
      font-size: 17px;
      color: #C6D0E2;
      margin-right: 10px;
    }
    .bms-switch {
      display: inline-block;
      width: 62px;
      height: 25px;
      line-height: 22px;
      border-radius: 25px;
      vertical-align: middle;
      border: 1px solid #8F8F8F;;
      position: relative;
      cursor: pointer;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      transition: all .35s ease-in-out;
      &:focus{
        box-shadow: 0 0 0 2px rgba(45,140,240,.2);
        outline: 0;
      }
      &:hover{
        box-shadow: none;
      }
      .bms-switch-inner{
        color: #8F8F8F;
        font-size: 14px;
        position: absolute;
        left: 36px;
        top: 0;
      }
      &:active:after {
        width: 26px;
      }
      &:after {
        content: "";
        width: 23px;
        height: 23px;
        border-radius: 50%;
        background-color: #8F8F8F;
        position: absolute;
        left: 1px;
        top: 0px;
        cursor: pointer;
        transition: left .35s ease-in-out,width .35s ease-in-out;
      }
    }
    .bms-switch-checked {
      border: 1px solid #10EDE6;
      .bms-switch-inner{
        left: 14px;
        color:#C2D1D6;
      }
      &:after {
        left: 36px;
        background-color:#10ede6;
      }
    }
  }
</style>
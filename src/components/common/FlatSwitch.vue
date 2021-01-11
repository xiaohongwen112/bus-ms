<template>
  <div class="switch">
    <span class="flat-switch" :class="{'flat-switch-checked':status}" @click="changeStatus">
      <input type="hidden" :value="status">
      <span class="flat-switch-inner" :class="{'flat-switch-checked':status}">开启</span>
      <span class="flat-switch-inner" :class="{'flat-switch-checked':!status}">关闭</span>
    </span>
  </div>
</template>

<script>
  export default{
    name: 'FlatSwitch',
    props: {
      switchStatus: { type: Boolean, isRequired: true }, // 是否选中
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
    display: inline-block;
    white-space:nowrap;
    .flat-switch {
      display: inline-block;
      box-sizing:border-box;
      width: 75px;
      height: 22px;
      border-radius: 5px;
      font-size:0;
      vertical-align: middle;
      border: 1px solid #1a9394;
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
      .flat-switch-inner{
        color: #e7eff4;
        font-size: 14px;
        display: inline-block;
        height: 100%;
        line-height: 21px;
        width: 50%;
        text-align: center;
      }
    }
    .flat-switch-checked {
      &.flat-switch-inner{
        background-color: #1a9394;
      }
    }
  }
</style>
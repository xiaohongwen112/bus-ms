<template>
	<div class="manage-namePops" 
	:style="`left: ${this.lefts}px; top: ${this.top}px;`"
	v-if="showTips">{{showName}}</div>
</template>
<script>
export default {
  watch: {
    lefts(newVal) {
      return newVal;
    },
    top(newVal) {
      return newVal;
    },
    showNameFlag() {},
  },
  props: {
    showTips: {
      default: false,
      type: Boolean,
    },
    showName: {
      default: '123',
      type: String,
    },
    lefts: {
      default: 0,
      type: Number,
    },
    top: {
      default: 0,
      type: Number,
    },
  },
};
</script>
<style lang="scss">
.manage-namePops {
	position: absolute;
  word-wrap: break-word;
  word-break: break-all;
  z-index: 300;
	padding: 3px;
	border: 1px solid rgb(68, 110, 134);
	border-radius: 2px;
	background: rgb(24, 65, 95);
	box-sizing: content-box;
	font-size: 12px;
  &:after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border: 5px solid transparent;
    border-top: 5px solid rgb(24, 65, 95);
    z-index: 307;
    left: calc(50% + 2px);
    bottom: -10px;
  }
  &:before {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border: 7px solid transparent;
    border-top: 7px solid rgb(68, 110, 134);
    z-index: 306;
    left: 50%;
    bottom: -14px;
  }
}

</style>

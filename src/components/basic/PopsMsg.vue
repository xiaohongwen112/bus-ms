<template>
	<div class="pops-msg" ref="pops" :class="[type, {'has-triangle': hasTriangle}]"
	:style="`left: ${finalLeft}px; top: ${finalTop}px;`" v-if="showTips">{{msg}}</div>
</template>
<script>
export default {
  props: {
    type: {
      default: 'common',
      type: String,
    },
    hasTriangle: {
      default: true,
      type: Boolean,
    },
    showTips: {
      default: false,
      type: Boolean,
    },
    msg: {
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
  data() {
    return {
      finalLeft: 0,
      finalTop: 0,
      triangleHeight: 10,
    };
  },
  updated() {
    if (this.showTips) {
      const pops = this.$refs.pops.getBoundingClientRect();
      this.finalLeft = this.lefts - pops.width / 2;
      this.finalTop = this.top - pops.height - this.triangleHeight;
    }
  },
};
</script>
<style lang="scss">
.pops-msg {
	position: fixed;
  word-wrap: break-word;
  word-break: break-all;
  z-index: 300;
  line-height: 26px;
	padding: 0 8px;
	border-radius: 2px;
	box-sizing: content-box;
	font-size: 12px;
  &.has-triangle{
    &:after {
      content: '';
      position: absolute;
      width: 0;
      height: 0;
      border: 5px solid transparent;
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
      z-index: 306;
      left: 50%;
      bottom: -14px;
    }
  }
  &.common{
    background: rgba(40, 58, 73, .8);
    color: #89b2d7;
    &.has-triangle{
      &:after {
        border-top: 5px solid rgba(40, 58, 73, .8);
      }
    }
  }
  &.correct{
    background: rgba(19, 71, 31, .8);
    color: #0db244;
    &.has-triangle{
      &:after {
        border-top: 5px solid rgba(19, 71, 31, .8);
      }
    }
  }
  &.alert{
    background: rgba(77, 50, 34, .8);
    color: #e27f40;
    &.has-triangle{
      &:after {
        border-top: 5px solid rgba(77, 50, 34, .8);
      }
    }
  }
  &.error{
    background: rgba(82, 38, 38, .8);
    color: #e94d51;
    &.has-triangle{
      &:after {
        border-top: 5px solid rgba(82, 38, 38, .8);
      }
    }
  }
}

</style>

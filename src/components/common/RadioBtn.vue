<template>
  <div class="radio-btn-wrap clearfix">
    <button :class="{active: currentActive === 0}" @click="handleClick(0)">{{ msg[0] }}</button>
    <button :class="{active: currentActive === 1}" @click="handleClick(1)">{{ msg[1] }}</button>
  </div>
</template>
<script>
export default {
  name: 'RadioBtn',
  props: {
    msg: {
      type: Array,
      default() {
        return ['开', '关'];
      },
    },
    activeIndex: {
      type: Number,
      default: -1,
    },
  },
  data() {
    return {
      currentActive: this.activeIndex,
    };
  },
  methods: {
    handleClick(index) {
      this.currentActive = index;
      this.$emit('check-btn', this.currentActive);
    },
  },
};
</script>
<style lang="scss" scoped>

.clearfix{
  zoom: 1;
}
.clearfix:after{
  content: ".";
  clear: both;
  display: block;
  overflow: hidden;
  font-size: 0;
  height: 0;
}

  .radio-btn-wrap{
    font-size: 16px;
    button{
      display: block;
      float: left;
      height: 28px;
      line-height: 28px;
      border: 1px solid #3dd9c4;    
      padding: 0 18px;
      background-color: transparent;
      color: #3dd9c4;
      &:first-child{
        border-radius: 2px 0 0 2px;
      }
      &:last-child{
        border-radius: 0 2px 2px 0;
      }
    }
    .active, button:hover{
      background-color: #3dd9c4;
      color: #eee;
    }
  }
</style>

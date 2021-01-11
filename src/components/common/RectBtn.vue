<template>
  <button :class="{'rect-btn': true, 'active-btn': value}" @click="handleClick">
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'RectBtn',
  props: {
    keyword: {
      type: String,
      default: '',
    },
    // name: {
    //   type: String,
    //   default: '保存',
    // },
    value: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleClick() {
      this.$emit('click', { key: this.keyword, value: !this.value });
    },
  },
};
</script>

<style lang="scss" scoped>
.rect-btn{
  outline: none;
  display: inline-block;
  box-sizing: border-box;
  height: 28px;
  line-height: 26px;
  padding: 0 18px; 
  border-radius: 5px;
  text-align: center;
  font-size: 16px;
  background: transparent;
  border: 1px solid #3dd9c4;
  color: #3dd9c4;  
  cursor: pointer;
}
.active-btn{
  background: rgba(61,217,196,0.8);
  color: #eee;
  }
</style>

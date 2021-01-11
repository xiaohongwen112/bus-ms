<template>
  <button :class="{'cm-btn': !disabled, 'disabled-btn' : disabled, 'active': active}" 
  type="button"
  @click="handleEvent('click')"
  @mouseover="handleEvent('mouseover')" @mouseout="handleEvent('mouseout')">
    <slot></slot>
  </button>
</template>
<script>
export default {
  name: 'CmBtn',
  props: {
    msg: {
      type: String,
      default: '保存',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleEvent(e) {
      if (!this.disabled) {
        this.$emit(e);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.cm-btn, .disabled-btn{
  outline: none;
  display: inline-block;
  line-height: 28px;
  padding: 2px 18px; 
  border-radius: 15px;
  text-align: center;
  font-size: 16px;
  &:focus{
    outline: 0;
  }
}
.cm-btn {  
    background: transparent;
    border: 1px solid #3dd9c4;
    color: #3dd9c4;  
    cursor: pointer;
    &:hover{
      background: rgba(61,217,196,0.8);
      color: #eee;
    }
}
.disabled-btn {
    background-color: #373737;
    border: 1px solid #373737;
    color: #9d9c9c;
    cursor: auto;
}
</style>

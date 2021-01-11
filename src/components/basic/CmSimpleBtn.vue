<template>
  <button class="cm-btn" :class="[{'disabled-btn' : disabled, 'active': active}, classType]"
  type="button"
  @click="handleEvent('click')"
  @mouseover="handleEvent('mouseover')" @mouseout="handleEvent('mouseout')">
    <slot></slot>
  </button>
</template>
<script>
export default {
  name: 'CmSimpleBtn',
  props: {
    type: {
      type: String,
      default: 'main',
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
  computed: {
    classType() {
      return this.classIndex[this.type];
    },
  },
  data() {
    return {
      classIndex: {
        main: 'main',
        add: 'add',
        danger: 'danger',
        popsUp: 'popsUp',
      },
    };
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
  padding: 0 10px;
  border-radius: 3px;
  font-size: 14px;
  text-align: center;
  min-width: 60px;
  &:focus{
    outline: 0;
  }
}
.cm-btn {
  background: transparent;
  border: 1px solid #aaa;
  color: #fff;  
  cursor: pointer;

  &.main{
    color: #139d8c;
    border-color: #139d8c;
    &:hover{
      color: #fff;
      background-color: #16b8a5;
    }
  }
  &.add{
    color: #1d73a8;
    border-color: #1d73a8;
    &:hover{
      color: #fff;
      background-color: #2184c2;
    }
  }
  &.danger{
    color: #d04631;
    border-color: #d04631;
    &:hover{
      color: #fff;
      background-color: #eb5038;
    }
  }
  &.popsUp{
    color: #0ea4c3;
    border-color: #0ea4c3;
    &:hover{
      color: #fff;
      background-color: #0fb9db;
    }
  }
  &.disabled-btn {
    color: #676d6c;
    border-color: #676d6c;
    cursor: auto;
    &:hover{
      color: #fff;
      background-color: #7f8786;
    }
  }
}
</style>

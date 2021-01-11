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
  name: 'CmBtn',
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
  line-height: 30px;
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
  border: none;
  color: #fff;  
  cursor: pointer;

  &.main{
    background-color: #139d8c;
    &:hover{
      background-color: #16b8a5;
    }
  }
  &.add{
    background-color: #1d73a8;
    &:hover{
      background-color: #2184c2;
    }
  }
  &.danger{
    background-color: #d04631;
    &:hover{
      background-color: #eb5038;
    }
  }
  &.popsUp{
    background-color: #0ea4c3;
    &:hover{
      background-color: #0fb9db;
    }
  }
  &.disabled-btn {
    background-color: #676d6c;
    color: #d9e2e1;
    cursor: auto;
    &:hover{
      background-color: #7f8786;
    }
  }
}
</style>

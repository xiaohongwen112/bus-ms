<template>
  <div class="cm-select" v-clickoutside="closeUL">
    <div class="input-container" @click="choose">
      <input type="text" :value="value" readOnly="readOnly"/>
      <i class="icon-bms-tridown"></i>
    </div>
    <CmOption v-show="ulShow" :list="list" :selectOption="value" @receive="changeVal" :disabledLi="disabledLi"></CmOption>
  </div>
</template>
 
<script>

/* eslint-disable consistent-return, no-param-reassign */

import Vue from 'vue';
import CmOption from './CmOption';

export default{
  name: 'CmSelect',
  props: {
    list: {
      type: Array,
      default() {
        return [];
      },
    }, // 数据
    disabledLi: {
      type: Array,
      default() {
        return [];
      }, // 禁选项
    },
    selectVal: { type: String, default: '' }, // 选中值
    disabledSelect: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    selectVal(val) {
      this.value = val;
    },
  },
  data() {
    return {
      ulShow: false, // 默认ul不显示，单击input改变ul的显示状态
      value: this.selectVal,
    };
  },
  components: { CmOption },
  methods: {
    changeVal(val) {
      this.value = val;
      this.ulShow = false;
      this.$emit('on-change', val);
    },
    closeUL() {
      this.ulShow = false;
    },
    choose() {
      if (this.disabledSelect) this.ulShow = false;
      else this.ulShow = !this.ulShow;
      this.$emit('on-click');
    },
  },
};
Vue.directive('clickoutside', {
  bind(el, binding) {
    function documentHandler(e) {
      if (el.contains(e.target)) {
        return false;
      }
      if (binding.expression) {
        binding.value(e);
      }
    }
    el.__vueClickOutSide__ = documentHandler;
    document.addEventListener('click', documentHandler);
  },
  unbind(el) {
    document.removeEventListener('click', el.__vueClickOutSide__);
    delete el.__vueClickOutSide__;
  },
});
</script>

<style lang="scss" scoped>
@import '../../assets/css/iconbms.css';
.cm-select{
  display:inline-block;
  width:140px;
  vertical-align: middle;
  position:relative;
  margin:0 10px;
  .input-container{
    width: 100%;
    position: relative;
    input{
      width: 100%;
      height: 32px;
      font-size: 16px;
      color: #C6D0E2;
      border: 1px solid #0cdad4;
      outline: none;
      background-color: rgba(11,59,80,.37);
      color: #bbd6d6;
      padding-left:10px;
      padding-right: 13px;
      box-sizing:border-box;
      cursor: default;
    }
    .icon-bms-tridown{
      position:absolute;
      font-size:18px;
      color:#0cdad4;
      top:7px;
      right:2px;
    }
  }
}
</style>
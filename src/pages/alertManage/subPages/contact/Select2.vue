<template>
  <div class="cm-select" :class="[type, {'disable': disable}]" :style="`width: ${width}px;padding:0;`" v-clickoutside="closeUL">
    <div class="input-container" @click="choose">
      <input type="text" :value="value" :disabled="disable" readOnly="readOnly"/>
      <i class="icon-bms-tridown"></i>
    </div>
    <CmOption v-show="ulShow" :list="list" :selectOption="value" :height="height" @receive="changeVal" :disabledLi="disabledLi" :position="position"></CmOption>
  </div>
</template>
 
<script>

/* eslint-disable consistent-return, no-param-reassign */

import Vue from 'vue';
import CmOption from '@/components/basic/CmOption';

export default{
  name: 'CmSelect',
  props: {
    list: {
      type: [Array, Object],
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
    type: { type: String, default: 'system' },
    width: { type: Number, default: 200 },
    disable: { type: Boolean, default: false },
    height: { type: Number, default: 150 },
    position: { type: String, default: '' },
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
      if (this.disable) this.ulShow = false;
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

<style lang="scss">
.cm-select{
  .scroll-area{
    height: 100%;
    width: 100%;
    border-radius: 3px;
    .ps__rail-y{
      z-index: 9;
    }
  }
  &.system{
    .skill{
      li {
        color: #c3dcf2;
        background-color: #122536;
        text-align: left;
        &:hover, &.selected{
          color:#fff;
          background-color: #4ab2a5;
        }
        &.disabled{
          color: #848686;
        }
      }
      .ps-container{
        .ps__rail-x, .ps__rail-y{
          background-color: #0f1a23;
        }
        .ps__thumb-y, .ps__thumb-x{
          background: #34ffe6;
        }
      }
    }
  }
  &.popsUp{
    .skill{
      li {
        color: #e0e9f1;
        background-color: #152f45;
        text-align: left;
        &:hover, &.selected{
          color:#fff;
          background-color: #3c6895;
        }
        &.disabled{
          color: #848686;
        }
      }
      .ps-container{
        .ps__rail-x, .ps__rail-y{
          background-color: #0e2131;
        }
        .ps__thumb-y, .ps__thumb-x{
          background: #5bacff;
        }
      }
    }
  }
}
</style>
<style lang="scss" scoped>
@import '../../../../assets/css/iconbms.css';
.cm-select{
  display:inline-block;
  // min-width:100px;
  position:relative;
  font-size: 14px;
  .input-container{
    width: 100%;
    position: relative;
    input{
      font-size: 14px;
      width: 100%;
      height: 25px;
      border-radius: 3px;
      outline: none;
      padding-left: 8px;
      padding-right: 25px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      cursor: default;
      &:focus{
        border-color: #14cef5;
        box-shadow: 0 0 5px #096679 inset;
      }
      &.error{
        border: 1px solid red;
      }
      &::-webkit-input-placeholder {
        color: #4c4b4b;
      }
      &:-moz-placeholder {
        color: #4c4b4b;
      }
      &::-moz-placeholder {
        color: #4c4b4b;
      }
      &:-ms-input-placeholder {
        color: #4c4b4b;
      }
    }
    .icon-bms-tridown{
      position:absolute;
      font-size:12px;
      top:7px;
      right:8px;
      transform: scale(.7, .8);
    }
  }
  &.system{
    input {
      color: #c3d2f2;
      border: 1px solid #1c3651;
      background: #122536;
      &:focus{
        background-color: #173856;
      }
      &+i {
        color: #587287;
      }
    }
    ul {
      border: 1px solid #4ab2a5;
    }
    &.disable{
      input {
        background: #171d23;
      } 
    }
  }
  &.popsUp{
    input{
      color: #c3d2f2;
      border: 1px solid #223f5d;
      background: none !important;
      &+i {
          color: #587287;
      }
    }
    ul{
      border: 1px solid #223f5d;
    }
  }
  &.disable{
    input{
      color: #696575;
      border: 1px solid #212b33;
      &+i {
          color: #212b33;
      }
    }
  }
}
</style>
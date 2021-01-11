<template>
  <div class="asso-op-div" id="asso_op1" 
    v-if="isShow"
    v-clickoutside="handleClose"
    :style="{ top: `${top}px`, left: `${left}px` }">
    <h3>关联分析</h3>
    <ul class="" id="asso">
      <li v-for="(item, index) in multiOptions"
      :key="index"
      @click="handleClick(item)"
      v-show="item.show"
      ><span :name="`${item.key}`">{{ item.name }}</span></li>
      <!-- <li><a :href="`/zh-cn/stat/${appId}/cap/${intfId}/#/BizTrack`">跳转至业务追踪</a></li> -->
      <li @click="routeTo"><span>跳转至业务追踪</span></li>
    </ul>
  </div>
</template>
<script>

/* eslint-disable consistent-return, no-param-reassign */
// import _ from 'lodash';
import { mapState } from 'vuex';
import Vue from 'vue';

export default {
  name: 'AssoLi',
  props: {
    heightNum: {
      type: Number,
      default: 0,
    },
    isShow: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Array,
      required: true,
    },
    left: {
      type: Number,
      required: true,
    },
    top: {
      type: Number,
      required: true,
    },
  },
  computed: {
    ...mapState({
      appId: state => state.appId,
      appName: state => state.appName,
      intfId: state => state.intfId,
      // multiOptions: state => state.multi.multiOptions.slice(1),
      activeId: state => state.multi.activeId,
      currentDs: state => state.multi.currentDs,
      historyTb: state => state.multi.historyTb,
    }),
    multiOptions() {
      return this.options;
    },
  },
  methods: {
    handleClick(val) {
      // console.log(val);
      this.$emit('click', val);
    },
    handleClose() {
      this.$emit('handleClose');
    },
    routeTo() {
      this.$emit('route-to');
    },
  },
};

Vue.directive('clickoutside', {
  bind(el, binding) {
    function documentHandler(e) {
      if (el.contains(e.target) || e.target.parentElement.className === 'tb-body') {
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
.asso-op-div{
  z-index: 999;
  position: fixed !important;
  width: 140px;
  text-align: center;
  color: #BEE2EB;
  background: #141414;
  h3{
    margin-top: 0px;
    margin-bottom: 0px;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    font-weight: bold;
  }
  li{
    height: 35px;
    line-height: 35px;
    margin: 2px 0;
    background: #0b262c;
    font-size: 16px;
    cursor: pointer;
  }
  li span{
    display: inline-block;
    height: 35px;
    line-height: 35px;
    width: 100%;
    color: #BEE2EB;
    &:hover{
      background: #1b3a41;
    }
  }
}
</style>

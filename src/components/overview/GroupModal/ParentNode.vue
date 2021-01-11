<template>
  <g class="group-link-node" >
    <rect class="link-node-bg" x="0" y="0" rx="5" ry="5" width="162" height="62" :fill="isMonitor ? `#1e69a0` : `#2e3235`"
          filter="url(#nameShadownode)"></rect>
    <rect x="0" y="0" rx="5" ry="5" width="162" height="62" fill="url(#nameGradientnode)"></rect>
    <!-- <text fill="#eee" font-size="20px" x="39.5625" y="37.5">{{ name }}</text> -->
    <foreignObject x="20" y="15" width="130" height="60">
      <div class="node-name" v-tooltip.ellipsis="{title: name, placement: 'top', trigger: ['blur']}">
        {{ name }}
      </div>
    </foreignObject>
  </g>
</template>
<script>
import tooltip from '@/directive/tooltip';

export default {
  name: 'ParentNode',
  directives: {
    tooltip,
  },
  props: {
    name: {
      type: String,
      default: '',
    },
    isMonitor: {
      type: Boolean,
      default: true,
    },
  },
};
</script>
<style>

</style>

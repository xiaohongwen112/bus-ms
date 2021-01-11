<template>
  <g class="client-node" transform="translate(0,0)">
    <g class="node-bg-group">
      <path d="M18,0L263,0Q293,0 293,30L293,258L48,258Q18,258 18,228Z" filter="url(#bgShadownode)" fill="#1e69a1"
            stroke="rgba(0,0,0,.5)" class="node-bg"></path>
      <path d="M18,0L263,0Q293,0 293,30L293,258L48,258Q18,258 18,228Z" fill="url(#clientGradientnode)"
            stroke="transparent" class="node-black"></path>
      <path d="M0,14Q0,9 5,9L215,9L215,49L0,49Z" filter="url(#nameShadownode)" fill="#1e69a1" stroke="transparent"
            class="name-bg"></path>
      <path d="M0,14Q0,9 5,9L215,9L215,49L0,49Z" fill="url(#nameGradientnode)" stroke="transparent"
            class="name-black"></path>
    </g>
    <!-- <text font-size="22" fill="#eee" class="node-name" x="18" y="30" text-anchor="start" dominant-baseline="middle">
      {{ title.name }}
    </text> -->
    <foreignObject x="18" y="13" width="187" height="60">
      <div class="node-name" v-tooltip.ellipsis="{title: title.name, placement: 'top', trigger: ['blur']}">
        {{ title.name }}
      </div>
    </foreignObject>
    <g class="image-gauge" transform="translate(40.75,83)">
      <circle cx="46" cy="46" r="46" stroke="#3f6d8e" stroke-width="3" fill="#091620"></circle>
      <image xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="../../assets/overview/clientIcon.svg"
             preserveAspectRatio="none meet" width="46" height="46" x="23" y="23" style="pointer-events: none;" />
    </g>
    <rect stroke="#123c5c" stroke-width="2" rx="2" ry="2" x="154.5" y="78" width="2" height="112" fill="none"></rect>
    <g class="image-gauge" transform="translate(178.25,83)">
      <circle cx="46" cy="46" r="46" stroke="#3f6d8e" stroke-width="3" fill="#103348"></circle>
      <image xmlns:xlink="http://www.w3.org/1999/xlink"
             :xlink:href="require(`../../assets/overview/${hasIp ? 'clientIp' : 'clientIpNone'}.svg`)"
             preserveAspectRatio="none meet" width="72" height="72" x="10" y="10" style="pointer-events: none;" />
    </g>
  </g>
</template>
<script>
import tooltip from '@/directive/tooltip';

export default {
  name: 'ClientNode',
  directives: {
    tooltip,
  },
  props: {
    title: {
      type: Object,
      default() {
        return {
          id: '',
          name: '--',
        };
      },
    },
    hasIp: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
};
</script>
<style scoped>

</style>

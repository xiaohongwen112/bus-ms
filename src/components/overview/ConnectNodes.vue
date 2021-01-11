<template>
  <g class="line-group">
    <path class="line-bg" :d="calcPath" stroke="#19E5CA" fill="none" stroke-width="14"></path>
    <path class="line-connect" :d="calcPath" stroke="#0F364B" fill="none" stroke-width="12"
          marker-end="url(#endCircle)" marker-start="url(#endCircle)" rotate="auto"></path>
    <path class="line-arrow" d="M0,-5 L1,0 L0,5 L5,0 Z" fill="#29F5DA" fill-opacity="1">
      <animateMotion class="line-arrow-motion" dur="2" :path="calcPath" repeatCount="indefinite" begin="0"
                     rotate="auto"></animateMotion>
    </path>
  </g>
</template>
<script>
  import { calcPonit } from '@/pages/overview/utils';

  export default {
    name: 'ConnectNodes',
    props: {
      data: {
        type: Object,
        default() {
          return {
            source: { x: 0, y: 0 },
            target: { x: 1, y: 1 },
          };
        },
      },
      transform: {
        type: Object,
        default() {
          return {
            x: 0,
            y: 0,
            k: 1,
          };
        },
      },
    },
    computed: {
      calcPath() {
        const pos = calcPonit(this.data.source, this.data.target, this.data.type, this.transform);
        return `M${pos.start}L${pos.end}`;
      },
    },
  };
</script>
<style>
  .connect_line_bg {
    stroke: #19E5CA;
    fill: none;
    stroke-width: 8;
  }

  .connect_line {
    stroke: #0F364B;
    fill: none;
    stroke-width: 7;
    marker-end: url('#end-circle');
    marker-start: url('#end-circle');
  }

  .connect_line_arrow {
    fill: #29F5DA;
    fill-opacity: 1;
  }
</style>

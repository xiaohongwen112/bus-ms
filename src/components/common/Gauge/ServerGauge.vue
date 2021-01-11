<template>
  <svg class="server-ring" xmlns="http://www.w3.org/2000/svg" version="1.1"
   :width="2 * radius" :height="2 * radius">
   <g transform="translate(45, 45)">
     <path class="ring-bg" :fill="color[0]" filter="url(#ringFilter)" :d="getArc(radius-20, radius-5, 0,  Math.PI * 2)" ></path>
     <path class="ring-percent" :fill="color[1]" :d="getArc(radius-20, radius-5, 0,  Math.PI * 2 * percent / 100)"></path>
      <text class="server-ring-text" text-anchor="middle" :dy="7">
        {{ Number(percent.toFixed(2)) }}
      </text>
   </g>
  </svg>
</template>

<script>
import { arc } from 'd3';

export default {
  name: 'ServerGauge',
  props: {
    percent: {
      type: Number,
      default: 0,
    },
    type: {
      type: String,
      default: 'succ', // succ|resp
    },
    isAlert: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      radius: 45,
    };
  },
  computed: {
    color() {
      let colorArr = ['#642e34', '#d95151'];
      if (!this.isAlert) {
        colorArr = this.type === 'succ' ? ['#005d5d', '#00BCAA'] : ['#00577b', '#009BDA'];
      }
      return colorArr;
    },
  },
  methods: {
    getArc(innerRadius, outerRadius, startAngle, endAngle) {
      const pathData = arc().innerRadius(innerRadius)
        .outerRadius(outerRadius)
        .startAngle(startAngle)
        .endAngle(endAngle);
      return pathData();
    },
  },
};
</script>

<style scoped>
.server-ring-text {
  font-size: 18px;
  fill: #eee;
}
</style>

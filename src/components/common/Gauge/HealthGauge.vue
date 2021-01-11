<template>
  <svg class="gauge-svg" xmlns="http://www.w3.org/2000/svg" version="1.1"
    :width="width" :height="width"
  >
    <g :transform="`translate(${radius}, ${radius})`">
      <path :fill="bgColor" :d="getArc(radius- 3, radius, 0, 100)"></path>
      <path :fill="bgColor" :d="getArc(radius- 13, radius -10, 0, 100)"></path>
      <g v-show="!isMoitor">
        <path :fill="topColor" :d="getArc(radius- 3, radius, 0, 100)"></path>
        <path :fill="topColor" :d="getArc(radius- 8, radius -6, 0, value)"></path>
        <path :fill="topColor" :d="getArc(radius- 13, radius -10, 0, value)"></path>
      </g>
      <text class="ringText" text-anchor="middle" :dy="textDy" :style="`fill: ${textColor}; font-size: ${textSize};`">
        {{ text }}
      </text>
    </g>
  </svg>
</template>
<script>
import { scaleLinear, arc } from 'd3';
import { getHealthStatus } from '@/helpers/utils';

export default {
  name: 'HealthGauge',
  props: {
    value: {
      type: String,
      required: true,
      default: '-1',
    },
  },
  data() {
    return {
      radius: 45,
      isMoitor: this.value === '-1',
      text: '未监控',
      textSize: this.value === '-1' ? '14px' : '24px',
      textColor: this.value === '-1' ? '#5c6063' : '#ffffff',
      textDy: this.value === '-1' ? '7' : '10',
      topColor: '',
      bgColor: this.value === '-1' ? '#324351' : '#061A2B',
    };
  },
  computed: {
    width() { return 2 * this.radius; },
    x() { return scaleLinear().domain([0, 100]).range([0, Math.PI * 2]); },
  },
  methods: {
    init() {
      if (!this.isMoitor) {
        const health = Number(this.value);
        const healthStatus = getHealthStatus(health);
        console.log(healthStatus);
        this.text = healthStatus.text;
        this.topColor = healthStatus.color;
      }
    },
    getArc(innerRadius, outerRadius, startAngle, endAngle) {
      const pathData = arc().innerRadius(innerRadius)
        .outerRadius(outerRadius)
        .startAngle(startAngle)
        .endAngle(this.x(endAngle));
      return pathData();
    },
  },
  beforeMount() {
    this.init();
  },
};
</script>
<style scoped>

</style>

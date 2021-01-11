<template>
  <liquid-gauge :id="id" :text="healthStatus.text" :waveColor="healthStatus.color" :percent="health" :centerX="cx" :centerY="cy" :radius="liquidRadius" >
    <g slot="clock" :transform="`translate(${cx},${cy}) rotate(${second * 6})`">
      <line class="clock-mark"
            v-for="(d, i) in minutes"
            :key="i"
            :x1="getX1(d)"
            :y1="getY1(d)"
            :x2="getX2(d, i)"
            :y2="getY2(d, i)"
            :stroke="healthStatus.color" fill="none" stroke-width="2"></line>
    </g>
  </liquid-gauge>
</template>
<script>
  import { range } from 'd3';
  import LiquidGauge from '@/components/common/Gauge/LiquidGauge';
  import { translateHealth } from '@/helpers/utils';

  export default {
    name: 'clock-liquid',
    components: {
      LiquidGauge,
    },
    props: {
      id: {
        type: String,
        default: 'index',
      },
      width: {
        type: Number,
        default: 120,
      },
      percent: {
        type: Number,
        default: 0,   // 0到1之间
      },
      text: {
        type: String,
        default: '紧急',
      },
      second: {
        type: Number,
        default: 14,
      },
    },
    data() {
      return {
        minutes: range(0, 60).map(d => d * 360 / 60),
        cx: 0,
        cy: 0,
//        second: this.nowSecond,
//        timeBefore: 0,
//        timer: null,
        healthStatus: {},
        health: 0,
      };
    },
    watch: {
      percent() {
        this.healthStatus = this.translateHealth(this.percent);
        this.health = Number(this.percent / 100);
      },
    },
    computed: {
      clockR() {
        return this.width / 2;
      },
      outerRadius() {
        return this.clockR - 6;
      },
      innerRadius() {
        return this.clockR - 12;
      },
      liquidRadius() {
        return this.clockR - 14;
      },
    },
    methods: {
      translateHealth,
      getX1(d) {
        return this.innerRadius * Math.cos(d * Math.PI / 180);
      },
      getX2(d, i) {
        return (this.getNowMark(i) + this.outerRadius) * Math.cos(d * Math.PI / 180);
      },
      getY1(d) {
        return this.innerRadius * Math.sin(d * Math.PI / 180);
      },
      getY2(d, i) {
        return (this.getNowMark(i) + this.outerRadius) * Math.sin(d * Math.PI / 180);
      },
      getNowMark(i) {
        if (i === 44 || i === 46) {
          return 4;
        } else if (i === 43 || i === 47) {
          return 2;
        } else if (i === 45) {
          return 6;
        }
        return 0;
      },
      setGaugePos() {
        const svgBox = this.$el.getBoundingClientRect();
        this.cx = svgBox.width / 2;
        this.cy = svgBox.height / 2;
      },
    },
    mounted() {
      this.setGaugePos();
    },
  };
</script>

<style lang="scss" scoped>
  .liquid-gauge-svg{
    width: 100%;
    height: 100%;

    text {
      font-size: 23px;
      font-weight: bold;
    }
  }

</style>

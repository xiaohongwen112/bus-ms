<template>
  <g class="flow-group">
    <rect class="flow-bg" x="0" y="1" rx="3" ry="3" :width="width" height="14"
      stroke="#9aa2a0" fill="transparent" stroke-dasharray="2px 4px"></rect>
    <rect class="flow-bar" v-show="hasTime"
      :x="rectX" y="0" rx="0" ry="0" :width="rectW" height="16"
      :fill="color" stroke-width="1px" stroke="transparent"></rect>
    <text class="flow-text" v-show="hasTime"
       fill="#fff" text-anchor="end"
      style="font-size: 12px; font-weight: bold;" 
      :x="totalFlag ? xPosition : textX > xPosition ? xPosition : textX + 10" y="13">
      {{ text }}
    </text>
  </g>
</template>

<script>
import { scaleLinear } from 'd3';
import { textWidth } from '@/helpers/utils';

export default {
  name: 'TransAlaysisFlow',
  props: {
    width: {
      default: 1189,
    },
    start: {
      default: 0,
    },
    end: {
      default: 100,
    },
    color: {
      default: '#44cec9',
    },
    text: {
      default: '',
    },
    hasTime: {
      default: true,
    },
    totalFlag: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    scaleLinear() { return scaleLinear().domain([0, 100]).range([0, this.width]); },
    rectX() { return this.scaleLinear(this.start); },
    textX() { return this.scaleLinear(this.end) + textWidth(this.text); },
    rectW() {
      let rectWidth = this.width;
      const percent = this.end - this.start;
      if (percent <= 100 && percent >= 0) {
        rectWidth = this.scaleLinear(percent);
      }
      return rectWidth;
    },
    // xPosition() {
    //   return window.innerWidth - 130;
    // },
  },
  data() {
    return {
      xPosition: window.innerWidth - 130,
    };
  },
  methods: {
    getPosition() {
      this.xPosition = window.innerWidth - 130;
    },
  },
  mounted() {
    // this.init();
    window.addEventListener('resize', () => this.getPosition());
  },
};
</script>

<style scoped>

</style>

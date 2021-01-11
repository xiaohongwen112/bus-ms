<template>
  <svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="rate-bar-svg">
    <g class="focus" :transform="`translate(${margin.left},${margin.top})`">
      <g class="axis x-axis" ref="xAxis" :transform="`translate(0,${height})`">
      </g>
      <text class="title" x="20" y="27.5" dx="-35 -14 -14 -14 -14 -14" dy="0 15 15 15 15 15">
        {{ titleName }}率︵%︶
      </text>
      <g class="unit" v-for="(item, index) in dataset"
         :key="`unit${index}`"
         :transform="`translate(${unitX[index]}, 0)`"
      >
        <rect class="bg-bar"
              :height="height"
              :width="barWidth"
              rx="4" ry="4"
        ></rect>
        <rect class="bar"
              :height="height-rectHeight(index)"
              :width="barWidth"
              rx="4" ry="4"
              :y="rectHeight(index)"
              :fill="color[index]"
        ></rect>
      </g>
    </g>
  </svg>
</template>

<script>
import { scaleBand, axisBottom, scaleLinear, select } from 'd3';

export default {
  name: 'StatRateBar',
  props: {
    type: {
      type: String,
      default: 'response', // response|success
    },
    dataset: {
      type: Array,
      default() {
        return [{ code: '', name: '1', value: 56 },
        { code: '', name: '2', value: 83 },
        { code: '', name: '5', value: 85 },
        { code: '', name: '4', value: 45 },
        { code: '', name: '3', value: 30 }];
      },
    },
  },
  data() {
    return {
      svg: { width: 960, height: 600 },
      margin: {
        top: 40,
        bottom: 30,
        left: this.dataset.length > 3 ? 45 : 70,
        right: 10,
      },
      rectPadding: 4,
      maxRectWidth: 22,
    };
  },
  computed: {
    color() {
      const colorArr = ['#66e690', '#7bdb74', '#a1d271', '#82bf9a', '#e0e46e', '#c8ce81', '#83c89a', '#83c4b7', '#90a7bd',
        '#6dcde3', '#e66495', '#d46b6a', '#df8c5f', '#da9779', '#c4da77', '#b56ed2', '#a684be', '#7e7cc8', '#719ed5', '#408bd7'];
      colorArr.sort(() => 0.5 - Math.random());
      return colorArr;
    },
    width() {
      return this.svg.width - this.margin.left - this.margin.right;
    },
    height() {
      return this.svg.height - this.margin.top - this.margin.bottom;
    },
    barWidth() {
      let tmpW = 18;
      if (this.dataset.length * 30 > this.width) {
        tmpW = this.width / this.dataset.length > 18 ? 18 : this.width / this.dataset.length - 2;
      }
      return tmpW;
    },
    x() {
      return scaleBand().rangeRound([0, this.width]).padding(0.1).domain(this.dataset.map(d => d.name));
    },
    axisBottom() {
      return axisBottom(this.x).ticks(this.dataset.length).tickSize(0).tickPadding(6);
    },
    y() {
      return scaleLinear().domain([0, 100]).range([this.height, 0]);
    },
    unitX() {
      return this.dataset.map(d => this.x(d.name) + this.x.bandwidth() / 2 - 10);
    },
    titleName() {
      return this.type === 'response' ? '响应' : '成功';
    },
  },
  methods: {
    getBox() {
      const box = this.$el.getBoundingClientRect();
      this.svg = {
        width: box.width,
        height: box.height,
      };
    },
    initAxis() {
      select(this.$refs.xAxis).call(this.axisBottom);
    },
    onResize() {
      this.getBox();
      this.initAxis();
    },
    rectHeight(index) {
      let tmpCount = this.dataset[index].value;
      tmpCount = tmpCount < 100 ? tmpCount : 100;
      return Math.abs(this.y(tmpCount));
    },
  },
  mounted() {
    this.onResize();
    window.addEventListener('resize', () => this.onResize());
  },
};
</script>

<style lang="scss">
.rate-bar-svg{
  width: 100%;
  height: 100%;
  .domain{
    stroke: transparent;
  }
  text{
    font-size: 14px;
    fill: rgb(232, 239, 244);
    text-anchor: unset;
    &.title{
      text-anchor: middle;
    }
  }
  .bg-bar{
    fill: #14242e;
  }
}
@media (max-width: 1100px) {
  .rate-bar-svg{
    text{
      font-size: 12px;
      text-anchor: end;
      &.title{
        font-size: 14px;
        text-anchor: middle;
      }
    }
  }
}
</style>

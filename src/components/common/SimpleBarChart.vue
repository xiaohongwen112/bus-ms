<template>
  <svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="simple-bar-svg">
    <g class="focus" :transform="`translate(${margin.left},${margin.top})`">
      <g class="x axis x-Axis" ref="xAxis" :transform="`translate(0,${height})`">
      </g>
      <g class="y axis y-Axis" ref="yAxis" :transform="`translate(0,0)`">
      </g>
      <g class="unit" v-for="(item, index) in dataset"
          :key="`unit${index}`"
          :transform="`translate(${unitX[index]}, ${unitY[index]})`"
          >
        <rect class="bar"
        :height="barHight[index]"
        :width="barWidth"
        :fill="color[index]"
        rx="4" ry="4"
        ></rect>
        <text class="label" :dx="barWidth / 2" dy="-2">{{ item.value }}{{ unit }}</text>
      </g>
    </g>
  </svg>
</template>
<script>
import { select, extent, scaleBand, axisBottom, scaleLinear, axisLeft } from 'd3';

export default {
  name: 'SimpleBarChart',
  props: {
    margin: {
      type: Object,
      default() {
        return {
          top: 30,
          right: 40,
          bottom: 20,
          left: 20,
        };
      },
    },
    dataset: {
      type: Array,
      default() {
        return [{ code: '', name: 'IE', value: 56 },
        { code: '', name: 'FireFox', value: 83 },
        { code: '', name: 'Chrome', value: 98 },
        { code: '', name: 'Badidu', value: 45 },
        { code: '', name: '其他', value: 30 }];
      },
    },
    unit: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      svg: { width: 960, height: 600 },
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
    extentValue() {
      return extent(this.dataset.map(d => d.value));
    },
    x() {
      return scaleBand().rangeRound([0, this.width]).padding(0.1).domain(this.dataset.map(d => d.name));
    },
    axisBottom() {
      return axisBottom(this.x).ticks(this.dataset.length).tickSize(0).tickPadding(6);
    },
    y() {
      return scaleLinear().domain([0, this.extentValue[1]]).range([this.height, 0]);
    },
    axisLeft() {
      return axisLeft(this.y).ticks(5).tickSize(0).tickPadding(6);
    },
    unitX() {
      return this.dataset.map(d => this.x(d.name) + this.x.bandwidth() / 2 - this.barWidth / 2);
    },
    unitY() {
      return this.dataset.map(d => this.y(1) - Math.abs(this.y(d.value) - this.y(0)));
    },
    barWidth() {
      let widthTmp = 50;
      const minWidth = this.width / this.dataset.length / 2;
      if (minWidth < 60) {
        widthTmp = 25;
      }
      return widthTmp;
    },
    barHight() {
      return this.dataset.map(d => Math.abs(this.y(d.value) - this.y(0)));
    },
    box() {
      return this.$el.getBoundingClientRect();
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
      select(this.$refs.yAxis).call(this.axisLeft);
    },
    onResize() {
      this.getBox();
      this.initAxis();
    },
  },
  mounted() {
    this.onResize();
    window.addEventListener('resize', () => this.onResize());
  },
};
</script>
<style lang="scss">
.simple-bar-svg{
  width: 100%;
  height: 100%;
  text{
    fill: #fff;
    font-size: 12px;
    text-anchor: middle;
  }
  .axis{
    path{
      stroke: #52D0E9;
    }
  }
  .y-axis{
    text{
      fill: transparent;
    }
  }
}
</style>

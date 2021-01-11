<template>
  <svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="simple-bar-svg">
    <g class="focus" :transform="`translate(${margin.left},${margin.top})`">
      <g class="axis y-axis" ref="yAxis" :transform="`translate(0,0)`">
      </g>
      <g class="axis x-axis" ref="xAxis" :transform="`translate(0,${height})`">
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
    <g class="axis-label">
      <text class="vertical-label"
      :x="margin.left + 35" y="20"
      text-anchor="left"
      >{{ verticalLabel }}</text>
      <text class="horizontal-label"
      :x="svg.width - margin.right + 15" :y="svg.height - 15"
      text-anchor="left"
      >{{ horizontalLabel }}</text>
    </g>
  </svg>
</template>
<script>
import { select, extent, scaleBand, axisBottom, scaleLinear, axisLeft } from 'd3';

export default {
  name: 'StatQuantityBar',
  props: {
    margin: {
      type: Object,
      default() {
        return {
          top: 30,
          right: 40,
          bottom: 20,
          left: 30,
        };
      },
    },
    dataset: {
      type: Array,
      default() {
        return [{ code: '', name: 'IE', value: 8.6 },
        { code: '', name: 'FireFox', value: 8.3 },
        { code: '', name: 'Chrome', value: 8.5 },
        { code: '', name: 'Badidu', value: 4.5 },
        { code: '', name: '其他', value: 3.0 }];
      },
    },
    unit: {
      type: String,
      default: '',
    },
    horizontalLabel: {
      type: String,
      default: '',
    },
    verticalLabel: {
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
      const ext = extent(this.dataset.map(d => d.value));
      if (ext[1] === 0) {
        ext[1] = 100;
      }
      return ext;
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
      return this.dataset.map(d => this.height - Math.abs(this.y(d.value) - this.y(0)));
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
  updated() {
    this.initAxis();
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
      select(this.$refs.yAxis).call(this.axisLeft).selectAll('line').attr('x2', this.width);
    },
    onResize() {
      this.getBox();
      this.initAxis();
    },
  },
  mounted() {
    if (this.verticalLabel.length > 0) {
      this.margin.top += 20;
    }
    this.onResize();
    window.addEventListener('resize', this.onResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize);
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
  .x-axis{
    path{
      stroke: #e8eff4;
    }
  }
  .y-axis{
    path{
      stroke: transparent;
    }
    line{
      stroke: #0f171e;
    }
  }
}
</style>


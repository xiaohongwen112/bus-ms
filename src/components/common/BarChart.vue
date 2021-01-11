<template>
  <svg class="bar-svg">
    <g class="focus" v-show="data.length > 0">
      <g :transform="`translate(${margin.left},${margin.top})`">
        <g class="x axis x-Axis" ref="xAxis" :transform="`translate(0,${height})`" fill="none" font-size="10" font-family="sans-serif"
         text-anchor="middle">
         <line class="xAxis-right" :transform="`translate(${width},0)`" :y2="-height"></line>
        </g>
        <g class="y axis y-Axis" ref="yAxis" transform="translate(0,0)" fill="none" font-size="10" font-family="sans-serif"
          text-anchor="end">
          <line class="yAxis-top" transform="translate(0,0)" :x2="width"></line>
        </g>
        <rect class="bar" 
          v-for="(item, index) in barData"
          :key="`bar${index}`"
          x="0" rx="4" ry="4" 
          :height="barHeight" 
          :y="getBarY(item)"
          :width="getBarWidth(item)"
          :fill="item.color"
          @mouseover="tipOpen()"
          @mousemove="tipUpdate($event, index)"
          @mouseout="tipClose()"
          @click="handleClick(index)"
        ></rect>
      </g>
      <foreignObject
        v-show="tipShow"
        :x="tipX"
        :y="tipY"
        width="240" height="120" 
        >
        <div class="tip-wrap">
          <div>{{tip.label}}:</div>
          <div>{{tip.value}}{{unit}}</div>
        </div>
      </foreignObject>
    </g>
    <image v-show="data.length === 0"
      :x="0.5 * svgWidth - 44"
      :y="0.5 * svgHeight - 65"
      class="no-data-image"
      xlink:href="../../assets/sys-icon/noStatDataImg.svg"
    ></image>
  </svg>
</template>
<script>
  import { select, extent, scaleLinear, axisBottom, scaleBand, axisLeft } from 'd3';

  export default {
    name: 'BarChart',
    props: {
      data: {
        type: Array,
        required: true,
        default() {
          return [{ label: '直接访问', value: '300' }, { label: '邮件营销', value: '130' }, { label: '电话营销', value: '120' }];
        },
      },
      unit: {
        type: String,
        default: '',
      },
      margin: {
        type: Object,
        default() {
          return {
            top: 30,
            right: 40,
            bottom: 40,
            left: 70,
          };
        },
      },
    },
    data() {
      return {
        svgWidth: 960,
        svgHeight: 600,
        tipShow: false,
        tipX: 0,
        tipY: 0,
        tip: {
          label: '',
          value: '',
        },
      };
    },
    computed: {
      width() {
        return this.svgWidth - this.margin.left - this.margin.right;
      },
      height() {
        return this.svgHeight - this.margin.top - this.margin.bottom;
      },
      barHeight() {
        return this.svgHeight / 600 * 50;
      },
      barData() {
        const color = this.color.sort(() => 0.5 - Math.random());
        const newArr = this.data.sort((a, b) => b.value - a.value);
        newArr.forEach((d, i) => {
          newArr[i].color = color[i];
        });
        return newArr;
      },
      extentValue() {
        return extent(this.barData, d => Number(d.value));
      },
      color() {
        const colorArr = ['#66e690', '#7bdb74', '#a1d271', '#82bf9a', '#e0e46e', '#c8ce81', '#83c89a', '#83c4b7', '#90a7bd',
          '#6dcde3', '#e66495', '#d46b6a', '#df8c5f', '#da9779', '#c4da77', '#b56ed2', '#a684be', '#7e7cc8', '#719ed5', '#408bd7'];
        colorArr.sort(() => 0.5 - Math.random());
        return colorArr;
      },
      x() {
        return scaleLinear().domain([0, this.extentValue[1]]).range([0, this.width]);
      },
      axisBottom() {
        return axisBottom(this.x).ticks(5).tickSize(0).tickPadding(6);
      },
      y() {
        return scaleBand().rangeRound([this.height, 0]).padding(0.1).domain(this.barData.map(d => d.label));
      },
      axisLeft() {
        return axisLeft(this.y).ticks(this.barData.length).tickSize(0).tickPadding(6);
      },
    },
    methods: {
      initAxis() {
        select(this.$refs.xAxis).call(this.axisBottom).selectAll('line').attr('y2', -this.height);
        select(this.$refs.yAxis).call(this.axisLeft);
      },
      getBox() {
        const box = this.$el.getBoundingClientRect();
        this.svgWidth = box.width;
        this.svgHeight = box.height;
      },
      getBarY(d) {
        return this.y(d.label) + this.y.bandwidth() / 2 - this.barHeight / 2;
      },
      getBarWidth(d) {
        return Math.abs(this.x(d.value) - this.x(0));
      },
      handleResize() {
        this.getBox();
        this.initAxis();
      },
      tipOpen() {
        this.tipShow = true;
      },
      tipUpdate(e, index) {
        this.tipX = e.offsetX + 10;
        this.tipY = e.offsetY + 10;
        this.tip = this.data[index];
      },
      tipClose() {
        this.tipShow = false;
      },
      handleClick(index) {
        this.$emit('click', this.data[index]);
      },
    },
    watch: {
      data() {
        if (this.data.length > 0) {
          this.initAxis();
        }
      },
    },
    mounted() {
      this.getBox();
      window.addEventListener('resize', () => this.handleResize());
    },
  };
</script>
<style lang="scss">
.bar-svg{
  width: 100%;
  height: 100%;
  .axis path,.axis line{
			fill:none;
			stroke: #263c44;
			shape-rendering: crispEdges;
		}
		.axis text{
			font-family: sans-serif;
			font-size:14px;
			fill: #59676b;
		}
		 .bar {
			cursor: pointer;
		}
    .tip-wrap{
      display: inline-block;
      width: auto;
      height: auto;   
      padding: 8px 15px;
      background-color: rgb(3, 16, 27);
      opacity: 0.75;
      border-radius: 2px;
      font-size: 14px;
      text-align: left;
      color: #bee2eb;
      div{
        white-space: nowrap;
      }
    }
}
</style>

<template>
  <div class='status-content'>
    <div class="head-content">
      <div class="content-left">
        <span class="sys-chart-tit">数据库</span>
        <span>100%</span>
      </div>
      <div class="cpuData">
        <span>数据库状态： {{ data[6] }}&emsp;当前连接量： {{ data[7] }}&emsp;请求量： {{ data[10] }}</span>
        <span>输出： {{ data[8] }}&emsp;输入： {{ data[9] }}</span>
        <span>利用率： {{ Number(data[1]) }}%</span>
      </div>
    </div>
    <div class="chart-div" id="cpu_chart" ref="svgHeight">
      <svg preserveAspectRatio="none" class="chart-svg" width="100%" height="100%" :viewBox="view">
        <g transform="translate(0,0)" class="chart-g">
          <rect x="0" y="0" width="100%" height="100%" :viewBox="view" preserveAspectRatio="none" fill="#01080d"
                stroke="#0d5b58" stroke-width="1"></rect>
          <g class="inner-line y-inner">
            <line v-for="n in 13" :key='n' y1=0 :x1=(xEnd/12)*(n-1) :x2=(xEnd/12)*(n-1) :y2="yEnd"></line>
          </g>
          <g class="inner-line x-inner">
            <line v-for="n in 6" :key='n' x1=0 :y1=(yEnd/5)*(n-1) :y2=(yEnd/5)*(n-1) :x2="xEnd"></line>
          </g>
          <g class="tug">
            <path class="sys-cpu" :d="dbline(datadb)">
            </path>
            <path class="area area0" fill="url(#area_green0)" :d="dbarea(datadb)">
            </path>
          </g>
        </g>
      </svg>
      <div class="time">
        <span class="lefttime">60s</span>
        <span class="righttime">0s</span>
      </div>
    </div>
  </div>
</template>
<script>
import { scaleLinear as ScaleLinear } from 'd3-scale';
import { line as Line, area as Area } from 'd3-shape';

export default {
  data() {
    return {
      width: 0,
      height: 0,
      sysWidth: 0,
      sysHeight: 0,
    };
  },
  components: {
  },
  computed: {
    yEnd() {
      return this.sysHeight;
    },
    xEnd() {
      return this.sysWidth;
    },
    view() {
      return [0, 0, this.sysWidth, this.sysHeight];
    },
    dbline() {
      const hei = this.sysHeight;
      const wid = this.sysWidth;
      const xScale = ScaleLinear().domain([60, 0]).range([0, wid]);
      const yScale = ScaleLinear().domain([0, 100]).range([hei, 0]);
      const line = Line()
        .x((d, i) => xScale(i))
        .y(d => yScale(d));
      return line;
    },
    dbarea() {
      const hei = this.sysHeight;
      const wid = this.sysWidth;
      const xScale = ScaleLinear().domain([60, 0]).range([0, wid]);
      const yScale = ScaleLinear().domain([0, 100]).range([hei, 0]);
      const line = Area()
        .x((d, i) => xScale(i))
        .y0(hei)
        .y1(d => yScale(d));
      return line;
    },
  },
  methods: {
  },
  props: ['data', 'datadb'],
  mounted() {
    this.sysHeight = this.$refs.svgHeight.clientHeight;
    this.sysWidth = this.$refs.svgHeight.clientWidth;
  },
};
</script>
<style lang="scss" scoped>
.righttime{
  position: relative;
  float: right;
  }
.tug{
  z-index: 4;
}
.inner-line line {
    fill: none;
    stroke: #08252b;
    stroke-width: 1;
}
.sys-cpu {
  stroke: rgb(22, 228, 205);
  fill: none;
  stroke-width: 1;
}
.status-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  top: 175px;
  .head-content{
    width: calc(100% - 18px);
    margin-top: 20px;
    div {
      &.content-left, .cpuData{
        display: inline-block;
        width: 50%;
        float: left;
      }
      &.cpuData{
        text-align: right;
        font-size: 12px;
        color: #888;
      }
      span{
        display:block;
        width: 100%;
        line-height: 20px;
      }
    }
  }
}
.tit-table {
  width: calc(100% - 5px);
  border-spacing: 10px;
}
.chart-div {
  width: calc(100% - 15px);
  position: absolute;
  top: 85px;
  left: 0;
  bottom: 8px;
}
div {
  display: block;
}
table {
  display: table;
  border-collapse: separate;
  border-spacing: 2px;
  border-color: grey;
}
.chart-info {
  /* visibility: visible; */
  position: absolute;
  left: 0;
  bottom: 10px;
  margin-left: 40px;
  border-spacing: 15px;
  font-size: 22px;
  width: 100%;
  border-spacing: 40px 0;
}
tbody {
  display: table-row-group;
  vertical-align: middle;
  border-color: inherit;
}
tr {
  display: table-row;
  vertical-align: inherit;
  border-color: inherit;
}
td,
th {
  display: table-cell;
  vertical-align: inherit;
}
.sys-chart-tit {
  float: left;
  font-size: 24px;
  margin-bottom: 20px;
}
table td {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tit-table td:last-child {
  text-align: right;
}
.sys-status-ul li:first-child {
  background-color: #0a1f30;
  border-bottom: 1px solid #38adb2;
}
img.restart-img {
  margin-top: 20px;
  width: 25px;
}
</style>

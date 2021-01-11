<template>
  <div class='status-content'>
    <table class="tit-table">
      <tr>
        <td class="sys-chart-tit">网卡</td>
      </tr>
      <tr>
        <td>吞吐量</td>
        <td id="cpuUseFactor">{{ datanet.throughput }}</td>
      </tr>
    </table>
    <ul class="network-name-ul">
      <li @click="eth(k)" v-bind:class="{ eth0:k==current }" class="list" v-for="k in datanet.net.length" :key='k'>
        <a>{{ datanet.net[k - 1] }}</a>
      </li>
    </ul>
    <div class="chart-div" id="cpu_chart" ref="svgHeight">
      <svg preserveAspectRatio="none" class="chart-svg" :viewBox="view" width="100%" height="100%">
        <g transform="translate(0,0)" class="chart-g">
          <rect x="0" y="0" width="100%" height="100%" :viewBox="view" preserveAspectRatio="none" fill="#01080d"
                stroke="#0d5b58" stroke-width="2"></rect>
          <g class="inner-line y-inner">
            <line v-for="n in 13" :key='n' y1=0 :x1=(xEnd/12)*(n-1) :x2=(xEnd/12)*(n-1) :y2="yEnd"></line>
          </g>
          <g class="inner-line x-inner">
            <line v-for="n in 6" :key='n' x1=0 :y1=(yEnd/5)*(n-1) :y2=(yEnd/5)*(n-1) :x2="xEnd"></line>
          </g>
          <g class="tug" v-bind:class="{ svgpath:n==current }" v-for="n in datanet.net.length" :key='n'>
            <path class="sys-cpu-color1" :d="one(datasent)"></path>
            <path class="area area0" fill="url(#area_green0)" :d="two(datasent)"></path>
            <path class="sys-cpu-color2" :d="three(datarecv)"></path>
            <path class="area area1" fill="url(#area_green1)" :d="four(datarecv)"></path>
          </g>
        </g>
      </svg>
      <div class="speed">
        <span class="speed-1">{{(getMaxArea / 1024).toFixed(2)}}KB/s</span>
        <span class="speed-2">0KB/s</span>
      </div>
      <div class="time">
        <span class="lefttime">60s</span>
        <span class="righttime">0s</span>
      </div>
    </div>
    <div class="legendDiv">
      <div>
        <span class="statusLegend up"></span>
        <span>上行:{{datasentS}}</span>
      </div>
      <div>
        <span class="statusLegend down"></span>
        <span>下载: {{datarecvS}}</span>
      </div>
    </div>
  </div>
</template>
<script>
import { scaleLinear as ScaleLinear } from 'd3-scale';
import { line as Line, area as Area } from 'd3-shape';
import Bus from '@/helpers/bus';
import * as d3 from 'd3';

export default {
  data() {
    return {
      width: 0,
      height: 0,
      sysWidth: 0,
      sysHeight: 0,
      current: 1,
      getMaxArea: 0,
    };
  },
  components: {},
  computed: {
    // getMaxArea() {
    //   // return this.maxData(this.datasent) > this.maxData(this.datarecv) ? this.maxData(this.datasent) : this.maxData(this.datarecv);
    //   // let max = 0;
    //   // this.datasent.forEach((arr) => {
    //   //   if (max < arr) {
    //   //     max = arr;
    //   //   }
    //   // });
    //   // this.datarecv.forEach((arr) => {
    //   //   if (max < arr) {
    //   //     max = arr;
    //   //   }
    //   // });
    //   return 0;
    // },
    datasent() { return this.datanet.bytes_sent; },
    datarecv() { return this.datanet.bytes_recv; },
    datasentS() {
      let datasentStr = '';
      if (this.datanet.bytes_sent === undefined) {
        datasentStr = '0KB/s';
      } else {
        if (this.datanet.bytes_sent[0] / 1024 > 0 && this.datanet.bytes_sent[0] / 1024 < 1024) {
          datasentStr = `${(this.datanet.bytes_sent[0] / 1024).toFixed(2)}KB/s`;
        } else if (this.datanet.bytes_sent[0] / 1024 >= 1024 && this.datanet.bytes_sent[0] / 1024 < Math.pow(1024, 2)) {
          datasentStr = `${(this.datanet.bytes_sent[0] / Math.pow(1024, 2)).toFixed(2)}MB/s`;
        } else {
          datasentStr = `${(this.datanet.bytes_sent[0] / Math.pow(1024, 3)).toFixed(2)}GB/s`;
        }
      }
      return datasentStr;
    },
    datarecvS() {
      let datarecvStr = '';
      if (this.datanet.bytes_recv === undefined) {
        datarecvStr = '0KB/s';
      } else {
        if (this.datanet.bytes_recv[0] / 1024 > 0 && this.datanet.bytes_recv[0] / 1024 < 1024) {
          datarecvStr = `${(this.datanet.bytes_recv[0] / 1024).toFixed(2)}KB/s`;
        } else if (this.datanet.bytes_recv[0] / 1024 >= 1024 && this.datanet.bytes_recv[0] / 1024 < Math.pow(1024, 2)) {
          datarecvStr = `${(this.datanet.bytes_recv[0] / Math.pow(1024, 2)).toFixed(2)}MB/s`;
        } else {
          datarecvStr = `${(this.datanet.bytes_recv[0] / Math.pow(1024, 3)).toFixed(2)}GB/s`;
        }
      }
      return datarecvStr;
    },
    yEnd() {
      return this.sysHeight;
    },
    xEnd() {
      return this.sysWidth;
    },
    view() {
      return [0, 0, this.sysWidth, this.sysHeight];
    },
    one() {
      const hei = this.sysHeight;
      const wid = this.sysWidth;
      const xScale = ScaleLinear().domain([60, 0]).range([0, wid]);
      const sentdata = this.datasent;
      const mdata = this.$options.methods.maxData(sentdata);
      const yScale = ScaleLinear().domain([0, mdata]).range([hei, 0]);
      const line = Line()
        .x((d, i) => xScale(i))
        .y(d => yScale(d));
      return line;
    },
    two() {
      const hei = this.sysHeight;
      const wid = this.sysWidth;
      const xScale = ScaleLinear().domain([60, 0]).range([0, wid]);
      const sentdata = this.datasent;
      const mdata = this.$options.methods.maxData(sentdata);
      const yScale = ScaleLinear().domain([0, mdata]).range([hei, 0]);
      const line = Area()
        .x((d, i) => xScale(i))
        .y0(hei)
        .y1(d => yScale(d));
      return line;
    },
    three() {
      const hei = this.sysHeight;
      const wid = this.sysWidth;
      const xScale = ScaleLinear().domain([60, 0]).range([0, wid]);
      const sentdata = this.datarecv;
      const mdata = this.$options.methods.maxData(sentdata);
      const yScale = ScaleLinear().domain([0, mdata]).range([hei, 0]);
      const line = Line()
        .x((d, i) => xScale(i))
        .y(d => yScale(d));
      return line;
    },
    four() {
      const hei = this.sysHeight;
      const wid = this.sysWidth;
      const xScale = ScaleLinear().domain([60, 0]).range([0, wid]);
      const sentdata = this.datarecv;
      const mdata = this.$options.methods.maxData(sentdata);
      const yScale = ScaleLinear().domain([0, mdata]).range([hei, 0]);
      const line = Area()
        .x((d, i) => xScale(i))
        .y0(hei)
        .y1(d => yScale(d));
      return line;
    },
  },
  methods: {
    eth(k) {
      this.current = k;
      Bus.$emit('clickTab', `${this.datanet.net[k - 1]}`);
    },
    maxData(arr) {
      let maxdata = 0;
      maxdata = d3.max([maxdata, d3.max(arr.map(d => parseFloat(d)))]);
      const numsize = parseInt(Math.round(maxdata).toString().length, 10);
      const firstnum = Math.ceil(maxdata / Math.pow(10, numsize - 1));
      if (maxdata <= 100) {
        return 100;
      }
      if (firstnum < 6) {
        return firstnum * Math.pow(10, numsize - 1);
      }
      return Math.ceil(firstnum / 2) * 2 * Math.pow(10, numsize - 1);
    },
  },
  props: ['datanet'],
  mounted() {
    this.sysHeight = this.$refs.svgHeight.clientHeight;
    this.sysWidth = this.$refs.svgHeight.clientWidth;
  },
  updated() {
    let max = 0;
    if (this.datasent && this.datarecv) {
      this.datasent.forEach((arr) => {
        if (max < arr) {
          max = arr;
        }
      });
      this.datarecv.forEach((arr) => {
        if (max < arr) {
          max = arr;
        }
      });
      this.getMaxArea = max;
    }
  },
};
</script>
<style scoped>
.righttime {
  position: relative;
  float: right;
}
.tug{
  z-index: 4;
  display: none;
}
.inner-line line {
  fill: none;
  stroke: #08252b;
  stroke-width: 1px;
}
.sys-cpu-color1 {
  stroke: rgb(22, 228, 205);
  fill: none;
  stroke-width: 1;
}
.sys-cpu-color2{
  stroke: #188be4;
  fill: none;
  stroke-width: 1;
}
.status-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  top: 175px;
}
.tit-table {
  width: 100%;
  margin-left: -10px;
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
/* 网络 */
.svgpath {
  display: block;
}
.network-name-ul {
  position: absolute;
  top: 15px;
  left: 160px;
}
.network-name-ul li {
  padding: 0 20px;
  margin: 0 10px;
}
.network-name-ul li,
.network-name-ul li a {
  text-align: center;
  display: inline-block;
  height: 40px;
  line-height: 40px;
  font-size: 20px;
}
.eth0 {
  border-bottom: 2px solid rgb(96, 148, 206);
  color: rgb(96, 148, 206);
}
ul li {
  list-style: none;
}
.network-name-ul li a {
  text-align: center;
  display: inline-block;
  height: 40px;
  line-height: 40px;
  font-size: 20px;
  color: #fff;
}
.network-name-ul li:hover {
  border-bottom: 2px solid rgb(96, 148, 206);
  color: rgb(96, 148, 206);
}
.legendDiv {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left:0;right: 0;
  /* top: 0;bottom: 0; */
  margin:auto;
  width: 100%;
  bottom: -20px;
  white-space: nowrap;
}
.up {
  background: rgb(22, 228, 205);
}
.down {
  background: rgb(24, 139, 228);
}
.statusLegend {
  width: 10px;
  height: 10px;
  display: inline-block;
  margin: 0 5px;
}
.speed{
  display: none;
}
.speed-1 {
  position: absolute;
  top:0;
  left: 101%;
}
.speed-2 {
  position: absolute;
  top:96%;
  left: 101%;
}
#cpuUseFactor{
  font-size:12px;
  color: #888;
  line-height: 30px;
}
</style>

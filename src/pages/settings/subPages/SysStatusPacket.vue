<template>
  <div class='status-content'>
    <table class="tit-table">
      <tr>
        <td class="sys-chart-tit">丢包监控</td>
      </tr>
    </table>
    <div class="packet-main">
      <div class="operate-box">
        显示切换<RadioBtn :msg="['图形', '表格']" :activeIndex="switchStatus ? 0 : 1" @check-btn="switchStatus = !switchStatus"/>
      </div>
      <div class="chart-div" id="cpu_chart" ref="svgHeight" v-if="switchStatus">
          <div class="legendDiv">
            <div>
              <span class="statusLegend performance"></span>
              <span>性能丢失</span>
            </div>
            <div>
              <span class="statusLegend initial"></span>
              <span>主动丢弃</span>
            </div>
            <div>
              <span class="statusLegend filter"></span>
              <span>过滤</span>
            </div>
        </div>
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
            <g class="tug">
              <path class="sys-cpu-color1" :d="one(dataperformance)"></path>
              <path class="area area0" fill="url(#area_filter2)" :d="two(dataperformance)"></path>
              <path class="sys-cpu-color2" :d="three(datainitiative)"></path>
              <path class="area area1" fill="url(#area_filter3)" :d="four(datainitiative)"></path>
              <path class="sys-cpu-color3" :d="five(datafilter)"></path>
              <path class="area area1" fill="url(#area_filter4)" :d="six(datafilter)"></path>
            </g>
          </g>
        </svg>
        <div class="time">
          <span class="lefttime">60min</span>
          <span class="righttime">0min</span>
        </div>
      </div>
      <div class="data-table" v-else>
        <table class="fix-title">          
          <thead>
            <td>时间</td>
            <td>
              <span>性能丢失(pkts)</span>
            </td>
            <td>
              <span>主动丢弃(pkts)</span>
            </td>
            <td>
              <span>过滤(pkts)</span>
            </td>
          </thead>
        </table>
        <div class="table-main">
          <ScrollBar v-if="hasData" class="table-container">
            <table>
              <thead>
                <td>时间</td>
                <td>
                  <span>性能丢失(pkts)</span>
                </td>
                <td>
                  <span>主动丢弃(pkts)</span>
                </td>
                <td>
                  <span>过滤(pkts)</span>
                </td>
              </thead>
              <tbody>
                <tr v-for="(item, index) in tableList" :key="index">
                  <td v-for="(x, i) in item" :key="i">{{x}}</td>
                </tr>
              </tbody>
            </table>
          </ScrollBar>
          <div v-else class="deal-content">
            <span>暂无数据</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ScrollBar from '@/components/common/ScrollBar';
import RadioBtn from '@/components/common/RadioBtn';
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
      loading: true,
      tableList: [],
      switchStatus: true,
    };
  },
  components: { ScrollBar, RadioBtn },
  computed: {
    hasData() {
      return !this.loading && this.tableList.length !== 0;
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
      const xScale = ScaleLinear().domain([360, 0]).range([0, wid]);
      const sentdata = this.dataperformance;
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
      const xScale = ScaleLinear().domain([360, 0]).range([0, wid]);
      const sentdata = this.dataperformance;
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
      const xScale = ScaleLinear().domain([360, 0]).range([0, wid]);
      const sentdata = this.datainitiative;
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
      const xScale = ScaleLinear().domain([360, 0]).range([0, wid]);
      const sentdata = this.datainitiative;
      const mdata = this.$options.methods.maxData(sentdata);
      const yScale = ScaleLinear().domain([0, mdata]).range([hei, 0]);
      const line = Area()
        .x((d, i) => xScale(i))
        .y0(hei)
        .y1(d => yScale(d));
      return line;
    },
    five() {
      const hei = this.sysHeight;
      const wid = this.sysWidth;
      const xScale = ScaleLinear().domain([360, 0]).range([0, wid]);
      const sentdata = this.datafilter;
      const mdata = this.$options.methods.maxData(sentdata);
      const yScale = ScaleLinear().domain([0, mdata]).range([hei, 0]);
      const line = Line()
        .x((d, i) => xScale(i))
        .y(d => yScale(d));
      return line;
    },
    six() {
      const hei = this.sysHeight;
      const wid = this.sysWidth;
      const xScale = ScaleLinear().domain([360, 0]).range([0, wid]);
      const sentdata = this.datafilter;
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
      Bus.$emit('clickTab', `eth${k - 1}`);
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
    dealData(data) {
      const list = data;
      if (data.length < 20) {
        list.push(['', '', '', '']);
        this.dealData(list);
      }
      return list;
    },
  },
  props: ['dataperformance', 'datainitiative', 'datafilter', 'formData'],
  watch: {
    formData(newVal) {
      this.loading = false;
      if (newVal.length !== 0) {
        this.tableList = this.dealData(newVal);
      } else {
        this.tableList = [];
      }
    },
  },
  mounted() {
    this.sysHeight = this.$refs.svgHeight.clientHeight;
    this.sysWidth = this.$refs.svgHeight.clientWidth;
  },
};
</script>
<style lang="scss">
  .packet-main{
    .operate-box{
      .radio-btn-wrap{
        display: inline-block;
        margin-left: 10px;
        vertical-align: middle;
        button{
          height: 30px !important;
          border: 1px solid #16b8a5 !important;
          padding: 0 10px !important;
          box-sizing: border-box;
          font-size: 14px; 
          color:#fff !important;
          cursor: pointer;
          &:first-child{
            border-radius: 3px 0 0 3px;
          }
          &:last-child {
            border-radius: 0 3px 3px 0;
          }
          &.active, &:hover{
            background-color: #16b8a5 !important;;
          }
        }
      }
    }
    .ps--active-y > .ps__rail-y{
      width: 5px;
      background-color: #0b1b29;
      opacity: 1;
    }
    .ps__thumb-y{
      width: 3px;
      right: 1px;
      background: #1d5d82;
      &:hover{
        background: #1498d6;
        width: 3px !important;
      }
    }
  }
</style>
<style lang="scss" scoped>
.righttime {
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
.sys-cpu-color1 {
  stroke: #b84b3a;
  fill: none;
  stroke-width: 1;
}
.sys-cpu-color2{
  stroke: #15b1d2;
  fill: none;
  stroke-width: 1;
}
.sys-cpu-color3{
  stroke: #e2da8f;;
  fill: none;
  stroke-width: 1;
}
.status-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 50px;
  top: 175px;
}
.tit-table {
  width: calc(100% - 15px);
  margin-left: -10px;
  border-spacing: 10px;
}
.packet-main{
  width: 100%;
  position: absolute;
  top: 85px;
  left: 0px;
  bottom: 8px;
  font-size: 0;
  .operate-box{
    font-size: 14px;
    margin-top: -35px;
    margin-bottom: 12px;
  }
  >div:not(:first-child){
    display: inline-block;
    vertical-align: middle;
    height: 100%;
  }
  .data-table{
    width: calc(100% - 15px);
    position: relative;
    color: #f3f3f3;
    table {
      width: 100%;
      border-collapse: collapse;
      &.fix-title{
        position: absolute;
        top:0;
        left: 0;
        z-index: 9;
        td{
          span{
            display: block;
          }
        }
      }
      >div{
        height: 100%;
        overflow: auto;
      }
      thead{
        font-size:14px;
        td{
          background-color: #11364b;
          line-height: 35px;
          &:first-child{
            border-radius: 3px 0 0 0;
          }
          &:last-child{
            border-radius: 3px 0 0 0;
          }
        }
      }
      tbody{
        font-size:14px;
        background-color: #0b1b29;
        tr{
          background-color: #0b1b29;
          &:nth-child(2n) {
            background-color: #092535;
          }
          td{
            height: 27px;
          }
        }
      }
      td{
        width:126px;
        box-sizing: border-box;
        text-align: center;
      }
    }
    .table-main{
      height:100%;
      .table-container{
        height: 100%;
        border-radius: 3px;
      }
      .deal-content{
        width: 100%;
        height: 100%;
        background: #0b1b29;
        padding-top: 50px;
        span{
          display: block;
          font-size: 14px;
          width: 100%;
          text-align: center;
        }
      }
    }
  }
  .chart-div {
    width: calc(100% - 15px);
    font-size: 14px;
  }
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
.svgpath {
  display: block;
}

.legendDiv {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: absolute;
  width: 270px;
  top: -30px;
  right: 15px;
  div{
    margin-left: 15px;
    &:nth-of-type(1){
      margin: 0;
    }
    >span:nth-of-type(2){
      color:#888;
      font-size: 12px;
    }
  }
}
.filter {
  background: #e2da8f;
}
.initial {
  background: #15b1d2;
}
.performance {
  background: #b84b3a;
}
.statusLegend {
  width: 10px;
  height: 10px;
  display: inline-block;
  margin: 0 3px;
}
</style>

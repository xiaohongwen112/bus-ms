<template>
  <div class='user-right-div' id='bmsStatusRight'>
    <div class='sys-status-div' id='sys_status_div'>
      <ul class='status-menu sys-status-ul' id='sys_status_ul'>
        <li class='sys-status-li' :class="{'click-sys': nowClick === 1}">
          <a @click="changeWhich(1, 'cpu')">
            <div class="thumbnail-div">
              <svg width="100%" height="80" class="chart-svg" viewBox="0,0,150,80" preserveAspectRatio="none">
                <rect x="0" y="0" width="100%" height="80" fill="#01080d" stroke="#0d5b58" stroke-width="2"></rect>
                <g class="pathGroup">
                  <path class="sys-cpu" stroke="rgb(22, 228, 205)" fill="none" stroke-width="1" :d="scaleLinear(chartData.cpu)"></path>
                  <path class="area area0" fill="url(#area_green0)" :d="scaleArea(chartData.cpu)"></path>
                </g>
              </svg>
            </div>
            <p class="thum-info">CPU</p>
            <p class="thum-info cpuData" :data-msg="true" ref="cpu"><span class="data">{{ this.currentData.cpu }}</span>%</p>
            <div class="hideDiv" id="cputit">cpu : {{ this.currentData.cpu }}%</div>
          </a>
        </li>
        <li class='sys-status-li' :class="{'click-sys': nowClick === 2}">
          <a @click="changeWhich(2, 'db')">
            <div class="thumbnail-div">
              <svg width="100%" height="80" class="chart-svg" viewBox="0,0,150,80" preserveAspectRatio="none">
                <rect x="0" y="0" width="100%" height="80" fill="#01080d" stroke="#0d5b58" stroke-width="2"></rect>
                <g class="pathGroup">
                  <path class="sys-cpu" stroke="rgb(22, 228, 205)" fill="none" stroke-width="1" :d="scaleLinear(chartData.db)"></path>
                  <path class="area area0" fill="url(#area_green0)" :d="scaleArea(chartData.db)"></path>
                </g>
              </svg>
            </div>
            <p class="thum-info">数据库</p>
            <p class="thum-info" :data-msg="true" id="db"><span class="data">{{ this.currentData.db }}</span>%</p>
            <div class="hideDiv" id="dbtit">数据库 : {{ this.currentData.db }}%</div>
          </a>
        </li>
        <li class='sys-status-li' :class="{'click-sys': nowClick === 3}">
          <a @click="changeWhich(3, 'mem')">
            <div class="thumbnail-div">
              <svg width="100%" height="80" class="chart-svg" viewBox="0,0,150,80" preserveAspectRatio="none">
                <rect x="0" y="0" width="100%" height="80" fill="#01080d" stroke="#0d5b58" stroke-width="2"></rect>
                <g class="pathGroup">
                  <path class="sys-cpu" stroke="rgb(22, 228, 205)" fill="none" stroke-width="1" :d="scaleLinear(chartData.mem)"></path>
                  <path class="area area0" fill="url(#area_green0)" :d="scaleArea(chartData.mem)"></path>
                </g>
              </svg>
            </div>
            <p class="thum-info">内存</p>
            <p class="thum-info" :data-msg="true" id="memory"><span class="data">{{ this.currentData.mem }}</span>%</p>
            <div class="hideDiv" id="memtit">内存 : {{ this.currentData.mem }}%</div>
          </a>
        </li>
        <li class='sys-status-li' :class="{'click-sys': nowClick === 4}">
          <a @click="changeWhich(4, 'net')">
            <div class="thumbnail-div">
              <svg width="100%" height="80" class="chart-svg" viewBox="0,0,150,80" preserveAspectRatio="none">
                <rect x="0" y="0" width="100%" height="80" fill="#01080d" stroke="#0d5b58" stroke-width="2"></rect>
                <g class="pathGroup">
                  <path class="sys-cpu" stroke="rgb(22, 228, 205)" fill="none" stroke-width="1" :d="netLineonesent(sent)"></path>
                  <path class="area area0" fill="url(#area_green0)" :d="netAreaonesent(sent)"></path>
                  <path class="sys-cpu-color2" stroke="#188be4" fill="none" stroke-width="1" :d="netLineoneRecv(recv)"></path>
                  <path class="area area0" fill="url(#area_green1)" :d="netAreaoneRecv(recv)"></path>
                </g>
              </svg>
            </div>
            <p class="thum-info">网络</p>
            <p class="thum-info" :data-msg="true" id="network"><span class="data">
              {{ this.currentData.netText !== undefined ? Number(parseFloat(this.currentData.netText)) : '' }}
              </span>
              {{ this.currentData.netText !== undefined ? this.currentData.netText.replace(/[^A-Za-z]/ig, '') : '' }}
              </p>
            <div class="hideDiv" id="nettit">网络 : {{ this.currentData.netText }}</div>
          </a>
        </li>
        <li class='sys-status-li' :class="{'click-sys': nowClick === 5}">
          <a @click="changeWhich(5, 'store')">
            <div class="thumbnail-div">
              <svg width="100%" height="80" class="chart-svg" viewBox="0,0,150,80" preserveAspectRatio="none">
                <rect x="0" y="0" width="100%" height="80" fill="#01080d" stroke="#0d5b58" stroke-width="2"></rect>
                <g class="pathGroup">
                  <path class="sys-cpu" stroke="rgb(22, 228, 205)" fill="none" stroke-width="1" :d="scaleLinear(chartData.store)"></path>
                  <path class="area area0" fill="url(#area_green0)" :d="scaleArea(chartData.store)"></path>
                </g>
              </svg>
            </div>
            <p class="thum-info">存储</p>
            <p class="thum-info" :data-msg="true" id="disk"><span class="data">{{ this.currentData.store }}</span>%</p>
            <div class="hideDiv" id="disktit">存储 : {{ this.currentData.store }}%</div>
          </a>
        </li>
        <li class='sys-status-li' :class="{'click-sys': nowClick === 6}">
          <a @click="changeWhich(6, 'packet')">
            <div class="thumbnail-div">
              <svg width="100%" height="80" class="chart-svg" viewBox="0,0,150,80" preserveAspectRatio="none">
                <rect x="0" y="0" width="100%" height="80" fill="#01080d" stroke="#0d5b58" stroke-width="2"></rect>
                <g class="pathGroup">
                  <path class="sys-cpu-color1" :d="perforline(performance)"></path>
                  <path class="area area0" fill="url(#area_filter2)" :d="perforarea(performance)"></path>
                  <path class="sys-cpu-color2" :d="initline(initiative)"></path>
                  <path class="area area0" fill="url(#area_filter3)" :d="initarea(initiative)"></path>
                  <path class="sys-cpu-color3" :d="filterline(filter)"></path>
                  <path class="area area0" fill="url(#area_filter4)" :d="filterarea(filter)"></path>
                </g>
              </svg>
            </div>
            <p class="thum-info">丢包监控</p>
            <p class="packetData" :data-msg="true" ref="packet">{{ currentData.discard.all }}</p>
            <div class="hideDiv" id="packettit">丢包监控 : {{ currentData.discard.all }}</div>
          </a>
        </li>
        <li class='sys-status-li' :class="{'click-sys': nowClick === 7}">
          <a @click="changeWhich(7, 'process')">
            <div class="thumbnail-div">
              <div class="process-thumbnail-div" v-if="seen" v-for="(d, index) in detailall[0]" :key="`bar${index}`">
                <div class="stop-process process-small"></div>
              </div>
              <div class="process-thumbnail-div" v-for="(r, index) in utilization[5]" :key="`main${index}`">
                <div class="running-process process-small"></div>
              </div>
            </div>
            <p class="thum-info">业务监控进程</p>
            <p class="thum-info" :data-msg="true" id="process"><span class="data">{{ utilization[5] }}</span>个</p>
            <div class="hideDiv" id="protit">业务监控进程 : {{ utilization[5] }}个</div>
          </a>
        </li>
      </ul>
      <router-view class="view" :datadetai="detailall" :data="utilization" :datacpu="chartData.cpu" :datadb="chartData.db"
                   :datamem="chartData.mem" :datadisk="chartData.store" :datanet="netData" :dataperformance="performance"
                   :datainitiative="initiative" :datafilter="filter" :formData="formData" ></router-view>
    </div>
    <svg width="0" height="0">
      <g class="defs-g">
        <defs id="defs_area_green0">
          <linearGradient id="area_green0" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color: rgb(22, 228, 205); stop-opacity: 0.3;">
            </stop>
            <stop offset="100%" style="stop-color: rgb(22, 228, 205); stop-opacity: 0.1;">
            </stop>
          </linearGradient>
        </defs>
        <defs id="defs_area_green1">
          <linearGradient id="area_green1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color: rgb(24, 139, 228); stop-opacity: 0.3;">
            </stop>
            <stop offset="100%" style="stop-color: rgb(24, 139, 228); stop-opacity: 0.1;">
            </stop>
          </linearGradient>
        </defs>
        <defs id="defs_area_filter2">
          <linearGradient id="area_filter2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color: #b84b3a; stop-opacity: 0.3;">
            </stop>
            <stop offset="100%" style="stop-color: #b84b3a; stop-opacity: 0.1;">
            </stop>
          </linearGradient>
        </defs>
        <defs id="defs_area_filter3">
          <linearGradient id="area_filter3" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color: #15b1d2; stop-opacity: 0.3;">
            </stop>
            <stop offset="100%" style="stop-color: #15b1d2; stop-opacity: 0.1;">
            </stop>
          </linearGradient>
        </defs>
        <defs id="defs_area_filter4">
          <linearGradient id="area_filter4" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color: #e2da8f; stop-opacity: 0.3;">
            </stop>
            <stop offset="100%" style="stop-color: #e2da8f; stop-opacity: 0.1;">
            </stop>
          </linearGradient>
        </defs>
      </g>
    </svg>
  </div>
</template>

<script>
import Bus from '@/helpers/bus';
import { scaleLinear as ScaleLinear } from 'd3-scale';
import { line as Line, area as Area } from 'd3-shape';
import Loading from '@/components/common/Loading';
import * as d3 from 'd3';
import { statusNavList, addUnit } from '../utils';

export default {
  name: 'main',
  components: { Loading },
  data() {
    return {
      ok: true,
      seen: false,
      currentNode: null,
      detailall: [],
      utilization: [],
      // itemcpu: [],
      // itemdb: [],
      // itemmem: [],
      // itemdisk: [],
      itempacket: [],
      net: [],
      nownet: '', // 当前网络
      nownetData: {
        // net: [],
      }, // 当前网络
      tabs: ['cpu', 'db', 'mem', 'net', 'store', 'packet', 'process'],
      nowClick: 1,
      network_data: {},
      sent: [],
      recv: [],
      performance: [],
      initiative: [],
      filter: [],
      formData: [],
      navList: statusNavList,
      count: 0,
      currentData: {
        discard: {
          all: '',
        },
      },
      chartData: { // 图
        cpu: [],
        db: [],
        mem: [],
        net: [],
        process: [],
        store: [],
        discard: {
          performance: 0,
          initiative: 0,
          filter: 0,
          all: '--',
        },
      },
    };
  },
  computed: {
    netData() { return Object.assign({}, { net: this.net }, this.network_data[this.nownet]); },
    scaleLinear() {
      const xScale = ScaleLinear()
        .domain([60, 0])
        .range([0, 150]);
      const yScale = ScaleLinear()
        .domain([0, 100])
        .range([78, 2]);
      const line = Line()
        .x((d, i) => xScale(i))
        .y(d => yScale(d));
      return line;
    },
    scaleArea() {
      const xScale = ScaleLinear()
        .domain([60, 0])
        .range([0, 150]);
      const yScale = ScaleLinear()
        .domain([0, 100])
        .range([80, 0]);
      const line = Area()
        .x((d, i) => xScale(i))
        .y0(80)
        .y1(d => yScale(d));
      return line;
    },
    netLineonesent() {
      const xScale = ScaleLinear()
        .domain([60, 0])
        .range([0, 150]);
      const sentdata = this.sent;
      const mdata = this.$options.methods.maxData(sentdata);
      const yScale = ScaleLinear()
        .domain([0, mdata])
        .range([80, 0]);
      const line = Line()
        .x((d, i) => xScale(i))
        .y(d => yScale(d));
      return line;
    },
    netAreaonesent() {
      const xScale = ScaleLinear()
        .domain([60, 0])
        .range([0, 150]);
      const sentdata = this.sent;
      const mdata = this.$options.methods.maxData(sentdata);
      const yScale = ScaleLinear()
        .domain([0, mdata])
        .range([80, 0]);
      const line = Area()
        .x((d, i) => xScale(i))
        .y0(80)
        .y1(d => yScale(d));
      return line;
    },
    netLineoneRecv() {
      const xScale = ScaleLinear()
        .domain([60, 0])
        .range([0, 150]);
      const sentdata = this.recv;
      const mdata = this.$options.methods.maxData(sentdata);
      const yScale = ScaleLinear()
        .domain([0, mdata])
        .range([80, 0]);
      const line = Line()
        .x((d, i) => xScale(i))
        .y(d => yScale(d));
      return line;
    },
    netAreaoneRecv() {
      const xScale = ScaleLinear()
        .domain([60, 0])
        .range([0, 150]);
      const sentdata = this.recv;
      const mdata = this.$options.methods.maxData(sentdata);
      const yScale = ScaleLinear()
        .domain([0, mdata])
        .range([80, 0]);
      const line = Area()
        .x((d, i) => xScale(i))
        .y0(80)
        .y1(d => yScale(d));
      return line;
    },
    perforline() {
      const xScale = ScaleLinear()
        .domain([360, 0])
        .range([0, 150]);
      const sentdata = this.performance;
      const mdata = this.maxData(sentdata);
      const yScale = ScaleLinear()
        .domain([0, mdata])
        .range([78, 0]);
      const line = Line()
        .x((d, i) => xScale(i))
        .y(d => yScale(d));
      return line;
    },
    perforarea() {
      const xScale = ScaleLinear()
        .domain([360, 0])
        .range([0, 150]);
      const sentdata = this.performance;
      const mdata = this.maxData(sentdata);
      const yScale = ScaleLinear()
        .domain([0, mdata])
        .range([78, 0]);
      const line = Area()
        .x((d, i) => xScale(i))
        .y0(78)
        .y1(d => yScale(d));
      return line;
    },
    initline() {
      const xScale = ScaleLinear()
        .domain([360, 0])
        .range([0, 150]);
      const sentdata = this.initiative;
      const mdata = this.maxData(sentdata);
      const yScale = ScaleLinear()
        .domain([0, mdata])
        .range([78, 0]);
      const line = Line()
        .x((d, i) => xScale(i))
        .y(d => yScale(d));
      return line;
    },
    initarea() {
      const xScale = ScaleLinear()
        .domain([360, 0])
        .range([0, 150]);
      const sentdata = this.initiative;
      const mdata = this.maxData(sentdata);
      const yScale = ScaleLinear()
        .domain([0, mdata])
        .range([78, 0]);
      const line = Area()
        .x((d, i) => xScale(i))
        .y0(78)
        .y1(d => yScale(d));
      return line;
    },
    filterline() {
      const xScale = ScaleLinear()
        .domain([360, 0])
        .range([0, 150]);
      const sentdata = this.filter;
      const mdata = this.maxData(sentdata);
      const yScale = ScaleLinear()
        .domain([0, mdata])
        .range([78, 0]);
      const line = Line()
        .x((d, i) => xScale(i))
        .y(d => yScale(d));
      return line;
    },
    filterarea() {
      const xScale = ScaleLinear()
        .domain([360, 0])
        .range([0, 150]);
      const sentdata = this.filter;
      const mdata = this.maxData(sentdata);
      const yScale = ScaleLinear()
        .domain([0, mdata])
        .range([78, 0]);
      const line = Area()
        .x((d, i) => xScale(i))
        .y0(78)
        .y1(d => yScale(d));
      return line;
    },
  },
  created() {
    Bus.$on('clickTab', (val) => {
      this.nownet = val;
      Object.assign(this.nownetData, {
        sent: this.network_data[this.nownet].bytes_sent,
        recv: this.network_data[this.nownet].bytes_recv,
        throughput: this.network_data[this.nownet].throughput,
      });
    });
    const currentTab = this.$route.name;
    const tabIndex = this.tabs.indexOf(currentTab);
    if (tabIndex > -1) {
      this.nowClick = tabIndex + 1;
    }
  },
  methods: {
    bouncer(arr) {
      return arr.filter((val) => { // eslint-disable-line
        return !(!val || val === '');
      });
    },
    changeWhich(index, position) {
      this.nowClick = index;
      this.$router.push({ name: position });
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
    getSelfCheck() {
      const event = new EventSource('/zh-cn/manager/selfcheck/data');
      event.addEventListener(
        'self_check',
        (e) => {
          const data = JSON.parse(e.data);
          console.log(data.network);
          const packetper = data.brokenline_data.performanceDrops;
          const packetini = data.brokenline_data.initiativeDrops;
          const packetfil = data.brokenline_data.filterDrops;

          let allthroughput = 0;
          data.network.forEach((arr) => {
            allthroughput += arr.throughput;
          });

          this.currentData = {
            cpu: data.cpu.cpu,
            db: Number((data.db.capacity / data.db.all * 100).toFixed(1)),
            mem: data.memory,
            store: data.disk,
            net: allthroughput,
            netText: addUnit(allthroughput, 'iB'),
            // process: [],
            // store: [],
            discard: {
              performance: data.brokenline_data.performanceDrops,
              initiative: data.brokenline_data.initiativeDrops,
              filter: data.brokenline_data.filterDrops,
              all: isNaN(packetper + packetini + packetfil) ? '--' : (packetper + packetini + packetfil),
            },
          };
          const cpuData = data.cpu.cpu;
          const db = (data.db.capacity / data.db.all * 100).toFixed(1);
          const memory = data.memory;
          for (let k = 0; k < data.network.length; k += 1) {
            this.net.push(data.network[k].name);// ------------------------------------------
            if (this.nownet === '') {
              this.nownet = data.network[0].name;
            }
            if (this.network_data[data.network[k].name] && this.network_data[data.network[k].name].bytes_recv && this.network_data[data.network[k].name].bytes_sent) {
              this.network_data[data.network[k].name].bytes_recv.unshift(data.network[k].bytes_recv);
              this.network_data[data.network[k].name].bytes_sent.unshift(data.network[k].bytes_sent);
              this.network_data[data.network[k].name].throughput = addUnit(data.network[k].throughput, 'iB');
              if (this.count > 61) {
                this.network_data[data.network[k].name].bytes_recv.pop();
                this.network_data[data.network[k].name].bytes_sent.pop();
              }
            } else {
              this.network_data[data.network[k].name] = {
                bytes_recv: [data.network[k].bytes_recv],
                bytes_sent: [data.network[k].bytes_sent],
              };
            }
          }
          this.net = new Set(this.net);
          this.net = [...this.net];
          this.sent = this.network_data[this.nownet].bytes_sent;
          this.recv = this.network_data[this.nownet].bytes_recv;
          this.formData = data.form_data;
          const disk = data.disk;
          const process = data.process.process.length;
          const processdeatails = data.process.details;

          const dbstatus = data.db.status === 1 ? '正常' : '错误';
          const dbconn = data.db.conn_number;
          const dbout = data.db.network.out;
          const dbin = data.db.network.in;
          const dbnum = data.db.network.num_request;
          const model = data.cpu.model;
          const cpumhz = data.cpu.cpumhz;
          const num = data.cpu.num;
          this.utilization = []; // 当前显示
          this.utilization.push(cpuData);
          this.utilization.push(db);
          this.utilization.push(memory);
          this.utilization.push('');
          this.utilization.push(disk);
          this.utilization.push(process);
          this.utilization.push(dbstatus);
          this.utilization.push(dbconn);
          this.utilization.push(dbout);
          this.utilization.push(dbin);
          this.utilization.push(dbnum);
          this.utilization.push(model);
          this.utilization.push(num);
          this.utilization.push(cpumhz);
          const processnum = data.process.process.map((item) => { // eslint-disable-line
            if (item[1] === 'RUNNING') return item[0];
            else return ''; // eslint-disable-line
          });
          this.detailall = [];
          if (processdeatails) {
            this.seen = true;
            this.detailall.push(processdeatails);
          } else {
            this.seen = false;
            this.detailall.push([]);
          }
          this.detailall.push(this.bouncer(processnum));
          if ((this.count % 10) === 0) {
            this.performance.unshift(packetper);
            this.initiative.unshift(packetini);
            this.filter.unshift(packetfil);
          }
          for (let p = 0; p < process; p += 1) {
            this.utilization.push(data.process.process[p][0]);
          }
          if (this.count > 3601) {
            this.performance.pop();
            this.initiative.pop();
            this.filter.pop();
          }
          // new
          statusNavList.forEach((key) => {
            // 添加
            this.chartData[key].unshift(this.currentData[key]);
            if (this.count > 60) {
              // 移除
              this.chartData[key].pop();
            }
          });
          this.count += 1;
        },
        false,
      );
    },
    getChartData() {
      const eventData = new EventSource('/zh-cn/basisinfo/');
      eventData.addEventListener(
        'sysstatus',
        (e) => {
          const data = JSON.parse(e.data);
          console.log(data);
        },
        false,
      );
    },
  },
  mounted() {
    this.getSelfCheck();
  },
  // updated() {
  //   console.log(this.net);
  // },
};
</script>

<style lang="scss" scoped>
.sys-cpu-color1 {
  stroke: #b84b3a;
  fill: none;
  // stroke-width: 3;
}
.sys-cpu-color2{
  stroke: #15b1d2;
  fill: none;
  // stroke-width: 3;
}
.sys-cpu-color3{
  stroke: #e2da8f;;
  fill: none;
  // stroke-width: 3;
}
.hideDiv {
  position: absolute;
  border-radius: 8px 8px 8px 8px;
  display: none;
  color: #fff;
  font-size: 14px;
  z-index: 2;
  text-align: center;
  background: #18415f;
  margin: 0 auto;
  padding: 2px 5px;
}
.user-right-div {
  position: absolute;
  left: 15px;
  right: 0;
  top: 0;
  bottom: 0;
  overflow-x: hidden !important;
  overflow-y: auto;
  z-index: 8;
}
.sys-status-div {
  display: block;
  visibility: visible;
  height: auto;
}
.sys-status-ul {
  width: calc(100% - 15px);
  height: 100%;
  display: block;
  overflow: hidden;
  background-color: #0a2030;
}
.sys-status-ul li:hover {
  background-color: #143a54;
  border-bottom: 1px solid #38adb2;
}
.sys-status-ul li:hover .hideDiv {
  display: block;
}
.sys-status-ul li {
  display: inline-block;
  text-align: center;
  height: 174px;
  width: calc(100% / 7);
  padding: 10px 0 5px 0;
  float: left;
}
.click-sys {
  background-color: #143a54;
  border-bottom: 1px solid #38adb2;
}
.thumbnail-div {
  overflow: hidden;
  display: inline-block;
  width: 100%;
  height: 80px;
  border: 1px solid #1f3548;
  font-size: 0;
}
.sys-status-ul li a {
  display: inline-block;
  width: 70%;
  margin: 0 auto;
  text-align: center;
  color: #45d4bd;
  font-size: 18px;
}
a {
  text-decoration: none;
  cursor: pointer;
}
.sys-status-ul li p {
  margin-top: 1px;
  margin-left: 2px;
  margin-bottom: 0px;
  width: 109%;
}
.sys-status-ul li p:last-child {
  margin-top: 0;
}
.show {
  display: block;
}
.hide {
  display: none;
}
.status-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  top: 175px;
  width: 100%;
  height: calc(100% - 235px);
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

.thumbnail-div {
  width: 100%;
  margin-top: 10px;
  height: 80px;
  border: 1px solid #1f3548;
}
/* 业务监控 */
.process-thumbnail-div {
  display: inline-block;
  padding: 0px 2%;
  background: #01080d;
  height: auto;
  overflow: hidden;
}
.process-small {
  width: 4px;
  margin: 6px 0px;
  height: 27px;
}
.running-process {
  background: #36b374;
}
.stop-process {
  background: #cc2929;
}
/* alertwindow */
.alert-back-div {
  position: absolute;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
  left: 0;
  right: 0;
}
.alert-div {
  width: 415px;
  height: 200px;
  // background: #38adb2;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-size: cover;
  background: url(../../../assets/settings/alertbg.svg) no-repeat;
}
.alert-title-div {
  width: 100%;
  height: 40px;
  margin-top: 20px;
}
.alert-title-span {
  display: inline-block;
  height: 100%;
  width: auto;
  float: left;
  margin-left: 50px;
  line-height: 40px;
  color: #2bb4b5;
  font-size: 16px;
}
.alert-body-div {
  width: 100%;
  min-height: 40px;
  font-size: 16px;
  max-width: 335px;
  margin: 10px auto;
}
.alert-title-img {
  display: inline-block;
  height: 40px;
  float: right;
  width: 40px;
  cursor: pointer;
  line-height: 40px;
  font-size: 22px;
  color: #ababab;
  font-family: "黑体";
  text-align: center;
  margin-right: 10px;
  border-top-right-radius: 10px;
}
@media (max-width: 1358px) {
 .sys-status-ul li p.thum-info{
    font-size: 14px;
    .data{
      font-size: 18px;
    }
  }
}
</style>

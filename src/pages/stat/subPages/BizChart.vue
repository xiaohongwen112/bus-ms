<template>
  <div class="main">
    <div class="search-div">
      <SearchBar :panel="`biz_overview_chart`"
        :isStep='true' :currentTime="session$.ts"
        @search="submitSearch"></SearchBar>
    </div>
    <div class="chart-div">
      <ScrollBar class="scroll-area">
        <h6 style="display: none;">交易统计</h6>
        <div class="chart-item">
          <div class="chart-title">
            <i :class="`icon-bms-${chartList[0].icon}`"></i>
            <span class="chart-name">{{ chartList[0].text }}</span>
          </div>
          <div class="chart-div">
            <Pie3D :data="tradeTypeData" :unit="`ms`" @click="clickPie"></Pie3D>
          </div>
        </div>
        <div class="chart-item">
          <div class="chart-title">
            <i :class="`icon-bms-${chartList[1].icon}`"></i>
            <span class="chart-name">{{ chartList[1].text }}</span>
          </div>
          <div class="chart-div">
            <BarChart :data="delReturnCode(returnCodeData)" :unit="'笔'" :margin="margin" @click="clickBar"></BarChart>
          </div>
        </div>
        <div v-for="(item, index) in chartList.slice(2)" :key="index"
          class="chart-item">
          <div class="chart-title">
            <i :class="`icon-bms-${item.icon}`"></i>
            <span class="chart-name">{{ index === 0 && chartDataList[0].length !== 0 ? `交易量（${dealData().unit}）` : item.text }}</span>
          </div>
          <div class="chart-div">
            <AreaChart :type="`area`"
              :id="`item.id`"
              :legendStyle="`false`"
              :legend="item.legend"
              :unit="index === 0 && chartDataList[0].length !== 0 ? dealData().unit : item.unit "
              :xMarks="xMarks"
              :xText="Number(2)"
              :data="index === 0 ? dealData().data : chartDataList[index]"
              :baseline="chartData(index)"></AreaChart>
          </div>
        </div>
      </ScrollBar>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import ScrollBar from '@/components/common/ScrollBar';
import SearchBar from '@/components/stat/SearchBar';
import Pie3D from '@/components/common/Pie3D';
import BarChart from '@/components/common/BarChart';
import AreaChart from '@/components/common/AreaChart/index';
import { formatTransCount } from '@/helpers/utils';

export default {
  name: 'BizChart',
  components: {
    ScrollBar,
    SearchBar,
    Pie3D,
    BarChart,
    AreaChart,
  },
  data() {
    return {
      ddata: {
        xMarks: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        data: [0, 10, 2, 3, 4, 5, 6, 7, 8, 90],
      },
      margin: {
        left: 100,
        top: 30,
        right: 40,
        bottom: 40,
      },
    };
  },
  computed: {
    ...mapState({
      appId: state => state.appId,
      intfId: state => state.intfId,
      currentIp: state => state.currentIp,
      tsStart: state => state.panel.tsStart,
      tsEnd: state => state.panel.tsEnd,
      tradeTypeData: state => state.chart.tradeTypeData,
      returnCodeData: state => state.chart.returnCodeData,
      chartList: state => state.chart.chartList,
      xMarks: state => state.chart.xMarks,
      chartDataList: state => state.chart.chartDataList,
    }),
    areaOne() {
      return Array.from({ length: 6 }, () => Math.floor(Math.random() * 100));
    },
    areaTwo() {
      return Array.from({ length: 3 }, () => Array.from({ length: 6 }, () => Math.floor(Math.random() * 100)));
    },
  },
  methods: {
    delReturnCode(arr) {
      arr.map((item) => { // eslint-disable-line
        item.label = item.label.length > 6 ? `${item.label.substring(0, 6)}...` : item.label; // eslint-disable-line
      });
      return arr;
    },
    dealTransCount(unit, arr, flag) {
      let coefficient = 0;
      if (unit === '笔') {
        coefficient = 1;
      } else if (unit === '万笔') {
        coefficient = 10000;
      } else if (unit === '亿笔') {
        coefficient = 100000000;
      } else if (unit === '万亿笔') {
        coefficient = 1000000000000;
      }
      let arrResult = '';
      if (!flag) arrResult = arr.map(v => isNaN(v) ? 0 : Number((v / coefficient).toFixed(2))); // eslint-disable-line 
      else arrResult = arr / coefficient;
      return arrResult;
    },
    dealData() {
      let transData = {
        data: this.chartDataList,
        unit: ['笔'],
      };
      const arr = this.chartDataList[0];
      const max = Math.max.apply(null, arr); // eslint-disable-line
      const transUnit = formatTransCount(max).unit;
      transData = {
        data: this.dealTransCount(transUnit, arr, false),
        unit: [transUnit],
      };
      return transData;
    },
    getBaseLine(unit, data) {
      const baseLine = this.dealTransCount(unit.join(' '), data, true);
      return baseLine;
    },
    chartData(index) { // eslint-disable-line
      let maxTranscountLegend = '';
      let minTranscountLegend = '';
      let rrRateLegend = '';
      let succRateLegend = '';
      let durationLegend = '';
      const maxData = this.$store.state.baselineTrade.max_transcount;
      const minData = this.$store.state.baselineTrade.min_transcount;
      const rrData = this.$store.state.baselineTrade.rr_rate;
      const succData = this.$store.state.baselineTrade.succ_rate;
      const durData = this.$store.state.baselineTrade.duration;

      maxTranscountLegend = maxData === null ? '上基准线：--笔' : this.dealData().unit === '笔' ? `上基准线：${maxData}笔` : `上基准线：${this.getBaseLine(this.dealData().unit, maxData)}${this.dealData().unit}`; // eslint-disable-line
      minTranscountLegend = minData === null ? '下基准线：--笔' : this.dealData().unit === '笔' ? `下基准线：${minData}笔` : `下基准线：${this.getBaseLine(this.dealData().unit, minData)}${this.dealData().unit}`; // eslint-disable-line
      rrRateLegend = rrData === null ? '基准线：--%' : `基准线：${rrData}%`;
      succRateLegend = succData === null ? '基准线：--%' : `基准线：${succData}%`;
      durationLegend = durData === null ? '基准线：--ms' : `基准线：${durData}ms`;

      if (index === 0) return { legend: [minTranscountLegend, maxTranscountLegend], data: [this.getBaseLine(this.dealData().unit, minData), this.getBaseLine(this.dealData().unit, maxData)], show: true, color: maxData === null && minData === null ? [['#273240'], ['#273240']] : [] };
      if (index === 1) return { legend: [rrRateLegend], data: [rrData], show: true, color: rrData === null ? [['#273240']] : [] };
      if (index === 2) return { legend: [succRateLegend], data: [succData], show: true, color: succData === null ? [['#273240']] : [] };
      if (index === 3) return { legend: [durationLegend], data: [durData], show: true, color: durData === null ? [['#273240']] : [] };
    },
    submitSearch(val) {
      const req = val;
      req.type = 'biz_overview_chart';
      this.$store.dispatch('submitPanel', req);
    },
    routeToMulti(key, name, label) {
      // { name: 'BizTrack', params: { durationGte: snap.durationGte, durationLt: snap.durationLt } }
      this.$router.push({
        name: 'BizMulti',
        params: {
          key,
          name,
          label,
        },
      });
    },
    clickPie(data) {
      // console.log(data);
      if (this.currentIp === '') {
        this.routeToMulti('trans_type', '交易类型', data.label);
      }
    },
    clickBar(data) {
      // console.log(data);
      if (this.currentIp === '') {
        this.routeToMulti('ret_code', '返回码', data.label);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.main{
  height: calc(100% - 57px);
  color: #BEE2EB;
  font-size: 16px;
  text-align: left;
}

.search-div{
  height: 57px;
  border-bottom: solid 1px #071b2d;
  padding-left: 5px;
}

.chart-div{
  padding: 10px 0 2px 15px;
  height: 100%;
  i{
    font-size: 24px;
  }
}

.chart-item:nth-child(2), .chart-item:nth-child(3){
  width: calc( 50% - 10px);
}

.chart-item:nth-child(n+4){
  width: calc( 100% - 20px);
}

.chart-item{
  float: left;
  height: 462px;
  margin-top: 10px;
  padding: 15px;
  background: #010c11;
  border: solid 1px #348c85;
  color: #14e2d1;
  .chart-title{
    height: 40px;
  }
  .chart-div{
    height: 390px;
  }
}

.chart-item:nth-child(2){
  border-right: none;
}

.chart-item:nth-child(3){
  border-left: none;
}

.scroll-area{
  height: 100%;
}

.chart-name{
  font-size: 18px;
  margin-left: 10px;
}
</style>

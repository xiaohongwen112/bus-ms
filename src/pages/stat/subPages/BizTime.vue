<template>
  <div class="main">
    <h6 class="title">分时交易</h6>
    <div class="time-search">
      <SearchBar :panel="`biz_overview_time_trade`"
        :isStep='true' :currentTime="session$.ts"
        @search="submitSearch"></SearchBar>
    </div>
    <div class="time-chart">
      <div class="time-top">
        <div class="time-top-left">
          <a :class="{slected: currentType === index}"
            v-for="(item, index) in typeList" :key="index"
            @click="changeType(index)">{{ item }}</a>
        </div>
        <div class="time-top-right">
          <a :class="{slected: currentWeek === 0}" @click="changeWeek(0)">
            <i class="icon-bms-calendar"></i>
          </a>
          <a :class="{slected: currentWeek === (index+1)}"
            v-for="(item, index) in weekList" :key="index"
            @click="changeWeek(index+1)">{{ item }}</a>
        </div>
      </div>
      <div class="time-content">
        <AreaChart type="area"
          :xMarks="xMarks"
          :xText="Number(2)"
          :data="currentData"
          :legendStyle="`false`"
          :legend="legend"
          :unit="unit"
          :baseline="chartDataTrade()"/>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import SearchBar from '@/components/stat/SearchBar';
import AreaChart from '@/components/common/AreaChart';

export default {
  name: 'BizTime',
  components: {
    SearchBar,
    AreaChart,
  },
  data() {
    return {
      currentType: 0,
      currentWeek: 0,
      typeList: ['交易量', '响应率'],
      weekList: ['一', '二', '三', '四', '五', '六', '日'],
      legend: ['交易量'],
      // unit: ['笔'],
    };
  },
  computed: {
    ...mapState({
      appId: state => state.appId,
      intfId: state => state.intfId,
      xMarks: state => state.time.xMarks,
      chartData: state => state.time.chartData,
    }),
    unit() { return [['笔'], ['%']][this.currentType]; },
    currentData() {
      return this.chartData[this.currentType][this.currentWeek];
    },
    xMarksTest() {
      return ['2018-05-11 19:02:00', '2018-05-11 19:03:00', '2018-05-11 19:04:00',
        '2018-05-11 19:05:00', '2018-05-11 19:06:00', '2018-05-11 19:07:00',
        '2018-05-11 19:08:00', '2018-05-11 19:09:00', '2018-05-11 19:10:00',
        '2018-05-11 19:11:00', '2018-05-11 19:12:00', '2018-05-11 19:13:00',
        '2018-05-11 19:14:00', '2018-05-11 19:15:00', '2018-05-11 19:16:00', '2018-05-11 19:17:00'];
    },
    areaDataTest() {
      return Array.from({ length: 16 }, () => Math.floor(Math.random() * 200));
    },
  },
  methods: {
    init() {
      this.currentType = 0;
      this.currentWeek = 0;
    },
    changeType(index) {
      this.currentType = index;
    },
    changeWeek(index) {
      this.currentWeek = index;
    },
    submitSearch(val) {
      const req = val;
      req.type = 'biz_overview_time_trade';
      this.$store.dispatch('submitPanel', req);
      this.init();
    },
    chartDataTrade() { // eslint-disable-line
      let maxTranscountLegend = '';
      let minTranscountLegend = '';
      let rrRateLegend = '';
      const maxData = this.$store.state.baselineTrade.max_transcount;
      const minData = this.$store.state.baselineTrade.min_transcount;
      const rrData = this.$store.state.baselineTrade.rr_rate;

      maxTranscountLegend = maxData === null ? '上基准线：--笔' : `上基准线：${maxData}笔`;
      minTranscountLegend = minData === null ? '下基准线：--笔' : `下基准线：${minData}笔`;
      rrRateLegend = rrData === null ? '基准线：--%' : `基准线：${rrData}%`;

      if (this.currentType === 0) return { legend: [minTranscountLegend, maxTranscountLegend], data: [minData, maxData], show: true, color: maxData === null && minData === null ? [['#273240'], ['#273240']] : [] };
      if (this.currentType === 1) return { legend: [rrRateLegend], data: [rrData], show: true, color: rrData === null ? [['#273240']] : [] };
    },
  },
};
</script>

<style lang="scss" scoped>
.main{
  width: 100%;
  height: 100%;
  .title{
    display: none;
  }
  a{
    text-decoration: none;
  }
}

.time-search{
  height: 57px;
  padding-left: 5px;
}

.time-chart{
  height: calc(100% - 67px);  //57+10
  border: 1px solid #3dd9c4;
  background: #010c11;
}

.time-top{
  padding: 10px 20px 0 20px;
  height: 40px;
  margin-bottom: 10px;
  a{
    height: 29px;
    line-height: 29px;
    border: 1px solid #32d6c8;
    color: #B9CFE1;
    font-size: 16px;
  }
  a:hover,.slected{
    background: #32d6c8;
    color: #08141b;
  }
}

.time-top-left{
  float: left;
  a{
    width: 70px;
    float: left;
  }
  a:first-child{
    padding-left: 12px;
    border-radius: 16px 0 0 16px;
  }
  a:last-child{
    margin-left: 10px;
    padding-right: 12px;
    border-radius: 0 16px 16px 0;
  }
}

.time-top-right{
  float: right;
  a{
    width: 36px;
    float: left;
    border-right: 1px solid #32d7c6;
    text-align: center;
  }
}

.time-content{
  width: 100%;
  height: calc(100% - 50px);
}
</style>

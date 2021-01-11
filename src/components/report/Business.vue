<template>
  <div class="level-content main-level-div" :class="{'selected': choseStatus.business}">
    <div class="level-menu main-level-menu">
      <span class="level-name">{{title}}</span>
      <span class="level-span alertLevelOp">
        <label class="icon-toggle" :class="toggleStatus.business?'toggle-close':'toggle-open'" @click="toggleContent('business')"></label>
        <label class="icon-choose" :class="choseStatus.business?'icon-chosed':'icon-unchose'" @click="choseContent('business')"></label>
      </span>
    </div>
    <div class="level-info-content main-info-content" v-show="toggleStatus.business">
      <table class="report-table" ref="businessTable">
        <thead>
          <tr>
            <th>日期</th>
            <th v-for="(x, i) in businessChart" :key="i" >{{x.key}}</th>
          </tr>
        </thead>
        <tbody v-if="source=='common'">
          <tr v-for="(item, index) in businessChart[0].timeData" :key="index">
            <td>{{type == 'year' ? `第${seasonIndex[parseInt(item.split('-')[1], 10)]}季度` : type=='month'?`${item.split('-')[2]}日`:`${item.split('-')[1]}月`}}</td>
            <td v-for="(x, i) in businessChart">{{x.transData[index]}}</td>
          </tr>
          <tr>
            <td>总计</td>
            <td v-for="(x, i) in businessChart">{{x.totalData}}</td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr v-for="(item, index) in time" :key="index">
            <td>{{time[index]}}</td>
            <td v-for="(x, i) in businessChart">{{x.transData[index]}}</td>
          </tr>
          <tr>
            <td>总计</td>
            <td v-for="(x, i) in businessChart">{{x.totalData}}</td>
          </tr>
        </tbody>
      </table>
      <div class="report-time-chart">
        <div class="business-head">{{sourceIndex[source]}}{{typeIndex[type]}}业务统计</div>
        <div class="business-ring">
          <BusinessRing v-if="toggleStatus.business" :center="center" :dataset="dataset"/>
        </div>
      </div>
      <div class="report-time-chart business-charts" v-for="(item, index) in businessChart[0].cusTimeData" :key="index"
        v-if="source=='custom'&&type!=='day'&&type!=='week'">
        <div class="business-head">{{time[index]}} 业务量统计</div>
        <div class="business-ring">
          <BusinessRing v-if="toggleStatus.business" :center="eachRing(index).center" :dataset="eachRing(index).dataset"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import AreaChart from '@/components/common/AreaChart/index';
  import moment from 'moment';
  import Ring from './Ring';
  import BusinessRing from './BusinessRing';

  export default {
    props: {
      title: { type: String, isRequired: true },
      toggleStatus: {
        type: Object,
        default() {
          return {};
        },
      },
      choseStatus: {
        type: Object,
        default() {
          return {};
        },
      },
      data: {
        type: Object,
        default() {
          return {};
        },
      },
      type: { type: String, isRequired: true },
      source: { type: String, isRequired: true },
      time: {
        type: Array,
        default() {
          return [];
        },
      },
    },
    components: { AreaChart, Ring, BusinessRing },
    computed: {
      businessChart() {
        const businessChart = [];
        let transData = [];
        const timeData = [];
        const cusTimeData = [];
        let business = {};

        Object.keys(this.data).forEach((item, index) => {
          if (this.data[item].app_name !== undefined) {
            const data = this.data[item].division;
            if (data.length !== 0) {
              transData = [];
              data.forEach((x) => {
                transData.push(x.trans_count);
                timeData.push(moment.unix(x.time).format('YYYY-MM-DD'));
                if (index === 1) {
                  cusTimeData.push(x.time);
                }
              });
              business = {
                key: this.data[item].disp_name,
                transData,
                timeData: this.dedupe(timeData),
                cusTimeData,
                totalData: this.totalSum(transData),
              };
              businessChart.push(business);
            }
          }
        });
        return businessChart;
      },
      dataset() {
        const dataset = [];
        let data = {};
        let total = 0;
        this.businessChart.forEach((item) => {
          total += item.totalData;
        });
        this.center.sub = total;
        this.businessChart.forEach((item) => {
          data = {
            name: item.key,
            count: item.totalData,
            value: total !== 0 ? Math.round(item.totalData / total * 100) : 0,
          };
          dataset.push(data);
        });
        return dataset;
      },
    },
    data() {
      return {
        typeIndex: {
          day: '日',
          week: '周',
          month: '月',
          season: '季',
          year: '年',
        },
        sourceIndex: {
          common: '本',
          custom: '总',
        },
        center: {
          main: '总业务量',
          sub: '0',
        },
        seasonIndex: {
          1: '1',
          4: '2',
          7: '3',
          10: '4',
        },
      };
    },
    methods: {
      dedupe(array) { // 数组去重
        return Array.from(new Set(array));
      },
      totalSum(arr) {
        let total = 0;
        arr.forEach((item) => {
          total = total + (item !== '--' ? item : 0); // eslint-disable-line
        });
        return total;
      },
      toggleContent(id) {
        this.$emit('toggle-content', id);
      },
      choseContent(id) {
        this.$emit('chose-content', id);
      },
      getCustomTime(time, index) {
        let finalTime = '';
        switch (this.type) {
          case 'day':
            finalTime = moment.unix(time).format('MM-DD');
            break;
          case 'week':
            finalTime = `第${index + 1}周`;
            break;
          case 'month':
            finalTime = `${moment.unix(time).format('YYYY-MM-DD').split('-')[1]}月`;
            break;
          case 'season':
            finalTime = `第${index + 1}季度`;
            break;
          case 'year':
            finalTime = `${moment.unix(time).format('YYYY-MM-DD').split('-')[0]}年`;
            break;
          default:
            finalTime = time;
        }
        return finalTime;
      },
      eachRing(index) {
        let finalData = {};
        const center = {
          main: '总交易量',
          sub: '0',
        };
        let total = 0;
        let data = {};
        const dataset = [];
        this.businessChart.forEach((item) => {
          // finalData.push(item.transData[index]);
          total += item.transData[index] === '--' ? 0 : item.transData[index];
        });
        this.businessChart.forEach((item) => {
          const curVal = total !== 0 ? Math.round(item.transData[index] / total * 100) : 0;
          data = {
            name: item.key,
            count: item.transData[index],
            value: isNaN(curVal) ? 0 : curVal,
          };
          dataset.push(data);
        });
        center.sub = total;
        finalData = {
          center,
          dataset,
        };
        return finalData;
      },
    },
    mounted() {
      this.eachRing('1');
    },
  };
</script>
<style lang="scss">
  .alert-chart-div{
    ul{
      font-size: 14px;
    }
  }
  #alert-pie{
    .ring-chart{
      padding-top:40px;
      box-sizing:border-box;
      ul{
        text-align: center;
        padding-top: 25px;
      }
    }
  }
  .report-time-chart{
    .buisness-ring-chart{
      font-size: 14px;
      border: none;
    }
  }
</style>
<style lang="scss" scoped>
.report-time-chart{
  height: 450px;
  background: rgba(5, 12, 17, 0.75);
  box-shadow: 2px 2px 3px #050c11;
  margin-top: 10px;
  font-size: 14px;
  &.business-charts{
    display:inline-block;
    width:49.8%;
    float:left;
    &:nth-child(2n){
      margin-left:0.4%;
    }
  }
  .business-head{
    font-size:14px; 
    color: #ccc;
    padding: 30px 0 0 30px;
  }
  .business-ring{
    width: 80%;
    height: 400px;
    margin: 0 auto;
    padding-top: 5%;
  }
}
.alert-chart-box{
  margin-bottom:29px;
}
.report-chart {
  width: 33%;
  display: inline-block;
  height: 330px;
  background: rgba(5,12,17,.75);
  box-shadow: 2px 2px 3px rgb(5,12,17);
  margin-top: 10px;
  margin-right: 0.5%;
  vertical-align: middle;
}
.alert-chart-div {
  height: 410px;
}
#alert-area-chart{
  width: 66.5%;
}
#alert-pie{
  width: 33%;
  margin-right: 0;
  ul{
    font-size: 16px;
  }
}
.sub-level-div {
  .level-menu {
    margin: 5px 0;
  }
  .level-info-content {
    margin: 0;
    width: 100%;
  }
}
.level-info-content {
  margin: 0 3%;
  width: 94%;
  font-size: 0;
}
.level-menu {
  display: block;
  height: 45px;
  line-height: 45px;
  padding: 0 40px;
  font-size: 20px;
  background: #0c161e;
  color: #5c686f;
  margin: 5px 2%;
}
.main-level-menu {
  border-bottom: 1px solid #1f2b38;
  margin-bottom: 5px;
}
.selected>.level-menu,.selectedMenu {
  background: #141c26;
  color: #e0ebef;
}
.sub-level-menu {
  margin: 3px 1%;
  height: 40px;
  line-height: 40px;
  font-size: 18px;
}
.active-table{
  width: 96%;
  margin: 0 2%;
}
.level-span {
  clear: both;
  float: right;
  position: relative;
  top: 5px;
  .icon-toggle,
  .icon-choose {
    display: inline-block;
    width: 32px;
    height: 32px;
    margin-left: 15px;
    cursor: pointer;
  }
  .toggle-close {
    background: url(../../assets/report/item-close.svg) no-repeat;
  }
  .toggle-open {
    background: url(../../assets/report/item-open.svg) no-repeat;
  }
  .icon-chosed {
    background: url(../../assets/report/item-selected.svg) no-repeat;
  }
  .icon-unchose {
    background: url(../../assets/report/item-unselected.svg) no-repeat;
  }
}
.report-table {
  width: 100%;
  background: #040a10;
  text-align: center;
  border-spacing: 0;
  color: #fff;
  thead {
    tr {
      height: 40px;
      line-height: 40px;
      font-size: 16px;
      background: #283646;
    }
  }
  tr {
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    th,
    td {
      border: 1px solid #0f171e;
    }
    th:first-child,
    td:first-child {
      padding-left: 20px;
      text-align: left;
      width: 130px;
    }
  }
}
@media (max-width: 1200px) {
  .report-time-chart{
    &.business-charts{
      width: 100%;
      &:nth-child(2n){
        margin-left: 0;
      }
    }
  }
}
</style>
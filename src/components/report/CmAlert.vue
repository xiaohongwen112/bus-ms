<template>
  <div class="level-content main-level-div" :class="{'selected': choseStatus.alert}" id="alert">
    <div class="level-menu main-level-menu">
      <span class="level-name">{{title}}</span>
      <span class="level-span alertLevelOp">
        <label class="icon-toggle" :class="toggleStatus.alert?'toggle-close':'toggle-open'" @click="toggleContent('alert')"></label>
        <label class="icon-choose" :class="choseStatus.alert?'icon-chosed':'icon-unchose'" @click="choseContent('alert')"></label>
      </span>
    </div>
    <div class="level-info-content main-info-content" v-show="toggleStatus.alert" id="alert_content">
      <table class="report-table" ref="alertTable">
        <thead>
          <tr>
            <th>日期</th>
            <th>基线告警总数</th>
            <th>健康度告警总数</th>
            <th>返回码告警总数</th>
            <th>小计</th>
          </tr>
        </thead>
        <tbody v-if="source !== 'custom'">
          <tr v-for="(x, i) in data.alerts" :key="i">
            <td>{{changeTime(x.time, i)}}</td>
            <td>{{x.baseline}}</td>
            <td>{{x.health}}</td>
            <td>{{x.ret}}</td>
            <td>{{x.count}}</td>
          </tr>
          <tr>
            <td>总计</td>
            <td>{{data.count.baseline}}</td>
            <td>{{data.count.health}}</td>
            <td>{{data.count.ret}}</td>
            <td>{{data.count.count}}</td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr v-for="(x, i) in data.alerts" :key="i">
            <td>{{i === data.alerts.length - 1 ? '总计' :  time[i]}}</td>
            <td>{{x.baseline}}</td>
            <td>{{x.health}}</td>
            <td>{{x.ret}}</td>
            <td>{{x.count}}</td>
          </tr>
        </tbody>
      </table>
      <div class="alert-chart-box">
        <div class="report-chart alert-chart-div" id="alert-area-chart">
          <div class="charts-title">{{sourceIndex[source]}}{{typeIndex[type]}}告警预警折线图</div>
          <div class="charts-con">
            <AreaChart v-if="toggleStatus.alert" type="area" :legend="alertLengend" :unit="chartUnit" :brushOpen="false" 
            :data="dealData.data" :xMarks="source !== 'custom' ? dealData.time : dealCustom(time)"
            ></AreaChart>
          </div>
        </div>
        <div class="report-chart alert-chart-div" id="alert-pie">
          <div class="charts-title">{{sourceIndex[source]}}{{typeIndex[type]}}告警预警总数统计</div>
          <div class="charts-con">
            <Ring v-if="toggleStatus.alert" :dataset="source !== 'custom' ? alertRing : customRing"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import AreaChart from '@/components/common/AreaChart/index';
  import moment from 'moment';
  import Ring from './Ring';

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
    components: { AreaChart, Ring },
    computed: {
      dealData() {
        const baseline = [];
        const health = [];
        const ret = [];
        const total = [];
        const time = [];
        const dealData = {};
        const data = this.data.alerts;
        Object.keys(this.data.alerts).forEach((el, index) => {
          if (this.source === 'common' && index !== this.data.alerts.length) {
            baseline.push(data[el].baseline);
            health.push(data[el].health);
            ret.push(data[el].ret);
            total.push(data[el].baseline + data[el].health + data[el].ret);
            if (this.type === 'month') {
              time.push(`${moment.unix(data[el].time).format('YYYY-MM-DD').split('-')[2]}日`);
            } else {
              time.push(this.changeTime(data[el].time, index));
            }
          } else if (this.source === 'custom' && index !== this.data.alerts.length - 1) {
            baseline.push(data[el].baseline);
            health.push(data[el].health);
            ret.push(data[el].ret);
            total.push(data[el].baseline + data[el].health + data[el].ret);
            if (this.type === 'month') {
              time.push(`${moment.unix(data[el].time).format('YYYY-MM-DD').split('-')[2]}日`);
            } else {
              time.push(this.changeTime(data[el].time, index));
            }
          }
        });
        dealData.data = [total, baseline, health, ret];
        dealData.time = time;
        return dealData;
      },
      alertRing() {
        const alertRing = [
          { name: '基线', value: 0 },
          { name: '健康度', value: 0 },
          { name: '返回码', value: 0 },
        ];
        if (this.data.count.count !== 0) {
          return [
            { name: '基线', value: Number(((this.data.count.baseline / this.data.count.count) * 100).toFixed(2)) },
            { name: '健康度', value: Number(((this.data.count.health / this.data.count.count) * 100).toFixed(2)) },
            { name: '返回码', value: Number(((this.data.count.ret / this.data.count.count) * 100).toFixed(2)) },
          ];
        }
        return alertRing;
      },
      customRing() {
        const len = this.data.alerts.length;
        const data = this.data.alerts[len - 1];
        const customRing = [
          { name: '基线', value: 0 },
          { name: '健康度', value: 0 },
          { name: '返回码', value: 0 },
        ];
        if (data.count !== 0) {
          return [
            { name: '基线', value: Number(((data.baseline / data.count) * 100).toFixed(2)) },
            { name: '健康度', value: Number(((data.health / data.count) * 100).toFixed(2)) },
            { name: '返回码', value: Number(((data.ret / data.count) * 100).toFixed(2)) },
          ];
        }
        return customRing;
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
          common: '当',
          custom: '每',
        },
        chartUnit: [''],
        alertLengend: ['告警总数', '基线告警总数', '健康度告警总数', '返回码告警总数'],
        seasonIndex: {
          1: '1',
          4: '2',
          7: '3',
          10: '4',
        },
      };
    },
    methods: {
      dealCustom(time) {
        let finalTime = time;
        if (this.type === 'week') {
          finalTime = time.map((x) => { // eslint-disable-line
            return x.split('(')[0];
          });
        }
        if (this.type === 'month') {
          finalTime = time.map((x) => { // eslint-disable-line
            return `${parseInt(x.split('-')[0], 10)}-${x.split('-')[1].split('月')[0]}`;
          });
        }
        if (this.type === 'season') {
          finalTime = time.map((x) => { // eslint-disable-line
            return `${parseInt(x.split('-')[0], 10)}-${parseInt(x.split('-')[1], 10)}`;
          });
        }
        return finalTime;
      },
      changeTime(time, i) {
        let finalTime = '';
        if (this.source === 'custom') {
          if (this.type === 'day') {
            finalTime = moment.unix(time).format('MM-DD');
          } else if (this.type === 'week') {
            finalTime = `第${i + 1}周`;
          } else if (this.type === 'month') {
            finalTime = `${moment.unix(time).format('YYYY-MM-DD').split('-')[1]}月`;
          } else if (this.type === 'season') {
            finalTime = `第${i + 1}季度`;
          } else {
            finalTime = `${moment.unix(time).format('YYYY-MM-DD').split('-')[0]}年`;
          }
        } else {
          if (this.type === 'month') {
            finalTime = `${moment.unix(time).format('YYYY-MM-DD').split('-')[2]}日`;
          } else if (this.type === 'year') {
            const mon = parseInt(moment.unix(time).format('YYYY-MM-DD').split('-')[1], 10);
            finalTime = `第${this.seasonIndex[mon]}季度`;
          } else {
            finalTime = `${moment.unix(time).format('YYYY-MM-DD').split('-')[1]}月`;
          }
        }
        return finalTime;
      },
      toggleContent(id) {
        this.$emit('toggle-content', id);
      },
      choseContent(id) {
        this.$emit('chose-content', id);
      },
      diviChart(key) {
        let diviChart = {};
        const transData = [];
        const durationData = [];
        const rrData = [];
        const succData = [];
        let rrsuccData = [];
        const totalData = [];
        const timeData = [];
        if (this.data[key].app_name !== undefined) {
          const data = this.data[key].division;
          data.forEach((item) => {
            transData.push(item.trans_count);
            durationData.push(item.duration.toFixed(2) * 100 / 100);
            rrData.push(item.rr_rate.toFixed(2) * 100 / 100);
            succData.push(item.succ_rate.toFixed(2) * 100 / 100);
            totalData.push(item.succ_rate.toFixed(2) * 100 / 100);
            timeData.push(moment.unix(item.time).format('HH:mm'));
          });
        }
        rrsuccData = [rrData, succData];
        diviChart = {
          transData,
          durationData,
          timeData,
          rrsuccData,
        };
        return diviChart;
      },
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
</style>
<style lang="scss" scoped>
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
    .charts-title{
      font-size: 14px;
      color: #ccc;
      padding: 25px 0 0 30px;
    }
    .charts-con{
      width: 100%;
      height: calc(100% - 49px);
    }
}
.alert-chart-div {
  height: 410px;
}
#alert-area-chart{
  width: 66.5%;
  background-color:#010c11;
}
#alert-pie{
  width: 33%;
  margin-right: 0;
  background-color:#010c11;
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
</style>
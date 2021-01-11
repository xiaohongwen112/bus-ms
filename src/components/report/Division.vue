<template>
  <div class="level-content main-level-div" :class="{'selected': choseStatus.division}">
    <div class="level-menu main-level-menu">
      <span>{{title}}</span>
      <span class="level-span alertLevelOp">
        <label class="icon-toggle" :class="toggleStatus.division?'toggle-close':'toggle-open'" @click="toggleContent('division')"></label>
        <label class="icon-choose" :class="choseStatus.division?'icon-chosed':'icon-unchose'" @click="choseContent('division')"></label>
      </span>
    </div>
    <div class="level-info-content main-info-content" v-show="toggleStatus.division">
      <div class="level-content sub-level-div" :class="{'selected': choseStatus.division && !value.choose}" ref="diviChildren" v-for="(value, key, index) in data"
       v-if="value.app_name" :key="value.app_name" :id="`${value.app_name}_${value.disp_name}`">
        <div class="level-menu sub-level-menu" :class="{'child-unselected': !((!('choose' in dealData(value)))  || dealData(value).choose)}">
          <span>{{`(${index + 1})`}}{{sourceIndex[source]}}{{source !== 'custom' ? `${typeIndex[type]}${value.disp_name}业务分时表` : `${value.disp_name}业务${typeIndex[type]}阶段表`}}</span>
          <span class="level-span">
            <label class="icon-toggle" :class="toggleStatus.division && ((!('active' in dealData(value)))  || dealData(value).active) ? 'toggle-close':'toggle-open'" @click="toggleChild(key, index)"></label>
            <label class="icon-choose" :class="choseStatus.division && ((!('choose' in dealData(value)))  || dealData(value).choose) ?'icon-chosed':'icon-unchose'" @click="choseChild(key, index)"></label>
          </span>
        </div>
        <div class="level-info-content sub-info-content" v-show="(!('active' in dealData(value))) || dealData(value).active">
          <table class="report-table" ref="diviTable" v-show="value.division.length!=0">
            <thead>
              <tr>
                <th>时间</th>
                <th>交易量（笔）</th>
                <th>响应率（%）</th>
                <th>成功率（%）</th>
                <th>成功交易量（笔）</th>
                <th>响应时间（ms）</th>
              </tr>
            </thead>
            <tbody v-if="source !== 'custom'">
              <tr v-for="(x, i) in value.division" :key="i">
                <td>{{changeTime(x.time, i)}}</td>
                <td>{{x.trans_count}}</td>
                <td>{{x.rr_rate !== '--' ? x.rr_rate.toFixed(2)*100/100 : '--'}}</td>
                <td>{{x.succ_rate !== '--' ? x.succ_rate.toFixed(2)*100/100 : '--'}}</td>
                <td>{{x.sum_succ}}</td>
                <td>{{x.duration !== '--' ? x.duration.toFixed(2)*100/100 : '--'}}</td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr v-for="(x, i) in value.division" :key="i">
                <td>{{time[i]}}</td>
                <td>{{x.trans_count}}</td>
                <td>{{x.rr_rate !== '--' ? x.rr_rate.toFixed(2)*100/100 : '--'}}</td>
                <td>{{x.succ_rate !== '--' ? x.succ_rate.toFixed(2)*100/100 : '--'}}</td>
                <td>{{x.sum_succ}}</td>
                <td>{{x.duration !== '--' ? x.duration.toFixed(2)*100/100 : '--'}}</td>
              </tr>
            </tbody>
          </table>
          <div class="report-time-chart" v-if="value.division.length!=0">
            <AreaChart v-if="toggleStatus.division" type="area" :legend="['交易量', '成功交易量']" :unit="[diviChart(key).transUnit]" :brushOpen="false" :data="diviChart(key).transCount"
             :xMarks="source=='common'?diviChart(key).timeData:dealCustom(time)"></AreaChart>
          </div>
          <div class="report-time-chart" v-if="value.division.length!=0">
            <AreaChart v-if="toggleStatus.division" type="area" :legend="['响应时间']" :unit="[diviChart(key).timeUnit]" :brushOpen="false" :data="diviChart(key).durationCount"
             :xMarks="source=='common'?diviChart(key).timeData:dealCustom(time)"></AreaChart>
          </div>
          <div class="report-time-chart" v-if="value.division.length!=0">
            <AreaChart v-if="toggleStatus.division" type="area" :legend="['响应率（%）', '成功率（%）']" :unit="['%']" :brushOpen="false" :data="diviChart(key).rrsuccData"
             :xMarks="source=='common'?diviChart(key).timeData:dealCustom(time)"></AreaChart>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import AreaChart from '@/components/common/AreaChart/index';
  import { formatTransCount, formatTime } from '@/helpers/utils';
  import moment from 'moment';

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
    components: { AreaChart },
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
          custom: '',
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
      dealData(value) {
        const data = value.division[0]; // eslint-disable-line
        return data;
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
          switch (this.type) {
            case 'day':
              finalTime = moment.unix(time).format('HH:mm');
              break;
            case 'month':
              finalTime = `${moment.unix(time).format('YYYY-MM-DD').split('-')[2]}日`;
              break;
            case 'season':
              finalTime = `${moment.unix(time).format('YYYY-MM-DD').split('-')[1]}月`;
              break;
            case 'year':
              finalTime = `第${this.seasonIndex[parseInt(moment.unix(time).format('YYYY-MM-DD').split('-')[1], 10)]}季度`;
              break;
            default:
              finalTime = time;
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
      toggleChild(key, index) {
        const param = {
          key,
          index,
          type: 'division',
        };
        this.$emit('on-childtoggle', param);
      },
      choseChild(key, index) {
        const param = {
          key,
          index,
          type: 'division',
        };
        this.$emit('on-childchose', param);
      },
      divisionTime(time) {
        return moment.unix(time).format('HH:mm');
      },
      diviChart(key) {
        let diviChart = {};
        const transData = [];
        const succSum = [];
        const durationData = [];
        const rrData = [];
        const succData = [];
        let rrsuccData = [];
        const timeData = [];
        const timeMonData = [];
        if (this.data[key].app_name !== undefined) {
          const data = this.data[key].division;
          data.forEach((item, index) => {
            transData.push(item.trans_count !== '--' ? item.trans_count : 0);
            succSum.push(item.sum_succ !== '--' ? item.sum_succ : 0);
            durationData.push(item.duration !== '--' ? Number(item.duration.toFixed(2)) : 0);
            rrData.push(item.rr_rate !== '--' ? Number(item.rr_rate.toFixed(2)) : 0);
            succData.push(item.succ_rate !== '--' ? Number(item.succ_rate.toFixed(2)) : 0);
            timeData.push(moment.unix(item.time).format('HH:mm'));
            timeMonData.push(this.changeTime(item.time, index));
          });
        }
        rrsuccData = [rrData, succData];
        const transMax = Math.max.apply(null, transData);
        const transUnit = formatTransCount(transMax).unit;
        const transCount = this.dealTransCount(transUnit, transData, succSum);
        const timeMax = Math.max.apply(null, durationData);
        const timeUnit = formatTime(timeMax).unit;
        const durationCount = this.dealTime(timeUnit, durationData);
        diviChart = {
          transCount,
          durationCount,
          timeData,
          rrsuccData,
          transUnit,
          timeUnit,
        };
        if (['month', 'season', 'year'].includes(this.type)) diviChart.timeData = timeMonData;
        return diviChart;
      },
      dealTransCount(unit, arr1, arr2) {
        let arr1Result = [];
        let arr2Result = [];
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
        arr1Result = arr1.map((item) => { // eslint-disable-line
          return Number((item / coefficient).toFixed(2));
        });
        arr2Result = arr2.map((item) => { // eslint-disable-line
          return Number((item / coefficient).toFixed(2));
        });
        return [arr1Result, arr2Result];
      },
      dealTime(unit, arr) {
        let coefficient = 0;
        switch (unit) {
          case 'ms':
            coefficient = 1;
            break;
          case 's':
            coefficient = 1000;
            break;
          case 'min':
            coefficient = 1000 * 60;
            break;
          case 'h':
            coefficient = 1000 * 60 * 60;
            break;
          default:
            coefficient = 1;
        }
        const final = arr.map((item) => { // eslint-disable-line
          return Number((item / coefficient).toFixed(2));
        });
        return final;
      },
    },
  };
</script>
<style lang="scss" scoped>
.report-time-chart {
  height: 560px;
  background: rgba(5, 12, 17, .75);
  box-shadow: 2px 2px 3px rgb(5, 12, 17);
  margin-top: 10px;
  margin-bottom: 31px;
  font-size:14px;
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
  &.child-unselected{
    background: #0c161e;
    color: #5c686f;
  }
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
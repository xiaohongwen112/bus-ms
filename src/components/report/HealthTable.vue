<template>
  <div class="level-content main-level-div" :class="{'selected': choseStatus.health}">
    <div class="level-menu main-level-menu">
      <span class="level-name">{{title}}</span>
      <span class="level-span alertLevelOp">
        <label class="icon-toggle" :class="toggleStatus.health?'toggle-close':'toggle-open'" @click="toggleContent('health')"></label>
        <label class="icon-choose" :class="choseStatus.health?'icon-chosed':'icon-unchose'" @click="choseContent('health')"></label>
      </span>
    </div>
    <div class="level-info-content main-info-content" id="health_content" v-show="toggleStatus.health">
      <table class="report-table" ref="healthTable">
        <thead>
          <tr>
            <th>编号</th>
            <th>业务名称</th>
            <th>交易量（笔）</th>
            <th>响应率（%）</th>
            <th>成功率（%）</th>
            <th>成功交易量（笔）</th>
            <th>响应时间（ms）</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(key, value, index) in data" v-if="key.app_name" :key="key.app_name">
            <td>{{index + 1}}</td>
            <td>{{key.disp_name}}</td>
            <td>{{key.health.trans_count}}</td>
            <td>{{Number(key.health.rr_rate.toFixed(2))}}</td>
            <td>{{Number(key.health.succ_rate.toFixed(2))}}</td>
            <td>{{key.health.sum_succ}}</td>
            <td>{{Number(key.health.duration.toFixed(2))}}</td>
          </tr>
        </tbody>
      </table>
      <div class="report-chart">
        <CountBar v-if="toggleStatus.health" :dataset="chartCount.transCount" :verticalLabel="chartCount.transRalates"/>
      </div>
      <div class="report-chart">
        <div class="report-chart-rate"><RateBar type="response" :dataset="chartCount.resRate"/></div>
        <div class="report-chart-rate"><RateBar type="success" :dataset="chartCount.succRate"/></div>
      </div>
      <div class="report-chart">
        <CountBar v-if="toggleStatus.health" :dataset="chartCount.resTime" :verticalLabel="chartCount.timeRalates"/>
      </div>
    </div>
  </div>
</template>
<script>
  import { formatTransCount, formatTime } from '@/helpers/utils';
  import CountBar from './CountBar';
  import RateBar from './RateBar';

  export default {
    props: ['title', 'toggleStatus', 'choseStatus', 'data', 'type'],
    components: { CountBar, RateBar },
    computed: {
      chartCount() {
        const chartData = {};
        const trans = [];
        const resTime = [];
        const resRate = [];
        const succRate = [];
        const transArr = [];
        const timeArr = [];
        Object.keys(this.data).forEach((item, i) => {
          const dataItem = this.data[item];
          if (dataItem.app_name !== undefined) {
            transArr.push(dataItem.health.trans_count);
            timeArr.push(dataItem.health.duration);
            const transObject = {
              name: i + 1,
              value: dataItem.health.trans_count,
            };
            const resTimeObject = {
              name: i + 1,
              value: dataItem.health.duration,
            };
            const resRateObject = {
              name: i + 1,
              value: dataItem.health.rr_rate.toFixed(2),
            };
            const succRateObject = {
              name: i + 1,
              value: dataItem.health.succ_rate.toFixed(2),
            };
            trans.push(transObject);
            resTime.push(resTimeObject);
            resRate.push(resRateObject);
            succRate.push(succRateObject);
          }
        });
        const transMax = Math.max.apply(null, transArr);
        const transUnit = formatTransCount(transMax).unit;
        const timeMax = Math.max.apply(null, timeArr);
        const timeUnit = formatTime(timeMax).unit;
        chartData.transCount = this.dealTransCount(transUnit, trans);
        chartData.resTime = this.dealTime(timeUnit, resTime);
        chartData.resRate = resRate;
        chartData.succRate = succRate;
        chartData.transRalates = `交易量（${transUnit}）`;
        chartData.timeRalates = `响应时间（${timeUnit}）`;
        return chartData;
      },
    },
    data() {
      return {

      };
    },
    methods: {
      dealTransCount(unit, arr) {
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
        arr.forEach((item) => {
          item.value = Number((item.value / coefficient).toFixed(2)); // eslint-disable-line
        });
        return arr;
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
        arr.forEach((item) => {
          item.value = Number((item.value / coefficient).toFixed(2)); // eslint-disable-line
        });
        return arr;
      },
      toggleContent(id) {
        this.$emit('toggle-content', id);
      },
      choseContent(id) {
        this.$emit('chose-content', id);
      },
    },
  };
</script>
<style lang="scss" scoped>
.report-chart {
  width: 33%;
  display: inline-block;
  height: 330px;
  background: rgba(5, 12, 17, .75);
  box-shadow: 2px 2px 3px rgb(5, 12, 17);
  margin-top: 10px;
  margin-right: calc(1% / 2);
  &:last-child {
    margin-right: 0;
  }
  .report-chart-rate {
    height: 50%;
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
  margin: 3px 0;
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
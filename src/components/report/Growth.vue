<template>
  <div class="level-content main-level-div" :class="{'selected': choseStatus.growth}">
    <div class="level-menu main-level-menu">
      <span>{{title}}</span>
      <span class="level-span alertLevelOp">
        <label class="icon-toggle" :class="toggleStatus.growth?'toggle-close':'toggle-open'" @click="toggleContent('growth')"></label>
        <label class="icon-choose" :class="choseStatus.growth?'icon-chosed':'icon-unchose'" @click="choseContent('growth')"></label>
      </span>
    </div>
    <div class="level-info-content main-info-content" v-show="toggleStatus.growth">
      <div class="level-contentsub-level-div" :class="{'selected': choseStatus.growth && !value.chooseGrowth}" ref="growthChildren" v-for="(value, key, index) in data"
        v-if="value.app_name" :key="value.app_name" :id="`${value.app_name}_${value.disp_name}`">
        <div class="level-menu sub-level-menu" :class="{'child-unselected': !((!('chooseGrowth' in dealData(value)))  || dealData(value).chooseGrowth)}">
          <span v-if="type!=='year'">{{`(${index + 1})`}}{{source !== 'custom' ? `当${typeIndex[type]}` : ''}}{{value.disp_name}}业务增长率</span>
          <span v-else>{{`(${index + 1})`}}{{value.disp_name}}业务增长率</span>
          <span class="level-span">
            <label class="icon-toggle" :class="toggleStatus.growth &&  ((!('growth' in dealData(value)))  || dealData(value).growth)?'toggle-close':'toggle-open'" @click="toggleChild(key, index)"></label>
            <label class="icon-choose" :class="choseStatus.growth &&  ((!('chooseGrowth' in dealData(value)))  || dealData(value).chooseGrowth)?'icon-chosed':'icon-unchose'" @click="choseChild(key, index)"></label>
          </span>
        </div>
        <div class="level-info-content sub-info-content growth-content" v-show="(!('growth' in dealData(value))) || dealData(value).growth">
          <table class="report-table" ref="growthTable" v-show="value.division.length!=0">
            <thead>
              <tr v-if="source !== 'custom'">
                <th v-for="(x, i) in growthChart(key).title" :key="i">{{x}}</th>
              </tr>
              <tr v-else>
                <th v-for="(x, i) in growthChart(key).titleCustom" :key="i">{{x}}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td v-for="(x, i) in growthChart(key).trans" :key="i">{{x}}</td>
              </tr>
              <tr>
                <td v-for="(x, i) in growthChart(key).link" :key="i">{{i === 0 ? x : x !== '--' ? Number(x.toFixed(2)) : x}}</td>
              </tr>
              <tr v-show="growthChart(key).year[1]!=undefined">
                <td v-for="(x, i) in growthChart(key).year" :key="i">{{i === 0 ? x : x !== '--' ? Number(x.toFixed(2)) : x}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="charts-con" v-if="value.division.length!=0">
          <div class="report-time-chart" v-show="(!('growth' in dealData(value))) || dealData(value).growth">
            <div class="charts-title">总交易量折线图</div>
            <div class="each-charts-con">
              <AreaChart v-if="toggleStatus.growth" type="area" :legend="['交易量']" :unit="[growthChart(key).transUnit]" :brushOpen="false" :data="growthChart(key).transCount"
                :xMarks="source !== 'custom' ? growthChart(key).title.slice(1) : dealCustom(time)"></AreaChart>
            </div>
          </div>
          <div class="report-time-chart" v-show="(!('growth' in dealData(value))) || dealData(value).growth">
            <div class="charts-title">交易量同比/环比图</div>
            <div class="each-charts-con">
              <AreaChart v-if="toggleStatus.growth" type="area" :legend="['环比', '同比']" :unit="['%']" :brushOpen="false" :data="growthChart(key).chartsData"
                :xMarks="source !== 'custom' ? growthChart(key).title.slice(1): dealCustom(time)" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import AreaChart from '@/components/common/AreaChart/index';
  import { formatTransCount } from '@/helpers/utils';
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
      dedupe(array) { // 数组去重
        return Array.from(new Set(array));
      },
      dealData(value) {
        const data = value.division[0]; // eslint-disable-line
        return data;
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
          type: 'growth',
        };
        this.$emit('on-childtoggle', param);
      },
      choseChild(key, index) {
        const param = {
          key,
          index,
          type: 'growth',
        };
        this.$emit('on-childchose', param);
      },
      growthChart(key) {
        let growthChart = {};
        let title = ['月度'];
        let titleCustom = ['年度'];
        if (this.type === 'season') titleCustom = ['季度'];
        if (this.type === 'year') title = ['季度'];
        const trans = ['交易量（笔）'];
        const link = ['环比（%）'];
        const linkNum = [];
        const year = ['同比（%）'];
        const yearNum = [];
        const chartsData = [];
        if (this.data[key].app_name !== undefined) {
          const data = this.data[key].division;
          data.forEach((item) => {
            trans.push(item.trans_count);
            if (this.source === 'common') {
              if (this.type === 'year') title.push(`第${this.seasonIndex[parseInt(moment.unix(item.time).format('YYYY-MM-DD').split('-')[1], 10)]}季度`);
              else title.push(`${moment.unix(item.time).format('MM-DD').split('-')[0]}月`);
            } else {
              this.time.forEach((x) => {
                titleCustom.push(x);
              });
            }
            link.push(item.chain_ratio);
            linkNum.push(item.chain_ratio === '--' ? '0' : Number(parseFloat(item.chain_ratio, 10)).toFixed(2));
            year.push(item.year_ratio);
            if (item.year_ratio) {
              yearNum.push(item.year_ratio === '--' ? '0' : Number(parseFloat(item.year_ratio, 10)).toFixed(2));
            }
          });
          if (yearNum.length === 0) {
            chartsData.push(linkNum);
          } else {
            chartsData.push(linkNum, yearNum);
          }
        }
        const transMax = Math.max.apply(null, trans.slice(1));
        const transUnit = formatTransCount(transMax).unit;
        const transCount = this.dealTransCount(transUnit, trans.slice(1));
        growthChart = {
          title,
          titleCustom: this.dedupe(titleCustom),
          trans,
          transUnit,
          transCount,
          link,
          year,
          chartsData,
        };
        return growthChart;
      },
      dealTransCount(unit, arr1) {
        let arr1Result = [];
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
        return arr1Result;
      },
    },
  };
</script>
<style lang="scss" scoped>
.charts-title{
  font-size: 14px;
  color: #ccc;
  padding: 25px 0 0 30px;
}
.charts-con{
  width: 96%;
  height: 100%;
  margin: 0 2%;
  font-size:0;
  .report-time-chart {
    display: inline-block;
    width:49.8%;
    height: 560px;
    background: #010c11;
    box-shadow: 2px 2px 3px rgb(5, 12, 17);
    margin-top: 10px;
    margin-bottom: 31px;
    font-size:14px;
    &:nth-of-type(2){
      margin-left: 0.4%;
    }
    .each-charts-con{
      width: 100%;
      height: calc(100% - 49px);
      font-size: 14px;
    }
  }
}
.growth-content{
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
      }
    }
    tr {
      height: 40px;
      line-height: 40px;
      font-size: 16px;
      th,td {
        border: 1px solid #0f171e;
      }
      th:first-child,
      td:first-child {
        padding-left: 20px;
        text-align: left;
        width: 130px;
        background: #283646;
      }
    }
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
  margin: 0 2%;
  width: 96%;
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
</style>
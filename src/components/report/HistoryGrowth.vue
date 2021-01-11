<template>
  <div class="level-content main-level-div" :class="{'selected': choseStatus.history}">
    <div class="level-menu main-level-menu">
      <span>{{title}}</span>
      <span class="level-span alertLevelOp">
        <label class="icon-toggle" :class="toggleStatus.history?'toggle-close':'toggle-open'" @click="toggleContent('history')"></label>
        <label class="icon-choose" :class="choseStatus.history?'icon-chosed':'icon-unchose'" @click="choseContent('history')"></label>
      </span>
    </div>
    <div class="level-info-content main-info-content" v-show="toggleStatus.history">
      <div class="level-content sub-level-div" :class="{'selected': choseStatus.history && !value.chooseHis}" ref="historyChildren" v-for="(value, key, index) in data"
        v-if="value.app_name" :key="value.app_name" :id="`${value.app_name}_${value.disp_name}`">
        <div class="level-menu sub-level-menu" :class="{'child-unselected': !((!('chooseHis' in dealData(value)))  || dealData(value).chooseHis)}">
          <span>{{`(${index + 1})`}}{{value.disp_name}}业务增长率</span>
          <span class="level-span">
            <label class="icon-toggle" :class="toggleStatus.history && ((!('history' in dealData(value)))  || dealData(value).history)?'toggle-close':'toggle-open'" @click="toggleChild(key, index)"></label>
            <label class="icon-choose" :class="choseStatus.history && ((!('chooseHis' in dealData(value)))  || dealData(value).chooseHis)?'icon-chosed':'icon-unchose'" @click="choseChild(key, index)"></label>
          </span>
        </div>
        <div class="level-info-content sub-info-content growth-content" v-show="(!('history' in dealData(value))) || dealData(value).history">
          <table class="report-table" ref="historyTable">
            <thead>
              <tr>
                <th v-for="(x, i) in growthChart(key).title" :key="i">{{x}}</th>
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
        <div class="charts-con" v-if="value.growthrate.length!=0">
          <div class="report-time-chart" v-show="(!('history' in dealData(value))) || dealData(value).history">
            <div class="charts-title">总交易量折线图</div>
            <div class="each-charts-con">
              <AreaChart v-if="toggleStatus.history" type="area" :legend="['交易量(笔)']" :unit="['笔']" :brushOpen="false" :data="growthChart(key).trans.slice(1)"
                :xMarks="growthChart(key).title.slice(1)" />
            </div>
          </div>
          <div class="report-time-chart" v-show="(!('history' in dealData(value))) || dealData(value).history">
            <div class="charts-title">交易量同比/环比图</div>
            <div class="each-charts-con">
              <AreaChart v-if="toggleStatus.history" type="area" :legend="['环比', '同比']" :unit="['%']" :brushOpen="false" :data="growthChart(key).chartsData"
                :xMarks="growthChart(key).title.slice(1)" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import AreaChart from '@/components/common/AreaChart/index';
  import moment from 'moment';

  export default {
    props: ['title', 'toggleStatus', 'choseStatus', 'data', 'type', 'source'],
    components: { AreaChart },
    data() {
      return {
      };
    },
    methods: {
      dealData(value) {
        const data = value.division[0]; // eslint-disable-line
        return data;
      },
      changeTime(time) {
        switch (this.type) {
          case 'day':
            return moment.unix(time).format('HH:mm');
          case 'month':
            return `${moment.unix(time).format('YYYY-MM-DD').split('-')[2]}日`;
          case 'season':
            return `${moment.unix(time).format('YYYY-MM-DD').split('-')[1]}月`;
          case 'year':
            return `${moment.unix(time).format('YYYY-MM-DD').split('-')[1]}月`;
          default:
            return time;
        }
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
        };
        this.$emit('on-childtoggle', param);
      },
      choseChild(key, index) {
        const param = {
          key,
          index,
        };
        this.$emit('on-childchose', param);
      },
      divisionTime(time) {
        return moment.unix(time).format('HH:mm');
      },
      growthChart(key) {
        let growthChart = {};
        const title = ['年度'];
        const trans = ['交易量（笔）'];
        const link = ['环比（%）'];
        const linkNum = [];
        const year = ['同比（%）'];
        const yearNum = [];
        const chartsData = [];
        if (this.data[key].app_name !== undefined) {
          const data = this.data[key].growthrate;
          data.forEach((item) => {
            title.push(item.time);
            trans.push(item.pre_transcount);
            link.push(item.link_rate);
            linkNum.push(item.link_rate === '--' ? '0' : Number(parseFloat(item.link_rate, 10)).toFixed(2));
            year.push(item.yearonyear_rate);
            if (item.yearonyear_rate) {
              yearNum.push(item.yearonyear_rate === '--' ? '0' : Number(parseFloat(item.yearonyear_rate, 10)).toFixed(2));
            }
          });
          if (yearNum.length === 0) {
            chartsData.push(linkNum);
          } else {
            chartsData.push(linkNum, yearNum);
          }
        }
        growthChart = {
          title,
          trans,
          link,
          year,
          chartsData,
        };
        return growthChart;
      },
    },
  };
</script>
<style lang="scss" scoped>
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
.charts-title{
  font-size: 14px;
  color: #ccc;
  padding: 25px 0 0 30px;
}
.charts-con{
  width: 100%;
  height: 100%;
  font-size:0;
  .report-time-chart {
    display: inline-block;
    width:49.5%;
    height: 560px;
    background: #010c11;
    box-shadow: 2px 2px 3px rgb(5, 12, 17);
    margin-top: 10px;
    margin-bottom: 31px;
    font-size: 14px;
    &:nth-of-type(2){
      margin-left: 1%;
    }
    .each-charts-con{
      width: 100%;
      font-size: 14px;
      height: calc(100% - 49px);
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
<template>
  <div class="selected-trade">
    <div class="app-list selected-node" @click="backNode">
      <div class="name-div" @mouseover="showWhole($event, items.disp_name)" @mouseout="hideTip">{{items.disp_name}}</div>
      <div class="app-div-body">
        <div class="app-items succ-name">成功率</div>
        <DashBoard :width="dashWidth" :height="dashHeight" :value="items.app_succrate_day" :filter="filter" @showTip="showDashNum" @hideTip="hideTip"></DashBoard>
        <div class="app-items day-name">当日</div>
        <div class="app-items day-value"><span>{{transCount(items.transcount_day).value}}</span><span>{{transCount(items.transcount_day).unit}}</span></div>
        <div class="app-items current-name">当前</div>
        <div class="app-items current-value"><span>{{transCount(items.transcount_current).value}}</span><span>{{transCount(items.transcount_current).unit}}</span></div>
      </div>
    </div>
    <svg width="74" height="40" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gradientSSS" y0="0" x0="0" x1="100%" y1="100%">
          <stop offset="0%" stop-color="#18576c"></stop>
          <stop offset="100%" stop-color="#34bbe7"></stop>
        </linearGradient>
      </defs>
    </svg>
  </div>
</template>

<script>
  import { textWidth, formatTransCount } from '@/helpers/utils';
  import DashBoard from './DashBoard';

  export default {
    props: ['items'],
    components: { DashBoard },
    data() {
      return {
        dashWidth: 74,
        dashHeight: 41,
        filter: 'filterSelected',
      };
    },
    methods: {
      transCount(data) {
        return formatTransCount(data);
      },
      backNode() {
        this.$emit('back-node');
      },
      showWhole(e, name) {
        if (textWidth(name) >= 90) {
          const ele = e.target.parentNode;
          const position = {
            left: ele.getBoundingClientRect().left,
            top: ele.getBoundingClientRect().top,
            tipName: name,
          };
          this.$emit('showTip', position);
        }
      },
      showDashNum(position) {
        this.$emit('showNumTip', position);
      },
      hideTip() {
        this.$emit('hideTip');
      },
    },
  };
</script>

<style lang="scss" scoped>
.selected-trade{
  display: inline-block;
  width: 120px;
  height: 120px;
  margin:0;
  .app-list{
    float: left;
    width: 120px;
    height: 120px;
    background: #383e50;
    color: #F0EFEF;
    margin: 0 5px 5px;
    cursor: pointer;
    direction: ltr;
    &.selected-node{
      background:url(../../assets/areaMonitor/app-selected.png) no-repeat center;
      background-size:cover;
    }
    .name-div{
      font-size: 16px;
      height: calc(100% - 93px);
      line-height: 25px;
      width: calc(100% - 5px);
      margin-left: 5px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .app-div-body{
      width: 93%;
      height: calc(100% - 30px);
      margin-left:2px;
      .app-items{
        height: 20px;
        text-align: center;
        float: left;
        line-height: 20px;
        font-size: 12px;
        &:nth-child(2n + 1) {
          width: 45px;
          border-top: 1px solid #505C59;
          border-right: 1px solid #505C59;
        }
        &:nth-child(2n){
          width: calc(100% - 46px);
          border-top: 1px solid #505C59;
        }
        &.dash-board, &.succ-name{
          height: 40px;
          line-height: 40px;
        }
      }
      .day-value, .current-value{
        >span{
          &:first-child{
            width: calc(60% - 5px);
            float: left;
            color: #B5EC30;
          }
          &:last-child{
            float: right;
          }
        }
      }
    }
  }
}
</style>
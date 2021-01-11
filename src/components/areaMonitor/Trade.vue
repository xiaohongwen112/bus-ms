<template>
  <div class="apps-list-con">
    <div class="app-list" :class="{'node-selected': selected}" v-for="x in items" @click="getTrade(x)">
      <div class="name-div" @mouseover="showWhole($event, x.disp_name)" @mouseout="hideTip">{{x.disp_name}}</div>
      <div class="app-div-body">
        <div class="app-items succ-name">成功率</div>
        <DashBoard :width="dashWidth" :height="dashHeight" :value="x.app_succrate_day" @showTip="showDashNum" @hideTip="hideTip"></DashBoard>
        <div class="app-items day-name">当日</div>
        <div class="app-items day-value"><span>{{transCount(x.transcount_day).value}}</span><span>{{transCount(x.transcount_day).unit}}</span></div>
        <div class="app-items current-name">当前</div>
        <div class="app-items current-value"><span>{{transCount(x.transcount_current).value}}</span><span>{{transCount(x.transcount_current).unit}}</span></div>
      </div>
    </div>
    <svg width="74" height="40" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gradient" y0="0" x0="0" x1="100%" y1="100%">
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

  export default{
    props: ['items', 'nodeSelected'],
    watch: {
      nodeSelected(newval) {
        this.selected = newval;
      },
    },
    components: { DashBoard },
    data() {
      return {
        selected: this.nodeSelected,
        dashWidth: 74,
        dashHeight: 41,
      };
    },
    methods: {
      transCount(data) {
        return formatTransCount(data);
      },
      getTrade(x) {
        this.selected = true;
        this.$emit('on-trade', x);
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
.apps-list-con {
  display: block;
  overflow: hidden;
  width: auto;
  height: calc(100% - 160px);
  margin:0 10px 10px 10px;
  overflow-y: auto;
  direction: rtl;
  .app-list{
    float: left;
    width: 120px;
    height: 120px;
    background: #383e50;
    color: #F0EFEF;
    margin: 5px 5px 5px;
    cursor: pointer;
    direction: ltr;
    &.node-selected{
      background: #3c474b;
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
      width: 100%;
      height: calc(100% - 25px);
      .app-items{
        height: 25px;
        text-align: center;
        float: left;
        line-height: 25px;
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
            width: calc(40% - 5px);
            float: right;
          }
        }
      }
    }
  }
}
</style>

<template>
  <div class="alert-card-div">
    <div class="alert-card-top">
      <div class="top-left">
        <div class="alert-card-title" :class="['', 'warn', 'serious', 'crisis', 'fatal'][Number(data.level)]">
          <span v-show="data.level">
            {{ ['', '警告', '严重', '危急', '致命'][Number(data.level)] }}
          </span>
        </div>
        <div class="alert-card-text">
          {{ data.event }}
        </div>
      </div>
      <ul class="top-right">
        <li>
          <div class="li-name">阈值:</div>
          <div class="li-value" @mouseover="showTip($event, data.thresholds)" @mouseout="hideTip">{{ data.thresholds }}</div>
        </li>
        <li>
          <div class="li-name">最新:</div>
          <div class="li-value" @mouseover="showTip($event, data.value)" @mouseout="hideTip">{{ data.value }}</div></li>
        <li>
          <div class="li-name">峰值:</div>
          <div class="li-value" @mouseover="showTip($event, data.peak)" @mouseout="hideTip">{{ data.peak }}</div></li>
      </ul>
    </div>
    <div class="alert-card-bottom">
      <span class="bottom-left">从{{ formatTime(data.ts_start) }}开始，持续{{ data.duration / 60 }}min</span>
      <span class="bottom-right" :style="{'background-color': data.status.hex}">{{ data.status.name }}</span>
    </div>
    <ShowNameBox 
        :showTips = "showNameFlag"
        :showName = "showTipsName"
        :lefts = "tipsLeft"
        :top = "tipsTop"
      ></ShowNameBox>
  </div>
</template>
<script>
import moment from 'moment';
import ShowNameBox from '@/components/manageApp/main/ShowNameBox';

export default {
  name: 'AlertCard',
  components: {
    ShowNameBox,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      showNameFlag: false, // 提示框
      showTipsName: '',
      tipsLeft: 10,
      tipsTop: 0,
      time: '2018-06-16 10:50:00',
      duration: '30',
    };
  },
  methods: {
    formatTime(val) {
      return moment.unix(val).format('YYYY-MM-DD HH:mm:ss');
    },
    showTip(e, name) {
      if (e.target.scrollWidth > e.target.offsetWidth) {
        const ele = e.target.parentNode;
        // console.log(ele.offsetTop);
        this.showNameFlag = true;
        this.showTipsName = name;
        this.tipsLeft = ele.getBoundingClientRect().left + 30;
        this.tipsTop = ele.getBoundingClientRect().top - 20;
      }
    },
    hideTip() {
      this.showNameFlag = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.alert-card-div{
  width: 390px;
  height: 140px;
  margin: 15px;
  background-color: #0F344F;
  border-radius: 5px;
  box-shadow: inset 0 0 10px #306A97;
  color: #fff;
  font-size: 16px;
  .alert-card-top{
    width: 100%;
    height: 110px;
    .top-left{
      float: left;
      width: 270px;
      height: 100%;
      .alert-card-title{
        width: 73px;
        height: 36.5px;
        line-height: 36.5px;
        // background-color: rgb(241, 84, 84);
        // box-shadow: inset 0px 0px 10px #f54f70;
        text-align: center;
      }
      .alert-card-title.warn{
        background-color: #b7b084;
      }
      .alert-card-title.serious{
        background-color: #cf9216;
      }
      .alert-card-title.crisis{
        background-color: #f26945;
      }
      .alert-card-title.fatal{
        background-color: #d00b0b;
      }
      .alert-card-text{
        width: calc(100% - 18px);
        height: 73.5px;
        line-height: 73.5px;
        padding-left: 15px;
      }
    }
    .top-right{
      float: right;
      width: 120px;
      height: 100%;
      font-size: 14px;
      background-color: #306A97;
      li{
        width: 100%;
        height: 36.5px;
        line-height: 36.5px;
        padding-left: 10px; 
        padding-right: 10px;
        display: flex; 
        justify-content: center;
        align-items: center;
        .li-name{
          width: 35px;
          text-align: left;
        }
        .li-value{
          width: 60px;
          text-align: right;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        &:nth-child(1), &:nth-child(2) {
          border-bottom: 1px solid #0F344F;
        }
      }
    }
  }
  .alert-card-bottom{
    width: 100%;
    height: 30px;
    line-height: 30px;
    background: #102e41;
    padding:0 15px;
    font-size: 12px;
    span{
      display: inline-block;
    }
    .bottom-left{
      width: 315px;;
    }
    .bottom-right{
      width: 45px;
      height: 20px;
      line-height: 20px;
      margin-left: -6px; 
      // border: 1px solid #3dd9c4;
      border-radius: 8px;
      background-color: #0F344F;
      // background-color: rgb(241, 84, 84);
      text-align: center;
    }
  }
}
</style>

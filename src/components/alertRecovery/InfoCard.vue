<template>
  <div class="intf-card">
    <div class="intf-name-div alert-recovery-bg text-ellipsis" @mouseover="showTip($event, index)" @mouseout="hideTip">{{index}}</div>
    <div class="text-ellipsis recovery-time-div" v-if="alerts === 'null'">--</div>
    <div class="text-ellipsis recovery-time-div" :class="timeStamp(alerts).style" v-else v-html="timeStamp(alerts).time"></div>
    <ShowNameBox 
      :showTips = "showNameFlag"
      :showName = "showTipsName"
      :lefts = "tipsLeft"
      :top = "tipsTop"
    ></ShowNameBox>
  </div>
</template>

<script>
  import ShowNameBox from '@/components/manageApp/main/ShowNameBox';
  import { textWidth } from '@/helpers/utils';

  export default {
    props: ['alerts', 'index'],
    components: { ShowNameBox },
    data() {
      return {
        showNameFlag: false, // 提示框
        showTipsName: 'tishi111',
        tipsLeft: 10,
        tipsTop: 0,
      };
    },
    methods: {
      timeStamp(secondTime) {
        let time = '';
        let style = '';
        if (secondTime) {
          if (parseInt(secondTime, 10) > 60) {
            const second = parseInt(secondTime, 10) % 60;
            let min = parseInt(secondTime / 60, 10);
            time = `<span class="alert-num">${min}</span><span class="alert-unit">分钟</span>${
                  second > 0 ? `<span class="alert-num">${second}</span><span class="alert-unit">秒</span>` : ''}`;
            if (min > 10 && min < 60) {
              if (min > 10 && min < 20) {
                style = 'orange-1';
              }
              if (min >= 20 && min < 30) {
                style = 'orange-2';
              }
              if (min >= 30 && min < 40) {
                style = 'orange-3';
              }
              if (min >= 40 && min < 50) {
                style = 'orange-4';
              }
              if (min >= 50 && min < 60) {
                style = 'orange-5';
              }
            }
            if (min >= 60) {
              min = parseInt(secondTime / 60, 10) % 60;
              let hour = parseInt(parseInt(secondTime / 60, 10) / 60, 10);
              time = `<span class="alert-num">${hour}</span><span class="alert-unit">小时</span>${
                    (second === 0 && min === 0) ? '' : `<span class="alert-num">${min}</span><span class="alert-unit">分钟</span>`
                    }${second === 0 ? '' : `<span class="alert-num">${second}</span><span class="alert-unit">秒</span>`}`;
              if (second === 0) {
                style = 'orange-5';
              } else if (second > 0) {
                style = 'orange';
              }
              if (hour > 24) {
                hour = parseInt(parseInt(secondTime / 60, 10) / 60, 10) % 24;
                const day = parseInt(parseInt(parseInt(secondTime / 60, 10) / 60, 10) / 24, 10);
                time = `<span class="alert-num">${day}</span><span class="alert-unit">天</span>` +
                        `<span class="alert-num">${hour}</span><span class="alert-unit">小时</span>` +
                        `<span class="alert-num">${min}</span><span class="alert-unit">分钟</span>` +
                        `<span class="alert-num">${second}</span><span class="alert-unit">秒</span>`;
                if (second === 0) {
                  style = 'orange';
                } else if (second > 0) {
                  style = 'red';
                }
              }
            }
          } else {
            time = `<span class="alert-num">${secondTime}</span><span class="alert-unit">秒</span>`;
          }
        } else {
          time = '--';
        }
        return {
          time,
          style,
        };
      },
      showTip(e, name) {
        if (textWidth(name) >= 87) {
          const ele = e.target.parentNode;
          const position = {
            left: ele.getBoundingClientRect().left,
            top: ele.getBoundingClientRect().top - 310,
            tipName: name,
          };
          this.showNameFlag = true;
          this.showTipsName = position.tipName;
          this.tipsLeft = position.left;
          this.tipsTop = position.top;
        }
      },
      hideTip() {
        this.showNameFlag = false;
      },
    },
  };
</script>
<style lang="scss" scoped>
  .intf-card{
    height: 52px;
    border: 1px solid #0f3f62;
    border-radius: 3px;
    width: 170px;
    margin: 10px;
    background: #0a1925;
    display: inline-block;
    .intf-name-div{
      height: 20px;
      line-height: 20px;
      width: 123px;
      padding-left: 18px;
      color: #98cdef;
      padding-right: 18px;
    }
    .alert-recovery-bg{
      background: url(../../assets/alertRecovery/alertRecoveryBg.png) no-repeat center;
      background-size: 100% 100%;
    }
    .text-ellipsis{
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .recovery-time-div{
      text-align: center;
      height: calc(100% - 20px);
      color: #dfebf2;
      font-size: 16px;
      font-weight: 400;
      line-height: 2em;
      &.orange {
        color: #eb932c !important;
      }
      &.orange-5 {
        color: #eda046 !important;
      }
      &.orange-4 {
        color: #f1b269 !important;
      }
      &.orange-3 {
        color: #f5ca98 !important;
      }
      &.orange-2 {
        color: #fae2c6 !important;
      }
      &.orange-1 {
        color: #fdf3e7 !important;
      }
      &.red {
        color: #e83e1c !important;
      }
    }
  }
</style>
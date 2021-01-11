<template>
  <div
    :class="['tradeCardDiv', index === 'first' ? 'firstCard' : index === 'last' ? 'lastCard' : '', ifOneCard ? '' : 'lastCard' ]"
    @mouseenter="showCtrls = true"
    @mouseleave="showCtrls = false">
    <div class="importanceDiv" v-show="showCtrls">
      <a class="toTop" @click="setOrder('toTop')"></a>
      <a class="front" @click="setOrder('front')"></a>
      <a class="behind" @click="setOrder('behind')"></a>
      <a class="toBottom" @click="setOrder('toBottom')"></a>
    </div>
    <div class="cardTopDiv">
      <a :href="`/zh-cn/stat/${data.app_name}/cap/${data.intf_name}/`">
        <span class="leftTopDiv">
          <img :src="imgSrc">
          <span class="appName"
          @mouseover="checkName" 
          @mouseout="showNameFlag = false"
          >{{data.app_disp_name}}</span>
          <span class="appSplit">—</span>
          <span class="tradeName"
          @mouseover="checkName" 
          @mouseout="showNameFlag = false"
          >{{data.intf_dispname}}</span>
        </span>
        <span
          :class="['tradeFollow', data.is_follow ? 'isFollow' : '']"
          @click="setFollow($event)"></span>
      </a>
    </div>
    <template v-if="data.is_monitor">
    <div class="cardMiddleDiv">
      <div class="transCountName">交易量</div>
      <div class="transCountValue">{{ transCount.value }}
        <span class="transCountUnit">{{ transCount.unit }}</span>
      </div>
    </div>
    <div class="rateDiv">
      <div class="succDiv ">
        <span class="rateName">成功率</span>
        <div class="progressBarDiv">
          <div class="progressBar">
            <ProgressBar
              :startColor="'#39ca76'"
              :stopColor="'#55ede7'"
              :colorBg="'#424242'"
              :width="128"
              :height="11"
              :percent="succRate/100"
            />
          </div>
        </div>
        <div class="rateVal">{{ succRate }}%</div>
      </div>
      <div class="respDiv ">
        <span class="rateName">响应率</span>
        <div class="progressBarDiv">
          <div class="progressBar">
            <ProgressBar
              :startColor="'#39ca76'"
              :stopColor="'#55ede7'"
              :colorBg="'#424242'"
              :width="128"
              :height="11"
              :percent="rrRate/100"
            />
          </div>
        </div>
        <div class="rateVal">{{ rrRate }}%</div>
      </div>
    </div>
    <div class="cardBottomDiv">
      <div class="healthDiv bottomLeftDiv">
          <LiquidGauge
            :text="gaugeText.text"
            :waveColor="gaugeText.color"
            :percent="data.health/ 100"
            :radius="32"
            :showGlass="true"
            :textWeight="'normal'"
            :textSize="'14px'"
            :textCenter="true"
          />
      </div>
      <div class="bottomRightDiv">
        <div class="duration quotaDiv">
          <span class="quotaName">{{ `响应时间(${duration.unit})` }}</span>
          <span class="quotaValue value">{{duration.value}}</span>
        </div>
        <div class="alert quotaDiv">
          <span class="alert">告警</span>
          <span class="quotaValue">
            <a
              :class="[data.alert_count > 0 ? 'alertQuota' : 'alertCount']"
              :href="`/zh-cn/alert/?topov=${data.app_name}&intf=${data.intf_name}`">{{data.alert_count}}</a>
          </span>
        </div>
      </div>
    </div>
    </template>
    <div v-else class="cardNoMonitor">
      <img src="../../assets/customView/noMonitor.png">
    </div>
    <ShowNameBox 
      :showTips = "showNameFlag"
      :showName = "showTipsName"
      :lefts = "tipsLeft"
      :top = "tipsTop"
    ></ShowNameBox>
    <div class="tradeCardDiv-disable" v-if="Visit" @mouseleave="showCtrls = false" @mouseenter="showCtrls = false"></div>
</div>

</template>
<script>
import ProgressBar from '@/components/common/ProgressBar';
import LiquidGauge from '@/components/common/Gauge/LiquidGauge';
import ShowNameBox from '@/components/manageApp/main/ShowNameBox';

import {
  formatTransCount, formatNum,
  formatTime, imgUrl, getHealthStatus,
} from '@/helpers/utils';

const props = {
  index: {
    type: String,
    default: 'first',
  },
  ifOneCard: { // 分类只出现一个卡片，判断是否排序栏显示
    type: Boolean,
    default: true,
  },
  data: {
    type: Object,
    default: () => ({
      imgname: 'Components5',
      alert_location_count: 0,
      app_name: 'app1',
      importance: 10001,
      is_follow: false,
      time: 1518692760,
      alert_count: 0,
      health: 40,
      intf_name: 'intf2',
      app_disp_name: '银联',
      duration: 0,
      intf_dispname: '前置',
      succ_rate: 0,
      trans_count: 0,
      rr_rate: 0,
    }),
  },
  i: {
    default: 0,
  },
};

export default {
  name: 'trade-card',
  props,
  components: {
    ProgressBar,
    LiquidGauge,
    ShowNameBox,
  },
  data() {
    return {
      Visit: true,
      showCtrls: false,
      tipsLeft: 10,
      tipsTop: 0,
      showNameFlag: false, // 提示框
      showTipsName: 'tishi111',
    };
  },
  computed: {
    transCount() {
      return formatTransCount(this.data.trans_count);
    },
    succRate() {
      return formatNum(this.data.succ_rate);
    },
    rrRate() {
      return formatNum(this.data.rr_rate);
    },
    duration() {
      return formatTime(this.data.duration);
    },
    imgSrc() {
      return imgUrl(this.data.imgname);
    },
    gaugeText() {
      return getHealthStatus(this.data.health);
    },
  },
  methods: {
    setOrder(type) {
      this.$emit('setOrder', { type, data: this.data, i: this.i });
    },
    setFollow(e) {
      e.preventDefault();
      e.stopPropagation();
      this.$emit('setFollow', this.data);
    },
    checkName(e) {
      const ele = e.target;
      if (ele.clientWidth !== ele.scrollWidth) {
        this.tipsLeft = ele.getBoundingClientRect().left;
        this.tipsTop = ele.getBoundingClientRect().top - 173 + 40;
        this.showNameFlag = true;
        this.showTipsName = e.target.innerText;
      } else {
        // this.showNameFlag = false;
      }
    },
  },
  mounted() {
    this.Visit = !this.session$.newpermissions.trade_overview_edit;
  },
};

</script>
<style lang="scss" scoped>

.tradeCardDiv {
  // position: relative;
  height: 256px;
  width: 336px;
  background: #131d26;
  border-radius: 5px;
  margin: 35px 50px;
  float: left;
  .tradeCardDiv-disable{
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 200;
  }

  .importanceDiv {
    float: right;
    background: #1a2732;
    border-radius: 5px 5px 5px 0;
    height: 20px;
    margin-top: -20px;
    // display: none;

    a {
      display: inline-block;
      width: 18px;
      height: 20px;
      line-height: 20px;
      cursor: pointer;
      text-align: center;
      background-position-x: 4px !important;
      background-position-y: 6px !important;

      &.toTop {
        background: url(../../assets/sys-icon/toTop.svg) no-repeat;
      }

      &.front {
        background: url(../../assets/sys-icon/front.svg) no-repeat;
      }

      &.behind {
        background: url(../../assets/sys-icon/behind.svg) no-repeat;
      }

      &.toBottom {
        background: url(../../assets/sys-icon/toBottom.svg) no-repeat;
      }

      &:hover {
        background-color: #324a62;
      }

    }
  }

  &.firstCard {

    .importanceDiv a {
      &.toTop {
        background: url(../../assets/sys-icon/toTopGray.svg) no-repeat;
        pointer-events: none;
      }

      &.front {
        background: url(../../assets/sys-icon/frontGray.svg) no-repeat;
        pointer-events: none;
      }
    }
  }

  &.lastCard {

    .importanceDiv a {

      &.behind {
        background: url(../../assets/sys-icon/behindGray.svg) no-repeat;
        pointer-events: none;
      }

      &.toBottom {
        background: url(../../assets/sys-icon/toBottomGray.svg) no-repeat;
        pointer-events: none;
      }
    }
  }

  .cardTopDiv {
    height: 40px;
    text-align: center;
    line-height: 40px;

    &:hover {
      background: #324a62;
    }

    a {
      width: calc(100% - 5px);
      height: 100%;
      padding: 0 5px;
      display: flex;
      justify-content: space-between;
      align-content: center;

      .leftTopDiv {
        display: inline-block;
        width: calc(100% - 22px);

        img {
          width: 30px;
          vertical-align: middle;
          display: inline-block;
          margin-top: -32px;
        }

        span {
          display: inline-block;
          white-space: nowrap;
          overflow: hidden;
          list-style: none;
          text-overflow: ellipsis;
          max-width: calc(50% - 34px);
          &.appSplit {
            color: #0dcac4;
            font-size: 14px;
          }
          &.appName {
            margin-left: 10px;
            font-size: 18px;
            color: #fffffd;
          }

          &.tradeName {
            color: #0dcac4;
            font-size: 16px;
          }
        }
      }

      .tradeFollow {
        width: 22px;
        background: url(../../assets/customView/wHeart.png) no-repeat;
        background-position: center;
        background-size: contain;
        &.isFollow {
          background-image: url(../../assets/customView/rHeart.png);
        }
      }


    }
  }

  .cardMiddleDiv {
    color: #fbf9fa;
    height: 60px;
    border-top: 1px solid #0f181f;
    border-bottom: 1px solid #0f181f;
    background: #1c2a37;
    padding: 5px 20px;

    .transCountName {
      font-size: 14px;
      height: 20px;
      line-height: 20px;
    }

    .transCountValue {
      height: 32px;
      line-height: 32px;
      text-align: center;
      font-size: 26px;
      color: #2ab5ed;

      .transCountUnit {
        font-size: 14px;
        margin-left: 4px;
      }
    }
  }

  .rateDiv {
    height: 68px;
    border-bottom: 1px solid #0f181f;
    padding: 10px 20px;

    .succDiv, .respDiv {
      height: 50%;
      display: flex;
      justify-content: left;
      margin-left: 50px;
      align-content: center;

      .progressBarDiv {
        margin: 0 5px;
      }

      .rateVal {
        font-size: 12px;
        text-align: center;
      }
    }
  }

  .cardBottomDiv {
    height: 84px;

    .bottomLeftDiv {
      width: 64px;
      height: 64px;
      border-right: 1px solid #0f181f;
      float: left;
      padding: 10px 24px;
      display: inline-block;
      box-sizing: content-box;
    }

    .bottomRightDiv {
      width: calc(100% - 114px);
      height: 100%;
      display: inline-block;

      .quotaDiv {
        width: 100%;
        height: 44px;
        text-align: center;
        display: flex;
        justify-content: space-between;
        padding: 0 20px;
        align-items: center;

        .quotaName {
          margin-top: 10px;
        }

        .value {
          color: #fff;
          margin-top: 10px;
        }

        .alert {
          margin: 0;
          padding: 0;
        }

        .alertCount {
          color: #2ab5ed;
        }

        .alertQuota {
          color: #ed392b;
        }
      }

      .alert {
        margin-top: -5px;
      }
    }
  }

  .cardNoMonitor {
    height: 85%;
    border-top: 1px solid #1c2a37;

    img {
      margin: 45px 85px;
    }
  }

}

</style>


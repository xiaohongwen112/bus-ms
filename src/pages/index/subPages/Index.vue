<template>
  <div class="index-content">
    <nav-bar :title="''">
      <div slot="slot-content" class="config-health-name">
        <div v-if="nameFlag" class="health-situation">健康态势</div>
        <div v-else>
          <span class="final-name" v-show="!emptyName" @click="emptyName=true">{{healthName}}&nbsp;健康态势</span>
          <span v-show="emptyName">
            <input class="health-name" @input="checkName" id="healthNameInput" @blur="changeName" v-model="healthName" 
            type="text" maxlength="20" :disabled="!VisitInput" :class="VisitInput ? '' : 'disable-input'"/>健康态势
          </span>
        </div>
      </div>
    </nav-bar>
    <div class="index-top-div index-bg index-flex">
      <div class="index-name">业务</div>
      <div class="all-health-div">
        <slide-list :index="appIndex" @move="moveApp" @getLeft="getAppLeft">
          <template slot="list">
            <app-gauge v-for="(value, index) in appList"
                       :key="index"
                       :data="value"
                       :selected="selectedAppName === value.name"
                       :isFirst="index === 0"
                       @selectedApp="selectedApp"
                       @showTip="showTip"
                       @hideTip="showNameFlag=false"
            ></app-gauge>
          </template>
        </slide-list>
      </div>
      <div class="index-app-btn">
        <a href="/zh-cn/center/manageapp/">
          <img src="../../../assets/index/app-wall.png">
          <div>业务墙</div>
        </a>
      </div>
    </div>

    <div class="index-center-div index-bg index-flex">
      <div class="arrow-tip" :style="`transform: translate(${arrowLeft}px,0px)`"></div>
      <div class="index-name">总体健康度</div>
      <div class="all-health-div index-flex">
        <clock-liquid :percent="health" :second="second"></clock-liquid>
      </div>
      <div class="index-intf-div index-flex">
        <div class="intf-title">交易节点</div>
        <div class="index-intf-list index-flex">
          <slide-list :cardWidth="intfCardWidth" :offsetWidth="intfCardOffset" :update="appChange">
            <template slot="list">
              <intf-gauge v-for="(value, index) in intfList" :key="index" :data="value" :inftTopChange="inftTopChange" @showTip="showTip"
                @hideTip="showNameFlag=false"></intf-gauge>
            </template>
          </slide-list>
        </div>
        <div class="index-app-btn index-intf-btn">
          <div class="customview-disabled" v-if="Visit"></div>
          <a href="/zh-cn/trade/indexcustomview/">
            <img src="../../../assets/index/intf-overview.png">
            <div>交易总览</div>
          </a>
        </div>
      </div>
    </div>

    <div class="index-bottom-div">
      <div class="index-bottom-left">
        <div class="area-title">区域监控</div>
        <china-map :isDrill="false" :data="mapData.ll_data" :isApply="mapData.is_apply" @mapClick="toAreaMonitor"></china-map>
      </div>
      <div class="index-bottom-right">
        <index-quota class="index-bg" :data="trade"></index-quota>
        <index-alert class="index-bg" :data="alertCount" :selectedAppName="selectedAppName"></index-alert>
        <div class="index-alert-info index-bg">
          <alert-sound :open="soundOpen" :sound="sound" @clickAudio="soundConfig"></alert-sound>
          <div class="history-health">
            <div class="area-title">健康度历史状态</div>
            <div class="health-container">
              <AreaChart type="area" :data="healthData" :xMarks="xMarks" :legend="legend" :unit="unit" :brushOpen="brushOpen"></AreaChart>
            </div>
          </div>
        </div>
      </div>
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
  import { ScrollBar, NavBar, ChinaMap } from '@/components/common';
  import { AppGauge, IntfGauge, SlideList, IndexQuota, IndexAlert, AlertSound, ClockLiquid } from '@/components/index';
  import AreaChart from '@/components/common/AreaChart/index';
  import { validateCollName, checkError } from '@/helpers/configValidate';
  import moment from 'moment';
  import ShowNameBox from '@/components/manageApp/main/ShowNameBox';

  import {
    getAlert,
    getSysName,
    getSysTime,
    getSound,
    getMapData,
    getHealth,
    getGlobalTrade,
    setSoundStaus,
    getHistoryHealth,
    changeSysName,
    getAlertInfo,
  } from './../service';

  export default {
    name: 'index',
    components: {
      ScrollBar,
      NavBar,
      ClockLiquid,
      ChinaMap,
      AppGauge,
      IntfGauge,
      SlideList,
      IndexQuota,
      IndexAlert,
      AlertSound,
      AreaChart,
      ShowNameBox,
    },
    data() {
      return {
        Visit: true,
        VisitInput: true,
        emptyName: false,
        healthName: '',
        sysTime: '',
        health: 0,
        appList: [],
        appCardWidth: 154,
        intfList: [],
        intfCardWidth: 112,
        intfCardOffset: 0,
        mapData: {},
        trade: {},
        alertCount: {},
        soundOpen: false,
        selectedAppName: '',
        isSelected: false,
        selectedDelay: 0,
        appSlideLeft: 0,
        appChange: true,
        secondBefore: 0,
        second: 0,
        timer: null,
        healthData: [],
        xMarks: ['00:00', '03:20', '06:40', '10:00', '13:20', '16:40', '19:59', '23:19'],
        legend: [],
        unit: ['%'],
        brushOpen: false,
        wetherChange: true,
        showNameFlag: false, // 提示框
        showTipsName: 'tishi111',
        tipsLeft: 10,
        tipsTop: 0,
        nameFlag: true,
        alertShow: false,
        inftTopChange: false,
      };
    },
    created() {
      this.getIndexData();
    },
    watch: {
      selectedAppName() {
        if (this.selectedAppName) {
          this.getHealth(this.selectedAppName);
          this.getHisHealth(this.selectedAppName);
          this.getGlobalTrade(this.selectedAppName);
          this.getAlert(this.selectedAppName);
        }
      },
      sysTime() {
        const tmp = this.sysTime.match(/\d{2}$/);
        this.second = tmp ? Number(tmp[0]) : 0;
      },
    },
    computed: {
      appIndex() {
        return this.appList.findIndex(d => d.name === this.selectedAppName) + 1;
      },
      arrowLeft() {
        return this.appIndex === 1 ? 97 : (this.appList.findIndex(d => d.name === this.selectedAppName) + 1 / 2) * this.appCardWidth + 20 + this.appSlideLeft;
      },
      sound() {
        return this.soundOpen && this.alertShow;
      },
    },
    methods: {
      showTip(position) {
        this.showNameFlag = position.flag;
        this.showTipsName = position.tipName;
        this.tipsLeft = position.left;
        this.tipsTop = position.top;
      },
      checkName(e) {
        const val = e.target.value;
        const res = validateCollName(val);
        if (res.bool === false) {
          e.target.style.border = '2px solid #f00';
        } else {
          e.target.style.border = '2px solid #32939C';
        }
        this.wetherChange = res.bool;
        checkError(res, e.target);
      },
      changeName(e) {
        this.checkName(e);
        if (this.wetherChange) {
          this.emptyName = false;
          this.changeSysName(this.healthName);
        }
      },
      appCarousel() {
        const selectedIndex = this.appList.findIndex(d => d.name === this.selectedAppName);
        if (selectedIndex === -1) {
          return false;
        } else if (selectedIndex === this.appList.length - 1) {
          this.selectedAppName = this.appList[0].name;
        } else {
          this.selectedAppName = this.appList[selectedIndex + 1].name;
        }
        this.isSelected = false;
        this.selectedDelay = 0;
        return true;
      },
      selectedApp(data) {
        this.selectedAppName = data.appName;
        this.isSelected = true;
      },
      moveApp({ index }) {
        this.selectedAppName = this.appList[index].name;
      },
      getAppLeft({ slideLeft }) {
        this.appSlideLeft = slideLeft;
      },
      resize() {
        window.onresize = () => {
          if (window.innerHeight <= 700) this.inftTopChange = true;
          else this.inftTopChange = false;
        };
      },
      getIndexData() {
        this.getSysName();
        this.getSysTime();
        this.getMapData();
        this.getHealth();
        this.getSoundInfo();
        if (this.selectedAppName) {
          this.getHealth(this.selectedAppName);
          this.getHisHealth(this.selectedAppName);
          this.getGlobalTrade(this.selectedAppName);
          this.getAlert(this.selectedAppName);
        }
      },
      step() {
        const secondTmp = new Date().getSeconds();
        if (this.secondBefore !== secondTmp) {
          this.secondBefore = secondTmp;
          this.second = this.second === 59 ? 0 : this.second + 1;
          if (this.second % 10 === 0) {    // 10s轮播，如果有业务被点击则30s后开始轮播
            if (this.isSelected) {
              if (this.selectedDelay === 2) {
                this.appCarousel();
              } else {
                this.selectedDelay += 1;
              }
            } else {
              this.appCarousel();
            }
          }

          if (this.second === 0) {
            this.getIndexData();
          }
        }
        window.cancelAnimationFrame(this.timer);
        this.timer = window.requestAnimationFrame(this.step);
      },
      async soundConfig({ isOpen }) {
        try {
          const res = await setSoundStaus(isOpen);
          if (res.data.code === 0) {
            this.soundOpen = isOpen;
          } else {
            console.log('sound change failed');
          }
        } catch (e) {
          console.error(e);
        }
      },
      async getAlert(name) {
        try {
          const res = await getAlert(name);
          if (res.data.code === 0) {
            this.alertCount = res.data.data.count;
          }
        } catch (e) {
          console.error(e);
        }
      },
      async getSysName() {
        try {
          const res = await getSysName();
          if (res.data.code === 0) {
            this.nameFlag = false;
            this.healthName = res.data.data.name;
            if (this.healthName === '' || this.healthName === null) {
              this.emptyName = true;
            } else {
              this.emptyName = false;
            }
          }
        } catch (e) {
          console.error(e);
        }
      },
      async changeSysName(name) {
        try {
          if (name !== '' && name !== null) {
            const res = await changeSysName(name);
            if (res.data.code === 0) {
              this.healthName = name;
            }
          }
        } catch (e) {
          console.error(e);
        }
      },
      async getSysTime() {
        try {
          const res = await getSysTime();
          this.sysTime = res.data.data.systime;
        } catch (e) {
          console.error(e);
        }
      },
      async getSound() {
        try {
          const res = await getSound();
          if (res.data.code === 0) this.soundOpen = res.data.data.status === 'true';
        } catch (e) {
          console.error(e);
        }
      },
      async getAlertInfo() {
        try {
          const res = await getAlertInfo();
          if (res.data.code === 0) {
            const warnTips = res.data.data;
            if (warnTips.length !== 0) {
              let sd = false;
              for (let i = 0; i < warnTips.length; i += 1) {
                const sumd = warnTips[i].danger_score;
                if (sumd === 100) {
                  sd = true;
                }
              }
              if (sd) {
                this.alertShow = true;
              }
            }
          }
        } catch (e) {
          console.error(e);
        }
      },
      async getMapData() {
        try {
          const res = await getMapData();
          if (res.data.code === 0) {
            this.mapData = res.data.data;
          }
        } catch (e) {
          console.error(e);
        }
      },
      sort(el) {
        for (let i = 0; i < el.length - 1; i += 1) {
          for (let j = 0; j < el.length - i - 1; j += 1) {
            if (el[j].health.health_stat > el[j + 1].health.health_stat) {
              const swap = el[j];
              el[j] = el[j + 1]; // eslint-disable-line
              el[j + 1] = swap; // eslint-disable-line
            }
          }
        }
        return el;
      },
      async getHealth(appName) {
        try {
          const res = await getHealth(appName);
          const data = res.data;
          if (data.code === 0) {
            if (appName) {
              const list = data.data.per_health;
              if (list.length !== 0) {
                if (list.length === 1) {
                  this.intfList = list;
                } else {
                  this.intfList = this.sort(list);
                }
              }
              this.appChange = !this.appChange;
            } else {
              this.health = data.data.health === 0 ? null : data.data.health;
              this.appList = data.data.per_health;
              if (this.appList.length && this.selectedAppName === '') {
                this.selectedAppName = this.appList[0].name;
              }
            }
          }
        } catch (e) {
          console.error(e);
        }
      },
      async getGlobalTrade(appName) {
        try {
          const res = await getGlobalTrade(appName);
          if (res.data.code === 0) {
            this.trade = res.data.data;
          }
        } catch (e) {
          console.error(e);
        }
      },
      getSoundInfo() {
        this.getSound();
        this.getAlertInfo();
      },
      getHisHealth(name) {
        this.legend = [];
        this.xMarks = [];
        this.getHistoryHealth(name);
      },
      async getHistoryHealth(appName) {
        try {
          const res = await getHistoryHealth(appName);
          if (res.data.code === 0) {
            const data = res.data.data;
            const list = data.min_health_list;
            this.legend = [];
            this.legend.push(data.app_disp_name);
            const start = data.ts_day_start;
            const end = data.ts_day_end;
            let startMin = 0;
            let endMin = Math.floor((end - start) / 60);
            if (list.length > 0) {
              const dataStart = list[0].time;
              const dataEnd = list[list.length - 1].time;
              startMin = Math.floor((dataStart - start) / 60);
              endMin = Math.floor((end - dataEnd) / 60);
            }
            const dataX = list.map((d) => { // eslint-disable-line
              return moment.unix(d.time).format('HH:mm');
            });
            const chartHasData = list.map((d) => { // eslint-disable-line
              return d.health;
            });
            let x = d3.range(startMin).map((d) => { // eslint-disable-line
              return moment.unix(start + d * 60).format('HH:mm');
            }).concat(dataX).concat(d3.range(endMin).map((d) => { // eslint-disable-line
              return moment.unix(start + (dataX.length + d) * 60).format('HH:mm');
            }));
            const chartData = d3.range(startMin).map(() => { // eslint-disable-line
              return 0;
            }).concat(chartHasData).concat(d3.range(endMin).map(() => { // eslint-disable-line
              return 0;
            }));
            if (x[x.length - 1] !== moment.unix(end).format('HH:mm')) {
              x.push(moment.unix(end).format('HH:mm'));
              chartData.push('0');
            }
            this.xMarks = x;
            this.healthData = chartData;
          }
        } catch (e) {
          console.error(e);
        }
      },
      toAreaMonitor() {
        location.href = '/zh-cn/area/monitor/';
      },
    },
    mounted() {
      this.Visit = !this.session$.newpermissions.trade_overview_detail;
      this.VisitInput = this.session$.newpermissions.home_page_edit;
      if (window.innerHeight <= 700) this.inftTopChange = true;
      else this.inftTopChange = false;
      this.timer = window.requestAnimationFrame(this.step);
      window.setInterval(this.getSoundInfo, 10000);
      window.addEventListener('resize', this.resize);
    },
    destroy() {
      window.removeEventListener('resize', this.resizeHandler);
    },
  };

</script>
<style lang="scss">
@media (max-height: 824px) {
  .index-content{
    .history-health{
      position: relative;
      width: 100%;
      height: 100%;
      .health-container{
        position: absolute;
        top: 0;
        width: 100%;
        height:calc(100% + 16px) !important;
        margin-top: 0px;
      }
      .area-title{
        margin-top: -5px;
      }
    }
  }
}
.index-content{
  .history-health{
    .health-container{
      height:calc(100% - 50px);
      .legend-group.center{
        text-align:right;
      }
    }
  }
  /*.index-center-div{
    .all-health-div{
      .liquid-gauge-svg{
        .liquid-gauge-text{
          transform: translate(46, 56) !important;
        }
      }
    }
  }*/
}
</style>
<style lang="scss" scoped>
  .index-content{
    height: 100%;
    width: 100%;
    position: relative;
  }
  .index-bg {
    background: url(../../../assets/index/index-div-bg.png) no-repeat;
    background-size: 100% 100%;
  }

  .index-flex {
    display: flex;
    display: -webkit-flex;
    justify-content: space-between;
    align-items: center;
  }

  .index-flex > div {
    height: calc(100% - 14px);
  }
  .config-health-name{
    font-size: 32px;
    line-height: 40px;
    height: 100%;
    .final-name{
      display:inline-block;
      height: 100%;
      line-height:40px;
      color: #B9CFE1;
      font-size: 32px;
      text-align:right;
    }
    .health-name{
      display: inline-block;
      height: 35px;
      width: 200px;
      line-height: 35px;
      background: rgba(0,0,0,0);
      margin-right: 5px;
      border-radius: 50px;
      outline: none;
      vertical-align: text-bottom;
      padding: 0 10px;
      text-align:right;
      color: #fff;
      font-size: 24px;
      border: 2px solid #32939C;
    }
    .disable-input{
      border-color: #666666 !important;
    }
  }
  .index-top-div {
    width: 100%;
    height: 67px;
    margin-top: 24px;
    /*background: #081924;*/
  }
  .index-top-div > div {
    height: calc(100% - 8px);
  }

  .index-center-div {
    border-top: 1px solid #051923;
    border-bottom: 1px solid #051923;
    height: 150px;
    width: 100%;
    margin-top: 12px;

    .all-health-div{
      width: 135px;
      justify-content: center;
    }

    .arrow-tip{
      width: 40px;
      height: 10px!important;
      background: url(../../../assets/index/arrow-tip.png) no-repeat;
      background-size: 100% 100%;
      position: absolute;
      top: 139px;
      left: 76px;
      pointer-events: none;
    }
    .index-intf-div{
      width: calc(100% - 258px);
      border: 1px solid transparent;
      background-size: 150% 100%;
      background-position-x: 20%;
      background-image: url(../../../assets/index/index-intf-bg.png);
      border-image: url(../../../assets/index/index-intf-bg.png) 0 0 0 83;
      border-width: 0 0 0 83px;
      height: 100%;
      background-repeat: no-repeat;
      background-clip: content-box;

      .intf-title{
        height: 97px;
        line-height: 25px;
        font-size: 20px;
        width: 20px;
        position: absolute;
        top: 175px;
        left: 250px;
        color: #edf0f0;
        font-weight: 500;
        text-align: center;
      }

      .index-intf-list{
        width: calc(100% - 80px);
        margin-left: 20px;
        height: calc(100% - 18px);
      }
    }
  }

  .index-bottom-div {
    height: calc(100% - 326px);
    width: calc(100% - 16px);
    margin: 10px 8px;

    .index-bottom-left{
      width: calc(60% - 10px);
      background-image: url(../../../assets/index/area-monitor-bg.png);
      background-size: 100% 100%;
      height: 100%;
      margin: 0 5px;
      float: left;

      .map-container{
        width: calc(100% - 20px);
        height: calc(100% - 50px);
        margin-left: 20px;
      }
    }

    .index-bottom-right{
      width: calc(40% - 10px);
      height: 100%;
      margin: 0 5px;
      float: left;

      .index-alert-info{
        width: 100%;
        height: calc(100% - 208px);
      }
    }
  }

  .index-name {
    padding-left: 12px;
    width: 28px;
    color: #edf0f0;
    font-size: 20px;
    font-weight: normal;
  }

  .all-health-div {
    width: calc(100% - 100px);
    display: flex;
    display: -webkit-flex;
    justify-content: space-between;
    align-items: center;
    /*flex-direction: row;*/
  }

  .index-app-btn {
    width: 59px;
    border-left: 1px solid #072032;
    text-align: center;

    a {
      display: inline-block;
      color: #207ec1;
      cursor: pointer;
      margin-top: 8px;
    }

    a:hover{
      color: #bcd4d9;
    }
  }

  .index-intf-btn{
    position: relative;
    .customview-disabled{
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      margin-top: 1px;
      height: calc(100% - 2px);
      z-index: 200;
      cursor: default;
    }
    a{
      margin-top: 41.5px;
      width: 30px;
    }
  }

  .scroll-area{
    /*overflow-x: hidden;*/
    /*overflow-y: auto;*/
    position: relative;
    left: 0;
    right: 0;
    top: 0;
    bottom: 30px;
    height: calc(100% - 30px);
    width: 100%;
  }

  .area-title{
    display: inline-block;
    margin: 20px 0 0 20px;
    font-size: 20px;
    font-weight: normal;
  }

  .history-health{
    height: 100%;
    .health-container{
      .chart-svg{
        background-color:transparent;
      }
    }
  }
  @media (max-height: 700px) {
    .area-title{
      font-size:18px;
    }
    .index-top-div{
      margin-top: 5px;
      .index-name{
        font-size:18px;
      }
    }
    .index-center-div{
      height: 120px;
      .arrow-tip{
        top: 120px;
        &+.index-name{
          height: 100%;
          margin-top: -2px;
          font-size: 18px;
        }
      }
      .index-flex > div:nth-of-type(1){
        top: 140px;
        font-size: 18px;
      }
      .index-flex > div:nth-of-type(3){
        height: calc(100% + 17px);
      }
      .all-health-div{
        height: 100%;
        
      }
    }
    .index-bottom-div{
      height: calc(100% - 270px);
      .index-bottom-right{
        .index-alert-info{
          height: calc(100% - 161px);
        }
      }
    }
  }
  @media (max-width: 992px) {
    .index-bottom-div{
      .index-bottom-left{
        width: calc(60% - 60px);
      }
      .index-bottom-right{
        width: calc(40% + 40px);
        .index-alert{
          font-size:12px;
        }
      }
    }
  }
</style>

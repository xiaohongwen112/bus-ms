<template>
  <div class="area-monitor">
    <NavBar :title="'monitor'" />
    <div class="monitor-div" :class="{'changeHeight':timeFlag}" id="appsSet">
      <div class="selected-app-con">
        <div v-show="businessFlag" class="app-list bus-selecting" @click="backOriginal">
          <div class="sele-app-title">业务</div>
          <div class="sele-app-name">
            <span @mouseover="showWhole($event, businessSelected)" @mouseout="showNameFlag=false">{{businessSelected}}</span>
          </div>
        </div>
        <div class="all-apps" v-show="!nodeFlag" :class="titleText=='业务'?'intf-selecting':'app-selecting'">所有{{titleText}}</div>
        <SelectedTrade v-if="nodeFlag" :items="selectedNode" :tradeName="tradeName" @back-node="backNode" @showTip="showTip" @showNumTip="showNumTip" @hideTip="showNameFlag=false"></SelectedTrade>
      </div>
      <div v-show="!tradeRealtive" class="select-tip">请选择{{titleText=='业务'?titleText:`${titleText}节点`}}</div>
      <Trade v-if="tradeFlag&&!tradeRealtive && tradeInfo instanceof Array" :items="tradeInfo" @on-trade="getTrade" :nodeSelected="nodeSelected" @showTip="showTip" @showNumTip="showNumTip" @hideTip="showNameFlag = false"></Trade>
      <div v-show="tradeRealtive" class="apps-list-con">
        <TradeRealtive :title="title[0]" :status="tradeType" :appName="appName" :intfName="intfName" :latest="latest" ref="tradeRealtive" @on-mapdata="dealMapData" @resetReleative="resetReleative" @showTip="showTip" @hideTip="showNameFlag = false"></TradeRealtive>
        <TradeRealtive :title="title[1]" :status="tradeChannel" :appName="appName" :intfName="intfName" :latest="latest" ref="tradeRealtiveas" @on-mapdata="dealMapData" @resetReleative="resetReleative" @showTip="showTip" @hideTip="showNameFlag = false"></TradeRealtive>
      </div>
    </div>
    <div class="monitor-div" :class="{'changeHeight':timeFlag}" id="mapDiv">
      <china-map :isDrill="true" :areaName="areaName" :data="mapData.ll_data" :mapDataChina="mapData.mapdata" :areaCode="areaCode"
      :isStorage="isStorage" :isApply="mapData.is_apply" @flowClick="flowClick"></china-map>
    </div>
    <div class="date-content" v-if="timeFlag">
      <time-axis-picker :data="timeLineData" :currentTime="currentTime" @timeChange="timeChange"></time-axis-picker>
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
  import { NavBar, ChinaMap } from '@/components/common';
  import { Trade, SelectedTrade, TradeRealtive } from '@/components/areaMonitor';
  import TimeAxisPicker from '@/components/common/TimeAxisPicker/index';
  import ShowNameBox from '@/components/manageApp/main/ShowNameBox';
  import { setLocalStorage } from '@/helpers/utils';
  import moment from 'moment';
  import * as api from '../service/index';

  export default {
    name: 'main',
    components: {
      NavBar,
      ChinaMap,
      Trade,
      SelectedTrade,
      TimeAxisPicker,
      TradeRealtive,
      ShowNameBox,
    },
    computed: {
      postData() {
        let data = {};
        if (this.appName !== '') {
          data = {
            ...data,
            app_name: this.appName,
          };
        }
        if (this.intfName !== '') {
          data = {
            ...data,
            intf_name: this.intfName,
          };
        }
        if (this.latest !== '') {
          data = {
            ...data,
            latest: this.latest,
          };
        }
        return data;
      },
    },
    data() {
      return {
        areaName: '全国',
        mapData: {
          is_apply: true,
        },
        titleText: '业务',
        tradeInfo: [],
        selectedNode: {},
        businessFlag: false,
        businessSelected: '',
        lastTimeBusiness: '',
        nodeFlag: false,
        nodeSelected: false,
        timeFlag: false,
        appName: '',
        intfName: '',
        tradeName: '',
        tradeRealtive: false,
        tradeFlag: true,
        title: ['交易类型', '交易渠道'],
        tradeType: false,
        tradeChannel: false,
        earliest: '',
        transType: '',
        subTransType: '',
        latest: '',
        dealRes: 'public',
        timeLineData: {},
        showNameFlag: false, // 提示框
        showTipsName: 'tishi111',
        tipsLeft: 10,
        tipsTop: 0,
        currentTime: '',
        areaCode: 100000,
        isStorage: true,
      };
    },
    created() {
      if (localStorage.getItem('areaCode') !== undefined && localStorage.getItem('drillPath') !== undefined && localStorage.getItem('drillPath') !== null && localStorage.getItem('drillPath') !== '[]') this.areaCode = parseInt(localStorage.getItem('areaCode'), 10);
      this.getInitData();
      this.getMapData();
    },
    methods: {
      async getSysTime() {
        try {
          const res = await api.getSysTime();
          if (res.data.code === 0) {
            const time = moment(res.data.data.systime).format('X') - 120;
            this.currentTime = moment.unix(time).format('YYYY-MM-DD HH:mm:ss');
          }
        } catch (e) {
          console.error(e);
        }
      },
      flowClick(e) {
        if (this.appName !== '' && this.intfName !== '') {
          const params = {
            ip_dst: e.data.d.ip,
            ip_src: e.data.s.ip,
            ts_start: this.mapData.ts[0],
            ts_end: this.mapData.ts[1],
          };
          if (this.transType !== '') params.trans_type = this.transType;
          if (this.subTransType !== '') params.sub_trans_type = this.subTransType;
          setLocalStorage('params', JSON.stringify(params));
          window.location.href = `/zh-cn/stat/${this.appName}/cap/${this.intfName}/#/BizTrack`;
        }
      },
      showWhole(e, name) {
        const ele = e.target.parentNode;
        this.showNameFlag = true;
        this.tipsLeft = ele.getBoundingClientRect().left;
        this.tipsTop = ele.getBoundingClientRect().top;
        this.showTipsName = name;
      },
      showTip(position) {
        this.showNameFlag = true;
        this.tipsLeft = position.left - 20;
        this.tipsTop = position.top - 30;
        this.showTipsName = position.tipName;
      },
      showNumTip(position) {
        this.showNameFlag = true;
        this.tipsLeft = position.left;
        this.tipsTop = position.top + 300;
        this.showTipsName = position.tipName;
      },
      async getInitData() {
        try {
          const res = await api.getInitData(this.postData);
          this.dealResponse(res);
        } catch (e) {
          console.log(e);
        }
      },
      dealResponse(res) {
        if (this.dealRes === 'public') {
          if (res.data.code === 0) {
            this.tradeInfo = res.data.data;
            if (!this.tradeRealtive) this.tradeFlag = true;
          }
        } else {
          if (res.data.code === 0) {
            const data = res.data.data;
            this.tradeType = data.trans_type;
            this.tradeChannel = data.sub_trans_type;
            this.selectedNode.app_succrate_day = data.succrate_day;
            this.selectedNode.transcount_current = data.transcount_current;
            this.selectedNode.transcount_day = data.transcount_day;
          }
        }
      },
      getTrade(x) {
        this.businessFlag = true;
        this.nodeSelected = true;
        this.lastTimeBusiness = this.businessSelected;
        this.businessSelected = x.disp_name;
        this.timeFlag = true;
        this.showNameFlag = false;
        if (x.name.indexOf('app') > -1) {
          this.tradeFlag = false;
          this.getAppTrade(x.name);
        } else {
          this.tradeFlag = false;
          this.nodeFlag = true;
          this.selectedNode = x;
          this.tradeRealtive = true;
          this.intfName = x.name;
          this.dealRes = 'trade';
          this.getInitData();
        }
        this.getTimeLineData();
        this.getMapData();
        this.$refs.tradeRealtive.backIntf();
        this.$refs.tradeRealtiveas.backIntf();
      },
      getAppTrade(appName) {
        this.titleText = '交易';
        this.appName = appName;
        this.dealRes = 'public';
        this.getInitData();
      },
      backOriginal() {
        this.$refs.tradeRealtive.backInit();
        this.$refs.tradeRealtiveas.backInit();
        this.titleText = '业务';
        this.tradeFlag = false;
        this.businessFlag = false;
        this.nodeSelected = false;
        this.timeFlag = false;
        this.nodeFlag = false;
        this.tradeRealtive = false;
        this.appName = '';
        this.intfName = '';
        this.transType = '';
        this.subTransType = '';
        this.dealRes = 'public';
        this.getInitData();
        this.getMapData();
      },
      backNode() {
        this.businessFlag = true;
        this.nodeFlag = false;

        this.timeFlag = true;
        this.tradeRealtive = false;
        this.showNameFlag = false;
        this.intfName = '';
        this.transType = '';
        this.subTransType = '';
        this.businessSelected = this.lastTimeBusiness;
        this.getTimeLineData();
        this.getAppTrade(this.appName);
        this.getMapData();
      },
      dealMapData(val) {
        if (val.title === '交易类型') {
          this.transType = val.type;
        } else {
          this.subTransType = val.type;
        }
        this.getMapData();
      },
      async getTimeLineData() {
        try {
          this.getSysTime();
          const res = await api.getTimeLineData(this.appName, this.earliest, this.intfName);
          if (res.data.code === 0) {
            this.timeLineData = res.data.data;
          }
        } catch (e) {
          console.log(e);
        }
      },
      async getMapData() {
        try {
          const res = await api.getMapData({
            app_name: this.appName,
            intf: this.intfName,
            earliest: isNaN(this.earliest) ? '' : this.earliest,
            trans_type: this.transType,
            sub_trans_type: this.subTransType,
          });
          if (res.data.code === 0) {
            this.mapData = res.data.data;
          }
        } catch (e) {
          console.log(e);
        }
      },
      timeChange(val) {
        this.earliest = val.ts;
        this.latest = val.ts;
        this.getTimeLineData();
        this.getInitData();
        this.$refs.tradeRealtive.resetComponent();
        this.$refs.tradeRealtiveas.resetComponent();
        this.resetReleative();
        this.getMapData();
      },
      updatedData() {
        if (this.appName !== '') this.getTimeLineData();
        this.getInitData();
        this.getMapData();
      },
      resetReleative(type) {
        if (type === 'trans_type') this.$refs.tradeRealtiveas.resizeSelf();
        else this.$refs.tradeRealtive.resizeSelf();
      },
    },
    mounted() {
      window.setInterval(this.updatedData, 60000);
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.area-monitor{
  #mapDiv{
    .map-container{
      .map-btn-group{
        top: 10px;
      }
    }
  }
  .date-content{
    .time-axis-div{
      .axis-div{
        width: calc(100% - 146px);
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.area-monitor{
  height:100%;
  .monitor-div{
    float: left;
    height: calc(100% - 70px);
    position: relative;
  }
  .changeHeight{
    height: calc(100% - 110px);
  }
  #appsSet {
    width: 290px;
    z-index: 4;
    .selected-app-con{
      display: block;
      width: auto;
      height: 125px;
      margin: 15px 10px 0 10px;
    }
    .apps-list-con{
      display: block;
      width: auto;
      margin: 10px;
      margin-top: 0;
      height: calc(100% - 220px);
      direction: rtl;
    }
    .all-apps,.app-list{
      width: 120px;
      height: 120px;
      background: #383e50;
      color: #F0EFEF;
      margin: 0px 5px 5px;
      cursor: pointer;
      direction: ltr;
    }
    .app-list{
      .sele-app-title {
        height: 25px;
        margin-left: 8px;
        margin-top: 5px;
      }
      .sele-app-name {
        height: 48px;
        text-align: center;
        width: 95%;
        font-size: 18px;
        color: #00D6D1;
        font-weight: bolder;
        display: inline-flex;
        vertical-align: middle;
        >span{
          display: block;
          width: 100%;
          height: 100%;
          font-size:18px;
          text-align: center;
          margin-top: 10px;
          padding: 2px 4px;
          word-wrap: break-word;
          word-break: break-all;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
    }
    .all-apps{
      font-size: 18px;
      text-align: center;
      line-height: 100px;
      font-weight: bolder;
    }
    .intf-selecting{
      background:url(../../../assets/areaMonitor/intf-selecting.png) no-repeat center;
      background-size:cover;
    }
    .app-selecting{
      background:url(../../../assets/areaMonitor/app-selecting.png) no-repeat center;
      background-size:cover;
      margin-left: 135px;
    }
    .bus-selecting{
      float:left;
      background:url(../../../assets/areaMonitor/intf-selected.png) no-repeat center;
      background-size:cover;
    }
    .select-tip {
      color: #9F9B93;
      direction: ltr;
      width: 86%;
      border-top: 1px dashed #3e4848;
      height: 30px;
      line-height: 30px;
      margin-left: 15px;
    }
  }
  #mapDiv{
    width: calc(100% - 290px);
    z-index: 3;
    .map-container{
      width: calc( 100% - 42px);
      height: 100%;
    }
  }
  .date-content{
    display: inline-block;
    width: 100%;
    height: 60px;
  }
}
</style>

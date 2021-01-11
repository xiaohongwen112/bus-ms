<template>
  <div class="alert-content">
    <NavBar :title="'alert'" />
    <Breadcrumb :title="'告警'" :crumbList="crumbList" />
    <div class="alert-select-container">
      <div class="alert-form-div">
        <DatePicker :value="timeVal" :options="dateOptions" @on-change="onTimeChange" @on-ok="onSearch" :editable="false" type="datetimerange" format="yyyy-MM-dd HH:mm" placeholder="请选择时间"></DatePicker>
        <CmSelect :list="alertSelect" :selectVal="alertSelected" @on-change="onAlertChange"></CmSelect>
        <CmSelect v-show="alertSelected === '基线告警'" :list="targetSelect1" :selectVal="targetSelected" @on-change="onTargetChange"></CmSelect>
        <CmSelect :list="statusList" :selectVal="statusSelected" @on-change="onStatusChange"></CmSelect>
        <Search v-model="value" @on-search="onSearch" placeholder=",表示且/表示或"></Search>
      </div>
      <div class="csv-btn-div">
        <CmSwitch :switchText="switchText" :switchStatus="$store.state.switchStatus" :statusOne="status1" :statusOther="status2" @on-change="onSwitchChange"></CmSwitch>
        <div class="export-btn" ref="export" :class="{'visis-disable':!VisitExport, 'export-disable': $store.state.alerts.length === 0}">导出CSV</div>
      </div>
    </div>
    <div class="card-content">
      <div class="card-container" id="cardContainer">
        <Alert v-for="(x,i) in $store.state.alerts" :key="i" :alerts="$store.state.alerts[i]" @on-map="openMap"></Alert>
      </div>
    </div>
    <ServicePathMap v-if="showMap" :showMap="showMap" :item="params" :params="params" @on-closemap="showMap=false"></ServicePathMap>
    <Pagination v-show="$store.state.alerts.length!==0" :total="Math.ceil($store.state.total/this.pageSize)" :current="current" @to-page="goTo"></Pagination>
    <div class="load-container" v-show="$store.state.loading">
      <div class="load-inner">
        <Loading></Loading>
      </div>
    </div>
    <form ref="exportForm" action="/zh-cn/alert/export/" target="_blank" method="GET" style="display:none;">
      <input type="hidden" name="start_time" :value="queryParam.start_time">
      <input type="hidden" name="end_time" :value="queryParam.end_time">
      <input type="hidden" name="withTags" :value="queryParam.withTags">
      <input type="hidden" name="tags" :value="queryParam.tags">
      <input v-if="queryParam.app_name && queryParam.app_name!==''" type="hidden" name="app_name" :value="queryParam.app_name">
      <input v-if="queryParam.intf_name && queryParam.intf_name!==''" type="hidden" name="intf_name" :value="queryParam.intf_name">
    </form>
    <CmTip v-show="tipShow" :tipTitle="$store.state.tipTitle" :tipContent="$store.state.tipContent" :closeFn="() => $store.state.tipShow = false"></CmTip>
    <img v-show="$store.state.loading===false&&$store.state.alerts.length===0" class="nodata-img" src="../../../assets/common/noDataImg.svg">
  </div>
</template>

<script>
import * as d3 from 'd3';
import { NavBar, Breadcrumb, CmSelect, Search, CmSwitch, Pagination, CmAlert, Loading, CmTip } from '@/components/common';
import { DatePicker } from 'iview';
import { mapState } from 'vuex';
import '@/assets/css/date-picker.scss';
import { Alert, ServicePathMap } from '@/components/alert';
import moment from 'moment';
import Bus from '@/helpers/bus';

export default {
  components: { NavBar, Breadcrumb, Alert, DatePicker, CmSelect, Search, CmSwitch, Pagination, CmAlert, Loading, CmTip, ServicePathMap },
  data() {
    const _this = this;
    return {
      VisitExport: true,
      crumbList: ['index', 'alert'],
      alertSelect: ['所有告警', '基线告警', '系统告警', '返回码告警', '健康度告警'],
      targetSelect1: ['所有指标', '交易量', '成功率', '响应时间', '响应率'],
      alertSelected: '所有告警',
      targetSelected: '所有指标',
      statusSelected: '所有状态',
      tagsList: [],
      statusList: [],
      value: '',
      timeVal: [],
      switchText: '全屏告警',
      status1: '开',
      status2: '关',
      total: 12,
      current: 1,
      pageSize: 0,
      queryParam: {},
      exportLink: '#',
      showMap: false,
      params: {},
      // loading: this.$store.state.loading,
      appName: '',
      intfName: '',
      haveSearch: false,
      isFirst: true,
      dateOptions: {
        disabledDate(date) {
          return Date.parse(date) / 1000 > _this.session$.ts;
        },
      },
    };
  },
  computed: {
    ...mapState({
      tipShow: state => state.tipShow,
      // statusSelect: state => state.targetArr,
      // switchStatus: state => state.switchStatus,
    }),
    postQueryData() {
      return {
        pageNo: this.current,
        pageSize: this.pageSize,
      };
    },
  },
  methods: {
    getList() {
      const val = this.alertSelected;
      const alertStatus = localStorage.getItem('alert_status');
      if (val === '返回码告警') {
        this.statusList = ['一次性'];
        this.statusSelected = '一次性';
      } else if (val === '所有告警') {
        this.statusList = ['所有状态', '已恢复', '持续中', '一次性'];
        if (this.haveSearch) {
          this.statusSelected = '持续中';
          this.haveSearch = false;
        } else {
          this.statusSelected = '所有状态';
        }
      } else {
        this.statusList = ['所有状态', '已恢复', '持续中'];
        if (alertStatus) {
          this.statusSelected = alertStatus;
          window.localStorage.removeItem('alert_status');
        } else {
          this.statusSelected = '所有状态';
        }
      }
    },
    layout() {
      const cardContainer = d3.select('#cardContainer')._groups[0][0];
      const containerWidth = cardContainer.clientWidth;
      const containerHeight = cardContainer.clientHeight;
      const cardWidth = 436;
      const cardHeight = 160;
      const col = Math.floor(containerWidth / cardWidth);
      const row = Math.floor(containerHeight / cardHeight);
      cardContainer.style.paddingLeft = `${(containerWidth - col * cardWidth) / 2}px`;
      cardContainer.style.paddingTop = `${(containerHeight - row * cardHeight) / 2}px`;
      const pageSize = col * row;
      this.pageSize = pageSize;
    },
    resize() {
      window.onresize = () => {
        this.layout();
        this.current = 1;
        this.$store.state.loading = true;
        this.$store.state.alerts = [];
        this.$nextTick(() => {
          this.$store.dispatch('fetchQuery', this.postQueryData);
        });
      };
    },
    getTimeVal() {
      const tsStart = (this.appName !== '' || this.intfName !== '' || this.alertSelected !== '所有告警') ? moment.unix(this.$store.state.timeEnd - 60).format('YYYY-MM-DD HH:mm:ss') : moment.unix(this.$store.state.timeStart).format('YYYY-MM-DD HH:mm:ss');
      const tsEnd = moment.unix(this.$store.state.timeEnd).format('YYYY-MM-DD HH:mm:ss');
      this.timeVal = [tsStart, tsEnd];
    },
    onSearch() {
      this.isFirst = false;
      this.showMap = false;
      this.current = 1;
      this.tagsList = [];
      this.fetchQueryParams();
      this.fetchQuery();
    },
    fetchQueryParams() {
      const appName = this.$store.state.appDispName;
      const intfName = this.$store.state.intfDispName;
      if (this.value !== '') {
        let finalVal = this.value;
        let otherStr = '';
        let finalStr = '';
        let intfIndex = '';
        if (intfName !== '' && finalVal.includes(intfName)) {
          intfIndex = finalVal.indexOf(intfName);
          if (intfIndex === 0) intfIndex = finalVal.indexOf(intfName, 1);
        }
        if (appName !== '' && finalVal.includes(appName)) {
          const appIndex = finalVal.indexOf(appName);
          if (appIndex !== 0) {
            finalStr = finalVal.substr(0, appIndex);
            otherStr = finalVal.slice(appIndex);
            finalVal = otherStr.slice(appName.split('').length + 1);
          } else {
            // otherStr = finalVal.substr(0, appName.split('').length + 1);
            if (intfIndex === '') {
              finalVal = finalVal.substr(appName.split('').length + 1);
            } else {
              finalVal = finalVal.slice(appName.split('').length + 1, intfIndex);
              finalVal = finalVal.substr(0, finalVal.length - 1);
            }
          }
          if (intfName !== '' && finalVal.includes(intfName)) {
            finalVal = finalVal.slice(intfName.split('').length + 1);
          }
        } else {
          if (intfName !== '' && finalVal.includes(intfName)) finalVal = finalVal.slice(0, intfIndex);
        }
        finalVal = finalVal.replace(',', '，');
        this.tagsList = finalVal.split('，');
        this.tagsList.push(finalStr);
        if (this.appName !== '' && finalVal.includes(appName)) this.tagsList.push(this.appName);
        if (this.intfName !== '' && finalVal.includes(intfName)) this.tagsList.push(this.intfName);
        for (let i = 0; i < this.tagsList.length; i += 1) {
          if (this.tagsList[i] === '') {
            this.tagsList.splice(i, 1);
            i = i - 1; // eslint-disable-line
          }
        }
      }
      if (this.alertSelected !== '所有告警') this.tagsList.push(this.alertSelected);
      if (this.targetSelected !== '所有指标' && this.alertSelected === '基线告警') this.tagsList.push(this.targetSelected);
      if (this.alertSelected !== '返回码告警' && this.statusSelected !== '所有状态') this.tagsList.push(this.statusSelected);
      const timeStart = this.timeVal[0] === '' ? null : moment(this.timeVal[0]).format('X');
      const timeEnd = this.timeVal[1] === '' ? null : moment(this.timeVal[1]).format('X');
      const postData = {
        start_time: timeStart,
        end_time: timeEnd,
        tags: this.tagsList.length !== 0 ? JSON.stringify(this.tagsList) : JSON.stringify([]),
        withTags: true,
      };
      if (this.appName !== '') postData.app_name = this.appName;
      if (this.intfName !== '') postData.intf_name = this.intfName;
      this.queryParam = postData;
    },
    getCenter() {
      this.$store.dispatch('getCenter').then(() => {
        this.$nextTick(() => {
          this.getTimeVal();
          this.fetchQueryParams();
          this.fetchQuery();
        });
      });
    },
    fetchQuery() {
      if (!this.queryParam.start_time || !this.queryParam.end_time) {
        window.location.reload(true);
      } else {
        this.$store.dispatch('postQuery', this.queryParam).then(() => {
          this.$nextTick(() => {
            this.$store.state.loading = true;
            this.$store.state.alerts = [];
            this.$store.dispatch('fetchQuery', this.postQueryData);
            if (this.isFirst) this.value = this.$store.state.intfDispName !== '' ? `${this.$store.state.appDispName},${this.$store.state.intfDispName}` : this.$store.state.appDispName;
          });
        });
      }
    },
    onAlertChange(val) {
      this.alertSelected = val;
      this.getList();
    },
    onTargetChange(val) {
      this.targetSelected = val;
    },
    onStatusChange(val) {
      this.statusSelected = val;
    },
    onSwitchChange(val) {
      this.$store.state.switchStatus = val;
      Bus.$emit('onSwitchChange', val);
    },
    openMap(val) {
      if (this.showMap === true) this.showMap = false;
      this.$nextTick(() => {
        this.showMap = true;
        this.params = val;
      });
    },
    goTo(page) {
      this.current = page;
      this.$store.state.loading = true;
      this.$store.state.alerts = [];
      this.$store.dispatch('fetchQuery', this.postQueryData);
    },
    onTimeChange(val) {
      this.timeVal = val;
    },
    GetUrlParam(paraName) {
      const url = document.location.toString();
      const arrObj = url.split('?');
      if (arrObj.length > 1) {
        const arrPara = arrObj[1].split('&');
        let arr;
        for (let i = 0; i < arrPara.length; i += 1) {
          arr = arrPara[i].split('=');
          if (arr !== null && arr[0] === paraName) {
            return arr[1];
          }
        }
        return '';
      }
      return '';
    },
  },
  created() {
    const alertType = localStorage.getItem('alert_type');
    const appName = localStorage.getItem('app_name');
    if (alertType) {
      this.alertSelected = alertType;
      this.appName = appName;
      window.localStorage.removeItem('alert_type');
      window.localStorage.removeItem('app_name');
    }
    const topov = this.GetUrlParam('topov');
    const intf = this.GetUrlParam('intf');
    if (topov !== '') {
      this.crumbList = ['index', 'alert'];
      this.appName = topov.includes('#') ? topov.split('#')[0] : topov;
      if (intf !== '') {
        this.intfName = intf.includes('#') ? intf.split('#')[0] : intf;
        this.crumbList.splice(1, 0, 'indexcustomview');
      } else {
        this.crumbList.splice(1, 0, 'manageapp');
      }
      this.haveSearch = true;
    }
    this.getList();
    this.$store.dispatch('getData');
    this.getCenter();
  },
  mounted() {
    this.VisitExport = this.session$.newpermissions.alert_export;
    this.layout();
    this.resize();
    this.$refs.export.addEventListener('click', () => {
      if (this.$store.state.alerts.length !== 0 && this.VisitExport) {
        this.$refs.exportForm.submit();
      }
    });
  },
};
</script>

<style lang="scss">
html{
  height:100%;
  .alert-form-div{
    .cm-select{
       .input-container{
          .icon-bms-tridown{
            font-size: 12px;
            color: #0cdad4;
            top: 11px;
            right: 5px;
          }
       }
    }
  }
}
@media (max-width: 1040px){
  .alert-content{
    .alert-select-container{
      .alert-form-div{
        .cm-search{
          input {
            width:100% !important;
          }
        }
      }
    }
  }
}
@media (max-width: 1624px){
  .alert-content{
    .alert-select-container{
      .alert-form-div{
        .cm-search{
          input {
            width:155px;
            // width:200px;
          }
        }
      }
    }
  }
}
.alert-content{
  .switch{
    .bms-switch{
      .bms-switch-inner{
        top: 1px !important;
        font-size: 12px !important;
      }
      &:after{
        top: 0px !important;
      }
    }
    .bms-switch-checked{
      &:after{
        left:38px !important;
      }
    }
  }
  .alert-form-div{
    .cm-search{
      input {
        width: 245px;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.alert-content{
  height:100%;
  .alert-select-container{
    width:100%;
    box-sizing: border-box;
    height: 46px;
    padding: 0 44px;
    border-bottom: solid 1px #234148;
    display: inline-block;
    >div{
      display:inline-block;
    }
    .alert-form-div{
      white-space: nowrap;
      .cm-select{
        vertical-align: bottom;
      }
      .cm-search{
        vertical-align: middle;
        margin-right:20px;
      }
    }
    .switch{
      margin-right:20px;
    }
    .switch-text{
      display:inline-block;
      font-size: 17px;
      color: #C6D0E2;
      margin-right: 10px;
    }
    .bms-switch {
      display: inline-block;
      width: 62px;
      height: 25px;
      line-height: 22px;
      border-radius: 25px;
      vertical-align: middle;
      border: 1px solid #10EDE6;
      position: relative;
      cursor: pointer;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      transition: all .2s ease-in-out;
      &:focus{
        box-shadow: 0 0 0 2px rgba(45,140,240,.2);
        outline: 0;
      }
      &:hover{
        box-shadow: none;
      }
      .bms-switch-inner{
        color: #8F8F8F;
        font-size: 12px;
        position: absolute;
        left: 36px;
        top: 2px;
      }
      &:active:after {
        width: 26px;
      }
      &:after {
        content: "";
        width: 23px;
        height: 23px;
        border-radius: 50%;
        background-color: #8F8F8F;
        position: absolute;
        left: 1px;
        top: 1px;
        cursor: pointer;
        transition: left .2s ease-in-out,width .2s ease-in-out;
      }
    }
    .bms-switch-checked {
      .bms-switch-inner{
        left: 14px;
        color:#C2D1D6;
      }
      &:after {
        left: 38px;
        background-color:#10ede6;
      }
    }
    .csv-btn-div{
      float: right;
      >div{
        display: inline-block;
      }
      .export-btn{
        display: inline-block;
        text-align: center;
        background: #32d6c8;
        border-radius: 15px;
        color: #07202E;
        border: none;
        padding: 0 15px;
        font-size: 16px;
        height: 26px;
        line-height: 26px;
        cursor:pointer;
        vertical-align: middle;
        &.export-disable{
          background:#8F8F8F;
          cursor:default;
        }
        &.visis-disable{
          background:#8F8F8F;
          cursor:default;
        }
      }
    }
  }
  .card-content{
    border: none;
    position: absolute;
    top: 133px;
    bottom: 46px;
    left: 0;
    right: 0;
    overflow: hidden;
    .card-container{
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      overflow: hidden;
      margin-bottom: 10px;
    }
  }
  .load-container{
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    .load-inner{
      position: relative;
      width: 100%;
      height: 100%;
    }
  }
  @keyframes warn-animate{
    0%, 100% {
      opacity: 0.3;
    }
    50% {
      opacity: 1;
    }
  }
  @media (max-width: 1540px){
    .alert-select-container {
      .csv-btn-div {
        margin-right: 0px;
      }
      .cm-select{
        width:120px;
        margin: 0 5px;
      }
    }
  }
  // @media (max-width: 1370px){
  @media (max-width: 1124px){
    .alert-select-container{
        padding: 0 5px;
      .ivu-date-picker {
        width:200px;
      }
      .cm-select{
        width:100px;
      }
      .cm-search{
        width:155px;
        margin-right: 0;
      }
      .csv-btn-div {
        margin-right: 0;
      }
    }
  }
  @media (max-width: 1040px){
    .alert-select-container{
      padding: 0;
      .ivu-date-picker {
        width:25%;
      }
      .alert-form-div{
        width:63%;
        .cm-select {
          width:18%;
          margin: 0;
        }
        // .cm-search{
        //   width: 15%;
        //   margin-right:0;
        // }
      }
      .csv-btn-div{
        width:37%;
        .switch{
          margin-right:5px;
        }
        .alert-recovery-btn{
          margin-left:5px;
        }
      }
    }
  }
  .nodata-img{
    display: block;
    text-align: center;
    position: fixed;
    left: 50%;
    top: 50%;
    margin-left: -100px;
    margin-top: -100px;
  }
}
</style>
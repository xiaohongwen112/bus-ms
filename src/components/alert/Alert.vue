<template>
  <div class="each-alert" :class="alerts.status ==='relieve' ? 'recover-alert':''">
    <div class="alert-top">
      <div class="top-left">
        <div class="alert-title">
          <span class="alert-type">{{alerts.type}}</span>
          <span class="icon-container">
            <label class="alert-path" v-show="['基线告警', '健康度告警'].includes(alerts.type) && !traceFlag" title="可视化服务图" @click="toTopo()">
              <div class="alert-path-disable" v-if="VisitAlertPath"></div>
            </label>
            <label class="alert-trace" v-show="traceFlag" title="根源分析" @click="showMap()"></label>
            <label class="alert-analysis" title="追踪详情" @click="dealMethod()">
              <div class="alert-analysis-disable" v-if="VisitAnalysis"></div>
            </label>
          </span>
        </div>
        <div class="alert-container">
          <div class="alert-level" v-show="alerts.level" :class="`alert-level${alerts.level}`">{{alertLevelIndex[alerts.level]}}</div>
          <div class="alert-info">
            <div class="alert-source" v-tooltip.ellipsis="{title: alertSourceChange(), placement: 'top', trigger: ['blur']}">{{alertSourceChange()}}</div>
            <div class="alert-event">{{alerts.event.toString()}}</div>
          </div>
        </div>
      </div>
      <div class="top-right">
        <table class="alert-table">
          <tr class="each-con" v-for="item in settings" :key="item.key">
            <td :class="item.key===''||item.key==='—'?'no-data':''" v-tooltip.ellipsis="{title: item.key, placement: 'top', trigger: ['blur']}">{{item.key===''?'—':item.key}}</td>
            <td :class="item.key==='最新'?'high-light':''"><span :class="item.val===''||item.val==='—'?'no-data':''">{{item.val===''?'—':item.val}}</span></td>
          </tr>
        </table>
      </div>
    </div>
    <div class="alert-bottom">
      <span class="time-info">从<label>{{startTime}}</label>开始，持续<label>{{new Date(alerts.duration)/60}}</label>min</span>
      <span class="alert-status">{{alerts.status ==='last'?'持续中':alerts.status ==='once'?'一次性':'已恢复' }}</span>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { setLocalStorage } from '@/helpers/utils';
import tooltip from '@/directive/tooltip';

export default {
  props: { alerts: Object },
  computed: {
    startTime() {
      return moment.unix(this.alerts.ts_start).format('YYYY-MM-DD HH:mm:ss');
    },
    traceFlag() {
      return this.alerts.event.toString().indexOf('响应时间') > -1;
    },
  },
  directives: {
    tooltip,
  },
  data() {
    return {
      VisitAlertPath: true,
      VisitAnalysis: true,
      traceLink: '#',
      alertPath: false,
      app: '',
      intf: '',
      alertLevelIndex: {
        1: '警告',
        2: '严重',
        3: '危急',
        4: '致命',
      },
      settings: [],
    };
  },
  methods: {
    dealMethod() {
      if (this.alerts.type === '系统告警') {
        setLocalStorage('event', this.alerts.event);
        window.location.href = '/zh-cn/accounts/accountindex/#/status/cpu';
      } else if (this.alerts.type === '健康度告警' || (this.alerts.event.toString().indexOf('交易量') > -1)) {
        const startTime = this.GetUrlParam('ts_start');
        const endTime = this.GetUrlParam('ts_end');
        const params = {
          ts_start: startTime,
          ts_end: endTime,
        };
        setLocalStorage('params', JSON.stringify(params));
        window.location.href = `${this.traceLink}#/BizChart`;
      } else {
        this.toBusinessTrack();
      }
    },
    GetUrlParam(paraName) {
      const arrObj = this.alerts.drilldown.split('?');
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
    toBusinessTrack() {
      const startTime = this.GetUrlParam('ts_start');
      const endTime = this.GetUrlParam('ts_end');
      const params = {
        ts_start: startTime,
        ts_end: endTime,
      };
      if (this.alerts.type === '返回码告警') params.ret_code = this.GetUrlParam('ret_code');
      if (this.traceFlag) params.duration = [this.GetUrlParam('rr_duration'), ''];
      if (this.alerts.event.toString().indexOf('响应率') > -1) params.resp_count = true;
      if (this.alerts.event.toString().indexOf('成功率') > -1) params.succ_count = '失败';
      setLocalStorage('params', JSON.stringify(params));
      window.location.href = `${this.traceLink}#/BizTrack`;
    },
    toTopo() {
      const statUrl = this.alerts.drilldown;
      const params = {
        ts_start: this.alerts.ts_start,
      };
      setLocalStorage('params', JSON.stringify(params));
      window.location.href = `/zh-cn/overview/${statUrl.match(/app\d+/)}/`;
    },
    getTrace() {
      if ((typeof this.alerts.peak === 'object') && (this.alerts.peak !== null)) {
        this.traceLink = this.alerts.drilldown;
      } else {
        const statUrl = this.alerts.drilldown;
        this.traceLink = `/zh-cn/stat/${statUrl.match(/app\d+/)}/cap/${statUrl.match(/intf\d+/)}/`;
      }
    },
    getPath() {
      const app = String(this.alerts.tags).match(/app\d+/);
      const intf = String(this.alerts.tags).match(/intf\d+/);
      if (app) this.app = app[0];
      if (intf) this.intf = intf[0];
    },
    showMap() {
      const params = {
        app: this.app,
        intf: this.intf,
        time: this.alerts.ts_start,
        duration: [this.GetUrlParam('rr_duration'), ''],
        alarmNode: this.alertSourceChange().split('：')[1],
        alarmEvent: this.alerts.event.toString(),
      };
      this.$emit('on-map', params);
    },
    alertSourceChange() {
      let source = '';
      if (this.alerts.source.length !== 0) {
        for (let i = 0; i < this.alerts.source.length; i += 1) {
          source += i === (this.alerts.source.length - 1) ? this.alerts.source[i].value : `${this.alerts.source[i].value}：`;
        }
      }
      return source;
    },
    getSettings() {
      const data = this.alerts;
      if (data.type === '系统告警') {
        let peakJson = [
          { key: '剩余磁盘', val: '—' },
          { key: '内存', val: '—' },
          { key: '业务流数据', val: '—' },
          { key: 'CPU', val: '—' },
        ];
        if (data.peak !== null) {
          let contentMemory = '—';
          let contentDisk = '—';
          let contentCPU = '—';
          let contentPack = '—';
          const peakArr = Object.keys(data.peak);
          peakArr.forEach((el) => {
            const thisData = Number(data.peak[el]);
            if (el === '内存') {
              contentMemory = this.formatMemoryUnit(thisData * Math.pow(1024, 2));
            } else if (el === '剩余磁盘') {
              contentDisk = this.formatMemoryUnit(thisData);
            } else if (el === 'CPU') {
              contentCPU = `${thisData.toFixed(2) * 100 / 100}%`;
            }
            if ((el === 'pack数据包')) {
              contentPack = this.formatMemoryUnit(data.peak[el]);
            }
          });
          peakJson = [
            { key: '剩余磁盘', val: contentDisk },
            { key: '内存', val: contentMemory },
            { key: '业务流数据', val: contentPack },
            { key: 'CPU', val: contentCPU },
          ];
        }
        this.settings = peakJson;
      } else {
        this.settings = [
          { key: '阈值', val: data.thresholds.value != null ? data.thresholds.value : '—' },
          { key: '最新', val: data.value != null ? data.value : '—' },
          { key: '峰值', val: data.peak != null ? data.peak : '—' },
          { key: '—', val: '—' },
        ];
      }
    },
    formatMemoryUnit(data, isJson) {
      const formatter = {
        value: data,
        unit: 'B',
      };
      if (data >= Math.pow(1024, 4)) {
        formatter.value = data / Math.pow(1024, 4);
        formatter.unit = 'TB';
      } else if (data >= Math.pow(1024, 3)) {
        formatter.value = data / Math.pow(1024, 3);
        formatter.unit = 'GB';
      } else if (data >= Math.pow(1024, 2)) {
        formatter.value = data / Math.pow(1024, 2);
        formatter.unit = 'MB';
      } else if (data >= 1024) {
        formatter.value = data / 1024;
        formatter.unit = 'KB';
      }
      formatter.value = formatter.value.toFixed(2) * 100 / 100;
      if (isJson) {
        return formatter;
      }
      return formatter.value + formatter.unit;
    },
  },
  mounted() {
    this.VisitAlertPath = this.session$.newpermissions.topov_detail;
    this.VisitAnalysis = this.session$.newpermissions.trade_overview_detail;
  },
  created() {
    this.getSettings();
    this.getTrace();
    this.getPath();
  },
};
</script>

<style>
  .tooltip{
    font-size:12px;
    padding: 3px;
  }
</style>
<style lang="scss" scpoed>
  .each-alert {
    display: inline-block;
    margin: 8px 21px;
    width: 392px;
    height: 142px;
    border: 1px solid #476d83;
    .alert-top{
      width: 100%;
      height: 109px;
      border-bottom: 1px solid #28485e;
      .top-left{
        width: 290px;
        height: 100%;
        border-right: 1px solid #1f5d89;
        background: #17425e;
        float: left;
        .alert-title {
          border-bottom: 1px solid #0a1a24;
          height: 33px;
          padding: 0 5px;
          line-height: 33px;
          .alert-type {
            display: inline-block;
            width: 80px;
            height: 24px;
            line-height: 22px;
            box-sizing: border-box;
            color: #eee;
            text-align: center;
            border: 1px solid #32d6c8;
            border-radius: 2px;
            -moz-box-shadow: 0 0 3px #32d6c8 inset;
            -webkit-box-shadow: 0 0 3px #32d6c8 inset;
            box-shadow: 0 0 3px #32d6c8 inset;
          }
          .icon-container{
            display:inline-block;
            float:right;
            height:100%;
            >label{
              display: inline-block;
              cursor: pointer;
              width: 22px;
              height: 22px;
              background-size: 100% 100%;
              margin: 0 2px;
              vertical-align:middle;
              margin-bottom:2px;
            }
            .alert-trace{
              background: url(../../assets/alert/location.png) no-repeat;
              &:hover{
                background: url(../../assets/alert/locationHover.png) no-repeat;
              }
            }
            .alert-path{
              background: url(../../assets/alert/showTopo.png) no-repeat;
              &:hover{
                background: url(../../assets/alert/showTopoHover.png) no-repeat;
              }
            }
            .alert-analysis{
              background: url(../../assets/alert/trace.png) no-repeat;
              &:hover{
                background: url(../../assets/alert/traceHover.png) no-repeat;
              }
            }
          }
        }
        .alert-container{
          border-top: 1px solid #1e5c88;
          height: 74px;
          font-size:0;
          .alert-level{
            display:inline-block;
            width: 20px;
            height: 75px;
            box-sizing:border-box;
            float: left;
            font-size: 12px;
            padding-top: 11px;
            margin-top: 9px;
          }
          .alert-level1{
            background:url(../../assets/alert/alertLevel1.png) no-repeat;
          }
          .alert-level2{
            background:url(../../assets/alert/alertLevel2.png) no-repeat;
          }
          .alert-level3{
            background:url(../../assets/alert/alertLevel3.png) no-repeat;
          }
          .alert-level4{
            background:url(../../assets/alert/alertLevel4.png) no-repeat;
          }
          .alert-level-gray{
            background:url(../../assets/alert/alertLevelGray.png) no-repeat;
          }
          .alert-info{
            float:right;
            width:calc(100% - 20px);
            height:74px;
            padding-left:14px;
            box-sizing:border-box;
            .alert-source{
              height: 34px;
              line-height: 34px;
              font-size: 18px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .alert-event{
              height: calc(100% - 34px);
              line-height: 20px;
              color: #a0d1ed;
              font-size:14px;
              display: -webkit-inline-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              word-break: break-all;
              overflow: hidden;
            }
          }
        }
      }
      .top-right{
        width: 100px;
        height: 100%;
        background: #102e41;
        border-left: #122c3e;
        float: right;
        overflow: hidden;
        .alert-table{
          width: 100%;
          height: 100%;
          border-spacing: 0;
          font-size: 12px;
          .each-con{
            height: 25px;
            line-height: 25px;
            &:first-child td{
              border-top:0;
            }
            &:last-child td{
              border-bottom:0;
            }
            td{
              padding-left: 2px;
              font-weight: 100;
              max-width: 51px;
              color: #a8d8f7;
              border-top: 1px solid #28485e;
              border-bottom: 1px solid #0a1a24;
              text-align:center;
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
              &:last-child{
                color:#fff;
              }
            }
            .high-light{
              color:#d75353 !important;
            }
            .no-data{
              color: #365364!important;
            }
          }
        }
      }
    }
    .alert-bottom{
      height: 31px;
      line-height: 31px;
      border-top: 1px solid #0a1a24;
      background: #102e41;
      padding: 0 5px;
      color: #a8d8f7;
      .time-info{
        float:left;
        >label{
        display: inline-block;
        color: #d2d7d8;
        margin: 0 5px;
        }
      }
      .alert-status{
        float:right;
        display: inline-block;
        height: 24px;
        line-height: 24px;
        margin-right: 10px;
        background: #18435f;
        color: #d0deda;
        border-radius: 15px;
        padding: 0 10px;
        margin-top:3px;
      }
    }
  }
  .recover-alert{
    border: 1px solid #264051;
    div,span,td{
      color: #4f6c7d!important;
    }
    .alert-top{
      .top-left{
        background: #0d2230;
        border-right: 1px solid #264051;
        .alert-title{
          border-bottom: 1px solid #051118;
          .alert-type{
            background: #091824;
            border:none;
            box-shadow:none;
          }
        }
        .alert-container{
          border-top: 1px solid #264051;
          .alert-level{
            background:url(../../assets/alert/alertLevelGray.png) no-repeat;
          }
        }
      }
      .top-right{
        background: #081822;
      }
    }
    .alert-bottom{
      background: #081822;
      color: #4f6c7d;
      .time-info{
        >label{
          color: #86aeca;
        }
      }
      .alert-status{
        background: #0c212f;
      }
    }
  }
</style>
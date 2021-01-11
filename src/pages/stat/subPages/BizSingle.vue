<template>
  <div class="main">
    <h6 class="title" v-show="false">单笔详情</h6>
    <div class="top-div">
      <div class="top-left">
        <span class="title">{{ keywordTitle }}</span>
        <input class="cb-input" type="text" 
          ref="keyword" v-model="keywordId"
          @change="changeKeyword"/>
        <DatePicker style="margin-left:10px" type="datetimerange"
          format="yyyy-MM-dd HH:mm"
          :editable="false"
          :value="[strStart, strEnd]"
          @on-change="changeDate"></DatePicker>
        <CmBtn @click="submitSearch(true)">{{ isRun ? '搜索中...' : '搜索' }}</CmBtn>
      </div>
      <div class="top-right">
        <span class="record-text">匹配记录</span>
        {{ data1.length }}
        <span class="record-text">条</span>
        &nbsp;
        <CmBtn :disabled="!session$.newpermissions.trade_statistics_export || data1.length === 0" @click="exportCSV">导出CSV</CmBtn>
      </div>
    </div>
    <div class="trade-type-div">
      <a class="" v-for="(item, index) in tradeTypeList"
         :key="index"
         :class="{active: item.key === currentType}"
         @click="handleChangeType(item.key)">
         {{ item.name }}
      </a>
    </div>
    <div class="trade-div">
      <StTable class="single-table" :cols="cols1" :rows="data1"
        :activeRow="activeRow" @click-tr="clickRow" v-if="tableShow"></StTable>
    </div>
    <div class="modal" v-if="showAlaysis && !isRun">
      <div class="svg-div" ref="container" :style="`width: ${width}px`">
        <!-- <ScrollBar class="flow-nodes-scroll"> -->
          <TransAlaysis :data="alaysisData"/>
        <!-- </ScrollBar> -->
        <img class="close-btn" src="../../../assets/stat/close.svg"
              @click="handleClose"/>
      </div>
      <div class="origin-title">
        <span>原始交易数据</span>
        <img class="toggle-btn"
          :src="require(`../../../assets/topo-icon/${showOrigin ? 'up' : 'down'}.svg`)"
          @click="handleToggle"/>
      </div>
      <div class="origin-text" v-show="showOrigin">
        <ScrollBar class="origin-text-scroll">
          请求：{{ JSON.stringify(responseText) }}
          <br/>
          响应：{{ JSON.stringify(requestText) }}
        </ScrollBar>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';

import { mapState } from 'vuex';
// import { DatePicker } from 'iview';
import DatePicker from '@/components/common/DatePickerRange';
import CmBtn from '@/components/common/CmBtn';
import StTable from '@/components/stat/StTable';
import ScrollBar from '@/components/common/ScrollBar';
import TransAlaysis from '@/components/stat/TransAlaysis';
import { checkError } from '@/helpers/configValidate';
import { singleInit, getSingleId, getTrackState, getSingleTable,
  deleteTrack, cancelTrack, getCorrelation, exportSingle, cancelCorrelation } from '../service';
import { formatSingleTable, formatCorrelateData } from '../utils';
import { ts2str, str2ts } from '../../../helpers/utils';

export default {
  name: 'BizSingle',
  components: {
    CmBtn,
    DatePicker,
    StTable,
    ScrollBar,
    TransAlaysis,
  },
  props: {
  },
  data() {
    return {
      tableShow: true, // 用于强制重绘
      keywordTitle: '',
      keywordId: '',
      strStart: '',
      strEnd: '',
      tradeTypeList: [{ name: '当前交易', key: 'single' }, { name: '关联交易', key: 'correlation' }],
      currentType: 'single',
      jobId: null,
      timer: null,
      isRun: false, // 搜索状态, true表示所搜中
      count: 0, // 匹配条数
      cols1: [],
      data1: [],
      activeRow: null,
      showAlaysis: false,
      showOrigin: false,
      ganttData: null,
      alaysisData: {},
      // alaysisActive: 0,
      responseText: { status: null, app_name: 'app18', MetaType: 1, UrlPath: 'http://10.10.51.129:9081/sunscan/aps/getversion.action', Prot: 'http', PktLen: 304, DecodeId: 1510443234, commversion: '1.0033', FlowId: '795741901202011009:-222607699584483327:0', PktId: 19526, StreamId: 1, SrcIp: '11.11.11.11', FlowSide: 0, DestPort: 9082, HttpVerb: 'GET', UriPath: '/sunscan/aps/getversion.action', TcpPldLen: 250, ret_code: null, tradecode: 'JKDS', UriQuery: 'appid=Y002&tradecode=JKDS&commversion=1.0033&appversion=1.0003&cfgversion=0&username=admin&pwd=dXdwe2N0Zg==', SrcPort: 64745, ts: 1525839000.031689, RRA: 'req', 'User-Agent': 'agent', Host: '10.10.51.129:9081', Cookie: 'JSESSIONID=0000Hgl5QodGqojTtcpEoCLDUmT:-1', IpProt: 6, TcpAck: 1067234018, username: 'admin', Url: 'http://10.10.51.129:9081/sunscan/aps/getversion.action?appid=Y002&tradecode=JKDS&commversion=1.0033&appversion=1.0003&cfgversion=0&username=admin&pwd=dXdwe2N0Zg==', trans_type: null, Uri: '/sunscan/aps/getversion.action?appid=Y002&tradecode=JKDS&commversion=1.0033&appversion=1.0003&cfgversion=0&username=admin&pwd=dXdwe2N0Zg==', appversion: '1.0003', DestIp: '10.10.51.129', pwd: 'dXdwe2N0Zg', intf_name: 'intf2', PartId: 0, cfgversion: '0', transaction_id: '795741901202011009:-222607699584483327:0', appid: 'Y002', messageCode: null, transactionId: null, TcpSeq: 3223489363 },
      requestText: { status: 200, 'Content-Length': '973', HeaderType: 'H', MetaType: 1, '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/PmtTpInf/CtgyPurp': '', CnccOrigSenderSID: 'HVPS', Charset: 'UTF8', PktLen: 1362, DecodeId: 1510443234, CnccStructType: 'XML', FlowId: '795741901202011009:-222607699584483327:0', '/Document/FIToFICstmrCdtTrf/GrpHdr': '', PktId: 19528, CnccMesgID: '32329000001600474934', CnccOrigReceiver: '313229000008 ', '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/CdtrAcct/Id/Othr': '', StreamId: 1, SrcIp: '10.10.51.129', FlowSide: 1, CnccOrigSendDate: '20170926', DestPort: 64745, '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Purp': '', trans_type: '商业汇票', TcpPldLen: 1308, 'Content-Language': 'zh-CN', ret_code: 200, '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/CdtrAgt/FinInstnId': '', Expires: 'Thu, 01 Dec 1994 16:00:00 GMT', SrcPort: 9082, ts: 1525839000.031787, RRA: 'resp', '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/DbtrAgt/FinInstnId': '', '/Document/FIToFICstmrCdtTrf': '', CnccOrigSendTime: '112314', '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/CdtrAgt/FinInstnId/ClrSysMmbId': '', IpProt: 6, CnccMesgType: 'hvps.111.001.01 ', Date: 'Fri, 14 Apr 2017 06:32:59 GMT', is_success: true, StatusCode: 200, '/Document': '', TcpAck: 3223489613, CnccOrigReceiverSID: 'HVPS', CnccMesgDirection: 'U', Prot: 'xml', '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/PmtTpInf': '', senderaccount: '6236220399100006315', transaction_id: '795741901202011009:-222607699584483327:0', 'Set-Cookie': 'JSESSIONID=00004M8ASlv1VMSWqNGN85tE1m8:-1; Path=/; HttpOnly', receiver: '阜新银行结算中心', receiverbankaccount: '313229000008', receiveraccount: '123', Server: 'WebSphere Application Server/8.0', channel2: '03403', sub_trans_type: 'hvps', '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/DbtrAgt': '', intf_name: 'intf2', messageCode: 'hvps.111.001.01 ', '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/DbtrAgt/FinInstnId/ClrSysMmbId': '', '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/DbtrAcct/Id/Othr': '', CnccOrigSender: '323290000016 ', Sendtime: '2017-09-26T11:23:14', '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/CdtrAcct': '', PartId: 0, '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/IntrBkSttlmAmt/@Ccy': 'CNY', prtry1: 'A111', MsgId: '2017092600474933', CodeMessage: 'OK', 'X-Powered-By': 'Servlet/3.0', '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/CdtrAgt': '', '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf': '', DestIp: '11.11.11.11', '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/DbtrAcct/Id': '', '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/DbtrAcct': '', amount: '10000000.48', senderbankaccount: '323290000016', CnccVersionID: '02', sender: '323290000016', 'Cache-Control': 'no-cache="set-cookie, set-cookie2"', TcpSeq: 1067234018, transactionId: '32329000001600474934', app_name: 'app18', '/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/CdtrAcct/Id': '', CnccMesgRefID: '00474933 ', CnccMesgPriority: '3' },
      width: window.innerWidth,
    };
  },
  computed: {
    ...mapState({
      appId: 'appId',
      intfId: 'intfId',
      originDataList: 'originDataList',
      cacheTime: 'cacheTime',
    }),
    cardId() {
      let idStr = '';
      if (this.$route.params.id !== undefined) {
        idStr = this.$route.params.id;
      }
      return idStr;
    },
  },
  watch: {
    currentType() {
      // this.data1 = [];
      this.handleClose();
      this.tableShow = false;
      this.$nextTick(() => {
        this.tableShow = true;
      });
    },
  },
  methods: {
    changeDate(val) {
      this.strStart = val[0];
      this.strEnd = val[1];
    },
    changeKeyword() {
      checkError({
        bool: this.keywordId !== '',
        tip: '不为空!',
      }, this.$refs.keyword);
    },
    submitSearch(canStop = false) {
      // 1. 终止请求
      if (this.isRun && canStop) {
        if (this.currentType === 'single') {
          console.log('stop-get-single');
          if (this.jobId !== null) {
            cancelTrack(this.jobId).then(() => {
              this.jobId = null;
              this.isRun = false;
              this.clearTimer();
            });
          }
        } else {
          console.log('stop-get-Correlation');
          cancelCorrelation().then((res) => {
            if (res.data.data.action === 'SUCCESS') {
              this.isRun = false;
            }
          });
        }
      }
      // 2. 发起新请求
      // 2.1 校验
      const f = checkError({
        bool: this.keywordId !== '',
        tip: '不为空!',
      }, this.$refs.keyword);
      if (f && !this.isRun) {
        this.data1 = [];
        this.isRun = true;
        if (this.currentType === 'single') {
          this.getSingle();
        } else {
          // 关联交易
          getCorrelation(this.appId, this.intfId, {
            critical_keyword: this.keywordId,
            ts_start: this.strStart.concat(':00'),
            ts_end: this.strEnd.concat(':00'),
          }).then((res) => {
            this.isRun = false;
            const data = res.data;
            [this.cols1, this.data1, this.alaysisData] = formatCorrelateData(data);
            this.count = this.data1.length;
          });
        }
      }
    },
    getSingle() {
      // 搜索业务追踪， 1. 搜索进行状态， 终止job-id 2. 可搜索时， 先删除job-id， 在获取新的job-id
      if (this.jobId === null) {
        // 初始化加载
        this.getJobId();
      } else {
        deleteTrack(this.jobId).then(() => {
          this.getJobId();
        });
      }
    },
    getJobId() {
      // 获取job-id
      this.data1 = [];
      this.isRun = true;
      getSingleId(this.appId, this.intfId, 'single', {
        critical_keyword: this.keywordId,
        // ts_start: '2018-11-12 11:18:00',
        // ts_end: ' 2018-11-12 11:33:00',
        ts_start: this.strStart,
        ts_end: this.strEnd,
      }).then((res) => {
        const data = res.data;
        this.jobId = data.transtrack_id;
        this.getStatus();
        // this.getTableData();
        const cacheTime = [moment(this.strStart).format('X'), moment(this.strEnd).format('X')];
        this.$store.commit('SET_CACHETIME', cacheTime);
        // 循环更新状态
        this.timer = window.setInterval(() => {
          if (this.isRun) {
            this.getStatus();
          }
        }, 3000);
      });
    },
    getStatus() {
      if (this.jobId !== null) {
        getTrackState(this.jobId).then((res) => {
          const data = res.data.data;
          this.count = data.result_count;
          this.getTableData();
          if (data.state === 'DONE') {
            this.isRun = false;
            this.clearTimer();
          }
        });
      }
    },
    getTableData() {
      if (this.jobId !== null) {
        getSingleTable(this.appId, this.intfId, {
          transtrack_id: this.jobId,
          end_time: str2ts(this.strEnd),
          enable_multi_segment: false,
          count: this.count,
        }).then((res) => {
          const data = res.data;
          // 表格
          [this.cols1, this.data1, this.alaysisData] = formatSingleTable(data);
        });
      }
    },
    handleChangeType(type) {
      if (type !== this.currentType && !this.isRun) { // 有效事件
        this.currentType = type;
        this.submitSearch(false);
      }
    },
    // handleDetail(index) {
    //   this.showAlaysis = true;
    //   if (this.currentType === 'singlesingle') {
    //     const tmpPair = this.tbodys[0].RRA.split('⇌');
    //     const tmpTime = this.tbodys[index].ts_relative;
    //     console.log(tmpPair, tmpTime);
    //     this.alaysisData.flow = [{ notFollow: true, source: tmpPair[0], target: tmpPair[1], time: 39.936 }];
    //     // test
    //     // this.alaysisData.flow = [{ notFollow: true, source: '前置（ECIF）', target: 'ECIF', time: 39.936 }];
    //     this.alaysisData.active = 0;
    //   } else {
    //     this.alaysisData.flow = [{ notFollow: true, source: '前置（ECIF）', target: 'ECIF', time: 39.936 },
    //       { notFollow: true, source: 'ECIF', target: 'U头报文', time: 45.15 },
    //       { notFollow: true, source: 'U头报文', target: '大额', time: 56.09 }];
    //     this.alaysisData.active = index;
    //   }
    // },
    handleClose() {
      this.showAlaysis = false;
      this.activeRow = null;
    },
    handleToggle() {
      this.showOrigin = !this.showOrigin;
    },
    clearTimer() {
      if (this.timer !== null) {
        clearInterval(this.timer);
      }
    },
    exportCSV() {
      // const query = {
      //   transtrack_id: this.jobId,
      //   sortBy: 'duration',
      //   sortOrder: 0,
      //   count: this.count,
      // };
      let query = {};
      if (this.currentType === 'single') {
        query = {
          transtrack_id: this.jobId,
          enable_multi_segment: false,
          end_time: str2ts(this.strEnd),
          count: this.count,
        };
      } else {
        query = {
          transtrack_id: this.jobId,
          ts_start: str2ts(this.strEnd),
          ts_end: str2ts(this.strStart),
        };
      }
      location.href = exportSingle(this.appId, this.intfId, this.currentType, query);
      console.log('export', this.appId, this.intfId, this.currentType, query);
    },
    clickRow(res) {
      const data = res.data;
      if (JSON.stringify(this.alaysisData) !== '{}') {
        this.alaysisData.active = res.index;
        this.activeRow = res.index;
        this.showAlaysis = true;
        this.responseText = data.originData;
        this.requestText = data.originRequest;
      }
    },
  },
  mounted() {
    singleInit(this.appId, this.intfId).then((res) => {
      const data = res.data.data;
      this.keywordTitle = data.critical_keyword_disp;
      this.strStart = ts2str(data.ts_start, 'yyyy-MM-dd HH:mm:ss');
      this.strEnd = ts2str(data.ts_end, 'yyyy-MM-dd HH:mm:ss');
      // this.keywordId = '6228-XXXX-XXXX-XXX2-571';
      // 带参数跳转
      if (this.$route.params.id !== undefined) {
        this.keywordId = this.$route.params.id;
      }
      if (this.cacheTime.length > 0) {
        this.strStart = ts2str(this.cacheTime[0], 'yyyy-MM-dd HH:mm:ss');
        this.strEnd = ts2str(this.cacheTime[1], 'yyyy-MM-dd HH:mm:ss');
      }
      if (this.keywordId !== '') {
        this.submitSearch();
      }
    });
  },
  beforeDestroy() {
    this.clearTimer();
  },
  updated() {
    const width = window.innerWidth - 108;
    if (this.$refs.container && this.alaysisData.flow.length) {
      this.width = Math.max(width, this.alaysisData.flow.length * 300);
    }
  },
};
</script>

<style lang="scss">
.single-table{
  .stable-tr{
    cursor: pointer;
  }
}
.flow-nodes-scroll{
  width: 100%;
  height: 100%;
  // z-index: 99;
  // overflow-y: auto;
}
</style>

<style lang="scss" scoped>
.main{
  height: 100%;
}
.top-div{
  height: 57px;
  line-height: 57px;
  padding-left: 20px;
  padding-right: 20px;
  border-bottom: solid 1px #071b2d;
  .top-left{
    float: left;
  }
  .top-right{
    float: right;
  }
  .record-text{
    color: #20877f;
  }
}

.trade-type-div{
  height: 45px;
  padding: 5px 20px;
  // text-align: ;
  a{
    display: block;
    float: left;
    width: 98px;
    height: 35px;
    line-height: 35px;
    border: 1px solid #32d6c8;
    color: #B9CFE1;
    font-size: 14px;
    &:first-child{
      border-radius: 5px 0 0 5px;
    }
    &:last-child{
      border-radius: 0 5px 5px 0;
    }
  }
  .active{
    background: #32d6c8;
    color: #08141b;
  }
}
.trade-div{
  width: 100%;
  // height: calc(100% - 102px);
  padding: 5px 20px;
  .no-data-img{
    width: 100px;
  }
}
.table-scroll{
  width: 100%;
  // width: calc(100% - 40px);
  height: 200px;
  // margin: 10px 20px 10px;
  overflow: auto;
  .table{
    width: 100%;
    border-spacing: 0;
    padding: 0;
    background: #010c11;
    .no-data-tr{
      td{
        height: 64px;
        // line-height: 32px;
      }
    }
  }
  .table th, .table td{
      height: 32px;
      line-height: 32px;
      text-align: center;
      white-space: nowrap;
      border: 1px solid rgba(14,47,51,0.4);
  }
  .table th{
      background: #0a212c;
  }
  .table td{
      text-align: center;
  }
  .no-data-tr td{
    height: 64px;
    line-height: 64px;
  }
  .table a{
      text-decoration: none;
      cursor: pointer;
  }
}

.modal{
  position: absolute;
  bottom: 5px;
  width: 100%;
  height: auto;
  z-index: 2;
}

.svg-div{
    width: 100%;
    height: 219px;
  .close-btn{
    position: absolute;
    right: 0;
    top: 7px;
    width: 18px;
    cursor: pointer;
  }

}
.origin-title{
    height: 28px;
    line-height: 28px;
    background: rgb(13,31,45);
    color: white;
    text-align: left;
    padding: 0 10px;
    .toggle-btn{
      width: 33px;
      cursor: pointer;
      display: block;
      position: relative;
      top: -30px;
      left: calc(50% - 23px);
    }
  }
  .origin-text{
    height: 100px;
    background: rgb(8,17,26);
    font-size: 14px;
    font-family: "SourceHanSansCN-Normal";
    text-align: left;
    word-wrap: break-word;
    word-break: break-all;
  }
  .origin-text-scroll{
    height: 100px;
    overflow-y: auto;
    padding: 0 10px;
  }

.single-table{
  position: absolute;
  left: 15px;
  width: calc(100% - 20px);
  top: 120px;
  bottom: 50px;
  height: auto;  
}
</style>

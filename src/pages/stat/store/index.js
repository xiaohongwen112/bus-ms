import Vue from 'vue';
import Vuex from 'vuex';
import mutations from './mutations';
import actions from './actions';

Vue.use(Vuex);
const pathName = window.location.pathname.split('/');
const state = {
  appId: pathName[3],
  appName: '',
  dispName: '', // 临时
  intfId: pathName[5],
  intfName: '',
  trackQuery: {},
  desc: '',
  levelId: '',
  levelList: [],  // 交易
  dstIpList: [],  //  服务器IP
  currentIp: '', // 选中服务器ip
  searchStatus: false,  //  true搜索中
  searchType: '',   // 搜索类型track|current|correlation
  panel: {
    tsStart: null,
    tsEnd: null,
    selectList: [],
  },
  cacheTime: [],
  tradeIndex: [
    {
      code: 'trans_count',
      text: '交易量(笔)',
    }, {
      code: 'succ_rate',
      text: '交易量(笔)',
    }, {
      code: 'duration',
      text: '交易量(笔)',
    }, {
      code: 'rr_rate',
      text: '交易量(笔)',
    },
  ],
  chart: {
    tradeTypeData: [],  //  交易类型排名-按响应时间-数据
    returnCodeData: [], //  返回码分布--按交易量-数据
    chartList: [
      {
        id: 'trade_type',
        text: '交易类型排名-按响应时间',
        icon: 'pie',
      },
      {
        id: 'ret_code',
        text: '返回码分布--按交易量',
        icon: 'bar',
      },
      {
        id: 'trans_count',
        text: '交易量（笔）',
        legend: ['交易量'],
        unit: ['笔'],
        icon: 'area',
      },
      {
        id: 'rr_rate',
        text: '响应率（%）',
        legend: ['响应率'],
        unit: ['%'],
        icon: 'area',
      },
      {
        id: 'succ_rate',
        text: '成功率（%）',
        legend: ['成功率'],
        unit: ['%'],
        icon: 'area',
      },
      {
        id: 'duration',
        text: '响应时间（ms）',
        legend: ['响应时间'],
        unit: ['ms'],
        icon: 'area',
      },
    ],
    xMarks: [],
    chartDataList: [[], [], [], []],
  },
  snap: {
    tradeList: [],  //  各项指标
    respTimeList: [],
    tradeVol: [],
  },
  time: {
    xMarks: [],
    chartData: [[[], [], [], [], [], [], [], []], [[], [], [], [], [], [], [], []]],
  },
  multi: {
    multiOptions: [],
    // data: {},
    headers: [],
    records: [],
    historyTb: [
      {
        code: 'trans_type',
        text: '交易类型',
        _id: 'null',
      },
      {
        _id: null,
      }, {
        _id: null,
      }, {
        _id: null,
      }, {
        _id: null,
      },
    ],
    currentType: {
      code: 'trans_type',
      text: '交易类型',
    },
    currentDs: 1,
    pageSize: '10',
    // filters: [],
    // cardList: [{
    //   code: 'trans_type',
    //   text: '交易类型',
    //   _id: '',
    //   duration: null,
    //   req_count: null,
    //   resp_count: null,
    //   rr_rate: null,
    //   succ_count: null,
    //   succ_rate: null,
    //   trans_count: null,
    // }, {}, {}, {}, {}],
    activeId: 'null',  // 3处
    order: {
      key: 'trans_count',
      direction: 'down',
    },
  },
  baselineTrade: {},
};

(() => {
  const text = ['交易量(笔)', '成功率(%)', '响应时间(ms)', '响应峰值(ms)', '响应率(%)'];
  const res = Array.from({ length: 5 }, (v, i) => {
    const obj = { digit: '--', text: text[i] };
    return obj;
  });
  state.snap.tradeList = res;
})();

export default new Vuex.Store({
  state,
  actions,
  mutations,
  // getters,
});


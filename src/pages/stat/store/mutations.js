// import * as mt from './mutation-types';
import _ from 'lodash';

import { SET_SYSTIME, SET_CACHETIME, SET_MULTI, GET_JSON, GET_PANEL_CHART, GET_DIMENSIONS, GET_TIMETRADE, GET_BASELINE, GET_SNAP, GET_CHART, GET_ALLDIMS, GET_MULTI, INCREMENt, SET_HISTORY, RESET_MULTI_OPTIONS,
  TOGGLE_SERVERIP,
} from './mutation-types';
import { ts2str } from '../../../helpers/utils';

const setSnap = {
  setTrade(data, isDefault = false) { // 处理指标
    const text = ['交易量(笔)', '成功率(%)', '响应时间(ms)', '响应峰值(ms)', '响应率(%)'];
    const code = ['req_count', 'succ_rate', 'duration', 'peak', 'rr_rate'];
    const res = Array.from({ length: 5 }, (v, i) => {
      const obj = { text: text[i], code: code[i] };
      const digit = isDefault ? '--' : data[0][code[i]];
      if (digit !== undefined && digit !== '--') {
        obj.digit = this.formatNum(digit);
      } else {
        obj.digit = '--';
      }
      return obj;
    });
    return res;
  },
  setRespTime(data) { // 报文类型号排名-按响应时间
    const newData = _.cloneDeep(data);
    newData.forEach((d, i) => {
      if (d.rank_name === null) {
        newData[i].rank_name = '--';
      }
    });
    return newData;
  },
  setTradeVol(data) { //  返回码排名-按交易量
    const newData = _.cloneDeep(data);
    newData.forEach((d, i) => {
      if (d.ret_code === null) {
        newData[i].ret_code = '--';
      }
    });
    return newData;
  },
  formatNum(num) {
    return Number(num).toFixed(2) * 100 / 100;
  },
  formatStr(str) {
    return str === null ? 'null' : str;
  },
};

const getTradeTypeData = (data) => {
  const arr = [];
  data.forEach((d) => {
    arr.push({
      label: d.rank_name === null ? '--' : d.rank_name,
      value: d.resp_time,
    });
  });
  return arr;
};

const getReturnCodeData = (data) => {
  const arr = [];
  data.forEach((d) => {
    arr.push({
      label: d.ret_code === null ? '--' : d.ret_code,
      value: d.trans_count,
    });
  });
  return arr;
};

/* eslint-disable no-empty-pattern, no-param-reassign */
export default {
  [SET_SYSTIME](state, res) {
    console.log(res.data.systime);
    state.tsSystime = new Date(res.data.systime);
  },
  [SET_CACHETIME](state, res) {
    state.cacheTime = res;
  },
  [GET_JSON](state, res) {
    state.levelList = [];
    state.dstIpList = [];
    // state.getJson = res.data;
    const getJson = res.data;
    state.appName = getJson.disp_name;
    state.dispName = getJson.disp_name;
    state.desc = getJson.desc;
    getJson.trade.forEach((level, index) => {
      if (level.collector) {
        const levelInfo = {};
        levelInfo.intf = level.collector[0].name;
        levelInfo.dispName = level.settings.disp_name;
        levelInfo.text = level.settings.disp_name;
        levelInfo.href = `/zh-cn/stat/${state.appId}/cap/${level.collector[0].name}/`;
        levelInfo.selected = level.collector[0].name === state.intfId;
        state.levelList.push(levelInfo);
        if (level.collector[0].name === state.intfId) {
          state.levelId = index;
          state.intfName = level.settings.disp_name;
          level.settings.filter.dst_ip_list.forEach((d) => {
            state.dstIpList.push({ text: d, href: '#', selected: d === state.currentIp });
          });
        }
      }
    });
  },
  [GET_PANEL_CHART](state, res) {
    // 跳转传参筛查
    const params = JSON.parse(window.localStorage.getItem('params'));
    if (params) {
      const keys = Object.keys(params);
      if (keys.includes('ts_start')) {
        state.panel.tsStart = params.ts_start;
        state.panel.tsEnd = params.ts_end;
      }
    } else if (state.cacheTime.length > 0) {
      state.panel.tsStart = state.cacheTime[0];
      state.panel.tsEnd = state.cacheTime[1];
    } else {
      const dataLst = res.data.latest;
      const dateNow = res.data.earliest;
      state.panel.tsStart = dateNow;
      state.panel.tsEnd = dataLst;
    }
    if (res.data.first_dim) {
      state.panel.selectList[0] = res.data.first_dim;
    }
  },
  [GET_DIMENSIONS](state, res) {
    if (res.data.relations) {
      if (state.panel.selectList[0] !== null) {
        state.panel.selectList.splice(1, state.panel.selectList.length - 1);
        const firstDim = state.panel.selectList[0].name;
        const firstDiValues = res.data.relations[firstDim][0].values;
        state.panel.selectList[0].options = res.data.materials[firstDiValues];
        state.panel.selectList[0].checkValue = '*';
      }
      res.data.relations.sub_trans_type.forEach((d) => {
        const optObj = d;
        optObj.options = res.data.materials[d.values];
        optObj.checkValue = '*';
        state.panel.selectList.push(optObj);
      });
    }
  },
  [GET_TIMETRADE](state, res) { //  biz-time
    state.time.xMarks = [];
    // 交易量-响应率
    state.time.chartData = [[[], [], [], [], [], [], [], []], [[], [], [], [], [], [], [], []]];
    if (res.data.status.ok) {
      res.data.results.forEach((d) => {
        state.time.xMarks.push(ts2str(d.time));
        state.time.chartData.forEach((typeData, j) => {
          typeData.forEach((dayData, k) => {
            const key = j === 0 ? 'trans_count' : 'rr_rate';
            const tmp = d[key] === undefined ? null : d[key]; // 处理数据
            dayData.push((k === 0 || k === Number(d.dw)) ? tmp : null);
          });
        });
      });
    }
  },
  [GET_BASELINE](state, res) {
    if (res.code === 0) {
      state.baselineTrade = res.data;
    }
  },
  [GET_SNAP](state, res) {
    // 统计快照
    switch (res.index) {
      case 0:
        if (res.results.length > 0) {
          state.snap.tradeList = setSnap.setTrade(res.results);
          state.snap.durationGte = res.results[0].duration__gte;
          state.snap.durationLt = res.results[0].duration__lt;
        } else {
          state.snap.tradeList = setSnap.setTrade([], true);
          state.snap.durationGte = 0;
          state.snap.durationLt = 0;
        }
        break;
      case 1:
        state.snap.respTimeList = setSnap.setRespTime(res.results);
        break;
      default:
        state.snap.tradeVol = setSnap.setTradeVol(res.results);
    }
  },
  [GET_CHART](state, res) {
    // const chartSerachList = ['dim_duration_rank', 'ret_code', 'trans_count', 'rr_rate', 'duration'];
    if (res.search === 'ret_code') {
      state.chart.returnCodeData = res.data.ok && res.data.results.length > 0 ? getReturnCodeData(res.data.results) : [];
    } else if (res.search === 'dim_duration_rank') {
      state.chart.tradeTypeData = res.data.ok && res.data.results.length > 0 ? getTradeTypeData(res.data.results) : [];
    } else if (res.search === 'trans_count') {
      const xMarks = [];
      const resList = [];
      if (res.data.ok && res.data.results.length > 0) {
        res.data.results.forEach((d) => {
          xMarks.push(ts2str(d.time));
          resList.push(d.trans_count === undefined ? null : d.trans_count);
        });
      }
      state.chart.xMarks = xMarks;
      state.chart.chartDataList[0] = resList;
    } else if (res.search === 'rr_rate') {
      const xMarks = [];
      const [rrRateList, succRateList] = [[], []];
      if (res.data.ok) {
        res.data.results.forEach((d) => {
          xMarks.push(ts2str(d.time));
          rrRateList.push(d.rr_rate === undefined ? null : d.rr_rate);
          succRateList.push(d.succ_rate === undefined ? null : d.succ_rate);
        });
      }
      state.chart.xMarks = xMarks;
      [state.chart.chartDataList[1], state.chart.chartDataList[2]] = [rrRateList, succRateList];
    } else if (res.search === 'duration') {
      const xMarks = [];
      const resList = [];
      if (res.data.ok && res.data.results.length > 0) {
        res.data.results.forEach((d) => {
          xMarks.push(ts2str(d.time));
          resList.push(d.duration === undefined ? null : Number(d.duration.toFixed(3)));
        });
      }
      state.chart.xMarks = xMarks;
      state.chart.chartDataList[3] = resList;
    }
  },
  [GET_ALLDIMS](state, res) {
    const resArr = [];
    if (res.all_dims.length > 0) {
      res.all_dims.forEach((d) => {
        resArr.push({ key: d.name, name: d.show_name, show: true });
      });
    }
    state.multi.multiOptions = resArr;
  },
  [GET_MULTI](state, res) {
    const multi = state.multi;
    const index = multi.currentDs === 0 ? 0 : multi.currentDs - 1;
    multi.headers = res.headers;
    multi.records = res.records;
    multi.activeId = 'null';
    multi.order.key = res.order_key;
    multi.order.direction = res.order_reverse;
    Object.assign(multi.historyTb[index], res);
  },
  [INCREMENt](state) {
    if (state.multi.currentDs < 5) {
      state.multi.currentDs += 1;
    }
  },
  [SET_MULTI](state, obj) {
    state.multi[obj.target] = obj.val;
  },
  [SET_HISTORY](state, obj) { // 切换卡片和记录
    // const data = obj;
    state.multi.historyTb[obj.index][obj.key] = _.cloneDeep(obj);
    state.multi.cardList[obj.index] = _.cloneDeep(obj);
  },
  [RESET_MULTI_OPTIONS](state) {
    const currentDs = state.multi.currentDs;
    state.multi.multiOptions.forEach((d) => {
      d.show = true;
      state.multi.historyTb.forEach((sub, j) => {
        if (j < currentDs - 1 && d.code === sub.code) {
          d.show = false;
        }
      });
    });
  },
  [TOGGLE_SERVERIP](state, ip) {
    state.currentIp = ip;
    state.dstIpList.forEach((d) => {
      d.selected = d.text === ip;
    });
  },
  setTrackQuery(state, data) {
    // console.log(state, data);
    if (data.key !== 'duration') {
      state.trackQuery[data.key] = data.value;
    } else {
      [state.trackQuery.duration__gte, state.trackQuery.duration__lt] = data.value;
    }
  },
  resetTrackQuery(state) { // 清除
    state.trackQuery = {};
  },
};

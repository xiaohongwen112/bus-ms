import _ from 'lodash';

import { getSystime, getJson, getPanel, getDimensions, getTimeTrade, getBaseLine, getJob, getSnap,
  getAllDims, getMulti,
} from '../service';

import { SET_SYSTIME, GET_JSON, GET_PANEL_CHART, GET_DIMENSIONS, GET_TIMETRADE, GET_BASELINE, GET_SNAP, GET_CHART, GET_ALLDIMS, GET_MULTI,
} from './mutation-types';

// import { str2ts } from '../../../helpers/utils';

const chartSerachList = ['dim_duration_rank', 'ret_code', 'trans_count', 'rr_rate', 'duration'];
const snapSearchList = ['rr_rate_snapshot', 'dim_duration_rank_snapshot', 'ret_code_snapshot'];
const getFilters = (currentDs, historyTb) => {
  let filterStr = '';
  if (currentDs > 0 && historyTb[0]._id !== 'null') {
    historyTb.forEach((d, index) => {
      if (index < currentDs) {
        if (filterStr.length > 0) {
          filterStr = `${filterStr}&`;
        }
        filterStr = `${filterStr}${d.code}=${d._id}`;
      }
    });
  }
  return filterStr;
};

export default {
  async getSystime({ commit }) {
    const res = await getSystime();
    commit(SET_SYSTIME, res);
  },
  async getJson({ commit, state }) {
    const res = await getJson(state.appId);
    commit(GET_JSON, res);
  },
  async getPanel({ dispatch, commit, state }, queryStr) {
    const res = await getPanel(state.appId, state.intfId, queryStr);
    commit(GET_PANEL_CHART, res.data);
    let req = {};
    const params = JSON.parse(window.localStorage.getItem('params'));
    if (params) {
      // 可视化服务图等其他模块跳转
      const keys = Object.keys(params);
      if (keys.includes('ts_start')) {
        req = {
          type: queryStr,
          tsStart: params.ts_start,
          tsEnd: params.ts_end,
        };
      }
      window.localStorage.removeItem('params');
    } else if (state.cacheTime.length > 0) {
      // 当前模块时间缓存
      req = {
        type: queryStr,
        tsStart: state.cacheTime[0],
        tsEnd: state.cacheTime[1],
      };
    } else {
      // const dataLst = ((window.ts - 30) / 60).toFixed(0) * 60;
      // const dateNow = dataLst - 60 * 15;
      req = {
        type: queryStr,
        tsStart: state.panel.tsStart,
        tsEnd: state.panel.tsEnd,
      };
    }
    dispatch('getDimensions', req);
  },
  async getDimensions({ dispatch, commit, state }, req) {
    const res = await getDimensions(state.appId, state.intfId);
    commit(GET_DIMENSIONS, res.data);
    // init数据
    const formData = {
      type: req.type,
      dim_trans_type: '*',
      dim_sub_trans_type: '*',
      tsStart: req.tsStart,
      tsEnd: req.tsEnd,
    };
    formData.metric = req.type === 'biz_overview_snapshot' ? 1 : '';
    dispatch('submitPanel', formData);
  },
  async getTimeTrade({ commit, state }, req) { //  获取分时交易时间
    const res = await getTimeTrade(state.appId, state.intfId, req);
    commit(GET_TIMETRADE, res.data);
  },
  async getBaseLine({ commit, state }) {
    const res = await getBaseLine(state.appId, state.intfId);
    commit(GET_BASELINE, res.data);
  },
  async getJob({ dispatch, state }, req) {
    const data = { index: req.index, type: req.type, search: req.search };
    const appId = state.appId;
    const intfId = state.intfId;
    const body = _.cloneDeep(req);
    const newReq = {
      app_name: appId,
      cap_name: intfId,
      endponit: `/zh-cn/stat/task/${appId}/cap/${intfId}/`,
      search_mode: 'normal',
      scope: 'capture',
      search: body.search,
      metric: body.metric,
      earliest: body.tsStart,
      latest: body.tsEnd,
      dim_trans_type: body.dim_trans_type,
      dim_sub_trans_type: body.dim_sub_trans_type,
    };
    this.commit('SET_CACHETIME', [body.tsStart, body.tsEnd]);
    // 切换服务器ip
    if (['biz_overview_chart', 'biz_overview_snapshot'].includes(req.type) && state.currentIp !== '') {
      Object.assign(newReq, {
        scope: 'server',
        server: state.currentIp,
      });
    }
    const res = await getJob(state.appId, state.intfId, newReq);
    if (res.data.ok) {
      data.jobId = res.data.job_id;
      dispatch('getDatastat', data);
    }
  },
  async getDatastat({ dispatch, commit, state }, req) {
    const res = await getSnap(state.appId, state.intfId, req.jobId);
    if (res.data.ok) {
      res.data.index = req.index;
      if (req.type === 'biz_overview_chart') { // 统计中心
        commit(GET_CHART, {
          data: res.data,
          search: req.search,
        });
      } else {
        commit(GET_SNAP, res.data);
      }
    }
    // isDone
    if (!res.data.status.isDone) {
      dispatch('getDatastat', req);
    }
  },
  submitPanel({ dispatch, state }, req) {
    // 分时交易不同
    if (req.type === 'biz_overview_chart' || req.type === 'biz_overview_snapshot') {
      const currentList = req.type === 'biz_overview_chart' ? chartSerachList : snapSearchList;
      currentList.forEach((v, i) => {
        req.index = i;
        req.search = v;
        dispatch('getJob', req);
      });
    } else if (req.type === 'biz_overview_time_trade') {
      const formData = {
        app_name: state.appId,
        intf: state.intfId,
        earliest: req.tsStart,
        latest: req.tsEnd,
        metric: req.metric,
        dim_sub_trans_type: req.dim_sub_trans_type,
        dim_trans_type: req.dim_trans_type,
      };
      dispatch('getTimeTrade', formData);
    }
    if (req.type === 'biz_overview_chart' || req.type === 'biz_overview_time_trade') {
      dispatch('getBaseLine');
    }
  },
  async getAllDims({ commit, state }) {
    const res = await getAllDims(state.appId, state.intfId);
    commit(GET_ALLDIMS, res.data);
  },

  async getMulti({ commit, state }) {
    const multi = state.multi;
    const formData = {
      page_size: Number(state.multi.pageSize),
      order_key: state.multi.order.key,
      order_direction: state.multi.order.direction,
      selected_dim: state.multi.currentType.code,
      filters: getFilters(multi.currentDs, multi.historyTb),
      site: '',
    };
    const res = await getMulti(state.appId, state.intfId, formData);
    commit(GET_MULTI, res.data);
  },
  increment: ({ commit }) => commit('INCREMENt'),
};

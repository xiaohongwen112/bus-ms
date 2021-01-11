import {
  GET_CENTER,
  POST_QUERY,
  GET_DATA,
  FETCH_QUERY,
  GET_OVER_VIEW,
} from './mutation-types';

/* eslint-disable no-empty-pattern, no-param-reassign */
export default {
  [GET_CENTER](state, res) {
    if (res.data.code === 0) {
      const data = res.data.data;
      state.timeStart = data.default_ts_start;
      state.timeEnd = data.default_ts_end;
      const labels = data.tag_labels;
      for (let i = 0; i < labels.length; i += 1) {
        if (labels[i].title === '指标') {
          state.targetArr = ['所有指标', ...(labels[i].values)];
        }
        if (labels[i].title === '状态') {
          state.statusArr = ['所有状态', ...(labels[i].values)];
        }
      }
    }
  },
  [POST_QUERY](state, res) {
    if (res.status && res.status === 'error') {
      console.log('获取失败');
    } else {
      if (res.data.code === 0) {
        const data = res.data.data.alerts;
        const total = data.count.total;
        const current = data.count.current;
        if (data.app_disp_name) state.appDispName = data.app_disp_name;
        if (data.intf_disp_name) state.intfDispName = data.intf_disp_name;
        state.total = current === 0 && total !== 0 ? total : current;
      }
    }
  },
  [GET_DATA](state, res) {
    if (res.data.code === 0) {
      const config = res.data.data.config;
      state.switchStatus = config.status === 'on' || config.status === 'true'; // eslint-disable-line
    }
  },
  [FETCH_QUERY](state, res) {
    state.loading = false;
    if (res.data.code === 0) {
      state.alerts = res.data.data.alerts;
    } else {
      state.alerts = [];
    }
  },
  [GET_OVER_VIEW](state, res) {
    state.overview = res.data.overview_stats;
  },
};

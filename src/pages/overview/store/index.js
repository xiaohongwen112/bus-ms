import Vue from 'vue';
import Vuex from 'vuex';
import _ from 'lodash';

Vue.use(Vuex);
const pathName = window.location.pathname.split('/');

/* eslint-disable no-empty-pattern, no-param-reassign */
export default new Vuex.Store({
  state: {
    newTs: null,
    appId: pathName[3],
    appName: null,
    intfId: null,
    intfName: null,
    ts: null,
    dialog: null, // 弹窗 childtopo|singleserver|faultsrc|client|alertlist
  },
  actions: {
    initDate({
      state,
    }) {
      // get
      let params = localStorage.getItem('params');
      if (params !== null) {
        params = JSON.parse(params);
        if (_.has(params, 'ts_start')) {
          state.ts = params.ts_start;
          console.log('set time--', params.ts_start);
          localStorage.removeItem('params');
        }
      }
      let tmpTs = state.newTs;
      const timer = window.setInterval(() => {
        if (state.ts === null) {
          tmpTs += 1;
          if (tmpTs % 60 === 0) {
            state.newTs = tmpTs;
            console.info('系统时间持续更新:', tmpTs, '回溯时间:', state.ts);
          } else if (tmpTs % (60 * 60) === 0) {
            // 每小时清理控制台
            console.clear();
          }
        } else {
          window.clearInterval(timer);
        }
      }, 1000);
    },
  },
  mutations: {
    setIntf(state, data) {
      state.intfId = data.intfId;
      state.intfName = data.intfName;
      if (_.has(data, 'duration')) {
        state.duration = data.duration;
      }
    },
    setNewTs(state, ts) {
      state.newTs = ts;
    },
    setTs(state, ts) {
      state.ts = ts;
    },
    setDialog(state, type) {
      state.dialog = type;
    },
  },
});

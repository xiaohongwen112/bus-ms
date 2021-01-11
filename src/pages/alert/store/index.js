import Vue from 'vue';
import Vuex from 'vuex';
import actions from './actions';
import mutations from './mutations';

Vue.use(Vuex);

const state = {
  dispName: '',
  switchStatus: false,
  timeStart: '',
  timeEnd: '',
  targetArr: [],
  statusArr: ['所有状态'],
  alerts: [],
  total: 1,
  loading: true,
  tipShow: false,
  tipTitle: '提示',
  tipContent: '提示内容',
  currentContent: 'alert',
  appName: '',
  overview: {},
  currenApp: {},
  error: null,
  active: {},
  dataPath: {},
  error_locations: [],
  intfs: [],
  currentLevel: {},
  showSingle: false,
  appDispName: '',
  intfDispName: '',
};

export default new Vuex.Store({
  state,
  actions,
  mutations,
});

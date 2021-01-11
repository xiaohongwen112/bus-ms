import Vue from 'vue';
import Vuex from 'vuex';
import mutations from './mutations';
import actions from './action';
import getters from './getters';

Vue.use(Vuex);

const state = {
  appName: '',
  dispName: '',
  showSourceConfig: false, // 发出配置
  showTargetConfig: false,
  datapath: {}, // get：state.datapath = data， save：stat.datapath.datapath
  schedule: undefined,
  nodes: [],
  edges: [],
  groups: [],
  currentNode: {},
  currentEdge: {}, // 临时存放发出配置数据 { srcId: int, dstId: int, src_ports: [], src_ip_list: [] }, 前两来自触发信息， 后两项读取stat。datapath
  ipObj: {},
  loaded: false,
  saveSuccess: false,
  baselineData: {},
  ipData: {},
  monitData: [],
};

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
});

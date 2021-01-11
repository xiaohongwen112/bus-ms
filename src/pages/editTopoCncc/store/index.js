import Vue from 'vue';
import Vuex from 'vuex';
import mutations from './mutations';
import actions from './action';
import getters from './getters';

Vue.use(Vuex);

const state = {
  appName: '',
  dispName: '',
  showSourceConfig: false,
  showTargetConfig: false,
  datapath: {},
  schedule: [],
  nodes: [],
  edges: [],
  groups: [],
  currentNode: {},
  currentEdge: {},
  ipObj: {},
  loaded: false,
  saveSuccess: false,
};

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
});

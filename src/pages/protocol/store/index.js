/* eslint-disable import/extensions */
import Vue from 'vue';
import Vuex from 'vuex';
import mutations from './mutations';
import actions from './action';
import getters from './getters';
import protocolData from '../testData';
import dataSelet from '../dataSelet';
import listRule from '../listRule';


Vue.use(Vuex);

const state = {
  listRule,
  protocolData,
  dataSelet,
  protoName: [], // 名称去重数组
  csvInit: [],
};

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
});

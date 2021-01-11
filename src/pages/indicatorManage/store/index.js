/* eslint-disable import/extensions */
import Vue from 'vue';
import Vuex from 'vuex';
import _ from 'lodash';
import mutations from './mutations';
import actions from './action';
import getters from './getters';
import protocolData from '../testData';


Vue.use(Vuex);

const state = {
  listRule: {
    ruleList: [],
  },
  protocolData,
  temporaryData: _.cloneDeep(protocolData),
  protoName: [], // 名称去重数组
};

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
});

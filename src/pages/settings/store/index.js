import Vue from 'vue';
import Vuex from 'vuex';
import mutations from './mutations';
import actions from './action';
import getters from './getters';

Vue.use(Vuex);

const state = {
  aboutMain: {},
  checkVersion: {
    status: 0,
    msg: '已经是最新版本',
  },
  updatedVersion: {},
};

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
});

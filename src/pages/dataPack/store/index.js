import Vue from 'vue';
import Vuex from 'vuex';
import mutations from './mutations';
import actions from './action';
import getters from './getters';

Vue.use(Vuex);

const pathName = window.location.pathname.split('/');
const state = {
  mapId: pathName[3],
  sourceId: pathName[5],
};

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
});

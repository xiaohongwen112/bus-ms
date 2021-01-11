import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

/* eslint-disable no-empty-pattern, no-param-reassign */
export default new Vuex.Store({
  state: {
    baselineData: {},
  },
  getters: {},
  actions: {},
  mutations: {
    setBaseline(state, data) {
      state.baselineData = data;
    },
  },
});


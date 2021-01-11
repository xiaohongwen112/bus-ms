import * as mt from './mutation-types';

export default {
  dealData({
    commit,
  }, data) {
    commit(mt.DATADEAL, data);
  },
  ititAllData({
    commit,
  }) {
    commit(mt.INITALLDATA);
  },
  editAllData({
    commit,
  }, index) {
    commit(mt.EDITALLDATA, index);
  },
  setRuleList({
    commit,
  }, data) {
    commit(mt.SETRULELIST, data);
  },
  setData({
    commit,
  }, data) {
    commit(mt.SETDATA, data);
  },
  delData({
    commit,
  }, data) {
    commit(mt.DELDATA, data);
  },
};

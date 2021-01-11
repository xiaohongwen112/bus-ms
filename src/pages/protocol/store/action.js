import * as mt from './mutation-types';

export default {
  basic({
    commit,
  }) {
    commit(mt.BASIC);
  },
  NameDiff({ commit }, data) {
    commit(mt.NAMEDIFF, data);
  },
  setbasic({ commit }, data) {
    commit(mt.SETBASIC, data);
  },
  protoNameL({ commit }, data) {
    commit(mt.PROTONAMEL, data);
  },
  setproperty({ commit }, data) {
    commit(mt.SETPROPERTY, data);
  },
  getproperty({ commit }, data) {
    commit(mt.GETPROPERTY, data);
  },
  editAllData({ commit }, data) {
    commit(mt.EDITALLDATA, data);
  },
  ititAllData({ commit }, data) {
    commit(mt.INITALLDATA, data);
  },
  addTool({ commit }, data) {
    commit(mt.ADDTOOL, data);
  },
  deleteTool({ commit }, data) {
    commit(mt.DELETETOOL, data);
  },
  initRule({ commit }, data) {
    commit(mt.INITRULE, data);
  },
  upDataList({ commit }, data) {
    commit(mt.UPDATALIST, data);
  },
  detailData({ commit }, data) {
    commit(mt.DETAILDATA, data);
  },
  preData({ commit }, data) {
    commit(mt.PREDATA, data);
  },
  delPre({ commit }, data) {
    commit(mt.DELPRE, data);
  },
  dealData({ commit }, data) {
    commit(mt.DATADEAL, data);
  },
  delDealData({ commit }, data) {
    commit(mt.DELDEALDATA, data);
  },
  proDecode({ commit }, data) {
    commit(mt.PRODECODE, data);
  },
  addTraRename({ commit }, data) {
    commit(mt.ADDTRARENAME, data);
  },
  delTraRename({ commit }, data) {
    commit(mt.DELTRARENAME, data);
  },
  upTraRename({ commit }, data) {
    commit(mt.UPTRARENAME, data);
  },
  updateProDecode({ commit }, data) {
    commit(mt.UPDATEPRODECODE, data);
  },
  addProDecode({ commit }, data) {
    commit(mt.ADDPRODECODE, data);
  },
  newCsv({ commit }, data) {
    commit(mt.NEWCSV, data);
  },
  addCsv({ commit }, data) {
    commit(mt.ADDCSV, data);
  },
  addCsvRename({ commit }, data) {
    commit(mt.ADDCSVRENAME, data);
  },
  delCsvRename({ commit }, data) {
    commit(mt.DELCSVRENAME, data);
  },
  updateCsv({ commit }, data) {
    commit(mt.UPDATECSV, data);
  },
  decodeList({ commit }, data) {
    commit(mt.DECODELIST, data);
  },
  reDecodeList({ commit }, data) {
    commit(mt.REDECODELIST, data);
  },
  csvInit({ commit }, data) {
    commit(mt.CSVINIT, data);
  },
  csvCancel({ commit }, data) {
    commit(mt.CSVCANCEL, data);
  },
  addLay({ commit }, data) {
    commit(mt.ADDLAY, data);
  },
};

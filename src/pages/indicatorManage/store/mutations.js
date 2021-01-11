import * as mt from './mutation-types';
// eslint-disable-next-line import/first
import _ from 'lodash';

/* eslint-disable no-empty-pattern, no-param-reassign */
export default {
  [mt.INITALLDATA](state) { // 重置vuex数据
    state.protocolData.normalizes = {
      normalize: [{
        field: [{
          '@op': 'MAX',
          '@item1': '',
        }],
      }],
    };
  },
  [mt.EDITALLDATA](state, index) { // 编辑每条协议
    state.temporaryData.normalizes.normalize[index] = _.cloneDeep(state.protocolData.normalizes.normalize[index]);
    // console.log('EDITALLDATA', 'state.temporaryData.normalizes', state.temporaryData.normalizes, 'state.protocolData.normalizes', state.protocolData.normalizes);
  },
  [mt.DATADEAL](state, data) { // 添加处理数据
    const ruleL = _.cloneDeep(state.listRule.ruleList);
    state.listRule.ruleList = _.cloneDeep(ruleL);
    state.protocolData.normalizes.normalize[data.index] = data.normal;
    // console.log('DATADEAL', data);
  },
  [mt.SETRULELIST](state, data) { // 将接口返回的计算规则list赋值给仓库中的ruleList
    state.listRule.ruleList = data;
  },
  [mt.SETDATA](state, data) { // 将接口返回的计算规则list赋值给仓库中的ruleList
    // console.log('SETDATA', 'data', data, 'state.protocolData.normalizes', state.protocolData.normalizes);
    state.protocolData.normalizes = _.cloneDeep(data);
  },
  [mt.DELDATA](state, data) { // 字段删除
    for (let len = data.length, i = 0; i < len; i += 1) {
      state.protocolData.normalizes.normalize.splice(data[i], 1);
    }
  },
};



import * as mt from './mutation-types';
// eslint-disable-next-line import/first
import _ from 'lodash';
import protocolDatas from '../testData';

/* eslint-disable no-empty-pattern, no-param-reassign */
export default {
  [mt.BASIC](state) { // 设置信息
    console.log(state);
    // state.basic.name = '';
    // state.basic.desc = '';
  },
  [mt.SETBASIC](state, data) { // 获取设置信息
    state.protocolData['proto.xml'].basic.desc = data.desc;
    state.protocolData['proto.xml'].basic.name = data.name;
  },
  [mt.NAMEDIFF](state, data) { // 去重名称
    state.protoName.push(data.name);
  },
  [mt.PROTONAMEL](state, data) { // 获取设置信息
    state.protoName = data;
  },
  [mt.SETPROPERTY](state, data) { // 设置协议解码下层规则
    state.basic.basicName = data.name;
    state.basic.basicDisName = data.basicDisName;
  },
  [mt.EDITALLDATA](state, data) { // 编辑每条协议
    const pname = data['proto.xml'].basic.name;
    state.protoName.splice(state.protoName.findIndex(item => item === pname), 1);
    state.protocolData = data;
    const proPrepareArr = [];
    const proNormalizesArr = [];
    let ruleL = _.cloneDeep(state.listRule.ruleList);
    const xlArr = _.cloneDeep(state.protocolData['dp.xml']);
    const proPrepare = _.cloneDeep(state.protocolData['proto.xml'].prepare.field);
    const proNormalizes = _.cloneDeep(state.protocolData['proto.xml'].normalizes.normalize);
    _.forEach(proPrepare, (item) => {
      proPrepareArr.push(item['#text']);
    });
    _.forEach(proNormalizes, (item) => {
      proNormalizesArr.push(item['@name']);
    });
    _.forEach(xlArr, (item) => {
      if (item.recordField !== undefined) {
        _.forEach(item.recordField.field, (items) => {
          const dataR = items['#text'];
          ruleL.push(dataR);
        });
      }
    });
    const newArrs = proPrepareArr.concat(proNormalizesArr);
    ruleL = newArrs.concat(ruleL);
    const DeArr = _.cloneDeep(ruleL);
    let nowARR = _.cloneDeep(DeArr.sort());
    nowARR = _.uniqWith(DeArr, _.isEqual);
    state.listRule.ruleList = _.cloneDeep(nowARR);
    if (state.protocolData['proto.xml'].trace_disp === null) {
      state.protocolData['proto.xml'].trace_disp = _.cloneDeep({});
      state.protocolData['proto.xml'].trace_disp.field = [];
    }
  },
  [mt.INITALLDATA](state) { // 新建协议
    const deep = _.cloneDeep(protocolDatas);
    console.log(deep);
    state.protocolData = deep;
    state.protocolData['proto.xml'].basic.name = '';
    state.protocolData['proto.xml'].basic.desc = '';
  },
  [mt.ADDTOOL](state, data) { // 增加规则
    // 判断是否同层数据
    // eslint-disable-next-line no-unused-vars
    const allLen = state.protocolData['dp.xml'].length;
    const thisArr = _.cloneDeep(state.protocolData['dp.xml']);
    _.forEach(state.protocolData['dp.xml'], (item, index) => {
      if (!(data.preObj instanceof Array)) {
        const Arr = [];
        Arr.push(data.preObj);
        data.preObj = _.cloneDeep(Arr);
      }
      if (item['@baseProtocol'] === data.preObj[0]['@baseProtocol']) {
        // eslint-disable-next-line no-const-assign
        thisArr.splice(index, allLen - index);
      }
    });
    const stateProtocolData = thisArr;
    const ifConTe = true;
    const tureData = _.filter(data.preObj, item => item['@id'] !== '无');
    state.protocolData['dp.xml'] = stateProtocolData.concat(tureData);
    if (ifConTe) {
      _.forEach(state.protocolData['dp.xml'], (item) => {
        if (item['@id'] === data.id && data.property !== undefined) {
          item.property = data.property;
        } else {
          delete item.property;
        }
      });
    }
  },
  [mt.DELETETOOL](state, data) { // 删除规则
    const stateProtocolData = state.protocolData['dp.xml'];
    _.forEach(state.protocolData['dp.xml'], (item, index) => {
      if (item['@id'] === data['@id']) {
        _.forEach(state.protocolData['dp.xml'], (items) => {
          if (items['@id'] === data['@baseProtocol']) {
            let attiLen = 0;
            if (items.property !== undefined) {
              if (!(items.property.attribute instanceof Array)) {
                const Arr = [];
                Arr.push(items.property.attribute);
                items.property.attribute = _.cloneDeep(Arr);
              }
              attiLen = items.property.attribute.length;
              if (attiLen === 0) delete items.property;
              else items.property.attribute.splice(attiLen - 1, 1);
              if (items.property.attribute.length === 0) delete items.property;
            }
          }
        });
        stateProtocolData.splice(index, 1);
      }
    });
    state.protocolData['dp.xml'] = stateProtocolData;
  },
  [mt.INITRULE](state, newName) { // 重置规则
    const stateProtocolData = state.protocolData['dp.xml'];
    _.forEach(stateProtocolData, (item) => {
      if (item['@baseProtocol'] === 'tcp') {
        item['@id'] = newName;
        state.protocolData['dp.xml'] = [];
        state.protocolData['dp.xml'].push(_.cloneDeep(item));
      }
    });
  },
  [mt.UPDATALIST](state, selectName) { // 重置下拉列表
    console.log(state, selectName);
  },
  [mt.DETAILDATA](state, data) { // 详情
    state.protocolData['proto.xml'].basic.name = data.name;
    state.protocolData['proto.xml'].basic.desc = data.desc;
    state.protocolData['dp.xml'] = data['dp.xml'];
    console.log(state, data);
  },
  [mt.PREDATA](state, data) { // 添加预处理数据
    const newData = data.field;
    delete newData.show;
    const ruleL = _.cloneDeep(state.listRule.ruleList);
    ruleL.push(newData['#text']);
    const DeArr = _.cloneDeep(ruleL);
    let nowARR = _.cloneDeep(DeArr);
    nowARR = _.uniqWith(DeArr, _.isEqual);
    state.listRule.ruleList = _.cloneDeep(nowARR);
    // state.protocolData['proto.xml'].basic.name = data.name;
    // state.protocolData['proto.xml'].basic.desc = data.desc;
    // state.protocolData['dp.xml'] = data['dp.xml'];
    const fieldArr = state.protocolData['proto.xml'].prepare.field;
    if (!(fieldArr instanceof Array)) {
      const Arr = [];
      Arr.push(fieldArr);
      state.protocolData['proto.xml'].prepare.field = _.cloneDeep(Arr);
    }
    if (data.index >= 0) {
      state.protocolData['proto.xml'].prepare.field.splice(data.index, 1, newData);
    } else {
      state.protocolData['proto.xml'].prepare.field.splice(0 - data.index, 0, newData);
    }
    console.log(state, data);
  },
  [mt.DELPRE](state, data) { // 添加预处理数据
    // state.protocolData['proto.xml'].basic.name = data.name;
    // state.protocolData['proto.xml'].basic.desc = data.desc;
    // state.protocolData['dp.xml'] = data['dp.xml'];
    state.protocolData['proto.xml'].prepare.field.splice(data, 1);
    console.log(state, data);
  },
  [mt.DATADEAL](state, data) { // 添加处理数据
    const ruleL = _.cloneDeep(state.listRule.ruleList);
    ruleL.push(data.normal['@name']);
    const DeArr = _.cloneDeep(ruleL);
    let nowARR = _.cloneDeep(DeArr);
    nowARR = _.uniqWith(DeArr, _.isEqual);
    state.listRule.ruleList = _.cloneDeep(nowARR);
    // state.protocolData['proto.xml'].basic.name = data.name;
    // state.protocolData['proto.xml'].basic.desc = data.desc;
    // state.protocolData['dp.xml'] = data['dp.xml'];
    if (data.index >= 0) {
      // 新建
      state.protocolData['proto.xml'].normalizes.normalize.splice(data.index, 1, data.normal);
    } else {
      // 编辑
      state.protocolData['proto.xml'].normalizes.normalize.splice(0 - data.index, 0, data.normal);
    }
    console.log(data);
  },
  [mt.DELDEALDATA](state, data) { // 添加预处理数据
    state.protocolData['proto.xml'].normalizes.normalize.splice(data, 1);
  },
  [mt.PRODECODE](state, data) { // 解码字段数据
    _.forEach(state.protocolData['dp.xml'], (item) => {
      if (item['@id'] === data.id) {
        let NowArr = [];
        NowArr = data.recordField;
        NowArr = _.uniqWith(NowArr, _.isEqual);
        item.recordField.field = _.cloneDeep(NowArr);
      }
    });
    // state.protocolData['dp.xml'] = data;
  },
  [mt.UPDATEPRODECODE](state, data) { // 解码字段数据
    _.forEach(state.protocolData['dp.xml'], (item) => {
      if (item['@id'] === data.id) {
        item.recordField.field[data.index]['#text'] = data['#text'];
        item.recordField.field[data.index]['@item'] = data['@item'];
      }
    });
    // state.protocolData['dp.xml'] = data;
    console.log(state, data);
  },
  [mt.ADDPRODECODE](state, data) { // 解码字段数据
    _.forEach(state.protocolData['dp.xml'], (item) => {
      if (item['@id'] === data.id) {
        item.recordField.field.push(data.data);
      }
    });
    // state.protocolData['dp.xml'] = data;
    console.log(state, data);
  },
  [mt.ADDTRARENAME](state, data) { // 字段转译及重命名添加
    // if (state.protocolData['proto.xml'].trace_disp === null) state.protocolData['proto.xml'].trace_disp.field = [];
    state.protocolData['proto.xml'].trace_disp.field.push(data.tra);
  },
  [mt.DELTRARENAME](state, data) { // 字段转译及重命名删除
    for (let len = data.deltra.length, i = len - 1; i >= 0; i -= 1) {
      state.protocolData['proto.xml'].trace_disp.field.splice(data.deltra[i], 1);
    }
  },
  [mt.NEWCSV](state, data) { // 字段转译及重命名删除
    const allCsvAll = _.filter(state.protocolData.csv, e => e.csvname === data.csvname); // [0].data.push(data.tra)
    if (allCsvAll.length === 0) {
      state.protocolData.csv.push(data);
      let allCsv = _.filter(state.protocolData.csv, e => e.csvname === data.csvname); // [0].data.push(data.tra)
      allCsv = _.uniqWith(allCsv, _.isEqual);
      allCsv[0].data.push(data.tra);
    }
  },
  [mt.ADDCSV](state, data) { // 字段转译及重命名删除
    state.protocolData.csv.push(data);
  },
  [mt.ADDCSVRENAME](state, data) { // csv添加
    let allCsv = _.filter(state.protocolData.csv, e => e.csvname === data.csvname); // [0].data.push(data.tra)
    allCsv = _.uniqWith(allCsv, _.isEqual);
    allCsv[0].data.push(data.tra);
  },
  [mt.DELCSVRENAME](state, data) { // csv删除
    for (let len = data.index.length, i = len - 1; i >= 0; i -= 1) {
      const allCsv = _.filter(state.protocolData.csv, e => e.csvname === data.csvname);
      allCsv[0].data.splice(data.index[i] + 1, 1);
    }
  },
  [mt.UPDATECSV](state, data) { // csv修改
    const allCsv = _.filter(state.protocolData.csv, e => e.csvname === data.csvname);
    allCsv[0].data[data.index + 1][0] = data['@item'];
    allCsv[0].data[data.index + 1][1] = data['#text'];
  },
  [mt.DECODELIST](state, data) { // 解码字段
    const ArrList = data;
    const CoArr = [];
    const ruleList = _.cloneDeep(state.listRule.ruleList);
    // ['DecodeId', 'DestPort', 'DestIp', 'FlowId', 'FlowSide', 'IpProt', 'MetaType', 'PartId',
    // 'PktId', 'PktLen', 'Prot', 'RRA', 'SrcIp', 'SrcPort', 'StreamId', 'TcpSeq', 'TcpAck', 'TcpPldLen', 'Vlan',]
    _.forEach(ArrList, (item) => {
      CoArr.push(item['#text']);
    });
    const DeArr = _.cloneDeep(ruleList);
    let nowARR = _.cloneDeep(DeArr.concat(CoArr));
    nowARR = _.uniqWith(nowARR, _.isEqual);
    state.listRule.ruleList = _.cloneDeep(nowARR);
  },
  [mt.REDECODELIST](state, data) { // 解码字段
    const ArrList = data;
    const ruleList = _.cloneDeep(state.listRule.ruleList);
    _.forEach(ArrList, (item) => {
      if (ruleList.findIndex(items => items === item['#text']) !== -1) {
        ruleList.splice(ruleList.findIndex(items => items === item['#text']), 1);
      }
    });
    const DeArr = _.cloneDeep(ruleList);
    let nowARR = _.cloneDeep(DeArr);
    nowARR = _.uniqWith(nowARR, _.isEqual);
    state.listRule.ruleList = _.cloneDeep(nowARR);
  },
  [mt.UPTRARENAME](state, data) { // 解码字段
    state.protocolData['proto.xml'].trace_disp.field[data.index]['@item1'] = data['@item1'];
    state.protocolData['proto.xml'].trace_disp.field[data.index]['#text'] = data['#text'];
  },
  [mt.CSVINIT](state, data) { // 解码字段
    state.csvInit = _.cloneDeep(data);
  },
  [mt.CSVCANCEL](state) { // csv添加
    const data = _.cloneDeep(state.csvInit);
    if (data.data !== undefined) {
      if (data.data.length !== 0) {
        let allCsv = _.filter(state.protocolData.csv, e => e.csvname === data.csvname); // [0].data.push(data.tra)
        allCsv = _.uniqWith(allCsv, _.isEqual);
        allCsv[0].data = data.data;
      }
    }
  },
  [mt.ADDLAY](state, data) { // lay添加
    console.log(state, data);
    _.forEach(state.protocolData['dp.xml'], (item, index) => {
      if (item['@id'] === data.id) state.protocolData['dp.xml'][index].layerProperty = data.layerProperty;
    });
  },
};

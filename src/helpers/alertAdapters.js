
// 可视化服务图配置告警数据adapters

import _ from 'lodash';
import * as cv from './configValidate';

function getbaseLineTxtV(baseline, unit) {
  if (_.isNull(baseline) || _.isUndefined(baseline)) return '--';
  return `${baseline}${unit}`;
}

function genAutoBaselineStr(baseline, unit) {
  if (_.isArray(baseline)) return `自动上基线值：${getbaseLineTxtV(baseline[0], unit)}, 自动下基线值：${getbaseLineTxtV(baseline[1], unit)},`;
  return `自动基线值：${getbaseLineTxtV(baseline, unit)}`;
}

export default {
  health: {
    db: { duration: 1, on: false, ts_hold: 3, baseOn: true, health_set: 2 },
    view: {
      name: '健康度',
      autoBaseline: '自动基线值：40%',
      on: false,
      baseOn: true,
      values: [{
        name: 'down',
        val: 1,
        validateFn: v => v > 1,
      }, {
        name: 'up',
        val: 1,
        validateFn: v => v > 1,
      }],
      spans: ['响应时间正常值', 'ms 健康度低于', '%'],
      time: 2,
    },
    view2db(data) {
      return {
        duration: data.values[0].val,
        on: data.on,
        ts_hold: data.time,
        baseOn: data.baseOn,
        health_set: data.values[1].val,
      };
    },
    db2view(data, baseline) {
      return {
        baseOn: data.baseOn || false,
        name: '健康度',
        autoBaseline: genAutoBaselineStr(baseline, '%'),
        on: data.on,
        values: [
          {
            name: 'duration',
            val: data.duration,
            validateFn: cv.validateMs,
          }, {
            name: 'health_set',
            val: data.health_set,
            validateFn: cv.validatePercent,
          },
        ],
        spans: ['响应时间正常值', 'ms 健康度低于', '%'],
        time: data.ts_hold,
      };
    },
  },
  trans_count: {
    db: { down: { value: 100, time: 1 }, on: true, up: { value: 110, time: 1 } },
    view: {
      name: '交易量',
      autoBaseline: '自动上基线值：0笔，自动下基线值：0笔',
      on: false,
      baseOn: true,
      values: [{
        name: 'up',
        val: 1,
        validateFn: cv.validateCount,
      }, {
        name: 'down',
        val: 1,
        validateFn: cv.validateCount,
      }],
      spans: ['高于', '或低于', '笔'],
      time: 2,
    },
    db2view(data, baseline) {
      return {
        name: '交易量',
        autoBaseline: genAutoBaselineStr(baseline, '笔'),
        on: data.on,
        baseOn: data.baseOn || false,
        values: [{
          name: 'up',
          val: data.up.value,
          validateFn: cv.validateCount,
        }, {
          name: 'down',
          val: data.down.value,
          validateFn: cv.validateCount,
        }],
        spans: ['高于', '或低于', '笔'],
        time: data.down.time,
      };
    },
    view2db(data) {
      return {
        down: { value: data.values[1].val, time: data.time },
        on: data.on,
        baseOn: data.baseOn,
        up: { value: data.values[0].val, time: data.time },
      };
    },
  },
  succ_rate: {
    db: { down: { value: 90, time: 1 }, on: true },
    view: {
      name: '成功率',
      autoBaseline: '自动基线值：40%',
      on: false,
      baseOn: true,
      values: [{
        name: 'down',
        val: 1,
        validateFn: v => v > 1,
      }],
      spans: ['低于', '%'],
      time: 2,
    },
    db2view(data, baseline) {
      return {
        name: '成功率',
        autoBaseline: genAutoBaselineStr(baseline, '%'),
        on: data.on,
        baseOn: data.baseOn || false,
        values: [{
          name: 'down',
          val: data.down.value,
          validateFn: cv.validatePercent,
        }],
        spans: ['低于', '%'],
        time: data.down.time,
      };
    },
    view2db(data) {
      return {
        down: { value: data.values[0].val, time: data.time },
        on: data.on,
        baseOn: data.baseOn,
      };
    },
  },
  duration: {
    db: { on: true, up: { value: 110, time: 1 } },
    view: {
      name: '响应时间',
      autoBaseline: '自动基线值：40%',
      on: false,
      baseOn: true,
      values: [{
        name: 'up',
        val: 1,
        validateFn: v => v > 1,
      }],
      spans: ['高于', 'ms'],
      time: 2,
    },
    db2view(data, baseline) {
      return {
        name: '响应时间',
        autoBaseline: genAutoBaselineStr(baseline, 'ms'),
        on: data.on,
        baseOn: data.baseOn || false,
        values: [{
          name: 'up',
          val: data.up.value,
          validateFn: cv.validateMs,
        }],
        spans: ['高于', 'ms'],
        time: data.up.time,
      };
    },
    view2db(data) {
      return {
        on: data.on,
        baseOn: data.baseOn,
        up: { value: data.values[0].val, time: data.time },
      };
    },
  },
  rr_rate: {
    db: { down: { value: 97, time: 1 }, on: true },
    view: {
      name: '响应率',
      autoBaseline: '自动基线值：40%',
      on: false,
      baseOn: true,
      values: [{
        name: 'down',
        val: 1,
        validateFn: v => v > 1,
      }],
      spans: ['低于', '%'],
      time: 2,
    },
    db2view(data, baseline) {
      return {
        name: '响应率',
        autoBaseline: genAutoBaselineStr(baseline, '%'),
        on: data.on,
        baseOn: data.baseOn || false,
        values: [{
          name: 'down',
          val: data.down.value,
          validateFn: cv.validatePercent,
        }],
        spans: ['低于', '%'],
        time: data.down.time,
      };
    },
    view2db(data) {
      return {
        down: { value: data.values[0].val, time: data.time }, on: data.on, baseOn: data.baseOn,
      };
    },
  },
};

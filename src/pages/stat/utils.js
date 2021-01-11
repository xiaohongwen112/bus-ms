export const sideNav = {
  bizChart: {},
  bizSnapshot: {},
  bizTime: {},
  bizMulti: {},
  bizTrack: {},
  bizSingle: {},
};

/**
 * 统计快照-报文类型号排名-按响应时间
 */
export const msgTypeCols = [ // key依赖接口key
  { key: 'rank_name', name: '交易类型' },
  { key: 'resp_time', name: '响应时间(ms)' },
];

/**
 * 统计快照-返回码排名-按交易量
 */
export const returnCodeCols = [ // key依赖接口key
  { key: 'ret_code', name: '返回码' },
  { key: 'trans_count', name: '交易量(笔)' },
  { key: 'percent', name: '百分比(%)' },
];

/**
 * 格式化多维统计表格数据
 * @param {*} data
 * @param {*} secondName
 */
export const formatMultiuTable = (data, list, secondKey) => {
  // 多维统计-表头
  let secondName = list[0].key;
  list.forEach((d) => {
    if (d.key === secondKey) {
      secondName = d.name;
    }
  });
  const multiCols = [ // key依赖接口key
    { key: 'index', name: '序号' },
    { key: '_id', name: '交易类型' },
    { key: 'trans_count', name: '交易量(笔)', sort: true },
    { key: 'succ_rate', name: '成功率(%)', sort: true },
    { key: 'duration', name: '响应时间(ms)', sort: true },
    { key: 'rr_rate', name: '响应率(%)', sort: true },
  ];
  multiCols[1].name = secondName;
  return [multiCols, data.records];
};

/**
 * 格式化业务追踪查询条件表单
 * @param {*} data
 */
export const formatTrackFormData = (data) => {
  const tmpList = [];
  if (data.trace_fields.length > 0) {
    data.trace_fields.forEach((d) => {
      const name = d.field_name;
      const item = d;
      item.value = '';
      if (name === 'duration') {
        item.type = name;
        item.value = ['', ''];
      } else if (name === 'resp_count') {
        item.type = name;
        item.value = false;
      } else if (data.trace_field_values[name] !== undefined) {
        item.type = 'select';
        item.options = data.trace_field_values[name];
      } else {
        item.type = 'input';
      }
      tmpList.push(item);
    });
  }
  return tmpList;
};

/**
 * 格式化业务追踪表格数据
 * @param {*} data
 * @param {*} sortOrder, 响应时间排序方向true|up|down
 */
export const formatTrackTable = (data, sortOrder) => {
  const thData = [];
  const tbData = [];
  data.header.forEach((d) => {
    const thObj = { key: d.key, name: d.disp_name };
    if (d.key === 'duration') {
      thObj.sort = sortOrder;
      thObj.minWidth = 30;
    }
    thData.push(thObj);
  });
  data.transactions.forEach((d) => {
    const tdObj = {};
    thData.forEach((sub) => {
      let tmp = d[sub.key];
      if (sub.key === 'duration') { // 保留三位小数
        tmp = tmp === '--' ? '--' : Number((Number(tmp) * 1000).toFixed(3));
      } else {
        tmp = tmp === null ? '--' : tmp;
      }
      tdObj[sub.key] = tmp;
    });
    if (d.succ_count === '失败') {
      tdObj.isWarn = true;
    }
    tbData.push(tdObj);
  });
  return {
    cols: thData,
    rows: tbData,
  };
};

export const formatSingleTable = (data) => {
  const theads = [];
  const tbodys = [];
  data.header.forEach((d) => {
    theads.push({ key: d.key, name: d.disp_name });
  });
  data.records.forEach((d) => {
    const tdObj = {};
    theads.forEach((sub) => {
      tdObj[sub.key] = d[sub.key] === null || d[sub.key] === '' ? '--' : d[sub.key];
    });
    tdObj.originData = d._raw_records[0];
    tdObj.originRequest = d._raw_records[1];
    tbodys.push(tdObj);
  });
  // 样本 alaysisData: { flow: [{ notFollow: true, source: '前置（ECIF）', target: 'ECIF', time: 39.936 }], active: 0 },
  const flowArr = [];
  data.time_item.forEach((d) => {
    flowArr.push({
      notFollow: true,
      source: d.src,
      target: d.dst,
      time: d.ts_intval,
    });
  });
  const alaysisData = {
    active: 0,
    flow: flowArr,
  };
  return [theads, tbodys, alaysisData];
};

export const formatCorrelateData = (data) => {
  const theads = [];
  const tbodys = [];
  data.header.forEach((d) => {
    theads.push({ key: d.key, name: d.disp_name });
  });
  data.total_result[0].forEach((d) => {
    const tdObj = {};
    theads.forEach((sub) => {
      tdObj[sub.key] = d[sub.key] === null || d[sub.key] === '' ? '--' : d[sub.key];
    });
    tdObj.originData = d._raw_records[0];
    tdObj.originRequest = d._raw_records[1];
    tbodys.push(tdObj);
  });
  // 样本 alaysisData: { flow: [{ notFollow: true, source: '前置（ECIF）', target: 'ECIF', time: 39.936 }], active: 0 },
  const flowArr = [];
  data.time_item.forEach((d) => {
    flowArr.push({
      notFollow: true,
      source: d.src,
      target: d.dst,
      time: d.ts_intval,
    });
  });
  const alaysisData = {
    active: 0,
    flow: flowArr,
  };
  return [theads, tbodys, alaysisData];
};

// export const resetOb = (data, key, val) => {
//   _.forEach(data, (d) => {
//     d[key] = val;
//   });
// };

/**
 * 初始化数组中各字典指定字段
 * @param {*} data
 * @param {*} key
 * @param {*} val
 */
// export const reset = (data, key, val) => {
//   data.forEach((d) => {
//     if (Object.prototype.hasOwnProperty.call(d, key)) {
//       const tmp = d;
//       tmp[key] = val;
//     }
//   });
// };

/**
 * 数组中指定key的字典中其他字段的值
 * @param {*} data
 * @param {*} targetkey
 * @param {*} key
 * @param {*} val
 */
// export const set = (data, targetkey, key, val) => {
//   data.forEach((d) => {
//     console.log(targetkey, key, val);
//     if (Object.prototype.hasOwnProperty.call(d, key) && d.key === targetkey) {
//       const tmp = d;
//       tmp[key] = val;
//     }
//   });
// };

export default undefined;

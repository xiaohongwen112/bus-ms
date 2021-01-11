import moment from 'moment';
import _ from 'lodash';

export const indicatorNavList = [{
  key: 'indicator',
  name: '指标管理',
},
{
  key: 'dimension',
  name: '维度管理',
},
{
  key: 'baseline',
  name: '基线配置',
},
];

export const colsOfIndicator = [{
  type: 'select',
},
{
  key: 'name',
  name: '指标',
},
{
  key: 'type',
  name: '分类',
},
{
  key: 'agreement',
  name: '关联协议/指标',
},
{
  key: 'update_time',
  name: '更新时间',
},
{
  type: 'operation',
  name: '操作',
},
];

export const colsOfDimension = [{
  type: 'select',
},
{
  key: 'name',
  name: '维度',
},
{
  key: 'type',
  name: '分类',
},
{
  key: 'agreement',
  name: '关联协议',
},
{
  key: 'update_time',
  name: '更新时间',
},
{
  type: 'operation',
  name: '操作',
},
];

/**
 * 映射id
 * @param {*} name
 * @param {*} list
 */
export const mapToId = (name, list) => {
  let id = '';
  if (name !== '所有') {
    const index = _.findIndex(list, d => d.name === name);
    id = list[index].id;
  }
  return id;
};

/**
 * 截取字符串
 * @param {*} str
 * @param {*} num
 */
const cutStr = (str, num = 10) => {
  let newStr = str;
  if (newStr.length > 20) {
    newStr = `${newStr.substr(0, num)}...`;
  }
  return newStr === '' ? '--' : newStr;
};

export const formatIndicatorTable = (data) => {
  const newData = [];
  data.forEach((d) => {
    const agreement = cutStr(Array.from(new Set(d.agreement)).join(','));
    newData.push(Object.assign({}, d, {
      agreement,
      update_time: moment.unix(d.update_time).format('YYYY-MM-DD HH:mm:ss'),
      selectshow: d.type === '自定义' && d.name !== '健康度',
    }));
  });
  return newData;
};

export const formatDimensionTable = (data) => {
  const newData = [];
  data.forEach((d) => {
    const agreement = cutStr(Array.from(new Set(d.agreement)).join(','));
    newData.push(Object.assign({}, d, {
      agreement,
      update_time: moment.unix(d.update_time).format('YYYY-MM-DD HH:mm:ss'),
      selectshow: !d.is_default,
    }));
  });
  return newData;
};

export default undefined;

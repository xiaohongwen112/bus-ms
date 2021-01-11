import moment from 'moment';
import _ from 'lodash';

export const authNavList = [
  { key: 'domain', name: '域管理' },
  { key: 'role', name: '角色管理' },
  { key: 'user', name: '用户管理' },
  { key: 'data', name: '用户资料' },
];

export const colsOfDomain = [
  { type: 'select' },
  { key: 'name', name: '域名' },
  { key: 'serviceScope', name: '业务范围' },
  { key: 'modifier', name: '修改人' },
  { key: 'time', name: '更新时间' },
  { type: 'operation', name: '操作' },
];

export const colsOfRole = [
  { type: 'select' },
  { key: 'name', name: '角色名称' },
  { key: 'type', name: '角色分类' },
  { key: 'update_user', name: '修改人' },
  { key: 'update_time', name: '更新时间' },
  { key: 'desc', name: '描述' },
  { type: 'operation', name: '操作' },
];

export const colsOfUser = [
  { type: 'select' },
  { key: 'username', name: '用户名' },
  { key: 'role', name: '所属角色' },
  { key: 'domain', name: '所属域' },
  { key: 'create_user', name: '修改人' },
  { key: 'update_time', name: '更新时间' },
  { type: 'operation', name: '操作' },
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
  if (newStr.length > 10) {
    newStr = `${newStr.substr(0, num)}...`;
  }
  return newStr === '' ? '--' : newStr;
};

/**
 * 格式化域表格数据
 * @param {*} data
 */
export const formatDomainTable = (data) => {
  const newData = [];
  // const newData = data;
  data.forEach((d) => {
    const serviceScope = cutStr(d.scope.join(','));
    newData.push(Object.assign({}, d, {
      serviceScope,
      time: moment.unix(d.update_ts).format('YYYY-MM-DD HH:mm:ss'),
      selectable: d.is_del,
    }));
  });
  return newData;
};

/**
 * 格式化角色表格数据
 * @param {*} data
 */
export const formatRoleTable = (data) => {
  const newData = [];
  data.forEach((d) => {
    newData.push(Object.assign({}, d, {
      selectable: d.is_del,
      selectshow: !d.is_default,
      editable: !d.is_default,
      deleteable: !d.is_default,
      update_time: moment.unix(d.update_time).format('YYYY-MM-DD HH:mm:ss'),
      desc: cutStr(d.desc),
    }));
  });
  return newData;
};

/**
 * 格式化用户表格数据
 * @param {*} data
 */
export const formatUserTable = (data) => {
  const newData = [];
  data.forEach((d) => {
    newData.push(Object.assign({}, d, {
      update_time: moment.unix(d.update_time).format('YYYY-MM-DD HH:mm:ss'),
    }));
  });
  return newData;
};

export default undefined;

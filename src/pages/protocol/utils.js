import moment from 'moment';

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
  { key: 'name', name: '用户名' },
  { key: 'role_type', name: '所属角色' },
  { key: 'domain_type', name: '所属域' },
  { key: 'modifier', name: '创建人' },
  { key: 'update_time', name: '更新时间' },
  { type: 'operation', name: '操作' },
];

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
  return newStr;
};

export const formatDomainTable = (data) => {
  const newData = [];
  // const newData = data;
  data.forEach((d) => {
    const serviceScope = cutStr(d.scope.join(','));
    newData.push(Object.assign({}, d, {
      serviceScope,
      time: moment.unix(d.update_ts).format('YYYY-MM-DD HH:mm:ss'),
    }));
  });
  return newData;
};

export const formatProtocolTable = (data) => {
  const newData = [];
  data.forEach((d) => {
    const idDefault = d.classification === 'default';
    newData.push(Object.assign({}, d, {
      selectable: !idDefault,
      selectshow: !idDefault,
      editable: true,
      deleteable: idDefault,
      update_time: moment.unix(d.upload_date).format('YYYY-MM-DD HH:mm:ss'),
      desc: idDefault ? '系统默认' : '自定义',
      decodeDesc: d.decode_field.join('、'),
    }));
  });
  return newData;
};

export default undefined;

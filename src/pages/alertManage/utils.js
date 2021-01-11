import moment from 'moment';
import _ from 'lodash';

// 二级导航
export const alertNavList = [
  { key: 'contact', name: '联系人管理' },
  { key: 'message', name: '消息推送管理' },
  { key: 'template', name: '告警模板' },
  { key: 'list', name: '规则列表' },
];

// 消息管理三级导航
export const msgNavList = [
  { key: 'mail', name: '邮件服务配置', typeList: [] },
  { key: 'sms',
    name: '短信配置',
    typeList: [
    { key: 'SMD', name: '短信猫' },
    { key: 'SMS', name: '短信服务器' },
    ] },
  { key: 'other',
    name: '接口配置',
    typeList: [
      // { key: 'TIVOLI', name: 'TIVOLI' },
      { key: 'SIMO', name: 'SIMO' },
      { key: 'INTERFACE', name: '接口' },
    ] },
];

// 联系人管理三级导航
export const contactNavList = [
  { key: 'mail', name: '告警联系人' },
  { key: 'sms', name: '告警联系组' },
];

// 消息管理表单元素设置
const msgRenderData = {
  host: { label: '邮件服务器地址', require: true, type: 'text', len: 255, regex: /^(pop3|smtp|pop)\.[\w-]+\.([\w-]+\.)*(com|cn|net|org|gov)$/i },
  protocol: { label: '协议', require: true, type: 'select', options: ['SMTP', 'POP3'] },
  port: { label: '端口', require: true, type: 'text', len: 5, regex: /(^[0]$)|(^[1-9]\d{0,3}$)|(^[1-5]\d{4}$)|(^6[0-4]\d{3}$)|(^65[0-4]\d{2}$)|(^655[0-2]\d$)|(^6553[0-5]$)/ },
  // 邮件用户名实为邮件地址
  email_address: { label: '用户名', require: true, type: 'text', len: 255, regex: /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/ },
  password: { label: '密码', require: true, type: 'password', len: 255, regex: /^.+$/ },
  timeout: { label: '超时时间', require: true, type: 'text', len: 255, regex: /^[0-9]+$/ },
  test_email: { label: '测试邮箱', require: false, type: 'text', len: 255, regex: /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/ },
  // 短信猫
  vendor: { label: '短信猫厂商', require: true, type: 'select', options: ['西门子'] },
  model: { label: '短信猫型号', require: true, type: 'text', len: 255, regex: /^.+$/ },
  number: { label: '短信中心号码', require: true, type: 'text', len: 14, regex: /^(\+86)?1[3456789][0-9]{9}$/ },
  format: { label: '短信格式', require: true, type: 'select', options: ['PDU'] },
  serial_port: { label: '串口号', require: true, type: 'text', len: 255, regex: /^.+$/ },
  baudrate: { label: '波特率', require: true, type: 'select', default: '9600', options: ['1200', '2400', '4800', '9600', '19200', '38400', '57600', '115200', '460800', '921600'], regex: /^[0-9]+$/ },
  recipient: { label: '测试号码', require: false, type: 'text', len: 14, regex: /^(\+86)?1[3456789][0-9]{9}$/ },
  // cat_timeout: { label: '超时时间', require: true, type: 'text', len: 255 },
  // 短信服务器
  // SMS_address: { label: '短信服务器地址', require: true, type: 'text', len: 255 },
  signature: { label: '签名', require: true, type: 'text', len: 50, regex: /^.+$/ },
  vendor_service: { label: '短信服务商', require: true, type: 'select', options: ['腾讯'] },
  appid: { label: 'APPID', require: true, type: 'text', len: 255, regex: /^[0-9]+$/ },
  appkey: { label: 'APPKEY', require: true, type: 'text', len: 60, regex: /^[0-9a-z]+$/ },
  template_id: { label: '消息模板ID', require: true, type: 'text', len: 255, regex: /^[0-9]+$/ },
  // TIVOLI
  server: { label: '目标服务器', require: true, type: 'select', options: ['SPAMSAP1', 'WPAMSAP1'] },
  ip: { label: '目标IP', require: true, type: 'select', options: ['11.194.48.129', '11.194.48.130'] },
  auth: { label: '验证登录', require: true, type: 'radio', len: 255 },
  // SIMO|接口
  url: { label: 'URL路径', require: true, type: 'text', len: 255, regex: /^(http|https):\/\/[\w-_]+(\.[\w-_]+)+([\w\-,@?^=%&:/~+#.]*[\w\-@?^=%&/~+#])?$/g },
  data_format: { label: '数据格式', require: true, type: 'select', options: ['json', 'xml'] },
  http_method: { label: 'HTTP请求方式', require: true, type: 'select', options: ['post'] },
  username: { label: '用户名', require: true, type: 'text', len: 255, regex: /^[a-z0-9]+$/ },
};

// palceholder、remark、unit

msgRenderData.host.placeholder = '如: SMTP.163.com';
msgRenderData.timeout.unit = 's';
msgRenderData.email_address.remark = '(若使用该邮箱作为发送方，请确认SMTP/POP3服务为开启状态)';
msgRenderData.serial_port.remark = '(查看串口号使用命令: ls -l /dev/ttyS*)';
msgRenderData.number.placeholder = '可加 +86 前缀';
msgRenderData.signature.placeholder = '最大长度为50个字符';

export const mapMsgRenderData = msgRenderData;

// 消息管理各表单元素
export const msgConfigList = [
  ['host', 'protocol', 'port', 'email_address', 'password', 'test_email'],
  ['vendor', 'model', 'number', 'format', 'serial_port', 'baudrate', 'recipient'],
  ['vendor_service', 'appid', 'appkey', 'signature', 'template_id', 'recipient'],
  ['server', 'ip', 'port', 'auth', 'username', 'password'],
  ['url', 'data_format', 'http_method', 'auth', 'username', 'password'],
  // ['url', 'data_format', 'http_method', 'auth', 'auth_username', 'auth_password'],
];

export const levelNames = ['警告', '严重', '危急', '致命'];

export const levelList = levelNames.map((key, index) => `级别${index + 1}:  ${key}`);

// 告警模板表格列名称
export const colsOfTemplate = [
  { type: 'select' },
  { key: 'name', name: '模板名称' },
  { key: 'classify', name: '模板分类' },
  { key: 'modifier', name: '修改人' },
  { key: 'time', name: '更新时间' },
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
  return newStr === '' ? '--' : newStr;
};

/**
 * 格式化告警模板表格数据
 * @param {*} data
 */
export const formatTemplateTable = (data) => {
  const newData = [];
  // const newData = data;
  data.forEach((d) => {
    // const serviceScope = cutStr(d.scope.join(','));
    newData.push(Object.assign({}, d, {
      // serviceScope,
      selectable: d.is_del,
      selectshow: !d.is_default,
      editable: !d.is_default,
      deleteable: !d.is_default,
      name: cutStr(d.name),
      time: moment.unix(d.update_ts).format('YYYY-MM-DD HH:mm:ss'),
    }));
  });
  return newData;
};

/**
 * 新建/保存前, 格式化数据类型
 * @param {*} data
 */
export const formatTemplateReq = (data) => {
  const reqData = _.cloneDeep(data);
  const transCount = reqData.alarmrules.threshold.trans_count;
  transCount.up.value = transCount.up.value !== null ? Number(transCount.up.value) : null;
  transCount.down.value = transCount.down.value !== null ? Number(transCount.down.value) : null;
  return reqData;
};

export default undefined;

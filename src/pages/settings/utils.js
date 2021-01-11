// import _ from 'lodash';

const formatNum = value => Number(value.toFixed(2));

/**
 * addUnit 科学计数法
 * @param {*} value
 * @param {*} unit
 */
export const addUnit = (value = 0, unit = 'B') => {
  let str = '';
  const num = Number(value);
  const value1 = 1024;
  const value2 = Math.pow(1024, 2);
  const value3 = Math.pow(1024, 3);
  if (num < value1) {
    str = `${formatNum(num)}${unit}`;
  } else if (num < value2) {
    str = `${formatNum(num / value1)}K${unit}`;
  } else if (num < value3) {
    str = `${formatNum(num / value2)}M${unit}`;
  } else {
    str = `${formatNum(num / value3)}G${unit}`;
  }
  return str;
};

// 导航信息=权限
export const sysConfNavList = [
  {
    key: 'status',
    name: '系统状态',
    icon: 'status',
    authRoles: [0, 1, 2], // 权限
  },
  {
    key: 'log',
    name: '日志监控',
    icon: 'log',
    authRoles: [0, 1, 2],
  },
  {
    key: 'alert',
    name: '系统告警配置',
    icon: 'alert',
    authRoles: [0, 2],
  },
  {
    key: 'storage',
    name: '存储备份配置',
    icon: 'storage',
    authRoles: [0, 1, 2],
  },
  {
    key: 'about',
    name: '关于',
    icon: 'about',
    authRoles: [0, 1, 2, 3],
  },
];

export const statusNavList = ['cpu', 'db', 'mem', 'net', 'store', 'process'];

export const statusNavMap = {
  cpu: { name: 'CPU', unit: '%', unitText: '利用率' },
  db: { name: '数据库', unit: '%' },
  mem: { name: '内存', unit: '%' },
  net: { name: '网络', unit: '%' },
  store: { name: '内存', unit: 'GiB' },
  process: { name: '丢包监控', unit: '%' },
  packet: { name: '业务监控', unit: '' },
};

export const ROLE_MAP = [
  {
    roleId: 0,
    name: '超级管理员',
    authList: [],
    powerInfo: '创建用户,删除用户,编辑用户,查看用户,修改个人信息,创建可视化图,删除可视化图,编辑可视化图,导出可视化图,导入可视化图,查看可视化图,创建网路侦测项目,删除网路侦测项目,编辑网路侦测项目,创建网路侦测快照,删除网路侦测快照,导出网路侦测数据包,智能转化可视化图,查看业务墙,查看交易总览,查看统计中心,查看报表,区域监控,查看告警详情,定位单笔交易状态,查看最新告警,重启系统进程,数据存储管理,系统告警设置,用户管理。',
  },
  {
    roleId: 1,
    name: '网络管理员',
    powerInfo: '查看用户,修改个人信息,创建可视化图,删除可视化图,编辑可视化图,导出可视化图,导入可视化图,查看可视化图,创建网路侦测项目,删除网路侦测项目,编辑网路侦测项目,创建网路侦测快照,删除网路侦测快照,导出网路侦测数据包,智能转化可视化图,查看业务墙,查看交易总览,查看统计中心,查看报表,区域监控,查看告警详情,定位单笔交易状态,查看最新告警,重启系统进程,数据存储管理,用户管理。',
  },
  {
    roleId: 2,
    name: '运维管理员',
    powerInfo: '查看用户,修改个人信息,创建可视化图,删除可视化图,编辑可视化图,导出可视化图,导入可视化图,查看可视化图,创建网路侦测项目,删除网路侦测项目,编辑网路侦测项目,创建网路侦测快照,删除网路侦测快照,智能转化可视化图,查看业务墙,查看交易总览,查看统计中心,查看报表,区域监控,查看告警详情,定位单笔交易状态,查看最新告警,重启系统进程,数据存储管理,系统告警设置,用户管理。',
  },
  {
    roleId: 3,
    name: '运维操作员',
    powerInfo: '查看用户,修改个人信息,查看可视化图,创建网路侦测项目,删除网路侦测项目,编辑网路侦测项目,创建网路侦测快照,删除网路侦测快照,查看业务墙,区域监控,查看最新告警,用户管理。',
  },
];

export const roleNameList = ['超级管理员', '网络管理员', '运维管理员', '运维操作员'];

export const roleList = ['superAdmin', 'networkAdmin', 'maintenanceAdmin', 'maintenanceOperator'];

export const getRoleId = name => (roleNameList.indexOf(name));

export const userPermission = [
  {
    id: 0,
    name: '超级管理员',
    value: 'superAdmin',
    permissions: {
      node_view: true,
      user_edit: true,
      user_edit_self: true,
      spd_delete: true,
      customview_index: true,
      spd_edit: true,
      manage_data_storage: true,
      check_latest_alarm: true,
      troubleshooting_log_delete: false,
      topov_delete: true,
      manage_intelligentprobe: true,
      topov_view: true,
      restart_system: true,
      spd_snapshot_create: true,
      index_report: true,
      nav_alert: true,
      timeout_rate: true,
      topov_export: true,
      spd_snapshot_delete: true,
      locate_single_transaction: true,
      user_create: true,
      spd_create: true,
      topov_create: true,
      user_delete: true,
      capturer_stat: true,
      view_wall: true,
      spd_pcap_export: true,
      topov_import: true,
      edit_view_wall_card: true,
      user_view: true,
      topov_edit: true,
    },
  },
  {
    id: 1,
    value: 'netAmin',
    name: '网络管理员',
    permissions: {
      node_view: true,
      user_edit: false,
      user_edit_self: true,
      spd_delete: true,
      customview_index: true,
      spd_edit: true,
      manage_data_storage: true,
      check_latest_alarm: true,
      troubleshooting_log_delete: false,
      topov_delete: true,
      manage_intelligentprobe: true,
      topov_view: true,
      restart_system: true,
      spd_snapshot_create: true,
      index_report: true,
      nav_alert: true,
      timeout_rate: true,
      topov_export: true,
      spd_snapshot_delete: true,
      locate_single_transaction: true,
      user_create: false,
      spd_create: true,
      topov_create: true,
      user_delete: false,
      capturer_stat: true,
      view_wall: true,
      spd_pcap_export: true,
      topov_import: true,
      edit_view_wall_card: true,
      user_view: true,
      topov_edit: true,
    },
  },
  {
    id: 2,
    value: 'opsAdmin',
    name: '运维管理员',
    permissions: {
      node_view: true,
      user_edit: false,
      user_edit_self: true,
      spd_delete: true,
      customview_index: true,
      spd_edit: true,
      manage_data_storage: true,
      check_latest_alarm: true,
      troubleshooting_log_delete: false,
      topov_delete: true,
      manage_intelligentprobe: true,
      topov_view: true,
      restart_system: true,
      spd_snapshot_create: true,
      index_report: true,
      nav_alert: true,
      timeout_rate: true,
      topov_export: true,
      spd_snapshot_delete: true,
      locate_single_transaction: true,
      user_create: false,
      spd_create: true,
      topov_create: true,
      user_delete: false,
      capturer_stat: true,
      view_wall: true,
      spd_pcap_export: false,
      topov_import: true,
      edit_view_wall_card: true,
      user_view: true,
      topov_edit: true,
    },
  },
  {
    id: 3,
    value: 'opsOperate',
    name: '运维操作员',
    permissions: {
      node_view: false,
      user_edit: false,
      user_edit_self: true,
      spd_delete: true,
      customview_index: false,
      spd_edit: true,
      manage_data_storage: false,
      check_latest_alarm: true,
      troubleshooting_log_delete: false,
      topov_delete: false,
      manage_intelligentprobe: false,
      topov_view: true,
      restart_system: false,
      spd_snapshot_create: true,
      index_report: false,
      nav_alert: false,
      timeout_rate: false,
      topov_export: false,
      spd_snapshot_delete: true,
      locate_single_transaction: false,
      user_create: false,
      spd_create: true,
      topov_create: false,
      user_delete: false,
      capturer_stat: false,
      view_wall: true,
      spd_pcap_export: false,
      topov_import: false,
      edit_view_wall_card: false,
      user_view: true,
      topov_edit: false,
    },
  },
];

// 备份默认数据由后端提供,  暂时弃用
export const defaultBackupConfig = {
  username: '',
  password: '',
  backup_time: '00:00',
  auto_backup: false,
  backup_opts: [], // ['pcap', 'log', 'mongo']
  path: '/opt/',
  weeks: [0],
  remote_host: '',
  port: 22,
};

// 默认最新一次备份信息, 暂时弃用
export const defaultHistory = {
  path: '',
  time: '',
};

export default undefined;

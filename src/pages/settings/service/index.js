import http from '@/helpers/axios';
import axios from 'axios';

/**
 * 获取当前用户信息
 */
export const getCurrentuser = () =>
  http({
    url: '/zh-cn/accounts/currentuser/',
    method: 'post',
    timeout: 9999999999,
  });

/**
 * 系统设置-获取系统正常运行时间
 */
export const getUptime = () =>
  http({
    url: '/zh-cn/accounts/getsystemuptime/',
    method: 'get',
  });

// 系统状态
/**
 * 重启项目
 */
export const restartSys = () =>
  http({
    url: '/zh-cn/manager/server/DS1/restart/',
    method: 'post',
  });

/**
 * 获取系统状态信息
 */
export const statusSys = () =>
  http({
    url: '/zh-cn/manager/server/DS1/status/',
    method: 'get',
    errorTip: false,
  });

/**
 * 重启项目
 * @param {} obj
 */
export const restoreSys = obj =>
  http({
    url: '/zh-cn/manager/server/DS1/restore_sp_state/',
    method: 'post',
    data: obj,
    errorTip: false,
  });
// 系统状态!

// 系统告警配置
/**
 * 获取告警配置
 * @param {*} obj
 */
export const alertSettingData = obj =>
  http({
    url: '/zh-cn/manager/warnconfig/data/',
    method: 'get',
    data: obj,
  });

/**
 * 设置告警配置
 * @param {*} obj
 */
export const alertSettingStore = obj =>
  http({
    url: `/zh-cn/manager/warnconfig/update/?cpu=${obj.cpu}&free_disk_space=${obj.free_disk_space}&memory=${obj.memory}&pack=${obj.pack}&sp_dp=${obj.sp_dp}&sp_eth=${obj.sp_eth}`,
    method: 'get',
    endTip: true,
    reload: true,
  });
// 系统告警配置!

// 存储备份配置
/**
 * 获取备份--舍弃
 */
export const getBackupConfig = () => http({
  url: '/zh-cn/manager/backup/historyconfig/',
  method: 'get',
});

/**
 * 获取备份配置
 */
export const getConfig = () => http({
  url: '/zh-cn/manager/backup/getconfig/',
  method: 'get',
});

/**
 * 获取最后一次备份记录
 */
export const getLastBackup = () => http({
  url: '/zh-cn/manager/backup/getpath/',
  method: 'get',
  timeout: 999999999,
});

/**
 * 保存备份配置
 * @param {*} body
 */
export const checkBackupRemote = body => http({
  url: '/zh-cn/manager/backup/checkremote/',
  method: 'post',
  data: body,
});

/**
 * 保存备份配置
 * @param {*} body
 */
export const setBackupConfig = body => http({
  url: '/zh-cn/manager/backup/saveconfig/',
  method: 'post',
  data: body,
  endTip: true,
});

/**
 * 触发备份
 */
export const toggleBackup = data => http({
  url: '/zh-cn/manager/backup/save/',
  method: 'post',
  data: {
    ...data,
  },
  timeout: 999999999,
  endTip: true,
});

export const delBackup = () => http({
  url: '/zh-cn/manager/backup/delflag/',
  method: 'get',
  timeout: 999999999,
});

/**
 * 监听保存状态
 */
// export const listenBackupStatus = new EventSource('/zh-cn/manager/backup/get/');

/**
 * 获取数据报文解码是否输出
 */
export const getBodyfile = () =>
  http({
    url: '/zh-cn/manager/bodyfile/switch',
    method: 'post',
  });

/**
 * 设置数据报文解码是否输出
 * @param {*} body
 */
export const setBodyfile = body =>
  http({
    url: '/zh-cn/manager/bodyfile/setswitch/',
    method: 'post',
    data: body,
  });

/**
 * 获取存储信息
 */
export const getStoreinfo = () =>
  http({
    url: '/zh-cn/manager/data/storage/storeinfo/',
    method: 'get',
  });

/**
 * 获取存储配置
 */
export const getStorageForm = () =>
  http({
    url: '/zh-cn/manager/data/storage/data/',
    method: 'get',
  });

/**
 * 设置存储配置
 * @param {*} body
 */
export const setStorageForm = body =>
  http({
    url: '/zh-cn/manager/data/storage/DS1/update',
    method: 'post',
    data: body,
  });

/**
 * 清理数据
 */
export const clearData = () =>
  http({
    url: '/zh-cn/manager/cleardata/',
    method: 'get',
    endTip: true,
  });
// 存储备份配置!

// 用户管理
/**
 * 获取全部用户信息
 */
export const manageInfo = () =>
  http({
    url: '/zh-cn/accounts/manage/',
    method: 'post',
  });

/**
 * 添加新用户
 * @param {*} obj
 */
export const createUserInfo = obj =>
  http({
    url: '/zh-cn/accounts/create/',
    method: 'post',
    data: obj,
    endTip: true,
    reload: true,
  });

/**
 * 删除用户
 * @param {*} user
 */
export const deleteUser = user =>
  http({
    url: `/zh-cn/accounts/delete/${user}/`,
    method: 'get',
    endTip: true,
    reload: true,
  });

/**
 * 更新用户信息
 * @param {*} obj
 * @param {*} username
 */
export const updateUser = (obj, username) =>
  http({
    url: `/zh-cn/accounts/userinfo/change/${username}`,
    method: 'post',
    data: obj,
    endTip: true,
    reload: true,
  });
// 用户管理！

// 关于子页面
/**
 * 版本信息
 */
export const about = () =>
  http({
    url: '/zh-cn/manager/about',
    method: 'post',
  });

/**
 * 检查最新版本
 */
export const checkUpdate = () =>
  http({
    url: '/zh-cn/manager/checkversion/',
    method: 'post',
  });

/**
 * 更新最新版本
 */
export const sureUpdate = () =>
  http({
    url: '/zh-cn/manager/update/',
    method: 'post',
  });

/**
 * 日志监控 获取列表数据
 */
export const getLogList = data =>
  http({
    url: '/zh-cn/manager/operation/log/',
    method: 'post',
    data: {
      ...data,
    },
  });

/**
 * 日志监控 获取详情页数据
 */
export const getLogDetail = id =>
  http({
    url: '/zh-cn/manager/operation/log/detail/',
    method: 'post',
    data: {
      _id: id,
    },
  });
/**
 * 获取 license 详情
 */
export const getLicenseInfo = () =>
  http({
    url: '/zh-cn/manager/about/',
    method: 'get',
  });

/**
 * 获取证书状态信息并返回错误信息
 */
export const checkLicenseStatus = () =>
  http({
    url: '/zh-cn/manager/check_license_status/',
    method: 'get',
    errorTip: false,
  });


export const uploadLicense = form =>
  axios({
    url: '/zh-cn/manager/update_license/',
    method: 'post',
    data: form,
  });

export const checksystemupdate = () =>
  http({
    url: '/zh-cn/manager/checksystemupdate/',
    method: 'get',
    errorTip: false,
  });

export const getsystemupdate = () =>
  http({
    url: '/zh-cn/manager/systemupdate/',
    method: 'get',
    errorTip: false,
    endTip: true,
  });

export const postsystemupdate = form =>
  axios({
    url: '/zh-cn/manager/systemupdate/',
    method: 'post',
    data: form,
  });
// 关于子页面!

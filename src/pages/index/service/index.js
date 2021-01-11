import axios from '@/helpers/axios';
/**
 * 获取声音
 */
export const getSound = () =>
  axios({
    url: '/zh-cn/getsound/',
    method: 'post',
    data: {},
  });

/**
 * 获取系统时间
 */
export const getSysTime = () =>
  axios({
    url: '/zh-cn/systime/',
    method: 'get',
  });

/**
 * 获取类型告警数据
 */
export const getAlert = appName =>
  axios({
    url: `/zh-cn/home/getalert/?app_name=${appName}`,
    method: 'get',
  });

/**
 * 声音设置
 * @param {*} config
 */
export const setSoundStaus = config =>
  axios({
    url: '/zh-cn/soundconfig/',
    method: 'post',
    data: {
      config,
    },
  });

/**
 * 获取地图数据
 * @param {*} appName
 * @param {*} intfName
 * @param {*} earliest
 * @param {*} transType
 * @param {*} subTransType
 */
export const getMapData = (appName, intfName, earliest, transType, subTransType) =>
  axios({
    url: '/zh-cn/area/monitor/mapdata/',
    method: 'post',
    data: {
      app_name: appName || '',
      intf: intfName || '',
      earliest: earliest || '',
      trans_type: transType || '',
      sub_trans_type: subTransType || '',
    },
  });

/**
 * 获取业务及相关节点和健康度
 * @param {*} appName
 */
export const getHealth = appName =>
  axios({
    url: '/zh-cn/home/gethealth/',
    method: 'post',
    data: appName ? {
      app_name: appName,
    } : {},
  });

/**
 * 获取指标监控数据： 当前交易量、当日总交易量、当日成功率
 * @param {*} appName
 */
export const getGlobalTrade = appName =>
  axios({
    url: '/zh-cn/home/globaltrade/',
    method: 'post',
    data: appName ? {
      app_name: appName,
    } : {},
  });

/**
 * 获取健康度历史状态
 * @param {*} appName
 */
export const getHistoryHealth = appName => axios({
  url: '/zh-cn/home/gethistoryhealth/',
  method: 'post',
  data: {
    app_name: appName,
  },
});

/**
 * 获取健康态势名称
 */
export const getSysName = () => axios({
  url: '/zh-cn/home/getname/',
  method: 'post',
});

/**
 * 编辑健康态势名称
 * @param {*} name
 */
export const changeSysName = name => axios({
  url: '/zh-cn/manager/custom/changename',
  method: 'post',
  data: {
    name: name, // eslint-disable-line
  },
});

/**
 * 获取告警数值
 */
export const getAlertInfo = () =>
  axios({
    url: '/zh-cn/alertrealtime/',
    method: 'post',
  });

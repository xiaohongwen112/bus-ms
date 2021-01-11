import axios from '@/helpers/axios';

/**
 * 获取交易、 业务及相关选择列表
 * @param {*} data
 */
export const getInitData = data =>
  axios({
    url: '/zh-cn/area/monitor/globaltradeinfo/',
    method: 'post',
    data: {
      ...data,
    },
  });

/**
 * 获取地图数据
 * @param {*} data
 */
export const getMapData = data =>
  axios({
    url: '/zh-cn/area/monitor/mapdata/',
    method: 'post',
    data: {
      ...data,
    },
  });

/**
 * 获取时间轴数据
 * @param {*} appName
 * @param {*} ts, 非必填
 * @param {*} intfName, 非必填
 */
export const getTimeLineData = (appName, ts, intfName) =>
  axios({
    url: `/zh-cn/timeaxis/${appName}/timeline/?${ts ? `ts=${ts}` : 'ts=;'}${intfName ? `&intf_name=${intfName}` : ''}`,
    method: 'get',
  });

/**
 * 获取系统时间
 */
export const getSysTime = () =>
  axios({
    url: '/zh-cn/systime/',
    method: 'get',
  });

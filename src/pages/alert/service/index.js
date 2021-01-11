import http from '@/helpers/axios';

/**
 * 获取告警默认时间和下拉选择
 */
export const getCenter = () =>
  http({
    url: '/zh-cn/alert/centerdata/',
    method: 'get',
  });

/**
 * 获取告警数据数量
 * @param {*} data
 */
export const postQuery = data =>
  http({
    url: '/zh-cn/alert/query/',
    method: 'post',
    data: {
      ...data,
    },
  });

/**
 * 获取告警部分内容数据
 * @param {*} data
 */
export const fetchQuery = data =>
  http({
    url: '/zh-cn/alert/getquery/',
    method: 'post',
    data: {
      page: data.pageNo,
      pagesize: data.pageSize,
    },
  });

/**
 * 获取全屏告警状态
 */
export const getData = () =>
  http({
    url: '/zh-cn/alert/screenalert/getdata/',
    method: 'get',
    loading: false,
    errorTip: false,
    timeout: 999999999999999,
  });

/**
 * 获取路径图数据
 * @param {*} appName
 */
export const getOverview = appName =>
  http({
    url: `/zh-cn/overview/${appName}/newoverview/`,
    method: 'get',
  });

/**
 * 获取根源分析数据
 * @param {*} data
 */
export const alertLocated = data =>
  http({
    url: `/zh-cn/overview/${data.app_name}/alertlocated/`,
    method: 'post',
    data: {
      ...data,
    },
    errorTip: false,
  });

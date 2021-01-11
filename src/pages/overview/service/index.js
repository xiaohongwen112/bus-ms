import http from '@/helpers/axios';

/**
 * 获取可视化服务图信息
 * @param {*} appId
 * @param {*} obj
 */
export const getNewOverview = (appId, data) =>
  http({
    url: `/zh-cn/overview/${appId}/newoverview/`,
    method: 'post',
    data: {
      ...data,
    },
    // loading: true,
  });

/**
 * 获取监控时段
 * @param {*} appId
 * @param {*} timestamp
 */
// export const getWorkTime = appId =>
//   http({
//     url: `/zh-cn/${appId}/worktime/get/`,
//     method: 'get',
//   });

/**
 * 获取单台服务器详情
 * @param {*} appId
 * @param {*} intfId
 * @param {*} data {ts}
 */
export const getServerData = (appId, intfId, data) =>
  http({
    url: `/zh-cn/overview/${appId}/${intfId}/detailview`,
    method: 'get',
    data: {
      ...data,
    },
  });

/**
 * 获取告警列表
 * @param {*} appId
 * @param {*} data
 */
export const getAlertlist = (appId, data) => http({
  url: `/zh-cn/overview/${appId}/alertlist/`,
  method: 'post',
  data: {
    ...data,
  },
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

export default undefined;

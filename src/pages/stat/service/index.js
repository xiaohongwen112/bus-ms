import axios from '@/helpers/axios';
import {
  joinQuery,
} from '@/helpers/utils';

/**
 * 获取系统时间
 */
export const getSystime = () =>
  axios({
    url: '/zh-cn/systime/',
    method: 'get',
  });

/**
 * 获取简易拓扑图
 * @param {*} appId
 */
export const getJson = appId =>
  axios({
    url: `/zh-cn/${appId}/datapath/getjson/`,
    method: 'get',
  });

// 统计中心
/**
 * 获取
 * @param {*} appId
 * @param {*} intfId
 * @param {*} queryStr: biz_overview_chart|biz_overview_snapshot
 */
export const getPanel = (appId, intfId, queryStr) =>
  axios({
    url: `/zh-cn/stat/${appId}/cap/${intfId}/panel/data/`,
    method: 'get',
    data: {
      panel: queryStr,
      isfresh: true,
    },
  });

/**
 * 获取查询条件
 * @param {*} appId
 * @param {*} intfId
 */
export const getDimensions = (appId, intfId) =>
  axios({
    url: `/zh-cn/stat/${appId}/cap/${intfId}/dimensions/`,
    method: 'post',
    data: {},
  });

/**
 * 获取基线
 * @param {*} appId
 * @param {*} intfId
 * @param {*} autoBaseLine
 */
export const getBaseLine = (appId, intfId) =>
  axios({
    url: '/zh-cn/getbaselinetrade/',
    method: 'post',
    data: {
      app_name: appId,
      intf: intfId,
    },
  });

/**
 * 获取job id
 * @param {*} appId
 * @param {*} intfId
 * @param {*} body
 */
export const getJob = (appId, intfId, data) =>
  axios({
    url: `/zh-cn/stat/task/${appId}/cap/${intfId}/`,
    method: 'post',
    data,
  });

/**
 * 获取统计信息
 * @param {*} appId
 * @param {*} intfId
 * @param {*} jobId
 */
export const getSnap = (appId, intfId, jobId) =>
  axios({
    url: `/zh-cn/stat/task/${appId}/cap/${intfId}/${jobId}/`,
    method: 'post',
    data: {},
  });

// 分时交易
/**
 * 获取分时交易信息
 * @param {*} appId
 * @param {*} intfId
 * @param {*} bodyForm
 */
export const getTimeTrade = (appId, intfId, data) =>
  axios({
    url: '/zh-cn/stat/gettimetrade/',
    method: 'post',
    data,
  });
// 分时交易!

// 多维统计
/**
 * 获取多维统计选择项
 * @param {*} appId
 * @param {*} intfId
 */
export const getAllDims = (appId, intfId) =>
  axios({
    url: `/zh-cn/stat/${appId}/multidimension/${intfId}/data/`,
    method: 'get',
  });

/**
 * 获得多维统计信息
 * @param {*} appId
 * @param {*} intfId
 * @param {*} formData
 */
export const getMulti = (appId, intfId, dataObj) =>
  axios({
    url: `/zh-cn/stat/${appId}/multidimension/${intfId}/`,
    method: 'post',
    data: dataObj,
  });
/**
 * 多维统计导出CSV
 * @param {*} appId
 * @param {*} intfId
 * @param {*} query
 */
export const exportMulti = (appId, intfId, query) => `/zh-cn/stat/${appId}/multidimension/${intfId}/export/?${joinQuery(query)}`;
// 多维统计！

// 业务追踪, 共计7个
/**
 * 获取业务追踪选项
 * @param {*} appId
 * @param {*} intfId
 */
export const trackInit = (appId, intfId) => axios({
  url: `/zh-cn/transtrack/${appId}/${intfId}/init/`,
  method: 'get',
});

/**
 * 获取业务追踪job-id
 * @param {*} appId
 * @param {*} intfId
 * @param {*} body
 */
export const getTrackId = (appId, intfId, body) => axios({
  url: `/zh-cn/transtrack/${appId}/${intfId}/`,
  method: 'post',
  data: body,
});

/**
 * 获取jb-id状态
 * @param {*} id
 */
export const getTrackState = jobId =>
  axios({
    url: `/zh-cn/transtrack/${jobId}/state/`,
    method: 'get',
  });

/**
 * 获取业务追踪信息
 * @param {*} appId
 * @param {*} intfId
 * @param {*} queryObj
 */
export const getTrackTable = (appId, intfId, query) =>
  axios({
    url: `/zh-cn/transtrack/${appId}/${intfId}/result/`,
    method: 'get',
    data: query,
  });

/**
 * 取消业务追踪jon-id
 * @param {*} jobId
 */
export const cancelTrack = jobId => axios({
  url: `/zh-cn/transtrack/${jobId}/cancel/`,
  method: 'get',
});

/**
 * 删除业务追踪jon-id
 * @param {*} jobId
 */
export const deleteTrack = jobId => axios({
  url: `/zh-cn/transtrack/${jobId}/delete/`,
  method: 'post',
});


/**
 * 导出业务追踪csv
 * @param {*} appId
 * @param {*} intfId
 * @param {*} query
 */
export const exportTrack = (appId, intfId, query) => `/zh-cn/transtrack/${appId}/${intfId}/export/?${joinQuery(query)}`;
// 业务追踪! cancel与delete建议合并

// 单笔交易
/**
 * 获取单笔详情选项
 * @param {*} appId
 * @param {*} intfId
 */
export const singleInit = (appId, intfId) =>
  axios({
    url: `/zh-cn/transtrack/${appId}/${intfId}/single/init/`,
    method: 'get',
  });

/**
 * 获取单笔详情job-id
 * @param {*} appId
 * @param {*} intfId
 * @param {*} type:single当前交易|correlation关联交易(无效)
 * @param {*} body
 */
export const getSingleId = (appId, intfId, type, body) =>
  axios({
    url: `/zh-cn/transtrack/${appId}/${intfId}/${type}`,
    method: 'post',
    data: body,
  });

/**
 * 获取单笔详情job-id状态
 * @param {*} singleI
 */
// export const getSingleState = singleId =>
//   axios({
//     url: `/zh-cn/transtrack/${singleId}/state/`,
//     method: 'post',
//     data: {
//       '?_': new Date().getTime(),
//     },
//   });

/**
 * 获取单笔详情信息
 * @param {*} appId
 * @param {*} intfId
 * @param {*} queryObj
 */
export const getSingleTable = (appId, intfId, query) =>
  axios({
    url: `/zh-cn/transtrack/${appId}/${intfId}/single/result/`,
    method: 'get',
    data: query,
  });

export const getCorrelation = (appId, intfId, body) => axios({
  url: `/zh-cn/transtrack/${appId}/${intfId}/correlation/`,
  method: 'post',
  data: body,
});

/**
 * 导出单笔交易CSV
 * @param {*} appId
 * @param {*} intfId
 * @param {*} type:single当前交易|correlation关联交易
 * @param {*} query
 */
export const exportSingle = (appId, intfId, type, query) => `/zh-cn/transtrack/${appId}/${intfId}/${type}/export/?${joinQuery(query)}`;
// 单笔交易!

/**
 * 取消关联交易
 * @param {*} jobId
 */
export const cancelCorrelation = () => axios({
  url: '/zh-cn/transtrack/detail_cancel/',
  method: 'get',
});

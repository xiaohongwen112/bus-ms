import axios from '@/helpers/axios';
import { genV4 as uuidV4 } from 'uuidjs';

/**
 * 获取拓扑图
 * @param {*} appName
 */
export const getDataPath = appName =>
  axios({
    url: '/zh-cn/newdatapath/',
    method: 'post',
    data: {
      app_name: appName,
    },
    loading: true,
  });

/**
 * 保存拓扑图
 * @param {*} appName
 * @param {*} datapath
 */
export const saveDataPath = (appName, datapath, scheduleData) => {
  const taskId = uuidV4().hexString;
  return axios({
    url: `/zh-cn/${appName}/datapath/save/`,
    method: 'post',
    data: {
      datapath: JSON.stringify(datapath),
      task_id: taskId,
      schedule: JSON.stringify(scheduleData),
    },
    loading: true,
  });
};

/**
 * 应用
 * @param {*} appName
 * @param {*} datapath
 * @param {*} taskId
 */
export const applyDataPath = (appName, datapath, taskId, scheduleData) => axios({
  url: `/zh-cn/${appName}/apply/`,
  method: 'post',
  data: {
    datapath: JSON.stringify(datapath),
    task_id: taskId,
    schedule: JSON.stringify(scheduleData),
  },
  errorTip: false,
});

/**
 * 导出拓扑图
 * @param {*} appName
 */
export const exportDataPath = appName => axios({
  url: `/zh-cn/${appName}/datapath/export/`,
  method: 'post',
  data: {
    state: 'edit',
  },
});

/**
 * 获取监控时段
 * @param {*} appName
 */
// export const getWorkTime = appName => axios({
//   url: `/zh-cn/${appName}/worktime/get/`,
//   method: 'get',
// });

/**
 * 设置监控时段
 * @param {*} appName
 * @param {*} schedule
 * @param {*} type
 */
// export const saveWorkTime = (appName, schedule, type) => axios({
//   url: `/zh-cn/${appName}/worktime/save/`,
//   method: 'post',
//   data: {
//     data: JSON.stringify(schedule),
//     type,
//   },
// });

/**
 * 获取业务日程
 * @param {*} appName
 */
export const getBusiness = appName => axios({
  url: `/zh-cn/${appName}/businesstime/get/`,
  method: 'get',
});

/**
 * 获取ip映射列表
 * @param {*} ipObj
 */
// export const saveIp = ipObj => axios({
//   url: '/zh-cn/spd/newipjson/',
//   method: 'post',
//   data: {
//     ipsinfo: JSON.stringify(ipObj),
//   },
// });

/**
 * 删除ip
 * @param {*} ip
 * @param {*} type
 */
export const delIp = (ip, type) => axios({
  url: '/zh-cn/spd/deleteip/',
  method: 'post',
  data: {
    ip,
    type,
  },
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
      auto_baseline: true,
    },
  });

/**
 * 获取告警-模板下拉列表
 */
export const getAlertTemplateList = () =>
  axios({
    url: '/zh-cn/getalerttemplate/',
    method: 'get',
  });

/**
 * 获取告警-联系人下拉列表
 */
export const getAlertContact = () =>
  axios({
    url: '/zh-cn/getalertcontact/',
    method: 'get',
  });

/**
 * 获取告警-联系人分组下拉列表
 */
export const getAlertGroup = () =>
  axios({
    url: '/zh-cn/getalertcontactgroup/',
    method: 'get',
  });

export const ipInfos = () => axios({
  url: '/zh-cn/ipinfos/',
  method: 'get',
});

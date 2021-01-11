import axios from 'axios';
import jsCookie from 'js-cookie';
import { genV4 as uuidV4 } from 'uuidjs';

import { buildUrlencodedData } from '@/helpers/utils';

import devServerConfig from '@/../config/devServer';

let token = '';
if (process.env.NODE_ENV === 'development') {
  jsCookie.set('csrftoken', devServerConfig.csrftoken);
  token = devServerConfig.csrftoken;
} else {
  token = jsCookie.get('csrftoken');
}

export const getDataPath = appName =>
  axios({
    url: '/zh-cn/newdatapath/',
    method: 'post',
    data: {
      app_name: appName,
      csrfmiddlewaretoken: token,
    },
    transformRequest: [buildUrlencodedData],
  });

export const saveDataPath = (appName, datapath) => {
  const taskId = uuidV4().hexString;
  return axios({
    url: `/zh-cn/${appName}/datapath/save/`,
    method: 'post',
    data: {
      datapath: JSON.stringify(datapath),
      task_id: taskId,
      csrfmiddlewaretoken: token,
    },
    transformRequest: [buildUrlencodedData],
  });
};


export const applyDataPath = (appName, datapath, taskId) => axios({
  url: `/zh-cn/${appName}/apply/`,
  method: 'post',
  data: {
    datapath: JSON.stringify(datapath),
    task_id: taskId,
    csrfmiddlewaretoken: token,
  },
  transformRequest: [buildUrlencodedData],
});

export const exportDataPath = appName => axios({
  url: `/zh-cn/${appName}/datapath/export/`,
  method: 'post',
  data: {
    state: 'edit',
  },
  transformRequest: [buildUrlencodedData],
});

export const getWorkTime = appName => axios({
  url: `/zh-cn/${appName}/worktime/get/`,
  method: 'get',
});


export const saveWorkTime = (appName, schedule, type) => axios({
  url: `/zh-cn/${appName}/worktime/save/`,
  method: 'post',
  data: {
    data: JSON.stringify(schedule),
    type,
    csrfmiddlewaretoken: token,
  },
  transformRequest: [buildUrlencodedData],
});

export const saveIp = ipObj => axios({
  url: '/zh-cn/spd/newipjson/',
  method: 'post',
  data: {
    ipsinfo: JSON.stringify(ipObj),
    csrfmiddlewaretoken: token,
  },
  transformRequest: [buildUrlencodedData],
});

export const delIp = (ip, type) => axios({
  url: '/zh-cn/spd/deleteip/',
  method: 'post',
  data: {
    ip,
    type,
    csrfmiddlewaretoken: token,
  },
  transformRequest: [buildUrlencodedData],
});


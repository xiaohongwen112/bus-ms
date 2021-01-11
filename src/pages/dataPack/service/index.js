/* eslint-disable no-unused-vars */

import axios from '@/helpers/axios';
import jsCookie from 'js-cookie';
import { genV4 as uuidV4 } from 'uuidjs';

import { buildUrlencodedData } from '@/helpers/utils';

import jsonValidate from '@/helpers/jsonSchema';
import spdMapDataSchema from '@/helpers/jsonSchema/schemas/spdMapData';

import devServerConfig from '@/../config/devServer';

let token = '';
if (process.env.NODE_ENV === 'development') {
  jsCookie.set('csrftoken', devServerConfig.csrftoken);
  token = devServerConfig.csrftoken;
} else {
  token = jsCookie.get('csrftoken');
}

/* eslint-enable no-unused-vars */
/**
 * 获取数据源
 * @param {*} map
 */
export const getDataSource = map => axios({
  url: `/zh-cn/spd/${map}/overview/datasourcedata/`,
  method: 'get',
  params: {
  },
});

/**
 * 获取数据源信息
 * @param {*} map
 * @param {*} datasource
 */
export const getMapData = (map, datasource) => axios({
  url: `/zh-cn/spd/${map}/overview/mapdata/`,
  method: 'post',
  data: {
    datasource,
  },
  transformRequest: [buildUrlencodedData],
}).then((res) => { // eslint-disable-line
  jsonValidate('spdMapDataSchema', spdMapDataSchema, res.data);
  return res;
});

/**
 * 保存数据源信息
 * @param {*} map
 * @param {*} datasource
 * @param {*} ipData
 */
export const saveIpName = (map, datasource, ipData) => axios({
  url: `/zh-cn/spd/${map}/save/`,
  method: 'post',
  data: {
    map: JSON.stringify(ipData),
    datasource,
    csrfmiddlewaretoken: token,
  },
  transformRequest: [buildUrlencodedData],
});

/**
 * 设置快照名
 */
export const queryNewSnapshotName = () => axios({
  url: '/zh-cn/spd/newname/snapshot/',
  method: 'post',
  data: {
  },
  transformRequest: [buildUrlencodedData],
});

/**
 * 创建快照
 */
export const createSnapshot = (map, mapData, mapPng) => axios({
  url: `/zh-cn/spd/${map}/createsnapshot/`,
  method: 'post',
  data: {
    map: JSON.stringify(mapData),
    map_png: mapPng,
    csrfmiddlewaretoken: token,
  },
  transformRequest: [buildUrlencodedData],
});

/**
 * 获取所有快照信息
 * @param {*} map
 */
export const getMapSnapshots = map => axios({
  url: `/zh-cn/spd/${map}/overview/snapshotdata/`,
  method: 'get',
});

export default undefined;

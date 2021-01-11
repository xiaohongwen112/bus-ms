/* eslint-disable no-unused-vars */

import axios from '@/helpers/axios';
import {
  getDataPath,
  saveDataPath,
  // getWorkTime,
} from '@/pages/editTopo/service';

/* eslint-enable no-unused-vars */

/**
 * 获取相关intf
 */
export const getRules = () => axios({
  url: '/zh-cn/baseConfig/alertConfig/ruleList/relateintfs/',
  method: 'get',
});

/**
 * 获取所有app
 */
export const getAllApps = () => axios({
  url: '/zh-cn/baseConfig/alertConfig/ruleList/all_apps/',
  method: 'get',
});

/**
 * 获取规则列表数据
 */
export const getRulesData = () => axios({
  url: '/zh-cn/rules/rulesdata/',
  method: 'get',
});

/**
 * 编辑规则模板
 * @param {*} data
 */
export const saveRulesData = data => axios({
  url: '/zh-cn/rules/rulesedit/',
  method: 'post',
  data: {
    rule_data: JSON.stringify(data),
  },
});

/**
 * 应用
 * @param {*} appName
 * @param {*} datapath
 * @param {*} taskId
 */
export const applyDataPath = (appName, datapath, taskId) => axios({
  url: `/zh-cn/${appName}/apply/`,
  method: 'post',
  data: {
    datapath: JSON.stringify(datapath),
    task_id: taskId,
  },
});

/**
 * 删除规则模板
 * @param {*} id
 */
export const removeRule = id => axios({
  url: '/zh-cn/rules/rulesdelete/',
  method: 'post',
  data: {
    rule_id: id,
  },
});

/**
 * 获取相关intf
 */
export const getRelated = () => axios({
  url: '/zh-cn/baseConfig/alertConfig/ruleList/relateintfs/',
  method: 'get',
});

export {
  getDataPath,
  saveDataPath,
  // getWorkTime,
};

export default undefined;

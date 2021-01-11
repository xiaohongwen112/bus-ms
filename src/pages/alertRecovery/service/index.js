import axios from '@/helpers/axios';

/**
 * 获取告警平均恢复时间数据
 */
export const getAlerts = () =>
  axios({
    url: '/zh-cn/maintain/',
    method: 'get',
  });

export const getTest = () => {};

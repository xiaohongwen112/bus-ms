import http from '@/helpers/cncc/axios';

export const getSummary = dataObj =>
http({
  url: '/zh-cn/stat/timeout/summary/data/',
  method: 'get',
  timeout: 30000,
  data: dataObj,
  // loading: false,
});

export const getTimout = dataObj =>
http({
  url: '/zh-cn/stat/timeout/details/',
  method: 'post',
  data: dataObj,
  timeout: 30000,
});

export const getSingle = dataObj =>
http({
  url: '/zh-cn/stat/timeout/single/',
  method: 'post',
  data: dataObj,
  timeout: 30000,
});

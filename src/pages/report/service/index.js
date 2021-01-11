import http from '@/helpers/axios';

/**
 * 获取报表主页面各报表状态（是否可点击查看）
 */
export const indexInit = () => http({
  url: '/zh-cn/report/gettimerange/',
  method: 'post',
  // loading: true,
});

/**
 * 获取日报表可选时间
 */
export const dayInit = () => http({
  url: '/zh-cn/report/gettimerange/',
  method: 'post',
  data: {
    report_type: 'DAY',
  },
});

/**
 * 获取月报表可选时间
 */
export const monthInit = () => http({
  url: '/zh-cn/report/gettimerange/',
  method: 'post',
  data: {
    report_type: 'MON',
  },
});

/**
 * 获取季度报表可选时间
 */
export const seaInit = () => http({
  url: '/zh-cn/report/gettimerange/',
  method: 'post',
  data: {
    report_type: 'SEA',
  },
});

/**
 * 获取年报表可选时间
 */
export const yearInit = () => http({
  url: '/zh-cn/report/gettimerange/',
  method: 'post',
  data: {
    report_type: 'YEAR',
  },
});

/**
 * 获取日报表数据
 * @param {*} timestamp
 */
export const getReport = timestamp =>
  http({
    url: '/zh-cn/report/dayreport/',
    method: 'post',
    data: {
      ts: timestamp,
    },
  });

/**
 * 获取月报表数据
 */
export const getMonReport = timestamp =>
  http({
    url: '/zh-cn/report/monreport/',
    method: 'post',
    data: {
      ts: timestamp,
    },
  });

/**
 * 获取季度报表数据
 * @param {*} timestamp
 */
export const getSeaReport = timestamp =>
  http({
    url: '/zh-cn/report/seareport/',
    method: 'post',
    data: {
      ts: timestamp,
    },
  });

/**
 * 获取年报表数据
 * @param {*} timestamp
 */
export const getYearReport = timestamp =>
  http({
    url: '/zh-cn/report/yearreport/',
    method: 'post',
    data: {
      ts: timestamp,
    },
  });

/**
 * 获取颗粒度
 * @param {*} data ts_start 开始时间 ts_end 结束时间
 */
export const getSpan = data =>
  http({
    url: '/zh-cn/report/custom/span/',
    method: 'post',
    data: {
      ...data,
    },
  });

/**
 * 获取自定报表数据
 * @param {*} span 颗粒度
 */
export const getCustomData = data =>
  http({
    url: '/zh-cn/report/custom/report/',
    method: 'post',
    data: {
      ...data,
    },
  });

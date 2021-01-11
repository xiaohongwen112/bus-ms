import axios from '@/helpers/axios';

/**
 * 交易总览页面加载数据获取
 * @param {*} data 数据信息
 */
export const getImportance = data =>
  axios({
    url: '/zh-cn/trade/getimportance/',
    method: 'post',
    loading: true,
    data: {
      search: data.search,
      app_name: data.appName,
    },
  });

/**
 * 交易总览卡片编辑操作-顺序改变
 * @param {*} data 数据信息
 */
export const editImportance = data =>
  axios({
    url: '/zh-cn/trade/editimportance/',
    loading: true,
    method: 'post',
    data,
  });

/**
 * 交易总览分页数据展示，根据屏幕大小分页和卡片排版
 * @param {*} data 数据信息
 */
export const getCardsData = data =>
  axios({
    url: '/zh-cn/trade/customjson/',
    method: 'post',
    loading: true,
    data: {
      page: data.page,
      size: data.size,
      search: data.search,
      app_name: data.appName,
    },
  });

/**
 * 交易总览点击红心关注
 * @param {*} data 关注信息
 */
export const setFollow = data =>
  axios({
    url: '/zh-cn/trade/follow/',
    method: 'post',
    data,
  });

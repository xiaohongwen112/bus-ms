import axios from '@/helpers/axios';

export const getData = () =>
  axios({
    url: '/zh-cn/alert/screenalert/getdata/',
    method: 'get',
    loading: false,
    errorTip: false,
    timeout: 9999999999999,
  });

export const updateAlert = data =>
  axios({
    url: `/zh-cn/alert/screenalert/update/?status=${data}`,
    method: 'get',
  });

export const setAlert = data =>
  axios({
    url: `/zh-cn/alert/screenalert/update/?ts_hold=${data}`,
    method: 'get',
  });

export const getAlertInfo = () =>
  axios({
    url: '/zh-cn/alertrealtime/',
    method: 'post',
  });

import axios from '@/helpers/axios';
import http from 'axios';
import token from '@/helpers/token';

/**
 * 获取当前协议列表信息
 */
export const getProtocolList = () =>
  axios({
    url: '/zh-cn/baseConfig/protocol/listprotocol/',
    method: 'get',
    loading: true,
  });

export const colneData = colneDataName => axios({
  url: '/zh-cn/baseConfig/protocol/clone/',
  method: 'post',
  data: {
    protocolname: colneDataName,
  },
  endTip: true,
  reload: true,
});

export const createProtocol = (createProtocolName, actionData, oldNames) => axios({
  url: '/zh-cn/baseConfig/protocol/create/',
  method: 'post',
  data: {
    protocol: JSON.stringify(createProtocolName),
    action: actionData,
    oldName: oldNames,
  },
  endTip: true,
  reload: true,
});

/**
 * 编辑协议
 */
export const editProtocol = editProtocolName => axios({
  url: '/zh-cn/baseConfig/protocol/edit/',
  method: 'post',
  data: {
    protocolname: editProtocolName,
  },
  loading: true,
});

/**
 * 删除协议
 */
export const deleteProtocol = editProtocolName => axios({
  url: '/zh-cn/baseConfig/protocol/delete/',
  method: 'post',
  data: {
    protocolname: editProtocolName,
  },
  reload: true,
});

/**
 * 协议详情
 */
export const detailProtocol = editProtocolName => axios({
  url: '/zh-cn/baseConfig/protocol/detail/',
  method: 'post',
  data: {
    protocolname: editProtocolName,
  },
  reload: true,
});

/**
 * 协议导出
 */
// eslint-disable-next-line no-shadow
export const downloadProtocol = (downloaName, downloaNameCompress) => http({
  url: '/zh-cn/baseConfig/protocol/download/',
  method: 'post',
  data: {
    protocolname: downloaName,
    compress: downloaNameCompress,
    csrfmiddlewaretoken: token,
  },
  csrfmiddlewaretoken: token,
  reload: true,
  responseType: 'blob',
});

/**
 * 协议搜索
 */
export const searchProtocol = searchName => axios({
  url: '/zh-cn/baseConfig/protocol/search/',
  method: 'post',
  data: {
    protocolname: searchName,
  },
  reload: true,
});

/**
 * 协议导入
 */
export const formProtocol = form =>
http({
  url: '/zh-cn/baseConfig/protocol/import/',
  method: 'post',
  data: form,
  endTip: true,
  reload: true,
});

export default undefined;

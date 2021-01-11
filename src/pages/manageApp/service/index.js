import axios from '@/helpers/axios';

/**
 * 进入业务墙的数据获取，业务名称app，intf，健康度，状态...
 */
export const getCardPath = () => axios({
  url: '/zh-cn/home/customjsonapps/',
  method: 'get',
  timeout: 30000,
});

/**
 * 业务墙业务的名称描述修改保存
 * @param {*} appName aPP名称
 * @param {*} data 修改的信息
 */
export const rename = (appName, data) => axios({
  url: `/zh-cn/center/${appName}/baseinfo/edit/`,
  method: 'post',
  data: {
    ...data,
  },
});

/**
 * 业务墙业务删除
 * @param {*} appName app名称
 */
export const deleteCard = appName => axios({
  url: `/zh-cn/${appName}/delete/`,
  method: 'post',
});

/**
 * 业务墙创建新的业务类型
 * @param {*} data 业务名称与名称描述
 */
export const createCard = data => axios({
  url: '/zh-cn/createapp/',
  method: 'post',
  data: {
    ...data,
  },
});


/**
 * 获取时间轴的告警信息
 * @param {*} name app名称
 * @param {*} date 时间戳
 */
export const getTimeAxis = (name, date) => axios({
  url: `/zh-cn/timeaxis/${name}/timeline/?ts=${date}`,
  method: 'get',
});

/**
 * 获取当前业务的交易路径信息
 * @param {*} name app名称
 */
export const getPathInfo = name => axios({
  url: `/zh-cn/center/${name}/tradingpath/get/`,
  method: 'get',
});

/**
 * 保存当前业务配置完成的交易路径信息
 * @param {*} name app名称
 * @param {*} data 交易路径数据信息
 */
export const storePathInfo = (name, data) => axios({
  url: `/zh-cn/center/${name}/tradingpath/save/`,
  method: 'post',
  data: {
    ...data,
  },
});

export const importApp = (file) => {
  const formdata1 = new FormData();
  formdata1.append('datapath_file', file);

  return axios({
    url: `/zh-cn/importapp/?datapath_file=${formdata1}`,
    method: 'post',
    headers: {
      processData: false, // 告诉jQuery不要去处理发送的数据
      contentType: false, // 告诉jQuery不要去设置Content-Type请求头
    },
    data: {
      formdata1,
    },
  });
};

/**
 * 可视化服务图设计应用
 * @param {*} appName app名称
 * @param {*} datapath 数据信息
 * @param {*} taskId uuid唯一标识
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
 * 业务墙业务日程点击基线配置按钮
 * @param {*} appName app名称
 */
export const baselineDefault = appName => axios({
  url: `/zh-cn/${appName}/appconfig/edit/data/`,
  method: 'post',
});

/**
 * 业务墙业务日程中基线配置初始化
 * @param {*} appName app名称
 */
export const baselineInit = appName => axios({
  url: `/zh-cn/${appName}/baseline/edit/data/`,
  method: 'post',
});

/**
 * 业务墙业务日程中点击基线配置确定是否采用业务起止
 * @param {*} appName app名称
 * @param {*} data 数据信息
 */
export const setBaseline = (appName, data) => axios({
  url: `/zh-cn/${appName}/appconfig/edit/save/`,
  method: 'post',
  data: {
    ...data,
  },
});

/**
 * 业务墙业务日程中基线配置开关是否开启
 * @param {*} appName app名称
 * @param {*} status 开启或者关闭状态
 */
export const setUseTime = (appName, status) => axios({
  url: `/zh-cn/${appName}/baseline/edit/data/`,
  method: 'post',
  data: {
    switch: status,
  },
});

/**
 * 业务墙业务日程中基线配置新建保存
 * @param {*} appName app名称
 * @param {*} data 数据信息
 */
export const addBaseline = (appName, data) => axios({
  url: `/zh-cn/${appName}/baseline/edit/save/`,
  method: 'post',
  data: {
    ...data,
  },
});

/**
 * 业务墙业务日程中基线配置编辑保存
 * @param {*} appName app名称
 * @param {*} data 数据信息
 */
export const editBaseline = (appName, data) => axios({
  url: `/zh-cn/${appName}/baseline/edit/save/`,
  method: 'post',
  data: {
    ...data,
  },
});

/**
 * 业务墙业务日程中基线配置删除
 * @param {*} appName app名称
 * @param {*} id 每天配置id
 */
export const deleteBaseLine = (appName, id) => axios({
  url: `/zh-cn/${appName}/baseline/edit/delete/`,
  method: 'post',
  data: {
    baseline_time_id: id,
  },
});

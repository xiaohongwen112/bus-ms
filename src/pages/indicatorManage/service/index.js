import http from '@/helpers/axios';

/**
 * 获取维度列表数据
 */
export const getDimension = data =>
  http({
    url: '/zh-cn/indicator/dimension/get/',
    method: 'post',
    loading: true,
    data: {
      ...data,
    },
  });

/**
 * 获取维度详情数据
 */
export const getDimenDetail = data =>
  http({
    url: '/zh-cn/indicator/dimension/detail/',
    method: 'post',
    loading: true,
    data: {
      ...data,
    },
  });

/**
 * 删除维度
 */
export const deleteDimension = data =>
  http({
    url: '/zh-cn/indicator/dimension/delete/',
    method: 'post',
    loading: true,
    data: {
      ...data,
    },
    endTip: true,
  });

/**
 * 编辑/新建维度
 */
export const updateDimension = data =>
  http({
    url: '/zh-cn/indicator/dimension/update/',
    method: 'post',
    loading: true,
    data: {
      ...data,
    },
    endTip: true,
  });

/**
 * 维度配置信息
 */
export const getDimenConfig = () =>
  http({
    url: '/zh-cn/indicator/dimension/info/',
    method: 'get',
    loading: true,
  });

/**
 * 名称唯一性校验
 */
export const checkParameter = data =>
  http({
    url: '/zh-cn/indicator/check/parameter/',
    method: 'post',
    data: {
      ...data,
    },
    errorTip: false,
  });

/**
 * 获取指标列表数据
 */
export const getIndicator = data =>
  http({
    url: '/zh-cn/indicator/manager/get/',
    method: 'post',
    loading: true,
    data: {
      ...data,
    },
  });

/**
 * 获取指标配置详情
 */
export const getIndiConfig = () =>
  http({
    url: '/zh-cn/indicator/manager/info/',
    method: 'get',
    loading: true,
  });

/**
 * 删除指标
 */
export const deleteIndicator = data =>
  http({
    url: '/zh-cn/indicator/manager/delete/',
    method: 'post',
    loading: true,
    data: {
      ...data,
    },
    endTip: true,
    reload: true,
  });

/**
 * 获取指标详情
 */
export const getIndiDetail = data =>
  http({
    url: '/zh-cn/indicator/manager/detail/',
    method: 'post',
    loading: true,
    data: {
      ...data,
    },
  });

/**
 * 编辑/新建指标
 */
export const updateIndicator = data =>
  http({
    url: '/zh-cn/indicator/manager/update/',
    method: 'post',
    loading: true,
    data: {
      ...data,
    },
    endTip: true,
    reload: true,
  });

/**
 * 获取基线配置详情
 */
export const getBaseline = () =>
  http({
    url: '/zh-cn/indicator/baseline/get_data/',
    method: 'get',
    loading: true,
  });

/**
 * 基线配置更新信息
 */
export const updateBaseline = data =>
  http({
    url: '/zh-cn/indicator/baseline/update_data/',
    method: 'post',
    loading: true,
    data: {
      ...data,
    },
    endTip: true,
  });

/**
 * 获取业务墙健康度配置的信息
 */
export const getHealth = () =>
  http({
    url: '/zh-cn/center/healthconfig/data/',
    method: 'get',
    loading: true,
  });

/**
 *
 * 更新健康度配置
 */
export const setHealth = data =>
  http({
    url: '/zh-cn/center/healthconfig/',
    method: 'post',
    data: {
      health: JSON.stringify(data.health),
      weight: JSON.stringify(data.weight),
    },
    loading: true,
  });

export default undefined;

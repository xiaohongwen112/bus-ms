import http from '@/helpers/axios';

/**
 * 获取当前用户信息
 */
export const getCurrentuser = () =>
  http({
    url: '/zh-cn/accounts/currentuser/',
    method: 'post',
    timeout: 9999999999,
  });

/**
 * 获取域管理表格数据
 * @param {*} data
 */
export const retrieveDomain = data =>
  http({
    url: '/zh-cn/accounts/domain/retrieve_domain/',
    method: 'post',
    data,
  });

/**
 * 删除域
 * @param {*} data
 */
export const deleteDomain = data =>
  http({
    url: '/zh-cn/accounts/domain/delete_domain/',
    method: 'post',
    data,
    endTip: true,
  });

/**
 * 删除/编辑域
 * @param {*} isCreat
 * @param {*} data
 */
export const creatDomain = (isCreat, data) =>
  http({
    url: `/zh-cn/accounts/domain/${isCreat ? 'create_domain' : 'update_domain'}/`,
    method: 'post',
    data,
    endTip: true,
    // reload: true,
  });

/**
 * 获取域新建/编辑域原始数据
 * @param {*} data
 */
export const getEditInfo = data =>
  http({
    url: '/zh-cn/accounts/domain/get_edit_info/',
    method: 'get',
    data,
  });

/**
 * 校验域名称唯一性
 * @param {*} data
 */
export const checkDomain = data =>
  http({
    url: '/zh-cn/accounts/domain/check_data/',
    method: 'post',
    data,
    errorTip: false,
  });

/**
 * 获取所有角色
 * @param {*} data: 1.page 当前页 2.size 每页多少条 3.query 搜索关键字
 */
export const getRoleList = data =>
  http({
    url: '/zh-cn/accounts/allroles/get/',
    method: 'post',
    data,
  });

/**
 * 删除角色
 * @param {*} data roles:角色nums
 */
export const deleteRole = data =>
  http({
    url: '/zh-cn/accounts/role/delete/',
    method: 'post',
    data,
    endTip: true,
  });

/**
 * 获取权限信息
 * @param {*} data num:角色num
 */
export const getPerssion = data =>
  http({
    url: '/zh-cn/accounts/role/edit/',
    method: 'post',
    data,
  });

/**
 * 校验角色名称是否符合规范
 * @param {*} data name: 角色名称
 */
export const checkName = data =>
  http({
    url: '/zh-cn/accounts/rolename/checkout/',
    method: 'post',
    data,
    errorTip: false,
  });

/**
 * 新建、编辑保存操作
 * @param {*} data
 */
export const saveChange = data =>
  http({
    url: '/zh-cn/accounts/role/save/',
    method: 'post',
    data,
    endTip: true,
  });

/**
 * 获取角色和域列表
 */
export const getDomainRole = () =>
  http({
    url: '/zh-cn/accounts/domainrole/getall/',
    method: 'get',
  });

/**
 * 获取用户列表
 * @param {*} id
 */
export const getUserList = data =>
  http({
    url: '/zh-cn/accounts/getallusers/',
    method: 'post',
    data,
  });

/**
 * 删除用户
 * @param {*} data roles:角色nums
 */
export const deleteUser = data =>
  http({
    url: '/zh-cn/accounts/user/delete/',
    method: 'post',
    data,
    endTip: true,
  });

/**
 * 校验用户名唯一性
 * @param {*} data
 */
export const checkUser = data =>
  http({
    url: '/zh-cn/accounts/user/check/',
    method: 'post',
    data,
    errorTip: false,
  });

/**
 * 获取用户详情
 * @param {*} id
 */
export const getUserEditInfo = data =>
  http({
    url: '/zh-cn/accounts/user/edit/',
    method: 'post',
    data,
  });

/**
 * 获取用户资料
 */
export const getUserDetail = () =>
  http({
    url: '/zh-cn/accounts/get/userdetails/',
    method: 'get',
  });

/**
 * 用户资料-修改密码
 */
export const editPassword = data =>
  http({
    url: '/zh-cn/accounts/password/change/',
    method: 'post',
    data,
    endTip: true,
  });


/**
 * 保存用户更改
 */
export const saveUserChange = data =>
  http({
    url: '/zh-cn/accounts/user/save/',
    method: 'post',
    data,
    endTip: true,
  });

/**
 * 保存用户更改-用户资料页面
 */
export const saveDataChange = data =>
  http({
    url: '/zh-cn/accounts/userself/save/',
    method: 'post',
    data,
    endTip: true,
  });

export default undefined;

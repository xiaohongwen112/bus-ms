import http from '@/helpers/axios';

import {
  getDataPath,
  saveDataPath,
  // getWorkTime,
} from '@/pages/editTopo/service';


export const getMsgConfig = type =>
  http({
    url: '/zh-cn/baseConfig/alertConfig/notification/getconfig/',
    method: 'get',
    data: {
      server_type: type,
    },
    loading: true,
  });

export const postMsgConfig = data =>
  http({
    url: '/zh-cn/baseConfig/alertConfig/notification/updateconfig/',
    method: 'post',
    data,
    errorTip: false,
  });

export const testMsgConnect = data =>
  http({
    url: '/zh-cn/baseConfig/alertConfig/notification/connecttest/',
    method: 'post',
    data,
    endTip: true,
    // errorTip: false,
  });

export const getPeopleList = data =>
  http({
    url: '/zh-cn/baseConfig/alertConfig/getcontact/',
    method: 'post',
    data,
    loading: true,
  });

export const addPeople = data =>
  http({
    url: '/zh-cn/baseConfig/alertConfig/newcontact/',
    method: 'post',
    data,
    endTip: true,
  });

export const delPeople = data =>
  http({
    url: '/zh-cn/baseConfig/alertConfig/deletecontact/',
    method: 'post',
    data,
    loading: true,
  });

export const editPeople = data =>
  http({
    url: '/zh-cn/baseConfig/alertConfig/editcontact/',
    method: 'post',
    data,
    endTip: true,
  });

export const changePeopleSwitch = data =>
  http({
    url: '/zh-cn/baseConfig/alertConfig/contactswitch/',
    method: 'post',
    data,
  });

export const getContactName = data =>
  http({
    url: '/zh-cn/baseConfig/alertConfig/getcontactname/',
    method: 'post',
    data,
  });

export const checkContact = data =>
  http({
    url: '/zh-cn/baseConfig/alertConfig/checkcontact/',
    method: 'post',
    data,
    endTip: false,
    errorTip: false,
  });

export const getAllName = data =>
  http({
    url: '/zh-cn/baseConfig/alertConfig/getallcontactname/',
    method: 'get',
    data,
  });

export const getEditName = data =>
  http({
    url: '/zh-cn/baseConfig/alertConfig/getcontactname/',
    method: 'post',
    data,
  });

export const createGroup = data =>
  http({
    url: '/zh-cn/baseConfig/alertConfig/newgroup/',
    method: 'post',
    data,
    endTip: true,
  });

export const getGroup = data =>
  http({
    url: '/zh-cn/baseConfig/alertConfig/querygroup/',
    method: 'post',
    data,
    loading: true,
  });

export const removePeople = data =>
  http({
    url: '/zh-cn/baseConfig/alertConfig/delgroupmember/',
    method: 'post',
    data,
    endTip: true,
  });

export const getGroupList = data =>
  http({
    url: '/zh-cn/baseConfig/alertConfig/getcontactgroup/',
    method: 'get',
    data,
  });

export const addToGroup = data =>
  http({
    url: '/zh-cn/baseConfig/alertConfig/addcontactgroup/',
    method: 'post',
    data,
    endTip: true,
  });

export const editGroup = data =>
  http({
    url: '/zh-cn/baseConfig/alertConfig/editgroup/',
    method: 'post',
    data,
    endTip: true,
  });

export const delGroup = data =>
  http({
    url: '/zh-cn/baseConfig/alertConfig/deletegroup/',
    method: 'post',
    data,
    endTip: true,
  });

export const checkGroupName = data =>
  http({
    url: '/zh-cn/baseConfig/alertConfig/checkgroup/',
    method: 'post',
    data,
    endTip: false,
    errorTip: false,
  });

  // ===================================== 告警模板
/**
 * 获取告警模板表格数据
 * @param {*} data
 */
export const getTemplateTable = data =>
http({
  url: '/zh-cn/baseConfig/alertConfig/gettemplate/',
  method: 'post',
  data,
});

/**
 * 删除告警模板
 * @param {*} data
 */
export const deleteTemplate = data =>
  http({
    url: '/zh-cn/baseConfig/alertConfig/deletetemplate/',
    method: 'post',
    data,
    endTip: true,
  });

  /**
 * 新增/编辑保存告警模板
 * @param {*} isCreat
 * @param {*} data
 * '/zh-cn/baseConfig/alertConfig/newtemplate/'
 * '/zh-cn/baseConfig/alertConfig/edittemplate/'
 */
export const saveTemplate = (data, isCreat) =>
http({
  url: `/zh-cn/baseConfig/alertConfig/${isCreat ? 'newtemplate' : 'edittemplate'}/`,
  method: 'post',
  data,
  endTip: true,
});

/**
 * 克隆告警模板
 * @param {*} data
 */
export const cloneTemplate = data =>
http({
  url: '/zh-cn/baseConfig/alertConfig/clonetemplate/',
  method: 'post',
  data,
  endTip: true,
});

/**
 * 获取域新建/编辑告警模板原始数据
 * @param {*} data
 */
export const getTemplateItem = data =>
  http({
    url: '/zh-cn/baseConfig/alertConfig/gettemplatedetail/',
    method: 'get',
    data,
  });


  /**
 * 校验告警模板名称唯一性
 * @param {*} data
 */
export const checkTemplateName = data =>
http({
  url: '/zh-cn/baseConfig/alertConfig/checktemplate/',
  method: 'post',
  data,
  errorTip: false,
});

  // 告警模板=======================end

  /* eslint-enable no-unused-vars */
  /**
   * 获取相关intf
   */
export const getRules = () => http({
  url: '/zh-cn/baseConfig/alertConfig/ruleList/relateintfs/',
  method: 'get',
});
/**
 * 获取所有app
 */
export const getAllApps = () => http({
  url: '/zh-cn/baseConfig/alertConfig/ruleList/all_apps/',
  method: 'get',
});

/**
 * 获取规则列表数据
 */
export const getRulesData = () => http({
  url: '/zh-cn/rules/rulesdata/',
  method: 'get',
});

/**
 * 编辑规则模板
 * @param {*} data
 */
export const saveRulesData = data => http({
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
export const applyDataPath = (appName, datapath, taskId) => http({
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
export const removeRule = id => http({
  url: '/zh-cn/rules/rulesdelete/',
  method: 'post',
  data: {
    rule_id: id,
  },
});

/**
 * 获取相关intf
 */
export const getRelated = () => http({
  url: '/zh-cn/baseConfig/alertConfig/ruleList/relateintfs/',
  method: 'get',
});

export {
  getDataPath,
  saveDataPath,
  // getWorkTime,
};

export default undefined;

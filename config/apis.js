module.exports = [{
    path: '/zh-cn/newdatapath/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/manager/update_license/',
    method: 'post',
    isJson: false,
    isfile: true,
  },
  {
    path: '/zh-cn/get_token/',
    method: 'get',
  },
  {
    path: '/zh-cn/manager/about/',
    method: 'get',
  },
  {
    path: '/zh-cn/manager/check_license_status/',
    method: 'get',
  },
  {
    path: '/zh-cn/getalerttemplate/',
    method: 'get',
  },
  {
    path: '/zh-cn/getalertcontact/',
    method: 'get',
  },
  {
    path: '/zh-cn/getalertcontactgroup/',
    method: 'get',
  },
  {
    path: '/zh-cn/:appId/datapath/save',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/:appId/datapath/export/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/:appId/apply',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/events/task/:taskId/',
    method: 'get',
    type: 'eventsource',
    events: [
      'ack',
      'event',
      'eof',
    ],
  },
  // {
  //   path: '/zh-cn/:appId/worktime/get/',
  //   method: 'get',
  // },
  // {
  //   path: '/zh-cn/:appId/worktime/get/', // 暂时弃用
  //   method: 'post',
  //   isJson: false,
  // },
  // {
  //   path: '/zh-cn/:appId/worktime/save/',
  //   method: 'post',
  //   isJson: false,
  // },
  // {
  //   path: '/zh-cn/spd/newipjson/',
  //   method: 'post',
  //   isJson: false,
  // },
  {
    path: '/zh-cn/spd/deleteip/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/overview/:appId/:intfId/detailview',
    method: 'get',
  },
  {
    path: '/zh-cn/overview/:appId/alertlist/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/overview/:appId/newoverview/',
    method: 'get',
  },
  {
    path: '/zh-cn/overview/:appId/newoverview/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/spd/overview/map/getdatasource',
    method: 'get',
  },
  {
    path: '/zh-cn/manager/selfcheck/data',
    method: 'get',
    type: 'eventsource',
    events: [
      'self_check',
    ],
  },
  {
    path: '/zh-cn/basisinfo/',
    method: 'get',
    type: 'eventsource',
    events: [
      'sysstatus',
    ],
  },
  {
    path: '/zh-cn/getbaselinetrade/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/manager/server/DS1/restart/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/manager/cleardata/',
    method: 'get',
  },
  {
    path: '/zh-cn/manager/server/DS1/restore_sp_state',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/manager/server/DS1/status/',
    method: 'get',
  },
  {
    path: '/zh-cn/systime',
    method: 'get',
  },
  {
    path: '/zh-cn/home/getname/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/manager/custom/changename',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/getsound/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/home/gethealth/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/home/globaltrade/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/alertrealtime/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/home/getalert/',
    method: 'get',
  },
  {
    path: '/zh-cn/area/monitor/mapdata/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/alert/changestatus/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/soundconfig/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/:appId/datapath/getjson/',
    method: 'get',
  },
  {
    path: '/zh-cn/stat/:appId/cap/:intfId/panel/data/',
    method: 'get',
  },
  {
    path: '/zh-cn/stat/:appId/cap/:intfId/dimensions/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/stat/gettimetrade/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/stat/task/:appId/cap/:intfId/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/stat/task/:appId/cap/:intfId/:jobId/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/stat/:appId/multidimension/:intfId/data/',
    method: 'get',
  },
  {
    path: '/zh-cn/stat/:appId/multidimension/:intfId/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/stat/:appId/multidimension/:intfId/export/',
    method: 'get',
  },
  {
    path: '/zh-cn/transtrack/:appId/:intfId/init/',
    method: 'get',
  },
  {
    path: '/zh-cn/transtrack/:appId/:intfId/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/transtrack/:transtrackId/state/',
    method: 'get'
  },
  {
    path: '/zh-cn/transtrack/:transtrackId/state/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/transtrack/:transtrackId/cancel/',
    method: 'get',
  },
  {
    path: '/zh-cn/transtrack/detail_cancel/',
    method: 'get',
  },
  {
    path: '/zh-cn/transtrack/:transtrackId/delete/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/transtrack/:appId/:intfId/result/',
    method: 'get',
  },
  {
    path: '/zh-cn/transtrack/:appId/:intfId/export/',
    method: 'get',
  },
  {
    path: '/zh-cn/transtrack/:appId/:intfId/single/init/',
    method: 'get',
  },
  {
    path: '/zh-cn/transtrack/:appId/:intfId/single/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/transtrack/:appId/:intfId/single/result/',
    method: 'get',
  },
  {
    path: '/zh-cn/transtrack/:appId/:intfId/correlation/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/transtrack/:appId/:intfId/single/export/',
    method: 'get',
  },
  {
    path: '/zh-cn/transtrack/:appId/:intfId/correlation/export/',
    method: 'get',
  },
  {
    path: '/zh-cn/timeaxis/:appId/timeline/',
    method: 'get',
  },
  {
    path: '/zh-cn/alert/centerdata/',
    method: 'get',
  },
  {
    path: '/zh-cn/alert/query/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/alert/getquery/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/alert/screenalert/getdata/',
    method: 'get',
  },
  {
    path: '/zh-cn/alert/export/',
    method: 'get',
  },
  {
    path: '/zh-cn/alert/screenalert/update/',
    method: 'get',
  },
  {
    path: '/zh-cn/maintain/',
    method: 'get',
  },
  {
    path: '/zh-cn/trade/getimportance/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/trade/customjson/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/trade/editimportance/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/trade/follow/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/manager/about',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/manager/checkversion/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/manager/update/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/manager/bodyfile/switch',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/manager/bodyfile/setswitch/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/manager/data/storage/storeinfo/',
    method: 'get',
  },
  {
    path: '/zh-cn/manager/data/storage/data/',
    method: 'get',
  },
  {
    path: '/zh-cn/manager/data/storage/DS1/update',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/manager/backup/historyconfig/',
    method: 'get',
  },
  {
    path: '/zh-cn/manager/backup/getconfig/',
    method: 'get',
  },
  {
    path: '/zh-cn/manager/backup/getpath/',
    method: 'get',
  },
  {
    path: '/zh-cn/manager/backup/checkremote/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/manager/backup/saveconfig/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/manager/backup/save/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/manager/backup/delflag/',
    method: 'get',
  },
  {
    path: '/zh-cn/manager/backup/get/',
    method: 'get',
    type: 'eventsource',
    events: [
      'eof', 'transfer_bar', 'compress_bar',
    ],
  },
  {
    path: '/zh-cn/spd/:mapName/overview/mapdata/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/spd/:mapName/overview/datasourcedata/',
    method: 'get',
  },
  {
    path: '/zh-cn/home/gethistoryhealth/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/accounts/login/',
    method: 'post',
    isJson: false,
  },
  // {
  //   path: '/zh-cn/accounts/logout/',
  //   method: 'get',
  // },
  {
    path: '/zh-cn/accounts/currentuser/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/accounts/manage/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/accounts/create/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/accounts/delete/:adminName/',
    method: 'get',
  },
  {
    path: '/zh-cn/accounts/userinfo/change/:adminName',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/manager/warnconfig/data/',
    method: 'get',
  },
  {
    path: '/zh-cn/manager/warnconfig/update/',
    method: 'get',
  },
  {
    path: '/zh-cn/area/monitor/globaltradeinfo/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/spd/newname/snapshot/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/spd/:mapName/createsnapshot/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/spd/:mapName/save/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/home/customjsonapps/',
    method: 'get',
  },
  {
    path: '/zh-cn/createapp/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/center/:appName/baseinfo/edit/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/:appName/delete/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/center/healthconfig/data/',
    method: 'get',
  },
  {
    path: '/zh-cn/center/healthconfig/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/timeaxis/:appName/timeline/',
    method: 'get',
  },
  {
    path: '/zh-cn/baseConfig/alertConfig/ruleList/all_apps/',
    method: 'get',
  },
  {
    path: '/zh-cn/rules/rulesdata/',
    method: 'get',
  },
  {
    path: '/zh-cn/rules/rulesedit/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/rules/rulesdelete/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/baseConfig/alertConfig/ruleList/relateintfs/',
    method: 'get',
  },
  {
    path: '/zh-cn/center/:appName/tradingpath/get/',
    method: 'get',
  },
  {
    path: '/zh-cn/center/:appName/tradingpath/save/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/importapp/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/:appName/appconfig/edit/data/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/:appName/appconfig/edit/save/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/:appName/baseline/edit/data/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/:appName/baseline/edit/save/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/:appName/baseline/edit/delete/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/report/gettimerange/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/report/dayreport/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/report/dayexport/',
    method: 'get',
  },
  {
    path: '/zh-cn/report/monreport/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/report/seareport/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/report/yearreport/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/report/dayexport/',
    method: 'get',
  },
  {
    path: '/zh-cn/report/monexport/',
    method: 'get',
  },
  {
    path: '/zh-cn/report/seaexport/',
    method: 'get',
  },
  {
    path: '/zh-cn/report/yearexport/',
    method: 'get',
  },
  {
    path: `/zh-cn/spd/:map/overview/snapshotdata/`,
    method: 'get',
  },
  {
    path: `/zh-cn/stat/timeout/summary/data/`,
    method: 'get',
  },
  {
    path: `/zh-cn/stat/timeout/details/`,
    method: 'post',
    isJson: false,
  },
  {
    path: `/zh-cn/stat/timeout/single/`,
    method: 'post',
    isJson: false,
  },
  {
    path: `/zh-cn/accounts/getsystemuptime/`, // 系统设置-获取系统正常运行时间
    method: 'get',
  },
  {
    path: '/zh-cn/report/custom/span/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/report/custom/report/',
    method: 'post',
    isJson: false,
  },
  {
    path: `/zh-cn/:appName/businesstime/get/`,
    method: 'get',
  },
  {
    path: '/zh-cn/report/custom/export/',
    method: 'get',
  },
  {
    path: '/zh-cn/manager/operation/log/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/manager/operation/log/detail/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/overview/:appName/alertlocated/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/accounts/domain/retrieve_domain/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/accounts/domain/delete_domain/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/accounts/domain/create_domain',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/accounts/domain/update_domain/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/accounts/domain/get_edit_info/',
    method: 'get',
  },
  {
    path: '/zh-cn/accounts/domain/check_data/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/accounts/allroles/get/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/accounts/role/edit/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/accounts/rolename/checkout/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/accounts/role/save/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/accounts/role/delete/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/accounts/domainrole/getall/',
    method: 'get',
  },
  {
    path: '/zh-cn/accounts/getallusers/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/accounts/user/edit/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/accounts/user/delete/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/accounts/user/check/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/accounts/get/userdetails/',
    method: 'get',
  },
  {
    path: '/zh-cn/accounts/password/change/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/baseConfig/protocol/listprotocol/',
    method: 'get',
  },
  {
    path: '/zh-cn/baseConfig/procotol/create/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/baseConfig/protocol/edit/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/baseConfig/protocol/clone/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/baseConfig/protocol/delete/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/baseConfig/protocol/detail/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/manager/update_license/',
    method: 'post',
    isJson: false,
    isfile: true,
  },
  {
    path: '/zh-cn/manager/about/',
    method: 'get',
  },
  {
    path: '/zh-cn/manager/check_license_status/',
    method: 'get',
  },
  {
    path: '/zh-cn/accounts/user/save/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/accounts/userself/save/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/baseConfig/protocol/download/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/baseConfig/protocol/search/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/baseConfig/protocol/import/',
    method: 'post',
    isJson: false,
    isfile: true,
  },
  {
    path: '/zh-cn/indicator/baseline/get_data/',
    method: 'get',
  },
  {
    path: '/zh-cn/indicator/baseline/update_data/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/baseConfig/protocol/create/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/baseConfig/alertConfig/notification/getconfig/',
    method: 'get',
  },
  {
    path: '/zh-cn/baseConfig/alertConfig/notification/updateconfig/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/baseConfig/alertConfig/notification/connecttest/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/baseConfig/alertConfig/getcontact/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/baseConfig/alertConfig/newcontact/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/baseConfig/alertConfig/deletecontact/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/baseConfig/alertConfig/editcontact/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/baseConfig/alertConfig/contactswitch/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/baseConfig/alertConfig/getcontactname/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/baseConfig/alertConfig/deletegroup/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/baseConfig/alertConfig/checkgroup/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/baseConfig/alertConfig/editgroup/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/baseConfig/alertConfig/querygroup/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/baseConfig/alertConfig/delgroupmember/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/baseConfig/alertConfig/newgroup/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/baseConfig/alertConfig/checkcontact/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/baseConfig/alertConfig/getallcontactname/',
    method: 'get',
  },
  {
    path: '/zh-cn/baseConfig/alertConfig/getcontactgroup/',
    method: 'get',
  },
  {
    path: '/zh-cn/baseConfig/alertConfig/addcontactgroup/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/baseConfig/alertConfig/gettemplate/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/baseConfig/alertConfig/deletetemplate/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/baseConfig/alertConfig/newtemplate/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/baseConfig/alertConfig/edittemplate/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/baseConfig/alertConfig/clonetemplate/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/baseConfig/alertConfig/gettemplatedetail/',
    method: 'get',
  },
  {
    path: '/zh-cn/baseConfig/alertConfig/checktemplate/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/manager/checksystemupdate/',
    method: 'get',
  },
  {
    path: '/zh-cn/manager/systemupdate/',
    method: 'get',
  },
  {
    path: '/zh-cn/manager/systemupdate/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/indicator/dimension/get/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/indicator/dimension/detail/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/indicator/dimension/delete/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/indicator/dimension/update/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/indicator/check/parameter/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/indicator/dimension/info/',
    method: 'get',
  },
  {
    path: '/zh-cn/indicator/manager/get/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/indicator/manager/detail/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/indicator/manager/delete/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/indicator/manager/update/',
    method: 'post',
    isJson: false,
  },
  {
    path: '/zh-cn/indicator/manager/info/',
    method: 'get',
  },
  {
    path: '/zh-cn/ipinfos/',
    method: 'get',
  },
];

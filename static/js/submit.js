function PrepFunc(){
  this.runList = [];
  this.reverseList = [];
}
PrepFunc.prototype.append = function () {
  this.runList.push(arguments);
};
PrepFunc.prototype.delete = function () {
  this.runList.splice(this.runList.indexOf(arguments),1);
};
PrepFunc.prototype.reverse = function () {
  this.reverseList.push(arguments);
};
PrepFunc.prototype.reverseDel = function () {
  this.reverseList.splice(this.runList.indexOf(arguments),1);
};
PrepFunc.prototype.run = function () {
  for(var i = 0, len = this.runList.length; i < len; i++){
      var argum = this.runList[i];
      if(argum.length==1){
          if( typeof argum[0] == "function"){
              argum[0]();
          }
      }
      else if(argum.length > 1){
          if(typeof argum[0] == "function"){
              argum[0](argum.slice(1));
          }
      }
  }
  this.runList = [];
  this.reverseList = [];
};
PrepFunc.prototype.redo = function () {
  for(var i = 0, len = this.reverseList.length; i < len; i++){
      var argum = this.reverseList[i];
      if(argum.length==1){
          if( typeof argum[0] == "function"){
              argum[0]();
          }
      }
      else if(argum.length > 1){
          if(typeof argum[0] == "function"){
              argum[0](argum.slice(1));
          }
      }
  }
  this.reverseList = [];
  this.runList = [];
};
PrepFunc.prototype.nextFunc = function(){
  this.next = new PrepFunc();
};

// var source_config_new = new sourceConfig($('body'),saveSourceConfig);
// var target_config_new = new targetConfig($('body'),saveTargetConfig);
var datapath = {};
var datapathOld = {};
var protocols = {};
var servers = {};
var scheduleNew = [];
var scheduleNewOld = [];
var ipObj = {};
var ipObjOld = {};
var delIpList = [];
var ipChange = false;

var icon_list={};
var icon_quest_flag=[];
var functionList = [];
var prepSaveForPop = new PrepFunc();
prepSaveForPop.nextFunc();
var Load = function(){
  loading();
  //初始化交易位置页面的提示信息 
  icon_quest(static_dist);
  trade_qtiz_empty();
  //清空原有的错误提示tips
  $(".admin_save").mouseover(function(){
      trade_qtiz_empty();
  });
  $(".divider-right").find("input[type='text']").mouseover(function(){
      if($(this).val() != ""){
          trade_qtiz_empty();
      }
  });
  $(".checkRow").find("input[type='text']").mouseover(function(){
      if($(this).val() != ""){
          trade_qtiz_empty();
      }
  });

  //拓扑图保存功能
  window.addEventListener("beforeunload",savePrompt);
  $("#save_topo").click(function () {
      if($(".node .error_input").length > 0){
          alertWindow("请设置正确的节点名称",false);
          return;
      }
      ipChange && ipDel();
      prepSaveForPop.next.run();
      save_topo();
  });
  //点击提交按钮的时候触发的函数
  $("#submit_topo_data").click(function() {
      ipChange && ipDel();
      prepSaveForPop.next.run();
      $(".multi-step-dialog").remove();
      var dialog = new Dialog({
          'type': 'no_confirm',
          'cancel_callback': function () {
              location.reload();
          },
          'extra_class': 'multi-step-dialog'
      });
      dialog.setHeight(297);
      dialog.setWorkingMsg('');
      dialog.setFinishMsg(gettext('正在应用您做的修改，请稍候。可能会需要几分钟') + '...', true);
      dialog.hideCancelButton();

      var vfResult = vf_trade_array();
      var is_true = vfResult.pass;
      var index = vfResult.index;
      if(is_true){
          d3.select("#submit_topo_data").datum() && d3.select("#submit_topo_data").datum().remove();
          dialog.show();
          submit_data(dialog);
      }else{
          d3.select(this).datum(show_msgs(d3.select(this),'配置项未完成','top',false));
          d3.selectAll(".node").each(function (data) {
              if(index.indexOf(data.data.index)!= -1){
                  d3.select(this).attr("filter","url(#redWarn)").classed('redWarn',true);
              }
          });
      }
  });
  /*当窗口大小变化时，判断协议的每一项并增添tips*/
  window.addEventListener("resize", protocol_tips);
};

/**
* 页面加载成功就画出节点
*/
function show_topo(){
  $.ajax({
      type: "POST",
      url: "/"+LANGUAGE_CODE+"/newdatapath/",
      dataType: "json",
      async: false,
      data: {'app_name': app_name},
      success: function (data){
          datapath = data.datapath;
          protocols = data.protocols;
          servers = data.servers;
          datapathOld = JSON.parse(JSON.stringify(datapath));

          opBtn(datapath.trade.length === 0);
          document.addEventListener("svgFinish",function (){
              /*在副标题处的“拓扑图设计”后增加正在编辑的业务名称*/
              d3.select("#subHeader").insert("span","#appBtnGroup").attr("class","nav-next nav-prev").html(">");
              d3.select("#subHeader").insert("a","#appBtnGroup").attr("class","nav-now nav-a").html(datapath.disp_name);

              node_i = (datapath.last_level_no==0)?1:(datapath.last_level_no+1);
              coll_i = (datapath.last_intf_no==0)?1:(datapath.last_intf_no+1);

              /**
               * 自定IP对象初始化
               */
              var trade_array = datapath.trade,ipsinfo = {};
              $.each(trade_array,function(trade_index,trade_value){
                  if(trade_value.settings.type == "server"){
                      var ip_array = trade_value.settings.filter.dst_ip_addr;
                      var ip_device = trade_value.settings.filter.dst_ip_device;
                      if(ip_array.length >0){
                          $.each(ip_array,function(ip_index,ip_value){
                              ipsinfo[ip_value.ip] = JSON.parse(JSON.stringify(ip_value));
                          });
                      }
                      if(ip_device.length > 0){
                          $.each(ip_device,function (device_index, device_value) {
                              ipsinfo[device_value.ip].device_name = device_value.device_name;
                              ipsinfo[device_value.ip].device_model = device_value.device_model;
                              ipsinfo[device_value.ip].device_type = device_value.device_type;
                          })
                      }
                  }
                  var src_ref_array = trade_value.ref;
                  $.each(src_ref_array,function(ref_index,ref_value){
                      var src_ip_array = ref_value.src_ip_addr;
                      var src_ip_device = ref_value.src_ip_device;
                      if(src_ip_array.length >= 1){
                          $.each(src_ip_array,function(ip_index,ip_value){
                              ipsinfo[ip_value.ip] = JSON.parse(JSON.stringify(ip_value));
                          });
                      }
                      if(src_ip_device.length > 0){
                          $.each(src_ip_device,function (device_index, device_value) {
                              ipsinfo[device_value.ip].device_name = device_value.device_name;
                              ipsinfo[device_value.ip].device_model = device_value.device_model;
                              ipsinfo[device_value.ip].device_type = device_value.device_type;
                          })
                      }
                  })
              });
              ipObj = ipsinfo;
              ipObjOld = ipsinfo;


              //根据数据生成节点↓
              // var top2 = "";
              var lastIndex = datapath.trade.length - 1;
              var _datapath = JSON.parse(JSON.stringify(datapath));
              window.run_flag = true;
              window.drawFinish = false;
              if(_datapath == 0)drawFinish = true;
              $.each(_datapath.trade, function(level_old_name, level_old_value){
                  run_flag = (level_old_name == lastIndex);
                  var node_temp = "";
                  var level_num = level_old_value.settings.name;
                  var node_i = level_num.match(/\d+/)[0];
                  var intf_num = "";
                  var pos = unitTrans([level_old_value.settings.pos.x,level_old_value.settings.pos.y],true);
                  var pos_x = pos[0];
                  var pos_y = pos[1];
                  //var top = pos_y * 120+45;
                  //var left = pos_x * 220;
                  // if(top > top2){
                  //     top2 = top;
                  // }
                  var flag = level_old_value.settings.type == "client";
                  var disp_name = level_old_value.settings.disp_name;
                  var imgname =  level_old_value.settings.imgname;
                  if(level_old_value.settings.type == "server"){
                      intf_num = level_old_value.collector[0].name.match(/\d+/)[0];
                      topo.node({
                          disName: disp_name,
                          type: "server",
                          x: pos_x ,
                          y: pos_y ,
                          index: (+node_i),
                          intf:(+intf_num),
                          iconLink: static_dist + "img/cbms-img/topo-icon/"+imgname+".svg"
                      });
                  }
                  else{
                      topo.node({
                          disName: disp_name,
                          type: "client",
                          x: pos_x ,
                          y: pos_y ,
                          index: (+node_i),
                          iconLink: static_dist + "img/cbms-img/topo-icon/"+imgname+".svg"
                      });
                  }
              });
              $.each(_datapath.trade,function(level_old_name, level_old_value){
                  $.each(level_old_value.ref,function(ref_name,ref_value){
                      var sid = level_old_value.settings.name.match(/\d+/)[0];
                      var tid = ref_value.name.match(/\d+/)[0];
                      var source = topo.data.nodeList[sid].node;
                      var target = topo.data.nodeList[tid].node;
                      runList(topo.link,source,target);
                  });
              });
              if(run_flag){
                  functionList.forEach(function(arrayList){
                      arrayList[0](arrayList[1][0],arrayList[1][1]);
                  });
                  drawFinish = true;
                  topo.data.index = datapath.last_level_no + 1;
                  topo.data.intf = datapath.last_intf_no + 1;
                  topo.setOptions({index: datapath.last_level_no + 1, intf: datapath.last_intf_no + 1});
              }
              loading().remove();
          });
      },
      error: function (data) {
          alert("error1");
      }
  });
}

/**
*
* 获取日程列表
*/
function get_schedule() {
  d3.json('/zh-cn/'+app_name+'/worktime/get/',function (data) {
      if(data.error === 0){
          var result = data.result;
          for(var i=0;i < result.length;i++){
              delete result[i].status;
          }
          scheduleNew = result;
          scheduleNewOld = JSON.parse(JSON.stringify(scheduleNew));
      }
  });
}

/**
* 展示节点中数据
* @param this_div
*/
function show_config(thisIndex,intf){
  target_config_new.show();

  var node_id = 'level'+thisIndex;
  var tradeList = datapath.trade;
  tradeList.forEach(function(trade, i){
      if(trade.settings.name === node_id){
          var _scheduleLoad = {};
          scheduleNew.some(function(d){
              if(d.intf_name.match(/\d+/g)[0] == intf){
                  _scheduleLoad = {schedule: d.schedule, switch: d.switch};
                  return true;
              }
          });
          target_config_new.update(trade, servers, protocols, _scheduleLoad, app_name, ipObj);
      }
  });
}

/**
* 展示发出配置页面的内容，连线的点击事件。
*/
function show_sourConfig(info) {
  source_config_new.show();

  var sourceId = info.sourceId;
  var targetId = info.targetId;
  var tradeList = datapath.trade;
  var soureceData = {};
  var intf_name = '';
  tradeList.forEach(function(d, i){
      if(d.settings.name === sourceId){
          var refArr = d.ref;
          refArr.some(function (item,i) {
              if(item.name === targetId){
                  soureceData = item;
                  return true;
              }
          });
      }
      if(d.settings.name === targetId) {
          intf_name = d.collector[0].name;
      }
  });
  source_config_new.update(soureceData, sourceId, app_name, intf_name, ipObj);
}

/**
* 保存源节点配置
* @param data
* @param name
*/
function saveSourceConfig(data, name){
  var sourceId = name;
  var targetId = data.name;
  var tradeList = datapath.trade;
  tradeList.forEach(function(d, i){
      if(d.settings.name === sourceId){
          var refArr = d.ref;
          refArr.forEach(function (item,i) {
              if(item.name === targetId){
                 item.src_ip_list = JSON.parse(JSON.stringify(data.src_ip_list));
                 item.src_ip_device = JSON.parse(JSON.stringify(data.src_ip_device));
                 item.src_ports = JSON.parse(JSON.stringify(data.src_ports));

                 if(source_config_new.moniChange){
                     ipChange = true;
                     changeIP(data.src_ip_device);
                 }

                  delIpList = delIpList.concat(source_config_new.ip_config.delIpList);
                  // ipObj = JSON.parse(JSON.stringify(source_config_new.ipObj);
                      source_config_new.hide();
              }
          });
      }
  });
}
/**
* 保存目标节点配置
* @param data
*/
function saveTargetConfig(data){
  var levelName = data.settings.name;
  var tradeList = datapath.trade;
  tradeList.forEach(function(trade, i){
      if(trade.settings.name === levelName){
          trade.settings = JSON.parse(JSON.stringify(data.settings));
          trade.alarmrules = JSON.parse(JSON.stringify(data.alarmrules));
          trade.collector = JSON.parse(JSON.stringify(data.collector));

          if(target_config_new.moniChange){
              ipChange = true;
              changeIP(data.settings.filter.dst_ip_device);
          }

          var schedule_config = target_config_new.schedule_config;
          var _schedule = schedule_config.data;
          var _switch = schedule_config.switch ? "on" : "off";
          var intf = trade.collector[0].name;
          var exist = scheduleNew.some(function (d) {
              if(d.intf_name.match(/\d+/)[0] === intf.match(/\d+/)[0]){
                  d.schedule = _schedule;
                  d.switch = _switch;
                  return true;
              }
          });
          if(!exist){
              scheduleNew.push({
                  intf_name: "intf" + intf.match(/\d+/)[0],
                  switch: _switch,
                  schedule: _schedule
              });
          }

          delIpList = delIpList.concat(target_config_new.ip_config.delIpList);
          // ipObj = JSON.parse(JSON.stringify(target_config_new.ipObj);

          target_config_new.hide();

          d3.selectAll(".redWarn.node").each(function (d) {
              if(('level' + d.data.index) === levelName && d3.select(this).select('.error_input').empty()){
                  d3.select(this).attr("filter","").classed('redWarn',false);
              }
          });
      }
  });
}

function changeMoniIp(list){
  list.forEach(function (d){
      if(!ipObj.hasOwnProperty(d.ip)){
          ipObj[d.ip] = {
              ip : d.ip,
              addr: d.addr,
              intf_name : d.intf_name,
              app_name :  d.app_name,
              name : d.name,
              dim_trans_type : d.dim_trans_type,
              dim_sub_trans_type : d.dim_sub_trans_type,
              dim_subsub_trans_type :  d.dim_subsub_trans_type
          };
      }else{
          ipObj[d.ip].ip = d.ip;
          ipObj[d.ip].addr= d.addr;
          ipObj[d.ip].intf_name = d.intf_name;
          ipObj[d.ip].app_name =  d.app_name;
          ipObj[d.ip].name = d.name;
          ipObj[d.ip].dim_trans_type = d.dim_trans_type;
          ipObj[d.ip].dim_sub_trans_type = d.dim_sub_trans_type;
          ipObj[d.ip].dim_subsub_trans_type =  d.dim_subsub_trans_type;
      }
  });
}
/**
* 从对象中修改IP
* @param list
*/
function changeIP(list){
  list.forEach(function (d){
      if(!ipObj.hasOwnProperty(d.ip)){
          ipObj[d.ip] = {
              ip : d.ip,
              intf_name : d.intf_name,
              app_name :  d.app_name,
              device_name : d.device_name,
              device_model : d.device_model,
              device_type : d.device_type
          };
      }else{
          ipObj[d.ip].ip = d.ip;
          ipObj[d.ip].intf_name = d.intf_name;
          ipObj[d.ip].app_name =  d.app_name;
          ipObj[d.ip].device_name =  d.device_name;
          ipObj[d.ip].device_model =  d.device_model;
          ipObj[d.ip].device_type =  d.device_type;
      }
  });
}
/**
* 解除/禁用btn
* @param bool
*/
function opBtn(bool) {
  d3.select('#appBtnGroup').classed('disableAppBtn',bool);
}

/**
* 拓扑图的保存功能
*/
function save_topo(){
  var task_id = UUID.genV4().hexString;
  $.ajax({
      url:"/zh-cn/"+app_name+"/datapath/save/",
      data:{
          "datapath": JSON.stringify(datapath),
          "task_id": task_id
      },
      type:"post",
      dataType:"json",
      success:function(data){
          window.removeEventListener("beforeunload", savePrompt);
          if (data.state == "success") {
              workTimeSave({
                  data: scheduleNew,
                  type: 'save',
                  callback: function () {
                      if (ipChange) {
                          ipSave(ipObj);
                      } else {
                          alertWindow("保存成功！", false);
                          refresh();
                      }
                  }
              });
          }
      },
      error: function (data) {
          // alertWindow("数据请求错误:[topo]");
          console.log("数据请求错误:[topo]");
      }
  })
}

/**
* 配置页面中判断后执行的切换提示语的函数
* @param is_success：填写是否符合要求，如是，将是true，否则为false
* @param input_this：当前input元素对象
*/
function action_change(is_success,input_this,error_msg){
  if(is_success){
  }else{
      show_msgs(d3.select(input_this),error_msg,"right");
  }
}

/**
* 判断协议项是否需要删添tips
*/
function protocol_tips() {
  d3.selectAll(".proto-text").each(function () {
      var _this = d3.select(this);
      if(_this.property("tips")){_this.property("tips").remove()}
      if(_this.property("scrollWidth") > _this.property("offsetWidth")){
          show_msgs(_this,_this.html(),"right",true);
      }
  });
}
/**
* 清空交易配置qtip内容，初始化目标IP和端口的提示
*/
function trade_qtiz_empty(){
  // show_msgs(d3.select(".trade_target_ip"),'必填项，ip段用"-"连接，多个ip地址间用","隔开！',"top",true,true);
  // show_msgs(d3.select("#trade_target_port"),'0-65535之间，区间用"-"连接，多个端口用","隔开','top',true,true);
  show_msgs(d3.select("#coll_name"),'必填项',"top",true,true);
}

/**
* 连线删除按钮的点击事件
* @param close 连线删除按钮本身
* */
function del_link_click(close){
  var link_id = $(close).attr('id').match(/level\d+_level\d+/)[0]
  var sourceId = d3.select('#'+link_id).datum().sourceId;
  var targetId = d3.select('#'+link_id).datum().targetId;
  window.connectArray.splice(window.connectArray.indexOf({sourceId:sourceId,targetId:sourceId}),1);
  var trade_array = datapath.trade;
  alertWindow("是否确定删除该连线？",true);
  $(".determine-btn").unbind("click").click(function() {
      $(".all_bg").hide();
      $(".suc_info").hide();
      $.each(trade_array, function (trade_index,trade_value) {
          if(trade_value.settings.name == sourceId){
              var ref_array = trade_value.ref;
              for(var i=0;i<ref_array.length;i++){
                  if(ref_array[i].name == targetId){
                      ref_array.splice(i,1);//从下标为i的元素开始，连续删除1个元素
                      i--;//因为删除下标为i的元素后，该位置又被新的元素所占据，所以要重新检测该位置
                  }
              }
          }
      });
      del_link(close,link_id)
  })
}

/**
* 连线删除操作
* @param link_close 连线删除按钮本身
* @param link_id 要删除的连线id
* */
function del_link(link_close,link_id){
  var right = d3.select('#'+d3.select(link_close).attr('id').match('rcs.*(?=_)'));
  var left = d3.select('#'+d3.select(link_close).attr('id').match('lcs.*'));
  d3.select('#'+link_id).remove();
  d3.select(link_close).remove();
}


/**
* 新建节点的时候，创建level对象
*/
function create_level_obj(node_type,level_name,pos_obj,coll_name){
  var level_obj = {};
  if(node_type == "server"){
      level_obj = {
          ref:[],
          alarmrules:{
              tivoliOn: true,
              threshold: {
                  duration: {
                      up: {
                          value: null,
                          time: 1
                      },
                      baseOn: false,
                      on: false
                  },
                  trans_count: {
                      down: {
                          value: null,
                          time: 1
                      },
                      up: {
                          value: null,
                          time: 1
                      },
                      baseOn: false,
                      on: false
                  },
                  succ_rate: {
                      down: {
                          value: null,
                          time: 1
                      },
                      baseOn: false,
                      on: false
                  },
                  rr_rate: {
                      down: {
                          value: null,
                          time: 1
                      },
                      baseOn: false,
                      on: false
                  },
                  no_req: {
                      on: false,
                      time: 1
                  }
              },
              health: {
                  baseOn: false,
                  on: false,
                  duration: null,
                  health_set: null,
                  ts_hold: 1
              },
              baseline: {
                  duration: {
                      down: null,
                      on: false,
                      up: null,
                      time: 1
                  },
                  trans_count: {
                      down: null,
                      on: false,
                      up: null,
                      time: 1
                  },
                  succ_rate: {
                      down: null,
                      on: false,
                      up: null,
                      time: 1
                  }
              },
              return_code: {
                  on: false,
                  val: ''
              }

          },
          collector:[{
              server_id:"",
              nic_addr:"",
              name:coll_name,
              target_prot:"",
              disp_name:""
          }],
          settings:{
              captype:"sp",
              correlated_group_name:"",
              correlated_trade_group_name:"",
              disp_name:"",
              filter:{
                  dst_ports:[],
                  dst_ip_device:[],
                  dst_ip_addr:[],
                  dst_ip_list:[]
              },
              imgname:"serverGroup",
              is_double_live:false,
              is_master:true,
              is_slave:false,
              is_twoway_trade:false,
              link:"",
              name:level_name,
              pos:pos_obj,
              type:node_type
          }
      }
  }else{
      level_obj = {
          ref:[],
          settings:{
              disp_name:"",
              filter:{
                  dst_ip_list:[],
                  dst_ip_addr:[],
                  dst_ip_device:[],
                  dst_ports:[]
              },
              name:level_name,
              imgname:"client",
              pos:pos_obj,
              type:node_type
          }
      };
  }
  opBtn(false);
  return level_obj;
}

/**
* 连线函数，当连线事件发生时，将其填进ref数组中
*/
function lineConnect(conn) {
  var sourceId = conn.sourceId;
  var targetId = conn.targetId;
  $(this).attr({"sour_key":sourceId,"target_key":targetId});
  var trade_array = datapath.trade;
  if(sourceId == targetId){
      return false;
  }else{
      $.each(trade_array, function (trade_index,trade_value) {
          if(trade_value.settings.name == sourceId){
              var ref_array = trade_value.ref;
              if(ref_array.length != 0){
                  var is_has = false;
                  $.each(ref_array,function(ref_index,ref_name){
                      if(ref_name.name == targetId){
                          is_has = true;
                      }
                  });
                  if(!is_has){
                      var ref_value = {
                          "name" : targetId,
                          "src_ip_list":[],
                          "src_ip_device":[],
                          "src_ports":[],
                          "src_ip_addr":[]
                      };
                      trade_value.ref.push(ref_value);
                  }
              }else{
                  var ref_value = {
                      "name" : targetId,
                      "src_ip_list":[],
                      "src_ip_device":[],
                      "src_ports":[],
                      "src_ip_addr":[]
                  };
                  trade_value.ref.push(ref_value);
              }
          }
      });
  }
}

/**
* 删除节点函数
* @param del_id 删除按钮的id
* @param d 从d3传过来的datum数据
*/
function delete_level(del_id,d){
  var trade_array = datapath.trade;
  var dele_level_id ='level'+ $(del_id).attr("id").match(/\d+/)[0];
  alertWindow("是否确定删除该节点？",true);
  $(".determine-btn").unbind("click").click(function(){
      $(".all_bg").hide();
      $(".suc_info").hide();
      if(dele_level_id != ""){
          var trade_lenth = trade_array.length;
          for(var i = trade_lenth-1; i >= 0; i--){
              try{
                  var ref_array = trade_array[i].ref;
                  //删除掉节点的ref中有该值的值
                  var ref_length = ref_array.length;
                  if(ref_length >= 1){
                      for(var j = ref_length-1; j >= 0; j--){
                          if(ref_array[j].name == dele_level_id){
                              ref_array.splice(j,1);
                          }
                      }
                  }

                  //从trade_array中移除该节点
                  if(trade_array[i].settings.name == dele_level_id){
                      trade_array.splice(i,1);
                      delete_node(d);
                  }
              }catch(e){}
          }
      }else{
          jsPlumb.removeAllEndpoints(dele_level_id);
          $("#"+dele_level_id).remove();
      }
  });
}

/**
* 删除节点的图像处理部分
* @param d 从d3传过来的datum数据
* */
function delete_node(d) {
  var connectArray = [];
  window.connectArray.forEach(function (connect) {
      if(!(connect.targetId=="level"+d.i||connect.sourceId=="level"+d.i)){
          connectArray.push(connect);
      }
  });
  window.connectArray = connectArray;
  var del_path = $('path[id*=level' + d.i + ']');
  var dot_id = [];
  for (var i = 0; i < del_path.length; i++) {
      dot_id.push(del_path.eq(i).attr('id').split('_'));
  }
  d3.selectAll('.nodes' + d.i).remove();
  $('path[id*=level' + d.i + ']').remove();
  d3.select('#intf' + d.i).remove();
  d3.select('#trade_name' + d.i).remove();
}

/**
* 保存节点的源ip以及源端口等
* @param this_
*/
function save_source(this_btn){
  var parent = $(this_btn).parents("#sour_ip_config");
  var target_name = parent.attr("target_node");
  var source_name = parent.attr("source_node");
  var error_input = parent.find(".error_input");
  if(error_input.length > 0)return;
  prepSaveForPop.run();
  var vf_src_port = vf_source_port();
  var trade_array = datapath.trade;
  if(vf_src_port){
      $.each(trade_array,function(trade_index,trade_value){
          if(trade_value.settings.name == source_name){
              //交易配置页面的内容的获取
              source_config(trade_value,target_name);
          }
      });
      $("#sour_ip_config").removeAttr("target_node source_node current_node").hide(400);
  }
}

/**
* 刷新当前页面
*/
function refresh(){
  window.location.reload();//刷新当前页面.
}

/**
* 点击提交按钮，向后台传递数据
*/
function submit_data(dialog){
  var task_id = UUID.genV4().hexString;
  function apply() {
      $.ajax({
          type: "post",
          dataType: "json",
          url: "/" + LANGUAGE_CODE + "/" + app_name + "/apply/",
          data: {
              "datapath": JSON.stringify(datapath),
              "task_id": task_id
          },
          success: function (data) {
              if (data.error == 0) {
                  window.removeEventListener("beforeunload",savePrompt);//解除保存提醒的绑定
                  dialog.setFinishMsg(gettext($("#sys_time").text() + '&nbsp;&nbsp;应用已经完成！可关闭窗口') + '...', true);
                  d3.select(".finish-msg").style("color","#3ABFC4");
                  dialog._hideButton("after");
                  dialog.default_view.find(".cbms-cancel").click(function () {
                      workTimeSave({
                          data: scheduleNew,
                          type: 'apply',
                          callback: function () {
                              if(ipChange){
                                  ipSave(ipObj);
                              }else{
                                  refresh();
                              }
                          }
                      });
                  });
                  //提交自定义监控ip↓

              } else {
                  dialog._setModalHeader("error");
                  dialog._hideButton("after");
                  dialog.setFinishMsg(gettext(data.error_msg) + '...', true);
              }
          },
          error: function (data) {
              // alertWindow("自定义ip保存失败！",false);
          }
      })
  }
  var event_source = new EventSource(format_i18n_url('/events/task/' + task_id + '/'));
  var aaa = 1 ;
  var progressBar;
  progressBar = new ProgressBar({
      width:580,
      height:20,
      startColor:"#449AA7",
      stopColor:"#B9BC47"
  });
  d3.select(".dialog-modal-header")[0][0].appendChild(progressBar.bar);
  event_source.addEventListener('ack', function (e) {
      apply();
  }, false);

  event_source.addEventListener('event', function (e) {
      progressBar.progress((aaa++/28).toFixed(2))
      var data = JSON.parse(e.data);
      dialog.appendWorkingMsg($("#sys_time").text() + '&nbsp;&nbsp;' + data.msg + "<br/>");
  }, false);

  event_source.addEventListener('eof', function (e) {
      event_source.close();
  }, false);

}

/**
* 点击应用按钮时验证所有的节点
*/
function vf_trade_array(){
  var is_true = true;
  var index = [];//报警的节点
  var trade_array = datapath.trade;
  $.each(trade_array,function(trade_index,trade_value){
      var level_disp_name = trade_value.settings.disp_name;
      var level_name = trade_value.settings.name;
      if(trade_value.settings.type == "server"){
          var _level = +trade_value.settings.name.match(/\d+/)[0];
          //验证交易配置页面
          var dst_port_length = trade_value.settings.filter.dst_ports.length;
          var dst_ip_list_length = trade_value.settings.filter.dst_ip_list.length;
          var collector = trade_value.collector[0];

          if(dst_port_length == 0 || dst_ip_list_length == 0 || collector.disp_name === '' || !protocols.hasOwnProperty(collector.target_prot) || servers[0].nices.indexOf(collector.nic_addr) === -1){
              $(".topo-edit-box").find("input[name = "+ level_name +"]").addClass("error_node");
              is_true = false;
              index.push(_level);
          }else{
              $(".topo-edit-box").find("input[name = "+ level_name +"]").removeClass("error_node");
          }

      }
      //验证节点 名字
      if(level_disp_name == ""){
          var error_node = $("#topoRegion_2").find("#trade_name"+level_name.match(/\d+/)[0]).addClass("error_input");
          is_true = false;
          index.push(+trade_value.settings.name.match(/\d+/)[0]);
          //alertWindow("存在未填写的节点名称！",false);
      }else{
          var error_node = $("#topoRegion_2").find("#trade_name"+level_name.match(/\d+/)[0]).removeClass("error_input");
      }
  });
  d3.selectAll(".topo-edit-box input").each(function(){
      if(d3.select(this).classed("error_input")){
          is_true = false;
          (index.indexOf(this.__data__.data.index) == -1) && index.push(this.__data__.data.index);
      };
  });
  return {pass: is_true, index: index};
}

/**
* 请求服务器节点图标并生成数组，保存在前台
* @param static_dist 服务器图标列表
* @returns {Object}
*/
function icon_quest(static_dist){
  show_topo();
  get_schedule();
  var img_list = ["client",'serverGroup','server','Components15','Components16','AMEX','CUPS','JSON','MasterCard','VISA','SOAP','TANDEM','XML','BankComponent','bank','components','core','Components1','Components2','Components3','Components4','Components5','Components6','Components7','Components8','Components9','Components10','Components11','Components12','Components13','Components14'];
  // var img_list = ['client','serverGroup','server','serverGroup','AMEX','CUPS','JSON','MasterCard','VISA','SOAP','TANDEM','XML','BankComponent','bank','components','core','Components1','Components2','Components3','Components4','Components5','Components6','Components7','Components8','Components9','Components10','Components11','Components12','Components13','Components14','Components15','Components16'];
  // var icon_list = {};
  var len = img_list.length;
  for(var i = 0;i<len;i++){
      icon_quest_flag[i] = false;
      (function(i){$.ajax({
          type:"GET",
          url:static_dist+"img/cbms-img/topo-icon/"+img_list[i]+".svg",
          dataType:"xml",
          success:function(data){
              icon_quest_flag[i] = true;
              var string = data.children[0].outerHTML;
              icon_list[img_list[i]] = string;
              icon_quest_flag.forEach(function(){
                  return true;
              });
              if(icon_quest_flag.every(function(d){return d;})){
                  var svgFinish = new Event("svgFinish");
                  document.dispatchEvent(svgFinish);
              }
          }})})(i);
  }
  //return icon_list;
}

function runList(func){
  if(!window.functionList){window.functionList=[]}
  var length = arguments.length;
  var ArrayList = [];
  var valList = [];
  ArrayList.push(func);
  for(var i =1;i<length;i++){
      valList.push(arguments[i]);
  }
  ArrayList.push(valList);
  functionList.push(ArrayList);
}

function savePrompt(e) {
  if(!compareObj(datapath,datapathOld)||!compareObj(scheduleNew,scheduleNewOld)){
      e.returnValue = "您未进行保存操作，是否真的退出编辑？";
  }
}
function ipToDec(ip) {
  var ipArray = ip.split(".");
  return parseInt(ipArray[3])+parseInt(ipArray[2])*256+parseInt(ipArray[1])*256*256+parseInt(ipArray[0])*256*256*256;
}
function decToIp(dec) {
  var ipArray = [];
  var remainder_1 = dec%(256*256*256);
  ipArray.push(parseInt(dec/(256*256*256)));
  var remainder_2 = remainder_1%(256*256);
  ipArray.push(parseInt(remainder_1/(256*256)));
  var remainder_3 = remainder_2%(256);
  ipArray.push(parseInt(remainder_2/(256)));
  ipArray.push(parseInt(remainder_3));
  return ipArray.join(".");
}
function compareObj(a,b) {
  if(a === null|| b === null){
      return a === b;
  }
  else if(a === undefined||b === undefined){return false}
  else if(a.constructor === b.constructor){
      if(a instanceof Array){
          if(a.length !== b.length)return false;
          return a.every(function (item,i) {
              return compareObj(item,b[i]);//递归
          });
      }
      else if(a instanceof Object){
          for(var i in a){
              if(!compareObj(a[i],b[i]))return false;//递归
          }
          for(var j in b){
              if(!compareObj(a[j],b[j]))return false;//递归
          }
          return true;
      }
      else return a===b;
  }
  else return false;
}

/**
* 监控ip后台保存
* @param obj
*/
function ipSave(ipObj,callback) {
  $.ajax({
      type: "POST",
      url: "/" + LANGUAGE_CODE + "/spd/newipjson/" ,
      dataType: "text",
      data: {"ipsinfo":JSON.stringify(ipObj)},
      async: true,
      success: function (data) {
          data = JSON.parse(data);
          if (data.status == 1) {
              if(callback && typeof callback == "function"){
                  callback.call(this);
              }else{
                  alertWindow("保存成功！", false);
                  refresh();
              }
          }else{
              var error_array = data.errors;
              $.each(error_array,function(error_index,error_value){
                  var error_text = error_value;
                  for(var key in error_text){
                      alertWindow(error_text[key].addr,false);
                  }
              })
          }
      },
      error:function(data){
          // alert("数据请求错误:[ip monitor]");
          console.log("数据请求错误:[ip monitor]");
      }
  });
}

function ipDel() {
  delIpList.forEach(function (d) {
      if(ipObjOld.hasOwnProperty(d)){
          $.ajax({
              type: "POST",
              url: "/" + LANGUAGE_CODE + "/spd/deleteip/" ,
              dataType: "text",
              data: {ip: d, type: 'device'},
              async: true,
              success: function (data) {
                  if(data.result == 1){
                      // refresh();
                  }
              },
              error:function(data){
                  // alert("数据请求错误:[ip monitor]");
                  console.log("ip删除错误:[ip monitor]");
              }
          });
      }

  });


}
/**
* 工作时段后台保存
* @param obj
*/
function workTimeSave(obj) {
  $.ajax({
      url: "/zh-cn/"+app_name+"/worktime/save/",
      type: "POST",
      dataType: "json",
      data:{
          "data": JSON.stringify(obj.data),
          "type": obj.type,
          "csrfmiddlewaretoken": csrf_token
      },
      success: function (data) {
          if(data.error == 0){
              if(obj.callback&&typeof obj.callback == "function")obj.callback.call(this);
          }
      },
      error: function (error_msg) {
          // alertWindow("数据请求错误:[worktime]");
          console.log("数据请求错误:[worktime]");
      }
  });
}
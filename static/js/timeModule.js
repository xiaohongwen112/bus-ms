/* eslint-disable */
var timeModule = (function(){
  var even_pot = {};//记录用以撤销编辑的备份的时间
  var data = [];//记录工作时段
  var monitor = true;
  var module = function(container){
      this.container = container.append('div').attr('class','timeWorkDiv');
      /*只读属性"data",实际返回的值为私有变量data.注意:插件内部绝不可以用this.data的形式操作data,请直接使用私有变量data*/
      Object.defineProperty(this, "data", {
          enumerable: true,
          configurable: true,
          get: function () {
              var _data = JSON.parse(JSON.stringify(data));//未防止外部通过变量引用的行为误修改内部私有变量的data值，此处使用克隆的值
              _data.forEach(function (item) {
                  delete item.scheduleID;
              });
              return _data;
          }
      });
      /*只读属性switch*/
      Object.defineProperty(this, "switch", {
          enumerable: true,
          configurable: true,
          get: function () {
              return monitor;
          }
      });
  };
  module.prototype = {
      /**
       * 初始化
       * @param data
       */
      init : function(_data){
          var _this = this;
          var container = _this.container;

          var workOn = container.append('div').attr({class : 'workOn'});
          var editDiv =container.append('div').attr({class : 'edit-schedule-div'});
          container.append('div').attr({class : 'show-schedule-div'});
          container.append('div').attr({class: 'disable-hidden-div'})
          workOn.append('span').attr('class','beauty');
          workOn.append('span').attr('class','logic-name').html('监控');
          var btnOn = workOn.append('a').attr({class : 'on-off-btn on turn', href : '#'}).html('开启').datum('on');
          var btnOff = workOn.append('a').attr({class : 'on-off-btn off', href : '#'}).html('关闭').datum('off');

          btnOn[0][0].addEventListener("click", function (e) {
              btnOff.classed("turn", false);
              btnOn.classed("turn", true);
              monitor = true;
              _this.editable(true);
          });
          btnOff[0][0].addEventListener("click", function (e) {
              btnOn.classed("turn", false);
              btnOff.classed("turn", true);
              monitor = false;
              _this.editable(false);
          });

          var leftDiv = editDiv.append('div').attr({class : 'leftWorkDiv'});
          leftDiv.append('span').attr({class : 'beauty'});
          leftDiv.append('span').attr({class : 'logic-name'}).html('工作时段名称');
          leftDiv.append('input')
              .attr({
                  class : 'app-logic-name',
                  id : 'workName',
                  type : 'text',
                  autocomplete:'off',
                  placeholder : '周末',
                  maxLength: 20
              })
              .on("input", function () {
                  var value = this.value;
                  if(this.value.length === 20){
                      show_msgs(d3.select(this),"名称长度不可超过20", "top");
                  }
                  else {
                      this.tips&&this.tips.remove();
                  }
              });
          var weekSelect = editDiv.append('div').attr({class : 'centerWorkDiv week-btn-group'});
          var days = 7;
          var week = [['全','all'],['一','week_mon'],['二','week_tue'],['三','week_wed'],['四','week_thu'],['五','week_fri'],['六','week_sat'],['日','week_sun']];
          for(var i=0;i < (days+1);i++){
              weekSelect.append('a').attr({week : week[i][1], class : 'week-btn ' + week[i][1], href : '#'}).html(week[i][0]);
          }
          weekSelect.selectAll('.all').classed('click-week',true);
          weekSelect.selectAll('.week-btn').on('click',function(){
              var week_group = d3.select(this.parentNode);
              if(d3.select(this).classed('all')){
                  week_group.selectAll('.week-btn').classed('click-week',false);
              }
              d3.select(this).classed('click-week',!d3.select(this).classed('click-week'));
              if(!d3.select(this).classed('all')){
                  if(week_group.selectAll(".week-btn:not(.all).click-week")[0].length < 7){
                      week_group.select(".all").classed('click-week',false);
                  }
                  else{
                      week_group.select(".all").classed('click-week',true);
                      week_group.selectAll(".week-btn:not(.all).click-week").classed("click-week", false);
                  }
              }
          });
          var rightDiv = editDiv.append('div').attr({class : 'rightWorkDiv'});
          var createTimeWork = rightDiv.append('a').attr({id : 'createTimeWork', class : 'add-btn add', href : '#'}).html('+');
          var clearTimeWork = rightDiv.append('a').attr({id:'clearTimeWork',class : 'add-btn clear-btn', href : '#'}).html('取消');


          createTimeWork[0][0].addEventListener('click',function(){
              if(d3.select(this).classed('add')){
                  //container.select('.show-schedule-div')[0][0].scrollTop = 0;
                  d3.select(this).classed('add',false).html('保存');
                  _this.newScheduleCreate();
                  d3.select(".show-schedule-div").property("scrollTop", 0);
              }
              else{
                  if(container.select("#new").empty()){
                      var scheduleID = container.select(".per-schedule.edit").attr("id").split("show_")[1];
                      _this.saveWork("edit", scheduleID);
                  }
                  else {
                      _this.saveWork("new");
                  }
              }
          });
          clearTimeWork[0][0].addEventListener('click',function(){_this.clearEdit(true);});

          if(_data.length > 0){
              _data = JSON.parse(JSON.stringify(_data));
              for(var i=0;i < _data.length;i++){
                  _data[i].scheduleID = randomID(10);
                  data.push(_data[i]);
                  _this.perScheduleInfo(_data[i].scheduleID);
                  _this.updatePerInfo(_data[i]);
              }
          }

      },
      /**
       * 新建日程
       */
      newScheduleCreate : function(){
          var container = this.container;

          !d3.select('#new').empty() && d3.select('#new').remove().select(".time-div").datum().clearListener();

          var perSchedule = container.select('.show-schedule-div').insert('div',':first-child').attr({class : 'per-schedule new', id : 'new'});
          var scheduleTime = perSchedule.append('div').attr({class : 'per-schedule-time'});
          scheduleTime.append('span').attr({class : 'per-time-name'}).html('工作时段');
          new timeAxisHM(scheduleTime.append('div').attr({class : 'time-div', id : 'timeNew'}));

          container.select('#new').classed('edit',true);
          container.select('.edit-schedule-div').classed('edit',true);
          container.select('#createTimeWork').classed('add',false).html('保存');
      },
      /**
       * 格式化周选择
       * @param validWeek
       */
      formatWeekBtn : function(validWeek){
          var weekGroup = this.container.select('.week-btn-group');
          weekGroup.selectAll('.week-btn').classed('weekBtnBan',false);
          if(validWeek.length > 0){
              for(var i=0;i < validWeek.length;i++){
                  weekGroup.select('.' + validWeek[i]).classed('weekBtnBan',true);
              }
              if(validWeek.length == weekGroup.selectAll('.week-btn')[0].length-1){
                  weekGroup.select('.all').classed('click-week',true);
              }else{
                  weekGroup.selectAll('.click-week').classed('click-week',false);
                  weekGroup.select('.' + validWeek[0]).classed('click-week',true);
              }
          }else{
              weekGroup.selectAll('.click-week').classed('click-week',false);
          }
      },
      /**
       * 清除编辑状态
       */
      clearEdit : function(cancel){
          var _this = this;
          var container = _this.container;
          cancel&&container.select('#new').empty()&&!container.select(".per-schedule.edit").empty()&&container.select(".per-schedule.edit").select('.time-div').datum().init(even_pot.time_range);
          container.selectAll('.edit').classed('edit',false);
          container.select('#createTimeWork').classed('add',true).html('+');
          container.select('#workName').property('value','');
          container.selectAll('.click-week').classed('click-week',false);
          !container.select('#new').empty() && container.select('#new').remove().select(".time-div").datum().clearListener();
      },
      /**
       * 创建日程信息相关
       * @param scheduleID
       */
      perScheduleInfo : function(scheduleID){
          var _this = this;
          var container = _this.container;
          var showDiv = container.select('.show-schedule-div');

          var perSchedule = showDiv.append('div').attr({class : 'per-schedule', id : 'show_' + scheduleID});
          var scheduleTit = perSchedule.append('div').attr({class : 'per-schedule-tit'});
          var note = scheduleTit.append('span').attr({class : 'schedule-note logic-name'});
          scheduleTit.append('span').attr({class : 'schedule-repeat logic-week'});
          var scheduleEdit = scheduleTit.append('a').attr({href : '#', class : 'schedule-tit-btn scheduleEdit'}).html('编辑');
          var scheduleDel = scheduleTit.append('a').attr({href : '#', class : 'schedule-tit-btn scheduleDel'}).html('删除');
          var scheduleTime = perSchedule.append('div').attr({class : 'per-schedule-time'});
          scheduleTime.append('span').attr({class : 'per-time-name'}).html('工作时段');
          new timeAxisHM(scheduleTime.append('div').attr({class : 'time-div', id : 'time' + scheduleID}));


          scheduleEdit[0][0].addEventListener('click',function(){
              _this.clearEdit(true);
              container.selectAll('.edit').classed('edit',false);
              container.select('.edit-schedule-div').classed('edit',true);
              d3.select(this.parentNode.parentNode).classed('edit',true);
              container.select('#createTimeWork').classed('add',false).html('保存');
              !d3.select('#new').empty() && d3.select('#new').remove().select(".time-div").datum().clearListener();
              var time_range = [];
              var thisTimeAxis = perSchedule.select('.timeAxis');
              thisTimeAxis.selectAll('.fullTimeGroup').each(function(d){
                  time_range.push({
                      ts_start: timeToMinute(d3.select(this).select('.startFullGroup input')[0][0].value),
                      ts_end: timeToMinute(d3.select(this).select('.endFullGroup input')[0][0].value)
                  });
              });
              even_pot.time_range = time_range;
              var week = {
                  '周一至周日' : 'all' ,
                  '周一' : 'week_mon' ,
                  '周二' : 'week_tue' ,
                  '周三' : 'week_wed' ,
                  '周四' : 'week_thu' ,
                  '周五' : 'week_fri',
                  '周六' : 'week_sat',
                  '周日' : 'week_sun'
              };
              var this_tit = d3.select(this.parentNode);
              var week_arr = this_tit.select('.logic-week')[0][0].innerText.split(' ');
              d3.select('#workName').property('value',this_tit.select('.logic-name')[0][0].innerText);
              container.selectAll('.click-week').classed('click-week',false);
              for(var i=0;i <week_arr.length; i++){
                  var editWeek = container.select('.week-btn-group').select('.' + week[week_arr[i]]);
                  editWeek.classed('click-week',true);
                  editWeek.classed('weekBtnBan',false);
              }
          });

          scheduleDel.on('click',function(){
              alertWindow('确定要删除该日程吗？',true);
              d3.select('.determine-btn').on('click',function(){_this.saveWork('delete',scheduleID);});
          });

      },
      /**
       * 更新每一条日程信息
       * @param data
       */
      updatePerInfo : function(data){
          var week = {
              all : '周一至周五',
              week_mon : '周一',
              week_tue : '周二',
              week_wed : '周三',
              week_thu : '周四',
              week_fri : '周五',
              'week_sat' :  '周六',
              'week_sun' :  '周日'
          };
          var scheduleID =  data.scheduleID;
          var time_range = data.time_range;
          var timeArray = time_range;
          // var start_time =  timeToMinute(time_range.start_time[0] + ':' + time_range.start_time[1]);
          // var end_time =  timeToMinute(time_range.end_time[0] + ':' + time_range.end_time[1]);

          var showPer = d3.select('#show_' + scheduleID);
          var weekStr = '';
          for(var i=0;i < data.week.length; i++){
              weekStr += week[data.week[i]] + ' ';
          }
          showPer.select('.logic-week').text(weekStr);
          showPer.select('.logic-name').text(data.name);
          showPer.select('#time' + scheduleID).datum() && showPer.select('#time' + scheduleID).datum().init(timeArray);

      },
      /**
       * 保存、编辑、删除工作时段信息
       * @param action
       * @param scheduleID
       * @returns {boolean}
       */
      saveWork : function(action,scheduleID){
          var _this = this;
          var groupContent = _this.container;
          var thisTimeAxis = groupContent.select('#time' + ( action == 'new' ? 'New' : scheduleID) + ' .timeAxis');
          if((action == 'edit' || action == 'new') && !_this.validate(thisTimeAxis))return false;

          var datum = {};
          data.some(function (d) {
              if(d.scheduleID == scheduleID){
                  datum = d;
                  return true;
              }
          })||data.push(datum);
          if(action != 'new'){
              datum.scheduleID = scheduleID;
          }
          else {
              scheduleID = randomID(10);
          }
          if(action == 'edit' || action == 'new'){
              var time_range = [];
              thisTimeAxis.selectAll(".fullTimeGroup").each(function () {
                  var tsStart = d3.select(this).select('.startFullGroup input')[0][0].value;
                  var tsEnd = d3.select(this).select('.endFullGroup input')[0][0].value;
                  time_range.push({
                      ts_start : timeToMinute(tsStart),
                      ts_end : timeToMinute(tsEnd)
                  });
              });
              var week = [];
              groupContent.selectAll('.click-week').each(function(){
                  var weekTmp = d3.select(this).attr('week');
                  if(weekTmp == 'all'){
                      week = ['week_mon','week_tue','week_wed','week_thu','week_fri','week_sat','week_sun'];
                  }else{
                      week.push(weekTmp);
                  }
              });
              datum.scheduleID = scheduleID
              datum.week = week;
              datum.time_range = time_range;
              datum.name = groupContent.select('#workName')[0][0].value;
          }
          else if(action == 'delete'){
              data = data.filter(function (d) {
                  if(d.scheduleID == scheduleID)return false;
                  return true;
              });
          }
          if( action == 'new' || (scheduleID != '' && (action == 'delete' || action == 'edit'))){
              if(action == 'delete') {
                  if (groupContent.select('#show_' + scheduleID).classed('edit')) {
                      _this.clearEdit();
                  }
                  alertWindow('删除成功');
                  groupContent.select('#show_' + scheduleID).remove().select(".time-div").datum().clearListener();
              }else{
                  if(action == 'new'){
                      _this.perScheduleInfo(scheduleID);
                      _this.updatePerInfo(datum);
                  }else{
                      _this.updatePerInfo(datum);
                  }
                  _this.clearEdit();
                  // groupContent.select('#show_' + data.worktime.work_time_id).classed('edit',false);
                  // groupContent.select('.edit-schedule-div').classed('edit',false);
                  // groupContent.select('.add-btn').attr('id','create_' + group).html('+');
                  // groupContent.select('#new').remove();
              }
              // _this.formatWeekBtn(datum.week);
              /*d3.json('/'+ LANGUAGE_CODE  +'/'+  this_app_name + '/worktime/')
                  .header("Content-Type", "application/x-www-form-urlencoded")
                  .post(jsonTod3string(workData), function(e, data){
                      if(!e){
                          if(data.status == 1){
                              if(action == 'delete') {
                                  if (d3.select('#show_' + id).classed('edit')) {
                                      _this.clearEdit();
                                  }
                                  alertWindow('删除成功');
                                  groupContent.select('#show_' + id).remove();
                              }else{
                                  if(action == 'new'){
                                      _this.perScheduleInfo(groupContent.select('.show-schedule-div'),data.worktime.work_time_id);
                                      update_work_info(data.worktime);
                                  }else{
                                      update_work_info(data.worktime);
                                  }
                                  groupContent.select('#show_' + data.worktime.work_time_id).classed('edit',false);
                                  groupContent.select('.edit-schedule-div').classed('edit',false);
                                  groupContent.select('.add-btn').attr('id','create_' + group).html('+');
                                  groupContent.select('#new').remove();
                                  empty_logic_form();
                              }
                              formatWeekBtn(groupContent.select('.week-btn-group'),data.valid_week);
                          }else{
                              alertWindow(data.error_messages,false);
                          }
                      }else{
                          alertWindow('请求错误',false);
                      }
                  });*/
          }else{
              alertWindow('id不能为空',false);
          }
      },

      setMonitor: function (flag) {
          var bool = flag?true:false;
          var btnOff = this.container.select(".on-off-btn.off");
          var btnOn = this.container.select(".on-off-btn.on");
          btnOff.classed("turn", !bool);
          btnOn.classed("turn", bool);
          monitor = bool;
          this.editable(bool);
      },

      editable: function (flag) {
          var container = this.container;
          container.classed("invalited", !flag);
          if(!flag)this.clearEdit(true);
      },

      /**
       * 加载数据
       * @param data
       */
      load: function (_data) {
          this.clear();
          monitor = _data.switch;
          this.setMonitor(monitor == "on");
          _data = JSON.parse(JSON.stringify(_data.schedule));
          for(var i in _data){
              _data[i].scheduleID = randomID(10);
              data.push(_data[i]);
              this.perScheduleInfo(_data[i].scheduleID);
              this.updatePerInfo(_data[i]);
          }
      },
      clear : function () {
          even_pot = {};
          data = [];
          this.clearEdit();
          this.container.selectAll(".per-schedule").each(function (d) {
              d3.select(this).select(".time-div").datum().clearListener();
          }).remove();
          this.container.select(".on-off-btn.on")[0][0].click();
          monitor = true;
          this.setMonitor(true);
      },
      validate : function (timeAxis) {
        if(!timeAxis.selectAll(".timeError").empty()){
            errorAlert(timeAxis);
            return false;
        }
          if(timeAxis.select('.fullTimeGroup').empty()){
              errorAlert(timeAxis);
              return false;
          }
          var groupContent = this.container;
          if(groupContent.select('.click-week').empty()){
              errorAlert(groupContent.select('.week-btn-group'));
              return false;
          }
          return true;
      }
  };
  return module;

  /**
   *“小时：分钟”转换为分钟
   * @param time
   * @returns {*}
   */
  function timeToMinute(time){
      var hour = parseInt(time.split(':')[0]);
      var minute = parseInt(time.split(':')[1]);
      return hour*60 + minute;
  }
})();
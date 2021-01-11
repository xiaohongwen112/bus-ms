/* eslint-disable */
(function () {
  var targetConfig = function (container,callback) {
      var _this = this;
      _this.node = $('<div class="config-container">' +
          '<ul class="tabs">' +
          '<li id="receiveConfig" class="active">①接收配置 </li>' +
          '<li id="alertConfig" class="">②告警配置 </li>' +
          '<li id="collectorConfig" class="">③采集器配置 </li>' +
          '<li id="scheduleConfig" style="display:none;">④交易日程 </li>' +
          '<li id="timeSequence" class="">④时序配置 </li>' +
          '</ul>' +
          '<div class="CSBtn">' +
          '<div class="config-btn" title="保存" id="saveConfig" ></div>' +
          '<div class="config-btn" title="关闭" id="clearConfig"></div>' +
          '</div>' +
          '<div class="config-content">' +
          '<div class="nav-content active-content" id="receiveConfigContent"></div>' +
          '<div class="nav-content" id="alertConfigContent"></div>' +
          '<div class="nav-content" id="collectorConfigContent"></div>' +
          '<div class="nav-content" id="scheduleConfigContent"></div>' +
          '<div class="nav-content" id="timeSequenceContent"></div>' +
          '</div>' +
          '</div>');
      container.append(_this.node);

      var receiveConfigContent = _this.node.find('#receiveConfigContent');
      var alertConfigContent = _this.node.find('#alertConfigContent');
      var collectorConfigContent = _this.node.find('#collectorConfigContent');
      var scheduleConfigContent = _this.node.find('#scheduleConfigContent');
      var timeSequenceContent = _this.node.find('#timeSequenceContent');
      var saveConfig = _this.node.find('#saveConfig');
      var clearConfig = _this.node.find('#clearConfig');

      _this.port_config = new portConfig(receiveConfigContent,'target');
      _this.ip_config = new ipConfig(receiveConfigContent);
      _this.alert_config = new alertConfig(alertConfigContent,'target');
      _this.collector_config = new collectorConfig(collectorConfigContent,'target');
      _this.schedule_config = new timeModule(d3.select(scheduleConfigContent[0]),'target');
      _this.timeSequenceConfig = new timeSequence(timeSequenceContent);
      _this.schedule_config.init([]);

      _this.data = {};
      _this.moniChange = false;

      _this.node.find('li').on('click',function () {
          var content = this.id + 'Content';
          _this.node.find('.active').removeClass('active');
          _this.node.find('.active-content').removeClass('active-content');
          $(this).addClass('active');
          _this.node.find('#' + content).addClass('active-content');
          if (content === 'timeSequenceContent') {
            _this.timeSequenceConfig.update(_this.data.collector[0].name);
          }
      });

      var arr = ["receiveConfig", "alertConfig", "collectorConfig"];
      saveConfig.on('click',function () {
          var flag = _this.valid();
          if(typeof callback === 'function' && flag){
              _this.getData();
              callback(_this.data);
          }
      });

      clearConfig.on('click',function () {
          _this.hide();
          _this.data = {};
      });
  };
  targetConfig.prototype = {
      show: function () {
          var _this = this;
          _this.node.addClass('showConfig');
          _this.node.find('.active').removeClass('active');
          _this.node.find('.active-content').removeClass('active-content');
          _this.node.find("#receiveConfig").addClass('active');
          _this.node.find('#receiveConfigContent').addClass('active-content');
      },
      hide: function () {
          var _this = this;
          _this.node.removeClass('showConfig');
          _this.clear();

      },
      update: function (data, servers, protocols, schedule, appName, ipObj) {
          var _this = this;
          _this.data = data;
          var intfName = data.collector[0].name;
          var settings = data.settings;
          _this.port_config.update(settings.filter.dst_ports, settings.link);
          _this.alert_config.update(data.alarmrules,appName,intfName);

          var ipList = JSON.parse(JSON.stringify(settings.filter.dst_ip_device));
          settings.filter.dst_ip_list.forEach(function (d,i) {
              if(!ipObj.hasOwnProperty(d)){
                  ipList.push({
                      ip: d,
                      device_name: null,
                      device_model: null,
                      device_type: null,
                      app_name: appName,
                      intf_name: intfName
                  });
                  _this.moniChange = true;
              }
          });
          _this.ip_config.update({appName: appName, intfName: intfName, ipList: ipList,ipObj: ipObj});


          var collSettings = {
              is_double_live: settings.is_double_live,
              correlated_group_name: settings.correlated_group_name,
              is_twoway_trade: settings.is_twoway_trade,
              is_master: settings.is_master,
              is_slave: settings.is_slave,
              correlated_trade_group_name: settings.correlated_trade_group_name,
          };
          _this.collector_config.update(collSettings, data.collector[0], servers, protocols);

          if(schedule.hasOwnProperty('schedule')) _this.schedule_config.load(schedule);

          _this.valid();

      },
      getData: function () {
          var _this = this;
          var ipList = [];
          for(var i=0;i <  _this.ip_config.ipList.length;i++){
              ipList.push( _this.ip_config.ipList[i].ip);
          }
          _this.data.settings.filter.dst_ip_list = ipList;
          _this.data.settings.filter.dst_ip_device = _this.ip_config.ipList;
          _this.data.settings.filter.dst_ports = _this.port_config.port;
          _this.data.settings.link = _this.port_config.mode;
          _this.data.settings.is_double_live =  _this.collector_config.settings.is_double_live;
          _this.data.settings.correlated_group_name =  _this.collector_config.settings.correlated_group_name;
          _this.data.settings.is_twoway_trade =  _this.collector_config.settings.is_twoway_trade;
          _this.data.settings.is_master =  _this.collector_config.settings.is_master;
          _this.data.settings.is_slave =  _this.collector_config.settings.is_slave;
          _this.data.settings.correlated_trade_group_name =  _this.collector_config.settings.correlated_trade_group_name;
          _this.data.collector[0] = JSON.parse(JSON.stringify(_this.collector_config.collector));
          _this.data.alarmrules = JSON.parse(JSON.stringify(_this.alert_config.alarmRules));
          // Object.assign(_this.data.settings, _this.collector_config.settings);
          _this.moniChange = _this.moniChange || _this.ip_config.moniChange;
      },
      clear: function () {
          var _this = this;
          $('.configErrorTip').remove();
          _this.port_config.clear();
          _this.ip_config.clear();
          _this.alert_config.clear();
          _this.collector_config.clear();
          _this.schedule_config.clear();
      },
      valid: function () {
          var _this = this;
          var flag = true;
          var portFlag = _this.port_config.valid();
          var ipFlag = _this.ip_config.valid();
          if(portFlag && ipFlag){
              _this.node.find('#receiveConfig').removeClass('error-tab');
          }else{
              _this.node.find('#receiveConfig').addClass('error-tab');
              flag = false;
          }
          if(_this.alert_config.valid()){
              _this.node.find('#alertConfig').removeClass('error-tab');
          }else{
              _this.node.find('#alertConfig').addClass('error-tab');
              flag = false;
          }

          if(_this.collector_config.valid()){
              _this.node.find('#collectorConfig').removeClass('error-tab');
          }else{
              _this.node.find('#collectorConfig').addClass('error-tab');
              flag = false;
          }
          return flag;
      }
  };

  window.TargetConfig = targetConfig;


  var timeSequence = function timeSequence(container) {
    this.$el = $('<div class="time-sequence">' +
      '<div class="time-sequence-ctrl"></div>' +
      '<div class="time-sequence-timelines"></div>' +
      '<div class="time-sequence-bindings"></div>' +
      '<div class="time-sequence-weeks"></div>' +
    '</div>');

    var self = this;
    var ctrlCbs = {
      create: function () {
        self.$timelines.create();
        self.$timeWeeks.toggleDisable();
      },
      saveSuccessFn(v) {
        self.$timelines.rmCreate();
        self.$ctrls.toStatus('normal');
        self.update.bind(self)(v);
      },
      save: function (vals) {
        var a = self.getCurrentEditing();

        if (a.time.length === 0){
          self.$timelines.getActiveLine().blink();
          return;
        }

        var wv = self.$timeWeeks.getSelected().toString();
        vals.logic_time_id = a.id;
        vals.time_range = JSON.stringify(a.time);
        vals.week = wv;
        if (self.$timelines.$newLine) {
          delete vals.logic_time_id;
        }
        vals.intf = self.intf;
        console.log(vals);
        self.saveLine(vals, this.saveSuccessFn);
      },
      cancel: function () {
        self.$timelines.rmCreate();
        self.$timelines.deActiveAll();
        self.$timeWeeks.toggleDisable();
        self.update(self.intf);
      }
    };

    var timelinesCbs = {
      edit: function (vals) {
        self.$ctrls.update(vals);
        self.$ctrls.toStatus('active');
        self.$timeWeeks.toggleDisable();
      },
      remove: function (id) {
        alertWindow('确定要删除该时段吗？',true);
        d3.select('.determine-btn').on('click', function () {
          self.removeTimeLine(id, self.update.bind(self));
        });
      }
    };

    var weekCb = function (weeks) {
      if (weeks.length === 0) {
        self.$timeWeeks.blink();
        return;
      }
      self.saveWeek(weeks, self.intf);
    };

    this.$ctrls = new timeSequenceCtrl(this.$el.find('.time-sequence-ctrl'), ctrlCbs);
    this.$timelines = new timeSequenceLines(this.$el.find('.time-sequence-timelines'), timelinesCbs);
    this.$timeWeeks = new timeSequenceWeeks(this.$el.find('.time-sequence-weeks'), weekCb);
    container.append(this.$el);

    this.appName = window.location.pathname.split('/')[2];
    this.intf = null;

    var self = this;
    setTimeout(function () {
      self.getNames(self.initNameSelect.bind(self));
    }, 1000);

    return this;
  }

  timeSequence.prototype = {
    jsonXform: function (json_data){
      var string = '';
      for(var key in json_data){
          string += key + '=' + encodeURIComponent(json_data[key]);
          string += '&';
      }
      return string.substring(0,string.length-1);
    },
    saveLine: function(vals, cb) {
      vals.csrfmiddlewaretoken = window.csrf_token;
      var self = this;

      d3.json('/' + window.LANGUAGE_CODE + '/' + this.appName + '/logictime/save/')
        .header("Content-Type", "application/x-www-form-urlencoded")
        .post(this.jsonXform(vals), function (e, data) {
          if (!e && data.status == 'ok') {
            console.log(data);
            if(cb) cb(self.intf);
          } else {
            window.alertWindow(data.errors, false);
          }
        }
      );
    },
    getNames: function (cb) {
      d3.json('/' + window.LANGUAGE_CODE + '/' + this.appName + '/timeaxis/type/data/')
        .header("Content-Type", "application/x-www-form-urlencoded")
        .get('csrfmiddlewaretoken=' + window.csrf_token, function (e, data) {
          if (!e) {
            console.log(data);
            if (cb) cb(data.type_doc);
          }
        });
    },
    getTimeLines: function (intf, cb) {
      var data = {
        'csrfmiddlewaretoken' : window.csrf_token,
        'intf' : intf,
      };
      d3.json('/' + window.LANGUAGE_CODE + '/' + this.appName + '/logictime/')
        .header("Content-Type", "application/x-www-form-urlencoded")
        .post(this.jsonXform(data), function (e, data) {
          if (!e) {
            console.log(data);
            if (cb) cb(data.logic_time_docs);
          }
        });
    },
    saveWeek: function (weeks, intf) {
      var data = {
        update_week: 1,
        week: weeks,
        csrfmiddlewaretoken: window.csrf_token,
        add: true,
        intf: intf
      };

      d3.json('/' + window.LANGUAGE_CODE + '/' + this.appName + '/logictime/save/')
        .header("Content-Type", "application/x-www-form-urlencoded")
        .post(this.jsonXform(data), function (e, data) {
          if (!e && data.status === 'ok') {
            window.alertWindow(data.msg,false);
          } else {
            window.alertWindow(data.errors, false);
          }
        });
    },
    saveTimeLine: function (vals) {
      d3.json('/' + window.LANGUAGE_CODE + '/' + this.appName + '/logictime/save/')
        .header("Content-Type", "application/x-www-form-urlencoded")
        .post(this.jsonXform(vals), function (e, data) {
          if (data.status == 'ok') {
            console.log(data);
          }
        });
    },
    removeTimeLine: function (id, cb) {
      var data = {
        'logic_time_id': id,
        'csrfmiddlewaretoken': csrf_token
      };
      var self = this;
      d3.json('/' + window.LANGUAGE_CODE + '/' + this.appName + '/logictime/delete/')
        .header("Content-Type", "application/x-www-form-urlencoded")
        .post(this.jsonXform(data), function (e, res) {
          console.log(res);
          if (!e && res.status === 'ok') {
            window.alertWindow('删除成功');
            if (cb) cb(self.intf);
          } else {
            window.alertWindow('删除失败');
          }
        });
    },
    initNameSelect: function (vals) {
      this.$ctrls.initNameSelect(vals);
    },
    initLines: function (vals) {
      this.$timelines.rmCreate();
      this.$timelines.drawLines(vals);
      this.$ctrls.toStatus('normal');
      this.$timeWeeks.$el.removeClass('disabled');
      console.log(vals);
      if (vals.length > 0) {
        this.$timeWeeks.update(vals[0].week);
      } else {
        this.$timeWeeks.update('all');
      }
    },
    update: function (intf) {
      this.intf = intf;
      this.getTimeLines(intf, this.initLines.bind(this));
    },
    getCurrentEditing() {
      var lineVal = this.$timelines.getActiveVals();
      return lineVal;
    },
  };

  var timeSequenceCtrl = function timeSequenceCtrl(container, cbs) {
    this.$el = $(
      '<div class="time-line-name">' +
        '<span class="beauty"></span>' +
        '<span class="logic-name">名称</span>' +
        '<div class="select-app-name">'+
          '<select value="" id="time-name-select">' +
          '</select>' +
        '</div>' +
        '<span id="to-change-code"></span>' +
      '</div>' +
      '<div class="status-code">' +
        '<span class="beauty"></span>' + 
        '<span class="time-sequence-status-code logic-name">状态码</span>' +
        '<span id="ret-code"></span>' +
      '</div>' +
      '<div class="select-buffer-name">' + 
        '<span class="beauty"></span>' + 
        '<span class="logic-name">缓冲时间前后</span>' +
        '<select id="buffer-select">' +
        '</select>' + 
        '<span class="logic-name">分钟</span>' +
      '</div>' +
      '<div class="start-end-name">' +
        '<span class="beauty"></span>' +
        '<span class="logic-name">时序类型</span>' +
        '<select id="start-end-select">' +
          '<option value="其他时序">其他时序</option>' + 
          '<option value="业务开始">业务开始</option>' +
          '<option value="业务终止">业务终止</option>' + 
        '</select>' +
      '</div>' +
      '<div class="ctrls-btn">' +
        '<a id="create" class="add-btn" href="#">+</a>' +
        '<a id="edit" class="add-btn" href="#">保存</a>' + 
        '<a id="cancel" class="add-btn clear-btn" href="#">取消</a>' +
      '</div>'
    );

    var self = this;

    this.$timeNameSelect = this.$el.find('#time-name-select');
    this.$retCode = this.$el.find('#ret-code');
    this.$bufferSelect = this.$el.find('#buffer-select');
    this.$toChangeCodeBtn = this.$el.find('#to-change-code');
    this.$type = this.$el.find('#start-end-select');
    this.$createBtn = this.$el.find('#create');
    this.$saveBtn = this.$el.find('#edit');
    this.$cancelBtn = this.$el.find('#cancel');

    [0, 1, 2, 3, 5, 10, 15, 30].forEach(function (v) {
      var padding;
      if (v < 10) padding = "&nbsp&nbsp&nbsp&nbsp";
      else padding = "&nbsp&nbsp&nbsp";
      self.$bufferSelect.append('<option value="'+ v +'">'+ padding + v + '</option>');
    });

    this.bindFns(cbs);

    container.append(this.$el);
    this.toStatus('normal');

    this.autoComplete = new AutoComplete("app_logic_name", "show-app-logic-name", []);
    if (!d3.select("#app_logic_name").empty()) {
      document.getElementById("app_logic_name").onkeyup = function (event) {
        if (d3.select("#show-app-logic-name").empty()) {
          select_app_name.append("div").attr({
            class: "auto hidden",
            id: "show-app-logic-name"
          });
          autoComplete = new AutoComplete("app_logic_name", "show-app-logic-name", select_all);
        }
        autoComplete.start(event);
      }
    }

    this.$timeNameSelect.change(function (e) {
      self.$retCode.text($(this).val());
    });

    return this;
  }

  timeSequenceCtrl.prototype = {
    bindFns: function (cbs) {
      var defaultCb = function () {};

      cbs.toChangeCode = cbs.toChangeCode || defaultCb;
      cbs.cancel = cbs.cancel || defaultCb;
      cbs.save = cbs.save || defaultCb;
      cbs.create = cbs.create || defaultCb;

      var self = this;

      this.$toChangeCodeBtn.click(function () {
        self.toStatus('disabled');
        cbs.toChangeCode();
      });
      this.$createBtn.click(function () {
        self.toStatus('active');
        cbs.create();
      });
      this.$saveBtn.click(function () {
        cbs.save(self.getVals.bind(self)());
        // self.toStatus('normal');
      });
      this.$cancelBtn.click(function () {
        self.toStatus('normal');
        cbs.cancel();
      })
    },
    initNameSelect: function (vals) {
      var self = this;
      vals.forEach(function (v) {
        self.$timeNameSelect.append('<option value="'+ v.ret +'">' + v.name + '</option>');
      });
    },
    toStatus(status) {
      var $parent = this.$el.parent();
      if ($parent.length === 0) {
        console.error('NOT in DOM');
        return;
      }
      $parent.removeClass('active').removeClass('disabled');
      this.$createBtn.show();
      this.$saveBtn.hide();
      this.$cancelBtn.hide();
      if (status === 'active') {
        $parent.addClass('active');
        this.$createBtn.hide();
        this.$saveBtn.show();
        this.$cancelBtn.show();
      } else if (status === 'disabled') {
        $parent.addClass('disabled');
      }
    },
    update: function (vals){
      this.$timeNameSelect.val(vals.ret_code);
      this.$retCode.text(vals.ret_code);
      this.$bufferSelect.val(vals.buffer_time);
      this.$type.val(vals.type);
    },
    getVals: function() {
      if (!this.$el.parent().hasClass('active')) return null;
      var rc = this.$timeNameSelect;
      return {
        time_range:[{"TimeAll":556}],
        name: rc.find('option[value="'+ rc.val() +'"]').text(),
        ret_code: rc.val(),
        type: this.$type.val(),
        buffer_time: this.$bufferSelect.val().trim(),
        week: 'week_tue,week_wed',
        logic_time_id: 'v9cuwa8a7ilt',
      };
    },
  };

  var timeSequenceLines = function timeSequenceLines(container, cbs) {
    this.$el = $('<div>');
    this.$lines = [];
    this.$newLine = null;

    var self = this;
    this.cbs = {
      edit: function (vals, line) {
        var activeLine = self.getActiveLine();
        if (activeLine && self.$newLine) {
          self.rmCreate();
          activeLine = line;
          activeLine.toggleStatus();
          cbs.edit(vals);
          return;
        }
        if (activeLine === line) return;
        if (!activeLine) {
          line.toggleStatus();
          cbs.edit(vals);
        }
        else activeLine.blink();
      },
      remove: function (id) {
        cbs.remove(id);
        // var activeLine = self.getActiveLine();
        // if (!activeLine || activeLine.$timeDiv.attr('id') == id) cbs.remove(id);
        // else activeLine.blink();
      }
    };

    container.append(this.$el);
  }

  timeSequenceLines.prototype = {
    create: function () {
      if (this.$newLine) return;
      var a = new timeSequenceLine(this.$el, this.cbs, true);
      a.update();
      a.draw();
      a.toggleStatus();
      this.$newLine = a;
    },
    rmCreate: function () {
      if (this.$newLine) this.$newLine.remove();
      this.$newLine = null;
    },
    update: function (vals) {
      vals.forEach(function (val, i) {
        this.$lines[i].update(val);
      });
    },
    clearAll: function () {
      this.$lines.forEach(function ($line) {
        $line.remove();
      });
      this.$lines = [];
    },
    drawLines: function (vals) {
      var self = this;
      this.clearAll();
      vals.forEach(function (val) {
        var a = new timeSequenceLine(self.$el, self.cbs);
        a.update(val);
        a.draw(val);
        self.$lines.push(a);
      });
    },
    getActiveLine: function () {
      var activeLines = this.$lines.filter(function (l) {
        return l.$el.hasClass('active');
      });
      if(activeLines.length !== 0) return activeLines[0];
      else if (this.$newLine) return this.$newLine;
      return null;
    },
    getActiveVals: function () {
      return this.getActiveLine().getVals();
    },
    deActiveAll: function () {
      this.$lines.forEach(function (line, v) {
        line.deActive();
      })
    }
  };

  var timeSequenceLine = function timeSequenceLine(container, cbs, before) {
    this.$el = $(
      '<div class="per-schedule">' +
        '<div class="per-schedule-tit">' +
          '<span class="schedule-note logic-name">业务截止</span>' +
          '<span class="schedule-repeat logic-type">其他时序</span>' +
          '<span class="schedule-label logic-ret-label">状态码: </span>' +
          '<span class="schedule-text logic-ret-code">20</span>' +
          '<span class="logic-buffer">缓冲: </span>' +
          '<span class="logic-buffer-hidden">0</span>' +
          '<span class="logic-buffer-time">分钟</span>' +
          '<a href="#" class="schedule-tit-btn edit">编辑</a>' +
          '<a href="#" class="schedule-tit-btn remove">删除</a>' +
        '</div>' +
        '<div class="per-schedule-time">' +
          '<span class="per-time-name">关键时点</span>' +
          '<div class="time-div" id="abc"></div>' +
        '</div>' + 
      '</div>'
    );

    this.$tit = this.$el.find('.per-schedule-tit');
    this.$name = this.$el.find('.logic-name');
    this.$type = this.$el.find('.logic-type');
    this.$retCode = this.$el.find('.logic-ret-code');
    this.$bufferTime = this.$el.find('.logic-buffer-hidden');
    this.$timeDiv = this.$el.find('.time-div');
    this.$editBtn = this.$el.find('a.edit');
    this.$removeBtn = this.$el.find('a.remove');

    this.bindFns(cbs);
    if (before) container.prepend(this.$el);
    else container.append(this.$el);
    this.$timeAxis = null;
  }

  timeSequenceLine.prototype = {
    draw: function (val) {
      if (val && val.buffer !== undefined) {
        this.$timeAxis = new window.timeAxisHmSp(d3.select(this.$el.find('.time-div')[0]), val.buffer).init(val.time_range);
      } else {
        this.$timeAxis = new window.timeAxisHmSp(d3.select(this.$el.find('.time-div')[0]), 0);
      }
    },
    update: function(vals) {
      // this.toggleStatus();
      if (!vals){
        this.$tit.hide();
      }
      else {
        this.$name.text(vals.name);
        this.$type.text(vals.type);
        this.$retCode.text(vals.ret_code);
        this.$bufferTime.text(vals.buffer);
        this.$timeDiv.attr('id', 'a-'+vals.logic_time_id);
      }
    },
    getVals: function () {
      var ts = [];
      var d = d3.select(this.$el[0]).select('.timeAxis .fullTimeGroup');
      d.each(function(d){ts.push(d);});
      return {
        id: this.$timeDiv.attr('id').substring(2),
        time: ts,
      };
    },
    deActive: function () {
      this.$el.removeClass('active');
    },
    active: function () {
      this.$el.addClass('active');
    },
    toggleStatus: function () {
      if (this.$el.hasClass('active')) this.deActive();
      else this.active();
    },
    bindFns: function (cbs) {
      var defaultCb = function () {};

      cbs.edit = cbs.edit || defaultCb;
      cbs.remove = cbs.remove || defaultCb;

      var self = this;

      this.$editBtn.click(function () {
        // self.toggleStatus();
        var vals = {
          ret_code: self.$retCode.text(),
          type: self.$type.text(),
          buffer_time: self.$bufferTime.text()
        };
        cbs.edit(vals, self);
      });

      this.$removeBtn.click(function () {
        cbs.remove(self.getVals().id);
      });
    },
    blink: function () {
      var self = this;
      self.$el.addClass("highPoint");
      setTimeout(function(){
        self.$el.removeClass("highPoint");
      },300);
    },
    remove: function () {
      this.$el.remove();
    }
  };

  var timeSequenceWeeks = function timeSequenceWeeks(container, saveFn) {
    this.$el = $(
      '<div>' +
      '<div class="week-btn-group">' +
        '<a week="all" class="week-btn all clicked" href="#">全</a>' + 
        '<a week="week_mon" class="week-btn week_mon" href="#">一</a>' +
        '<a week="week_tue" class="week-btn week_tue" href="#">二</a>' + 
        '<a week="week_wed" class="week-btn week_wed" href="#">三</a>' + 
        '<a week="week_thu" class="week-btn week_thu" href="#">四</a>' + 
        '<a week="week_fri" class="week-btn week_fri" href="#">五</a>' + 
        '<a week="week_sat" class="week-btn week_sat" href="#">六</a>' +
        '<a week="week_sun" class="week-btn week_sun" href="#">日</a>' + 
      '</div>' + 
      '<a class="week-update">保存</a>' + 
      '</div>'
    );

    this.saveFn = saveFn;

    this.$el.find('a.week-btn').click(this.toggleWeekSelect);
    this.$el.find('.week-update').click(this.save.bind(this));

    container.append(this.$el);
    return this;
  }

  timeSequenceWeeks.prototype = {
    save: function () {
      var vals = this.getSelected();
      this.saveFn(vals.toString());
    },
    update: function (vals) {
      if (!Array.isArray(vals)) vals = [vals];
      var self = this;
      this.$el.find('a.week-btn').removeClass('clicked');
      vals.forEach(function (v) {
        self.$el.find('a[week='+v+']').addClass('clicked');
      });
    },
    getSelected: function () {
      var clicked = this.$el.find('.clicked');
      if (clicked.hasClass('all')) clicked = $(clicked).siblings();
      return clicked.map(function (i) {
        return $(this).attr('week');
      }).toArray();
    },
    toggleWeekSelect: function (e) {
      var weekDay = $(e.target);
      if (weekDay.hasClass('clicked')) weekDay.removeClass('clicked');
      else weekDay.addClass('clicked');
      if (weekDay.attr('week') === 'all' && weekDay.hasClass('clicked')) {
        $(this).siblings().removeClass('clicked');
        weekDay.addClass('clicked');
      } else if (weekDay.attr('week') !== 'all' && weekDay.hasClass('clicked')) {
        $($(this).siblings()[0]).removeClass('clicked');
      }
    },
    toggleDisable: function () {
      if (this.$el.hasClass('disabled')) this.$el.removeClass('disabled');
      else this.$el.addClass('disabled');
    },
    blink: function () {
      var self = this;
      self.$el.find('.week-btn-group').addClass("highPoint");
      setTimeout(function(){
        self.$el.find('.week-btn-group').removeClass("highPoint");
      },300);
    },
  };

  function AutoComplete(input, auto, arr) {
    this.obj = document.getElementById(input);
    this.autoObj = document.getElementById(auto);
    this.search_value = ""; //当前的搜索输入值
    this.index = -1; //当前选中的DIV的索引
    this.value_arr = arr; //数据库中供检索的值 不包含重复值
  }

  AutoComplete.prototype = {
    // 初始化
    init: function () {
      var self = this;
      setClass.removeClass(self.autoObj, "hidden");
      this.autoObj.style.left = 0 + "px";
      this.autoObj.style.top = 26 + "px";
    },
    //删除自动完成需要的所有DIV
    deleteDIV: function () {
      while (this.autoObj.hasChildNodes()) {
        this.autoObj.removeChild(this.autoObj.firstChild);
      }
      setClass.addClass(this.autoObj, "hidden");
    },
    autoOnmouseover: function (index) {
      if (index != this.index) {
        setClass.addClass(this.autoObj.children[index], "on");
        setClass.removeClass(this.autoObj.children[this.index], "on");
        this.index = index;
      }
    },
    setValue: function (self) {
      return function () {
        self.obj.value = this.seq;
        setClass.addClass(self.autoObj, "hidden");
        d3.select("#ret_code").html(this.title);
        self.removeOut(self.autoObj);
      }
    },
    // 响应键盘
    pressKey: function (event) {
      var code = event.keyCode;
      var length = this.autoObj.children.length;
      if (code == 38) { //↑
        if (d3.selectAll(".auto_out").empty()) {
          return;
        }
        setClass.removeClass(this.autoObj.children[this.index], "on");
        this.index--;
        if (this.index < 0) {
          this.index = length - 1;
        }
        setClass.addClass(this.autoObj.children[this.index], "on");
        this.obj.value = this.autoObj.children[this.index].seq;
        d3.select("#ret_code").html(this.autoObj.children[this.index].title);
      } else if (code == 40) { //↓
        if (d3.selectAll(".auto_out").empty()) {
          return;
        }
        setClass.removeClass(this.autoObj.children[this.index], "on");
        this.index++;
        if (this.index > length - 1) {
          this.index = 0;
        }
        setClass.addClass(this.autoObj.children[this.index], "on");
        this.obj.value = this.autoObj.children[this.index].seq;
        d3.select("#ret_code").html(this.autoObj.children[this.index].title);
      } else { //回车
        if (d3.selectAll(".auto_out").empty()) {
          return;
        }
        this.obj.value = this.autoObj.children[this.index].seq;
        d3.select("#ret_code").html(this.autoObj.children[this.index].title);
        setClass.addClass(this.autoObj, "hidden");
        this.removeOut(this.autoObj);
        this.index = -1;
      }
    },
    //删除auto_out
    removeOut: function (self) {
      //      var autoOut = document.getElementsByClassName(auto);
      self.remove();
    },
    // 程序入口
    start: function (event) {
      event = event || window.event;
      var code = event.keyCode;
      var self = this;
      if (code != 13 && code != 38 && code != 40) {
        this.init();
        this.deleteDIV();
        this.search_value = this.obj.value;
        var valueArr = this.value_arr.unique();
        //去掉前后空格不能为空
        if (this.obj.value.replace(/(^\s*)|(\s*$)/g, "") == "") {
          return;
        }
        //判断数组中是否含有输入的关键字
        try {
          var reg = new RegExp("(" + this.obj.value + ")", "i"); //输入"aaa" 则 reg = /(aaa)/i
        } catch (e) {
          alert(e.message);
        }
        var div_index = 0; //记录匹配索引个数
        for (var i = 0; i < valueArr.length; i++) {
          if (reg.test(valueArr[i].name)) {
            var div = document.createElement("div");
            div.className = "auto_out";
            div.title = valueArr[i].ret;
            div.seq = valueArr[i].name;
            div.index = div_index;
            div.innerHTML = valueArr[i].name.replace(reg, "<span>$1</span>");
            this.autoObj.appendChild(div);
            setClass.removeClass(this.autoObj, "hidden");
            div_index++;
            if (div_index == 1) {
              setClass.addClass(this.autoObj.firstChild, "on");
              this.index = 0;
            }
            div.onmouseover = function () {
              self.autoOnmouseover(this.index);
            }
            div.onclick = this.setValue(self);
          }
        }
      } else {
        this.pressKey(event);
      }
    }
  }

  var portConfig = function (container) {
      var _this = this;
      _this.mode = '';
      _this.port = [];
      _this.node = $('<div class="nav-row port-row connet">' +
          '<span class="name-span">连接模式</span>' +
          '<select class="port-input" id="mode">' +
          '<option value="STC">常规连接</option>' +
          '<option value="SLLTC">TCP长连接</option>' +
          '<option value="DALLTC">异步双工</option>' +
          '</select>' +
          '</div>'+
          '<div class="nav-row port-row">' +
          '<span class="name-span">端口</span>' +
          '<input id="distPort" class="port-input" autocomplete="off" placeholder="0-65535之间，区间用-连接，多个端口用,隔开">' +
          '</div>');
      container.append(_this.node);

      _this.tab = container.closest('.config-container').find('#' + container.attr('id').replace('Content',''));


      _this.node.find('#distPort').on('input',function () {
          var ele = this;
          var obj = validatePort(ele.value);
          if(obj.bool){
              removeError($(ele));
              _this.removeTabError();
              _this.port = ele.value.split(',');
          }else{
              error($(ele),obj.tip);
          }
      });
      _this.node.find("select").on('change',function () {
          _this.mode = this.value;
      });
  };
  portConfig.prototype = {
      update: function (port, mode) {
          var _this = this;
          _this.mode = mode;
          _this.port = port;
          if(mode === ''){
              _this.node.find('select option:first').prop('selected',true);
          }else{
              _this.node.find('select').val(mode);
          }
          _this.node.find('input').val(port.join(','));
      },
      valid: function () {
          var _this = this;
          var flag = true;
          if(_this.node.find('.error-input').length > 0){
              flag = false;
          }else if(_this.node.find('select').val() === ''){
              error(_this.node.find('select'),'不可为空');
              flag = false;
          }else if(_this.node.find('input').val() === ''){
              error(_this.node.find('input'),'不可为空');
              flag = false;
          }
         return flag;
      },
      clear: function () {
          var _this = this;
          _this.node.find('.error-input').removeClass('error-input');
          _this.node.find('input').val('');
      },
      removeTabError: function() {
          var _this = this;
          if( _this.tab.has('error-tab')){
              if(_this.valid() && _this.node.closest('.nav-content').find('.error-input').length === 0){
                  _this.tab.removeClass('error-tab');
              }else{
                  _this.tab.addClass('error-tab');
              }
          }

      }
  }

  function validatePort(portIn) {
      var obj = {
          bool: true,
          tip: ''
      };
      if(portIn){
          const pattern = /(^[0]$)|(^[1-9]\d{0,3}$)|(^[1-5]\d{4}$)|(^6[0-4]\d{3}$)|(^65[0-4]\d{2}$)|(^655[0-2]\d$)|(^6553[0-5]$)/;
          const port = portIn.split(',');
          var isRepeat = false;
          obj.bool = port.every(function(item){
              if(port.indexOf(item) !== port.lastIndexOf(item)){
                  obj.tip = '端口中存在重复项';
                  return false;
              }else{
                  if (item.indexOf('-') > -1) {
                      const portSegment = item.split('-');
                      var portStart = parseInt(portSegment[0], 10);
                      var portEnd = parseInt(portSegment[1], 10);
                      if( !isNaN(portStart) && !isNaN(portEnd) && portEnd > portStart && portSegment.every(function (d) { return pattern.test(d); })){
                          return true;
                      }else{
                          obj.tip = '0-65535之间，区间用"-"连接，多个端口用","隔开';
                          return false;
                      }
                  }else if(!pattern.test(item)){
                      obj.tip = '0-65535之间，区间用"-"连接，多个端口用","隔开';
                      return false;
                  }else{
                      return true;
                  }
              }
          });
      }else{
          obj.tip = '端口号不能为空';
          obj.bool =  false;
      }
      return obj;
  }

  /**
   * 错误提示
   * @param ele
   * @param tip
   */
  function error(ele,tip) {
      ele.addClass('error-input');
      show_msgs(d3.select(ele[0]),tip,"top").classed('configErrorTip',true);
  }

  /**
   * 清除错提示
   * @param ele
   */
  function removeError(ele) {
      if(ele[0].tips)ele[0].tips.remove();
      ele.removeClass('error-input');
  }


})();
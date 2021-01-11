/* eslint-disable */
(function () {
  var collectorConfig = function (container,id,data) {
      var _this = this;
      _this.node = $(' <div class="coll-div coll-top">' +
          '<div class="model-div left-div" id="correlatedModel">' +
          '<input type="checkbox" class=""/>' +
          '<label >汇集模式</label>' +
          '<input maxlength="20"  type="text" autocomplete="off"/>' +
          '</div>' +
          '<div class="trade-div right-div" id="twowayTrade">' +
          '<input type="checkbox" >' +
          '<label ">双向交易</label>' +
          '<span class="radio-span">' +
          '<input name="tradeMaster" type="radio" class="master">' +
          '<label ">双向交易-主</label>' +
          '</span>' +
          '<span class="radio-span">' +
          '<input  name="tradeMaster"  type="radio" class="slave">' +
          '<label>双向交易-从</label>' +
          '<input maxlength="20" type="text" autocomplete="off" class="trade-name-input trade-name">' +
          '</span>' +
          '</div>' +
          '</div>' +
          '<div class="coll-div coll-mid">' +
          '<div class="input-div">' +
          '<label class="input-name">采集器名称<span style="color:red">*</span></label>' +
          '<input maxlength="20" autocomplete="off" type="text" id="collectorName">' +
          '</div>' +
          '<div class="input-div">' +
          '<label class="input-name">网口</label>' +
          '<select class="port-input " id="nicAddr" >' +

          '</select>' +
          '</div>' +
          '<div class="input-div">' +
          '<label class="input-name">协议</label>' +
          '<select class="port-input" id="protocols">' +
          '</select>' +
          '</div>' +
          '<div class="input-div">' +
          '<label class="input-name">服务器ID<span >*</span></label>' +
          '<select class="port-input" id="serverId">' +
          '</select>' +
          '</div>' +
          '</div>' +
          '<div class="coll-div coll-bottom">' +
          '<div class="proto-list">' +
          '<span class="proto-disp ellipsis">交易配置文件</span>' +
          '<span class="proto-text ellipsis">configuration.json</span>' +
          '</div>' +
          '<div class="proto-list">' +
          '<span class="proto-disp ellipsis">CSV配置文件</span>' +
          '<span class="proto-text ellipsis" id="csvFile"></span>' +
          '</div>' +
          '<div class="proto-list">' +
          '<span class="proto-disp ellipsis">Dp配置</span>' +
          '<span class="proto-text ellipsis">dp.xml</span>' +
          '</div>' +
          '<div class="proto-list">' +
          '<span class="proto-disp ellipsis">交易ID</span>' +
          '<span class="proto-text ellipsis" id="tradeId"></span>' +
          '</div>' +
          '<div class="proto-list">' +
          '<span class="proto-disp ellipsis">交易类型</span>' +
          '<span class="proto-text ellipsis" id="tradeType"></span>' +
          '</div>' +
          '<div class="proto-list">' +
          '<span class="proto-disp ellipsis">交易渠道</span>' +
          '<span class="proto-text ellipsis" id="tradeSub"></span>' +
          '</div>' +
          '<div class="proto-list">' +
          '<span class="proto-disp ellipsis">返回码</span>' +
          '<span class="proto-text ellipsis" id="retCodeInfo"></span>' +
          '</div>' +
          '<div class="proto-list">' +
          '<span class="proto-disp ellipsis">关联字段</span>' +
          '<span class="proto-text ellipsis">待定</span>' +
          '</div>' +
          '</div>');
      container.append(_this.node);

      _this.tab = container.closest('.config-container').find('#' + container.attr('id').replace('Content',''));

      _this.protocols = {};
      _this.servers = [];
      _this.settings = {};
      _this.collector = {
          name : '',
          disp_name : '',
          nic_addr : '',
          target_prot : '',
          server_id : ''
      };

      _this.init();
  }

  collectorConfig.prototype = {
      setSettings: function () {
          var obj = {};
          var _this = this;

          var correlatedModel = _this.node.find("#correlatedModel");
          var twowayTrade = _this.node.find("#twowayTrade  ");

          collectCheck(obj, 'is_double_live', correlatedModel.find('input[type="checkbox"]'));
          collectInput(obj, 'correlated_group_name', correlatedModel.find('input[type="text"]'));
          collectCheck(obj, 'is_twoway_trade', twowayTrade.find('input[type="checkbox"]'));
          collectCheck(obj, 'is_master', twowayTrade.find(".master"),true);
          collectCheck(obj, 'is_slave', twowayTrade.find(".slave"),true);
          collectInput(obj, 'correlated_trade_group_name', twowayTrade.find(".trade-name"));

          return obj;
      },
      // setCollector: function () {
      //     var obj = {};
      //     var _this = this;
      //
      //     collectInput(obj, 'disp_name', _this.node.find("#collectorName"));
      //     collectSelect(obj, 'nic_addr', _this.node.find("#nicAddr"));
      //     collectSelect(obj, 'target_prot', _this.node.find("#protocols"));
      //     collectSelect(obj, 'server_id', _this.node.find("#serverId"));
      //
      //     return obj;
      // },
      setCollector: function (data) {
          var _this = this;
          _this.collector.name = data.name;
          _this.setProtocols();
          data.nic_addr = (data.nic_addr === '' || data.nic_addr == null) ? _this.node.find("#nicAddr option:eq(0)").val() : data.nic_addr;
          data.target_prot = (data.target_prot === '' || data.target_prot == null) ? _this.node.find("#protocols option:eq(0)").val() : data.target_prot;
          data.server_id = (data.server_id === '' || data.server_id == null) ? _this.node.find("#serverId option:eq(0)").val() : data.server_id;

          _this.node.find("#collectorName").val(data.disp_name) ;
          checkSelect(_this.node.find("#nicAddr"),data.nic_addr,'网口');
          checkSelect(_this.node.find("#serverId"),data.server_id,'服务器ID');
          if(checkSelect(_this.node.find("#protocols"),data.target_prot,'协议')){
              _this.setProtocolsInfo(_this.node.find("#protocols").val());
          }
      },
      setServerId: function () {
          var _this = this;
          var serverId = _this.node.find("#serverId");
          var nicAddr = _this.node.find("#nicAddr");
          var servers = _this.servers;
          serverId.html('');
          nicAddr.html('');
          for(var i=0;i < servers.length;i++){
              serverId.append($('<option value="' + servers[i].server_id + '">' + servers[i].server_id + '</option>'));
              for(var j=0;j < servers[i].nices.length;j++){
                  nicAddr.append($('<option value="' + servers[i].nices[j] + '">' +  servers[i].nices[j] + '</option>'));
              }
          }
      },
      setProtocols: function (taretProt) {
          var _this = this;
          var protocolsEle = _this.node.find("#protocols");
          protocolsEle.html('');
          for(var key in _this.protocols){
              protocolsEle.append($('<option value="' + key + '">' + _this.protocols[key].config.display_name + '</option>'));
          }
      },
      setProtocolsInfo: function(key) {
          var _this = this;
          if(JSON.stringify(_this.protocols) === '{}')return;
          var protocolInfo = _this.protocols[key];
          var csv = '';
          protocolInfo.csv_files.forEach(function(d){ csv += d.name; });
          _this.node.find("#csvFile").html(csv);
          _this.node.find("#tradeId").html(protocolInfo.config.transaction_id);
          _this.node.find("#tradeType").html(protocolInfo.config.trans_type);
          _this.node.find("#tradeSub").html(protocolInfo.config.sub_trans_type);
          _this.node.find("#retCodeInfo").html(protocolInfo.config.ret_code);
      },
      init: function () {
          var _this = this;
          _this.settings = _this.setSettings();
          // _this.collector = _this.setCollector();
          _this.node.find("#twowayTrade input[type='text'],#correlatedModel input[type='text']").on('input',function(e){
              checkName(e);
              _this.removeTabError();
          });
          _this.node.find("#collectorName").on('input',function (e) {
              if(checkCollName(e)){
                  _this.collector.disp_name = this.value;
                  _this.removeTabError();
              }
          }) ;
          _this.node.find("#nicAddr").on('change',function () {_this.collector.nic_addr = this.value;});
          _this.node.find("#protocols").on('change',function () {_this.collector.target_prot = this.value;});
          _this.node.find("#serverId").on('change',function () {_this.collector.server_id = this.value;});
          _this.node.find("#protocols").on('change',function () {_this.setProtocolsInfo(this.value);});
          _this.node.find("select").on('change',function () {
              if($(this).hasClass('error-input')) {
                  removeError($(this));
                  _this.removeTabError();
              }
          });
      },
      update: function (settings, collector, servers, protocols) {
          var _this = this;
          _this.servers = servers || [];
          _this.protocols = protocols || {};
          _this.collector = collector;
          _this.setServerId();
          _this.setCollector(collector);
          var copyObj = function (obj1,obj2) {
              for(var key in obj1){
                  if(typeof obj1[key] === 'object'){
                      arguments.callee(obj1[key],obj2[key]);
                  }else{
                      obj1[key] = obj2[key];
                  }
              }
          }
          copyObj(_this.settings,settings);
          // copyObj(_this.collector,collector);
      },
      clear: function () {
          var _this = this;
          _this.node.find('.error-input').removeClass('error-input');
          // _this.node.find('input').val('');
          // _this.node.find('select option:first').prop('selected',true);
          // _this.node.find('radio:first').prop('checked',true);
      },
      valid: function () {
          var _this = this;
          var flag = true;
          _this.node.find('input[type="text"],select').each(function () {
              if($(this).closest('.disabled-alert').length === 0){
                  if($(this).hasClass('error-input')){
                      flag = false;
                  }else if(this.value === ''){
                      error($(this),'不可为空');
                      flag = false;
                  }
              }
          });
          return flag;
      },
      removeTabError: function() {
          var _this = this;
          if( _this.tab.has('error-tab')){
              if(_this.valid()){
                  _this.tab.removeClass('error-tab');
              }else{
                  _this.tab.addClass('error-tab');
              }
          }

      }
  }

  /**
   * 关联对象与checkbox
   * @param obj
   * @param propName
   * @param ele
   * @param isAuto
   */
  function collectCheck(obj, propName, ele, notDisable) {
      obj && Object.defineProperty(obj, propName, {
          enumerable: true,
          get: function () {
              return ele.prop('checked');
          },
          set: function (bool) {
              ele.prop('checked', bool);
              if(!notDisable){
                  if(bool){
                      clearDisabled(ele.closest('div'));
                  }else{
                      disabled(ele.closest('div'));
                  }
              }
          }
      });
      ele.on('change',function () {obj[propName] = this.checked;});
  }

  /**
   * 关联对象与psan
   * @param obj
   * @param propName
   * @param ele
   */
  function collectSpan(obj, propName, ele) {
      obj && Object.defineProperty(obj, propName, {
          enumerable: true,
          get: function () {
              return ele.text();
          },
          set: function (text) {
              ele.text(text);
          }
      });
  }

  /**
   * 关联对象与input
   * @param obj
   * @param propName
   * @param ele
   */
  function collectInput(obj, propName, ele) {
      var initVal = obj[propName];
      obj && Object.defineProperty(obj, propName, {
          enumerable: true,
          get: function () {
              if(!ele.hasClass('error-input')){
                  return ele.val();
              }else{
                  return initVal;
              }
          },
          set: function (val) {
              initVal = val;
              ele.val(val);
          }
      });
  }

  function collectSelect(obj, propName, ele) {
      obj && Object.defineProperty(obj, propName, {
          enumerable: true,
          get: function () {
              return ele.val();
          },
          set: function (val) {
              if(val === 'tcp_xml_template')debugger;
              if(val === ''){
                  ele.find('option:first').prop('selected',true);
              }else{
                  ele.val(val);
              }
          }
      });
      ele.on('change',function () {
          obj[propName] = this.value;
      });
  }

  function checkName(e) {
      var name = e.target.value;
      if(name){
          var pattern = /^[A-Za-z0-9]{1,20}$/;
          if(pattern.test(name)){
              removeError($(e.target));
          } else {
              error($(e.target),'只能输入字母或者数字,且长度不能超过20！');
          }
      }else{
          error($(e.target),'不能为空');
      }
  }

  function checkCollName(e) {
      var name = e.target.value;
      if(name){
          var pattern = /[&; ]/;
          if(pattern.test(name) || name.length > 20){
              error($(e.target),'不能存在"&",";"和空格,且长度不能超过20！');
              return false;
          } else {
              removeError($(e.target));
              return true;
          }
      }else{
          error($(e.target),'不能为空');
          return false;
      }
  }

  function checkSelect(ele,value,type) {
      var rightOption = ele.find("option[value='" + value + "']");
      if(rightOption.length > 0){
          rightOption.prop("selected", true);
          if(rightOption.prop("disabled")){
              error(ele,value + '不可使用，请选用其他' + type);
              return false;
          }else{
              return true;
          }
      } else {
          ele.append("<option value='" + value + "' disabled selected style='color: red !important;'>"+ value  +"(不存在且不可选)</option>");
          error(ele,value + '不可使用，请选用其他' + type);
          return false;
      }
  }

  /**
   * 禁用
   * @param ele
   */
  function disabled(ele) {
      ele.find('select,input[type="text"],input[type="radio"]').attr("disabled","disabled");
      ele.addClass('disabled-alert');
  }

  /**
   * 清除禁用状态
   * @param ele
   */
  function clearDisabled(ele) {
      ele.find('select,input[type="text"],input[type="radio"]').removeAttr("disabled");
      ele.removeClass('disabled-alert');
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


  window.collectorConfig = collectorConfig;
})();
/* eslint-disable */
(function () {
  var sourceConfig = function (container,callback) {
      var _this = this;
      _this.node = $('<div class="config-container">' +
          '<ul class="tabs">' +
          '<li id="sentConfig" class="active">发出配置 </li>' +
          '</ul>' +
          '<div class="CSBtn">' +
          '<div class="config-btn" title="保存" id="saveSourceConfig" ></div>' +
          '<div class="config-btn" title="关闭" id="clearScoureConfig"></div>' +
          '</div>' +
          '<div class="config-content">' +
          '<div class="nav-content active-content" id="sentConfigContent"></div>' +
          '</div>' +
          '</div>');
      container.append(_this.node);
      _this.node.find('li').on('click',function () {
          var content = this.id + 'Content';
          _this.node.find('.active').removeClass('active');
          _this.node.find('.active-content').removeClass('active-content');
          $(this).addClass('active');
          _this.node.find('#' + content).addClass('active-content');
      });

      var sentConfigContent = _this.node.find('#sentConfigContent');
      var saveConfig = _this.node.find('#saveSourceConfig');
      var clearConfig = _this.node.find('#clearScoureConfig');


      _this.port_config = new portConfig(sentConfigContent);
      _this.ip_config = new ipConfig(sentConfigContent,true);
      _this.data = {};
      _this.moniChange = _this.moniChange || _this.ip_config.moniChange;
      _this.name = '';

      saveConfig.on('click',function () {
          if(_this.valid() && typeof callback === 'function'){
              _this.getData();
              callback(_this.data, _this.name);
          }
      });
      clearConfig.on('click',function () {
          _this.hide();
          _this.data = {};
      });
  };
  sourceConfig.prototype = {
      show: function () {
          var _this = this;
          _this.node.addClass('showConfig');
      },
      hide: function () {
          var _this = this;
          _this.node.removeClass('showConfig');
          _this.clear();
      },
      update: function (data, name, app_name, intf_name, ipObj) {
          var _this = this;
          _this.data = data || {};
          _this.name = name || '';
          _this.port_config.update(data.src_ports);

          var ipList = data.src_ip_device ? JSON.parse(JSON.stringify(data.src_ip_device)) : [];
          data.src_ip_list.forEach(function (d,i) {
              if(!ipObj.hasOwnProperty(d)){
                  ipList.push({
                      ip: d,
                      device_name: null,
                      device_model: null,
                      device_type: null,
                      app_name: app_name,
                      intf_name: intf_name
                  });
                  _this.moniChange = true;
              }
          });
          _this.ip_config.update({appName: app_name,intfName: intf_name,ipList: ipList,ipObj: ipObj});

          _this.valid();
      },
      getData: function () {
          var _this = this;
          var ipList = [];
          for(var i=0;i <  _this.ip_config.ipList.length;i++){
              ipList.push( _this.ip_config.ipList[i].ip);
          }
          _this.data.src_ip_list = ipList;
          _this.data.src_ip_device = _this.ip_config.ipList;
          _this.data.src_ports = _this.port_config.port;
          _this.moniChange = _this.ip_config.moniChange;
      },
      valid: function () {
          var _this = this;
          return  _this.port_config.valid() && _this.ip_config.valid();
      },
      clear: function () {
          var _this = this;
          $('.configErrorTip').remove();
          _this.ip_config.clear();
          _this.port_config.clear();
      },
  };

  window.SourceConfig = sourceConfig;


  var portConfig = function (container) {
      var _this = this;
      _this.port = '';
      _this.node = $('<div class="nav-row port-row">' +
          '<span class="name-span">端口</span>' +
          '<input id="srcPort" class="port-input" autocomplete="off" placeholder="0-65535之间，区间用-连接，多个端口用,隔开">' +
          '</div>');
      container.append(_this.node);

      _this.node.find('#srcPort').on('input',function () {
          var ele = this;
          var obj = validatePort(ele.value);
          if(obj.bool){
              removeError($(ele));
              _this.port = ele.value.split(',');
          }else{
              error($(ele),obj.tip);
          }
      });
  };
  portConfig.prototype = {
      update: function (port) {
          var _this = this;
          _this.port = port || [];
          _this.node.find('input').val(port.join(','));
      },
      valid: function () {
          return this.node.find('.error-input').length === 0;
      },
      clear: function () {
          var _this = this;
          _this.node.find('.error-input').removeClass('error-input');
          _this.node.find('input').val('');

      }
  };

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
      }

      return obj;
  }

  // function validatePort(portIn) {
  //     var obj = {
  //         bool: true,
  //         tip: ''
  //     };
  //     const pattern = /(^[0]$)|(^[1-9]\d{0,3}$)|(^[1-5]\d{4}$)|(^6[0-4]\d{3}$)|(^65[0-4]\d{2}$)|(^655[0-2]\d$)|(^6553[0-5]$)/;
  //     const port = portIn.split(',');
  //     if (!port.every(function(item){
  //             if (item.indexOf('-') > -1) {
  //                 const portSegment = item.split('-');
  //                 return portSegment[1] > portSegment[0] && portSegment.every(function (d) { return pattern.test(d); });
  //             }
  //             return pattern.test(item);
  //         })) {
  //         obj.tip = '0-65535之间，区间用"-"连接，多个端口用","隔开';
  //         obj.bool = false;
  //     }else{
  //         obj.bool = true;
  //     }
  //     return obj;
  // }

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
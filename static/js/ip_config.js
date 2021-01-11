/* eslint-disable */
(function () {
  var ipConfig = function (container,ipNull) {
      var _this = this;

      _this.node = $('<div class="ipConfig">' +
          '<div class="ip-list-div list-div">' +
          '<div class="nav-row">' +
          '<span class="name-span">IP地址</span>' +
          '<input class="ip-input" placeholder="ip段用-连接，多个ip地址用,隔开" autocomplete="off">' +
          '<button class="ip-btn add-ip-btn" type="button" >+</button>' +
          '</div>' +
          '<div class="list-table ip-list-table">' +
          '<div class="ip-list-header">' +
          '<span class="col-item col-ip">IP</span>' +
          '<span class="col-item col-name">设备名称</span>' +
          '<span class="col-item col-model">设备型号</span>' +
          '<span class="col-item col-type">设备类型</span>' +
          '<span class="col-item col-op">操作</span>' +
          '<span class="col-item col-add"></span>' +
          '</div>' +
          '<div class="list-body ip-list-body">' +
          '</div>' +
          '</div>' +
          '</div>' +
          '</div>' +
          '</div>' +
          '</div>');

      container.append(_this.node);

      _this.tab = container.closest('.config-container').find('#' + container.attr('id').replace('Content',''));

      _this.app_name =  '';
      _this.intf_name =  '';
      _this.ip =  '';
      _this.ipList = [];
      _this.delIpList = [];
      _this.moniChange = false;
      _this.ipNull =ipNull || false;
      _this.ipObj = {};


      var ipInput = _this.node.find('.ip-input');
      var addIp = _this.node.find('.add-ip-btn');

      ipInput.on('input',function () {_this.ip = this.value;});
      addIp.on('click',function () {_this.ipInList();});
  };
  ipConfig.prototype = {
      ipInList: function () {
          var _this = this;
          const ipIn = _this.ip;
          const patten = /(^(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)$)/;
          const patten1 = /.\d+$/;
          const patten2 = /\d+/;
          var isRight = true;
          // var tip = '';
          const ipArr = [];
          if (ipIn) {
              ipIn.split(',').every(function(item) {
                  if (item.indexOf('-') > -1) {
                      const ipSegment = item.split('-');
                      isRight = ipSegment.every(function (d) { return patten.test(d); });
                      if (isRight && ipSegment[0].split(patten1)[0] === ipSegment[1].split(patten1)[0]) {
                          const start = Number(ipSegment[0].match(patten1)[0].match(patten2)[0]);
                          const end = Number(ipSegment[1].match(patten1)[0].match(patten2)[0]);
                          if (start < end) {
                              const net = ipSegment[0].split(patten1)[0];
                              for (var i = start; i < end + 1; i += 1) {
                                  ipArr.push(net + '.' + i);
                              }
                          } else {
                              isRight = false;
                              // tip = '同一网络ip段结束ip应大于起始ip';
                          }
                      } else {
                          isRight = false;
                          // tip = '请输入正确ip段';
                      }
                  } else {
                      isRight = patten.test(item);
                      ipArr.push(item);
                      // tip = 'ip范围为[0.0.0.0 - 255.255.255.255]，同一网络ip段用"-"连接，多个ip地址用","隔开！';
                  }
                  return isRight;
              });

              var input = _this.node.find('.ip-input');
              if (isRight) {
                  removeError(input);
                  _this.removeTabError();
                  ipArr.forEach(function(d){
                      if (!_this.ipList.some(function (item) { return item.ip === d; })) {
                          var  _data = {
                              ip: d,
                              device_name: null,
                              device_model: null,
                              device_type: null,
                              app_name: _this.app_name,
                              intf_name: _this.intf_name
                          };
                          if(_this.ipObj.hasOwnProperty(d)){
                              _data.device_name = _this.ipObj[d].device_name;
                              _data.device_model = _this.ipObj[d].device_model;
                              _data.device_type = _this.ipObj[d].device_type;
                          }
                          _this.ipList.push(_data);
                          _this.ipInListDom(_data);
                          _this.moniChange = true;
                      } else {
                          console.log('存在重复项，重复项未添加!');
                          error(input,'存在重复项，重复项未添加!');
                      }
                  });
                  _this.ip = '';
                  input.val('');
              } else {
                  console.log('同一网络ip段用"-"连接，多个ip地址用","隔开！');
                  error(input,'IP错误，网段用“-”连接，地址间用“，”分隔');
              }
          }
      },
      ipInListDom: function (data) {
          var _this = this;
          const  node = $('<div class="list-item">' +
              '<span class="col-item col-ip">' + data.ip + '</span>' +
              '<span class="col-item col-name"><input class="device-name" maxlength="20" value="' + (data.device_name || '') + '"></span>' +
              '<span class="col-item col-model"><input class="device-model" maxlength="20" value="' + (data.device_model || '') + '"></span>' +
              '<span class="col-item col-type"><input class="device-type" maxlength="20" value="' + (data.device_type || '' ) + '"></span>' +
              '<span class="col-item col-op"><a class="del-ip-btn del-ip" href="#" >删除</a></span>' +
              '</div>');
          _this.node.find('.ip-list-body').append(node);
          if(_this.ipList.length > 0 && _this.node.find('.ip-list-header').has('error-input')){
              removeError(_this.node.find('.ip-list-header'));
              _this.removeTabError();
          }
          node.find('.del-ip').on('click',function () {
              node.remove();
              _this.delIp(data.ip);
              if(!_this.ipNull && _this.ipList.length === 0){
                  flag = false;
                  error(_this.node.find('.ip-list-header'),'IP地址不能为空，请点击+进行添加');
              }else{
                  removeError(_this.node.find('.ip-list-header'));
              }
          });
          node.find('input').on('input',function () {
              var val = this.value;
              var check = checkName(val);
              if(check.bool){
                  _this.moniChange = true;
                  removeError($(this));
                  _this.removeTabError();
                  if(d3.select(this).classed('device-name')){
                      data.device_name = val;
                  } else if(d3.select(this).classed('device-model')){
                      data.device_model = val;
                  } else if(d3.select(this).classed('device-type')){
                      data.device_type = val;
                  }
              }else{
                  error($(this),check.tip);
              }
          });
      },
      delIp: function(ip) {
          var _this = this;
          _this.ipList.some(function(d, i) {
              if (d.ip === ip) {
                  _this.ipList.splice(i, 1);
                  _this.delIpList.push(ip);
                  _this.moniChange = true;
                  return true;
              }
              return false;
          });
      },
      clear: function () {
          var _this = this;
          _this.node.find('.error-input').removeClass('error-input');
          _this.node.find('input').val('');
          _this.node.find('select option:first').prop('selected',true);
          _this.node.find('.ip-list-body').html('');
      },
      update: function (data) {
          var _this = this;
          _this.node.find('.ip-list-body').html('');
          _this.ipList = data.ipList || [];
          _this.app_name =  data.appName || '';
          _this.intf_name =  data.intfName || '';
          _this.ipObj = data.ipObj || {};
          for(var i = 0; i< _this.ipList.length;i++){
              _this.ipInListDom(_this.ipList[i]);
          }
      },
      valid: function () {
          var _this = this;
          var flag = Array.prototype.slice.call(_this.node.find('.error-input')).every(function (d) {
              return d3.select(d).classed('name-input') || d3.select(d).classed('ip-input');
          });
          if(!_this.ipNull && _this.ipList.length === 0){
              flag = false;
              error(_this.node.find('.ip-list-header'),'IP地址不能为空，请点击+进行添加');
          }else{
              removeError(_this.node.find('.ip-list-header'));
          }
          return flag;
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
  };

  function findIpItem(list,ip) {
      var item = '';
      Array.prototype.slice.call(list).some(function(d, i) {
          if ($(d).find('.col-ip').text() === ip) {
              item = d;
              return true;
          }
          return false;
      });
      return item;
  }
  function checkName(name) {
      var patten1 = /[^a-zA-Z0-9\_\u4e00-\u9fa5]/;
      var patten2 = /^\s*[\s\S]{0,20}\s*$/;
      var tip = '';
      var bool = true;
      if(patten1.test(name)){
          tip = '不能包含除数字、英文字母、下划线、汉字外的其他字符';
          bool = false;
      } else {
          if(patten2.test(name)){
              bool = true;
              tip = '';
          } else {
              tip = '长度不能超过20';
              bool = false;
          }
      }
      return {
          bool: bool,
          tip: tip
      };
  }
  function error(ele,tip) {
      ele.addClass('error-input');
      show_msgs(d3.select(ele[0]),tip,"top").classed('configErrorTip',true);
  }
  function removeError(ele) {
      if(ele[0].tips)ele[0].tips.remove();
      ele.removeClass('error-input');
  }

  window.ipConfig = ipConfig;
})();
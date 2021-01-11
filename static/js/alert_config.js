/* eslint-disable */
(function () {
  var alertConfig = function (container) {
      var _this = this;
      _this.node = $('' +
          '<div class="flexTabRow checkRow">' +
          '<div class="headerFlex1">' +
          '<span class="warn_title_tip"></span>' +
          '<a href="#">发往Tivoli</a>' +
          '</div>' +
          '<div class="headerFlex2" id="tivoliBtn">' +
          '<a class="on-off-btn on turn" href="#">开启</a>' +
          '<a class="on-off-btn off" href="#">关闭</a>' +
          '</div>' +
          '</div>' +
          '<div class="flexTabRow checkRow paddingNone">' +
          '<div class="headerFlex1">' +
          '<span class="warn_title_tip"></span>' +
          '<a href="#">健康度告警</a>' +
          '</div>' +
          '<div class="perQuotaDiv" id="healthConfig">' +
          '<div class="autoBaselineDiv flexTabRow">' +
          '<div class="headerFlex2">健康度</div>' +
          '<div class="headerFlex3">' +
          '<input type="checkbox" class="check-baseline">' +
          '<span class="autoBaselineTit">使用自动基线</span>' +
          '</div>' +
          '<div class="headerFlex4 autoBaselineContent">' +
          '<span>自动基线值：</span>' +
          '<span class="upVal"></span>' +
          '<span class="baseUnit">%</span>' +
          '</div>' +
          '</div>' +
          '<div class="autoInputDiv flexTabRow">' +
          '<div class="headerFlex2"></div>' +
          '<div class="headerFlex3">' +
          '<input type="checkbox" class="check-auto">' +
          '<span class="">手动设置</span>' +
          '</div><div class="headerFlex4">' +
          '<span>响应时间正常值</span>' +
          '<input class="upInput durationMs" id="healthDurationMs" type="text" autocomplete="off" >' +
          '<span>ms 健康度低于</span>' +
          '<input id="health_down" class="downInput percent" type="text" autocomplete="off" >' +
          '<span>%</span>' +
          '</div>' +
          '</div>' +
          '<div class="tsHoldDiv flexTabRow checkRow paddingNone ">' +
          '<div class="headerFlex2"></div>' +
          '<div class="headerFlex3" >' +
          '<span>告警延迟</span>' +
          '<select class="alert-time">' +
          '<option value="1">1</option>' +
          '<option value="2">2</option>' +
          '<option value="3">3</option>' +
          '<option value="4">4</option>' +
          '<option value="5">5</option>' +
          '<option value="10">10</option>' +
          '<option value="15">15</option>' +
          '</select>' +
          '<span>分钟</span>' +
          '</div>' +
          '</div>' +
          '</div>' +
          '</div>' +
          '<div class="flexTabRow checkRow paddingNone">' +
          '<div class="headerFlex1">' +
          '<span class="warn_title_tip">' +
          '</span>' +
          // '<a id="crop_pill">基线告警</a>' +
          '<a id="crop_pill">基线告警 <span class="triangle-icon">▶</span></a>' +
          '</div>' +
          '<div class="baselineContent" id="baselineContent">' +
          '<div class="perQuotaDiv" id="transcountConfig">' +
          '<div class="autoBaselineDiv flexTabRow">' +
          '<div class="headerFlex2">交易量</div>' +
          '<div class="headerFlex3">' +
          '<input type="checkbox" class="check-baseline">' +
          '<span class="autoBaselineTit">使用自动基线</span>' +
          '</div>' +
          '<div class="headerFlex4 autoBaselineContent">' +
          '<span>自动上基线值：</span>' +
          '<span class="upVal"></span>' +
          '<span class="baseUnit">笔</span>' +
          '<span>，自动下基线值：</span>' +
          '<span class="downVal"></span>' +
          '<span class="baseUnit">笔</span>' +
          '</div>' +
          '</div>' +
          '<div class="autoInputDiv flexTabRow">' +
          '<div class="headerFlex2"></div>' +
          '<div class="headerFlex3">' +
          '<input type="checkbox" class=" check-auto" >' +
          '<span class="">手动设置</span>' +
          '</div>' +
          '<div class="headerFlex4">' +
          '<span>高于</span>' +
          '<input  class="upInput count" type="text" autocomplete="off">' +
          '<span>或低于</span>' +
          '<input class="downInput count" type="text" autocomplete="off">' +
          '<span>笔</span>' +
          '</div>' +
          '</div>' +
          '<div class="tsHoldDiv flexTabRow checkRow paddingNone">' +
          '<div class="headerFlex2"></div>' +
          '<div class="headerFlex3" >' +
          '<span>告警延迟</span>' +
          '<select class="alert-time">' +
          '<option value="1">1</option>' +
          '<option value="2">2</option>' +
          '<option value="3">3</option>' +
          '<option value="4">4</option>' +
          '<option value="5">5</option>' +
          '<option value="10">10</option>' +
          '<option value="15">15</option>' +
          '</select>' +
          '<span>分钟</span>' +
          '</div>' +
          '</div>' +
          '</div>' +
          '<div class="perQuotaDiv" id="succ_rateConfig">' +
          '<div class="autoBaselineDiv flexTabRow">' +
          '<div class="headerFlex2">成功率</div>' +
          '<div class="headerFlex3">' +
          '<input type="checkbox" class="check-baseline" id="">' +
          '<span class="autoBaselineTit">使用自动基线</span>' +
          '</div>' +
          '<div class="headerFlex4 autoBaselineContent">' +
          '<span>自动基线值：</span>' +
          '<span class="baseVal"></span>' +
          '<span class="baseUnit">%</span>' +
          '</div>' +
          '</div>' +
          '<div class="autoInputDiv flexTabRow">' +
          '<div class="headerFlex2"></div>' +
          '<div class="headerFlex3">' +
          '<input type="checkbox" class=" check-auto" id="ts_succ_checkbox">' +
          '<span class="">手动设置</span>' +
          '</div><div class="headerFlex4">' +
          '<span>低于</span>' +
          '<input class="valInput percent" type="text" autocomplete="off">' +
          '<span>%</span>' +
          '</div>' +
          '</div>' +
          '<div class="tsHoldDiv flexTabRow checkRow paddingNone">' +
          '<div class="headerFlex2"></div>' +
          '<div class="headerFlex3" >' +
          '<span>告警延迟</span>' +
          '<select class="alert-time">' +
          '<option value="1">1</option>' +
          '<option value="2">2</option>' +
          '<option value="3">3</option>' +
          '<option value="4">4</option>' +
          '<option value="5">5</option>' +
          '<option value="10">10</option>' +
          '<option value="15">15</option>' +
          '</select>' +
          '<span>分钟</span>' +
          '</div>' +
          '</div>' +
          '</div>' +
          '<div class="perQuotaDiv" id="durationConfig">' +
          '<div class="autoBaselineDiv flexTabRow">' +
          '<div class="headerFlex2">响应时间</div>' +
          '<div class="headerFlex3">' +
          '<input type="checkbox" class="check-baseline" id="">' +
          '<span class="autoBaselineTit">使用自动基线</span>' +
          '</div>' +
          '<div class="headerFlex4 autoBaselineContent">' +
          '<span>自动基线值：</span>' +
          '<span class="baseVal"></span>' +
          '<span class="baseUnit">ms</span>' +
          '</div>' +
          '</div>' +
          '<div class="autoInputDiv flexTabRow">' +
          '<div class="headerFlex2"></div>' +
          '<div class="headerFlex3">' +
          '<input type="checkbox" class=" check-auto" id="ts_resptime_checkbox">' +
          '<span class="">手动设置</span>' +
          '</div>' +
          '<div class="headerFlex4">' +
          '<span>高于</span>' +
          '<input class="valInput durationMs" id="ts_resp_over" type="text" autocomplete="off">' +
          '<span>ms</span>' +
          '</div>' +
          '</div>' +
          '<div class="tsHoldDiv flexTabRow checkRow paddingNone">' +
          '<div class="headerFlex2"></div>' +
          '<div class="headerFlex3" >' +
          '<span>告警延迟</span>' +
          '<select class="alert-time">' +
          '<option value="1">1</option>' +
          '<option value="2">2</option>' +
          '<option value="3">3</option>' +
          '<option value="4">4</option>' +
          '<option value="5">5</option>' +
          '<option value="10">10</option>' +
          '<option value="15">15</option>' +
          '</select>' +
          '<span>分钟</span>' +
          '</div>' +
          '</div>' +
          '</div>' +
          '<div class="perQuotaDiv" id="rr_rateConfig">' +
          '<div class="autoBaselineDiv flexTabRow">' +
          '<div class="headerFlex2">响应率</div>' +
          '<div class="headerFlex3">' +
          '<input type="checkbox" class="check-baseline" id="">' +
          '<span class="autoBaselineTit">使用自动基线</span>' +
          '</div>' +
          '<div class="headerFlex4 autoBaselineContent">' +
          '<span>自动基线值：</span>' +
          '<span class="baseVal"></span>' +
          '<span class="baseUnit">%</span>' +
          '</div>' +
          '</div>' +
          '<div class="autoInputDiv flexTabRow">' +
          '<div class="headerFlex2"></div>' +
          '<div class="headerFlex3">' +
          '<input type="checkbox" class=" check-auto" id="ts_resp_checkbox">' +
          '<span class="">手动设置</span>' +
          '</div>' +
          '<div class="headerFlex4">' +
          '<span>低于</span>' +
          '<input class="valInput percent"  type="text" autocomplete="off">' +
          '<span>%</span>' +
          '</div>' +
          '</div>' +
          '<div class="tsHoldDiv flexTabRow checkRow paddingNone">' +
          '<div class="headerFlex2"></div>' +
          '<div class="headerFlex3" >' +
          '<span>告警延迟</span>' +
          '<select class="alert-time">' +
          '<option value="1">1</option>' +
          '<option value="2">2</option>' +
          '<option value="3">3</option>' +
          '<option value="4">4</option>' +
          '<option value="5">5</option>' +
          '<option value="10">10</option>' +
          '<option value="15">15</option>' +
          '</select>' +
          '<span>分钟</span>' +
          '</div>' +
          '</div>' +
          '</div>' +
          '</div>' +
          '</div>' +
          '<div class="flexTabRow checkRow paddingNone">' +
          '<div class="headerFlex1">' +
          '<span class="warn_title_tip"></span>' +
          '<a href="#">返回码告警</a>' +
          '</div>' +
          '<div class="perQuotaDiv" id="codeConfig">' +
          '<div class="autoInputDiv flexTabRow disabled-alert">' +
          '<div class="headerFlex2">返回特定码</div>' +
          '<div class="headerFlex3">' +
          '<input type="checkbox" class="check-code">' +
          '<span class="">手动设置</span>' +
          '</div>' +
          '<div class="headerFlex4">' +
          '<input class="codeIn" type="text" autocomplete="off" ' +
          '</div>' +
          '</div>' +
          '</div>' +
          '</div>');

      container.append(_this.node);

      _this.tab = container.closest('.config-container').find('#' + container.attr('id').replace('Content',''));

      _this.alarmRules = {
          "tivoliOn": true,
          "threshold": {
              "duration": {},
              "trans_count": {},
              "succ_rate": {},
              "rr_rate": {}
          },
          "health": {},
          "baseline": {},
          "return_code": {}
      };

      _this.init();

      _this.node.find('.durationMs').on('input',function(e){
          validateMs(e);
          _this.removeTabError();
      });
      _this.node.find('.percent').on('input',function (e) {
          validatePercent(e);
          _this.removeTabError();
      });
      _this.node.find('.count').on('input',function (e) {
          validateCount(e);
          _this.removeTabError();
      });
      _this.node.find('.codeIn').on('input',function (e) {
          validateCode(e);
          _this.removeTabError();
      });

      _this.node.find('#crop_pill').on('click',function () {
          if(_this.node.find('#baselineContent').hasClass('baselineCollapsed')){
              $(this).find('.triangle-icon').removeClass('triangleRotate');
              _this.node.find('#baselineContent').removeClass('baselineCollapsed');
          }else{
              $(this).find('.triangle-icon').addClass('triangleRotate');
              _this.node.find('#baselineContent').addClass('baselineCollapsed');
          }
      });
      _this.node.find('.on-off-btn').on('click',function () {
          var flag = $(this).hasClass('on') ? true : false;
          _this.alarmRules.tivoliOn = flag;
          _this.setTivoli(flag);
      });

  };

  alertConfig.prototype = {
      setTivoli: function (bool) {
          var _this = this;
          _this.alarmRules.tivoliOn = bool;
          var tivoliBtn = _this.node.find('#tivoliBtn');
          tivoliBtn.find('.on-off-btn').removeClass('turn');
          tivoliBtn.find('.' + (bool ? 'on' : 'off')).addClass('turn');
      },
      setHealth: function () {
          var obj = {};
          var container = this.node.find('#healthConfig');
          collectCheck(obj,'baseOn',container.find('.check-baseline'));
          collectCheck(obj,'on',container.find('.check-auto'),true);
          collectInput(obj,'duration',container.find('.upInput'),true);
          collectInput(obj,'health_set',container.find('.downInput'),true);
          collectInput(obj,'ts_hold',container.find('.alert-time'),true);
          return obj;
      },
      setTranscount: function () {
          var obj = {
              down: {},
              up:{}
          };
          var container = this.node.find('#transcountConfig');
          collectCheck(obj,'baseOn',container.find('.check-baseline'));
          collectCheck(obj,'on',container.find('.check-auto'),true);
          collectInput(obj.up,'value',container.find('.upInput'),true);
          collectInput(obj.down,'value',container.find('.downInput'),true);
          collectInput(obj.down,'time',container.find('.alert-time'),true);
          return obj;
      },
      setRate: function (id) {
          var obj = {
              down: {},
          };
          var container = this.node.find('#' + id);
          collectCheck(obj,'baseOn',container.find('.check-baseline'));
          collectCheck(obj,'on',container.find('.check-auto'),true);
          collectInput(obj.down,'value',container.find('.valInput'),true);
          collectInput(obj.down,'time',container.find('.alert-time'),true);
          return obj;
      },
      setDuration: function () {
          var obj = {
              up: {},
          };
          var container = this.node.find('#durationConfig');
          collectCheck(obj,'baseOn',container.find('.check-baseline'));
          collectCheck(obj,'on',container.find('.check-auto'),true);
          collectInput(obj.up,'value',container.find('.valInput'),true);
          collectInput(obj.up,'time',container.find('.alert-time'),true);
          return obj;
      },
      setCode: function () {
          var obj = {};
          var container = this.node.find('#codeConfig');
          var ele = container.find('.check-code');
          var codeDiv = container.find('div.autoInputDiv');

          obj && Object.defineProperty(obj, 'on', {
              enumerable: true,
              get: function () {
                  return ele.prop('checked');
              },
              set: function (bool) {
                  ele.prop('checked', bool);
                  if(bool){
                      clearDisabled(codeDiv);
                  }else{
                      disabled(codeDiv);
                  }
              }
          });
          ele.on('change',function () {obj['on'] = this.checked;});
          collectInput(obj,'val',container.find('.codeIn'));

          return obj;
      },
      setBaseLine: function (app_name,intf_name) {
          var _this = this;
          d3.json("/" + LANGUAGE_CODE + "/getbaselinetrade/")
              .header("Content-Type", "application/x-www-form-urlencoded")
              .post(jsonTod3string({
                  "csrfmiddlewaretoken": csrf_token,
                  "app_name": app_name,
                  "intf": intf_name,
                  'auto_baseline': true,
              }), function (e, data) {
                  if(!e){

                    function setAutoVal(key, domKey, valKey) {
                        if (data[key] !== null){
                            _this.node.find(domKey + ' ' + valKey).html((data[key]).toFixed(2) * 100 / 100);
                            _this.node.find(domKey + ' .baseUnit').removeClass('hideBaseUnit');
                        } else {
                            _this.node.find(domKey + ' ' + valKey).html('--');
                            _this.node.find(domKey + ' .baseUnit').addClass('hideBaseUnit');
                        }
                    }

                    setAutoVal('health', '#healthConfig', '.upVal');
                    setAutoVal('max_transcount', '#transcountConfig', '.upVal');
                    setAutoVal('min_transcount', '#transcountConfig', '.downVal');
                    setAutoVal('succ_rate', '#succ_rateConfig', '.baseVal');
                    setAutoVal('rr_rate', '#rr_rateConfig', '.baseVal');
                    setAutoVal('duration', '#durationConfig', '.baseVal');
                  }else{
                      console.log('基线请求错误');
                  }
              });

      },
      init: function () {
          var _this = this;
          _this.alarmRules.health = _this.setHealth();
          _this.alarmRules.threshold.trans_count =  _this.setTranscount();
          _this.alarmRules.threshold.succ_rate = _this.setRate('succ_rateConfig');
          _this.alarmRules.threshold.rr_rate = _this.setRate('rr_rateConfig');
          _this.alarmRules.threshold.duration = _this.setDuration();
          _this.alarmRules.return_code = _this.setCode();
      },
      update: function (alarmRules,app_name,intf_name) {
          var _this = this;
          if(typeof alarmRules.tivoliOn === 'undefined')alarmRules['tivoliOn'] = true;
          _this.setBaseLine(app_name,intf_name);
          _this.setTivoli(alarmRules.tivoliOn);
          var copyObj = function (obj1,obj2) {
              for(var key in obj1){
                  if(typeof obj1[key] === 'object'){
                      arguments.callee(obj1[key],obj2[key]);
                  }else{
                      obj1[key] = obj2[key];
                  }
              }
          }

          copyObj(_this.alarmRules,alarmRules);
          _this.alarmRules.baseline = alarmRules.baseline;
          _this.alarmRules.threshold.no_req = alarmRules.threshold.no_req;


      },
      clear: function () {
          var _this = this;
          _this.node.find('.error-input').removeClass('error-input');
          // _this.node.find('input').val('');
          // _this.node.find('select option:first').prop('selected',true);
      },
      valid: function () {
          var _this = this;
          var flag = true;
          _this.node.find('input[type="text"]').each(function () {
              if($(this).closest('.disabled-alert').length === 0){
                  if($(this).hasClass('error-input')){
                      flag = false;
                  }else if(this.id !== 'healthDurationMs' && this.value === ''){
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
  };

  /**
   * 关联对象与checkbox
   * @param obj
   * @param propName
   * @param ele
   * @param isAuto
   */
  function collectCheck(obj, propName, ele, isAuto) {
      var container = ele.closest('div.perQuotaDiv');
      obj && Object.defineProperty(obj, propName, {
          enumerable: true,
          get: function () {
              return ele.prop('checked');
          },
          set: function (bool) {
              if(isAuto){
                  setAuto(container, bool);
              }else{
                  setBaseline(container, bool);
              }
              ele.prop('checked', bool);
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
  function collectInput(obj, propName, ele, isNumber) {
      var initVal = obj[propName];
      obj && Object.defineProperty(obj, propName, {
          enumerable: true,
          get: function () {
              var val = !ele.hasClass('error-input') ? ele.val() : initVal;
              return isNumber ? Number(val) : val;
          },
          set: function (val) {
              initVal = val;
              ele.val(val);
          }
      });
  }

  /**
   * 手动输入
   * @param container
   */
  function setAuto(container, bool) {
      container.find('.check-auto').prop('checked',bool);
      bool ? clearDisabled(container.find('.autoInputDiv')) :  disabled(container.find('.autoInputDiv'));

      var baseOn = container.find('.check-baseline').prop('checked');
      if(baseOn && bool){
          container.find('.check-baseline').prop('checked', !bool);
          disabled(container.find('.autoBaselineDiv'));
      }else if(!baseOn && !bool){
          disabled(container.find('.tsHoldDiv'));
      }else{
          clearDisabled(container.find('.tsHoldDiv'));
      }
  }


  /**
   * 使用基线
   * @param container
   */
  function setBaseline(container, bool) {
      container.find('.check-baseline').prop('checked',bool);
      bool ? clearDisabled(container.find('.autoBaselineDiv')) :  disabled(container.find('.autoBaselineDiv'));

      var baseOn = container.find('.check-auto').prop('checked');
      if(baseOn && bool){
          container.find('.check-auto').prop('checked', !bool);
          disabled(container.find('.autoInputDiv'));
      }else if(!baseOn && !bool){
          disabled(container.find('.tsHoldDiv'));
      }else{
          clearDisabled(container.find('.tsHoldDiv'));
      }
  }

  /**
   * 禁用
   * @param ele
   */
  function disabled(ele) {
      ele.find('select,input[type="text"]').attr("disabled","disabled");
      ele.addClass('disabled-alert');
  }

  /**
   * 清除禁用状态
   * @param ele
   */
  function clearDisabled(ele) {
      ele.find('select,input[type="text"]').removeAttr("disabled");
      ele.removeClass('disabled-alert');
  }

  /**
   * 验证百分比
   * @param e
   */
  function validatePercent(e) {
      const val = e.target.value;
      const pattern = /(?!^0\.0?0$)^[0-9][0-9]?(\.[0-9]{1,2})?$|^100$/;
      if (val !== '' && pattern.test(val)) {
          console.log('yes');
          removeError($(e.target));
      } else {
          console.log('请输入0到100之间的数字，可保留两位小数');
          error($(e.target),'请输入0到100之间的数字，可保留两位小数');
      }
  }

  /**
   * 验证返回码
   * @param e
   */
  function validateCode(e) {
      const val = e.target.value;
      const pattern = /^[A-Za-z0-9]+([\\,][A-Za-z0-9]+)*$/;
      if (val !== '' && pattern.test(val)) {
          console.log('yes');
          removeError($(e.target));
      } else {
          console.log('请输入字母或数字,多个值用"，"隔开');
          error($(e.target),'请输入字母或数字,多个值用"，"隔开');
      }
  }

  /**
   * 验证响应时间
   * @param e
   */
  function validateMs(e) {
      const val = e.target.value;
      const pattern = /^(([1-9][0-9]{0,10})|([0]))(\.[0-9]{1,2})?$/;
      if ((e.target.id === 'healthDurationMs' && val === '') || (val !== '' && pattern.test(val))) {
          console.log('yes');
          removeError($(e.target));
      } else {
          console.log('请输入小于12位的自然数，可精确到2位小数');
          error($(e.target),'请输入小于12位的自然数，可精确到2位小数');
      }
  }

  /**
   * 验证交易量
   * @param e
   */
  function validateCount(e) {
      const val = e.target.value;
      const pattern = /(^([1-9][0-9]{0,14})$)|(^[0]$)/;
      if (val !== '' && pattern.test(val)) {
          console.log('yes');
          removeError($(e.target));
      } else {
          console.log('请输入小于16位的自然数');
          error($(e.target),'请输入小于16位的自然数');
      }
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

  window.alertConfig = alertConfig;

})();
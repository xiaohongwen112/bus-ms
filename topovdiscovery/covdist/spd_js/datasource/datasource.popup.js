var SpdDataSource = CBMSFLOW.module('DataSource');

SpdDataSource.CollectDataSourcePopup = CBMSFLOW.klass({

    __init__: function(settings) {
        this.$elem = $('#collect_datasource_popup');
        this.settings = settings;
        this.ds_devices = this.settings['ds_devices']||{};
        this.duration_limit = this.settings['duration_limit'] || 300;
        this.desc = this.$elem.find('input.desc');
        this.datasource = this.$elem.find('.source');
        this.host = this.$elem.find('.host');
        this.intf = this.$elem.find('.intf');
        this.collectNow = this.$elem.find('input[type=radio].now');
        this.collectHist = this.$elem.find('input[type=radio].hist');
        this.durationNow = this.$elem.find('input[type=text].duration.now');
        this.durationHist = this.$elem.find('input[type=text].duration.hist');
        this.startTimeHist = this.$elem.find('input[type=text].startTimeHist');
        this.timeRange = this.$elem.find('.range-select-tip-block span');

        this.saveBtn = this.$elem.find('.modal-footer .save');
        this.closeBtn = this.$elem.find('.modal-footer .close');

        this._unBindEvents();
        this._bindEvents();
        this._setInitState();
        this._fixCss();
    },

    _fixCss: function() {

    if (CBMSFLOW.Environment['LANGUAGE_CODE'] == 'en-us') {
        this.$elem.find('.select-block .host-block').css('margin-left', '30px');
        this.$elem.find('.collect-now-block >span.inline:nth-child(2)').css('margin-left', '28px');
        this.$elem.find('.collect-hist-block >span.inline:nth-child(2)').css('margin-left', '19px');
        }

    },

    _setInitState: function() {
        this._clearData();
        this._setUpDateTime();
        this._setUpData();
        this.collectNow.trigger('click');
        this.datasource.dropdownlist('trigger', 'change');

        $.each($.makeArray(this.$elem.find('.ui-datetime-input')).concat($.makeArray(this.$elem.find('.ui-time-input'))),
            function() {
            var wrapper = $(this);
             $(this).find('input').focus(function(e) {
                if (wrapper.hasClass('disabled')) {
                    if (wrapper.hasClass('ui-datetime-input')) {
                        $('#ui-datepicker-div').hide();
                    }

                    $(this).attr('disabled', 'disabled');
                    return false;
                }
             }).blur(function() {

                 $(this).attr('disabled',false);

             })
         });

        var self = this;
        $.ajax({
            type: 'POST',
            url: CBMSFLOW.util.make_spd_i18n_url('newname/datasource/'),
            dataType: 'json',
            success: function(result) {
                self.desc.val(result.data.new_name);
            }
        });
    },

    _setUpData: function() {
        if (!$.isEmptyObject(this.ds_devices)) {

            var datasources = [];
            var hosts = [];
            var intfs = [];

            var isFirst = true;
            var isFirstHost = true;
            var self = this;
            $.each(_.keys(this.ds_devices).reverse(), function(ds_index, ds){
                datasources.push({'disp':ds, 'value':ds});
                if (isFirst) {
                    for (var host in self.ds_devices[ds]) {
                        hosts.push({'disp': host, 'value': host});
                        if(isFirstHost) {
                            for(var intf_i in self.ds_devices[ds][host]['intf']) {
                                intfs.push({'disp': self.ds_devices[ds][host]['intf'][intf_i], 'value': self.ds_devices[ds][host]['intf'][intf_i]});
                            }
                            isFirstHost = false;
                        }
                    }
                    isFirst = false;
                }

            });

            this.datasource.dropdownlist({data: datasources, onselect: $.proxy(this._dataSourceChangedHandler, this)});
            this.host.dropdownlist({data: hosts, onselect: $.proxy(this._hostChangedHandler, this)});
            this.intf.dropdownlist({data: intfs, onselect: $.proxy(this._intfChangedHandler, this)});

            this.datasource.messagepop({'trigger':'manual', 'container': this.$elem});
            this.host.messagepop({'trigger':'manual', 'container': this.$elem});
            this.intf.messagepop({'trigger':'manual', 'container': this.$elem});
            this.durationNow.next().messagepop({'trigger':'manual', 'container': this.$elem});
            this.durationHist.next().messagepop({'trigger':'manual', 'container': this.$elem});
            this.startTimeHist.next().messagepop({'trigger':'manual', 'container': this.$elem});
        }

    },

    _setUpDateTime: function() {
        this.startTimeHist.datetimeInput();
        this.durationNow.datetimeInput({'spinner': true, 'minutes': '01'});
        this.durationHist.datetimeInput({'spinner': true});

        this.startTimeHist.next().attr('id', this.startTimeHist.attr('id'));
        this.durationNow.next().attr('id', this.durationNow.attr('id'));
        this.durationHist.next().attr('id', this.durationHist.attr('id'));

        this.durationNow.next().find('.tsInput').change($.proxy(this._durationNowChangeHandler, this)).keyup($.proxy(this._durationNowChangeHandler, this));
        this.durationHist.next().find('.tsInput').change($.proxy(this._durationHistChangeHandler, this)).keyup($.proxy(this._durationHistChangeHandler, this));
        this.startTimeHist.next().find('.tsInput').change($.proxy(this._startTimeChangeHandler, this)).keyup($.proxy(this._startTimeChangeHandler, this));
        this.startTimeHist.next().find('.customDate').change($.proxy(this._startTimeChangeHandler, this)).keyup($.proxy(this._startTimeChangeHandler, this));

    },

    _popDurationLimitMsg: function(target, val) {
        target.messagepop('show', gettext('持续时间不可超过')+this._toHumanReadableTime(this.duration_limit));
        this.saveBtn.addClass('disabled');
    },

    _startTimeChangeHandler: function() {
        var datepicker = this.startTimeHist.next();
        var date_str = datepicker.find('.customDate').val();
        var hours = datepicker.find('input.hours').val();
        var minutes = datepicker.find('input.minutes').val();
        var seconds = datepicker.find('input.seconds').val();
        var datestr = date_str + ' ' + hours + ":" + minutes + ":" + seconds;
        var m = moment(datestr);

        if(m.isValid()) {
            this.startTimeHist.next().removeClass('error');
            this._removeErrorPop();
            if (!this._judgeStartTimeRange(m.valueOf()/1000)) {
                this.startTimeHist.next().addClass('error');
                return false;
            } else {
                this.startTimeHist.next().removeClass('error');
                this._removeErrorPop();
            }
        } else {
            this.startTimeHist.next().addClass('error');
            this.startTimeHist.next().messagepop('show', gettext('格式错误'));
            this.saveBtn.addClass('disabled');
        }
    },

    _durationNowChangeHandler: function(e) {
        var val = this.durationNow.val();
        if(val > this.duration_limit) {
            this.durationNow.next().addClass('error');
            this._popDurationLimitMsg(this.durationNow, val);
        } else {
            this.durationNow.next().removeClass('error');
            this._removeErrorPop();
            this._enableSave();
        }
    },

    _durationHistChangeHandler: function(e) {
        var val = this.durationHist.val();
        if(val > this.duration_limit) {
            this.durationHist.next().addClass('error');
            this._popDurationLimitMsg(this.durationHist, val);
        } else {
            this.durationHist.next().removeClass('error');
            this._removeErrorPop();
            this._enableSave();
        }
    },

    _toHumanReadableTime: function(v) {
        var limit = v;
        var hr = "";

        var h = parseInt(v / 3600);
        var m = v / 60 % 60;
        var s = v % 60;

        if (h > 0) {
            hr += h + gettext("小时");
        }

        if (m > 0) {
            hr += m + gettext("分钟");
        }

        if (s > 0) {
            hr += s + gettext("秒");
        }

        return hr;
    },

    _unBindEvents: function() {
        this.datasource.unbind('change');
        this.host.unbind('change');
        this.intf.unbind('change');
        this.collectNow.unbind('click');
        this.collectHist.unbind('click');
        this.durationNow.unbind('blur');
        this.durationHist.unbind('blur');
        this.saveBtn.unbind('click');
        this.closeBtn.unbind('click');
    },

    _bindEvents: function() {
        this.collectNow.click($.proxy(this._collectNowClickHandler, this));
        this.collectHist.click($.proxy(this._collectHistClickHandler, this));
        this.saveBtn.click($.proxy(this._saveClickHandler, this));
        this.closeBtn.click($.proxy(this.hide, this));
        /*
        this.desc.keyup(function() {
            if($(this).val().trim().length > 0) {
                $(this).removeClass('error');
                $(this).messagepop('hide');
            }

        });
        */
    },

    _dataSourceChangedHandler: function(data) {
        var value = data['value'];

        var isFirst = true;
        var hosts = [];
        var intfs = [];
        for (var host in this.ds_devices[value]) {
            hosts.push({'disp': host, 'value': host});
            if (isFirst) {
                for (var intf_i in this.ds_devices[value][host]['intf']) {
                    intfs.push({'disp': this.ds_devices[value][host]['intf'][intf_i], 'value': this.ds_devices[value][host]['intf'][intf_i]});
                }
                isFirst = false;
            }
        }

        this.host.dropdownlist('setOptions', hosts);
        this.intf.dropdownlist('setOptions', intfs);
        this._checkValid();

        if (value == 'NetScout') {
            this.$elem.find('.collect-hist-block').show();
            this.$elem.find('.range-select-tip-block').show();
        } else if (value == 'IntelligentProbe') {
            this.$elem.find('.collect-hist-block').hide();
            this.$elem.find('.range-select-tip-block').hide();
            this.collectNow.trigger('click');
        }
    },

    _hostChangedHandler: function(data) {
        var ds = this.datasource.dropdownlist('getValue');
        var value = data['value'];
        var host = this.ds_devices[ds][value];

        var intfs = [];

        for (var i in host['intf']) {
            intfs.push({'disp': host['intf'][i], 'value': host['intf'][i]});
        }

        this.intf.dropdownlist('setOptions', intfs);
        this._checkValid();
    },

    _intfChangedHandler: function(data) {
        this._checkValid();
    },

    _revertDefaultDuration: function(target) {
        target.find('.hours').val('00');
        target.find('.minutes').val('05');
        target.find('.seconds').val('00').trigger('change');
    },

    _revertHistTime: function() {
        if (this.timeRangeVal) {
            this._setCollectHistRange(this.timeRangeVal[1]*1000 - 300*1000, this.timeRangeVal[1]*1000);
        } else {
            var now = moment().valueOf();
            this._setCollectHistRange(now-300*1000, now);
        }
    },

    _collectNowClickHandler: function(e) {
        this._removeErrorPop();

        if (this.startTimeHist.next().hasClass('error')) {
            this._revertHistTime();
        }

        this._revertDefaultDuration(this.durationHist.next());
        this.durationHist.next().removeClass('error');
        this.durationNow.next().removeClass('disabled');
        this.startTimeHist.next().removeClass('error');
        this.startTimeHist.next().addClass('disabled');
        this.durationHist.next().addClass('disabled');
        this._enableSave();
    },

    _collectHistClickHandler: function(e) {
        this._removeErrorPop();
        this._revertDefaultDuration(this.durationNow.next());
        this.durationNow.next().removeClass('error');
        this.startTimeHist.next().removeClass('disabled');
        this.durationHist.next().removeClass('disabled');
        this.durationNow.next().addClass('disabled');
        this._enableSave();
    },

    _clearError: function() {
        $.each([this.datasource, this.host, this.intf, this.startTimeHist.next()], function(index, item) {
            item.removeClass('error');
        });
        // _this.refresh();
        //if (this.$elem.find('.error').length == 0) {
        //    this.saveBtn.removeClass('disabled');
        //}
    },

    _removeErrorPop: function() {
        $.each([this.datasource, this.host, this.intf, this.durationNow.next(), this.durationHist.next(), this.startTimeHist.next()],
          function(index, item) {
              if(item.is(':not(.error)'))
                 item.messagepop('hide');
        });
    },

    _popMessage: function(location, msg) {
        var loc = this.$elem.find('.'+location);
        loc.messagepop('show', msg);
        loc.addClass('error');
        this.saveBtn.addClass('disabled');
    },

    _enableSave: function() {
        if (this.$elem.find('.error').length == 0) {
            this.saveBtn.removeClass('disabled');
        }
    },

    _disableSave: function() {
        this.saveBtn.addClass('disabled');
    },

    _checkValid: function(isAsync) {
        var self = this;
        var data = {'ds_type': this.datasource.dropdownlist('getValue'),
                    'host': this.host.dropdownlist('getValue'),
                    'intf': this.intf.dropdownlist('getValue')};
        var mapName = CBMSFLOW.environment('map_name');

        // this._disableSave();
        this._clearError();
        this._removeErrorPop();
        this.timeRangeVal = [];

        if (this.checkAjax) {
            this.checkAjax.abort();
        }



        isAjaxSuccess = undefined;

        isAsync = isAsync == undefined ? true : false;
        this.checkAjax = $.ajax({
            url: CBMSFLOW.util.make_spd_i18n_url(mapName+'/datasource/verify/'),
            type:'GET',
            async: isAsync,
            data: data,
            success: function(result) {
                if (result.is_valid) {
                    if (self.datasource.dropdownlist('getValue') == 'NetScout') {
                        if (result.time_range) {
                            self.timeRangeVal = result.time_range;
                            self._setTimeRangeTip(result.time_range[0]*1000, result.time_range[1]*1000);
                            self._setCollectHistRange(result.time_range[1]*1000 - 300*1000, result.time_range[1]*1000);
                        } else {
                            var now = moment().valueOf();
                            self._setCollectHistRange(now-300*1000, now);
                            self.timeRange.hide();
                        }
                    }
                    self._enableSave();
                    isAjaxSuccess = true;
                } else {
                    // self._disableSave();
                    self.timeRange.hide();
                    self._popMessage(result.location, result.error);
                    isAjaxSuccess = false;
                }
            }
        });

        return isAjaxSuccess;
    },

    _judgeStartTimeRange: function(start_time, duration) {
        if (this.timeRangeVal && this.timeRangeVal.length > 0) {
            var timeRangeValStart = this.timeRangeVal[0];
            var timeRangeValEnd = this.timeRangeVal[1];

            if (start_time >= timeRangeValEnd) {
                this.startTimeHist.next().messagepop('show', gettext('开始时间不可晚于') + moment(timeRangeValEnd*1000).format('YYYY-MM-DD HH:mm:ss'));
                this.saveBtn.addClass('disabled');
                return false;
            }
            if (start_time < timeRangeValStart){
                this.startTimeHist.next().messagepop('show', gettext('开始时间不可早于') + moment(timeRangeValStart*1000).format('YYYY-MM-DD HH:mm:ss'));
                this.saveBtn.addClass('disabled');
                return false;
            }

            if (duration && start_time + duration >= timeRangeValEnd) {
                this.startTimeHist.next().messagepop('show', gettext('超出可选时间范围'));
                this.saveBtn.addClass('disabled');
                return false;
            }
        }

        return  true;
    },

    _saveClickHandler: function(e) {
        var desc = this.desc.val();
        var type = this.datasource.dropdownlist('getValue');
        var host = this.host.dropdownlist('getValue');
        var intf = this.intf.dropdownlist('getValue');
        var start_time = null;
        var duration = 0;
        var self = this;
        var reg = new RegExp("^[A-Za-z0-9\u4e00-\u9fa5-]+$");

        if (this.saveBtn.hasClass('disabled')) {
            return false;
        }


        if (this.desc.val().trim().length == 0) {
            // TODO
            this.desc.addClass('error');
            this.desc.messagepop({'trigger':'manual', 'container': this.$elem});
            this.desc.messagepop('show', gettext('名称不能为空'));
            return false;
        } else if(desc.length > 12){
            this.desc.addClass('error');
            this.desc.messagepop({'trigger':'manual', 'container': this.$elem});
            this.desc.messagepop('show', gettext('名称不能超过12字符'));
            return false;
        } else if(!reg.test(desc)){
            this.desc.addClass('error');
            this.desc.messagepop({'trigger':'manual', 'container': this.$elem});
            this.desc.messagepop('show', gettext('名称不能出现除-以外的特殊字符'));
            return false;
        }

        if (this._checkValid(false)) {
            var mapName = window.localStorage.getItem('mapName');
            var data = {'map': mapName, 'type': type, 'host': host, 'intf': intf, 'duration': duration, 'desc': desc};

            var whichChecked = this.$elem.find('input[type=radio][name=collect]:checked').val();
            var cmd_desc = this.desc;
            var cmd_elem = this.$elem;
            if (whichChecked == 'now') {
                data['duration'] = parseInt(this.durationNow.val());
            } else if (whichChecked == 'hist') {
                start_time = moment(this.startTimeHist.val()).valueOf()/1000;
                data['start_time'] = start_time;
                data['duration'] = parseInt(this.durationHist.val());

                if (!this._judgeStartTimeRange(start_time, duration)) {
                    return false;
                }
            }
            if(data['duration'] == 0){
                this.durationNow.next().addClass('error');
                this.durationNow.next().messagepop({'trigger':'manual', 'container': this.$elem});
                this.durationNow.next().messagepop('show', gettext('持续时间不能为0'));
                return false;
            }
            $.ajax({
                url: CBMSFLOW.util.make_spd_i18n_url(mapName + '/datasource/save/'),
                type: 'POST',
                data: appendCsrfToken(data),
                success: function(result) {
                    if (result.code === 0) {
                        self.hide();
                    } else if (result.code === -3){
                        cmd_desc.addClass('error');
                        cmd_desc.messagepop({'trigger':'manual', 'container': cmd_elem});
                        cmd_desc.messagepop('show', gettext('名称重复'));
                    } else {
                        alert('保存失败')
                    }
                }
            });
        }
    },

    _clearData: function() {
        this.$elem.find('.ui-datetime-input').remove();
        this.$elem.find('.ui-time-input').remove();
        this.datasource.empty();
        this.durationNow.val('');
        this.host.empty();
        this.intf.empty();
        this.desc.val('');
    },

    _setTimeRangeTip: function(start, end) {

        var start = moment(start).format('YYYY-MM-DD HH:mm:ss');
        var end = moment(end).format('YYYY-MM-DD HH:mm:ss');
        this.timeRange.show();
        this.timeRange.find('.start').text(start);
        this.timeRange.find('.end').text(end);
    },

    _setCollectHistRange: function(start, end) {
        var m = moment(start);
        this.startTimeHist.next().find('.customDate.hasDatepicker').val(moment(start).format('YYYY-MM-DD'));
        this.startTimeHist.next().find('.hours').val(m.hours() > 9 ? m.hours() : '0'+m.hours());
        this.startTimeHist.next().find('.minutes').val(m.minutes() > 9 ? m.minutes() : '0'+m.minutes());
        this.startTimeHist.next().find('.seconds').val(m.seconds() > 9 ? m.seconds() : '0'+m.seconds());
    },

    show: function() {
        this.$elem.modal({'keyboard': false, 'backdrop': 'static', 'show': true});
        $('.modal-backdrop.in').css('opacity', 0.5);
        this.trigger("show");
        // this._disableSave();
    },

    hide: function() {
        this.desc.removeClass('error');
        this.desc.messagepop('hide');
        this.$elem.modal('hide');
        this.trigger("hide");
    }

});

(function($) {
    $.fn.DataSourcePopup = function(settings) {
        settings = settings || {};
        this.click(function() {
            var dataSourcePopup = new SpdDataSource.CollectDataSourcePopup(settings);
            dataSourcePopup.show();
        });

    };
})(jQuery);

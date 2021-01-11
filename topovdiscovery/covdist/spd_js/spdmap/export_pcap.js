
var SpdMap = CBMSFLOW.module('spdmap');

SpdMap.PcapExporter = CBMSFLOW.klass({

    __init__: function(){
        this.$elem = $('#export-pcap-popup');
        this.$startTimeElem = this.$elem.find('.start-time');
        this.$durationElem = this.$elem.find('.duration');
        this.$extractingElem = $('#extracting-pcap-popup');
        this.$exportPcap = $('#export-pcap-popup');
        this.$nodatasourceElem = $('#export-pcap-no-datasource-popup');
        this.$nopacketElem = $('#export-pcap-no-packet-popup');
        this.$extractBtnElem = this.$elem.find('.btn-primary.save');
        this.progressEventSource = null;
        this.xhr = null;
        this.timeRangeVal = null;

        this.startTimeDateInput = null;

        this._setInitState();
        this._bindEvents();
    },

    _setInitState: function() {
        this.$extractingElem.find('.extracting-progress').progressbar({
            value: 0
        });
        this.startTimeDateInput = this.$startTimeElem.datetimeInput();
        this.$durationElem.datetimeInput({'spinner': true, 'minutes': '01'});

        this.$startTimeElem.next().attr('id', this.$startTimeElem.attr('id'));
        this.$durationElem.next().attr('id', this.$durationElem.attr('id'));


        this.$startTimeElem.next().messagepop({'trigger': 'manual', 'container': this.$elem});
        this.$durationElem.next().messagepop({'trigger': 'manual', 'container': this.$elem});
    },

    _bindEvents: function(){
        var _this = this;

        $('#spdmap-toolbar button[name=export]').click(function(){
            _this.show(null);
        });

        this.$extractBtnElem.click(function(){
            if ($(this).hasClass('disabled')) {
                return false;
            }

            var map_name = CBMSFLOW.environment('map_name');
            var datasource_name = CBMSFLOW.environment('datasource_name');
            var task_id = UUID.genV4().hexString;

            var ipports = _this._extractIpports(_this.edgesNodesData);
            var totalCount = ipports.length;
            //var totalCount = 4;
            _this._extractingStarted(task_id, totalCount);
            _this._extractingProgress(task_id, totalCount);

            var startTime = _this.startTimeDateInput.getValTs();
            var duration = parseInt(_this.$durationElem.val()) || 300;

            this.xhr = $.ajax({
                url: CBMSFLOW.util.make_spd_i18n_url(map_name + '/datasource/export_pcap/' + datasource_name + '/'),
                type: 'POST',
                data: appendCsrfToken({
                    'ipports': JSON.stringify(ipports),
                    'start_time': startTime,
                    'duration': duration,
                    'task_id': task_id
                }),
                success: function(result) {
                    if(result['state'] == 'ok'){
                        _this._extractingFinished(result['export_files'], totalCount);
                    }else{
                    }
                }
            });
        });

        this.$extractingElem.find('.btn-second.close').click(function(){
            _this._extractingCancel();
        });

        this.$exportPcap.find('.btn-second.close').click(function(){
            if($("#export-pcap-start-time-input_message-pop").css("display") !=="none" ) {
                $("#export-pcap-start-time-input_message-pop").css({"display":"none"});
                _this.$extractBtnElem.removeClass('disabled');
            }
        });

        this.$nodatasourceElem.find('.btn-primary.close').click(function() {
            _this.$nodatasourceElem.modal('hide');
        });
        this.$nopacketElem.find('.btn-primary.close').click(function() {
            _this.$nopacketElem.modal('hide');
        });
        this.$startTimeElem.next().find('.tsInput').change($.proxy(this._startTimeChangeHandler, this)).keyup($.proxy(this._startTimeChangeHandler, this));
        this.$startTimeElem.next().find('.customDate').change($.proxy(this._startTimeChangeHandler, this)).keyup($.proxy(this._startTimeChangeHandler, this));
    },

    show: function(edgesNodesData){
        _this = this;
        if(!edgesNodesData){
            var map = CBMSFLOW.environment('topovmap_preview');
            this.edgesNodesData = map.getAllNodeData();
        }else{
            this.edgesNodesData = edgesNodesData;
        }

        var map_name = CBMSFLOW.environment('map_name');
        var datasource_name = CBMSFLOW.environment('datasource_name');
        if(!datasource_name){
            this.$nodatasourceElem.trigger('setDefault');
            this.$nodatasourceElem.modal({'keyboard': false, 'backdrop': 'static', 'show': true});
            $('.modal-backdrop.in').css('opacity', 0.5);
        }else{
            $.ajax({
                url: CBMSFLOW.util.make_spd_i18n_url(map_name + '/datasource/export_pcap/' + datasource_name + '/timerange/'),
                type: 'GET',
                async: false,
                success: function(result) {
                    if(result['state'] == 'ok' && result['time_range']){
                        var start = moment.unix(result.time_range.start).format('YYYY-MM-DD HH:mm:ss');
                        var end = moment.unix(result.time_range.end).format('YYYY-MM-DD HH:mm:ss');
                        _this.$elem.find('.range-select-tip-block .start').text(start);
                        _this.$elem.find('.range-select-tip-block .end').text(end);
                        _this.timeRangeVal = result.time_range;
                    }else{
                        _this.$elem.find('.range-select-tip-block .start').text('0000-00-00 00:00:00');
                        _this.$elem.find('.range-select-tip-block .end').text('0000-00-00 00:00:00');
                        _this.timeRangeVal = null;
                    }
                }
            });
            this._setInitValues();
            this.$elem.trigger('setDefault');
            this.$elem.modal({'keyboard': false, 'backdrop': 'static', 'show': true});
            $('.modal-backdrop.in').css('opacity', 0.5);
        }
    },

    _setProgress: function(progress){
        this.$extractingElem.find('.extracting-progress').progressbar({value: progress});
    },

    _extractingStarted: function(task_id, totalCount){
        this._setProgress(0);

        this.$extractingElem.find('.current-count').text(0);
        this.$extractingElem.find('.total-count').text(totalCount);

        this.$extractingElem.trigger('setDefault');
        this.$extractingElem.modal({'keyboard': false, 'backdrop': 'static', 'show': true});
        $('.modal-backdrop.in').css('opacity', 0.5);
        this.$elem.modal('hide');
    },

    _extractingProgress: function(task_id, totalCount){

        var _this = this;
        this.progressEventSource = new EventSource(CBMSFLOW.util.make_spd_i18n_url('events/task/' + task_id + '/'));
        this.progressEventSource.addEventListener('event', function(e){
            var data = JSON.parse(e.data);
            var currentCount = data.current_count -1;
            var progress = (currentCount) / totalCount * 100;
            _this.$extractingElem.find('.current-count').text(currentCount);
            _this._setProgress(progress);
        }, false);
        this.progressEventSource.addEventListener('eof', function(e){
            _this.progressEventSource.close();
        }, false);
    },

    _extractingFinished: function(exportFiles, totalCount){
        this.$extractingElem.find('.current-count').text(totalCount);
        this._setProgress(100);
        if(this.progressEventSource){
            this.progressEventSource.close();
        }
        this._downloadPcap(exportFiles);
    },

    _downloadPcap:function(exportFiles){
        var self = this;
        var mapName = CBMSFLOW.environment('map_name');
        $.ajax({
            url: CBMSFLOW.util.make_spd_i18n_url(mapName + '/downloadpcap/'),
            type: 'POST',
            data: appendCsrfToken({
                'export_file_list': JSON.stringify(exportFiles)
            }),
            success: function(result) {
                if(result['state'] == 'ok'){
                    var downloadData = {'export_file_list': JSON.stringify(exportFiles)};
                    downloadData = '?' + $.param(downloadData);
                    $(location).attr('href', CBMSFLOW.util.make_spd_i18n_url(mapName + '/downloadpcap/' + downloadData));
                    self.$extractingElem.modal('hide');
                }else{
                    self.$extractingElem.modal('hide');
                    self.$nopacketElem.trigger('setDefault');
                    self.$nopacketElem.modal({'keyboard': false, 'backdrop': 'static', 'show': true});
                    $('.modal-backdrop.in').css('opacity', 0.5);
                }
            }
        });
    },

    _extractingCancel: function(){
        if(this.progressEventSource){
            this.progressEventSource.close();
        }
        if(this.xhr){
            this.xhr.abort();
            this.xhr = null;
        }
        this.$extractingElem.modal('hide');
    },

    _extractIpports: function(edgesNodesData){
        var ipports = [];
        _.each(edgesNodesData || [], function(enData){
            if(enData != undefined){
                var mode = enData['mode'] || 'link';
                if(mode == 'server'){
                    var server = enData['server'];
                    var title = enData['title'];
                    ipports.push({
                        'dst_ips': _.pluck(server.ips, 'ip'),
                        'dst_ports': server.ports,
                        'name': CBMSFLOW.util.formatString("%s_%s.pcap", [title, server.group]),
                        'mode': 'server'
                    });
                }
                else if(mode == 'node') {
                    var node_name = enData['node'];
                    var servers = enData['servers'];
                    _.each(servers || [], function(server){
                        var ips = server.ips || [];
                        var ports = server.ports || [];
                        if(ips.length > 0 && ports.length > 0){
                            ipports.push({
                                'dst_ips': _.pluck(ips, 'ip'),
                                'dst_ports': ports,
                                'name': CBMSFLOW.util.formatString("%s_%s.pcap", [node_name, server.group]),
                                'mode': 'server'
                            });
                        }
                    });
                }
                else{
                    var links = _.flatten(enData.links, true);
                    _.each(links || [], function(link){
                        var clients = link.clients;
                        _.each(link.servers || [], function(server){
                            ipports.push({
                                'src_ips': _.pluck(clients.ips, 'ip'),
                                'dst_ips': _.pluck(server.ips, 'ip'),
                                'dst_ports': server.ports,
                                'name': CBMSFLOW.util.formatString("%s-%s_%s.pcap", [enData.nodeA.title, enData.nodeB.title, server.group]),
                                'mode': 'link'
                            });
                        });
                    });
                }
            }
        });
        return ipports;
    },

    _setInitValues: function(){
        if (this.timeRangeVal) {
            var startTime = Math.max(this.timeRangeVal.start, this.timeRangeVal.end - 300);
        } else {
            var startTime = moment().unix();
        }
        this.startTimeDateInput.updateVal(startTime)
    },

    _startTimeChangeHandler: function() {
        var datepicker = this.$startTimeElem.next();
        var date_str = datepicker.find('.customDate').val();
        var hours = datepicker.find('input.hours').val();
        var minutes = datepicker.find('input.minutes').val();
        var seconds = datepicker.find('input.seconds').val();
        var datestr = date_str + ' ' + hours + ":" + minutes + ":" + seconds;
        var m = moment(datestr);

        if(m.isValid()) {
            this.$startTimeElem.next().removeClass('error');
            this.$startTimeElem.messagepop('hide');
            if (!this._judgeStartTimeRange(m.unix())) {
                this.$startTimeElem.next().addClass('error');
                return false;
            } else {
                this.$startTimeElem.next().removeClass('error');
                this.$startTimeElem.messagepop('hide');
            }
        } else {
            this.$startTimeElem.next().addClass('error');
            this.$startTimeElem.messagepop('show', gettext('格式错误'));
            this.$extractBtnElem.addClass('disabled');
        }
        this._enableExtract();
    },

    _judgeStartTimeRange: function(start_time, duration) {
        if (this.timeRangeVal) {
            var timeRangeValStart = this.timeRangeVal.start;
            var timeRangeValEnd = this.timeRangeVal.end;

            if (start_time > timeRangeValEnd) {
                this.$startTimeElem.next().messagepop('show', gettext('开始时间不可晚于') + moment.unix(timeRangeValEnd).format('YYYY-MM-DD HH:mm:ss'));
                this.$extractBtnElem.addClass('disabled');
                return false;
            }
            if (start_time < timeRangeValStart){
                this.$startTimeElem.next().messagepop('show', gettext('开始时间不可早于') + moment.unix(timeRangeValStart).format('YYYY-MM-DD HH:mm:ss'));
                this.$extractBtnElem.addClass('disabled');
                return false;
            }

        }

        return  true;
    },

    _enableExtract: function() {
        if (this.$elem.find('.error').length == 0) {
            this.$extractBtnElem.removeClass('disabled');
        }
    }

});


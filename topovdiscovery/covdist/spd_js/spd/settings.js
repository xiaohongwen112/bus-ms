
CBMSFLOW.module("spd.Settings");

CBMSFLOW.spd.Settings.TopIpFlowSettings = CBMSFLOW.klass({

    __init__: function(container, values, defaultValues){
        this.values = values;
        this.defaultValues = defaultValues;

        this.container = container;
        this.$topIpElem = this.container.find("#settings-topip");
        this.$topFlowElem = this.container.find("#settings-topflow");
        this.$currentIpCountElem = this.container.find('#spd-settings-current-ip-count');

        this.$recoveryDefaultElem = this.container.find("#settings-recovery-default");

        this.$topIpElem.messagepop({'trigger':'manual', 'container':'#spd-settings-frame'});
        this.$topFlowElem.messagepop({'trigger':'manual', 'container':'#spd-settings-frame'});

        this.recoverValue();
        this.initEvents();
    },
    close: function(){
        this.$topIpElem.removeClass('error').messagepop("hide");
        this.$topFlowElem.removeClass('error').messagepop("hide");
        this.recoverValue();
    },
    isValid: function(){
        var isTopIpValid = this._validateTopIp();
        var isTopFlowValid = this._validateTopFlow();
        if(isTopIpValid && isTopFlowValid){
            return true;
        }else{
            return false;
        }
    },
    getNewValue: function(){
        var topip = parseInt($.trim(this.$topIpElem.val()));
        var topflow = parseInt($.trim(this.$topFlowElem.val()));
        return {
            'top_ip': topip,
            'top_flow': topflow
        };
    },
    recoverValue: function(){
        this.$topIpElem.val(this.values["top_ip"]);
        this.$topFlowElem.val(this.values["top_flow"]);
    },
    updateValue: function(values){
        this.values = values;
    },
    isValueChanged: function(){
        var newValue = this.getNewValue();
        return !_.isEqual(newValue, this.values);
    },
    initEvents: function(){
        var _this = this;
        this.$recoveryDefaultElem.click(function(){
            _this.recoveryDefault();
        });
        this.$topIpElem.keyup(function(e){
            if (_.contains([13,16,17,18,19,20,27],e.keyCode)) {
                return false;
            }
            var isValid = _this._validateTopIp();
            if(!isValid){
                $(this).addClass("error").messagepop("show", gettext("输入必须为整数"));
                _this._setSaveBtnDisabled();
            }else{
                $(this).removeClass("error").messagepop("hide");
                _this._removeSaveBtnDisabled();
            }

            var topip = $.trim(_this.$topIpElem.val());
            if (topip === '') {
                $(this).addClass("error").messagepop("show", gettext("输入不能为空"));
                _this._setSaveBtnDisabled();
            }
        });
        this.$topIpElem.blur(function(){
            var isValid = _this._validateTopIp();
            var topip = $.trim(_this.$topIpElem.val());
            if (topip === '') {
                $(this).addClass("error").messagepop("show", gettext("输入不能为空"));
                _this._setSaveBtnDisabled();
            }

        });
        this.$topFlowElem.keyup(function(){
            if (_.contains([13,16,17,18,19,20,27],e.keyCode)) {
                return false;
            }
            var isValid = _this._validateTopFlow();
            if(!isValid){
                $(this).addClass("error").messagepop("show", gettext("输入必须为整数"));
                _this._setSaveBtnDisabled();
            }else{
                $(this).removeClass("error").messagepop("hide");
                _this._removeSaveBtnDisabled();
            };

            var topflow = $.trim(_this.$topFlowElem.val());
            if (topflow === '') {
                $(this).removeClass("error").messagepop("hide");
                _this._setSaveBtnDisabled();
            }
        });
        this.$topFlowElem.blur(function(){
            var isValid = _this._validateTopFlow();
            var topflow = $.trim(_this.$topFlowElem.val());
            if (topflow === '') {
                $(this).addClass("error").messagepop("show", gettext("输入不能为空"));
                _this._setSaveBtnDisabled();
            }
        });

        var frameDispatch = CBMSFLOW.environment('frameDispatch');
        frameDispatch.bind('frame.open', function(name){
            if(name == 'settings'){
                var activeDatasource = CBMSFLOW.environment('active_datasource');
                if(activeDatasource){
                   _this.$currentIpCountElem.text(activeDatasource.ip_count);
                }
            }
        });
    },
    recoveryDefault: function(){
        this.$topIpElem.removeClass('error').messagepop("hide");
        this.$topFlowElem.removeClass('error').messagepop("hide");
        this.$topIpElem.val(this.defaultValues["top_ip"]);
        this.$topFlowElem.val(this.defaultValues["top_flow"]);
        this._removeSaveBtnDisabled();
    },
    _setSaveBtnDisabled: function() {
        this.manager.trigger('updateSaveBtnStatus');
    },

    _removeSaveBtnDisabled: function() {
        if(!this.$topFlowElem.hasClass("error") && !this.$topIpElem.hasClass("error")){
            this.manager.trigger('updateSaveBtnStatus');
        }
    },
    _validateTopIp: function(){
        var topip = $.trim(this.$topIpElem.val());
        return /^\d+$/.test(topip);
    },
    _validateTopFlow: function(){
        var topflow = $.trim(this.$topFlowElem.val());
        return /^\d+$/.test(topflow);
    }
});



CBMSFLOW.spd.Settings.MapFilterIPTool = CBMSFLOW.klass({
    __init__:function(container){
        this.container = container;
        this.id = CBMSFLOW.util.auid("tools", "tool-");
        this.initEvents();
    },
    _getForm:function(id){
        return $("#"+id, this.container);
    },
    _createForm:function(id){
        form = $("<form target='_blank' method='post' id='"+ id +"'></form>").appendTo(this.container);
        form.height(0)
            .width(0)
            .css({
                'position':'absolute',
                'left':'-9999px',
                'overflow':'hidden'
            });
        form.append("<input type='hidden' name='csrfmiddlewaretoken' value='"+getCsrfCookie()+"' />");
        return form;
    },
    _getUploadForm:function(url){
        var id = this.id + "-upload";
        var form = this._getForm(id);
        if(form.length == 0){
            form = this._createForm(id);
            form.attr("enctype","multipart/form-data");
            $("<input name='upload_data' type='file' />").appendTo(form).css({
                'height':'0px',
                'width':'0px',
                'margin':'0px',
                'padding':'0px',
                'border':'0px'
            });
        }
        form.attr("action", url);
        return form;
    },
    _getDownloadForm:function(url){
        var id = this.id + "-download";
        var form = this._getForm(id);
        if(form.length == 0){
            form = this._createForm(id);
            $("<input name='download_data' type='hidden' />").appendTo(form);
        }
        form.attr("action", url);
        return form;
    },
    initEvents:function(){
        var _this = this;
        var map = CBMSFLOW.environment("map_name");
        //url path
        var upload_url = CBMSFLOW.util.format_spd_i18n_url("/%s/settings/uploadip/", [map]);
        var download_url = CBMSFLOW.util.format_spd_i18n_url("/%s/settings/downloadip/", [map]);
        var upload_form = this._getUploadForm(upload_url);
        var upload_input = $("input[name=upload_data]", upload_form);
        var download_form = this._getDownloadForm(download_url);
        var download_input = $("input[name=download_data]", download_form);
        $("#settings-upload-ip", this.container).click(function(){
            upload_input.trigger("click");
            if ($.browser.msie){
                upload_input.trigger('change');
            }
        });
        upload_input.change(function(){
            if($(this).val() == ""){
                return;
            }
            upload_form.ajaxSubmit({
                dataType:'json',
                success:function(result){
                    upload_input.val("");
                    if(result.code === 0){
                        _this.uploadCallback(result.data);
                    }
                    else{
                        alert(result.msg);
                    }
                },
                error:function(){
                    upload_input.val("");
                    alert(gettext("上传错误"));
                }
            });
        });
        $("#settings-download-ip", this.container).click(function(){
            _this.download(_this.getData());
        });

        this.upload = function(file_name){
            upload_input.val(file_name);
            upload_input.trigger("change");
        };
        this.download = function(data){
            download_input.val(JSON.stringify(data));
            download_form.trigger("submit");
        };
    },
    getData:function(){
        return this.getOption('getData', function(){return [];})();
    },
    uploadCallback:function(data){
        return this.getOption('uploadCallback', function(){})(data);
    }
});



CBMSFLOW.spd.Settings.ActionsManager = CBMSFLOW.klass({
    __init__: function(container, topIpFlowSettings, deviceIpsSettings){
        this.container = container;
        topIpFlowSettings.manager = this;
        deviceIpsSettings.manager = this;
        this.topIpFlowSettings = topIpFlowSettings;
        this.deviceIpsSettings = deviceIpsSettings;
        this.$saveElem = this.container.find("#spd-settings-save");
        this.$cancleElem = this.container.find("#spd-settings-cancle");
        this.$savedTipElem = $('#spd-settings-saved-tip');
        this.initEvents();

        var map = CBMSFLOW.environment("map_name");
        this.url = CBMSFLOW.util.format_spd_i18n_url("/%s/settings/save/", [map]);
    },
    initEvents: function(){
        var _this = this;
        this.$saveElem.click(function(){
            if(_this.isValid()){
                if(!_this.isValueChanged()){
                    return false;
                }
                var topIpFlowValue = _this.topIpFlowSettings.getNewValue();
                var deviceIpsValue = _this.deviceIpsSettings.getIplistDataMap();
                var settingsValue = $.extend({}, topIpFlowValue, deviceIpsValue);
                var data = {"settings": JSON.stringify(settingsValue)};
                _this.hideSavedTip(true);
                $.ajax({
                    "url": _this.url,
                    "type": "POST",
                    "data": data,
                    "dataType": "json",
                    "success": function(data){
                        _this.topIpFlowSettings.updateValue(topIpFlowValue);
                        _this.deviceIpsSettings.updateData(deviceIpsValue);
                        var FrameDispatchInstance = CBMSFLOW.environment('frameDispatch');
                        FrameDispatchInstance.removeFrame('map');
                        _this.showSavedTip();
                        var deviceIpsMap = CBMSFLOW.environment('ipDeviceMap');
                        if(!deviceIpsMap){
                            deviceIpsMap = {};
                            CBMSFLOW.environment('ipDeviceMap', deviceIpsMap);
                        }
                        else{
                            CBMSFLOW.util.clearDict(deviceIpsMap);
                        }
                        $.extend(deviceIpsMap, data.ip_device_map || {});
                        // CBMSFLOW.environment('ipDeviceMap')
                    },
                    "error": function(){
                    }
                });
            }
        });
        this.$cancleElem.click(function(){
            _this.leave();
        });

        this.bind('updateSaveBtnStatus', $.proxy(this._updateSaveBtnStatus, this));
    },
    showSavedTip: function(){
        this.$savedTipElem.slideDown();
        window.setTimeout($.proxy(this.hideSavedTip, this), 3000);
    },
    hideSavedTip: function(immediate){
        immediate = immediate || false;
        if(immediate){
            this.$savedTipElem.hide();
        }else{
            this.$savedTipElem.slideUp('fast');
        }
    },
    isValid: function(){
        var isTopIpFlowValid = this.topIpFlowSettings.isValid();
        var isDeviceIpsValid = this.deviceIpsSettings.isValid();
        return isTopIpFlowValid && isDeviceIpsValid;
    },
    isValueChanged: function(){
        var isTopIpFlowChanged = this.topIpFlowSettings.isValueChanged();
        var isDeviceIpsChanged = this.deviceIpsSettings.isChanged();
        return isTopIpFlowChanged || isDeviceIpsChanged
    },
    leave: function(){
        if(!this.isValueChanged()){
            this.close();
        }else{
            $('#close_settings_popup').modal({'keyboard': false, 'backdrop': 'static', 'show': true});
            $('.modal-backdrop.in').css('opacity',0.5);
        }
    },
    close: function(){
        this.topIpFlowSettings.close();
        this.deviceIpsSettings.revertData();

        var FrameDispatchInstance = CBMSFLOW.environment('frameDispatch');
        FrameDispatchInstance.menu.hideSettings();
        if(FrameDispatchInstance.menu.active == 'settings'){
            FrameDispatchInstance.toggle("map");
        }
    },
    _updateSaveBtnStatus: function() {
        if(this.isValid()){
            this._removeSaveBtnDisabled();
        }else{
            this._setSaveBtnDisabled();
        }
    },
    _setSaveBtnDisabled: function() {
        $('#spd-settings-save').attr('disabled', true).addClass('disabled');
    },

    _removeSaveBtnDisabled: function() {
        $('#spd-settings-save').attr('disabled', false).removeClass('disabled');
    }
});



/*
 * Ip List Editor in settings
 *
 */

(function($) {

    var DeviceIpList = function(name, iplistEditor) {
        this.name = name;
        this.iplistEditor = iplistEditor;
        this.changed = false;
        this.isValid = true;
        this.kind = this._judgeKind();
        this.$table = $('#spd-settings-iplist .' + name + ' .table-body');
        this.$header = $('#spd-settings-iplist .' + name + ' .table-header');
        this.$sortBlock = $('#spd-settings-iplist .'+name +" .table-body table.device-ip-table");
        this.$list = $('#spd-settings-iplist .'+name +" .table-body table tbody");
        this.$listContainer = $('#spd-settings-iplist .'+name +" .table-body");
        this._resetListElem();
        this._init();
        this._bindEvents();
    };

    

    DeviceIpList.prototype = {
        _init: function() {
            var data = this.iplistEditor.getIplistDataByName(this.name);
            this._renderList({'iplist': data});
        },
        recordTemplate:function(datas) {
            var data = datas.iplist;
            var dataLen = data.length;
            var templates = '';
            for(var i=0;i<dataLen;i++){
                var preTem = 
                '<tr class="device-ip-row">'+
                    '<td class="ip">'+
                        '<span>'+data[i].ip+'</span>'+
                        '<input type="text" value="'+data[i].ip+'"  disabled="disabled" class="unvisible" placeholder="请输入IP"/>'+
                    '</td>'+
                    '<td class="device">'+
                        '<span>'+data[i].device+'</span>'+
                        '<input type="text" value="'+data[i].device+'" disabled=disabled class="unvisible" placeholder="请输入设备名称"/>'+
                        '<span class="spd-icon spd-icon-trash delete"></span>'+
                        '<span class="spd-icon spd-icon-rename rename"></span>'+
                    '</td>'+
                '</tr>';
                templates += preTem;
            }
            return templates;
        },
        _renderList: function(data) {
            var self = this;
            this.$list.empty();
            $(this.recordTemplate(data)).appendTo(this.$list);

            this.$sortBlock.tablesorter({
                headers:{
                    0:{sorter: "ipAddress"},
                    1:{sorter: "text"}
                },
                textExtraction: function(cell) {
                    return $(cell).find('input').val();
                }
            });

            if (!this.$table.hasClass('mCustomScrollbar')) {
                this.$table.mCustomScrollbar({
                    callbacks: {
                        onScroll: function(){
                            self._moveErrorTip();
                        },
                        whileScrolling: function(){
                            self._moveErrorTip();
                        }
                    }
                });
            }
            this._updateDisplay();
            this.$sortBlock.trigger('update');
            this._clearSort();
        },

        _updateDisplay: function() {
            this.$table.mCustomScrollbar("update");
            var scrollBar = this.$table.find('.mCSB_scrollTools');
            if (scrollBar.is(':visible')) {
                this.$table.parent().addClass('with-scrollbar');
            } else {
                this.$table.parent().removeClass('with-scrollbar');
            }
            this._moveErrorTip();
        },

        _moveErrorTip: function(){
            var cell = this.$list.find('input.error');
            cell.messagepop('updatePos');
        },

        _bindEvents: function() {
            var self = this;
            var $list = this.$list;
            var $listContainer = this.$listContainer;

            var $rows = $list.find('tr');
            this.$rows = $rows;
            this.$rows.draggable({
                appendTo : $listContainer,
                helper: function(){
                    var h =  $("<div class='drag-helper' style='z-index:200;'><table><tbody></tbody></table></div>");
                    h.find('tbody').append($.clone(this));
                    h.find('tr .spd-icon').remove();
                    return h;
                },
                revert: "invalid",
                cursor: "move",
                create: function(e, ui){
                    var p = $(this).parent();
                    var pos = $rows.index(this);
                    $(this).bind('dragging.revert', function(e, ele){
                        if(pos == 0){
                            p.prepend(this);
                        }
                        else{
                            p.find('tr').eq(pos-1).after(this);
                        }
                    });
                },
                destory: function(e, ui){
                    $(this).unbind('dragging.revert');
                    this.removeClass('dragging');
                },
                start: function(e, ui){
                    var p = $(this).parent();
                    var pos = $rows.index(this);
                    $(this).addClass("dragging");
                    $(this).bind('dragging.revert', function(e, ele){
                        if(pos == 0){
                            p.prepend(this);
                        }
                        else{
                            p.find('tr').eq(pos-1).after(this);
                        }
                    });
                },
                drag: function(e, ui){
                    $(this).trigger('dragging.for.drop', [ui]);
                },
                stop: function(e, ui){
                    if($(this).hasClass('dragging')){ // not accepted , revert
                        $(this).removeClass('dragging');
                        $(this).trigger('dragging.revert');
                    }

                    $('body').css('cursor', 'default');
                }
            });
            this.$listContainer.droppable({
                tolerance : "pointer",

                accept: function(ele){
                    var $rows = $list.find('tr');
                    return $(ele).is("tr.device-ip-row"); // && $rows.index(ele) == -1;
                },

                over: function(e, ui){
                    ui.draggable.unbind('dragging.for.drop');
                    var lastDropIndex = -1;
                    ui.draggable.bind('dragging.for.drop', function(e, ui){
                        var draggable = $(this);
                        var sTop = $listContainer.find('.mCSB_container').position().top;
                        var top = ui.position.top - ($listContainer.position().top + sTop);
                        var $rows = $list.find('tr:not(.dragging)');
                        var dropIndex = $rows.length;
                        $.each($rows, function(index, ele){
                            rtop = $(ele).position().top;
                            if(rtop < 0){
                                return;
                            }
                            if(top < rtop){
                                dropIndex = index;
                                return false;
                            }
                        });
                        if(lastDropIndex == dropIndex){
                            return;
                        }
                        if(dropIndex < $rows.length){
                            $rows.eq(dropIndex).before(draggable);
                        }
                        else{
                            $list.append(draggable);
                        }
                        lastDropIndex = dropIndex;
                        self._updateDisplay();
                        return;
                    });
                },
                out : function(e, ui){
                    ui.draggable.unbind('dragging.for.drop');
                    ui.draggable.trigger('dragging.revert');
                },
                drop: function(e, ui) {
                    self._clearSort();
                    ui.draggable.removeClass('dragging');
                    self._updateDisplay();
                    self.changed = true;
                }
            });

            var $cell = this.$list.find('td');
            $cell.unbind('click').click($.proxy(this._cellClickHandler, this));

            var $input = this.$list.find('td input');
            $input.unbind('blur').blur($.proxy(this._inputBlurHandler, this));

            $input.unbind('keypress').keyup($.proxy(this._inputKeyPressHandler, this));


            var $rename = this.$list.find('.rename');
            $rename.unbind('click').click($.proxy(this._renameHandler, this));

            var $delete = this.$list.find('.delete');
            $delete.unbind('click').click($.proxy(this._deleteHandler, this));
            var $addNew = $('#spd-settings-iplist .'+this.name +' .add-new');
            $addNew.unbind('click').click(function(e){
                if($(this).is(':not(.disabled)')){
                    self._addNewHandler(e);
                }
                e.stopPropagation();
            });

            var $sortColumn = this.$header.find('th span.sort');
            $sortColumn.unbind('click').click($.proxy(this._sortColumn, this));

            $(document.body).click(function(e) {
                if ($(e.target).parents('.device-ip-row').length == 0) {
                    self.$table.find('td.device span:first').removeClass('unvisible');
                    self.$table.find('td.device input[type=text]').addClass('unvisible').attr('disabled', true);
                }
            });
        },

        _cellClickHandler: function(e) {
            // control style
            var $target = $(e.target);

            if (!$target.is('input')) {
                $('#spd-settings-iplist input:visible').trigger('blur');
                $(e.currentTarget).find('input:visible').trigger('blur');
                return false;
            }

            if ($target.is('input') && $target.attr('disabled') == undefined) {
                return false;
            }

            if (($target.attr('disabled') == 'disabled')) {
                $target.attr('disabled', false);
                $target.focus();
            } else {
                $target.attr('disabled', true);
            }
            return null;
        },

        _sortColumn: function(e) {
            var $target = $(e.target);
            var th = $target.parent();
            var thead = th.parent();
            var sortIndex = thead.find('th').index(th);
            var sortOrder = 0;

            if ($target.hasClass('sort-auto')) {
                $target.removeClass('sort-auto');
                $target.addClass('sort-down');
                sortOrder = 1;
            } else if ($target.hasClass('sort-up')) {
                $target.removeClass('sort-up');
                $target.addClass('sort-down');
                sortOrder = 1;
            } else if ($target.hasClass('sort-down')) {
                $target.removeClass('sort-down');
                $target.addClass('sort-up');
                sortOrder = 0;
            }

            thead.find('th:not(:eq(' + sortIndex + ')) span.sort').removeClass('sort-down').removeClass('sort-up').addClass('sort-auto');
            this.$sortBlock.trigger("sorton", [[[sortIndex, sortOrder]]]);
        },

        _clearSort: function() {
            this.$header.find('span.sort').removeClass('sort-down');
            this.$header.find('span.sort').removeClass('sort-up');
            this.$header.find('span.sort').addClass('sort-auto');
            this.$sortBlock.trigger('update');

            /*
            $.each(this.$sortBlock.find('thead th'), function(index, th){
                if($(th).hasClass('headerSortDown')){
                    $(th).trigger('click');
                }
            });
            */
            //this.$sortBlock.find('thead th').trigger('click');
            //headerSortDown
        },

        _addNewHandler: function(e) {
            this._setSaveBtnDisabled();
            var add_btn = $(e.target);
            // this.$table.find('td.device input[type=text]').hide();
            this.$table.find('td.device input[type=text]').addClass('unvisible');
            var empty_record = $(this.recordTemplate({'iplist': [{'ip':'', 'device':''}]}));
            empty_record.appendTo(this.$list);
            var ip_span = $(empty_record.find('span')[0]).addClass('unvisible');
            var name_span = $(empty_record.find('span')[1]).addClass('unvisible');
            var ip_input = $(empty_record.find('input')[0]).removeClass('unvisible');
            var name_input = $(empty_record.find('input')[1]).removeClass('unvisible');
            ip_input.attr('disabled', false).focus();
            name_input.attr('disabled', false);
            this._bindEvents();
            this._updateDisplay();
        },
        _inputKeyPressHandler: function(e) {
            if (e.which != 13) {
                return;
            }
            var $target = $(e.target);
            $target.blur();
        },

        _inputBlurHandler: function(e) {
            //hidden element also has blur event ????
            e.stopImmediatePropagation()
            if(!$(e.target).is(':visible')){
                return false;
            }
            var changed = this.changed;
            var $target = $(e.target);
            $target.removeClass('error');
            var need_check_ip = $target.parent().hasClass('ip');
            if(need_check_ip){
                var new_ip = $target.val().trim();
                var msg = this.iplistEditor.checkIPValid(new_ip);
                if(msg){
                    $target.addClass('error');
                    $target.messagepop({'trigger':'manual','container':'#spd-settings-iplist'});
                    $target.messagepop('show', msg);
                    return false;
                }else{
                    $target.messagepop('hide');
                }
                this._removeSaveBtnDisabled();
            }
            if ($target.attr('disabled') == undefined) {
                $target.attr('disabled', true);
            }
            var device_name = $target.val();
            $target.addClass('unvisible');
            var name_span = $target.parent().find('span:first');
            var device_org_name = name_span.text();
            name_span.text(device_name);
            name_span.removeClass('unvisible');
            if(!changed && (device_name != device_org_name)){
                this.changed = true;
            }

            this.$sortBlock.trigger('update');
            // TODO:clean device name sort reslut and icon.
            this._clearSort();

        },

        _renameHandler: function(e) {
            e.stopPropagation();
            var rename_btn = $(e.target);
            var name_span = rename_btn.parent().find('span:first');
            name_span.addClass('unvisible');
            var device_input = rename_btn.parent().find('input');
            device_input.removeClass('unvisible');
            // device_input.attr('disabled', false).show();
            device_input.attr('disabled', false);
            device_input.focus().select();
            //device_input.trigger('click');
            this.$sortBlock.trigger('update');
        },

        _deleteHandler: function(e) {
            e.stopPropagation();
            var delete_btn = $(e.target);
            var parent_tr = delete_btn.parents('tr');
            $("input.error", parent_tr).each(function(){$(this).messagepop('hide');});
            parent_tr.remove();

            this._updateDisplay();
            this._removeSaveBtnDisabled();
            this.$sortBlock.trigger('update');
            this.changed = true;
            this.$list.find('input.error').each(function(){$(this).messagepop('updatePos');});
        },

        _judgeKind: function() {
            var kinds = this.iplistEditor.getKinds();
            return $.inArray(this.name, kinds);
        },

        _setSaveBtnDisabled: function() {
            $('#spd-settings-iplist .add-new').addClass('disabled');
            this.isValid = false;
            this.iplistEditor.manager.trigger('updateSaveBtnStatus');
        },

        _removeSaveBtnDisabled: function() {
            if(!this.$list.find('input').hasClass('error')){
                $('#spd-settings-iplist .add-new').removeClass('disabled');
                this.isValid = true;
                this.iplistEditor.manager.trigger('updateSaveBtnStatus');
            }
        },

        _resetListElem: function(){
            this.$list.find('input.error').each(function(){$(this).messagepop('hide');});
            $('#spd-settings-save').attr('disabled', false).removeClass('disabled');
            $('#spd-settings-iplist .add-new').removeClass('disabled');
        },

        loadData: function() {
            this._init();
            this._bindEvents();
            this.changed = true;
        },

        getData: function(isKindNum) {
            var $rows = this.$list.find('tr');
            var deviceIpDataList = [];
            var kind = (isKindNum == undefined || !isKindNum) ? this.name : this.kind;

            $.each($rows, function(index, row) {
                var ip = $(row).find('td.ip span').text();
                var device = $(row).find('td.device span').text();
                deviceIpDataList.push({'ip': ip, 'device': device, 'kind': kind});
            });
            return deviceIpDataList;
        }
    };


    var DeviceIpListEditor = function(elem, settings) {
        this.iplistCopy = null;
        this.iplistCollection = [];
        this.$elem = elem; // elem is $spd-settings-iplist
        this.settings = settings;
        this.iplist = [];
        this._convertData(settings['iplist']);
        this._init();
    };

    DeviceIpListEditor.prototype = {

        _init: function() {
            this.iplistCollection = [];

            var self = this;
            $.each(this.getKinds(), function(index, k) {
                self.iplistCollection.push(new DeviceIpList(k, self));
            });
        },

        isValid: function(){
            var isValid = true;
            $.each(this.iplistCollection, function(index, item) {
                if(!item.isValid){
                    isValid = false;
                    return false;
                }
            });

            return isValid;
        },

        _convertData: function(iplist) {
            this.iplistCopy = null;
            if ($.isArray(iplist)) {
                this.iplist = iplist;
                this.iplistCopy = $.extend(true, [], iplist);
            } else if ($.isPlainObject(iplist)) {
                var self = this;
                $.each(iplist, function(key, item) {
                    self.iplist = self.iplist.concat(item);
                });
                this.iplistCopy = $.extend(true, {}, iplist);
            }
        },

        _getGroupData: function() {
            var groupData = _.groupBy(this.iplist, 'kind');
            var rerangeGroupData = {};
            var kinds = this.getKinds();
            $.each(groupData, function(key, value) {
                if ($.isNumeric(key)) {
                    rerangeGroupData[kinds[parseInt(key)]] = value;
                } else {
                    rerangeGroupData[key] = value;
                }
            });
            return rerangeGroupData;
        },

        _getTableByKind: function(kind) {
            return this.$elem.find('.' + kind + ' .table-body table tbody');
        },

        isChanged: function() {
            var isChanged = false;
            $.each(this.iplistCollection, function(index, item) {
                isChanged = isChanged || item.changed;
            });

            return isChanged;
        },

        getKinds: function() {
            /* 0(normal_ips), 1(include_ips), 2(exclude_ips)*/
            return ['normal_ips', 'include_ips', 'exclude_ips'];
        },

        getIplistDataByName: function(name) {
            var groupedData = this._getGroupData();
            if (!$.isEmptyObject(groupedData)) {
                return groupedData[name]||[];
            } else {
                return [];
            }
        },

        getIplistData: function() {
            var iplistData = [];
            $.each(this.iplistCollection, function(index, item) {
                iplistData = iplistData.concat(item.getData(true));
            });
            return iplistData;
        },

        getIplistDataMap: function() {
            var dataMap = {};
            $.each(this.iplistCollection, function(index, item) {
                dataMap[item.name] = item.getData();
            });
            return dataMap;
        },

        loadData: function(iplist) {
            this._convertData(iplist);

            $.each(this.iplistCollection, function(index, item) {
                item.loadData();
            });
        },

        revertData: function() {
            this.iplist = [];
            this._convertData(this.iplistCopy);
            this._init();
        },

        updateData: function(iplist) {
            $.each(this.iplistCollection, function(index, item) {
                item.changed = false;
            });
            this._convertData(iplist);
        },

        checkIPValid: function(new_ip) {
            var msg = false;
            if(new_ip == ''){
                return gettext('IP地址不能为空');
            }
            var ip_re = /^((\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])((\/([1-9]|[1-2][0-9]|3[0-2]))?)$/;
            try{
                if(!ip_re.test(new_ip)){
                    return gettext('IP地址格式错误');
                }
            }
            catch(e){
                return gettext('IP地址格式错误');
            }

            $.each(this.getIplistData(), function(index, ip_item){
                if(ip_item.ip == new_ip) {
                    msg = gettext('IP地址重复');
                    return;
                }
            });
            return msg;

        }
    };

    $.fn.DeviceIpListEditor = function(settings, args) {
        /*
         * settings:
         * iplist: [{'ip':'127.0.0.1', 'device': 'WEB-1', 'kind': 0}]
         *   kind:
         *    0: normal_ips
         *    1: include_ips
         *    2: exclude_ips
         *
         */
        var mapName = CBMSFLOW.environment("map_name");
        settings = settings||{};
        if (mapName == undefined || mapName === '') {
            throw new Error("map can't be empty");
        }
        if (typeof(settings) === 'object') {
            if ($._ile == undefined) {
                $._ile = {};
            }
            $._ile[mapName] = new DeviceIpListEditor(this, settings);
            return $._ile[mapName];
        } else if (typeof(settings) === 'string') {
            if ($._ile[mapName]) {
                if (typeof($._ile[mapName][settings]) === 'function') {
                    return $._ile[mapName][settings](args);
                }
            }
        }
        return null;
    };

})(jQuery);

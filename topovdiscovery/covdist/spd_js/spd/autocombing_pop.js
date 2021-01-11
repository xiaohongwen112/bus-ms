var AutocombingPop = function() {
    this.$confirmPop = $('#before_autocombing_popup');
    this.$pop = $('#autocombing_popup');
    this.$resetpop = $('#reset_popup');
    this.$stepOne = this.$pop.find('.step-1');
    this.$stepTwo = this.$pop.find('.step-2');
    this.$download = this.$pop.find('.step-1 .modal-footer .download');
    this.$upload = this.$pop.find('.step-1 .modal-footer .upload');
    this.$cancel = this.$pop.find('.step-1 .modal-footer .cancel');
    this.$downloadForm = this.$pop.find('.download-form');
    this.$uploadForm = this.$pop.find('.upload-form');
    this.$errorPopup = $('#autocombing_error_popup');
    this.map = CBMSFLOW.environment('topovmap');

    this._init();
}

AutocombingPop.prototype = {

    ROWSTEMPLATE:
    "<% _.each(iplist, function(item, i) { %> "
    +"<tr>"
    +"    <td class='seq'><%=i+1%></td>"
    +"    <td class='component'><%=item.component%></td>"
    +"    <td class='ipaddr'><%=item.ipaddr%></td>"
    +"    <td class='equipment'><%=item.equipment%></td>"
    +"    <td class='port'><%=item.port%></td>"
    +"    <td class='componentB'><%=item.componentB%></td>"
    +"    <td class='ipaddrB'><%=item.ipaddrB%></td>"
    +"    <td class='equipmentB'><%=item.equipmentB%></td>"
    +"    <td class='portB'><%=item.portB%></td>"
    +"    <td class='atob'><%=item.A2B%></td>"
    +"    <td class='btoa'><%=item.B2A%></td>"
    +"    <td class='allb'><%=item.allbyte%></td>"
    +"    <td class='usability'><%=item.usability%></td>"
    +"    <td class='pattern'><%=item.pattern%></td>"
    +"    <td class='zonebit'><%=item.zonebit%></td>"
    +"    <td class='proto'><%=item.protocol%></td>"
    +"</tr>"
    +"<% }); %>",

    _init: function() {
        this._setDefault();
        this._bindEvents();
    },

    _setDefault: function() {
        this._toStepOne();
    },

    _toStepOne: function() {
        this.$stepOne.show();
        this.$stepTwo.hide();
        this.data = [];

        this.$pop.removeClass('step-two');

        if (CBMSFLOW.environment('LANGUAGE_CODE') == 'en-us') {
            this.$pop.find('.viewpic').removeClass('viewpic').addClass('viewpic_en');
        }
    },

    _toStepTwo: function(data) {
        this.$stepOne.hide();
        this.$stepTwo.show();

        this.$pop.addClass('step-two');

        this.data = data;
        this._initStepTwo(data);
    },

    _initStepTwo: function(data) {
        this.$tableHead = this.$stepTwo.find('.head');
        this.$sortTable = this.$stepTwo.find('.body table');
        this.$tBody = this.$stepTwo.find('.body table tbody');

        this._setDefaultSort();
        this._loadIpList(data);
        this._bindStepTwoEvents();
    },

    _loadIpList: function(data) {
        this.$tBody.empty();
        this.$tBody.html(_.template(this.ROWSTEMPLATE, {'iplist': data}));

        if (!this.$stepTwo.find('.body').hasClass('mCustomScrollbar')) {
            this.$stepTwo.find('.body').mCustomScrollbar();
        } else {
            this.$stepTwo.find('.body').mCustomScrollbar('update');
        }
        this.$stepTwo.find('.modal-body').css('padding-right', 0);
    },

    _setDefaultSort: function() {
        var thead = this.$tableHead.find('thead');
        thead.find('th span.sort').removeClass('sort-down').removeClass('sort-up').addClass('sort-auto');
    },

    _bindStepTwoEvents: function() {
        this.$sortTable.tablesorter({
            headers:{
                1:{sorter: "text"},
                2:{sorter: "ipAddress"}
            }
        });

        var $sortColumn = this.$tableHead.find('th span.sort');
        $sortColumn.unbind('click').click($.proxy(this._sortColumn, this));

        var $cancel = this.$stepTwo.find('.modal-footer .cancel');
        $cancel.unbind('click').click($.proxy(this._canelStepTwo, this));

        var $startCombing = this.$stepTwo.find('.modal-footer .start');
        $startCombing.unbind('click').click($.proxy(this._startCombing, this));
    },

    _startCombing: function() {
        var filteredData = [];
        var ipList = [];
        this.data.forEach(function(item){
            if (ipList.indexOf(item.ipaddr) < 0) {
                ipList.push(item.ipaddr);
                filteredData.push({ component: item.component, ipaddr: item.ipaddr });
            } else {
                var currentItem = _.find(filteredData, function(i) {
                    return i.ipaddr === item.ipaddr;
                });
                currentItem.component = item.component;
            }
            if (item.ipaddrB !== '') {
                if (ipList.indexOf(item.ipaddrB) < 0) {
                    ipList.push(item.ipaddrB);
                    filteredData.push({ component: item.componentB, ipaddr: item.ipaddrB });
                } else {
                    var currentItemB = _.find(filteredData, function (i) {
                        return i.ipaddr === item.ipaddrB;
                    });
                    currentItemB.component = item.componentB;
                }
            }
        });

        this.map.combing(filteredData, this.data);
        CBMSFLOW.environment('combined', true);
        this.$stepTwo.parents(".popup-modal").modal('hide');
    },

    _canelStepTwo: function() {
        this._toStepOne();
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

        thead.find('th:not(:eq(' + sortIndex + ')) span.sort')
            .removeClass('sort-down')
            .removeClass('sort-up')
            .addClass('sort-auto');
        this.$sortTable.trigger("sorton", [[[sortIndex, sortOrder]]]);
    },

    _bindEvents: function() {
        this.$download.unbind('click').click($.proxy(this._downloadSample, this));
        this.$upload.unbind('click').click($.proxy(this._uploadIpList, this));
        this.$uploadForm.find('input[type=file]').unbind('change').change($.proxy(this._uploadChange, this));
        this.$cancel.unbind('click').click($.proxy(this._closePopup, this));

        var $bConfirmBtn = this.$confirmPop.find('.modal-footer .confirm');
        $bConfirmBtn.unbind('click').click($.proxy(this._beforePopConfirm, this));
    },

    _beforePopConfirm: function() {
        this.map.reset();
        CBMSFLOW.environment('combined', false);
        this.$confirmPop.modal('hide');
        this.show();
    },

    _confirmReset: function() {
        this.map.reset();
        CBMSFLOW.environment('combined', false);
        this.$resetpop.modal('hide');
    },

    _downloadSample: function(e) {
        this.$downloadForm.submit();
    },

    _uploadIpList: function(e) {
        var $uploadInput = this.$uploadForm.find('input[type=file]');
        $uploadInput.trigger('click');
    },

    _uploadChange: function(e) {
        var $uploadInput = this.$uploadForm.find('input[type=file]');
        if($uploadInput.val() == ""){
            return;
        }

        var self = this;
        this.$uploadForm.ajaxSubmit({
            dataType:'json',
            success: function(result) {
                $uploadInput.val('');
                if(result.code != 0){
                    self.showError(result.msg);
                } else {
                    self._toStepTwo(result.data.csv_data);
                    window.getCombingData = result.data.map_data;
                }
            },
            error: function(err) {
                $uploadInput.val('');
                self.showError("文件格式错误！");
            }
        });
    },

    _closePopup: function(e) {
        this.$download.unbind('click');
        this.$upload.unbind('click');
        this.$cancel.unbind('click');
        this.$pop.modal('hide');
    },

    _checkHasCompNode: function() {
        var hasComp = this.map.hasCompNodes();
        return hasComp;
    },

    _checkHasHideNode: function() {
        return this.map.hasHideNodes();
    },



    resetCompNodes: function() {
        if (this._checkHasCompNode() || this._checkHasHideNode()) {
            this.$resetpop.modal({'keyboard': false, 'backdrop': 'static', 'show': true});
            $('.modal-backdrop.in').css('opacity',0.5);

            var $bConfirmBtn = this.$resetpop.find('.modal-footer .confirm');
            $bConfirmBtn.unbind('click').click($.proxy(this._confirmReset, this));
        }
    },

    show: function() {
        if (this._checkHasCompNode()) {
            this.$confirmPop.modal({'keyboard': false, 'backdrop': 'static', 'show': true});
            $('.modal-backdrop.in').css('opacity',0.5);
        } else {
            this.$pop.modal({'keyboard': false, 'backdrop': 'static', 'show': true});
            $('.modal-backdrop.in').css('opacity',0.5);
        }
    },

    showError: function(msg){
        var self = this;
        this.$errorPopup.find('.line').html(msg);
        this.$errorPopup.modal({'keyboard': false, 'backdrop': 'static', 'show': true});
        var backZIndex = $('.modal-backdrop.in').css('z-index');
        var oldPopZIndex = self.$pop.css('z-index');
        this.$errorPopup.find('.btn-primary').unbind('click').click(function(){
            self.$errorPopup.modal('hide');
            self.$pop.css('z-index', oldPopZIndex);
        });
        self.$pop.css('z-index', backZIndex - 1);
        $('.modal-backdrop.in').css({'opacity' : 0.5});
    }
}

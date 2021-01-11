var SpdMap = CBMSFLOW.module('spdmap');


SpdMap.FeedbackModal = CBMSFLOW.klass({

    elem: $(
        '<div class="feedback-modal modal" role="dialog">'+
            '<div class="modal-header">'+
                '<h3></h3>'+
            '</div>'+
            '<div class="modal-body"></div>'+
            '<div class="modal-footer">'+
                '<button class="btn confirm blue-button ctl-button" data-dismiss="modal" aria-hidden="true"></button>'+
                '<button class="btn cancel grey-button ctl-button" data-dismiss="modal" aria-hidden="true"></button>'+
            '</div>'+
        '</div>'
    ),
    headerText: gettext('提示'),
    confirmText: gettext('确认'),
    cancelText: gettext('取消'),

    confirmCallback: null,
    cancelCallback: null,

    renderBody: null,

    __init__: function(options){
        options = options || {};
        $.extend(this, options);
        this._render();
    },
    _render: function(){
        this.elem.find('.modal-header h3').text(this.headerText);
        this.elem.find('.modal-footer .confirm').text(this.confirmText);
        this.elem.find('.modal-footer .cancel').text(this.cancelText);
        this.elem.modal({
            'backdrop': 'static',
            'keyboard': false,
            'show': false
        });
        this.elem.draggable({'cursor': 'move', 'handle': '.modal-header'});

        var self = this;
        this.elem.find('.modal-footer .confirm').click(function(){
            if(self.confirmCallback){
                var data = null;
                if(self.getData){
                    data = self.getData();
                }
                self.confirmCallback(data);
            }
            self.hide();
        });
        this.elem.find('.modal-footer .cancel').click(function(){
            if(self.cancelCallback){
                self.cancelCallback();
            }
            self.hide();
        });
        this.elem.on('show', function(){
            $(this).css({
                'position': 'fixed',
                'left': '50%',
                'top': '10%'
            });
        });
        var self = this;
        this.elem.on('hidden', function(){
            $(this).find('.modal-body').empty();
            this.getData = null;
        });
    },
    show: function(renderBody, getData){
        if(renderBody){
            var bodyHtml = renderBody();
            this.elem.find('.modal-body').html(bodyHtml);
        }
        this.getData = getData;
        this.elem.modal('show');
    },
    hide: function(){
        this.elem.modal('hide');
    }
});


SpdMap.MergeNodesModal = CBMSFLOW.klass({

    __init__: function(callback){
        this.feedbackModal = new SpdMap.FeedbackModal({
            'headerText': gettext('合并节点'),
            'confirmText': gettext('合并'),
            'confirmCallback': callback,
            'cancelCallback': callback
        });
    },
    show: function($super, existedIps, otherIps, targetNode, callback){
        var ipSortFunc = function(ip1, ip2){
            var seg1 = parseInt(ip1.substr(ip1.lastIndexOf('.')+1));
            var seg2 = parseInt(ip2.substr(ip2.lastIndexOf('.')+1));
            return seg1 - seg2;
        };
        this.existedIps = existedIps;
        this.otherIps = otherIps;
        this.existedIps.sort(ipSortFunc);
        this.otherIps.sort(ipSortFunc);
        this.targetNode = targetNode;
        this.feedbackModal.confirmCallback = callback;
        this.feedbackModal.cancelCallback = callback;

        this.feedbackModal.show($.proxy(this.renderBody, this), $.proxy(this.getData, this));
    },
    renderBody: function(){
        var bodyHtml = $(''+
        '<div>'+
            '<div class="existedIps">'+
                '<span>'+gettext('已合并节点：')+'</span><span class="items"></span>'+
            '</div>'+
            '<div class="otherIps">'+
                '<div style="margin-bottom:20px;">'+interpolate(gettext('是否将以下节点全部合并入%s'),['&quot;<span class="node-name"></span>&quot;?</div>'])+
                '<div class="items cbmsflowScrollbar" style="max-height:100px;overflow-y:auto;"></div>'+
                '<div style="clear:both;"></div>'+
            '</div>'+
        '</div>');
        bodyHtml.find('.existedIps .items').text(this.existedIps.join('/'));
        bodyHtml.find('.otherIps .node-name').text(this.targetNode.name);
        var itemsHtml = bodyHtml.find('.otherIps .items');
        $.each(this.otherIps, function(i, ip){
            itemsHtml.append('<div style="float:left;width:150px;"><input type="checkbox" name="selectedIps" value="' + ip + '">' + ip + '</div>');
        });
        itemsHtml.mCustomScrollbar({});

        return bodyHtml;
    },
    getData: function(){
        var selectedIps = [];
        this.feedbackModal.elem.find('input[name="selectedIps"]').each(function(){
            if($(this).is(':checked')){
                selectedIps.push($(this).val());
            }
        });
        return selectedIps;
    }
});


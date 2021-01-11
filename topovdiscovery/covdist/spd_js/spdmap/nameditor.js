var SpdMap = CBMSFLOW.module('spdmap');

SpdMap.NameEditor = CBMSFLOW.klass(SpdMap.RevertObject, {

    __init__: function(map) {
        this.map = map;
        this.r = map.r;
        this.box = $('#text-edit');
        this.txtinput = this.box.find('input.nodename');
        this.txtinput.messagepop({'trigger':'manual', 'container': '#map-container','zindex':null});
        this.editBtn = this.box.find('.name-edit-icon');
        this.convertBtn = this.box.find('.name-convert-icon');
        this.saveBtn = this.box.find('.name-save-icon');
        this.msg = this.box.find('.msg');
        this.hidetext = this.box.find('.hidetxt');
        this._setDefaultVal();
        this._bindEvents();
    },

    moveBoxWithNode: function(node, x, y) {
        if (node.selected) {
            if (x != undefined && y != undefined) {
                var pos = node.calcTextPos({'x': x, 'y': y}, node.getOuterRadius());
                pos = this.r.translatePosToViewBox(pos);
                this.box.animate({'left': pos.x - this.box.width()/2 + 5, 'top': pos.y-this.box.height()});
            }
        }
    },

    moveBox: function(x, y) {
        if (this.node && this.node.selected) {
            this._moveBox();
        }
    },

    hideBox: function() {
        this.box.hide();
        this.txtinput.messagepop('hide');
    },

    isEditState: function() {
        return this.box.attr('state') == 'edit';
    },

    focusInput: function() {
        this.txtinput.focus();
    },

    showAt: function(node) {
        this.node = node;
        this.nodetext = this.node.getNodeText();
        if(node.raw){
            var newDispState = this.map.rawNodeDispState;
            if(newDispState != 'ip'){
                this.nodetext = this.map.ipDeviceMap[this.nodetext]||this.nodetext;
            }
        }
        this.node.hideText();
        this._setReadonlyBtn();
        this._setInputDefault();
        this.box.show();
        var width = this._txtWidth();
        this.txtinput.val(this.nodetext).width(width);
        this.txtinput.parent().width(width);
        this._moveBox();
        this.nodetext = this.node.getNodeText();
        /*
        if (document.selection) {
            document.selection.empty();
        } else if (window.getSelection) {
            window.getSelection().removeAllRanges();
        }
        */
    },

    save: function() {
        var resule = this._saveHandler();
        return resule;
    },

    _txtWidth: function() {
        this.hidetext.text(this.node.getNodeText());
        return this.hidetext[0].offsetWidth+12;
    },

    _setEditStateBtn: function() {
        this.editBtn.hide();
        this.convertBtn.hide();
        this.saveBtn.css('display', 'inline-block');
    },

    _setReadonlyBtn: function() {
        //this.editBtn.css('display', 'inline-block');
        if (this.node && this.node.raw) {
            this.editBtn.hide();
            this.convertBtn.show();
        } else {
            this.editBtn.show();
            this.convertBtn.hide();
        }

        this.saveBtn.hide();
    },

    toEditState: function() {
        this._setEditStateBtn();
        this._setInputEdit();
    },

    toReadonlyState: function() {
        this._setReadonlyBtn();
        this._setInputDefault();
    },

    _setInputDefault: function() {
        this.txtinput.attr('disabled', true);//.css('width', 89);
        //this.txtinput.parent().width(89);
        this.txtinput.removeClass('editable').addClass('readonly');
        this.txtinput.val(this.nodetext);
        this.msg.text('').hide();
    },

    _setInputEdit: function() {
        this.box.attr('state', 'edit');
        this.txtinput.attr('disabled', false);
        this.txtinput.focus().select();
        this.txtinput.removeClass('readonly').addClass('editable');
    },

    _moveBox: function(e) {
        var pos = this.node.getTextPos();
        pos = this.r.translatePosToViewBox(pos);
        if(CBMSFLOW.environment('compareMode')){
            var e = e || window.event;
            var dataShowLeft = e.pageX + 10,
                dataShowTop = e.pageY - 100;
            this.box.css({'top': dataShowTop, 'left': dataShowLeft});
        } 
        else this.box.css({'top': pos.y - this.box.height(), 'left': pos.x - this.box.width()/2 + 5});
    },

    _setDefaultVal: function() {
        this._setReadonlyBtn();
        this._setInputDefault();
        this.hidetext.text('');
    },

    _editBtnClick: function() {
        this._setInputEdit();
        this._setEditStateBtn();
    },

    _saveBtnClick: function() {
        this._saveHandler();
    },

    _inputKeyPress: function(e) {
        if (e.which == 13) {
            this.txtinput.blur();
            this._saveHandler();
        }
    },

    _showMsg: function(msg) {
        /*
        this.msg.show();
        this.msg.text(msg);
        this.msg.css({'top': -18, 'left': (this.txtinput.width()+20)/2 - this.msg.width()/2});
        */
        this.txtinput.messagepop('show', msg);
    },

    _inputKeyUp: function() {
        $("#undefined_message-pop").css({display:"none"});
        var txtPos = this.node.getTextPos();
        this.hidetext.text(this.txtinput.val());
        var len = this.hidetext[0].offsetWidth + 12;
        if (len > 89) {
            this.txtinput.width(len);
            this.txtinput.parent().width(len);
        } else {
            this.txtinput.width(89);
            this.txtinput.parent().width(89);
        }

        var count = this.txtinput.val().length;

        if (count > 30) {
            this._showMsg(gettext('最多可输入30个字符'));
        }else if(count == 0) {
            this._showMsg(gettext('名称不可为空'));
        }
        else {
            this.msg.text('');
            this.msg.hide();
        }
        this._moveBox();
    },

    _isNameDuplicate: function(name, exceptNode) {

        var msg = '';
        $.each(this.map.nodes, function(i, n) {
            var reg = new RegExp("^[A-Za-z0-9\u4e00-\u9fa5-]+$");
            if (n != exceptNode && n.name == name) {
                msg = gettext('节点名称重复');
                if (!n.visible) {
                    msg += '('+ gettext('隐藏') +')';
                }
                return false;
            }
            else if (!reg.test(name)) {
                msg = gettext("不能出现特殊字符");
                if (!n.visible) {
                    msg += '('+ gettext('隐藏') +')';
                }
                return false;
            }
        });
        if (msg) {
            return msg;
        } else {
            return msg;
        }
    },

    _saveHandler: function() {
        var val = this.txtinput.val();
        if (val.trim().length > 30) {
            return false;
        }

        if (val.trim().length == 0) {
            return false;
        }

        var msgstr = this._isNameDuplicate(val, this.node);
        if (msgstr) {
            //this.msg.show();
            //this.msg.text(msgstr);
            this._showMsg(msgstr);
            this.txtinput.focus().select();
            this.box.attr('state', 'edit');
            return false;
        }

        if (this.nodetext != val.trim()) {
            var originlen = this.hidetext[0].offsetWidth;
            var hidetext = this.hidetext.text();
            this.hidetext.text('');

            var txt = '';
            for (var i=0,len=hidetext.length; i<len; i++) {
                txt += hidetext[i];
                this.hidetext.text(txt);

                var width = this.hidetext[0].offsetWidth;
                if (width > (96-10) && width < (96+10)) {
                    break;
                }
            }

            if (originlen > 96) {
                txt = '   ' + txt + '...';
            }
            this.node.rename(val.trim());
            this.node.retext(txt);
            this.node.clearRaw();
            this.trigger("save.done");
        }
        this._setDefaultVal();
        this.txtinput.val(val);
        this.box.attr('state', 'readonly').show();
        this.nodetext = val;
        return true;
    },

    _convertBtnClick: function(e) {
        this._setInputEdit();
        this._setEditStateBtn();
        var newName = this.map.newRipeNodeName();
        this.txtinput.val(newName);
        this.txtinput.select();
        this.hidetext.text(newName);
        this.node.rename(newName);
        this.node.retext(newName);
        this.nodetext = newName;
        this.node.clearRaw();
        $.each(['node-definition', 'interface-definition'], function(i, item) {
            $('.flow-table-nav li[target='+item+']').show();

        });
        this.trigger("convert", this.node);
    },

    _bindEvents: function() {
        this.editBtn.unbind('click').click($.proxy(this._editBtnClick, this));
        this.convertBtn.unbind('click').click($.proxy(this._convertBtnClick, this));
        this.saveBtn.unbind('click').click($.proxy(this._saveBtnClick, this));
        this.txtinput.unbind('keypress').keypress($.proxy(this._inputKeyPress, this));
        this.txtinput.unbind('change').change($.proxy(this._inputKeyUp, this));
    },

    hideEditBox:function(){
        this.hideBox();
        if(this.node){
            this.node.showText();
        }

        this.txtinput.messagepop('hide');
    }

});

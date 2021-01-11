(function($) {

    var MessagePopup = function(elem, settings) {
        this.$target = elem;
        this.settings = settings;
        this.$elem = $("<div class='message-pop'><span class='msg-icon'></span><div class='msg-content'></div><div class='cal-len'><span></span></div></div>").hide();
        this._init();
        this._bindEvents();
    };

    MessagePopup.prototype = {

        _init: function() {
            this._removePops();
            this._clearPop();
            this.$elem.attr('id', this.$target.attr('id') + '_message-pop');
            //this.$elem.appendTo(this.$target.parent());
            this.container = $(this.getSetting('container', 'body'));
            this.$elem.appendTo(this.container);
        },

        _getZindex: function(){
            var z = this.getSetting('zindex', 'auto');
            if(z == 'auto'){
                z = 0;
                var z_index = parseInt(this.container.css('z-index'), 10);
                if(!isNaN(z_index)){
                    z = z_index;
                }
                z += 1;
            }
            return z;
        },

        _removePops: function() {
            $('#' +this.$target.attr('id') + '_message-pop').remove();
        },


        _clearPop: function(target) {
            if (target) {
                $('#' +this.$target.attr('id') + '_message-pop').hide();
            } else {
                $('.message-pop:not(.message-pop-manual)').not(this.$elem).hide();
                $('#' +this.$target.attr('id') + '_message-pop .msg-content').hide();
            }
        },

        _setPosition: function() {
            this.updatePos();
            this.$elem.show();
        },

        _bodyClickHandler: function(e) {
            this._clearPop($(e.target));
        },

        _calculateWidth: function() {
            var width = this.$elem.find('.cal-len span').width();
            width += this.$elem.find('.msg-icon').width();
            width += 8;
            return width;
        },

        updatePos: function(){
            var pos = this._getShowPos();
            this.$elem.css({'left': pos.left, 'top': pos.top});
            if(pos['show']){
                this.$elem.show();
            }
            else{
                this.$elem.hide();
            }
        },

        show: function(msg) {
            this._setPosition();
            this._clearPop();
            if (msg) {
                this.$elem.find('.msg-content').text(msg).show();
                this.$elem.find('.cal-len span').text(msg);
            } else {
                this.$elem.find('.msg-content').show();
            }
            var width = CBMSFLOW.SPD.fontutil.getTextWidth(this.$elem.find('.cal-len span')) + 28;
            this.$elem.css('width', width).show();
            var z_i = this._getZindex();
            if(z_i !== null){
                this.$elem.css('z-index', z_i);
            }
        },

        hide: function() {
            this.$elem.hide();
        },

        getSetting:function(name, default_v){
            var settings = this.settings || {};
            return settings[name] !== undefined ? settings[name] : default_v;
        },

        _bindEvents: function() {
            var self = this;

            switch(this.getSetting('trigger', 'hover')){
                case 'manual':
                    this.$elem.addClass('message-pop-manual');
                    $(".cal-len", this.$elem).css('width','auto');
                    break;
                default:
                    $('body').click($.proxy(this._bodyClickHandler, this));

                    this.$target.hover(
                        function() {
                            if ($(this).hasClass('error')) {
                                self.show();
                            }
                        },
                        function() {
                            self.hide();
                        }
                    );

            }

            if (this.$target.is('input')) {
                this.$target.unbind('change').change(function() {
                    if ($(this).val().trim().length > 0) {
                        $(this).removeClass('error');
                        $(this).messagepop('hide');
                    }
                });

                this.$target.keyup(function(e) {
                    // function key, like ctrl,shift,alt,caps_lock,ecs
                    if (!_.contains([13,16,17,18,19,20,27],e.keyCode)) {
                        $(this).trigger('change');
                    }
                });
            }
        },
        destroy: function(){
            this._removePops();
            switch(this.getSetting('trigger', 'hover')){
                case 'manual':
                    break;
                default:
                    ;;//todo:unbind hover, unbind body.click
            }
        },
        _getTop: function(e) {
            var offset=e.offsetTop;
            if(e.offsetParent!=null) {
                offset+=this._getTop(e.offsetParent);
            }
            return offset;
        },

        _getLeft: function(e){
            var offset=e.offsetLeft;
            if(e.offsetParent!=null) {
                offset+=this._getLeft(e.offsetParent);
            }
            return offset;
        },

        _getShowPos: function() {
            var pos = this.$target.position();
            var left = pos.left;
            var top = pos.top;

            top = this._getTop(this.$target[0]) - this.container.offset().top;
            left = this._getLeft(this.$target[0]) - this.container.offset().left;
            var show = true;
            if(top < 0 || top >= this.container.height()){
                show = false;
            }
	    var scrollLeft = $(window).scrollLeft();
            var scrollTop = $(window).scrollTop();
            left = left + 1 + scrollLeft;
            top = top - 26 + scrollTop;
            return {'show' : show, 'left': left, 'top': top};
        }
    };

    $.fn.messagepop = function(settings, args) {
        settings = settings||{};
        if (typeof(settings) === 'object') {
            if ($._msg == undefined) {
                $._msg = {};
            }
            $._msg[this.attr('id')] = new MessagePopup(this, settings);
            return $._msg[this.attr('id')];
        } else if (typeof(settings) === 'string') {
            if ($._msg[this.attr('id')]) {
                if (typeof($._msg[this.attr('id')][settings]) === 'function') {
                    $._msg[this.attr('id')][settings](args);
                }
            }
        }
        return null;
    };


})(jQuery);

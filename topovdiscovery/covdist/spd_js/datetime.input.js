
(function($) {
	$.timespinner = function(elem, opts) {
        this.initialize(elem, opts);
    };
	$.timespinner.prototype = {
        initialize: function(el, options){

            if ( !el ) {
            } else {
                this.wrapperEl = $(el);

                //defaults
                this._options = {
                    hours: '00',
                    minutes: '00',
                    seconds: '00',
                };

                // Set the options using the defaults
                if (options) $.extend(this._options, options);

                // create dom
                this._createDom();

                // initialize jquery ui spinner on each input
                this._initializeSpinners()
            }
        },
        _createDom: function() {
            var tsHtml = $("<div class='TimeSpinner'></div>");

            var hours = $("<input class='hours tsInput' />").attr('value',this._options['hours']);
            var minutes = $("<input class='minutes tsInput' />").attr('value',this._options['minutes']);
            var seconds = $("<input class='seconds tsInput' />").attr('value',this._options['seconds']);

            tsHtml.append(hours)
                .append("<div class='colon'>:</div>")
                .append(minutes)
                .append("<div class='colon'>:</div>")
                .append(seconds)

            var self = this;
            tsHtml.find('.tsInput').change(function(){
                self.wrapperEl.trigger('tsChanged');
            });
            tsHtml.find('.tsInput').keyup(function(){
                self.wrapperEl.trigger('tsChanged');
            });

            if (this._options['spinner']) {
                this.wrapperEl.append(tsHtml);
                this._options['targetElem'].after(this.wrapperEl);
                this._options['targetElem'].css('display', 'none');

                this.wrapperEl.bind('tsChanged', function() {
                    var hours = $(this).find('input.hours').val();
                    var minutes = $(this).find('input.minutes').val();
                    var seconds = $(this).find('input.seconds').val();

                    var regexp = /\d{1,2}/;
                    var v = 0;
                    if (regexp.test(hours)) {
                        v = parseInt(hours) * 3600;
                    }

                    if (regexp.test(minutes)) {
                        v += parseInt(minutes) * 60;
                    }

                    if (regexp.test(seconds)) {
                        v += parseInt(seconds);
                    }
                    $(this).prev().val(v);
                });

                tsHtml.find('.tsInput').trigger('change');
            } else {
                this.wrapperEl.bind('tsChanged', function() {
                    try {
                        if (self._options['event'] && self._options['event']['change']) {
                            self._options['event']['change']({'target': self._options['targetElem'], 'value': v});
                        }
                    } catch(e){}
                });
                this.wrapperEl.append(tsHtml);
            }
        },
        _initializeSpinners: function() {

            var context = this;
            var wrapper = this.wrapperEl;
            var isSpinner = this._options['spinner'];


            // set up event handlers
            $('input', this.wrapperEl).each(function(){
                var padding = $(this).val().length;
                $(this)
                    .bind('keyup', function(e){
                        context._keyup(e, this, padding);
                    })
                    .bind('keydown', function(e){
                        return context._keydown(e, this, padding);
                    })
                    .bind('click', function(){
                        $(this).focus();
                        $(this).select();
                    }).bind('focus', function(){
                        var reference = this;
                        setTimeout(function(){$(reference).select();}, 0); // using a blank setTimeout fixes incorrect behavior in Safari
                    }).bind('blur', function() {
                        context._formatEntry(this, padding);
                    }).bind('focus', function() {
                        if (isSpinner) {
                            wrapper.addClass('focus');
                        } else {
                            $(this).parents('.ui-datetime-input').addClass('focus');
                        }
                    }).bind('blur', function() {
                        if (isSpinner) {
                            wrapper.removeClass('focus');
                        } else {
                            $(this).parents('.ui-datetime-input').removeClass('focus');
                        }
                    });
            });
        },
        _getCaretPosition: function(ctrl){
            var CaretPos = 0;
            // IE Support
            if (document.selection) {
                ctrl.focus ();
                var Sel = document.selection.createRange();
                var SelLength = document.selection.createRange().text.length;
                Sel.moveStart ('character', -ctrl.value.length);
                CaretPos = Sel.text.length - SelLength;
            }
            // Firefox support
            else if (ctrl.selectionStart || ctrl.selectionStart == '0')
                CaretPos = ctrl.selectionStart;

            return (CaretPos);
        },
        _setCaretPosition: function(elem, caretPos){
            elem = $(elem)[0];

            if(elem != null) {
                if(elem.createTextRange) {
                    var range = elem.createTextRange();
                    range.move('character', caretPos);
                    range.select();
                } else {
                    if(elem.selectionStart) {
                        elem.focus();
                        elem.setSelectionRange(caretPos, caretPos);
                    } else
                        elem.focus();
                }
            }
        },
        _keydown: function(e, el, padding) {
            var input = $(el).parents('.ui-datetime-input').prev();
            if (input && !input.hasClass('hasOriginVal')) {
                input.addClass('hasOriginVal');
                input.attr('originval', input.val());
            }

            if ( (e.keyCode >= 96 && e.keyCode <= 105) ||  (e.keyCode >= 48 && e.keyCode <= 57)  ) {
                if ( $(el).val().length >= padding && !this._isTextHighlighted($(el)[0])  ) {
                    return false;
                }
            }
            return true;
        },
        _keyup: function(e, el, padding) {
            if ( e.keyCode == $.ui.keyCode.RIGHT || e.keyCode == $.ui.keyCode.LEFT ) {
                var len = $(el).val().toString().length;
                var carPos = this._getCaretPosition(el);

                if ( (e.keyCode == $.ui.keyCode.RIGHT) && (carPos == len) && !$(el).is('.milliseconds') ) {
                    $(el).blur();
                    var nextInput = $('input', this.wrapperEl).eq( $('input', this.wrapperEl).index(el) + 1);
                    nextInput.focus();
                } else if ( (e.keyCode == $.ui.keyCode.LEFT) && (carPos == 0) && !$(el).is('.hours') ) {
                    $(el).blur();
                    var nextInput = $('input', this.wrapperEl).eq( $('input', this.wrapperEl).index(el) - 1);
                    nextInput.focus();
                }
            } else if ( (e.keyCode >= 96 && e.keyCode <= 105) ||  (e.keyCode >= 48 && e.keyCode <= 57)  ) {
                // it's numeric, so make sure this won't put us over length. if so, only leave the first x digits (they most likely repeated digits).
                if ( $(el).val().length > padding ) {
                    $(el).val($(el).val().substr(0,2));
                }
            } else {
                // as a last check, strip out anything that isn't a number if it got by
                $(el).val($(el).val().replace(/[^0-9]/g,''));
            }
        },
        _formatEntry: function(el, padding) {
            var result = $(el).val();
            while (padding && (result.length < padding)) {
                result = '0' + result;
            }
            $(el).val(result);
        },
        disable: function() {
            this.wrapperEl.addClass('tsDisabled').find('input').attr('disabled','disabled');
        },
        enable: function() {
            this.wrapperEl.removeClass('tsDisabled').find('input').removeAttr('disabled');
        },
        _isTextHighlighted: function(ctrl) {
            // IE Support
            if (document.selection) {
                ctrl.focus();
                var Sel = document.selection.createRange();
                var SelLength = document.selection.createRange().text.length;

                if ( SelLength > 0 ) {
                    return true;
                }
            }
            // Firefox support
            else if (ctrl.selectionStart != ctrl.selectionEnd) {
                return true;
            }

            return false;
        },
        getValStr: function(){
            var hours = this.wrapperEl.find('input.hours').val();
            var minutes = this.wrapperEl.find('input.minutes').val();
            var seconds = this.wrapperEl.find('input.seconds').val();
            return hours + ':' + minutes + ':' + seconds;
        },
        updateVal: function(tsVal){
            this.wrapperEl.find('input.hours').val(tsVal['hours']);
            this.wrapperEl.find('input.minutes').val(tsVal['minutes']);
            this.wrapperEl.find('input.seconds').val(tsVal['seconds']);
        }
    };
	$.DatetimePicker = function(elem, opts) {
        this.initialize(elem, opts);
    };
    $.DatetimePicker.prototype = {
        initialize: function(el, options){
            if ( !el ) {
            } else {
                this.origInput = $(el);
                this.wrapperEl = $('<div class="ui-datetime-input" />');
                this.wrapperEl.insertAfter(this.origInput);

                this.origInput.hide();

                //defaults
                this._tsOptions = {
                };
                var today = new Date();
                this._dtOptions = {
                    date: moment(today).format('YYYY-MM-DD')
                };

                this._options = {};

                // Set the options using the defaults
                if(options){
                    var ts_items = ['hours', 'minutes', 'seconds'];
                    for(var index in ts_items){
                        var prop = ts_items[index];
                        if(options[prop]){
                            this._tsOptions[prop] = options[prop]
                        }
                    }
                    if(options['date']){
                        this._dtOptions['date'] = options['date'];
                    }

                    $.extend(this._options, options);
                }

                // create dom
                this._createDom();
            }
        },
        _createDom: function(){
            var dtHtml = $("<input type='text' class='customDate' />");
            dtHtml.val(this._dtOptions['date']);
            dtHtml.datepicker({
                dateFormat: 'yy-mm-dd',
            });
            var self = this;
            dtHtml.keydown(function() {
                var input = self.wrapperEl.prev();
                if (input && !input.hasClass('hasOriginVal')) {
                    input.addClass('hasOriginVal');
                    input.attr('originval', input.val());
                }
            });

            var wrapper = this.wrapperEl;
            dtHtml.change(function(){
                self._updateInput();
            }).focus(function() {
                wrapper.addClass('focus');
            }).blur(function() {
                wrapper.removeClass('focus');
            }).keyup(function() {
                self._updateInput();
            });

            var timespinnerHtml = $("<div class='ui-time-input' />");
            timespinnerHtml.bind('tsChanged', function(){
                self._updateInput();
            });

            this.timeSpinner = new $.timespinner(timespinnerHtml, this._tsOptions)

            this.wrapperEl.append(dtHtml).append(timespinnerHtml);
            timespinnerHtml.trigger('tsChanged');
        },
        _updateInput: function(){
            this.origInput.val(this.getValStr());
        },
        getValStr: function(){
            var date_str = this.wrapperEl.find('.customDate').val();
            var ts_str = this.timeSpinner.getValStr();
            return date_str + ' ' + ts_str;
        },
        getValTs: function(){
            var val_str = this.getValStr();
            return moment(val_str).unix();
        },
        updateVal: function(val){
            var m = moment.unix(val);
            var dateStr = m.format('YYYY-MM-DD');
            this.wrapperEl.find('.customDate').val(dateStr);

            var fixTime = function(v){
                if(v < 10){
                    return '0' + v;
                }else{
                    return '' + v;
                }
            };

            var tsVal = {
                'hours': fixTime(m.hours()),
                'minutes': fixTime(m.minutes()),
                'seconds': fixTime(m.seconds()),
            };
            this.timeSpinner.updateVal(tsVal);
            this._updateInput();
        }
    };

	$.fn.datetimeInput = function(options){
        options = options || {};
        var dt_str = $(this).val();
        if(dt_str){
            try{
                var m = moment(dt_str);
                options['date'] = m.format('YYYY-MM-DD');
                options['hours'] = m.hours() > 9 ? m.hours() : '0'+m.hours();
                options['minutes'] = m.minutes() > 9 ? m.minutes() : '0'+m.minutes();
                options['seconds'] = m.seconds() > 9 ? m.seconds() : '0'+m.seconds();
            }catch(err){
            }
        }

        var datetimePicker = null;
        if (options['spinner']) {
            var timespinnerHtml = $("<div class='ui-time-input'/>");
            options['targetElem'] = this;
            options['hours'] = options['hours'] || '00';
            options['minutes'] = options['minutes'] || '05';
            options['seconds'] = options['seconds'] || '00';
            datetimePicker = new $.timespinner(timespinnerHtml, options);
        } else {
            options['targetElem'] = this;
            datetimePicker = new $.DatetimePicker(this, options);
            $(this).data('datetimePicker', datetimePicker);
        }
        return datetimePicker;
    };

    var revertDateTime = function(dt) {
        if (dt.hasClass('hasOriginVal')) {
            var dtval = dt.attr('originval') || undefined;
            if (dtval) {
                m = moment(dtval);
                var date = m.format('YYYY-MM-DD');
                var hours = m.hours();
                var minutes = m.minutes();
                var seconds = m.seconds();

                var display = dt.next();
                display.find('input.customDate').val(date);
                display.find('input.hours.tsInput').val(hours);
                display.find('input.minutes.tsInput').val(minutes);
                display.find('input.seconds.tsInput').val(seconds);

                dt.val(dt.attr('originval'));
            }
        }
    }

    $.isDateTimeFormatValid = function(dtTime) {
        var val = dtTime.val();
        var dtRexp = new RegExp('^\\d{4}-\\d{1,2}-\\d{1,2}\\s\\d{1,2}:\\d{1,2}:\\d{1,2}$');
        var errormsg = {'error': true, 'msg': gettext('时间格式错误')};

        if (val == '') {
            return errormsg;
        }

        if (!dtRexp.test(val)) {
            revertDateTime(dtTime);
            return errormsg;
        }

        try {
            m = moment(val);
            if (!m.isValid()) {
                revertDateTime(dtTime);
                return errormsg;
            }
        } catch (err) {
            revertDateTime(dtTime);
            return errormsg;
        }

        dtTime.removeClass('hasOriginVal');

        return {'error': false};
    };

    $.isDateTimeRangeValid = function(dtStart, dtEnd) {
        var start = dtStart.val();
        var end = dtEnd.val();

        var msgs = [];
        var resultS = $.isDateTimeFormatValid(dtStart);
        var resultE = $.isDateTimeFormatValid(dtEnd);
        if (resultS['error']) {
            dtStart.focus();
            dtStart.select();
            return resultS;
        }
        dtStart.addClass('hasOriginVal');

        if (resultE['error']) {
            dtEnd.focus();
            dtEnd.select();
            return resultE;
        }
        dtEnd.addClass('hasOriginVal');

        var startUTC = moment(start).valueOf();
        var endUTC = moment(end).valueOf();
        var nowUTC = moment();

        if (startUTC > endUTC) {
            revertDateTime(dtStart);
            revertDateTime(dtEnd);
            return {'error': true, 'msg': gettext('起始时间必须在结束时间之前')};
        }

        if (startUTC > nowUTC && endUTC > nowUTC) {
            revertDateTime(dtStart);
            revertDateTime(dtEnd);
            return {'error': true, 'msg': gettext('未来时间段无效')};
        }
        dtStart.removeClass('hasOriginVal');
        dtEnd.removeClass('hasOriginVal');

        return {'error': false};
    };



})(jQuery);

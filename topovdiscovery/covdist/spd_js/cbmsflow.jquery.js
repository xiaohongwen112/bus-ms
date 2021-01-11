$.fn.extend({
    textSelect:function(start, end){
        $(this).each(function(){
            if(!$(this).is("input,textarea")){
                return;
            }
            _this = $(this)[0];
            start = start == undefined?0:start;
            end = end == undefined?_this.value.length:end;
            if(typeof _this.createTextRange!=="undefined"){
                var rtextRange =_this.createTextRange();
                rtextRange.moveStart('character',start);
                rtextRange.moveEnd('character',end);
                rtextRange.collapse(true);
                rtextRange.select();
            }
            else if(typeof _this.selectionStart!=="undefined")
            {
                _this.selectionStart=start;
                _this.selectionEnd=end;
                _this.focus();
            }
        });
        return $(this);
    },

    tipIt: function(content) {
        $(this).qtip({
            content: content,
            position: {
                my: 'bottom center',
                at: 'top center'
            },
            style: {
                tip: {
                    width: 10,
                    height: 10
                },
            },
            show: {
                solo: true,
                delay: 300
            }
        });
    }
});

$(function() {
    if (CBMSFLOW.environment('LANGUAGE_CODE') == 'zh-cn') {
        $.datepicker.regional['zh-CN'] = {
            closeText: '关闭',
            prevText: '上月',
            nextText: '下月',
            currentText: '今天',
            monthNames: ['01月','01月','03月','04月','05月','06月','07月','08月','09月','10月','11月','12月'],
            monthNamesShort: ['一','二','三','四','五','六','七','八','九','十','十一','十二'],
            dayNames: ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
            dayNamesShort: ['周日','周一','周二','周三','周四','周五','周六'],
            dayNamesMin: ['日','一','二','三','四','五','六'],
            weekHeader: '周',
            dateFormat: 'yy-mm-dd',
            firstDay: 1,
            isRTL: false,
            showMonthAfterYear: true,
            yearSuffix: '年'};
        $.datepicker.setDefaults($.datepicker.regional['zh-CN']);
    }
});

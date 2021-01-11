/* eslint-disable no-redeclare */
/* eslint-disable block-scoped-var */
/* eslint-disable vars-on-top */
/* eslint-disable import/no-mutable-exports */
/* eslint-disable no-var */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-unused-vars */
/* eslint-disable block-spacing */
/* eslint-disable eol-last */
/* eslint-disable no-loop-func */
/* eslint-disable func-names */
/* eslint-disable one-var-declaration-per-line */
/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
/* eslint-disable no-nested-ternary */
/* eslint-disable key-spacing */
/* eslint-disable comma-dangle */
/* eslint-disable no-multi-spaces */
/* eslint-disable no-param-reassign */
/* eslint-disable eqeqeq */
/* eslint-disable curly */
/* eslint-disable one-var */
/* eslint-disable space-in-parens */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-else-return */
/* eslint-disable keyword-spacing */
/* eslint-disable space-infix-ops */
/* eslint-disable space-before-blocks */
/* eslint-disable prefer-template */
/* eslint-disable no-plusplus */
/* eslint-disable semi */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable radix */
/* eslint-disable prefer-var */
/* eslint-disable padded-blocks */
/* eslint-disable quote-props */
/* eslint-disable object-curly-spacing */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-use-before-define */
/* eslint-disable space-before-function-paren */
/* eslint-disable quotes */
/* eslint-disable spaced-comment */
/* eslint-disable indent */
/* eslint-disable camelcase */
/* eslint-disable import/newline-after-import */
require('./d3.v3.min.js');
var DateSelect = function () {
    /**公告变量，方便给日期选择器中的天再次绑定点击事件**/
    var date_picker_id = "";
    var input_flag = "";
    var limit = false;   // 是否限制范围，默认限制（false
    var limitStart = null;
    var limitEnd = null;
    var sysTime = new Date().getTime() / 1000;
    
    this.setLimit = function(start, end) {
        limitStart = start;
        limitEnd = end;
    }
    
    this.setSysTime = function(time) {
        sysTime = time;
    }

    /**
     * 时间插件生成主函数
     */
    this.timeSelect = function(noLimit) {
        var container = d3.select("body")
            .append("div")
            .attr("class", "data-picker-con")
            .on("click", function() {stopEvent(d3.event);});
        var date_time = container.append('div').attr('id', 'date_time')
            .attr('class', 'needHide date-picker-div');
    
        var myDate = new Date();
        var nowYear = myDate.getFullYear();
        var nowMonth = myDate.getMonth() + 1; 
    
    
        /**生成年的选择器**/
        var yearSelect = date_time.append("select").attr({'id': 'yearSelect', "class":"picker-year"});
        yearSelect[0][0].addEventListener('change', function () {
    
            d3.select('#day-num-table').remove();
            var value = d3.select(this).property("value");
            nowYear = parseInt(value.replace('year', ''));
            daysAdd("day-num-table", nowYear, nowMonth);
            d3.select('#day-num-table').style({"display": "inline-block"});
            initDay();
        });
        /**生成月的选择器**/
        var monthSelect = date_time
            .append('select')
            .attr({
                'id': 'monthSelect', 
                "class":"picker-month"
            });
        monthSelect[0][0].addEventListener('change', function () {
            d3.select('#day-num-table').remove();
            var value = d3.select(this).property("value");
            nowMonth = parseInt(value.replace('month', ''));
            daysAdd('day-num-table', nowYear, nowMonth);
            d3.select('#day-num-table').style({"display": "inline-block"});
            initDay();
        });
    
        /**给年的select插入option**/
        for (var i = (nowYear - 30); i < (nowYear + 30); i++) {
            yearSelect.append('option').attr('value', 'year' + i).attr('id', 'year' + i).text(i + '年');
        }
        d3.select('#year' + nowYear).attr('selected', 'true');// 选中当前年
        /**给月的select插入option**/
        for (var i = 1; i < 13; i++) {
            monthSelect.append('option').attr('value', function() {
                if (i<10){
                    return 'month0' + i
                }else[]
                return 'month' + i
            }).attr('id', 'month' + i).text(i + '月');
        }
        d3.select('#month' + nowMonth).attr('selected', 'true');// 选中当前月
    
        /**生成week**/
        var weeks = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
        var table = date_time.append('table').attr({
            'id': 'date_timetable', 
            'class': 'table week-table', 
            'width': '100%'
        });
        var table_tr = table.append('tr');
        for (var i = 1; i <= 7; i++) {
            table_tr.append('td')
                .attr('class', 'tableFont')
                .html(weeks[i - 1]);
        }
        daysAdd('day-num-table', nowYear, nowMonth);
    
        /**生成时间选择器的容器**/
        var hourMin = container.append('div').attr('id', 'time-picker-div')
            .attr('class', 'needHide hour-picker');
    
        /**生成小时选择器的div**/
        var date_time4 = hourMin.append('div').attr('id', 'hour-div');
        mouseWheelHandler(date_time4[0][0], 'hour');
        /**生成分钟的选择器的div**/
        var date_time5 = hourMin.append('div').attr('id', 'minu-div');
        mouseWheelHandler(date_time5[0][0], 'minute');
    
        /**给小时添加数字内容**/
        date_time4
            .append('div')
            .attr({
                'id': 'hourScroll', 
                "class":"hour-scroll"
            });
        /**给分钟添加数字内容**/
        date_time5.append('div')
            .attr({
                'class': 'minu-scroll', 
                "id":"minuteScroll"
            });
    
        for (var i = 0; i < 9; i++) {
            date_time4
                .append('div')
                .attr({
                    'id': 'hour' + i, 
                    "class":"hour-num"
                })
                .style({
                    'top': 23 * i + 'px'
                }).html(0 + '' + i);
        }
        /** 给分钟添加点击事件 **/
        for (var i = 0; i < 9; i++) {
            date_time5
                .append('div')
                .attr({'id': 'minute' + i, "class":"minu-num"})
                .style({
                    'top': 23 * i + 'px'
                }).html(0 + '' + i);
        }
    
    
        if (!noLimit){
            allBan();
        }else{
            limit = true;
        }
    }

    function timeBan() {
        var year = d3.select("#yearSelect").property("value").replace(/[^0-9]/gi, '');
        var month = d3.select("#monthSelect").property("value").replace(/[^0-9]/gi, '');
        if (parseDatetime( year + '-' + month + '-01 00:00:00').getTime() / 1000 > sysTime){
            d3.selectAll('.day-num').classed('no-data', true);
            d3.selectAll('.hour-num').classed('no-data', true);
            d3.selectAll('.minu-num').classed('no-data', true);
        }else{
            // 限制显示天
            d3.selectAll('.day-num').each(function() {
                if (this.id){
                    var day = this.id.replace(/[^0-9]/gi, '');
                    var time = parseDatetime( year + '-' + month + '-' + (day < 10 ? ('0' + day) : day) + ' 00:00:00').getTime() / 1000;
                    d3.select(this).classed('no-data', time > sysTime - 60);
                    if (limitStart) {
                        var limit = new Date(limitStart * 1000);
                        var liTime = new Date(time * 1000)
                        d3.select(this).classed('no-data', liTime.getDate() < limit.getDate() || Math.floor(time / 60 / 60 / 24) < Math.floor(limitStart / 60 / 60 / 24 -1) || time > sysTime - 60);
                    }
                    if (limitEnd) {
                        d3.select(this).classed('no-data', time > limitEnd || time > sysTime - 60);
                    }
                    if (limitStart && limitEnd) {
                        d3.select(this).classed('no-data', time > limitEnd || time > sysTime - 60 || time < limit);
                    }
                }
            });
    
            if (input_flag){
                d3.selectAll('.hour-num').classed('no-data', false);
                d3.selectAll('.minu-num').classed('no-data', false);
                var day = d3.select(".clicked-day").attr("id").replace(/[^0-9]/gi, '');
                day = day < 10 ? ('0' + day) : day;
                // 限制显示小时
                d3.selectAll('.hour-num').each(function() {
                    d3.select(this).classed('no-data', false);
                    var hour = this.innerText;
                    var time = parseDatetime( year + '-' + month + '-' + day + ' ' + hour + ':00:00').getTime() / 1000;
                    d3.select(this).classed('no-data', time > sysTime);
                    if (limitStart) {
                        var limit = new Date(limitStart * 1000);
                        var liTime = new Date(time * 1000)
                        d3.select(this).classed('no-data', liTime.getHours() < limit.getHours() && liTime.getDate() < limit.getDate() || Math.floor(time / 60 / 60) < Math.floor(limitStart / 60 / 60) || time > sysTime - 60);
                    }
                    if (limitEnd) {
                        d3.select(this).classed('no-data', time > limitEnd || time > sysTime - 60);
                    }
                    if (limitStart && limitEnd) {
                        d3.select(this).classed('no-data', time > limitEnd || time > sysTime - 60 || time < limit);
                    }
                });
                var clickHour = d3.select('.hour-num.clicked-time')[0][0].innerText;
                // 限制显示分钟
                d3.selectAll('.minu-num').each(function() {
                    var min = this.innerText;
                    var time = parseDatetime( year + '-' + month + '-' + day + ' ' + clickHour + ':' + min + ':00').getTime() / 1000;
                    d3.select(this).classed('no-data', time > sysTime);
                    if (limitStart) {
                        d3.select(this).classed('no-data', time < limitStart || time > sysTime - 60);
                    }
                    if (limitEnd) {
                        d3.select(this).classed('no-data', time > limitEnd || time > sysTime - 60);
                    }
                    if (limitStart && limitEnd) {
                        d3.select(this).classed('no-data', time > limitEnd || time > sysTime - 60 || time < limitStart);
                    }
                });
            }
        }
    }
    
    function initDay() {
        d3.select('.clicked-day').classed('clicked-day', false);
        if (date_picker_id){
            var input = d3.select("#" + date_picker_id);
            var val = input[0][0].value;
            var reg = val.indexOf(':') > -1 ? /\d{2}(?= )/g : /\d{2}$/g;
            var evenDay = val.match(reg)[0];
            if (d3.select('#td' + evenDay).empty()){
                d3.select('#td1').classed('clicked-day', true);
                input.property('value', val.replace(reg, '01'));
            }else{
                d3.select('#td' + evenDay).classed('clicked-day', true);
            }
        }else{
            d3.select('#td1').classed('clicked-day', true);
        }
    }
    /**
     * 分钟、小时滚动（兼容）
     * @param object  滚动div
     * @param type  hour or minute
     */
    function mouseWheelHandler(object, type){
        var stopDefault = function(e) {
                if ( e && e.preventDefault )    // W3C
                    e.preventDefault();
                else                          // IE
                    window.event.returnValue = false;
                return false;
            }, 
            mouseWheelCallback = function (e) { // 滚动后的处理函数
                stopDefault(e);
                var scrollBar = d3.select('#' + type + 'Scroll');
                if (scrollBar.empty()) return;
    
                var scrollBarTop = Number(scrollBar[0][0].offsetTop), 
                    beginNum = type == 'hour' ? parseInt(scrollBarTop / 11.625) : parseInt(scrollBarTop / 3.419);
                if (scrollBarTop >= 0 && scrollBarTop <= 179){
                    e = e || window.event;
                    var value = e.wheelDelta || -e.deltaY || -e.detail, 
                        delta = Math.max(-1, Math.min(1, value));
                    if (delta < 0) {           // scrolling down
                        scrollBar.style('top', (scrollBarTop < 175 ? scrollBarTop + 5 : 175) + 'px');
                    }else {                 // scrolling up
                        scrollBar.style('top', (scrollBarTop > 5 ? scrollBarTop - 5 : 1) + 'px');
                    }
    
                    for (var i = 0; i < 9; i++) {
                        var showNum = i + beginNum;
                        d3.select('#' + type + i).html(showNum <= 9 ? 0 + '' + showNum : showNum);
                    }
                }
            };
    
        if (object.addEventListener) {
            object.addEventListener('mousewheel', mouseWheelCallback, false); // IE9, Chrome, Safari, Oper
            object.addEventListener('wheel', mouseWheelCallback, false); // Firefox
            object.addEventListener('DOMMouseScroll', mouseWheelCallback, false); // Old Firefox
        } else {
            object.attachEvent('onmousewheel', mouseWheelCallback); // IE 6/7/8
        }
    }
    
    
    /**
     * 时间插件的点击动作函数
     * @param id -- 点击的input框的id
     * @param flag -- 如果为true，则生成时和分的选择器，否则只有日期的选择器
     * @param direction -- 时间轴生成的方向，暂时只有top和bottom两个方向
     */
    this.actionDatePicker = function(id, flag, direction){
    
        var this_value = d3.select("#"+id)[0][0].value;
    
        var date_year = this_value.split(" ")[0].split("-")[0];
        var date_month = this_value.split(" ")[0].split("-")[1];
        var date_day = this_value.split(" ")[0].split("-")[2];
        selectedDate(d3.select("#yearSelect").selectAll("option")[0], date_year);
        selectedDate(d3.select("#monthSelect").selectAll("option")[0], date_month);
        d3.select('#day-num-table').remove();
        daysAdd('day-num-table', date_year, date_month);
        d3.selectAll('.clicked-day').classed("clicked-day", false);
        d3.selectAll("#day-num-table .day-num").each(function() {
            if (!d3.select(this).classed('no-data') && this.innerHTML == Number(date_day)){
                d3.select(this).classed("clicked-day", true);
            }
        });
    
        /**点击空白处, 隐藏时间选择器**/
        document.addEventListener('click', function() {
            d3.select(".data-picker-con").style("display", "none");
            d3.select("#"+id)[0][0].dispatchEvent(new Event('input'))
        });
    
        date_picker_id = id;
    
        input_flag = flag;
        var myDate = new Date();
        var clickNum2 = 0;
        var clickNum3 = 0;
        var nowHour =  myDate.getHours();
        var nowMinute = myDate.getMinutes();
    
        /**生成年的选择器**/
        d3.select("#yearSelect")[0][0].addEventListener('change', function () {
            initYearMon("year")
        });
        /**生成月的选择器**/
        d3.select("#monthSelect")[0][0].addEventListener('change', function () {
            initYearMon("month")
    
        });
    
        /**选择小时时的点击事件**/
        d3.selectAll(".hour-num").on("click", function() {
            d3.selectAll(".hour-num").classed("clicked-time", false);
            d3.select(this).classed("clicked-time", true);
            nowHour = d3.select(this).html();
            if (!d3.select('.minu-num.clicked-time').empty()){
                nowMinute = d3.select('.minu-num.clicked-time').html();
            }
            var temValue = d3.select('#' + id).property('value').split(" ")[0];
            d3.select('#' + id).property('value', (temValue + ' ' + nowHour + ':' + nowMinute + ':00'));
            clickNum2++;
            if (clickNum2 > 0 && clickNum3 > 0) {
                d3.select('.data-picker-con').style({
                    "display": "none"
                });
                d3.select("#"+id)[0][0].dispatchEvent(new Event('input'))
                clickNum2 = 0;
                clickNum3 = 0;
            }
            var onchange = new Event("onchange");// 注册名称为onchange的事件
            d3.select('#' + date_picker_id)[0][0].dispatchEvent(onchange);// 给input框设置onchange事件
        });
    
        /**选择分钟时的点击事件**/
        d3.selectAll(".minu-num").on("click", function() {
            d3.selectAll(".minu-num").classed("clicked-time", false);
            d3.select(this).classed("clicked-time", true);
            nowMinute = d3.select(this).html();
            if (!d3.select('.hour-num.clicked-time').empty()){
                nowHour = d3.select('.hour-num.clicked-time').html();
            }
            var temValue = d3.select('#' + id).property('value').split(" ")[0];
            d3.select('#' + id).property('value', (temValue + ' ' + nowHour + ':' + nowMinute + ':00'));
            clickNum3++;
            if (clickNum2 > 0 && clickNum3 > 0) {
                d3.select('.data-picker-con').style({
                    "display": "none"
                });
                d3.select("#"+id)[0][0].dispatchEvent(new Event('input'))
                clickNum2 = 0;
                clickNum3 = 0;
            }
            var onchange = new Event("onchange");// 注册名称为onchange的事件
            d3.select('#' + date_picker_id)[0][0].dispatchEvent(onchange);// 给input框设置onchange事件
        });
    
    
        if (flag){
            var hour = this_value.match(/\d{2}(?=:)/g);
            var minute = this_value.match(/\d{2}(?=:)/g)[1];
            initHourMin(hour, 'hour');
            initHourMin([minute], 'minute');
        }
        d3.selectAll(".day-num").on("click", function() {dayClick(this);});
    
    
        /**点击input框，弹出时间选择器**/
        if (d3.select('.data-picker-con').style('display') == "none") {
            /**给时间弹出框定位**/
            var offsetLeft = d3.select("#"+id)[0][0].getBoundingClientRect().left;
            var offsetTop = d3.select("#"+id)[0][0].getBoundingClientRect().top;
            var input_height = parseInt(d3.select("#"+id)[0][0].offsetHeight );
            var posY = "";
            var posX = offsetLeft +"px";
            if (direction == "top"){
                posY = offsetTop - 220 + "px";
            }else{
                posY = offsetTop + input_height + 5 + "px";
            }
    
            if (!flag){
                d3.select("#time-picker-div").style("display", "none");
                d3.select("#"+id)[0][0].dispatchEvent(new Event('input'))
            }else{
                d3.select("#time-picker-div").style("display", "inline-block");
            }
    
            d3.select('.data-picker-con').style({
                "display": "inline-block", 
                "top": posY, 
                "left": posX, 
                "width": function() {
                    if (flag){
                        return "342px"
                    }else{
                        return "258px"
                    }
                }, 
                "height":"214px"
            });
    
        } else {
            d3.select('.data-picker-con').style({
                "display": "none"
            });
            d3.select("#"+id)[0][0].dispatchEvent(new Event('input'))
        }
        stopEvent(d3.event);
    
        if (!limit){
            timeBan();
            d3.select("#"+id)[0][0].addEventListener("onchange", timeBan);
        }
    }
    
    function initYearMon(type){
        var input = d3.select("#" + date_picker_id);
        var evenVal = input[0][0].value;
        var val = d3.select("#" + type + "Select")[0][0].value.replace(type, "");
        var reg = type == "year" ? /\d{4}(?=-)/g : /-\d{2}(?=-)/g;
        input.property('value', evenVal.replace(reg, type == "year" ? val : "-" + val));
    
    }
    function initHourMin(val, type){
        var init = val ? val[0] : 0;
        var begin = init > 5 ? init - 4 : 0;
        begin = type == 'hour' ? ((begin+8) > 23 ? 15 : begin) : ((begin+8) > 59 ? 51 : begin);
        for (var i = 0; i < 9; i++) {
            var show = i + begin;
            d3.select('#' + type + i).html(show <= 9 ? 0 + '' + show : show).classed('clicked-time', show == init);
        }
    
        var scrollBarTop  = (type == 'hour' ? 11.625   : 3.419) * begin;
        d3.select('#' + type + 'Scroll').style('top', (scrollBarTop < 175 ? scrollBarTop + 5 : 175) + 'px');
    }
    
    function selectedDate(dateArr, date_year){
        dateArr.forEach(function(d){
            d.removeAttribute("selected");
            if (d.value.indexOf(date_year) > 0 ){
                d.setAttribute("selected", "selected");
            }
        });
    }
    
    
    function dayClick(this_){
        var onchange = new Event("onchange");// 注册名称为onchange的事件
    
        var mon_value = d3.select("#monthSelect").property("value");
        var nowMonth = mon_value.replace('month', '');
    
        var year_value = d3.select("#yearSelect").property("value");
        var nowYear = parseInt(year_value.replace('year', ''));
    
        d3.selectAll(".day-num").classed("clicked-day", false);
        d3.select(this_).classed("clicked-day", true);
        var input_value_now = "";
        var day_num = parseInt(d3.select(this_).text().trim());
        if (day_num <= 9){
            day_num = "0"+day_num;
        }
        if (input_flag){
            var temValue = d3.select('#' + date_picker_id).property('value').split(" ")[1];
            input_value_now = nowYear + '-' + nowMonth + '-' + day_num + ' ' + temValue;
    
        }else{
            input_value_now = nowYear + '-' + nowMonth + '-' + day_num;
        }
    
        d3.select("#"+date_picker_id).property("value", "");
        d3.select('#' + date_picker_id).property('value', input_value_now);
    
        if (!input_flag){
            d3.select('.data-picker-con').style("display", "none");
            d3.select("#"+id)[0][0].dispatchEvent(new Event('input'))
        }
        // var onchange = new Event("onchange");// 注册名称为onchange的事件
        d3.select('#' + date_picker_id)[0][0].dispatchEvent(onchange);// 给input框设置onchange事件
    }
    
    function daysAdd(id, nowYear, nowMonth) {
        d3.select('#date_time').append('table').attr({
            'id': id, 
            'class': 'table day-num-table', 
            'width': '100%'
        });
        var nowWeek = new Date(nowYear, nowMonth - 1, 1).getDay();
        var daysArror = [[], [], [], [], [], []];
        dayArrorInf(id, nowYear, daysArror, nowWeek, nowMonth);
        if (d3.select('.day-num.clicked-day').empty() ){
            d3.select('#td1').classed('clicked-day', true);
        }
    
    }
    
    function isLeapYear(year) {
        var isLeapYear;
        if (((year % 4) == 0) && ((year % 100) != 0) || ((year % 400) == 0)) {
            isLeapYear = 1;
        } else {
            isLeapYear = 0;
        }
        return isLeapYear;
    }
    
    function dayArrorInf(id, nowYear, daysArror, nowWeek, nowMonth) {
        if (isLeapYear(nowYear)) {
            if (nowMonth == 2) {
                // 闰年2月
                dayArrorAdd(daysArror, nowWeek, 31, 29);
                daysDraw(d3.select('#' + id),  daysArror, nowYear, nowMonth);
            } else if (nowMonth == 1 || nowMonth == 3 || nowMonth == 5 || nowMonth == 7 || nowMonth == 8 || nowMonth == 10 || nowMonth == 12) {
                if (nowMonth == 1 || nowMonth == 8) {
                    // 闰年1, 8月
                    dayArrorAdd(daysArror, nowWeek, 31, 31);
                    daysDraw(d3.select('#' + id),  daysArror, nowYear, nowMonth);
                } else if (nowMonth == 3) {
                    dayArrorAdd(daysArror, nowWeek, 29, 31);
                    daysDraw(d3.select('#' + id),  daysArror, nowYear, nowMonth);
                } else {
                    // 闰年剩下大月
                    dayArrorAdd(daysArror, nowWeek, 30, 31);
                    daysDraw(d3.select('#' + id), daysArror, nowYear, nowMonth);
                }
            } else {
                // 闰年小月
                dayArrorAdd(daysArror, nowWeek, 31, 30);
                daysDraw(d3.select('#' + id), daysArror, nowYear, nowMonth);
            }
            return nowWeek;
        } else {
            if (nowMonth == 2) {
                // 平年2月
                dayArrorAdd(daysArror, nowWeek, 31, 28);
                daysDraw(d3.select('#' + id), daysArror, nowYear, nowMonth);
            } else if (nowMonth == 1 || nowMonth == 3 || nowMonth == 5 || nowMonth == 7 || nowMonth == 8 || nowMonth == 10 || nowMonth == 12) {
                if (nowMonth == 1 || nowMonth == 8) {
                    // 平年1, 8月
                    dayArrorAdd(daysArror, nowWeek, 31, 31);
                    daysDraw(d3.select('#' + id), daysArror, nowYear, nowMonth);
                } else if (nowMonth == 3) {
                    dayArrorAdd(daysArror, nowWeek, 28, 31);
                    daysDraw(d3.select('#' + id), daysArror, nowYear, nowMonth);
                } else {
                    // 平年剩下大月
                    dayArrorAdd(daysArror, nowWeek, 30, 31);
                    daysDraw(d3.select('#' + id), daysArror, nowYear, nowMonth);
                }
            } else {
                // 平年小月
                dayArrorAdd(daysArror, nowWeek, 31, 30);
                daysDraw(d3.select('#' + id), daysArror, nowYear, nowMonth);
            }
        }
    }
    
    function dayArrorAdd(daysArror, nowWeek, lastMonthNum, thisMonthNum) {
        var days = 1;
        var temNowWeek = (lastMonthNum + 1) - nowWeek;
        for (var i = 0; i < nowWeek; i++) {
            daysArror[0].push(temNowWeek++);
        }
        for (var i = nowWeek; i < 7; i++) {
            daysArror[0].push(days++);
        }
        var flag1, flag2;
        for (var i = 1; i < 6; i++) {
            for (var j = 0; j < 7; j++) {
                if (days <= thisMonthNum) {
                    daysArror[i].push(days++);
                    flag1 = i;
                    flag2 = j;
                }
            }
        }
        days = 1;
        if (flag1 == 4) {
            for (var i = (flag2 + 1); i < 7; i++) {
                daysArror[4].push(days++);
            }
            for (var i = 0; i < 7; i++) {
                daysArror[5].push(days++);
            }
        } else if (flag1 == 5) {
            for (var j = flag2; j < 7; j++) {
                daysArror[5].push(days++);
            }
        } else {
            for (var i = 4; i <= 5; i++) {
                for (var j = 0; j < 7; j++) {
                    daysArror[i].push(days++);
                }
            }
        }
    }
    
    function daysDraw(container, daysArror) {
        for (var i = 1; i <= 6; i++) {
            var table_tr = container.append('tr').attr("class", "day-num-tr");
            for (var j = 1; j <= 7; j++) {
                var temTd = table_tr.append('td')
                    .attr({
                        "class":"day-num"
                    })
                    .html(daysArror[i - 1][j - 1]);
                if (((i <= 1) && (daysArror[i - 1][j - 1] > 20)) || ((i > 4) && (daysArror[i - 1][j - 1] < 15))) {
                    temTd.classed("no-data", true)
                } else {
                    temTd.classed("no-data", false);
                    temTd.attr('id', 'td' + daysArror[i - 1][j - 1]);
                    temTd.on("click", function() {
                        if (date_picker_id != ""){
                            dayClick(this);
                        }
                    })
                }
            }
        }
    }
    /**
     * 阻止事件冒泡。判断浏览器类型，ie向下冒泡，火狐向上冒泡
     * @param e
     */
    function stopEvent(e) {
        if (e && e.stopPropagation)
            e.stopPropagation();
        else
            window.event.cancelBubble=true;
    }
    
    function allBan() {
        d3.select('#yearSelect')[0][0].addEventListener('change', timeBan);
        d3.select('#monthSelect')[0][0].addEventListener('change', timeBan);
        scrollBan(d3.select('#hour-div')[0][0]);
        scrollBan(d3.select('#minu-div')[0][0]);
    
        function scrollBan(object){
            if (object.addEventListener) {
                object.addEventListener('mousewheel', timeBan, false); // IE9, Chrome, Safari, Oper
                object.addEventListener('wheel', timeBan, false); // Firefox
                object.addEventListener('DOMMouseScroll', timeBan, false); // Old Firefox
            } else {
                object.attachEvent('onmousewheel', timeBan); // IE 6/7/8
            }
        }
    }
}

function parseDatetime(str) {
    return new Date(str)
}

export default DateSelect;
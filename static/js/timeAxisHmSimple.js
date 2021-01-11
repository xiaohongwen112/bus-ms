/**
 * 时间轴
 * @param parent
 */
var timeAxisHmSp = function(parent,buffer_time){
    var timeId=parent[0][0].id;
    var _this = this;
    var clientWidth = parent[0][0].clientWidth;
    var clientHeight = parent[0][0].clientHeight;
    var margin = {top: 10, right: 40, bottom: 0, left: 40},
        width = clientWidth - margin.left - margin.right,
        height = clientHeight - margin.top - margin.bottom;
    var rectX = 13;
    var rectY = 12;
    var rectRadius = 6;
    var rectHeight = 10;
    var rectOffset = rectX + 2;
    var rectWidth = width - 2 * rectX;
    var hourWidth = rectWidth / 24;
    var pointerWidth = 13/2;
    var svg = parent.append('svg')
        .attr({
            width: '100%',
            height: '100%',
            class: 'timeAxis',
            //id :'timeAxis' + id,
            viewBox: '0,-20,' + clientWidth + ',' + clientHeight + '',
            //preserveAspectRatio : 'xMid yMid meet'
            preserveAspectRatio: 'none'
        });
    var timeAxisSvg = svg.append('g')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    /***
     * 渐变
     */
    var defs = !d3.select('.timeAxisDefs').empty() ? d3.select('.timeAxisDefs') : d3.select('body').append('svg').attr({class : 'timeAxisDefs', width : 0, height : 0});
    if(defs.select('#blue').empty()){
        linearGradient(defs,'blue','#12507e','#258dcd');
        linearGradient(defs,'gray_black','#122b40','#050f17');
        linearGradient(defs,'yellow','#6a6d13','#d4b71b');
    }
    /**
     * 背景
     */
    var timeAxisBg = timeAxisSvg.append('g').attr({class: 'timeAxisBg'});
    var timeBgRectGroup = timeAxisBg.append('g').attr({class: 'timeBgRectGroup'});
    timeBgRectGroup.append('rect')
        .attr({
            class: 'timeBgRect',
            x: 0,
            y: 0,
            rx: 17,
            ry: 17,
            width: width,
            height: 34,
            fill: 'url(#gray_black)'
        });
    timeBgRectGroup.append('rect')
        .attr({
            class: 'timeBgRectBorder',
            x: rectX,
            y: rectY - 1,
            rx: rectRadius,
            ry: rectRadius,
            width: rectWidth,
            height: rectHeight + 2,
            fill: 'transparent',
            stroke: '#70a9c9',
            'stroke-width': 1
        });
    var markLineGroup = timeAxisBg.append('g').attr({class: 'markLineGroup'});
    markLineGroup.selectAll('line')
        .data(d3.range(24).map(function (d) {
            return d;
        }))
        .enter()
        .append('line')
        .attr({
            class: 'markLine',
            x1: function (d) {
                return d * hourWidth + rectX;
            },
            y1: 25,
            x2: function (d) {
                return d * hourWidth + rectX;
            },
            y2: 35,
            'stroke-width': 1,
            stroke: '#4b677b'
        });
    markLineGroup.select('.markLine').remove();
    OneDay(timeAxisBg);
    function OneDay(day){
        day.append('g')
        .attr({class: 'markTextGroup'})
        .selectAll('text')
        .data(d3.range(5).map(function (d) {
            return d * 6;
        }))
        .enter()
        .append('text')
        .attr({
            class: 'markText',
            x: function (d) {
                return d * hourWidth + 8;
            },
            y: 36,
            'text-anchor': 'right'
        })
        .text(function (d) {
            return d;
        })
        .style({
            fill: '#eee',
            'font-size': '14px'
        });
    }
    var timeMarkRectGroup = timeAxisSvg.append('g').attr({class: 'timeMarkRectGroup'});
    var timeMarkRect = timeMarkRectGroup.append('rect')
        .attr({
            class: 'timeMarkRect',
            x: rectX,
            y: rectY,
            rx: rectRadius,
            ry: rectRadius,
            width: rectWidth,
            height: rectHeight,
            fill: 'url(#blue)',
            stroke: '#70a9c9',
            'stroke-width': 0
        });
    var fullRectGroup = timeAxisSvg.append('g').attr({class: 'fullRectGroup'});
    timeMarkRect.on('click', function () {
        var exsit=d3.select("#"+timeId).selectAll(".timeFullGroup ").empty();
        if(!exsit){
            return;
        }
        var thisRect = this.getBoundingClientRect();
            var TimeAll = Math.floor((d3.event.clientX - thisRect.left)/ thisRect.width * 24) * 60;
        _this.new(TimeAll);
    });

    _this.init = function (data) {
        fullRectGroup.selectAll('.fullTimeGroup').remove();
        for (var i = 0; i < data.length; i++) {
            _this.create(data[i].TimeAll);
        }

    };
    _this.new = function (TimeAll) {
        if (!fullRectGroup.select('.fullTimeGroup').empty()) {
            fullRectGroup.selectAll('.fullTimeGroup').each(function () {
                var thisG = this;
                var _start = thisG.__data__.TimeAll;
            });
            _this.create(TimeAll);

        } else {
            _this.create(TimeAll);
        }
    };
    _this.create = function (TimeAll) {
        if (TimeAll > 1440) return;
        var fullTimeGroup = fullRectGroup.append('g').attr({class: 'fullTimeGroup'})
            .datum({
                TimeAll: TimeAll
            });
        var TimeAllX = TimeAll / 60 * hourWidth + rectOffset;
        var bufferTimeWidth = buffer_time == 0? 0 : 20;
        var bufferTimeX = TimeAllX - pointerWidth*1.9;
        var fullRect = fullTimeGroup.append('rect')
            .attr({
                class: 'fullRect fullRect',
                x: bufferTimeX,
                y: rectY,
                width: bufferTimeWidth,
                height: rectHeight,
                fill: 'url(rgb(0,0,0))',
                stroke: 'transparent',
                'fill-opacity' : 0.3,
                'stroke-width': 0
            });
            
        var startTime = minuteToTime(TimeAll);
        var timeGroupX = TimeAllX - pointerWidth;
        var timeFullGroup= fullTimeGroup.append('g').attr('class', 'timeFullGroup ')
            .attr("transform", "translate(" + timeGroupX + "," + 0 + ")");
        createPointer(timeFullGroup, startTime, 'time');
        var dragStart = d3.behavior.drag()
            .origin(function () {
                return {
                    x: timeFullGroup[0][0].transform.animVal[0].matrix.e,
                    y: 0
                }
            })
            .on("drag", dragStartMove);
        timeFullGroup.call(dragStart);

        function dragStartMove() {
            var thisDrag = this;
            var dragG = thisDrag.parentNode;
            var xStart = d3.event.x;
            var startTime = hourToTime((xStart - rectOffset + pointerWidth) / rectWidth * 24);
            var minTsStart = timeToMinute(startTime);
            var minX = minTsStart;
            var pointX = d3.select(this)[0][0].transform.animVal[0].matrix.e;
            var allWidth=d3.selectAll(".timeMarkRect")[0][0].width.animVal.value;
            var isDrag = true;
            fullRectGroup.selectAll('.fullTimeGroup')[0].every(function (item) {
                var thisG = item;
                isDrag = !(dragG != thisG && minTsStart <= thisG.__data__.ts_end && dragG.__data__.ts_end >= thisG.__data__.ts_end);
                return isDrag;
            });
            minTsStart = minTsStart <= 0 ? 0 : (minTsStart >=1440 ? 1440 : minTsStart);
            isDrag = !(minTsStart<=0||minTsStart>=1440);
            if(pointX<20&&!isDrag){
                minTsStart = 0;
                d3.select(thisDrag).select('.foreignObjectInput').property('value', startTime);
                fullTimeGroup[0][0].__data__.TimeAll = minTsStart;
            }
            else if(pointX>allWidth*1.08&&!isDrag){
                minTsStart = 1439;
                d3.select(thisDrag).select('.foreignObjectInput').property('value', "23:59");
                fullTimeGroup[0][0].__data__.TimeAll = minTsStart;
            }
            
            if (isDrag && minTsStart >=0 && minTsStart <=1440) {
                timeFullGroup.attr("transform", "translate(" + (xStart) + "," + 0 + ")");
                fullRect.attr({x: xStart - pointerWidth, width: bufferTimeWidth});
                minTsStart = minTsStart <= 0 ? -1 : (minTsStart >=1440 ? 1440 : minTsStart);
                fullTimeGroup[0][0].__data__.TimeAll = minTsStart;
                d3.select(thisDrag).select('.foreignObjectInput').property('value', startTime);
            }
        }
        function fullResize() {
            if(!svg[0][0].clientWidth){
                window.removeEventListener('resize', fullResize);
            }else{
                TimeAllX = TimeAll / 60 * hourWidth + rectOffset;
                timeFullGroup.attr("transform", "translate(" + (TimeAllX - pointerWidth ) + "," + 0 + ")");
                var rectbuffer_x =  TimeAllX - pointerWidth*1.9;
                var rectbuffer_width = buffer_time == 0 ? 0 : 20;
                fullRect.attr({x: rectbuffer_x, width: rectbuffer_width});
            }
        } 
        window.addEventListener('resize', fullResize);
    };
    _this.resize = function () {
        if(!svg[0][0].clientWidth){
            _this.clearListener();
        }else{
            var clientWidth = parent[0][0].clientWidth;
            var clientHeight = parent[0][0].clientHeight;
            var margin = {top: 10, right: 40, bottom: 0, left: 40},
            width = clientWidth - margin.left - margin.right;
            rectWidth = width - 2 * rectX;
            hourWidth = rectWidth / 24;
            
            

            svg.attr({viewBox: '0,-10,' + clientWidth + ',' + clientHeight + ''});
            timeBgRectGroup.selectAll('.timeBgRect').attr({width: width});
            timeBgRectGroup.selectAll('.timeBgRectBorder').attr({width: rectWidth});

            markLineGroup.selectAll('line').attr({
                x1: function (d) {
                    return d * hourWidth + rectX;
                },
                x2: function (d) {
                    return d * hourWidth + rectX;
                }
            });
            timeAxisBg.selectAll('text').attr({
                x: function (d) {
                    return d * hourWidth + 8;
                }
            });
            timeMarkRect.attr({width: rectWidth});
        }

    };
    _this.clearListener = function () {
        window.removeEventListener("resize",_this.resize)
    };
    window.addEventListener('resize',_this.resize);

    parent.datum(_this);

    /**
     * 创建指针与tips
     * */
    function createPointer(container, time, type) {
        var pointer = container.append('image')
            .attr({
                class: type + 'Pointer',
                'xlink:href': STATIC_URL + 'img/cbms-img/sys-icon/timePointer.svg',
                width: 40,
                height: 28,
                x: -15,
                y: 0,
                preserveAspectRatio: "none meet"
            })
            .style('cursor', 'pointer');

        var remove = container.append('image')
            .attr({
                class: type + 'Remove removeImg',
                'xlink:href': STATIC_URL + 'img/cbms-img/sys-icon/logicremove.svg',
                width: 18,
                height: 18,
                x: 28,
                y: -19
            })
            .style({
                cursor: 'pointer',
                display: 'none'
            });
        remove[0][0].addEventListener('click', function () {
            d3.select(container[0][0].parentNode).remove();
        });
        container[0][0].addEventListener('mouseover', function () {
            remove.style('display', 'block');
        });
        container[0][0].addEventListener('mouseout', function () {
            remove.style('display', 'none');
        });

        var tipStyle = {
            'border': 'none',
            'font-size': '12px',
            'color': ' rgb(0, 1, 4)',
            'background': 'rgb(224, 186, 108)',
            'border-radius': '10px',
            'height': '18px',
            'line-height': '18px',
            'padding': '0 7px',
            'width': '32px',
            'box-sizing': 'content-box'
        };
        var foreignObject = container.append('foreignObject')
            .attr({
                class: 'foreignObject',
                width: 46,
                height: 18,
                x: -18,
                y: -20
            });
        var foreignObjectInput = foreignObject.append('xhtml:input')
            .attr({
                type: 'text',
                maxlength: 5,
                class: 'foreignObjectInput',
                readonly: 'readonly'
            })
            .style(tipStyle);
        foreignObjectInput.property('value',time);
        var evenTime;
        foreignObjectInput[0][0].addEventListener('click', function () {
            if (this.getAttribute('readonly') === 'readonly') {
              this.removeAttribute('readonly');
            }
            d3.select(this).attr({class:"clickInput foreignObjectInput"});
        });
        foreignObjectInput[0][0].onkeyup = function (e) {
            if(e.keyCode=="13"){
                var reg = /^((1|0?)[0-9]|2[0-3]):([0-5][0-9])/;
                var val = foreignObjectInput[0][0].value;
                if (reg.test(val)) {
                    moveTime(val);
                } else {
                    foreignObjectInput.classed('timeError', true);
                    show_msgs(foreignObjectInput, '输入时间格式错误', 'top');
                }
                d3.select(this).classed("clickInput",false);
            }
        };
        foreignObjectInput[0][0].onblur = function () {
            var reg = /^((1|0?)[0-9]|2[0-3]):([0-5][0-9])/;
            var val = foreignObjectInput[0][0].value;
            if (reg.test(val)) {
                moveTime(val);
            } else {
                foreignObjectInput.classed('timeError', true);
                show_msgs(foreignObjectInput, '输入时间格式错误', 'top');
            }
            d3.select(this).classed("clickInput",false);
        };
        function moveTime(val) {
            var thisDrag = container[0][0];
            var dragG = thisDrag.parentNode;
            var d3DragG = d3.select(dragG);
            var targetTime = timeToMinute(val);
            var allSvgWidth=d3.selectAll(".timeMarkRectGroup  ").selectAll(".timeMarkRect")[0][0].width.animVal.value-14;
//          var startTimeXpo=d3.selectAll(".fullTimeGroup").selectAll(".fullRect")[0][0].x.animVal.value;
//          var startTimeXWidth=d3.selectAll(".fullTimeGroup").selectAll(".fullRect")[0][0].width.animVal.value;
//          var endTimeXpo=startTimeXpo+startTimeXWidth;
            var targetX = targetTime / 60 * hourWidth + rectOffset - pointerWidth;
            d3DragG.select('.timeFullGroup').attr("transform", "translate(" + targetX + "," + 0 + ")");
//          d3DragG.select('.fullRect').attr("transform", "translate(" + targetX/2 + "," + 0 + ")");
            dragG.__data__['TimeAll'] = targetTime;
//          var otherX = d3DragG.select('.' + (type == 'start' ? 'end' : 'start') + 'FullGroup')[0][0].transform.animVal[0].matrix.e;
//          var fullWidth = type == 'start' ? otherX - targetX + pointerWidth : targetX - otherX;
        }
        return pointer;
    }
    /**
     * 分钟转换为“小时：分钟”
     * @param minute
     * @returns {string}
     */
    function minuteToTime(minute) {
        var hour = Math.floor(parseInt(minute) / 60);
        var min = minute - hour * 60;
        if (hour < 10) {
            hour = '0' + hour;
        }
        if (min < 10) {
            min = '0' + min;
        }
        return hour + ':' + min;
    }
    /**
     * 转换为“小时：分钟”
     * @param allHour
     * @returns {string}
     */
    function hourToTime(allHour) {
        allHour = allHour.toFixed(2) * 100 / 100;
        var hour = Math.floor(allHour);
        if (hour >= 0) {
            var min = (allHour * 60 - hour * 60).toFixed(0);
            return (hour < 10 ? ('0' + hour) : hour) + ':' + (min < 10 ? ('0' + min) : min);
        } else {
            return '00:00';
        }

    }
    function hourToTimeTwoDay(allHour) {
        allHour = allHour.toFixed(2) * 100 / 100;
        var hour = Math.floor(allHour);
        if(hour >= 0) {
            if(hour>=24){
                hour=hour-24;
                allHour=allHour-24;
            }
            var min = (allHour * 60 - hour * 60).toFixed(0);
            return (hour < 10 ? ('0' + hour) : hour) + ':' + (min < 10 ? ('0' + min) : min);
        } else {
            return '00:00';
        }
    }
    /**
     *“小时：分钟”转换为分钟
     * @param time
     * @returns 
     */
    function timeToMinute(time) {
        var hour = parseInt(time.split(':')[0]);
        var minute = parseInt(time.split(':')[1]);
        return hour * 60 + minute;
    }
};
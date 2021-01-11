/**
 * 时间轴
 * @param parent
 */
var timeAxisHM = function(parent){
    var _this = this;
    var hasIn = true;
    var clientWidth = parent[0][0].clientWidth;
    var clientHeight = parent[0][0].clientHeight;
    var margin = {top: 10, right: 68, bottom: 0, left: 68},
        width = clientWidth - margin.left - margin.right,
        height = clientHeight - margin.top - margin.bottom;
    var rectX = 13;
    var rectY = 12;
    var rectRadius = 6;
    var rectHeight = 10;
    var rectOffset = rectX + 2;
    var rectWidth = width - 2 * rectX;
    var hourWidth = rectWidth / 24;
    var pointerWidth = 5;

    var svg = parent.append('svg')
        .attr({
            width: '100%',
            height: '100%',
            class: 'timeAxis',
            //id :'timeAxis' + id,
            viewBox: '10,-6,' + clientWidth + ',' + clientHeight + '',
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
//  if()
    timeMarkRect.on('click', function () {
        var thisRect = this.getBoundingClientRect();
            var startTime = Math.floor((d3.event.clientX - thisRect.left)/ thisRect.width * 24) * 60;
            var endTime = startTime + 60;
        _this.new(startTime, endTime == 1440 ? 1439 : endTime);
    });

    
    _this.init = function (data) {
        fullRectGroup.selectAll('.fullTimeGroup').remove();
        for (var i = 0; i < data.length; i++) {
            _this.create(data[i].ts_start, data[i].ts_end);
        }

    };
    _this.new = function (startMin, endMin) {
        if (!fullRectGroup.select('.fullTimeGroup').empty()) {
            var newTime = [startMin, endMin];
            fullRectGroup.selectAll('.fullTimeGroup').each(function () {
                var thisG = this;
                var _start = thisG.__data__.ts_start;
                var _end = thisG.__data__.ts_end;
                var tmpStart = _end - startMin;
                var tmpEnd = endMin - _start;

                if (startMin == _end || (0 <= tmpStart && tmpStart < 60)) {
                    newTime.push(_end);
                    newTime.push(_start);
                    thisG.remove();
                }
                if (endMin == _start || (0 <= tmpEnd && tmpEnd < 60)) {
                    newTime.push(_end);
                    newTime.push(_start);
                    thisG.remove();
                }
            });
            _this.create(d3.min(newTime), d3.max(newTime));

        } else {
            _this.create(startMin, endMin);
        }

//                if(!fullRectGroup.select('.time' + startMin).empty() || !fullRectGroup.select('.time' + endMin).empty()){
//                    var newTime = [startMin,endMin];
//                    !fullRectGroup.select('.time' + startMin).empty() && (newTime = newTime.concat(oldTime('time' + startMin)));
//                    !fullRectGroup.select('.time' + endMin).empty() && (newTime = newTime.concat(oldTime('time' + endMin)));
//                    _this.create(d3.min(newTime),d3.max(newTime));
//                }else{
//                    _this.create(startMin,endMin);
//                }
    };
    _this.create = function (startMin, endMin) {
        if (startMin >= 1440) return;
        var fullTimeGroup = fullRectGroup.append('g').attr({class: 'fullTimeGroup'})
            .datum({
                ts_start: startMin,
                ts_end: endMin
            });
        var startX = startMin / 60 * hourWidth + rectOffset;
        var endX = endMin / 60 * hourWidth + rectOffset;
        var startTime = minuteToTime(startMin);
        var endTime = minuteToTime(endMin);
        var fullWidth = endX - startX;
        var startGroupX = startX - pointerWidth;
        var endGroupX = endX - pointerWidth;

        var fullRect = fullTimeGroup.append('rect')
            .attr({
                class: 'fullRect fullRect',
                x: startX,
                y: rectY,
                width: fullWidth,
                height: rectHeight,
                fill: 'url(#yellow)',
                stroke: 'transparent',
                'stroke-width': 0
            });
        var startFullGroup = fullTimeGroup.append('g').attr('class', 'startFullGroup ')
            .attr("transform", "translate(" + startGroupX + "," + 0 + ")");
        var endFullGroup = fullTimeGroup.append('g').attr('class', 'endFullGroup ')
            .attr("transform", "translate(" + endGroupX + "," + 0 + ")");
        createPointer(startFullGroup, startTime, 'start');
        createPointer(endFullGroup, endTime, 'end');

        var dragStart = d3.behavior.drag()
            .origin(function () {
                return {
                    x: startFullGroup[0][0].transform.animVal[0].matrix.e,
                    y: 0
                }
            })
            .on("drag", dragStartMove);
        var dragEnd = d3.behavior.drag()
            .origin(function () {
                return {
                    x: endFullGroup[0][0].transform.animVal[0].matrix.e,
                    y: 0
                }
            })
            .on("drag", dragEndMove);
        startFullGroup.call(dragStart);
        endFullGroup.call(dragEnd);

        function dragStartMove() {
            var thisDrag = this;
            var dragG = thisDrag.parentNode;
            var xStart = d3.event.x;
            var xEnd = endFullGroup[0][0].transform.animVal[0].matrix.e;
            var fullWidth = xEnd - xStart;
            var pointX = d3.select(this)[0][0].transform.animVal[0].matrix.e;
            fullWidth = xEnd - xStart;
            var startTime = hourToTime((xStart - rectOffset + pointerWidth) / rectWidth * 24);
            var minTsStart = timeToMinute(startTime);
            var isDrag = true;
            fullRectGroup.selectAll('.fullTimeGroup')[0].every(function (item) {
                var thisG = item;
                isDrag = !(dragG != thisG && minTsStart <= thisG.__data__.ts_end && dragG.__data__.ts_end >= thisG.__data__.ts_end);
                return isDrag;
            });
            if(pointX<20 && pointX>0 ){
                minTsStart = minTsStart < 0 ? 0 : (minTsStart >=1440 ? 1440 : minTsStart);
                isDrag = minTsStart>0;
                if(pointX<16&&!isDrag){
                    minTsStart = 0;
                    d3.select(thisDrag).select('.foreignObjectInput').property('value', startTime);
                    fullTimeGroup[0][0].__data__.TimeAll = minTsStart;
                }
            }
            if (isDrag && fullWidth > 0 && minTsStart >0 && minTsStart <1440) {
                startFullGroup.attr("transform", "translate(" + (xStart) + "," + 0 + ")");
                fullRect.attr({x: xStart + pointerWidth, width: fullWidth});
                minTsStart = minTsStart <= 0 ? 0 : (minTsStart > 1440 ? 1440 : minTsStart);
                fullTimeGroup[0][0].__data__.ts_start = minTsStart;
                d3.select(thisDrag).select('.foreignObjectInput').property('value', startTime);
            }

        }
        function dragEndMove() {
            var thisDrag = this;
            var dragG = thisDrag.parentNode;
            var pointX = d3.select(this)[0][0].transform.animVal[0].matrix.e;
            var allWidth=d3.selectAll(".timeMarkRect")[0][0].width.animVal.value;
            var xEnd = d3.event.x;
            var xStart = startFullGroup[0][0].transform.animVal[0].matrix.e;
            var fullWidth = xEnd - xStart;
            var endTime = hourToTime((xEnd - rectOffset + pointerWidth) / rectWidth * 24);
            var minTsEnd = timeToMinute(endTime);
            var isDrag = true;
            fullRectGroup.selectAll('.fullTimeGroup')[0].every(function (item) {
                var thisG = item;
                isDrag = !(dragG != thisG && minTsEnd >= thisG.__data__.ts_start && dragG.__data__.ts_start <= thisG.__data__.ts_start);
                return isDrag;
            });
            if(pointX>allWidth){
                minTsEnd = minTsEnd < 0 ? 0 : (minTsEnd > 1440 ? 1440 : minTsEnd);
                isDrag = minTsEnd<1440;
                if(pointX>allWidth&&!isDrag){
                    minTsEnd = 1439;
                    d3.select(thisDrag).select('.foreignObjectInput').property('value', "23:59");
                    fullTimeGroup[0][0].__data__.ts_end = minTsEnd;
                }
            }
            if (isDrag && fullWidth > 0 && minTsEnd < 1440) {
            endFullGroup.attr("transform", "translate(" + xEnd + "," + 0 + ")");
            fullRect.attr({width: xEnd - xStart});
            minTsEnd = minTsEnd < 0 ? 0 : (minTsEnd > 1440 ? 1440 : minTsEnd);
            fullTimeGroup[0][0].__data__.ts_end = minTsEnd;
            d3.select(thisDrag).select('.foreignObjectInput').property('value', endTime);
            }
        }


        function fullResize() {
            if(!svg[0][0].clientWidth){
                window.removeEventListener('resize', fullResize);
            }else{
                startX = startMin / 60 * hourWidth + rectOffset;
                endX = endMin / 60 * hourWidth + rectOffset;
                fullWidth = endX - startX;

                startFullGroup.attr("transform", "translate(" + (startX - pointerWidth) + "," + 0 + ")");
                endFullGroup.attr("transform", "translate(" + (endX  - pointerWidth) + "," + 0 + ")");

                fullRect.attr({x: startX, width: fullWidth});
            }

        }
        window.addEventListener('resize', fullResize);
        
        
//    //置顶重绘
//      startFullGroup[0][0].onmouseover = function () {
//              if(hasIn){
//                  var startMin = this.__data__.ts_start;
//                  var endMin = this.__data__.ts_end;
//                  d3.select(this.parentNode).remove();
//                  console.log(234)
//                  _this.create(startMin, endMin);
//                  hasIn = false;
//              }
//          };
//      startFullGroup[0][0].onmouseout = function () {
//                  hasIn = true;
//          };
//      endFullGroup[0][0].onmouseover = function () {
//              if(hasIn){
//                  var startMin = this.__data__.ts_start;
//                  var endMin = this.__data__.ts_end;
//                  d3.select(this.parentNode).remove();
//                  console.log(234)
//                  _this.create(startMin, endMin);
//                  hasIn = false;
//              }
//          };
//      endFullGroup[0][0].onmouseout = function () {
//                  hasIn = true;
//          };
    
    };
    _this.resize = function () {
        if(!svg[0][0].clientWidth){
            _this.clearListener();
        }else{
            var clientWidth = parent[0][0].clientWidth;
            var clientHeight = parent[0][0].clientHeight;
            var margin = {top: 10, right: 68, bottom: 0, left: 68},
            width = clientWidth - margin.left - margin.right;
            rectWidth = width - 2 * rectX;
            hourWidth = rectWidth / 24;
            
            

            svg.attr({viewBox: '10,0,' + clientWidth + ',' + clientHeight + ''});
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
                'xlink:href': STATIC_URL + 'img/cbms-img/sys-icon/' + type + 'Pointer.svg',
                width: type == 'start' ? 13 : 14,
                height: type == 'start' ? 25 : 27,
                x: type == 'start' ? -1 : -3,
                y: type == 'start' ? -10 : 21,
                preserveAspectRatio: "none meet"
            })
            .style('cursor', 'pointer');

        var remove = container.append('image')
            .attr({
                class: type + 'Remove removeImg',
                'xlink:href': STATIC_URL + 'img/cbms-img/sys-icon/remove.svg',
                width: 10,
                height: 10,
                x: type == 'start' ? -50 : 48,
                y: type == 'start' ? -18 : 45
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
            'border': '1px solid #1ce3e4',
            'font-size': '12px',
            'color': '#eee',
            'background': '#2b7fb8',
            'border-radius': '10px',
            'height': '18px',
            'line-height': '18px',
            'padding': '0 7px',
            'width': '34px',
            'box-sizing': 'content-box'
        };
        var foreignObject = container.append('foreignObject')
            .attr({
                class: 'foreignObject',
                width: 46,
                height: 18,
                x: type == 'start' ? -50 : 12,
                y: type == 'start' ? -8 : 26
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
        
        pointer[0][0].onmouseover = function () {
                if(hasIn){
                    var startMin = this.__data__.ts_start;
                    var endMin = this.__data__.ts_end;
                    d3.select(this.parentNode.parentNode).remove();
                    _this.create(startMin, endMin);
                    hasIn = false;
                }
            };
        
        pointer[0][0].onmouseleave = function () {
                hasIn = true;
            };
//      pointer[0][0].onmouseover = function () {
//              if(hasIn){
//                  var startMin = this.__data__.ts_start;
//                  var endMin = this.__data__.ts_end;
//                  d3.select(this.parentNode.parentNode).remove();
//                  _this.create(startMin, endMin);
//                  hasIn = false;
//              }
//          };
        
        foreignObjectInput[0][0].onmouseover = function () {
            if(hasIn){
                var startMin = this.__data__.ts_start;
                var endMin = this.__data__.ts_end;
                d3.select(this.parentNode.parentNode.parentNode).remove();
                _this.create(startMin, endMin);
                hasIn = false;
            }
        };
        foreignObjectInput[0][0].onmouseleave = function () {
                hasIn = true;
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
            var targetX = targetTime / 60 * hourWidth + rectOffset;
            var targetX = type == 'start' ? targetX : targetX-pointerWidth;
            var otherX = d3DragG.select('.' + (type == 'start' ? 'end' : 'start') + 'FullGroup')[0][0].transform.animVal[0].matrix.e;
            var fullWidth = type == 'start' ? otherX - targetX + pointerWidth : targetX - otherX;
            if (fullWidth > 0) {
                var isDrag = true;
                fullRectGroup.selectAll('.fullTimeGroup')[0].every(function (item) {
                    var thisG = item;
                    isDrag = type == 'start' ? !(dragG != thisG && targetTime <= thisG.__data__.ts_end && dragG.__data__.ts_end >= thisG.__data__.ts_end)
                        : !(dragG != thisG && targetTime >= thisG.__data__.ts_start && dragG.__data__.ts_start <= thisG.__data__.ts_start);
                    return isDrag;
                });
                if (isDrag) {
                    foreignObjectInput.classed('timeError', false);
                    foreignObjectInput.property('tips') && foreignObjectInput.property('tips').remove();

                    d3DragG.select('.' + type + 'FullGroup').attr("transform", "translate(" + (type == 'start' ? targetX - pointerWidth : targetX) + "," + 0 + ")");
                    d3DragG.select('.fullRect').attr({width: fullWidth});
                    type == 'start' && d3DragG.select('.fullRect').attr({x: targetX});
                    dragG.__data__['ts_' + type] = targetTime;

                    foreignObjectInput.property('value', evenTime).attr('readonly','readonly');
                } else {
                    foreignObjectInput.classed('timeError', true);
                    show_msgs(foreignObjectInput, '输入时间重叠', 'top');
                }
            } else {
                foreignObjectInput.classed('timeError', true);
                show_msgs(foreignObjectInput, '输入时间重叠', 'top');
                //errorAlert(foreignObjectInput);
                //moveTime(evenTime);
            }
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
     * @returns {*}
     */
    function timeToMinute(time) {
        var hour = parseInt(time.split(':')[0]);
        var minute = parseInt(time.split(':')[1]);
        return hour * 60 + minute;
    }
};
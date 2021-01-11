require.config({
    paths: {
        echarts: "../static/js/",
//            'echarts/chart/bar':"../static/js/"
    }
});
require(
    [
        'echarts',
        'echarts/chart/bar',
        'echarts/chart/line'
    ],
    //drawEcharts
    genItem
);

function drawEcharts(ec, i) {

    $('#main').append($('<div id="healthchart' + i + '" ></div>'));
    var bh = $('body').height();
    var sh = /*$('#spd-header').height()*/82;
    var mh = bh - sh;

    $("#main [id^='healthchart']").css({
        height: mh/2,
        width: ($('body').width() + 17)/2-20,
        //float: "left"
    });
    myChart = ec.init(document.getElementById('healthchart' + i));
    window.onresize = myChart.onresize;
    return myChart;
}



function changeURL() {
    var option = {
        //backgroundColor: '#044161',
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            selectedMode: 'multiple',
            top: -10,
            data:[]
        },
        toolbox: {
            top: 30,
            show : true,
            feature : {
                mark : {show: true},
                dataView : {readOnly:false},
                magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        calculable : true,
        dataZoom : {//数据区域缩放
            show : true,
            realtime : true,
            start: 70,
            end: 100
        },
        xAxis : [
            {
                type : 'category',
                boundaryGap : true,
                data: []
                //axisLabel:{
                //    formatter:function(){
                //
                //    }
                //}
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series: []
    };

    //option.series.push(genItem());
    //genItem()
    //debugger;
    //myChart.setOption(option, true);
    return option;
}

function genItem(ec){
    var post_url = '{% url map-index %}';
    $.ajax({
        type: "get",
        async: false,
        url: window.location.href + '/json/',
        data: {},
        dataType: "json",
        success: function (result) {

            //alert(result.res[0].data[0].data[0].health_stat);
            if (result) {
                for (var i = 0; i < result.res.length; i++) {
                    var rres = result.res[i];
                    myChart = drawEcharts(ec, i);
                    option = changeURL();
                    var start = rres.start;
                    var end = rres.end;
                    var timedata = [];
                    for (var t = start; t < end; t+=60) {//后台传过来的t的单位是秒
                        var data = new Date(t*1000).toLocaleString();//在这里Date中的单位是毫秒，所以要诚意1000.
                        timedata.push(data);
                    }
                    for(var j = 0; j < rres.data.length; j++ ) {
                        var arr = [];
                        var itemname = rres.data[j].disp_name;//横坐标内容
                        //alert(itemname)
                        var template = {
                            name: itemname,
                            type: 'line',
                            smooth: true,
                            data: function(){//每个项取得的值
                                for (var k = 0; k < rres.data[j].data.length; k++) {
                                    console.log(rres.data[j].data[k].health_stat);
                                    arr.push(rres.data[j].data[k].health_stat);
                                }
                                return arr;
                            }()
                        };
                        option.series.push(template);
                        option.legend.data.push(itemname);

                    }
                    option.xAxis[0].data = timedata;
                    myChart.setOption(option, true);
                }
            }
        },
        error: function (errorMsg) {
            //alert("图表请求数据失败!");
            //myChart.hideLoading();
        }
    });
}


//    function(){
//        var serie=[];
//        var aa = zhonglei[0].split(",");
//        for( var i=0;i < aa.length;i++){
//            var item={
//                name:aa[i],
//                data:dataArr[i]
//            }
//            serie.push(item);
//        };
//        return serie;
//    }()



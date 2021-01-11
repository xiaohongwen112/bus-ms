
require.config({
    paths: {
        echarts: "./static/js/"
    },
});

require([
        'echarts',
        'echarts/chart/map'
    ],
    DrawEChart
);

var myChart;

function DrawEChart(ec) {
    var bh = $('body').height();
    var sh = /*$('#spd-header').height()*/82;
    var mh = bh - sh;
    $('#main').css({
        height: mh,
        width: $('body').width() + 17
    });
    myChart = ec.init(document.getElementById('main'),{
        noDataLoadingOption:{
            text :"暂无数据",
            effect : 'whirling',
            effectOption:{
                backgroundColor:"#fff"
            },
            textStyle : {
                fontSize : 20
            }
        }
    });
    //myChart.showLoading({
    //    text : 'Waitting',
    //    effect : 'spin',
    //    textStyle : {
    //        fontSize : 20
    //    }
    //});
    myChart.noDataLoading({
        text : 'Waitting',
        effect : 'spin',
        textStyle : {
            fontSize : 20
        }
    });

    window.onresize = myChart.onresize;
    changeURL(post_url + apps[0].id, true);
}

function changeURL(post_url, isFirst) {

    var option = {
        //backgroundColor: '#044161',
        color: ['gold', 'aqua', 'lime'],
        title: {
            text: 'app数据流向地图',
            subtext: '',
            subtextStyle:{
                color: '#444444'
            },
            x: 'center',
            textStyle: {
                color: '#222222'
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: function (v) {
                return v[1].replace(':', ' > ');
            }
        },
        legend: {
            orient: 'vertical',
            x: 205,
            y: 100,
            data: [],
            selectedMode: 'multiple',
            //selected: {
            //    '上海网点': false,
            //    '广州网点': false
            //},
            textStyle: {
                color: '#dddddd'
            }
        },
        dataRange: {
            precision: 0,
            min: 0,
            max: 100,
            orient: 'horizontal',
            padding: [5, 170, 5, 5],
            range: {
                start: 0,
                end: 100
            },
            x: 'right',
            calculable: true,
            color: ['#d33129', 'orange', 'yellow', 'lime', 'aqua'],
            textStyle: {
                color: '#eeeeee'
            }
        },
        series: []
    };
    $.get(post_url, function (result) {

        var data = [];
        try {
            if (result.data != null) {
                data = result.data;
            }
            //else{
            //    return false;
            //}
        } catch (e) {
        }
        var bms_map_data = {};
        var location = {};
        for (var i in data) {
            var sc = data[i].s["c"];
            var dc = data[i].d["c"];
            var arr = bms_map_data[sc] || [];
            if ((data[i].s["latitude"] == -1 && data[i].s["longitude"] == -1) || (data[i].d["latitude"] == -1 && data[i].d["longitude"] == -1)) {
                continue;
            }
            //if ((data[i].s["latitude"] == 200 && data[i].s["longitude"] == 200) || (data[i].d["latitude"] == 200 && data[i].d["longitude"] == 200)) {
            //    continue;
            //}
            var d_point_data = null;
            for (var j in arr) {
                if (arr[j].name == dc) {
                    d_point_data = arr[j];
                }
            }
            d_point_data = d_point_data || {name: dc, value: 0};
            d_point_data.value += data[i].trans_count;
            arr.push(d_point_data);
            bms_map_data[sc] = arr;
            if (location[sc] == null) {
                location[sc] = [data[i].s["longitude"] - 0, data[i].s["latitude"] - 0];
            }
            if (location[dc] == null) {
                location[dc] = [data[i].d["longitude"] - 0, data[i].d["latitude"] - 0];
            }
        }
        for (var propName in bms_map_data) {
            option.series.push(genItem(propName, bms_map_data[propName]));
            //option.legend.data.push(propName);
            option.dataRange.max = Math.floor(cmax/2);
            option.title.subtext = disc_current + ' 数据';
        }
        if (option.series.length > 0) {

            option.series[0]["geoCoord"] = location;
            //$("#main").css({background: 'url(static/spd_img/mapbg5.png)'})
            $("#loading").fadeOut(2000);
            $(".entrymain").hide();
            $(".entrybar,.flow-top5,.side-right").fadeIn(2000);
            //$('#main').hover(function(){
            //    setTimeout(function(){
            //        $(".entrybar").animate({
            //            'bottom': '-80',
            //        }, 400);
            //        $(".side-right").animate({
            //            'right': '-115',
            //        }, 400);
            //    },60000);
            //}).mousemove(function(){
            //
            //    $(".entrybar").animate({
            //        'bottom': '80',
            //    }, 400);
            //    $(".side-right").animate({
            //        'right': '0',
            //    }, 400);
            //
            //})
        }else{
            setInterval("myChart.refresh()",60000);
        }




        //else{
        //    changeURL(post_url, false)
        //}

        if (!isFirst) {
            myChart.refresh();
        }
        myChart.setOption(option, true);
        //myChart.showLoading({
        //    text : 'Waitting',
        //    effect : 'spin',
        //    textStyle : {
        //        fontSize : 20
        //    }
        //});

    });
}

function genItem(propName, data) {
    var template = {
        name: propName,
        type: 'map',
        mapType: 'china',
        roam: true,
        scaleLimit: {max: 100, min: 0.3},
        itemStyle: {
            normal: {
                borderColor: '#00183C',
                borderWidth: 0.5,
                areaStyle: {
                    color: '#5177DA'
                }
            },
            emphasis: {
                borderColor: '#000000',
                borderWidth: 0.5,
                areaStyle: {
                    color: 'rgba(255, 255, 255, 0)'
                }
            }
        },
        data: [],
        markLine: {
            smooth: true,
            effect: {
                show: true,
                scaleSize: 1,
                period: 30,
                color: '#ffffff',
                shadowBlur: 10
            },
            itemStyle: {
                normal: {
                    borderWidth: 1,
                    lineStyle: {
                        type: 'solid',
                        shadowBlur: 10
                    }
                }
            },
            data: []
        },
        markPoint: {
            symbol: 'emptyCircle',
            symbolSize: function (v) {
                return 10 + v / 20
            },
            effect: {
                show: true,
                shadowBlur: 0
            },
            itemStyle: {
                normal: {
                    label: {show: false}
                }
            },
            data: []
        }
    };
    for (var i in data) {
        //  构建markLine数据
        template.markLine.data.push([{name: propName}, data[i]]);
        //  构建markPoint数据
        template.markPoint.data.push(data[i]);
    }
    var aa = data.length;
    if (aa > 200){
        template.markPoint.effect.show = false;
    };
    return template;
};


var compare = function(width) {
    this.width = width;
    this.compareArr = [];//总对比数组
    this.dataSourceArr = [];//数据源信息
    this.dataSnopArr = [];//快照信息
    this.dataSourceFlag = false;//是否二次点击数据源信息
    this.dataSnopFlag = false;//是否二次点击快照信息
    this.init();
}
compare.prototype = {
    init : function() {
        var mapNa = window.localStorage.getItem("mapNameCH");
        var compConTainer = 
            '<div id="comp-pupop">'+
                '<div id="comp-container">'+
                    '<div class="com-title">'+
                        '<span class="com-title-name">对比</span>'+
                        '<span class="com-title-close"></span>'+
                    '</div>'+
                    '<div class="com-main">'+
                        '<div class="com-type">'+
                            '<span id="data-source" class="has-click-type">数据源</span>'+
                            '<span id="data-snop">快照</span>'+
                        '</div>'+
                        '<div class="com-all-result">'+
                            '<span class="data-type-name" data-id="datasource">'+ mapNa +'</span>'+
                            '<div class="com-result-list"></div>'+
                        '</div>'+
                        '<div class="com-all-arror">'+
                            '<span class="data-add-comp"></span>'+
                            '<span class="data-arrow"></span>'+
                        '</div>'+
                        '<div class="com-all-comp">'+
                            '<span class="data-have-pare">加入对比</span>'+
                            '<div class="data-show"><ul id="sortable" class="ui-sortable"></ul></div>'+
                        '</div>'+
                        '<div class="com-all-hand">'+
                            '<span id="hand-add"></span>'+
                            '<span id="hand-delete"></span>'+
                        '</div>'+
                        '<div class="com-all-detail">'+
                            '<span class="detail-name">详情</span>'+
                            '<div class="detail-data"></div>'+
                            '<i id="compare-btn">确定</i>'+
                            '<i id="compare-bnt-cancel">取消</i>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</div>';
        $("body").append(compConTainer);
        // var typeSourse = $(".data-type-name").attr("data-id");
        this.changeType("datasource");
        this.bindEvent();
    },
    //获取数据源或者快照接口
    getType : function(typeSourse,preDataCom){
        var mapName = window.localStorage.getItem("mapName"),
            _this = this,
            postsData = {
                csrfmiddlewaretoken:csrf_token,
                type:typeSourse,
            },
            getaurl = '/zh-cn/spd/'+mapName+'/source_snapshot_data/';
        if(preDataCom) postsData.data_id = preDataCom;
        if(typeSourse === "datasource") this.dataSourceFlag = true;
        else this.dataSnopFlag = true;
        $.post(getaurl,postsData,function(res){
            if(res.code === 0 && !preDataCom){
                _this.creatType(res.data);
                if(typeSourse === "datasource") _this.dataSourceArr = res.data;
                else _this.dataSnopArr = res.data;
            }else if(res.code === 0 && preDataCom){
                _this.creatData(res.data[0]);
            }else{
                _this.noDataCreate();
            }
        });
    },
    //绑定事件
    bindEvent : function(){
        var titleClose = document.getElementsByClassName("com-title-close")[0],
            dataSourse = document.getElementById("data-source"),
            dataSnop = document.getElementById("data-snop"),
            handAdd = document.getElementById("hand-add"),
            handDelete = document.getElementById("hand-delete"),
            comparBntCancel = document.getElementById("compare-bnt-cancel");
            comparBnt = document.getElementById("compare-btn");
        titleClose.addEventListener('click', this.closePupop.bind(this));
        dataSourse.addEventListener('click', this.changeType.bind(this,"datasource"));
        dataSnop.addEventListener('click', this.changeType.bind(this,"snapshot"));
        handAdd.addEventListener('click', this.handAddAll.bind(this));
        handDelete.addEventListener('click', this.handDelete.bind(this,"snapshot"));
        comparBntCancel.addEventListener('click', this.closePupop.bind(this));
        comparBnt.addEventListener('click', this.compareData.bind(this));
    },
    //确定数据传输按钮
    compareData : function(){
        if( $(".pre-add-data").length < 2){
            this.alertPopup("可对比数据不足，中止对比");
            return
        }
        CBMSFLOW.environment('frameDispatch').toggle('preview', false);
        CBMSFLOW.environment('compareMode', true);
        CBMSFLOW.environment('compared', this.compareArr);
        setTimeout(function(){CBMSFLOW.environment('frameDispatch').toggle('map', true);},300);
        this.loading();
    },
    loading : function(){
        var loadingDiv = 
            '<div id="loading-wrapper">'+
                '<div class="img-bg"></div>'+
            '</div>';
        $("body").append(loadingDiv)
    },
    //删除选项与数组中的对应值
    handDelete: function(){
        var hasClickCompDom = $(".has-click-comp"),
            hasClickLen = hasClickCompDom.length;
            for(var i=0;i<hasClickLen;i++){
                compareArrLen  = this.compareArr.length;
                if(compareArrLen === 0) return;
                for(var j=0;j<compareArrLen;j++){
                    if( this.compareArr[j].name === hasClickCompDom[i].innerText){
                        if(hasClickCompDom[i].attributes[1].value === "datasource"){
                            var nowObj = {};  
                                nowObj.name = hasClickCompDom[i].attributes[2].value;
                                nowObj.desc = hasClickCompDom[i].innerText;
                            this.dataSourceArr.push(nowObj);
                        }
                        else{
                            var nowObj = {};  
                            nowObj.name = hasClickCompDom[i].attributes[2].value;
                            nowObj.desc = hasClickCompDom[i].innerText;
                            this.dataSnopArr.push(nowObj);
                        }
                        this.compareArr.splice(j, 1); 
                        compareArrLen  = this.compareArr.length;
                    }
                }
            }
        var dataType = $(".data-type-name").attr("data-id"),
            data = dataType === "datasource" ? this.dataSourceArr : this.dataSnopArr;
        hasClickCompDom.remove();
        this.creatType(data);
    },
    //添加全部按钮
    handAddAll : function(){
        var preAddData = $(".pre-add-data"),
            preAddDataLen = preAddData.length,
            hasClickComp = "has-click-comp";
        for(var i=0;i<preAddDataLen;i++){
            if(!preAddData.eq(i).hasClass(hasClickComp)) preAddData.eq(i).addClass(hasClickComp);
        }
        
    },
    //关闭弹框
    closePupop : function(){
        var compPupop = $("#comp-pupop");
        if(compPupop.length>0) compPupop.remove();
    },
    //获取数据源或者快照信息
    changeType : function(type){
        var dataSnop = $("#data-snop"), 
            dataSource = $("#data-source"),
            hasCliclType = "has-click-type",
            dataTyprName = $(".data-type-name");
        if(type === "datasource") {
            if(dataSnop.hasClass(hasCliclType)) dataSnop.removeClass(hasCliclType);
            dataSource.addClass(hasCliclType);
            if(!this.dataSourceFlag)  this.getType(type);
            else this.secCreate(type);
        }
        else {
            dataSource.removeClass(hasCliclType);
            dataSnop.addClass(hasCliclType);
            if(!this.dataSnopFlag) this.getType(type);
            else this.secCreate(type);
        }
        dataTyprName.attr({"data-id": type});
    },
    //数组添加对比项，添加与去重功能
    ADDtoCompare : function(){
        var _this = this;
        var hasClickData = $(".com-result-list").find(".has-click-data"),
            hasClickDataLen = hasClickData.length,
            compareArrLen = this.compareArr.length;
        for (var i=0;i<hasClickDataLen;i++){
            //添加到数据中
            var compareObj = {};
            compareObj.name = hasClickData[i].innerText;
            compareObj.type = hasClickData[i].attributes[2].value;
            compareObj.desc = hasClickData[i].attributes[1].value;
            this.compareArr.push(compareObj);
            for (var j=0;j<compareArrLen;j++){
                if(hasClickData[i].innerText === this.compareArr[j].name) {
                    //使用filter过滤数组中对象name相同的类型
                    this.compareArr = this.compareArr.filter(function(element,index,self){
                        var selfArr = [];
                            selfArrLen = self.length;
                        for(var k=0;k<selfArrLen;k++) selfArr.push(self[k].name);
                        return selfArr.indexOf(element.name) === index;
                    });
                }
            }
            var comr = $(".pre-add-data"),
                comrLen = comr.length;
            nowArr = hasClickData[i].attributes[2].nodeValue === "datasource" ? this.dataSourceArr : this.dataSnopArr;
            if(comrLen === 0){
                hasClickData[i].remove();
                compute(nowArr);
            } else{
                var flag = true;
                for(var k=0;k<comr.length;k++){
                    if(hasClickData[i].innerText === comr[k].innerText) {
                        flag = false;
                    } 
                }
                if(flag){
                    hasClickData[i].remove();
                    compute(nowArr);
                }
            }
        }
        this.goTocompare();
        $(".pre-list").removeClass("has-click-data");
        function compute(nowArr){
            for(var v =0;v<nowArr.length;v++){
                if( hasClickData[i].innerText === nowArr[v].desc){
                    nowArr.splice(v, 1);
                    break;
                }
            }
        }
    },
    //数据展示
    creatData : function(data){
        var detailData = $(".detail-data"),
            sourseShowS = "sourse-show"
        if($("#"+sourseShowS).length > 0) $("#"+sourseShowS).remove();
        var sourseShow = $("<div></div>").attr({id : sourseShowS});
        if(data.map)  this.sourseDataCreate(sourseShow, data);
        else this.snopDataCreate(sourseShow, data); 
        detailData.append(sourseShow);
    },
    //快照详细展示
    snopDataCreate : function(sourseShow, data){
        var dataSnopTemp =
            '<div class="snop-detail">'+
                '<div class="snop-detail-main">'+
                    '<div class="snop-pto">'+
                        '<img class="snop-pic" src='+data.map_png+'>'+
                        '<div class="snop-detail-name">'+data.snapshot_name+ '</div>'+
                    '</div>'+
                '</div>'+
            '</div>';
        sourseShow.append(dataSnopTemp);
    },
    //数据源详细展示
    sourseDataCreate : function(sourseShow, data){
        var timeInit = data.create_time * 1000,
            Timer = new Date(timeInit),
            durationTime = this.initData(data.duration, "dur"),
            ipCount = this.initData(data.ip_count),
            convsCount = this.initData(data.convs_count),
            diskSpace = this.initData(data.disk_space, "disk"),
            dataState = this.initData(data.state, "state"),
            createTime = Timer.toLocaleDateString().replace(/\//g, "-") + " " + Timer.toTimeString().substr(0, 8),
            dataSourceTemp =
            '<div class="sourse-detail">'+
                '<div class="sourse-detail-name">'+data.desc+'</div>'+
                '<div class="sourse-detail-main">'+
                    '<ul class = "data-ul">'+
                        '<li><span>起始时间:</span><b>'+ createTime +'</b></li>'+
                        '<li><span>持续时间:</span><b>'+ durationTime +'</b></li>'+
                        '<li><span>数据源:</span><b>'+ data.type +'</b></li>'+
                        '<li><span>IP地址:</span><b>'+ data.host +'</b></li>'+
                        '<li><span>接口:</span><b>'+ data.intf +'</b></li>'+
                        '<li><span>IP数量:</span><b>'+ ipCount +'</b></li>'+
                        '<li><span>会话数:</span><b>'+ convsCount +'</b></li>'+
                        '<li><span>空间占用:</span><b>'+ diskSpace +'</b></li>'+
                        '<li><span>状态:</span><b>'+ dataState +'</b></li>'+
                    '</ul>'+
                '</div>'+
            '</div>';
        sourseShow.append(dataSourceTemp);
    },
    //加入对比数据展示
    goTocompare : function(){
        var compArr = this.compareArr,
            compArrLen = compArr.length,
            _this = this;
        if($(".pre-add-data").length>0) $(".pre-add-data").remove();
        var sortUl = $("#sortable");
        for(var i=0;i<compArrLen;i++){
            var preGoData = $("<li></li>").attr({class:"pre-add-data","data-type" : compArr[i].type,"data-id" : compArr[i].desc}).html(compArr[i].name);
            sortUl.append(preGoData);//pre-add-data加入对比每条数据class名
            preGoData.on("click",function(){
                var hasCliclComp = "has-click-comp",
                    dataID = $(this).attr("data-id"),
                    whichData = $(this).attr("data-type"),
                    clickCom = $("."+hasCliclComp),
                    ifHasComp = $(this).hasClass(hasCliclComp);
                _this.getType(whichData,dataID);
                if(ifHasComp) {
                    $(this).removeClass(hasCliclComp);
                }
                else {
                    if(clickCom.length<5){
                        $(this).addClass(hasCliclComp);
                    } 
                }
            });
        }
        $( "#sortable" ).sortable({
            connectWith: ".connectedSortable"
        }).disableSelection();
        $(".pre-add-data").on("mouseup",function(){
            setTimeout(function(){_this.sortArr();},200);
        });
    },
    //重置数组
    sortArr : function(){
        var sortDataArr = [],
            preAddData = $(".pre-add-data");
        // $.each(preAddData, function(index,item){
        //     if(preAddData[index].style[0] !== "visibility"){ 
        //         ArrData.push(item);
        //     }
        // })
        for(var i=0;i<preAddData.length;i++){
            var preObj = {};
            preObj.name = preAddData[i].innerText;
            preObj.type = preAddData[i].attributes[1].nodeValue;
            preObj.desc = preAddData[i].attributes[2].nodeValue;
            sortDataArr.push(preObj);

        }
        this.compareArr = sortDataArr;
    },
    //清空生成数据源或者快照每条信息详情
    clearT : function(){
        if($(".pre-list")) $(".pre-list").remove();
    },
    //数据源与快照无数据
    noDataCreate : function(){
        this.clearT();
        dataType = $(".data-type-name").attr("data-id");
        if(dataType === "datasource")  this.dataSourceArr = [{name : "无数据",desc: "无数据"}];
        else this.dataSnopArr = [{name : "无数据",desc: "无数据"}];
        var preData = $("<div></div>").attr({class:"pre-list no-data"}).html("无数据");
        $('.com-result-list').append(preData);//pre-add-data加入对比每条数据class名
    },
    //二次点击获取数据
    secCreate : function(type){
        if(type === "datasource") this.creatType(this.dataSourceArr,type);
        else this.creatType(this.dataSnopArr,type);
    },
    //生成数据源或者快照每条信息详情
    creatType : function(data,dataType){
        this.clearT();
        var _this = this,
            dataLen = data.length;
        if(!dataType) dataType = $(".data-type-name").attr("data-id");
        // if($(".pre-list").length>0) $(".pre-list").remove();
        if(data.length === 1 && data[0].name === "无数据"){
            var preData = $("<div></div>").attr({class:"pre-list no-data"}).html("无数据");
            $('.com-result-list').append(preData);//pre-add-data加入对比每条数据class名
        }
        else{
            for(var i=0;i<dataLen;i++){
                var preData = $("<div></div>").attr({class:"pre-list","data-id":data[i].name,"data-tpye":dataType}).html(data[i].desc);
                $('.com-result-list').append(preData);//pre-add-data加入对比每条数据class名
                preData.on("click",function(){
                    var hasCliclData = "has-click-data",
                        canMoveData = "can-move-data",
                        dataID = $(this).attr("data-id"),
                        whichData = $(".data-type-name").attr("data-id"),
                        clickData = $("."+hasCliclData),
                        ifHasClick = $(this).hasClass(hasCliclData);
                    _this.getType(whichData,dataID);
                    if(ifHasClick) {
                        $(this).removeClass(hasCliclData);
                        var clickData = $("."+hasCliclData);
                        if(clickData.length === 0) $(".data-add-comp").removeClass(canMoveData);
                    }
                    else {
                        var compD = $(".pre-add-data");
                        if(clickData.length < (5 - compD.length)){
                            $(this).addClass(hasCliclData);
                        } 
                        var clickData = $("."+hasCliclData);
                        if(clickData.length > 0) {
                            $(".data-add-comp").addClass(canMoveData);
                        }
                    }
                });
            }
        }
        var dataAddComp = document.getElementsByClassName("data-add-comp")[0];
        dataAddComp.addEventListener('click', _this.ADDtoCompare.bind(_this));
    },
    //数据转换
    initData : function(data, type){
        switch (type) {
            case ("dur"):
                if(data < 60) return data+"秒";
                else if(data % 60 === 0) return data / 60 +"分钟";
                else return Math.floor(data / 60) +"分钟"+data % 60 + "秒";
            case ("disk"):
                if(data === undefined) return "n/a";
                var diskData = data;
                if (diskData <= Math.pow(1024, 1)) return (diskData).toFixed(2) + "B";
                else if(diskData > Math.pow(1024, 1) &&diskData <= Math.pow(1024, 2)) return (diskData / Math.pow(1024, 1)).toFixed(2) + "KB";
                else if(diskData > Math.pow(1024, 2) &&diskData <= Math.pow(1024, 3)) return (data / Math.pow(1024, 2)).toFixed(2) + "MB";
                else if(diskData > Math.pow(1024, 3) &&diskData <= Math.pow(1024, 4)) return (data / Math.pow(1024, 3)).toFixed(2) + "GB";
                else return (diskData / Math.pow(1024, 4)).toFixed(2) + "TB";
            case ("state"):
                if(data === "done")  return "已完成 (100%)";
                return "数据源异常";
            default:
                if(data === undefined) return "n/a";
                else return data;
        }
    },
    //弹框效果
    alertPopup : function(msg){
        var alert = 
        '<div id="alert-popup">'+
                '<div class="alert-popup-main">'+
                    '<div class="alert-popup-title">'+
                        '<h3>提示</h3>'+
                        '<div class="alert-popup-close"></div>'+
                    '</div>'+
                    '<span>'+ msg +'</span>'+
                '</div>'+
            '</div>';
        $("#comp-pupop").append(alert);
        $(".alert-popup-close").on("click",function(){
            $("#alert-popup").remove();
        })
    },
}


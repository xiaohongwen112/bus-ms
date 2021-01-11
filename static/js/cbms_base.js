
/**
 * 将json转化为key=value并用&连接的字符串
 * @param json_data
 * @returns {string}
 */
function jsonTod3string(json_data){
  var string = '';
  for(var key in json_data){
      string += key + '=' + encodeURIComponent(json_data[key]);
      string += '&';
  }
  return string.substring(0,string.length-1);
}
/**
* 数字动态变化
* @param target   ID
* @param startVal  起始值
* @param endVal   结束值
* @param decimals  小数位数
* @param duration  时间
* @constructor
*/
function CountUp(target, startVal, endVal, decimals, duration) {
  var lastTime = 0;
  var vendors = ['webkit', 'moz', 'ms', 'o'];
  for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
      window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
      window.cancelAnimationFrame =
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
  }
  if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = function(callback, element) {
          var currTime = new Date().getTime();
          var timeToCall = Math.max(0, 16 - (currTime - lastTime));
          var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
          lastTime = currTime + timeToCall;
          return id;
      };
  }
  if (!window.cancelAnimationFrame) {
      window.cancelAnimationFrame = function(id) {
          clearTimeout(id);
      };
  }

  var self = this;

  self.options = {
      useEasing : true,
      useGrouping : true,
      separator : '',
      decimal : '.',
      easingFn: null,
      formattingFn: null
  };
  //// extend default options with passed options object
  //for (var key in options) {
  //    if (options.hasOwnProperty(key)) {
  //        self.options[key] = options[key];
  //    }
  //}
  if (self.options.separator === '') { self.options.useGrouping = false; }
  if (!self.options.prefix) self.options.prefix = '';
  if (!self.options.suffix) self.options.suffix = '';

  self.d = (typeof target === 'string') ? document.getElementById(target) : target;
  self.startVal = Number(startVal);
  self.endVal = Number(endVal);
  self.countDown = (self.startVal > self.endVal);
  self.frameVal = self.startVal;
  self.decimals = Math.max(0, decimals || 0);
  self.dec = Math.pow(10, self.decimals);
  self.duration = Number(duration) * 1000 || 2000;

  self.formatNumber = function(nStr) {
      nStr = nStr.toFixed(self.decimals);
      nStr += '';
      var x, x1, x2, rgx;
      x = nStr.split('.');
      x1 = x[0];
      x2 = x.length > 1 ? self.options.decimal + x[1] : '';
      rgx = /(\d+)(\d{3})/;
      if (self.options.useGrouping) {
          while (rgx.test(x1)) {
              x1 = x1.replace(rgx, '$1' + self.options.separator + '$2');
          }
      }
      return self.options.prefix + x1 + x2 + self.options.suffix;
  };

  self.easeOutExpo = function(t, b, c, d) {
      return c * (-Math.pow(2, -10 * t / d) + 1) * 1024 / 1023 + b;
  };

  self.easingFn = self.options.easingFn ? self.options.easingFn : self.easeOutExpo;
  self.formattingFn = self.options.formattingFn ? self.options.formattingFn : self.formatNumber;


  self.printValue = function(value) {
      var result = self.formattingFn(value);

      if (self.d.tagName === 'INPUT') {
          this.d.value = result;
      }
      else if (self.d.tagName === 'text' || self.d.tagName === 'tspan') {
          this.d.textContent = result;
      }
      else {
          this.d.innerHTML = result;
      }
  };

  self.count = function(timestamp) {
      if (!self.startTime) { self.startTime = timestamp; }

      self.timestamp = timestamp;
      var progress = timestamp - self.startTime;
      self.remaining = self.duration - progress;

      if (self.options.useEasing) {
          if (self.countDown) {
              self.frameVal = self.startVal - self.easingFn(progress, 0, self.startVal - self.endVal, self.duration);
          } else {
              self.frameVal = self.easingFn(progress, self.startVal, self.endVal - self.startVal, self.duration);
          }
      } else {
          if (self.countDown) {
              self.frameVal = self.startVal - ((self.startVal - self.endVal) * (progress / self.duration));
          } else {
              self.frameVal = self.startVal + (self.endVal - self.startVal) * (progress / self.duration);
          }
      }

      if (self.countDown) {
          self.frameVal = (self.frameVal < self.endVal) ? self.endVal : self.frameVal;
      } else {
          self.frameVal = (self.frameVal > self.endVal) ? self.endVal : self.frameVal;
      }
      self.frameVal = Math.round(self.frameVal*self.dec)/self.dec;
      self.printValue(self.frameVal);

      if (progress < self.duration) {
          self.rAF = requestAnimationFrame(self.count);
      } else {
          if (self.callback) { self.callback(); }
      }
  };

  self.start = function(callback) {
      self.callback = callback;
      self.rAF = requestAnimationFrame(self.count);
      return false;
  };
};
/**
* 创建圆、圆弧、环
* @param container 容器
* @param startAngle 开始角度
* @param endAngle 结束角度PI
* @param innerRadius 内半径
* @param outerRadius 外半径
* @param fill_color 填充颜色
* @param data 显示的信息
* @param dy 信息距顶部的距离
*/
function create_arc(container,startAngle,endAngle,innerRadius,outerRadius,fill_color,data,dy){
  var arc = d3.svg.arc().startAngle(startAngle).endAngle(endAngle).innerRadius(innerRadius).outerRadius(outerRadius);
  container.append("path").attr("fill",fill_color).attr("d",function(d){return arc(d);});
  if(data){
      var text = container.append("text").attr("class","level-data").attr("text-anchor","middle");
      text.append("tspan").attr('class','ring-text').attr("dy",dy).attr("fill",fill_color).text(data);
  }

}
/**
* 垂直渐变
* @param g
* @param id
* @param color_1
* @param color_2
* @param opacity_1
* @param opacity_2
*/
function linearGradient(g,id,color_1,color_2,opacity_1,opacity_2){
  if(!d3.select('#defs_' + id).empty()){
      d3.select('#defs_' + id).remove();
  }
  var def = g.append('defs')
      .attr('id','defs_' + id);
  var linearGradientDef = def.append('linearGradient')
      .attr({
          id : id,
          x1 : '0%',
          y1 : '0%',
          x2 : '0%',
          y2 : '100%'
      });
  linearGradientDef.append('stop')
      .attr({
          offset : '0%'
      })
      .style({
          'stop-color':color_1,
          'stop-opacity':opacity_1
      });
  linearGradientDef.append('stop')
      .attr({
          offset : '100%'
      })
      .style({
          'stop-color':color_2,
          'stop-opacity':opacity_2
      });
}
/**
* 取得多维数组最大值（图表用）
* @param arr
* @returns {number}
*/
function getMaxdata(arr){
  var maxdata = 0;
  for(var i=0;i<arr.length;i++) {
      maxdata = d3.max([maxdata,d3.max(arr[i].map(function(value){return Number(value);}))]);
  }
  var num_size = parseInt(Math.round(maxdata).toString().length);
  var first_num = Math.ceil(maxdata/Math.pow(10,num_size-1));
  if(maxdata < 100){
      return Math.ceil(maxdata/100) * 100;
  }else{
      if(first_num < 6){
          return first_num * Math.pow(10,num_size-1);
      }else{
          return Math.ceil(first_num/2) * 2 * Math.pow(10,num_size-1);
      }
  }
}
/**
* 分割字符串
* @param str
* @param max 宽度
* @param fontsize
* @returns {Array}
*/
function splitByLine(str,max,fontsize){
  fontsize = fontsize || 14;
  var curLen = 0;
  var result = [];
  var start = 0, end = 0;
  for(var i=0;i<str.length;i++){
      var code = str.charCodeAt(i);
      var pixelLen = code > 255 ? fontsize : fontsize/2;
      curLen += pixelLen;
      if(curLen > max){
          end = i;
          result.push(str.substring(start,end));
          start = i;
          curLen = pixelLen;
      }
      if( i === str.length - 1 ){
          end = i;
          result.push(str.substring(start,end+1));
      }
  }
  return result;
}
/**
* 取消冒泡事件
* @param event
*/
function cancel_bubble(){
  var e = d3.event || window.event;
  if (e.stopPropagation)
      e.stopPropagation();
  else e.cancelBubble = true;
}
/**
* 根据健康度的值返回状态及颜色
* @param health
* @returns {{color: string, status: string}}
*/
function health_color_status(health){
  //if(health < 0) return false;
  var style = {
      text : '',
      color : ''
  };
  switch(true){
      case health == 0:
          style.text = "--";
          style.color = "#061A2B";
          break;
      case health < 41:
          style.text = "紧急";
          style.color = "#d95151";
          break;
      case health < 61:
          style.text = "关注";
          style.color = "#d88745";
          //    break;
          //case health < 81:
          //    style.text = "一般";
          //    style.color = "#29d798";
          break;
      default:
          style.text = "正常";
          style.color = "#32dc2a";
  }
  return style;
}
/**
* 交易量单位转换
* @param trans_count
* @param isString
* @returns {{value: *, unit: string}}
*/
function format_trans_count(trans_count,isString) {
  var trans_count_format = parseInt(trans_count);
  var count_len = trans_count.toString().length;
  var formatterCount = {
      value : trans_count ,
      unit : '笔'
  };
  if(count_len < 5){
      formatterCount.unit = '笔';
  }else if(count_len < 9){
      formatterCount.unit = '万笔';
      formatterCount.value = (trans_count_format / 10000 ).toFixed(2)*100/100;
  }else if(count_len < 13){
      formatterCount.unit = "亿笔";
      formatterCount.value = (trans_count_format / 100000000 ).toFixed(2)*100/100;
  }else{
      formatterCount.unit = "万亿笔";
      formatterCount.value = (trans_count_format / 1000000000000 ).toFixed(2)*100/100;
  }
  if(isString){
      return formatterCount.value + formatterCount.unit;
  }else{
      return formatterCount;
  }
}
/**
*分页
* @param parent
* @param number_of_pages
* @param show_per_page
* @param id_or_class   表格id或者div类名
* @param is_table     是否是表格
* @param callBack     是否是表格
*/
var index_page = 1;
function paging(parent,number_of_pages,show_per_page,id_or_class,is_table,callBack){
  var _this = this;
  var showPage = 5;

  if(!d3.select('#paging_div').empty()){
      d3.select('#paging_div').remove();
  }

  var paging_div = parent.append('div')
      .attr('id', 'paging_div')
      .attr('class','page-navigation');

  var paging_ul = paging_div.append('ul')
      .attr('id','page_navigation')
      .attr('class','page-navigation-ul');
  if(number_of_pages > 0){
      paging_ul.append('li')
          .attr('class','page-count')
          .append('span')
          .html('共' + number_of_pages + '页');
  }

  if(number_of_pages > 1){
      var page_jump = paging_ul.append('li')
          .attr('class','page-jump')
          .append('span');
      page_jump.append('input')
          .attr('type','text')
          .attr('id','input_page')
          .attr('placeholder','页码');
      var pageJump = page_jump.append('input')
          .attr('type','button')
          .attr('value','跳转')
          .html('跳转');
      pageJump[0][0].addEventListener('click',function(){
              var pageValue = d3.select('#input_page')[0][0].value;
              var in_p = parseInt(pageValue);
              if(!/^\d+$/.test(pageValue) || (isNaN(in_p))||(in_p <1)||(in_p>number_of_pages)){
                  d3.select('#input_page').classed("error-page",true);
                  setTimeout(function(){d3.select('#input_page').classed("error-page",false);},150);
              }else {
                  d3.select('#input_page').classed("error-page",false);
                  d3.select('#input_page').property('value','');
                  d3.select('#input_page').attr('placeholder','页码');
                  index_page = index_page > number_of_pages ? number_of_pages : in_p;
                  !is_table && _this.divPaging(in_p);
                  is_table && _this.tablePaging(in_p);
              }
          });

      create_page_font(paging_ul,"首页",'pageFirst');
      create_page_font(paging_ul,"上一页",'pageFront');
      create_page_th(paging_ul,number_of_pages);
      create_page_font(paging_ul,"下一页",'pageNext');
      create_page_font(paging_ul,"尾页",'pageLast');

      d3.selectAll(".page-th").each(function(){
          d3.select(this)[0][0].addEventListener("click",function(){
              var in_page = this.innerText;
              if(in_page == "首页"){
                  in_page = 1;
              }else if(in_page == "尾页"){
                  in_page = number_of_pages;
              }else if(in_page == "上一页"){
                  in_page = index_page > 1 ? index_page-1 : 1;
              }else if(in_page == "下一页"){
                  in_page = index_page < number_of_pages ? index_page+1 : number_of_pages;
              }
              in_page = parseInt(in_page);
              index_page = index_page > number_of_pages ? number_of_pages : in_page ;
              !is_table && _this.divPaging(in_page);
              is_table && _this.tablePaging(in_page);
          });
      });
  }

  this.divPaging = function(in_page){
      _this.pagingChange(in_page);
      if(typeof callBack == 'function'){callBack(in_page,show_per_page);}
  };
  this.tablePaging = function(in_page){
      _this.pagingChange(in_page);
      var show_start = (in_page-1) * show_per_page;
      var show_end = in_page * show_per_page;
      if(id_or_class == 'manage_table') {
          show_end = show_end + 1;
          if (in_page > 1) {
              show_start = show_start+1;
          }
      }
      d3.select('#'+ id_or_class).selectAll("tbody tr").each(function(d,i){
          d3.select(this).style('display',(i >= show_start) && (i < show_end) ? 'table-row':'none');
          (id_or_class == 'manage_table' && i == 0) && d3.select(this).style('display','table-row');
      });
  };
  this.pagingChange = function(in_page){
      d3.selectAll(".page-click").classed('page-click',false);
      var midPos = (showPage-3)/2+1;
      d3.selectAll('.pageMore').classed('pageMore',false);
      d3.selectAll('.pageNum').each(function(d,num){
          var _thisPage = d3.select(this);
          var _pageIndex = num+1;
          if(number_of_pages > showPage){
              if(in_page >=1 && in_page < number_of_pages-showPage+midPos){
                  if(_pageIndex < showPage-1){
                      var nowShow = in_page == 1 ? in_page+num : in_page+num-1;
                      _thisPage.datum(nowShow).html(nowShow);
                  }else if(_pageIndex == showPage-1){
                      _thisPage.datum('more').html('...');
                      _thisPage.classed('pageMore',true);
                  }else{
                      _thisPage.datum(number_of_pages).html(number_of_pages);
                  }
              }else if(in_page == number_of_pages || in_page >= number_of_pages-showPage+midPos){
                  _thisPage.datum(number_of_pages-showPage+_pageIndex).html(number_of_pages-showPage+_pageIndex);
              }
          }else{
              _thisPage.datum(num+1).html(num+1);
          }
          _thisPage.classed('page-click',_thisPage.datum() == in_page);

      });

      d3.selectAll('.pageFont').classed('banPage',false);
      if(in_page == 1){
          d3.select('.pageFirst').classed('banPage',true);
          d3.select('.pageFront').classed('banPage',true);
      }else if(in_page == number_of_pages){
          d3.selectAll('.pageNext').classed('banPage',true);
          d3.selectAll('.pageLast').classed('banPage',true);
      }
  };

  !is_table && _this.divPaging(index_page);
  is_table && _this.tablePaging(index_page);

}
function create_page_th(paging_ul,count){
  var showPage = 5;
  if(count <= showPage){
      for(var i=1; i < (count+1); i++){
          paging_ul.append('li')
              .attr('class','page-th pageNum')
              .datum(i)
              .html(i);
      }
  }else{
      for(var i=1; i < (showPage+1); i++){
          var li = paging_ul.append('li')
              .attr('class','page-th pageNum');
          if(i < showPage-1){
              li.datum(i).html(i);
          }else if(i == showPage-1){
              li.datum('more').html('...');
              li.classed('pageMore',true);
          }else{
              li.datum(count).html(count);
          }
      }
  }

}
function create_page_font(paging_ul,font,className){
  paging_ul.append('li')
      .attr('class','page-th pageFont ' + className)
      .append('a')
      .html(font);
}
/**
* 错误警告 input框边框闪烁
* @param this_
*/
function errorAlert(this_){
  this_.classed("highPoint",true);
  setTimeout(function(){
      this_.classed("highPoint",false);
  },300);
}
/**
* 加载中...
* @param container
* @returns {*}
*/
function loading(){
  var container = d3.select('body');
  if(container.select('.loadingDiv').empty()){
      var loadingDiv = container.append('div').attr('class','loadingDiv');
      loadingDiv.append('img')
          .attr({
              class : 'loadingImage',
              src : STATIC_URL + 'img/cbms-img/sys-icon/loading.gif'
          });
      return loadingDiv;
  }else{
      return container.select('.loadingDiv');
  }
}
/**
* * 导航栏按钮
*/
function createNavBtn(container,url,img,title,startWidth,isOut){
  startWidth = startWidth || 45;
  var a_href = url == '#' ? '#' : '/' + LANGUAGE_CODE + '/' + url ;
  var groupA = container.append('a').attr('href',a_href).attr('class','baseTitGroupA');
  groupA.append('div').style({width : startWidth + 'px'}).append('img').attr('src',STATIC_URL + 'img/cbms-img/nav-icon/' + img + '.svg');
  groupA.append('span').attr('class','btnTips').html(title);
  var width = groupA[0][0].clientWidth;
  groupA.style('width',startWidth + 'px');
  groupA[0][0].addEventListener('mouseover',function(){groupA.transition().duration(width).ease('linear').style('width',width + 'px');});
  !isOut && groupA[0][0].addEventListener('mouseout',function(){groupA.transition().duration(width).ease('linear').style('width',startWidth + 'px');});

  return groupA;
}

var is_url_i18n = window.location.href.indexOf('/zh-cn/') != -1;
function format_i18n_url(url){
  if(!url || typeof url != 'string'){
      var url = '/';
  }
  else{
      if(url[0] != '/'){
          var url = '/' + url;
      }
      if(url.indexOf('/' + LANGUAGE_CODE + '/')  == 0 || url[0] == '.'){
          return url;
      }
  }
  if(is_url_i18n){
      var i18n_url = '/'+ LANGUAGE_CODE + url;
  }
  else{
      var i18n_url = url;
  }
  return i18n_url;
}
/**
* 弹出框函数
* @param alert_content -- 提示语
* @param flag -- 如果为true，则生成可操作弹出框，否则生成不可操作弹出框
*/
function alertWindow(alert_content,flag){
  d3.select(".alert-back-div").remove();

  var alert_back_div = d3.select("body").append("div")
      .attr("class","alert-back-div");
  var alert_div = alert_back_div.append("div")
      .attr("class","alert-div");
  //提示框的title
  var alert_title_div = alert_div.append("div")
      .attr("class","alert-title-div");
  alert_title_div.append("span")
      .attr("class","alert-title-span")
      .text("提示");
  //提示的主体部分
  alert_div.append("div")
      .attr("class","alert-body-div")
      .html(alert_content);
  //是否有操作的弹窗
  if(flag){
      //提示的尾部
      var alert_foot_div = alert_div.append("div")
          .attr("class","alert-foot-div");
      alert_foot_div.append("button")
          .attr({
              "class":"determine-btn alert-btn"
          })
          .text("确定");
      alert_foot_div.append("button")
          .attr({
              "class":"cancle-btn alert-btn"
          })
          .text("取消");
  }else{
      //title部分的关闭按钮
      alert_title_div.append("span")
          .attr({
              "class":"alert-title-img alert-btn"
          })
          .text("x");
  }
  d3.selectAll(".alert-btn").each(function(){
      this.addEventListener("click",function(){
          closeAlertWindow(this);
      },false);
  });
}
/**
* 关闭弹窗
*/
function closeAlertWindow(this_btn){
  d3.select(".alert-back-div").remove();
  return (d3.select(this_btn).text() == "确定");
}
/**
* 保存LocalStorage
* @param key
* @param value
*/
function setLocalStorage(key,value) {
  try {
      localStorage.setItem(key, value);
  } catch (e) {
      var storage_len = localStorage.length;
      for(var i=0;i<(storage_len*2/3);i++){
          localStorage.removeItem(localStorage.key(0));
      }
  }
}
/**
* 单位转换
* @param value
* @returns {string}
*/
function canvasUnit(value){
  var data_2 = "";
  if(value>=1000000000){//这里返回的是d.data，而不是d，d.data才是转换前的整数的值
      data_2 = Math.round(value/1024/1024/1024*100)/100 + "GB";
  }else if(1000000000>value && value>=1000000){
      data_2 = Math.round(value/1024/1024*100)/100 + "MB";
  }else if(1000000>value && value>1000){
      data_2 = Math.round(value/1024*100)/100 + "kb";
  }else{
      data_2 = value + "B";
  }
  return data_2;
}
/**
* 单位转换
* @param value
* @returns {string}
*/
function canvasUnit_net(value){
  var data_2 = "";
  if (value>=1000000000000){
      data_2 = Math.round(value/1024/1024/1024/1024*100)/100 + "TiB";
  }else if(1000000000000>=value && value>=1000000000){//这里返回的是d.data，而不是d，d.data才是转换前的整数的值
      data_2 = Math.round(value/1024/1024/1024*100)/100 + "GiB";
  }else if(1000000000>value && value>=1000000){
      data_2 = Math.round(value/1024/1024*100)/100 + "MiB";
  }else if(1000000>value && value>1000){
      data_2 = Math.round(value/1024*100)/100 + "Kib";
  }else{
      data_2 = value + "b";
  }
  return data_2;
}
/**
* tips函数
* @param d3Elem d3元素
* @param msg 信息
* @param direction 方向
* @param hideFlag 为true则默认隐藏
* @param delessFlag 为true则无法删除
*/
function show_msgs(d3Elem,msg,direction,hideFlag,delessFlag,time) {
  if(!d3Elem[0][0])return;
  var t_d = 8;//定义顶部tips的三角型高度
  var r_d = 6;//定义右部tips的三角形宽度
  var font_size = "12px";//定义tips大小
  var border_width_t = (t_d+3)+"px "+(t_d)+"px 0";
  var border_width_t2 = (t_d+2)+"px "+(t_d - 1)+"px 0";
  var border_width_r = r_d+"px "+(r_d+3)+"px "+(r_d)+"px 0";
  var border_width_r2 = (r_d-1)+"px "+(r_d + 2)+"px "+(r_d-1)+"px 0";
  d3Elem.property("tips") && d3Elem.property("tips").remove();
  d3Elem.property("tipinputfun")&&d3Elem[0][0].removeEventListener("input", d3Elem.property("tipinputfun"));
  d3Elem.attr("data-msg", true);

  var clientRect = d3Elem[0][0].getBoundingClientRect();
  var d3ElemTop = clientRect.top;
  var d3ElemLeft = clientRect.left;
  var d3ElemWidth = clientRect.width;
  var d3ElemMiddle = d3ElemLeft+d3ElemWidth/2;//元素的竖直平分线距左距离
  //var pops_style = {};//后面需要使用的tips样式对象
  var pops = d3.select("body").append("div")
      .attr({
          class : 'msgTipsDiv'
      })
      .style({
          position: "fixed",
          "z-index": 99999,
          'word-wrap': 'break-word',
          'word-break': 'break-all',
          'color': '#fff',
      });
  var popsContent = pops.append("div").attr("class", "msgTip").style({
      padding: "3px",
      border: "1px solid #446E86",
      "border-radius": "2px",
      background: "#18415F",
      "box-sizing": "content-box",
      "font-size":font_size
  });
  var triAngle1 = pops.append("div").style({
      width:0,
      height:0,
      position:"absolute",
      "border-style":"solid",
      "border-color":"transparent"
  });
  var triAngle2 = pops.append("div").style({
      width:0,
      height:0,
      position:"absolute",
      "border-style":"solid",
      "border-color":"transparent"
  });
  d3Elem.property("tips",pops);//将该tips绑定在元素上
  popsContent.html(msg);//先将数据填入其中得到tips实体
  var pops_width = popsContent.property("offsetWidth");//获得tips实体的宽度
  var pops_height = popsContent.property("offsetHeight");//获得tips实体的高度
  var tips_left,tips_top;
  var tri_left,tri_top;
  if(direction == "top"){
      tips_left = d3ElemMiddle-pops_width/2;
      tips_top = d3ElemTop - t_d - pops_height;
      tri_left = pops_width/2 - t_d;
      tri_top = pops_height;
      triAngle1.style("border-width",border_width_t+"px");
      triAngle2.style("border-width",border_width_t2+"px");
      triAngle1.style("border-top-color","#446E86");
      triAngle2.style("border-top-color","#18415F");
      triAngle2.style("left",(tri_left+1)+"px");
      triAngle2.style("top",(tri_top-1)+"px");
      triAngle1.style("left",(tri_left)+"px");
      triAngle1.style("top",(tri_top-1)+"px");
  }
  else if(direction == "right"){
      tips_top = d3ElemTop;
      tips_left = d3ElemLeft+r_d+d3ElemWidth + 2;
      tri_top = pops_height/2 - r_d;
      tri_left = -r_d;
      triAngle1.style("border-width",border_width_r+"px");
      triAngle2.style("border-width",border_width_r2+"px");
      triAngle1.style("border-right-color","#446E86");
      triAngle2.style("border-right-color","#18415F");
      triAngle2.style("left",(tri_left-0.5)+"px");
      triAngle2.style("top",(tri_top+1)+"px");
      triAngle1.style("left",(tri_left-2)+"px");
      triAngle1.style("top",(tri_top)+"px");
  }
  pops.style("left",(tips_left <= 0 ? 10 : tips_left)+"px");
  pops.style("top",tips_top+"px");

  var disapear = function () {
      pops.style("display", "none");
  };
  var disp = window.setTimeout(disapear, 700);
  d3Elem.on("mouseover", function () {
      clientRect = d3Elem[0][0].getBoundingClientRect();
      d3ElemTop = clientRect.top;
      d3ElemLeft = clientRect.left;
      d3ElemWidth = clientRect.width;
      d3ElemMiddle = d3ElemLeft+d3ElemWidth/2;//元素的竖直平分线距左距离
      if(direction == "top"){
          tips_left = d3ElemMiddle-pops_width/2;
          tips_top = d3ElemTop - t_d - pops_height;
          tri_left = pops_width/2 - t_d;
          tri_top = pops_height;
          triAngle1.style("border-width",border_width_t);
          triAngle2.style("border-width",border_width_t2);
          triAngle1.style("border-top-color","#446E86");
          triAngle2.style("border-top-color","#18415F");
          triAngle2.style("left",(tri_left+1)+"px");
          triAngle2.style("top",(tri_top-1)+"px");
          triAngle1.style("left",(tri_left)+"px");
          triAngle1.style("top",(tri_top-1)+"px");
      }
      else if(direction == "right"){
          tips_top = d3ElemTop;
          tips_left = d3ElemLeft+r_d+d3ElemWidth+2;
          tri_top = pops_height/2 - r_d;
          tri_left = -r_d;
          triAngle1.style("border-width",border_width_r);
          triAngle2.style("border-width",border_width_r2);
          triAngle1.style("border-right-color","#446E86");
          triAngle2.style("border-right-color","#18415F");
          triAngle2.style("left",(tri_left-0.5)+"px");
          triAngle2.style("top",(tri_top+1)+"px");
          triAngle1.style("left",(tri_left-2)+"px");
          triAngle1.style("top",(tri_top)+"px");
      }
      pops.style("left",(tips_left <= 0 ? 10 : tips_left)+"px");
      pops.style("top",tips_top+"px");
      window.clearTimeout(disp);
      pops.style("display", "block");
      d3Elem.on("mouseleave",function () {
         disapear();
      });
  });
  if (d3Elem.property("nodeName") == "INPUT"&&!delessFlag) {
      d3Elem[0][0].tipinputfun = funInput;//将该tips绑定在元素上
      d3Elem[0][0].addEventListener("input", funInput);
  }
  if(hideFlag){
      pops.style("display","none");
  }else{
      pops.style("display","block");
  }
  if(time){
      setTimeout(function () {
          pops.remove();
      },time);
  }
  function funInput() {
      if (d3Elem.property("value").length > 0)pops.remove();
  }
  return pops;
}
/**
* 点击滑块时的动画函数。
*/
function javaFileSlide(flag){
  if(!d3.select(".javafile-on").empty() && d3.select(".javafile-on").style('opacity') == 1){
      d3.select(".javafile-a")
          .interrupt()
          .transition()
          .style({
              "left":function(){
                  return flag ? '-37px' : '-32px';
              },
              "background":"#8F8F8F"
          })
          .duration(600)
          .each('start',function(){
              d3.select(".javafile-off").transition().duration(600).style('opacity',1);
              d3.select(".javafile-on").style('opacity',0);
          })
          .each('end',function(){
              d3.select(".javafile-span").attr("name","off");
          });
      return 0;
  }else{
      d3.select(".javafile-a")
          .interrupt()
          .transition()
          .style({
              "left":"0px",
              "background":"#10EDE6"
          })
          .duration(600)
          .each('start',function(){
              d3.select(".javafile-on").transition().duration(600).style('opacity',1);
              d3.select(".javafile-off").style('opacity',0);
          }).each('end',function(){
              d3.select(".javafile-span").attr("name","on");
          });
      return 1;
  }
}
/**
* 获取当前时间
* @param flag
* @returns {*}
*/
function get_common_time(flag){
  var explorer =navigator.userAgent ;
  var html_time = d3.select('#sys_time').text();
  if(flag){
      var server_date = html_time.split(" ")[0].split("-").join("/");
      var server_hour = parseInt(html_time.split(" ")[1].split(":")[0]);
      var server_minu = parseInt(html_time.split(" ")[1].split(":")[1]);
      return {
          server_date:server_date,
          server_hour:server_hour,
          server_minu:server_minu
      };
  }else{
      if(explorer.indexOf("Firefox") >= 0){//判断是否是火狐浏览器
          var html_time_m = html_time.replace(" ","T");
          return (new Date(html_time_m)).getTime()/1000;
      }else{
          return (new Date(html_time)).getTime()/1000;
      }
  }
}
/**
* 获取服务器时间
* @param isTimestamp
* @returns {*}
*/
function getServerTime(isTimestamp){
  //先声明一个异步请求对象
  var xmlHttpReg = null;
  if (window.ActiveXObject) {//如果是IE
      xmlHttpReg = new ActiveXObject("Microsoft.XMLHTTP");
  } else if (window.XMLHttpRequest) {
      xmlHttpReg = new XMLHttpRequest(); //实例化一个xmlHttpReg
  }

  //如果实例化成功,就调用open()方法,就开始准备向服务器发送请求
  if (xmlHttpReg != null) {
    if(LANGUAGE_CODE === undefined) var LANGUAGE_CODE = "zh-cn";
      xmlHttpReg.open('get', "/"+LANGUAGE_CODE+"/systime", false);
      xmlHttpReg.send(null);
      xmlHttpReg.onreadystatechange = doResult(); //设置回调函数
  }
  //回调函数
  //一旦readyState的值改变,将会调用这个函数,readyState=4表示完成相应

  //设定函数doResult()
  function doResult() {
      if (xmlHttpReg.readyState == 4) {//4代表执行完成
          if (xmlHttpReg.status == 200) {//200代表执行成功
              //将xmlHttpReg.responseText的值赋给ID为resText的元素
          }
      }
  }
  return isTimestamp ? new Date(JSON.parse(xmlHttpReg.responseText).data.systime).getTime() / 1000 : JSON.parse(xmlHttpReg.responseText).data.systime;
}
/**
* 设置保存按钮是否可用的方法
* @param eventsource -- 事件源，及包含表单里面所有的input元素的父元素
* @param btn -- 保存按钮本身
*/
function setSubmitBtn(eventsource,btnArr){
  if("\v"=="v") {//判断当前是否使用的是ie浏览器，暂时不考虑IE
      eventsource.selectAll("input").onpropertychange = function(){
          // console.log("ahha");
      };
  }else{
      eventsource.selectAll("input[type = text],input[type = password]")[0].forEach(function(d,i){
          d.addEventListener("input",function(){
              btnArr.forEach(function(node,key){
                  node.classed("disabled_a",false);
                  node[0][0].removeAttribute("disabled");
              })
          });
      });
      eventsource.selectAll("input[type = checkbox]").on("change",function(){
          btnArr.forEach(function(node,key){
              node.classed("disabled_a",false);
              node[0][0].removeAttribute("disabled");
          });
          //btn.classed("disabled_a",false);
          //btn[0][0].removeAttribute("disabled");
          //btn[0][0].removeAttribute("disabled");
      });
      eventsource.selectAll("select")[0].forEach(function(d,i){
          d.addEventListener("change",function(){
              btnArr.forEach(function(node,key){
                  node.classed("disabled_a",false);
                  node[0][0].removeAttribute("disabled");
              });
              //btn.classed("disabled_a",false);
              //btn[0][0].removeAttribute("disabled");
              //btn[0][0].removeAttribute("disabled");
          })
      })
  }
}
/**
* 取得想要的时间格式，
* @param html_time -- 时间参数，如果是时间戳，将转换成标准的时间格式：2016-12-3 12:21:10，否则将标准的时间格式转换成时间戳
* @returns {string} -- 返回的时间
*/
function getWantTime(html_time){
  var time_ts = "";
  var explorer =navigator.userAgent ;
  if(html_time.split(" ").length > 1){//将标准格式时间转换成时间戳
      if(explorer.indexOf("Firefox") >= 0){//判断是否是火狐浏览器
          var html_time_m = html_time.replace(" ","T");
          time_ts = new Date(html_time_m).getTime()/1000;
      }else{
          time_ts = new Date(html_time).getTime()/1000;
      }
  }else{//将时间戳时间转换成标准格式时间
      time_ts = ts2str(html_time);
  }
  return time_ts;
}

function indexBtnList(){
  var indexBtnList = d3.select('#tit_div').append('ul').attr('class','indexBtnList indexInputHide');
  var indexList = [{name:'系统设置',href:'/accounts/accountindex/',img:'sysConfig'},
      {name:'网路侦测',href:'/spd/spdindex/',img:'spdindex'},
      {name:'注销',href:'/accounts/logout/',img:'logout'}];
  for(var i = 0,len = indexList.length;i < len;i++ ) {
      var li = indexBtnList.append('li').append('a').attr('href', '/' + LANGUAGE_CODE + indexList[i].href);
      li.append('img').attr('src', STATIC_URL + 'img/cbms-img/nav-icon/' + indexList[i].img + '.svg');
      li.append('span').html(indexList[i].name);
  }

  var startWidth = 26;
  var endWidth = 65;
  var indexMore = d3.select('.indexMore');
  var group =  d3.select(indexMore[0][0].parentNode);
  indexMore[0][0].addEventListener('click',function(){
      indexBtnList.classed('indexInputHide',!indexBtnList.classed('indexInputHide'));
      group.classed('titBtnGroupClick',!group.classed('titBtnGroupClick'));
      cancel_bubble();
      indexBtnList[0][0].addEventListener('click',function(){cancel_bubble();});
      document.onclick = function() {
          indexMore.transition().duration(endWidth).ease('linear').style('width',startWidth + 'px');
          indexBtnList.classed('indexInputHide',true);
          group.classed('titBtnGroupClick',false);
      };
  });
  indexMore[0][0].addEventListener('mouseout',function(){
      !group.classed('titBtnGroupClick') && indexMore.transition().duration(endWidth).ease('linear').style('width',startWidth + 'px');
  });
}
/**
* 生成随机id
* @param n
* @returns {string}
*/
function randomID(n) {
  var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
  var res = "_";
  for(var i = 0; i < n ; i ++) {
      var id = Math.ceil(Math.random()*35);
      res += chars[id];
  }
  return res;
}
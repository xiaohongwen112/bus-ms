<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import 'iview/dist/styles/iview.css';
import '@/assets/css/tooltip.scss';

export default {
  name: 'app',
};
</script>

<style lang="scss">
@import url(../../assets/bootstrap/bootstrap.min.css);
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  margin: 0;
  padding: 0;
}

body {
  width: 100%;
  height: 100%;
  font-size: 14px;
  font-family: "Noto Sans S Chinese", "SourceHanSansCN-Normal", sans-serif !important;
  /*background: #000000;*/
  color: white;
  margin: 0;
  padding: 0;
}

a {
  text-decoration: none;
  cursor: pointer;
}

a:hover {
  text-decoration: none;
}

ul li {
  list-style: none;
}

form {
  margin: 0;
  padding: 0;
}

select {
  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;
  line-height: 22px;
  background: url(../../assets/sys-icon/arrow-w.svg) no-repeat calc(100% - 5px) 0% rgb(10, 31, 48) !important;
  padding-right: 18px;
}
.title{
  font-size: 18px;
  margin: 0 5px;
}
.title-blue{
  color: #3dd9c4;
}
.title-small{
  font-size: 16px;
  margin: 0 5px;
}
.title-icon, .title-icon-small{
  display: inline-block;
  background: linear-gradient(left, #22726F, #3AB9B3);
  background: -webkit-gradient(linear, left top, right top, from(#22726F), to(#3AB9B3));
  filter: progid:DXImageTransform.Microsoft.gradient(GradientType = 1, startColorstr = #22726F, endColorstr = #3AB9B3);
}
.title-icon{
  width: 10px;
  height: 14px;
}

.click-btn{
  outline: none;
  display: inline-block;
  height: 28px;
  line-height: 28px;
  padding: 0 18px; 
  border-radius: 4px;
  border: 1px solid #3dd9c4;
  background: #3dd9c4;
  color: #081928;
  text-align: center;
  cursor: pointer;
  &:hover{
    color: #fff;
  }
}
.add-icon{
  height: 28px;
  width: 28px;
  line-height: 28px;
  padding: 0;
  font-style: normal;
}
.title-icon-small{
  width: 8px;
  height: 12px;
}
.triangle-icon{
  font-style: normal;
  transition: transform 100ms;
  font-size: 12px;
  color: #38BBB4;
  display: inline-block;
  cursor: pointer;
}
.triangle-spread{
  transform: rotate(90deg);
  transition: rotate 0.5s;
}
// 共用样式
.cm-border{
  box-sizing: border-box;
  border: 1px solid #0c3755;
}
.cm-high-bg{
  margin: 2px;
  background: #15334a;
  border-radius: 3px;
  -webkit-box-shadow: 0 0 15px #43fbd5;
  box-shadow: 0 0 15px #43fbd5;
}
.cm-ellipsis{
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: -8px;
}
.inblock{
  display: inline-block;
}
.breadcrumb-div .breadcrumb-right{
  position: inherit !important;
}
.cm-input, .cm-selct{
  margin: 0 8px;
  padding: 0 8px;
  border: 1px solid #0e3a5a;
  height: 30px;
  line-height: 30px;
  border-radius: 3px;
  background: none;
  font-size: 16px;
  text-align: center;
  width: 70px;
  color: #eee;
}
.cm-border-tip.cm-high-bg, .cm-border-tip .cm-high-bg{
  box-shadow: 0 0 15px #f96060;
}
.biz-week{
  vertical-align: -8px;
}
.alert-swtich{
  vertical-align: -7px;
}

// 时间选择器
.start-time, .end-time{
  .ivu-input-icon{
    display: none;
  }
}
.ivu-date-picker-transfer{
  .ivu-picker-panel-content .ivu-time-picker-cells-list ul li{
    padding: 0;
    text-align: center;
  }
}
// 添加ip+监控列表
.col-moni-name,.col-addr{
  width: calc(50% - 100px);
}

</style>

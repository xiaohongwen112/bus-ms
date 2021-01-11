<template>
  <div id="app">
    <NavBar :title="'协议配置'" />
    <div class="protocol-div">
    <router-view></router-view>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/common/NavBar';

export default {
  name: 'app',
  components: {
    NavBar,
  },
  data() {
    return {};
  },
  mounted() {},
};
</script>

<style lang="scss">
@import url(../../assets/bootstrap/bootstrap.min.css);
#app {
  .protocol-div{
    height: 20000px;
  }
  input[type="radio"]{
    height: 14px;
    vertical-align: middle;
    width: 14px;
    border: 1px solid #278c89;
    border-radius: 3px;
    margin: 0 4px;
    -webkit-appearance: none;
    outline: none;
    cursor: pointer;
    margin-bottom: 2px;
    &:checked{
      background: #139d8c url(../../assets/common/checked.svg) 1px center;
      background-size: 180% 180%;
      background-position-x: -4.5px;
    }
  }
  input[type="checkbox"]{
    height: 14px;
    vertical-align: middle;
    width: 14px;
    border: 1px solid #278c89;
    border-radius: 3px;
    margin: 0 4px;
    -webkit-appearance: none;
    outline: none;
    cursor: pointer;
    margin-bottom: 2px;
    &:checked{
      background: #139d8c url(../../assets/common/checked.svg) 1px center;
      background-size: 180% 180%;
      background-position-x: -4.5px;
    }
  }
  overflow: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  .pro-name-tip{
      display: inline-block;
      width: 10px;
      height: 14px;
      background: -webkit-gradient(linear,left top,right top,from(#22726f),to(#3ab9b3));
      background: gradient(linear,left top,right top,from(#22726f),to(#3ab9b3));
      margin-left: 7px;
    }
    .pro-name-title{
      color: #13c6eb;
      font-size: 16px;
      margin-left: 10px;
    }
    .nav-tit{
      padding-left: 16px;
    }
    .cm-btn{
      margin: 0 2px;
    }
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

.operation{
  a{
    color: #4ab2a5;
  }
  span{
    color: #4ab2a5;
  }
  .delete{                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
    color: #d04631;
  }
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
.manage-div {
    position: absolute;
    top: 44px;
    bottom: 0;
    left: 0;
    width: 100%;
    /* border: 1px solid red; */
    overflow-y: hidden;
    overflow-x: hidden;
    background: #08111a;
}

select::-webkit-scrollbar-track-piece {
	background-color:#383e41;
	border-left:1px solid #333;
	border-radius: 10px;
}
select::-webkit-scrollbar {
	width:5px;
	height:13px;
	border-radius: 10px;
}
select::-webkit-scrollbar-thumb {
	background-color:#90a0a8;
	background-clip:padding-box;
	border:1px solid #999;
	min-height:28px;
}
select::-webkit-scrollbar-thumb:hover {
	border:1px solid #636363;
	background-color:#929292;
}
</style>

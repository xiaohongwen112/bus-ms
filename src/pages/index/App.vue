<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
};
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: url(../../assets/index/index-bg.png) repeat;
  position: absolute;
  top:0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #08141b;
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

</style>

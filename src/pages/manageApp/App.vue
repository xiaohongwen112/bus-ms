<template>
  <div id="app">
    <NavBar :title="'manageapp'" />
    <div class="manage-div">
    <router-view></router-view>
    </div>
   <div id="alertContent"></div>
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

<style>
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
</style>

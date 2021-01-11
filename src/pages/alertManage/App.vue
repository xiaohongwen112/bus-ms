<template>
  <div id="app">
    <NavBar :title="'alertmanage'" />
    <Tabs class="auth-tabs" :list="alertNavList" :active="navActiveIndex"
      @click="toggleNavActive"/>
    <keep-alive>
      <router-view class="container"></router-view>
    </keep-alive>
  </div>
</template>

<script>
import _ from 'lodash';
import NavBar from '@/components/common/NavBar';
import { Tabs } from '@/components/basic/index';
import { alertNavList } from './utils';

export default {
  name: 'app',
  components: {
    NavBar,
    Tabs,
  },
  data() {
    return {
      alertNavList,
      navActiveIndex: 0,
    };
  },
  methods: {
    toggleNavActive(data) {
      // console.log(data.data.key);
      this.navActiveIndex = data.index;
      this.$router.push({ name: data.data.key });
    },
  },
  mounted() {
    // console.log(this.$route.name);
    // if (!['超级管理员', '二级管理员'].includes(this.session$.rolename)) {
    //   this.alertNavList = [this.alertNavList[3]];
    //   this.$router.push({ name: this.alertNavList[0].key });
    // }
    // 容错
    this.navActiveIndex = _.findIndex(this.alertNavList, { key: this.$route.name });
    if (this.navActiveIndex === -1) {
      this.navActiveIndex = 0;
    }
  },
};
</script>

<style lang="scss">
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
  color: #f3f3f3;
  margin: 0;
  padding: 0;
  background-color: #09131C;
}

select {
    appearance: none;
    -moz-appearance: none;
    -webkit-appearance: none;
    line-height: 22px;
    background: url(../../assets/sys-icon/arrow-w.svg) no-repeat calc(100% - 5px) 0% rgb(10, 31, 48) !important;
    padding-right: 18px;
  }

// input-number
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
  margin: 0;
}
.add-icon{
  display: inline-block;
  width: 15px;
  height: 15px;
  vertical-align: middle;
  margin: 0 5px 3px 0;
  background: url(../../assets/common/add.svg) no-repeat center;
}
.operation{
  color: #4ab2a5;
  .delete{                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
    color: #d04631;
  }
}
input, select{
  color: #fff;
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

.auth-tabs{
  margin-top: 15px;
  position: absolute;
  z-index: 0;
}

.container {
  position: absolute;
  top: 105px;
  bottom: 0;
  left: 15px;
  right: 10px;
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

.proImg {
    position: relative;
    font-size: 18px;
    color: #14cef5;
    vertical-align: middle;
    &:before {
      content: '';
      background: url("../../assets/common/tag.png") 0 0 no-repeat;
      position: absolute;
      left: 0;
      top: 6px;
      width: 10px;
      height: 12px;
    }
  }

.title{
  position: relative;
  display: inline-block;
  vertical-align: middle;
  font-size: 14px;
  color: #ddd;
  line-height: 30px;
  text-align: right;
  &.required:after {
    content: '*';
    position: absolute;
    left: -15px;
    top: 2px;
    color: red;
  }
}

// 通用顶部操作按钮+条件查询+表格布局+表格操作++表格底部翻页

.header{
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
}
.domain-table{
  // margin: 30px;
  position: absolute;
  top: 40px;
  bottom: 50px;
  width: 100%;
  // width: 1200px;
  // height: 200px;
}
.footer{
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 50px;
  line-height: 50px;
  .record-number{
    color: #4ab2a5;
  }
}

.add-icon{
  display: inline-block;
  width: 15px;
  height: 15px;
  vertical-align: middle;
  margin: 0 5px 3px 0;
  background: url(../../assets/common/add.svg) no-repeat center;
}
.operation{
  color: #4ab2a5;
  .delete{                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
    color: #d04631;
  }
  .delete-enable{
    color: rgb(84, 84, 84);
    cursor: default;
  }
}

// end 通用顶部操作按钮+条件查询+表格布局+表格操作++表格底部翻页

</style>

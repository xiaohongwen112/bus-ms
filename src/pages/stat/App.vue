<template>
  <div id="app">
    <div class="main-title">
      <NavBar :title="`统计中心`" 
        :appName="appId"
        ></NavBar>
    </div>
    <Breadcrumb class="bread-crumb" :title="`统计中心`" :crumbList="crumbList">
      <div slot="btnGroup" class="bread-right">
        <NavSelect class="nav-select" :select="`服务器IP`" :options="dstIpList"></NavSelect>
        <NavSelect class="nav-select" :select="`交易`" :options="levelList"></NavSelect>
      </div>
    </Breadcrumb>
    <div class="stat-content-div">
      <div class="stat-left-side">
        <StatTabs></StatTabs>
      </div>
      <div class="stat-right-side">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script>
import NavBar from '@/components/common/NavBar';
import Breadcrumb from '@/components/common/Breadcrumb';
import NavSelect from '@/components/stat/NavSelect';
import StatTabs from '@/components/stat/StatTabs';
import { mapState } from 'vuex';

import '@/assets/css/cb.scss';
import '@/assets/css/itable.scss';
import '@/assets/css/iconbms.css';
import '@/assets/css/tooltip.scss';

export default {
  name: 'app',
  components: {
    NavBar,
    Breadcrumb,
    NavSelect,
    StatTabs,
  },
  computed: {
    ...mapState({
      appId: state => state.appId,
      appName: state => state.appName,
      intfName: state => state.intfName,
      dispName: state => state.dispName,
      desc: state => state.desc,
      levelList: state => state.levelList,
      dstIpList: state => state.dstIpList,
      currentIp: state => state.currentIp,
    }),
    crumbList() {
      const ip = this.currentIp === '' ? '' : `-${this.currentIp}`;
      return ['index', 'manageapp', `${this.appName}-${this.intfName}${ip} ${this.currentIp.length === 0 ? '统计中心' : '单台服务器视图'}`];
    },
  },
  mounted() {
    this.$store.dispatch('getJson');
  },
};
</script>
<style lang="scss"  scoped>
  .bread-crumb{
    position: absolute;
    top: 45px;
    left: 0;
  }
  .stat-content-div {
    position: absolute;
    top: 95px;
    bottom:0;
    left:0;
    right: 0;
    text-align: center;
    border-top: solid 1px #071b2d;
  }
  .stat-left-side {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 10px;
    width: 108px;
    border-right: solid 1px #071b2d;
    .scroll-area{
      width: 100%;
      height: 100%;
    }
  }
  .stat-right-side{
    position: absolute;
    top: 1px;
    bottom: 0;
    left: 119px;
    right: 0;
    height: auto;
    color: #BEE2EB;
  }
  .bread-right{
    height: 50px;
  }
  .nav-select{
    float: right;
    margin-top: 13px;
    margin-right: 40px;
  }
</style>

<template>
  <div id="app">
    <NavBar :title="'sysconfig'" />
    <div class="settings-container">
      <Tabs class="auth-tabs" :list="sysConfNavList" :active="navActiveIndex"
      @click="toggleNavActive"/>
      <Runtime @on-restart="clickRestart()"/>
      <div v-if="session$.newpermissions.system_reboot" class="restart-content"  @click="clickRestart()">重启BMS</div>
      <div class="settings-content">
        <router-view></router-view>
      </div>
    </div>
    <Cmtip :tipContent="updateMessage" v-if="showTips" :showFooter="tipFooter" :closeFn="closeFunc" :noConfirm="noConfirm"
    @on-confirm="confirmRestart" @on-cancel="cancelRestart">
    </Cmtip>
  </div>
</template>

<script>
import '@/assets/css/tooltip.scss';
import { NavBar } from '@/components/common';
import { Tabs } from '@/components/basic';
import Cmtip from '@/components/basic/CmTip/CmTip';
import { sysConfNavList } from '@/pages/settings/utils';
import _ from 'lodash';
import Runtime from './components/Runtime';
import { restartSys, statusSys, restoreSys } from './service';


export default {
  name: 'app',
  components: {
    NavBar,
    Runtime,
    Cmtip,
    Tabs,
  },
  data() {
    return {
      // settingNavList: [
      //   { key: 'status', name: '系统状态' },
      //   { key: 'log', name: '日志监控' },
      //   { key: 'alert', name: '系统告警配置' },
      //   { key: 'storage', name: '存储备份配置' },
      //   { key: 'about', name: '关于' },
      // ],
      // sysConfNavList: sysConfNavList,
      navActiveIndex: 0,
      showTips: false,
      tipFooter: true,
      showLoading: true,
      updateMessage: '',
      closeBtnflag: true,
      noConfirm: false,
    };
  },
  computed: {
    sysConfNavList() {
      const controlObj = {
        status: 'system_state_detail',
        log: 'log_monitor_detail',
        alert: 'alert_conf_detail',
        storage: 'backup_conf_detail',
      };
      const newper = this.session$.newpermissions;
      const navList = [];
      sysConfNavList.forEach((nav) => {
        if (newper[controlObj[nav.key]]) {
          navList.push(nav);
        }
      });
      navList.push(sysConfNavList[4]);
      return navList;
    },
  },
  methods: {
    toggleNavActive(data) {
      this.navActiveIndex = data.index;
      this.$router.push({ name: data.data.key });
    },
    clickRestart() {
      this.showTips = true;
      this.tipFooter = true;
      this.updateMessage = '是否重启？';
    },
    confirmRestart() {
      this.tipFooter = false;
      this.noConfirm = true;
      this.updateMessage = '正在重启bms系统...';
      this.restartSys(); // 重启系统
    },
    cancelRestart() {
      this.showTips = false;
      this.tipFooter = true;
    },
    async restartSys() {
      try {
        const res = await restartSys();
        const data = res.data.data;
        if (data.error === 0) {
          const spj = {
            sp: data.sp_info.sp,
          };
          this.getstatus(spj);
        }
      } catch (error) {
        console.log(error);
        this.showTips = false;
      }
    },
    async getstatus(spj) {
      try {
        await statusSys(spj);
        const spdata = {
          spinfo: JSON.stringify(spj),
        };
        const data = {
          sp_info: spdata.spinfo,
        };
        this.restoreSys(data);
      } catch (error) {
        console.log(error);
        setTimeout(this.getstatus(spj), 1000);
      }
    },
    async restoreSys(obj) {
      try {
        const res = await restoreSys(obj);
        if (res.data.error === 0) {
          this.showTips = true;
          this.closeBtnflag = false;
          this.noConfirm = false;
          this.updateMessage = '重启成功';
        }
      } catch (error) {
        console.log(error);
        setTimeout(this.getstatus(obj), 1000);
      }
    },
    closeFunc() {
      if (this.updateMessage === '是否重启？') {
        this.showTips = false;
      } else {
        if (this.closeBtnflag) {
          this.showTips = true;
        } else {
          window.location.reload();
        }
      }
    },
  },
  mounted() {
    const newper = this.session$.newpermissions;
    const newArr = [];
    const visNameArr = ['system_state_detail', 'log_monitor_detail', 'alert_conf_detail', 'backup_conf_detail', 'Visit_User'];
    _.forEach(this.sysConfNavList, (item, index) => {
      if (index !== 4) {
        if (newper[visNameArr[index]]) newArr.push(item);
      } else newArr.push(item);
    });
    this.sysConfNavList = newArr;
    let finalKey = this.$route.name;
    if (['cpu', 'db', 'mem', 'net', 'store', 'packet', 'process'].includes(this.$route.name)) finalKey = 'status';
    this.navActiveIndex = _.findIndex(this.sysConfNavList, { key: finalKey });
    // reset rout
    if (this.$route.path === '/status/cpu' && !_.includes(this.sysConfNavList, 'status')) {
      this.$router.push({ name: this.sysConfNavList[0].key });
      this.navActiveIndex = 0;
    }
  },
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

.settings-content {
  position: relative;
  flex: 1;
  height: calc(100% - 50px);
}

div.settings-container {
  background-color: #09131C;
  display: block;
  width: 100%;
  position: absolute;
  height: calc( 100% - 44px );
  .auth-tabs{
    display: inline-block;
    margin: 20px 0;
    nav{
      a {
        color: #fff;
      }
    }
  }
}

div.restart-content{
  width: 110px;
  height:28px;
  line-height:28px;
  position: absolute;
  top: 22px;
  right: 15px;
  border: 1px solid #45d4bd;
  border-radius: 17px;
  text-align: right;
  padding-right: 10px;
  background: url('../../assets/settings/restart.svg') 10px 3px no-repeat;
  background-size: 18%;
  cursor:pointer;
  display:none;
}
@media screen and (max-width: 1200px){
  .settings-container{
    .restart-content{
      display: block;
    }
  }
}

.clearfix{
  zoom: 1;
}
.clearfix:after{
  content: ".";
  clear: both;
  display: block;
  overflow: hidden;
  font-size: 0;
  height: 0;
}
</style>

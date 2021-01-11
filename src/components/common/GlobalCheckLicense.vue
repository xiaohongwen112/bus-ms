<template>
  <div id="global-check">
    <!-- <Cmtip :tipContent="cmtipMessage" v-if="showcmTips" :closeFn="() => showcmTips = false"
           :showFooter="showFooter">
    </Cmtip> -->
  </div>
</template>
<script>
import { checkLicenseStatus } from '@/pages/settings/service/index'; // 这是全局检测license
// import Cmtip from '@/components/basic/CmTip/CmTip';
import { setInterval, clearInterval } from 'timers';
import { Notice } from 'iview';
import 'iview/dist/styles/iview.css';

// 用于全局检查license
export default {
  data() {
    return {
      cmtipMessage: 'baocuo', // 检测license弹窗信息
      showcmTips: false,
      showFooter: false,
      timer: null, // 用于定时器
    };
  },
  // components: { Cmtip },
  methods: {
    check() { // 检测license
      checkLicenseStatus()
      .then((res) => {
        // console.log(res);
        // if (res.data.code !== -3) {
        //   }
        if (res.data.code === 0) {
          const data = res.data.data;
          data.forEach((e) => {
            if (!e.is_success) {
              if (e.err_types.type === '3') {
                Notice.warning({
                  title: e.ip,
                  desc: e.err_types.msg,
                  duration: 0,
                });
              } else {
                Notice.error({
                  title: e.ip,
                  desc: e.err_types.msg,
                  duration: 0,
                });
              }
            }
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
    },
  },
  created() {
    this.timer = setInterval(() => {
      const time = new Date();
      // console.log(`检查当前时间${time.getHours()}---${time.getMinutes()}`);
      if (time.getHours() === 9 && time.getMinutes() === 0) {
        // 每天九点触发
        this.check();
      }
    }, 60000); // 每分钟触发
    // 用于测试代码
    // setInterval(() => {
    //   this.check();
    // }, 6000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
};
</script>
<style lang="scss">
  .ivu-notice-notice{
    background-color: rgba(82, 38, 38, 0.8);
  }
  .ivu-notice-with-error{
    .ivu-notice-title, .ivu-notice-desc{
      color: #e94d51 !important;
    }
  }
  .ivu-notice-with-warning{
    .ivu-notice-title, .ivu-notice-desc{
      color: #e27f40 !important;
    }
  }
  .ivu-notice-with-error:after, .ivu-notice-with-warning:after{
    display: none !important;
  }
</style>
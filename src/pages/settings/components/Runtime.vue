<template>
  <div class="runtime">
    <div>系统正常运行时间
    <div class="time-box">
      <span>{{timeObj.firstTime}}</span>{{timeObj.firstUnit}}
      <span>{{timeObj.secondTime}}</span>{{timeObj.secondUnit}}</div>
    </div>
    <div v-if="session$.newpermissions.system_reboot" class="restart-container" @click="clickRestart()">
      <span>重启BMS</span>
    </div>
  </div>
</template>

<script>
import { getUptime } from '@/pages/settings/service';

export default {
  name: 'Runtime',
  data() {
    return {
      timer: null, // 定时器
      upTime: 0, // 运行时间，单位S
      upYear: '--', // 运行年
      upMonth: '--', // 运行月
      upDay: '--', // 运行日
      upHour: '--', // 运行小时
      timeObj: {
        firstTime: '',
        firstUnit: '',
        secondTime: '',
        secondUnit: '',
      },
    };
  },
  methods: {
    updateData() {
      const getFloor = (a, b) => (a / b ? Math.floor(a / b) : '--'); // 取整
      let duration = this.upTime;
      const oneHour = 60 * 60;
      const oneDay = 24 * oneHour;
      const oneMonth = 30 * oneDay;
      const oneYear = 365 * oneDay;
      if (duration >= oneYear) {
        this.upYear = getFloor(duration, oneYear);
        duration %= oneYear;
        this.upMonth = getFloor(duration, oneMonth);
        this.timeObj = {
          firstTime: this.upYear,
          firstUnit: '年',
          secondTime: this.upMonth,
          secondUnit: '月',
        };
        return;
      }
      if (duration < oneYear && duration >= oneMonth) {
        this.upMonth = getFloor(duration, oneMonth);
        duration %= oneMonth;
        this.upDay = getFloor(duration, oneDay);
        this.timeObj = {
          firstTime: this.upMonth,
          firstUnit: '月',
          secondTime: this.upDay,
          secondUnit: '天',
        };
        return;
      }
      this.upDay = getFloor(duration, oneDay);
      duration %= oneDay;
      this.upHour = getFloor(duration, oneHour);
      this.timeObj = {
        firstTime: this.upDay,
        firstUnit: '天',
        secondTime: this.upHour,
        secondUnit: '小时',
      };
    },
    clickRestart() {
      this.$emit('on-restart');
    },
  },
  mounted() {
    this.updateData();
    getUptime().then((res) => {
      const resData = res.data.data;
      this.upTime = resData.sys_uptime;
    });
    // 整小时，前端更新数据
    this.timer = window.setInterval(() => {
      this.upTime += 3600;
    }, 3600000);
  },
  watch: {
    upTime() {
      this.updateData();
    },
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
};
</script>

<style lang="scss" scoped>
.runtime{
  display: inline-block;
  float: right;
  margin-top: 16px;
  margin-right: 15px;
  padding: 0 14px;
  background-color: #0e2839;
  height: 40px;
  line-height: 36px;
  border-left: 2px solid #45d4bd;
  >div{
    display:inline-block;
  }
  .time-box{
    display: inline-block;
    >span{
      margin-left: 15px;
      font-size: 22px;
      font-weight: 600;
      &:nth-of-type(2){
        margin-left: 10px;
      }
    }
  }
  .restart-container{
    width: 110px;
    height: 28px;
    line-height: 28px;
    left: calc(50% - 67px);
    border: 1px solid #45d4bd;
    border-radius: 17px;
    text-align: right;
    padding-right: 10px;
    background: url(../../../assets/settings/restart.svg) 10px 3px no-repeat;
    background-size: 18%;
    cursor: pointer;
    margin: 2px 15px 0;
  }
}
@media screen and (max-width: 1200px){
  .runtime{
    display: none;
  }
}
</style>

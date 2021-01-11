<template>
  <div class="time-axis-div">
    <div class="date-div">
      <DatePicker :value="date"
                  :editable="false"
                  :options="disableTime"
                  @on-change="dateChange"
                  placement="top-start"
                  type="date"
                  format="yyyy-MM-dd"
                  placeholder="请选择时间"
      ></DatePicker>
      <div class="setting-con">
        <i class="icon-bms-tridown previous-day" @click="settingDay('pre')"></i>
        <i class="icon-bms-reset back-today" @click="backToday()"></i>
        <i class="icon-bms-tridown next-day" :class="{'next-disable': nextDisable}" @click="settingDay('next')"></i>
      </div>
    </div>
    <div class="axis-div">
      <time-axis :data="data" :hour="hour" :minute="minute" :currentTime="currentTime" :chooseTime="chooseTime" @timeChange="timeChange"></time-axis>
    </div>
  </div>
</template>
<script>
  import moment from 'moment';
  import { DatePicker } from 'iview';
  import '@/assets/css/date-picker.scss';
  import { getSysTime } from '@/pages/areaMonitor/service';
  import TimeAxis from './TimeAxis';


  export default {
    name: 'date-time-axis',
    components: {
      TimeAxis,
      DatePicker,
    },
    props: {
      data: {
        type: Object,
        default() {
          return {
            monitor_start: null,
            monitor_end: null,
            ts: 0,
            hour: [],
            minute: [],
            has_monitor: true,
          };
        },
      },
      currentTime: {
        type: String,
        default: '',
      },
      chooseTime: {
        type: [Number, String],
        default: 0,
      },
    },
    data() {
      const _this = this;
      return {
        date: '',
        dateWidth: 120,
        hour: 0,
        minute: 0,
        nextDisable: true,
        sysTime: '',
        disableTime: {
          disabledDate(date) {
            return Date.parse(date) / 1000 > moment(_this.currentTime).format('X');
          },
        },
      };
    },
    created() {
      this.initTime();
    },
    watch: {
      date(newVal) {
        if (moment(newVal).isBefore((this.sysTime === '' ? this.currentTime : this.sysTime).split(' ')[0])) this.nextDisable = false;
        else this.nextDisable = true;
      },
    },
    computed: {
      activeTime() {
        return `${this.date} ${this.hour}:${this.minute}:00`;
      },
      activeTimestamp() {
        return Date.parse(new Date(this.activeTime)) / 1000;
      },
      axisWidth() {
        return this.width - this.dateWidth;
      },
      axisHeight() {
        return this.height;
      },
    },
    methods: {
      /* eslint-disable */
      getBeforeDay(d) {
        d = new Date(d);
        d = d - 1000 * 60 * 60 * 24;
        d = new Date(d);
        const year = d.getFullYear();
        const mon = d.getMonth() + 1;
        const day = d.getDate();
        return `${year}-${mon < 10 ? (`0${mon}`) : mon}-${day < 10 ? (`0${day}`) : day}`;
      },
      getNextDay(d) {
        d = new Date(d);
        d = +d + 1000 * 60 * 60 * 24;
        d = new Date(d);
        const year = d.getFullYear();
        const mon = d.getMonth() + 1;
        const day = d.getDate();
        return `${year}-${mon < 10 ? (`0${mon}`) : mon}-${day < 10 ? (`0${day}`) : day}`;
      },
      getDate(timestamp) {
        const time = new Date(timestamp * 1000);
        const year = time.getFullYear();
        const month = time.getMonth() + 1;
        const date = time.getDate();
        return `${year}-${month}-${date}`;
      },
      getHour(timestamp) {
        return timestamp ? new Date(timestamp * 1000).getHours() : null;
      },
      getMinute(timestamp) {
        return timestamp ? new Date(timestamp * 1000).getMinutes() : null;
      },
      initTime() {
        this.date = this.getDate(this.data.ts);
        this.hour = this.getHour(this.data.ts);
        // this.minute = this.getMinute(this.data.ts);
        this.minute = this.getMinute(this.chooseTime);
      },
      dateChange(date) {
        this.date = date;
        this.hour = 0;
        this.minute = 0;
        this.emit();
      },
      timeChange({ time }) {
        const arr = time.split(':');
        this.hour = Number(arr[0]);
        this.minute = Number(arr[1]);
        this.emit();
      },
      emit() {
        this.$emit('timeChange', {
          type: 'date',
          time: this.activeTime,
          timestamp: this.activeTimestamp,
        });
      },
      resizeHandler() {
      },
      settingDay(type) {
        if (type === 'pre') this.date = this.getBeforeDay(this.date);
        if (type === 'next') this.date = this.getNextDay(this.date);
        this.hour = 0;
        this.minute = 0;
        this.emit();
      },
      backToday() {
        this.getSysTime();
      },
      async getSysTime() {
        try {
          const res = await getSysTime();
          if (res.data.code === 0) {
            const time = moment(res.data.data.systime).format('X') - 120;
            this.sysTime = moment.unix(time).format('YYYY-MM-DD HH:mm:ss');
            const timeData = this.sysTime.split(' ');
            this.date = timeData[0];
            this.hour = Number(timeData[1].split(':')[0]);
            this.minute = Number(timeData[1].split(':')[1]);
            this.emit();
          }
        } catch (e) {
          console.error(e);
        }
      },
    },
    mounted() {
      window.addEventListener('resize', this.resizeHandler);
    },
    destroy() {
      window.removeEventListener('resize', this.resizeHandler);
    },
    updated() {
      this.initTime();
    },
  };

</script>
<style lang="scss">
  .date-div{
    .ivu-date-picker{
      width: 100%;
      .ivu-input-icon-normal + .ivu-input{
        width: 100%;
        height: 28px;
        border-radius: 3px;
        padding-right: 0;
        border: 1px solid #2e6c77;
        box-shadow: 0 0 6px #2e6c77 inset;
        font-size: 14px;
      }

      .ivu-icon-ios-calendar-outline, .ivu-icon-ios-close{
        display: none;
      }
    }
  }
</style>
<style lang="scss" scoped>
  .time-axis-div{
    width: 100%;
    height: 100%;

    .date-div{
      width: 120px;
      padding: 5px 13px;
      float: left;
      height: 100%;
      .setting-con{
        display: inline-block;
        width: 100%;
        font-size: 12px;
        color: #00a8ec;
        margin-top: 5px;
        user-select: none;
        i{
          display: inline-block;
          cursor:pointer;
          user-select: none;
          &.previous-day{
            transform: rotate(90deg);
          }
          &.back-today{
            margin: 0 24px;
          }
          &.next-day{
            transform: rotate(-90deg);
          }
          &.next-disable{
            color: #333;
            pointer-events: none;
          }
        }
      }
    }

    .axis-div{
      width: calc(100% - 146px);
      height: 100%;
      float: left;
    }
  }


</style>



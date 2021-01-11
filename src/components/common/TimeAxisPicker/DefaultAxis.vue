<template>
  <div class="time-axis-default">
    <div class="now-time">{{formatTimeNow}}</div>
    <div class="axis-content">
      <div class="time-hour">
        <div v-for="(x, i) in data.hour" class="hours" :class="getLevel(x)" v-show="status(i)" ></div>
      </div>
      <div class="time-minute">
        <div v-for="(x, i) in data.minute" class="minutes" :class="getLevel(x)" v-show="status(i)"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment';

  export default {
    props: {
      data: {
        type: Object,
        default() {
          return {};
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
    computed: {
      formatTimeNow() {
        return moment.unix(this.data.ts).format('YYYY-MM-DD');
      },
      selectTime() {
        return moment.unix(this.chooseTime).format('YYYY-MM-DD HH:mm:ss');
      },
      todayFlag() {
        return this.currentTime !== '' && this.selectTime !== this.currentTime ? !moment(this.selectTime.split(' ')[0]).isBefore(this.currentTime.split(' ')[0]) : true;
      },
      currentHour() {
        return this.currentTime !== '' ? Number(this.currentTime.split(' ')[1].split(':')[0]) : 0;
      },
      currentMinutes() {
        return this.currentTime !== '' ? Number(this.currentTime.split(' ')[1].split(':')[1].split(':')[0]) : 0;
      },
    },
    methods: {
      getLevel(x) { // eslint-disable-line
        if (this.data.has_monitor && x.monitor) {
          if (x.has_located_alert) return 'level-high';
          if (x.has_alert) return 'level-middle';
          if (x.has_data) return 'level-normal';
        }
      },
      status(i) {
        let flag = true;
        if (this.todayFlag) flag = this.title === '小时' ? i <= this.currentHour : i <= this.currentMinutes; // eslint-disable-line
        return flag;
      },
    },
  };
</script>

<style lang="scss">
.time-axis-default{
  height: 100%;
  .now-time{
    display:inline-block;
    float:left;
    width: 146px;
    text-align:center;
  }
  .axis-content{
    display:inline-block;
    float:right;
    width: calc(100% - 146px);
    height:100%;
    .time-hour,.time-minute {
      width:100%;
      height:4px;
      background-color:#0d1a22;
      float: right;
      font-size: 0;
      margin: 2px 0;
      .hours,.minutes{
        display: inline-block;
        height: 2px;
        margin-top:1px;
      }
      .hours{
        width:calc(100% / 24);
      }
      .minutes{
        width:calc(100% / 60);
      }
    }
    .level-normal {
      background-color:#0fe2cc;
    }
    .level-middle {
      background-color:#fe593e;
    }
    .level-high {
      background-color:#f7331f;
    }
  }
}  
</style>
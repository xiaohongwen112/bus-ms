<template>
  <div class="per-monitor-schedule" :class="{'edit-shadow': editShadow}">
    <div class="per-schedule-tit">
      <span class="schedule-note monitor-logic-name">{{data.name}}</span>
      <span class="schedule-repeat logic-week" v-html="getWeek()"></span>
      <span class="schedule-label logic-ret-label"></span>
      <span class="schedule-text logic-ret-code"></span>
      <a class="schedule-tit-btn" @click="editBaseline">编辑</a>
      <a class="schedule-tit-btn" @click="deleteBaseine(data._id)">删除</a>
    </div>
    <div class="per-schedule-time">
      <span class="per-time-name">监控时段</span>
      <div class="time-div" :class="{'error-content': editTimeStatus}">
        <TimeScheduleAxis
          :isClear="false"
          :timeList="timeList"
          :whetherDisable="whetherDisable"
          @timeChange="timeChange"
        />
      </div>
    </div>
  </div>  
</template>

<script>
  import TimeScheduleAxis from '@/components/common/TimeScheduleAxis';

  export default {
    props: {
      data: {
        type: Object,
        default() {
          return {};
        },
      },
    },
    components: { TimeScheduleAxis },
    data() {
      return {
        whetherDisable: true,
        editShadow: false,
        editTimeStatus: false,
        weekIndex: {
          week_mon: '周一',
          week_tue: '周二',
          week_wed: '周三',
          week_thu: '周四',
          week_fri: '周五',
          week_sat: '周六',
          week_sun: '周日',
        },
        timeList: this.data.time_range,
      };
    },
    methods: {
      timeChange(data) {
        this.timeList = data.timeList;
        this.$emit('time-change', this.timeList);
      },
      editBaseline() {
        this.whetherDisable = false;
        this.editShadow = true;
        this.$emit('change-edit');
      },
      deleteBaseine(id) {
        this.$emit('on-delete', id);
      },
      getWeek() {
        let week = [];
        if (this.data.week && this.data.week.length === 7) {
          week = ['每天'];
        } else {
          this.data.week.forEach((item) => {
            week.push(this.weekIndex[item]);
          });
        }
        return week.join('&nbsp;');
      },
      changeEditStatus() {
        this.editShadow = !this.editShadow;
      },
      changeTimeStatus() {
        if (this.editTimeStatus) {
          this.editTimeStatus = false;
        } else {
          this.editTimeStatus = true;
        }
      },
      cancalEdit() {
        this.timeList = this.data.time_range;
      },
    },
  };
</script>
<style lang="scss">
.per-monitor-schedule{
  .time-div{
    .time-group{
      width:100%;
    }
  }

}
</style>
<style lang="scss" scoped>
.per-monitor-schedule {
  line-height: 84px;
  color: #efefef;
  padding: 15px 1% 5px 5%;
  &.edit-shadow {
    background: #15334a;
    border-radius: 3px;
    box-shadow: 0 0 15px #43fbd5;
    margin: 5px;
  }
  .error-content{
    border: 1px solid red !important;
	  box-shadow: 0 0 3px red;
  }
  .per-schedule-tit {
    height: 34px;
    line-height: 34px;
    margin-bottom: 10px;
    font-size: 16px;
    span{
      display:inline-block;
    }
    .monitor-logic-name {
      margin-right: 10px;
      font-size: 16px;
    }
    .schedule-note {
      color: #38bab3;
    }
    .schedule-label {
      margin: 0 5px 0 30px;
    }
    .schedule-text {
      margin: 0 20px 0 5px;
    }
    .schedule-tit-btn {
      font-style: italic;
      color: #38bab3;
      margin-right: 16px;
    }
  }
  .per-schedule-time {
    height: 71px;
    line-height: 40px;
    .per-time-name {
      display: inline-block;
      font-size: 14px;
      color: #efefef;
      margin-top: 10px;
    }
    .time-div{
      width: calc(100% - 66px);
      float: right;
      margin-left: 10px;
      border: 1px solid transparent;
    }
  }
}
</style>
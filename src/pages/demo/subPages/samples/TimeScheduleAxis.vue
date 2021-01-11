<template>
  <div class="content">
    <div class="axis-wrapper">
      <TimeAxis
        :isClear="false"
        :timeList="timeList"
        @timeChange="timeChange"
      />
    </div>  
    <div class="axis-wrapper2">
      <TimeAxis
        :isClear="false"
        :timeList="singleTimeList"
        @timeChange="singleTimeChange"
        :type="'single'"
      />
    </div>
  </div>
</template>

<script>
  import TimeAxis from '@/components/common/TimeScheduleAxis';

  export default {
    name: 'time-schedule-axis',
    components: {
      TimeAxis,
    },
    data() {
      return {
        timeList: [{ ts_start: 360, ts_end: 800 }],
        singleTimeList: [{ ts_start: 360, ts_end: 1440 }],
      };
    },
    methods: {
      timeChange(data) {
        console.log('data', data);
        this.timeList = data.timeList;
      },
      singleTimeChange(data) {
        this.singleTimeList = data.timeList;
      },
    },
  };
</script>
<style lang="scss" scoped>

.content {
  margin-top: 200px;
}

.axis-wrapper {
  width: 500px;
}

.axis-wrapper2 {
  width: 800px;
  margin-top: 200px;
}

</style>

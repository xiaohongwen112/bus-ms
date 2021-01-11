<template>
  <svg class="time-axis-svg">
    <axis :width="width"
          :height="groupHeight"
          :range="24"
          :title="`小时`"
          :data="data.hour"
          :active="activeHour"
          :monitorStart="monitorStart.hour"
          :monitorEnd="monitorEnd.hour"
          :hasFilter="false"
          :hasMonitor="hasMonitor"
          :currentTime="currentTime"
          :chooseTime="chooseTime"
          :applyTs="data.apply_ts"
          :isOverday="data.is_overday"
          @getIndex="clickHour"
    ></axis>
    <axis :width="width"
          :height="groupHeight"
          :range="60"
          :title="`分钟`"
          :data="data.minute"
          :active="activeMinute"
          :showNum="5"
          :monitorStart="minuteMonitor[0]"
          :monitorEnd="minuteMonitor[1]"
          :transform="`translate(0,${groupHeight})`"
          :hasMonitor="hasMonitor"
          :chooseTime="chooseTime"
          :currentTime="currentTime"
          :applyTs="data.apply_ts"
          :isOverday="data.is_overday"
          :monitorStartTs="data.monitor_start"
          :monitorHourEnd="data.monitor_end"
          @getIndex="clickMinute"
    ></axis>
  </svg>
</template>
<script>
  import Axis from './Axis';

  export default {
    name: 'time-axis',
    components: {
      Axis,
    },
    props: {
      hour: {
        type: Number,
      },
      minute: {
        type: Number,
      },
      currentTime: {
        type: String,
        default: '',
      },
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
      chooseTime: {
        type: [Number, String],
        default: 0,
      },
    },
    data() {
      return {
        activeHour: this.hour,
        activeMinute: this.minute,
        width: 1200,
        height: 60,
      };
    },
    created() {
      this.initTime();
    },
    watch: {
      hour() {
        this.activeHour = this.hour;
      },
      minute() {
        this.activeMinute = this.minute;
      },
      data() {
        // this.initTime();
      },
    },
    computed: {
      hasMonitor() {
        return this.data.has_monitor;
      },
      activeTime() {
        return `${this.activeHour}:${this.activeMinute}:00`;
      },
      groupHeight() {
        return this.height / 2;
      },
      monitorStart() {
        return {
          hour: this.getHour(this.data.monitor_start),
          minute: this.getMinute(this.data.monitor_start),
        };
      },
      monitorEnd() {
        let monitorEnd = {
          hour: null,
          minute: null,
        };
        if (this.data.monitor_end !== null) {
          const time = this.data.monitor_end - 60;
          monitorEnd = {
            hour: this.getHour(time),
            minute: this.getMinute(time),
          };
        }
        return monitorEnd;
      },
      minuteMonitor() {
        const start = this.activeHour === this.monitorStart.hour ? this.monitorStart.minute : 0;
        const end = this.activeHour === this.monitorEnd.hour ? this.monitorEnd.minute : 59;
        return [start, end];
      },
    },
    methods: {
      getHour(timestamp) {
        return timestamp ? new Date(timestamp * 1000).getHours() : null;
      },
      getMinute(timestamp) {
        return timestamp ? new Date(timestamp * 1000).getMinutes() : null;
      },
      initTime() {
        if (this.hour === undefined && this.minute === undefined && this.data.ts !== undefined) {
          this.activeHour = this.getHour(this.data.ts);
          this.activeMinute = this.getMinute(this.data.ts);
        }
      },
      clickHour({ i }) {
        this.activeHour = i;
        this.emit();
      },
      clickMinute({ i }) {
        this.activeMinute = i;
        this.emit();
      },
      emit() {
        this.$emit('timeChange', {
          type: 'time',
          time: this.activeTime,
        });
      },
      layout() {
        const box = this.$el.getBoundingClientRect();
        this.width = box.width;
        this.height = box.height;
      },
    },
    mounted() {
      this.layout();
      window.addEventListener('resize', this.layout);
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.layout);
    },
  };

</script>

<style lang="scss" scoped>
  .time-axis-svg{
    width: 100%;
    height: 100%;
  }
</style>



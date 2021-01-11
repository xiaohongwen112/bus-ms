<template>
  <div class="test">
    <div class="date-test">
      <date-time-axis :data="data"></date-time-axis>
    </div>
    <div class="time-test">
      <time-axis :data="data"></time-axis>
    </div>
    <div class="data-test"> <!--精简版时间轴hover显示完整时间轴-->
      <time-axis-picker :data="data"></time-axis-picker>
    </div>
  </div>

</template>

<script>
  import TimeAxisPicker from '@/components/common/TimeAxisPicker/index';
  import TimeAxis from '@/components/common/TimeAxisPicker/TimeAxis';
  import DateTimeAxis from '@/components/common/TimeAxisPicker/DateTimeAxis';

  export default {
    name: 'test-time-axis',
    components: {
      TimeAxisPicker,
      TimeAxis,
      DateTimeAxis,
    },
    data() {
      return {
        data: { monitor_end: 1523548800, hour: [{ end: 1523466000, monitor: false, has_located_alert: false, has_alert: false, start: 1523462400, finished: 'full', has_data: false }, { end: 1523469600, monitor: false, has_located_alert: false, has_alert: false, start: 1523466000, finished: 'full', has_data: false }, { end: 1523473200, monitor: false, has_located_alert: false, has_alert: false, start: 1523469600, finished: 'full', has_data: false }, { end: 1523476800, monitor: false, has_located_alert: false, has_alert: false, start: 1523473200, finished: 'full', has_data: false }, { end: 1523480400, monitor: true, has_located_alert: false, has_alert: false, start: 1523476800, finished: 'full', has_data: false }, { end: 1523484000, monitor: true, has_located_alert: false, has_alert: false, start: 1523480400, finished: 'full', has_data: false }, { end: 1523487600, monitor: true, has_located_alert: false, has_alert: false, start: 1523484000, finished: 'full', has_data: false }, { end: 1523491200, monitor: true, has_located_alert: false, has_alert: false, start: 1523487600, finished: 'full', has_data: false }, { end: 1523494800, monitor: true, has_located_alert: false, has_alert: false, start: 1523491200, finished: 'full', has_data: false }, { end: 1523498400, monitor: true, has_located_alert: false, has_alert: false, start: 1523494800, finished: 'part', has_data: false }, { end: 1523502000, monitor: true, has_located_alert: false, has_alert: false, start: 1523498400, finished: 'none', has_data: false }, { end: 1523505600, monitor: true, has_located_alert: false, has_alert: false, start: 1523502000, finished: 'none', has_data: false }, { end: 1523509200, monitor: true, has_located_alert: false, has_alert: false, start: 1523505600, finished: 'none', has_data: false }, { end: 1523512800, monitor: true, has_located_alert: false, has_alert: false, start: 1523509200, finished: 'none', has_data: false }, { end: 1523516400, monitor: true, has_located_alert: false, has_alert: false, start: 1523512800, finished: 'none', has_data: false }, { end: 1523520000, monitor: true, has_located_alert: false, has_alert: false, start: 1523516400, finished: 'none', has_data: false }, { end: 1523523600, monitor: true, has_located_alert: false, has_alert: false, start: 1523520000, finished: 'none', has_data: false }, { end: 1523527200, monitor: true, has_located_alert: false, has_alert: false, start: 1523523600, finished: 'none', has_data: false }, { end: 1523530800, monitor: true, has_located_alert: false, has_alert: false, start: 1523527200, finished: 'none', has_data: false }, { end: 1523534400, monitor: true, has_located_alert: false, has_alert: false, start: 1523530800, finished: 'none', has_data: false }, { end: 1523538000, monitor: true, has_located_alert: false, has_alert: false, start: 1523534400, finished: 'none', has_data: false }, { end: 1523541600, monitor: true, has_located_alert: false, has_alert: false, start: 1523538000, finished: 'none', has_data: false }, { end: 1523545200, monitor: true, has_located_alert: false, has_alert: false, start: 1523541600, finished: 'none', has_data: false }, { end: 1523548800, monitor: true, has_located_alert: false, has_alert: false, start: 1523545200, finished: 'none', has_data: false }], ts: 1523498280, minute: [{ end: 1523494860, monitor: true, has_located_alert: false, has_alert: false, start: 1523494800, finished: 'full', has_data: false }, { end: 1523494920, monitor: true, has_located_alert: false, has_alert: false, start: 1523494860, finished: 'full', has_data: false }, { end: 1523494980, monitor: true, has_located_alert: false, has_alert: false, start: 1523494920, finished: 'full', has_data: false }, { end: 1523495040, monitor: true, has_located_alert: false, has_alert: false, start: 1523494980, finished: 'full', has_data: false }, { end: 1523495100, monitor: true, has_located_alert: false, has_alert: false, start: 1523495040, finished: 'full', has_data: false }, { end: 1523495160, monitor: true, has_located_alert: false, has_alert: false, start: 1523495100, finished: 'full', has_data: false }, { end: 1523495220, monitor: true, has_located_alert: false, has_alert: false, start: 1523495160, finished: 'full', has_data: false }, { end: 1523495280, monitor: true, has_located_alert: false, has_alert: false, start: 1523495220, finished: 'full', has_data: false }, { end: 1523495340, monitor: true, has_located_alert: false, has_alert: false, start: 1523495280, finished: 'full', has_data: false }, { end: 1523495400, monitor: true, has_located_alert: false, has_alert: false, start: 1523495340, finished: 'full', has_data: false }, { end: 1523495460, monitor: true, has_located_alert: false, has_alert: false, start: 1523495400, finished: 'full', has_data: false }, { end: 1523495520, monitor: true, has_located_alert: false, has_alert: false, start: 1523495460, finished: 'full', has_data: false }, { end: 1523495580, monitor: true, has_located_alert: false, has_alert: false, start: 1523495520, finished: 'full', has_data: false }, { end: 1523495640, monitor: true, has_located_alert: false, has_alert: false, start: 1523495580, finished: 'full', has_data: false }, { end: 1523495700, monitor: true, has_located_alert: false, has_alert: false, start: 1523495640, finished: 'full', has_data: false }, { end: 1523495760, monitor: true, has_located_alert: false, has_alert: false, start: 1523495700, finished: 'full', has_data: false }, { end: 1523495820, monitor: true, has_located_alert: false, has_alert: false, start: 1523495760, finished: 'full', has_data: false }, { end: 1523495880, monitor: true, has_located_alert: false, has_alert: false, start: 1523495820, finished: 'full', has_data: false }, { end: 1523495940, monitor: true, has_located_alert: false, has_alert: false, start: 1523495880, finished: 'full', has_data: false }, { end: 1523496000, monitor: true, has_located_alert: false, has_alert: false, start: 1523495940, finished: 'full', has_data: false }, { end: 1523496060, monitor: true, has_located_alert: false, has_alert: false, start: 1523496000, finished: 'full', has_data: false }, { end: 1523496120, monitor: true, has_located_alert: false, has_alert: false, start: 1523496060, finished: 'full', has_data: false }, { end: 1523496180, monitor: true, has_located_alert: false, has_alert: false, start: 1523496120, finished: 'full', has_data: false }, { end: 1523496240, monitor: true, has_located_alert: false, has_alert: false, start: 1523496180, finished: 'full', has_data: false }, { end: 1523496300, monitor: true, has_located_alert: false, has_alert: false, start: 1523496240, finished: 'full', has_data: false }, { end: 1523496360, monitor: true, has_located_alert: false, has_alert: false, start: 1523496300, finished: 'full', has_data: false }, { end: 1523496420, monitor: true, has_located_alert: false, has_alert: false, start: 1523496360, finished: 'full', has_data: false }, { end: 1523496480, monitor: true, has_located_alert: false, has_alert: false, start: 1523496420, finished: 'full', has_data: false }, { end: 1523496540, monitor: true, has_located_alert: false, has_alert: false, start: 1523496480, finished: 'full', has_data: false }, { end: 1523496600, monitor: true, has_located_alert: false, has_alert: false, start: 1523496540, finished: 'full', has_data: false }, { end: 1523496660, monitor: true, has_located_alert: false, has_alert: false, start: 1523496600, finished: 'full', has_data: false }, { end: 1523496720, monitor: true, has_located_alert: false, has_alert: false, start: 1523496660, finished: 'full', has_data: false }, { end: 1523496780, monitor: true, has_located_alert: false, has_alert: false, start: 1523496720, finished: 'full', has_data: false }, { end: 1523496840, monitor: true, has_located_alert: false, has_alert: false, start: 1523496780, finished: 'full', has_data: false }, { end: 1523496900, monitor: true, has_located_alert: false, has_alert: false, start: 1523496840, finished: 'full', has_data: false }, { end: 1523496960, monitor: true, has_located_alert: false, has_alert: false, start: 1523496900, finished: 'full', has_data: false }, { end: 1523497020, monitor: true, has_located_alert: false, has_alert: false, start: 1523496960, finished: 'full', has_data: false }, { end: 1523497080, monitor: true, has_located_alert: false, has_alert: false, start: 1523497020, finished: 'full', has_data: false }, { end: 1523497140, monitor: true, has_located_alert: false, has_alert: false, start: 1523497080, finished: 'full', has_data: false }, { end: 1523497200, monitor: true, has_located_alert: false, has_alert: false, start: 1523497140, finished: 'full', has_data: false }, { end: 1523497260, monitor: true, has_located_alert: false, has_alert: false, start: 1523497200, finished: 'full', has_data: false }, { end: 1523497320, monitor: true, has_located_alert: false, has_alert: false, start: 1523497260, finished: 'full', has_data: false }, { end: 1523497380, monitor: true, has_located_alert: false, has_alert: false, start: 1523497320, finished: 'full', has_data: false }, { end: 1523497440, monitor: true, has_located_alert: false, has_alert: false, start: 1523497380, finished: 'full', has_data: false }, { end: 1523497500, monitor: true, has_located_alert: false, has_alert: false, start: 1523497440, finished: 'full', has_data: false }, { end: 1523497560, monitor: true, has_located_alert: false, has_alert: false, start: 1523497500, finished: 'full', has_data: false }, { end: 1523497620, monitor: true, has_located_alert: false, has_alert: false, start: 1523497560, finished: 'full', has_data: false }, { end: 1523497680, monitor: true, has_located_alert: false, has_alert: false, start: 1523497620, finished: 'full', has_data: false }, { end: 1523497740, monitor: true, has_located_alert: false, has_alert: false, start: 1523497680, finished: 'full', has_data: false }, { end: 1523497800, monitor: true, has_located_alert: false, has_alert: false, start: 1523497740, finished: 'full', has_data: false }, { end: 1523497860, monitor: true, has_located_alert: false, has_alert: false, start: 1523497800, finished: 'full', has_data: false }, { end: 1523497920, monitor: true, has_located_alert: false, has_alert: false, start: 1523497860, finished: 'full', has_data: false }, { end: 1523497980, monitor: true, has_located_alert: false, has_alert: false, start: 1523497920, finished: 'full', has_data: false }, { end: 1523498040, monitor: true, has_located_alert: false, has_alert: false, start: 1523497980, finished: 'full', has_data: false }, { end: 1523498100, monitor: true, has_located_alert: false, has_alert: false, start: 1523498040, finished: 'full', has_data: false }, { end: 1523498160, monitor: true, has_located_alert: false, has_alert: false, start: 1523498100, finished: 'full', has_data: false }, { end: 1523498220, monitor: true, has_located_alert: false, has_alert: false, start: 1523498160, finished: 'full', has_data: false }, { end: 1523498280, monitor: true, has_located_alert: false, has_alert: false, start: 1523498220, finished: 'full', has_data: false }, { end: 1523498340, monitor: true, has_located_alert: false, has_alert: false, start: 1523498280, finished: 'none', has_data: false }, { end: 1523498400, monitor: true, has_located_alert: false, has_alert: false, start: 1523498340, finished: 'none', has_data: false }], has_monitor: true, monitor_start: 1523478840 },
      };
    },
    mounted() {

    },
    methods: {
    },
  };
</script>
<style lang="scss" scoped>
  .test {
    position: absolute;
    top: 0;
    left:200px;
    bottom:40px;
    right: 100px;

    .date-test{
      margin-top: 250px;
      width: 100%;
      height: 60px;
    }
    .time-test{
      margin-top: 100px;
      width: 100%;
      height: 60px;
    }
    .data-test{
      margin-top: 100px;
      width: 100%;
      height: 60px;
    }
  }
</style>

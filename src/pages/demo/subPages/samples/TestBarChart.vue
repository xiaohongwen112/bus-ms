<template>
  <div class="chart-div">
    <div class="wrap">
      <BarChart
      class="demo-bar"
      :data="barData"
    ></BarChart>
    </div>
    <div class="wrap">
      <BarChart
      class="demo-bar"
      :data="[]"
    ></BarChart>
    </div>
    <div class="wrap">
      <BarChart
      class="demo-bar"
      :data="[{ label: '00', value: '19644' }, { label: '51', value: '1072' }, { label: 'null', value: '359' }, { label: '55', value: '359' }, { label: '45', value: '358' }, { label: '40', value: '179' }, { label: '75', value: '178' }]"
    ></BarChart>
    </div>
  </div>
</template>
<script>
import BarChart from '@/components/common/BarChart';

export default {
  name: 'bar-chart',
  components: {
    BarChart,
  },
  data() {
    return {
      barData: [{ label: '直接访问', value: '300' },
        { label: '邮件营销', value: '230' },
        { label: '联盟广告', value: '320' },
        { label: '视频广告', value: '145' },
        { label: '视频广告', value: '145' },
        { label: '搜索引擎', value: '600' },
        { label: '电话营销', value: '120' }],
    };
  },
};
</script>
<style lang="scss">
  .chart-div{
    position: absolute;
    top: 20px;
    left:200px;
    bottom:40px;
    right: 20px;
    background-color: #010c11;
    .wrap{
      width: 50%;
      height: 50%;
      float: left;
    }
  }
</style>
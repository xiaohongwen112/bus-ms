<template>
  <div>
    <div style="width:500px;height:500px" class="svg-div">
      <LiquidGauge
        :text="`测试`"
        :waveColor="`red`"
        :percent="0.4"
        :radius="250"
        :showGlass="true"
        :id="12"
      />
    </div>

    <div style="width:50px;height:50px" class="svg-div">
      <liquid-gauge
        :text="`测试`"
        :waveColor="`red`"
        :percent="0.4"
        :radius="25"
        :showGlass="true"
        :textSize="'12px'"
        :id="34"
      >
      </liquid-gauge>    
    </div>
    <div class="svg-div">
      <HealthGauge :value="`-1`"/>
    </div>
    <div class="svg-div">
      <HealthGauge :value="`0`"/>
    </div>
    <div class="svg-div">
      <HealthGauge :value="`30`"/>
    </div>
    <div class="svg-div">
      <HealthGauge :value="`50`"/>
    </div>
    <div class="svg-div">
      <HealthGauge :value="`70`"/>
    </div>
    <ServerGaugeDefs />
    <h6>可视化服务图--</h6>
    <div class="svg-div">
      <ServerGauge :percent="0.000" :type="`succ`" :isAlert="false"/>
    </div>
    <div class="svg-div">
      <ServerGauge :percent="40.10" :type="`resp`" :isAlert="false"/>
    </div>
    <div class="svg-div">
      <ServerGauge :percent="60.87777" :type="`succ`" :isAlert="true"/>
    </div>
  </div>

</template>

<script>

  import LiquidGauge from '@/components/common/Gauge/LiquidGauge';
  import HealthGauge from '@/components/common/Gauge/HealthGauge';
  import ServerGaugeDefs from '@/components/common/Gauge/ServerGaugeDefs';
  import ServerGauge from '@/components/common/Gauge/ServerGauge';

  export default {
    name: 'test-liquid-gauge',
    components: {
      LiquidGauge,
      HealthGauge,
      ServerGaugeDefs,
      ServerGauge,
    },
    data() {
      return {
      };
    },
    mounted() {
    },
    methods: {
    },
  };
</script>
<style scoped>
  div.main {
    position: relative;
    width: 140px;
    height: 140px;
  }

  .svg-div{
    float: left;
  }
</style>

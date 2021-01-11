<template>
  <div class="business-schedule">
    <config-box 
      :tabs="tabs"
      :width="80"
      :height="600"
      :hideStore="false"
      @closeConfig="closeBox"
      @changeNav="changeNav">
      <div slot="timeRange">
        <TimeRange ref="timeRange"></TimeRange>
      </div>
      <div slot="baselineSetting">
        <BaseLineSetting :appName="appName" ref="baseline"></BaseLineSetting>
      </div>
      <div slot="alertDaily">
        <AlertDaily ref="alertDaily"></AlertDaily>
      </div>
    </config-box>
  </div>
</template>
<script>
import configBox from '@/components/common/ConfigBox';
import { TimeRange, BaseLineSetting, AlertDaily } from './business';

export default {
  props: ['appName'],
  components: { configBox, TimeRange, BaseLineSetting, AlertDaily },
  data() {
    return {
      tabs: [
        { id: 'timeRange', text: '业务起止' },
        { id: 'baselineSetting', text: '基线配置' },
        { id: 'alertDaily', text: '告警日程' },
      ],
      baselineTime: '',
      dataPrecison: '',
      enabledBaseline: '',
    };
  },
  methods: {
    changeNav(tag) {
      this.$nextTick(() => {
        window.dispatchEvent(new Event('resize'));
      });
      if (tag.id === 'baselineSetting') {
        this.$refs.baseline.baselineDefault();
        this.$refs.baseline.baselineInit();
      }
    },
    closeBox() {
      this.$emit('closeBusinessBox');
    },
  },
};
</script>
<style lang="scss">
  .business-schedule{
    .config-container{
      ul.tabs{
        li{
          font-size: 16px;
        }
      }
    }
  }
</style>
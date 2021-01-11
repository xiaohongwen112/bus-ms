<template>
  <div class="index-alert">
    <per-alert :type="`基线告警`" :value="data.baseline_alert" :selectedAppName="selectedAppName"></per-alert>
    <per-alert :type="`健康度告警`" :value="data.health_alert" :selectedAppName="selectedAppName"></per-alert>
    <per-alert :type="`返回码告警`" :value="data.ret_code_alert" :selectedAppName="selectedAppName"></per-alert>
    <per-alert :type="`系统告警`" :value="data.system_alert" :selectedAppName="selectedAppName"></per-alert>
  </div>
</template>

<script>
  import PerAlert from './PerAlert';

  export default {
    name: 'index-alert',
    components: {
      PerAlert,
    },
    props: {
      data: {
        type: Object,
        default() {
          return {
            baseline_alert: 0,
            location_alert: 0,
            system_alert: 0,
            threshold_alert: 0,
          };
        },
      },
      selectedAppName: {
        type: String,
        isRequired: true,
      },
    },
    data() {
      return {};
    },
    watch: {},
    computed: {},
    methods: {},
  };
</script>

<style lang="scss" scoped>
  .index-alert{
    width: 100%;
    height: 76px;
    margin: 10px 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

</style>
